#!/usr/bin/env node

// 本地提示词管理服务：直接读写仓库根目录的 prompts.json。
// 无第三方依赖，只用 Node 内置模块；改动写盘后自动跑 make/validate_json.js，
// 校验失败会回滚，保证仓库里永远只有合法 JSON。
//
// 用法: node make/admin/server.js [端口]   （默认 8787）

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const PROMPTS_FILE = path.join(ROOT, 'prompts.json');
const VALIDATE_SCRIPT = path.join(ROOT, 'make', 'validate_json.js');
const IMAGES_DIR = path.join(ROOT, 'images');
const STATE_FILE = path.join(__dirname, '.state.json');
const UI_FILE = path.join(__dirname, 'index.html');
const PORT = Number(process.argv[2] || process.env.PORT || 8787);

const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/zhbjerry/prompts@main/';
const OWN_SOURCE_IDS = ['banana-prompt-quicker'];
const SOURCE_HOMEPAGES = {
    'banana-prompt-quicker': 'https://github.com/zhbjerry/prompts',
    'freestylefly-gpt-image-2': 'https://github.com/freestylefly/awesome-gpt-image-2',
    'moosl-awesome-gpt-image-2-prompts': 'https://github.com/moosl/awsome-gpt-image-2-prompts',
    'open-design': 'https://github.com/nexu-io/open-design',
    'awesome-gpt-image2-prompts': 'https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts'
};
const SOURCE_BUCKETS = {
    'banana-prompt-quicker': 'images',
    'freestylefly-gpt-image-2': 'images',
    'moosl-awesome-gpt-image-2-prompts': 'images',
    'open-design': 'images',
    'awesome-gpt-image2-prompts': 'images'
};
const RECORD_KEYS = [
    'id', 'sourceId', 'title', 'titleEn', 'prompt', 'description', 'coverUrl',
    'referenceImageUrls', 'tags', 'author', 'sourceUrl', 'createdAt',
    'mediaType', 'imageMode', 'imageModel', 'needsRef', 'sourceItemId'
];

// ---------- 记录规范化（PROMPT_RECORD_FORMAT.md 第 3 节） ----------

const collapse = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
const multiline = (v) => String(v == null ? '' : v)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '');
const httpUrl = (v) => {
    const s = collapse(v);
    return /^https?:\/\/\S+$/.test(s) ? s : '';
};
const uniq = (arr, map = (x) => x) => {
    const out = [];
    for (const raw of Array.isArray(arr) ? arr : []) {
        const value = map(raw);
        if (value && !out.includes(value)) out.push(value);
    }
    return out;
};

const digest = (n) => crypto.createHash('sha256').update(String(n)).digest('hex').slice(0, 16);
const makeId = (sourceId, sourceItemId) => `${sourceId}:${digest(sourceItemId)}`;

function buildRecord(input, sourceItemId) {
    const sourceId = collapse(input.sourceId);
    return {
        id: makeId(sourceId, sourceItemId),
        sourceId,
        title: collapse(input.title),
        titleEn: collapse(input.titleEn),
        prompt: multiline(input.prompt),
        description: multiline(input.description),
        coverUrl: httpUrl(input.coverUrl),
        referenceImageUrls: uniq(input.referenceImageUrls, httpUrl),
        tags: uniq(input.tags, collapse),
        author: collapse(input.author),
        sourceUrl: httpUrl(input.sourceUrl) || SOURCE_HOMEPAGES[sourceId] || '',
        createdAt: collapse(input.createdAt),
        mediaType: collapse(input.mediaType),
        imageMode: collapse(input.imageMode),
        imageModel: collapse(input.imageModel),
        needsRef: input.needsRef === true || input.needsRef === 'true',
        sourceItemId
    };
}

// ---------- 内存状态 ----------

const state = { records: [], nextOwnItemId: 1 };

function readStateFile() {
    try {
        const raw = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        return Number.isInteger(raw.nextOwnItemId) && raw.nextOwnItemId > 0 ? raw.nextOwnItemId : 1;
    } catch (e) {
        return 1;
    }
}

function maxOwnItemId(records) {
    return records.reduce((max, r) => (OWN_SOURCE_IDS.includes(r.sourceId) && Number.isInteger(r.sourceItemId) && r.sourceItemId > max ? r.sourceItemId : max), 0);
}

function reload() {
    state.records = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
    state.nextOwnItemId = Math.max(readStateFile(), maxOwnItemId(state.records) + 1);
    return state.records.length;
}

function persistNextOwnItemId() {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify({ nextOwnItemId: state.nextOwnItemId }, null, 2) + '\n');
    } catch (e) {
        // 记不住序号不影响本次写入；下次启动会回落到 max+1
    }
}

function ownBlockEnd() {
    let i = 0;
    while (i < state.records.length && OWN_SOURCE_IDS.includes(state.records[i].sourceId)) i += 1;
    return i;
}

function validatePromptsFile() {
    execFileSync(process.execPath, [VALIDATE_SCRIPT, 'prompts.json'], { cwd: ROOT, stdio: 'pipe' });
}

// 写盘 + 校验 + 失败回滚
function commit(records) {
    const previous = fs.readFileSync(PROMPTS_FILE, 'utf8');
    const next = JSON.stringify(records, null, 2) + '\n';
    fs.writeFileSync(PROMPTS_FILE, next);
    try {
        validatePromptsFile();
    } catch (e) {
        fs.writeFileSync(PROMPTS_FILE, previous);
        const detail = (e.stderr || e.stdout || Buffer.from('')).toString().trim() || e.message;
        throw new Error(`校验未通过，已回滚：\n${detail}`);
    }
}

// ---------- HTTP 工具 ----------

function sendJson(res, status, data) {
    const body = JSON.stringify(data);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(body);
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > 40 * 1024 * 1024) reject(new Error('请求体过大'));
            else chunks.push(chunk);
        });
        req.on('end', () => {
            const raw = Buffer.concat(chunks).toString('utf8');
            if (!raw) return resolve({});
            try {
                resolve(JSON.parse(raw));
            } catch (e) {
                reject(new Error(`请求体不是合法 JSON：${e.message}`));
            }
        });
        req.on('error', reject);
    });
}

function fetchBuffer(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://github.com/'
            }
        }, (response) => {
            if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
                fetchBuffer(new URL(response.headers.location, url).toString()).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`下载失败：HTTP ${response.statusCode}`));
                return;
            }
            const chunks = [];
            response.on('data', (c) => chunks.push(c));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

// ---------- 图片 ----------

function sanitizeName(name) {
    return String(name || '').toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
}

function compressWithSips(inputPath, outputPath) {
    if (process.platform !== 'darwin') return false;
    try {
        execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '80', inputPath, '--out', outputPath], { stdio: 'ignore' });
    } catch (e) {
        return false;
    }
    let quality = 80;
    while (fs.statSync(outputPath).size > 400 * 1024 && quality > 20) {
        quality -= 10;
        execFileSync('sips', ['-s', 'formatOptions', String(quality), outputPath], { stdio: 'ignore' });
    }
    // 降质仍超标就缩尺寸，和 make/download_image.js 一致
    while (fs.statSync(outputPath).size > 400 * 1024) {
        const info = execFileSync('sips', ['-g', 'pixelWidth', outputPath], { encoding: 'utf8' });
        const width = parseInt((info.match(/pixelWidth: (\d+)/) || [])[1], 10);
        if (!width || width < 300) break;
        execFileSync('sips', ['-Z', String(Math.floor(width * 0.9)), outputPath], { stdio: 'ignore' });
    }
    return true;
}

async function saveImage({ url, dataUrl, name, sourceId }) {
    const bucket = SOURCE_BUCKETS[sourceId] || 'images';
    const dir = path.join(ROOT, bucket);
    fs.mkdirSync(dir, { recursive: true });

    let buffer;
    let explicit = false;
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
        const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dataUrl);
        if (!match) throw new Error('dataUrl 格式非法');
        buffer = match[2] ? Buffer.from(match[3], 'base64') : Buffer.from(decodeURIComponent(match[3]), 'utf8');
        explicit = Boolean(name);
    } else if (url) {
        buffer = await fetchBuffer(url);
        explicit = Boolean(name);
    } else {
        throw new Error('需要提供图片 url 或 dataUrl');
    }

    let base = sanitizeName(name) || sanitizeName(path.basename(new URL(url || 'https://x/y').pathname)) || 'image';
    if (!explicit) {
        let candidate = base;
        let n = 2;
        while (fs.existsSync(path.join(dir, `${candidate}.jpg`)) || fs.existsSync(path.join(dir, `${candidate}.png`))) {
            candidate = `${base}_${n}`;
            n += 1;
        }
        base = candidate;
    }

    const temp = path.join(__dirname, '.temp_image');
    fs.writeFileSync(temp, buffer);
    let fileName = `${base}.jpg`;
    let compressed = false;
    try {
        compressed = compressWithSips(temp, path.join(dir, fileName));
    } catch (e) {
        compressed = false;
    }
    if (compressed) {
        // 压缩结果已经在目标路径，原图临时文件直接丢弃，不能覆盖回去
        fs.unlinkSync(temp);
    } else {
        const isPng = buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
        fileName = `${base}.${isPng ? 'png' : 'jpg'}`;
        fs.renameSync(temp, path.join(dir, fileName));
    }

    return {
        relPath: `${bucket}/${fileName}`,
        cdnUrl: `${CDN_PREFIX}${bucket}/${fileName}`,
        sizeKB: Math.round(fs.statSync(path.join(dir, fileName)).size / 1024),
        compressed
    };
}

// 只把本仓库 CDN 前缀下的图片算作自有资源，外部地址不参与清理。
function referencedImages(records) {
    const used = new Set();
    const collect = (u) => {
        const value = typeof u === 'string' ? u : '';
        const idx = value.indexOf('/images/');
        if (idx !== -1 && (value.startsWith(CDN_PREFIX) || value.startsWith('./') || value.startsWith('images/') || value.startsWith('/images/'))) {
            used.add('images/' + value.slice(idx + '/images/'.length).split('?')[0]);
        }
    };
    for (const r of records) {
        collect(r.coverUrl);
        for (const u of r.referenceImageUrls || []) collect(u);
    }
    return used;
}

function findOrphanImages(records) {
    const used = referencedImages(records);
    const orphans = [];
    for (const bucket of new Set(Object.values(SOURCE_BUCKETS))) {
        const dir = path.join(ROOT, bucket);
        if (!fs.existsSync(dir)) continue;
        for (const fileName of fs.readdirSync(dir).sort()) {
            const rel = `${bucket}/${fileName}`;
            if (!used.has(rel)) orphans.push(rel);
        }
    }
    return orphans;
}

// ---------- 路由 ----------

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const route = `${req.method} ${url.pathname}`;
    try {
        if (route === 'GET /' || route === 'GET /index.html') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
            res.end(fs.readFileSync(UI_FILE));
            return;
        }

        if (req.method === 'GET' && url.pathname.startsWith('/images/')) {
            const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
            const abs = path.resolve(ROOT, rel);
            const imagesRoot = path.join(ROOT, 'images');
            if (!abs.startsWith(imagesRoot + path.sep) || !fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
                sendJson(res, 404, { ok: false, error: '图片不存在' });
                return;
            }
            const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[path.extname(abs).toLowerCase()] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
            res.end(fs.readFileSync(abs));
            return;
        }

        if (route === 'GET /api/state') {
            sendJson(res, 200, {
                records: state.records,
                sourceIds: Object.keys(SOURCE_HOMEPAGES),
                ownSourceIds: OWN_SOURCE_IDS,
                sourceHomepages: SOURCE_HOMEPAGES,
                sourceBuckets: SOURCE_BUCKETS,
                cdnPrefix: CDN_PREFIX,
                nextOwnItemId: state.nextOwnItemId
            });
            return;
        }

        if (route === 'POST /api/reload') {
            sendJson(res, 200, { ok: true, count: reload() });
            return;
        }

        if (route === 'POST /api/validate') {
            try {
                validatePromptsFile();
                sendJson(res, 200, { ok: true, message: 'prompts.json 校验通过' });
            } catch (e) {
                sendJson(res, 200, { ok: false, message: ((e.stderr || e.stdout || Buffer.from('')).toString().trim() || e.message) });
            }
            return;
        }

        if (route === 'POST /api/records') {
            const body = await readBody(req);
            const sourceId = collapse(body.sourceId);
            if (!SOURCE_HOMEPAGES[sourceId]) throw new Error(`未知 sourceId：${sourceId || '(空)'}`);
            const isOwn = OWN_SOURCE_IDS.includes(sourceId);
            let sourceItemId;
            if (body.sourceItemId === undefined || body.sourceItemId === null || body.sourceItemId === '') {
                if (!isOwn) throw new Error('第三方条目必须填写 sourceItemId');
                sourceItemId = state.nextOwnItemId;
            } else {
                sourceItemId = Number(body.sourceItemId);
                if (!Number.isInteger(sourceItemId) || sourceItemId < 1) throw new Error('sourceItemId 必须是正整数');
            }
            if (state.records.some((r) => r.sourceId === sourceId && r.sourceItemId === sourceItemId)) {
                throw new Error(`${sourceId} 下已存在 sourceItemId=${sourceItemId}`);
            }
            const record = buildRecord(body, sourceItemId);
            const next = state.records.slice();
            next.splice(isOwn ? ownBlockEnd() : next.length, 0, record);
            commit(next);
            state.records = next;
            if (isOwn && sourceItemId === state.nextOwnItemId) {
                state.nextOwnItemId += 1;
                persistNextOwnItemId();
            }
            sendJson(res, 200, { ok: true, record });
            return;
        }

        if (route === 'PUT /api/records') {
            const body = await readBody(req);
            const index = state.records.findIndex((r) => r.id === body.id);
            if (index === -1) throw new Error(`找不到记录：${body.id}`);
            const previous = state.records[index];
            const sourceId = collapse(body.sourceId) || previous.sourceId;
            if (!SOURCE_HOMEPAGES[sourceId]) throw new Error(`未知 sourceId：${sourceId}`);
            const sourceItemId = body.sourceItemId === undefined || body.sourceItemId === null || body.sourceItemId === ''
                ? previous.sourceItemId
                : Number(body.sourceItemId);
            if (!Number.isInteger(sourceItemId) || sourceItemId < 1) throw new Error('sourceItemId 必须是正整数');
            if (state.records.some((r, i) => i !== index && r.sourceId === sourceId && r.sourceItemId === sourceItemId)) {
                throw new Error(`${sourceId} 下已存在 sourceItemId=${sourceItemId}`);
            }
            const record = buildRecord({ ...body, sourceId }, sourceItemId);
            const next = state.records.slice();
            // 改变来源可能破坏「自有条目在前」，这里做一次稳定重排
            next[index] = record;
            next.sort((a, b) => {
                const ao = OWN_SOURCE_IDS.includes(a.sourceId) ? 0 : 1;
                const bo = OWN_SOURCE_IDS.includes(b.sourceId) ? 0 : 1;
                return ao - bo || 0;
            });
            commit(next);
            state.records = next;
            sendJson(res, 200, { ok: true, record, idChanged: record.id !== previous.id });
            return;
        }

        if (route === 'DELETE /api/records') {
            const id = url.searchParams.get('id');
            const index = state.records.findIndex((r) => r.id === id);
            if (index === -1) throw new Error(`找不到记录：${id}`);
            const next = state.records.slice();
            const [removed] = next.splice(index, 1);
            commit(next);
            state.records = next;
            sendJson(res, 200, { ok: true, removed });
            return;
        }

        if (route === 'POST /api/records/batch-delete') {
            const body = await readBody(req);
            const ids = Array.isArray(body.ids) ? body.ids.filter((id) => typeof id === 'string' && id) : [];
            if (!ids.length) throw new Error('请先选择要删除的记录');
            const idSet = new Set(ids);
            const existing = new Set(state.records.map((r) => r.id));
            const removedIds = ids.filter((id) => existing.has(id));
            if (!removedIds.length) throw new Error('没有匹配的记录');
            const next = state.records.filter((r) => !idSet.has(r.id));
            commit(next);
            state.records = next;
            sendJson(res, 200, { ok: true, removed: removedIds.length, removedIds });
            return;
        }

        if (route === 'POST /api/images') {
            const body = await readBody(req);
            const result = await saveImage(body);
            sendJson(res, 200, { ok: true, ...result });
            return;
        }

        if (route === 'POST /api/gc') {
            const body = await readBody(req);
            const orphans = findOrphanImages(state.records);
            if (body.dryRun !== false) {
                sendJson(res, 200, { ok: true, dryRun: true, orphans, count: orphans.length });
                return;
            }
            for (const rel of orphans) fs.unlinkSync(path.join(ROOT, rel));
            sendJson(res, 200, { ok: true, dryRun: false, removed: orphans, count: orphans.length });
            return;
        }

        sendJson(res, 404, { ok: false, error: `未知接口：${route}` });
    } catch (e) {
        sendJson(res, 400, { ok: false, error: e.message || String(e) });
    }
});

const count = reload();
server.listen(PORT, '127.0.0.1', () => {
    console.log(`🍌 提示词管理服务已启动：http://localhost:${PORT}`);
    console.log(`   数据文件：${path.relative(ROOT, PROMPTS_FILE)}（${count} 条）`);
    console.log('   退出：Ctrl+C');
});
