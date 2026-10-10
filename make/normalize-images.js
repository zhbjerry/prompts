#!/usr/bin/env node

// 统一图片目录与命名（幂等，可反复运行）。
//
// 规则（见 README「图片资源」）：
//   1. 被 prompts.json 引用的本地图片全部平铺到 images/ 根目录，不再使用来源子目录。
//   2. 统一命名为 img-0001.<ext>，按 prompts.json 记录顺序编号；同一条记录的多张图
//      使用 img-0001_2.<ext>、img-0001_3.<ext> 后缀保持相邻。来源信息不进入文件名。
//   3. 已符合该命名的图片原样保留，因此可重复运行。
//   4. 同步把 prompts.json 里的图片 URL 改写为新路径。
//
// 以后新增图片：把图片放进仓库任意位置（或在 prompts.json 里先写好引用），
// 执行 `node make/normalize-images.js` 即可打平、改名并回填 URL。
//
// 用法:
//   node make/normalize-images.js            # 实际执行
//   node make/normalize-images.js --dry-run  # 只预览将发生的改动

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');
const PAD = 4;

const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/zhbjerry/prompts@main/';
const IMAGES_DIR = 'images';
const NORMALIZED_RE = /^images\/img-(\d+)(_\d+)?\.(jpe?g|png)$/i;

const promptsPath = path.join(ROOT, 'prompts.json');
let text = fs.readFileSync(promptsPath, 'utf8');
const records = JSON.parse(text);

const pad = (n) => String(n).padStart(PAD, '0');
const normalizeExt = (ext) => {
    const e = ext.toLowerCase().replace(/^\./, '');
    return e === 'jpeg' ? 'jpg' : e;
};

// 从任意图片 URL 里取出仓库内相对路径（如 images/banana/x.jpg）；非本地图片返回 null。
function toLocalRel(value) {
    if (typeof value !== 'string') return null;
    let rest = value;
    if (rest.startsWith(CDN_PREFIX)) rest = rest.slice(CDN_PREFIX.length);
    else if (rest.startsWith('./')) rest = rest.slice(2);
    else if (rest.startsWith('/')) rest = rest.slice(1);
    rest = rest.split('?')[0].split('#')[0];
    return rest.startsWith(`${IMAGES_DIR}/`) ? rest : null;
}

// 按记录顺序收集该记录引用的本地图片（去重，保持顺序）。
function collectRels(record) {
    const out = [];
    const seen = new Set();
    const visit = (value) => {
        if (typeof value === 'string') {
            const rel = toLocalRel(value);
            if (rel && !seen.has(rel)) {
                seen.add(rel);
                out.push(rel);
            }
        } else if (Array.isArray(value)) {
            value.forEach(visit);
        } else if (value && typeof value === 'object') {
            Object.values(value).forEach(visit);
        }
    };
    visit(record);
    return out;
}

// 预扫描：已存在的规范化编号，避免重复占用。
let maxBase = 0;
for (const m of text.matchAll(/images\/img-(\d+)/g)) {
    maxBase = Math.max(maxBase, Number(m[1]));
}

const mapping = new Map(); // oldRel -> newRel
let renamedCount = 0;
let keptCount = 0;

for (const record of records) {
    let base = null;
    let sub = 0;
    for (const rel of collectRels(record)) {
        if (mapping.has(rel)) continue;
        const fileExists = fs.existsSync(path.join(ROOT, rel));
        const match = rel.match(NORMALIZED_RE);

        if (match && fileExists) {
            // 已经是统一命名，原样保留，并以其编号作为本条记录的基准号。
            base = Number(match[1]);
            sub = match[2] ? Number(match[2].slice(1)) : 1;
            maxBase = Math.max(maxBase, base);
            mapping.set(rel, rel);
            keptCount += 1;
            continue;
        }

        if (base === null) base = ++maxBase;
        sub += 1;
        const ext = normalizeExt(path.extname(rel) || '.jpg');
        const newRel = sub === 1
            ? `${IMAGES_DIR}/img-${pad(base)}.${ext}`
            : `${IMAGES_DIR}/img-${pad(base)}_${sub}.${ext}`;
        mapping.set(rel, newRel);
        renamedCount += 1;
    }
}

const changes = [...mapping.entries()].filter(([from, to]) => from !== to);

// 执行文件移动
for (const [from, to] of changes) {
    const src = path.join(ROOT, from);
    const dst = path.join(ROOT, to);
    if (!fs.existsSync(src)) {
        if (fs.existsSync(dst)) continue;
        console.warn(`⚠ 源文件不存在，跳过：${from}`);
        continue;
    }
    if (DRY_RUN) {
        console.log(`  ${from} -> ${to}`);
        continue;
    }
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.renameSync(src, dst);
}

// 改写 prompts.json：长路径优先，避免前缀互相干扰
const rewrites = changes.slice().sort((a, b) => b[0].length - a[0].length);
for (const [from, to] of rewrites) {
    text = text.split(from).join(to);
}

if (!DRY_RUN) fs.writeFileSync(promptsPath, text);

// 清理空的来源子目录
for (const dir of fs.readdirSync(path.join(ROOT, IMAGES_DIR))) {
    const abs = path.join(ROOT, IMAGES_DIR, dir);
    if (fs.statSync(abs).isDirectory() && fs.readdirSync(abs).length === 0) {
        if (DRY_RUN) console.log(`  （将删除空目录 ${IMAGES_DIR}/${dir}）`);
        else fs.rmdirSync(abs);
    }
}

// 报告未被引用的散落图片
const referenced = new Set([...mapping.values()]);
const referencedOld = new Set(mapping.keys());
const orphans = [];
(function scan(dir) {
    for (const name of fs.readdirSync(dir)) {
        const abs = path.join(dir, name);
        const rel = path.relative(ROOT, abs).split(path.sep).join('/');
        if (fs.statSync(abs).isDirectory()) scan(abs);
        else if (!referenced.has(rel) && !referencedOld.has(rel)) orphans.push(rel);
    }
})(path.join(ROOT, IMAGES_DIR));

const prefix = DRY_RUN ? '[dry-run] ' : '';
console.log(`${prefix}重命名 ${renamedCount} 张，保留 ${keptCount} 张，编号 1..${maxBase}`);
if (orphans.length) {
    console.log(`⚠ ${orphans.length} 张图片未被 prompts.json 引用：`);
    orphans.forEach((o) => console.log(`  ${o}`));
}
if (DRY_RUN) console.log('（dry-run 未写入任何改动）');
