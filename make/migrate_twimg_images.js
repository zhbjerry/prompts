#!/usr/bin/env node
/**
 * 将 prompts.json 中所有 pbs.twimg.com 预览图迁移为本地图片。
 *
 * 背景：pbs.twimg.com 在国内网络无法直连，站点上的预览图会大量加载失败。
 * 流程：pbs URL -> 下载 -> sips 压缩 (小体积) -> 存 images/banana/ -> 改写 coverUrl 为 jsDelivr CDN
 *
 * 用法：
 *   node make/migrate_twimg_images.js          # 正式执行
 *   node make/migrate_twimg_images.js --dry    # 仅预览，不下载/不改写
 *   node make/migrate_twimg_images.js --force  # 已存在的本地图片也重新下载
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const DRY = process.argv.includes('--dry');
const FORCE = process.argv.includes('--force');
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images', 'banana');
const PROMPTS_FILE = path.join(ROOT, 'prompts.json');
const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/zhbjerry/prompts@main/images/banana/';

// 压缩目标：预览缩略图，尽量小
const MAX_WIDTH = 720;      // 最长边
const TARGET_KB = 50;       // 目标体积上限
const MIN_QUALITY = 15;

/**
 * 从 pbs.twimg.com URL 中提取 media id。
 * 例：https://pbs.twimg.com/media/G6PcDI3acAEfb8e?format=jpg&name=medium -> G6PcDI3acAEfb8e
 */
function extractMediaId(url) {
    const m = url.match(/pbs\.twimg\.com\/media\/([A-Za-z0-9_-]+)/);
    return m ? m[1] : null;
}

function slugFor(url) {
    const id = extractMediaId(url);
    if (!id) return null;
    return `twimg_${id}`;
}

/** 统一请求到较大尺寸：固定 name=large，保证预览清晰度 */
function normalizeUrl(url) {
    try {
        const u = new URL(url);
        u.searchParams.set('name', 'large');
        // 保留原始 format（jpg/png），下载后再转 jpg
        if (!u.searchParams.has('format')) {
            const ext = path.extname(u.pathname).replace('.', '');
            if (ext) u.searchParams.set('format', ext);
        }
        return u.toString();
    } catch (e) {
        return url;
    }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 带重试的下载，规避 twimg 的瞬时限流 */
async function downloadWithRetry(url, retries = 4) {
    let lastErr;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await downloadFile(url);
        } catch (e) {
            lastErr = e;
            if (/HTTP 4\d\d/.test(e.message)) break; // 4xx 直接放弃，不重试
            await sleep(600 * attempt);
        }
    }
    throw lastErr;
}

function downloadFile(url, redirects = 0) {
    return new Promise((resolve, reject) => {
        if (redirects > 5) return reject(new Error('重定向过多'));
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://github.com/',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
        };
        client.get(url, options, (response) => {
            if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
                return downloadFile(response.headers.location, redirects + 1).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                return reject(new Error(`HTTP ${response.statusCode}`));
            }
            const chunks = [];
            response.on('data', (c) => chunks.push(c));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

function compress(inputPath, outputPath) {
    // 先限制最长边并转 jpeg
    execSync(`sips -Z ${MAX_WIDTH} -s format jpeg -s formatOptions 80 "${inputPath}" --out "${outputPath}"`, { stdio: 'ignore' });

    let size = fs.statSync(outputPath).size;
    let quality = 80;

    while (size > TARGET_KB * 1024 && quality > MIN_QUALITY) {
        quality -= 10;
        execSync(`sips -s formatOptions ${quality} "${outputPath}"`, { stdio: 'ignore' });
        size = fs.statSync(outputPath).size;
    }

    // 仍超标则缩尺寸
    while (size > TARGET_KB * 1024) {
        const wOut = execSync(`sips -g pixelWidth "${outputPath}"`, { encoding: 'utf8' });
        const w = parseInt(wOut.match(/pixelWidth: (\d+)/)[1]);
        if (w < 240) break;
        execSync(`sips -Z ${Math.floor(w * 0.85)} "${outputPath}"`, { stdio: 'ignore' });
        size = fs.statSync(outputPath).size;
    }
    return size;
}

async function main() {
    const raw = fs.readFileSync(PROMPTS_FILE, 'utf8');
    const arr = JSON.parse(raw);

    const targets = arr
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => (p.coverUrl || '').includes('pbs.twimg.com'));

    console.log(`共 ${targets.length} 条待迁移${DRY ? ' (dry-run)' : ''}${FORCE ? ' (force)' : ''}\n`);

    if (!DRY && !fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

    const usedSlugs = new Set();
    let ok = 0, skipped = 0, fail = 0, totalBytes = 0;
    const failures = [];

    for (const { p, i } of targets) {
        let slug = slugFor(p.coverUrl);
        if (!slug) {
            console.log(`✗ [${p.title}] 无法解析 media id: ${p.coverUrl}`);
            failures.push({ title: p.title, reason: 'parse fail', url: p.coverUrl });
            fail++;
            continue;
        }
        if (usedSlugs.has(slug)) slug = `${slug}_${i}`;
        usedSlugs.add(slug);

        const outPath = path.join(IMAGES_DIR, `${slug}.jpg`);
        const cdnUrl = `${CDN_PREFIX}${slug}.jpg`;
        const src = normalizeUrl(p.coverUrl);

        if (DRY) {
            console.log(`· [${p.title}] -> ${slug}.jpg\n    src: ${src}`);
            continue;
        }

        // 已存在且未强制 -> 直接改写链接
        if (!FORCE && fs.existsSync(outPath)) {
            const size = fs.statSync(outPath).size;
            p.coverUrl = cdnUrl;
            totalBytes += size;
            ok++;
            skipped++;
            console.log(`= [${p.title}] -> ${slug}.jpg (已存在 ${(size / 1024).toFixed(1)} KB)`);
            continue;
        }

        try {
            const buf = await downloadWithRetry(src);
            const tmp = path.join(__dirname, '.temp_twimg');
            fs.writeFileSync(tmp, buf);
            const size = compress(tmp, outPath);
            fs.unlinkSync(tmp);
            totalBytes += size;
            p.coverUrl = cdnUrl;
            ok++;
            console.log(`✓ [${p.title}] -> ${slug}.jpg (${(size / 1024).toFixed(1)} KB)`);
            await sleep(200); // 轻微节流，避免触发 twimg 限流
        } catch (e) {
            console.log(`✗ [${p.title}] 失败: ${e.message}  (${p.coverUrl})`);
            failures.push({ title: p.title, reason: e.message, url: p.coverUrl });
            fail++;
        }
    }

    if (!DRY) {
        fs.writeFileSync(PROMPTS_FILE, JSON.stringify(arr, null, 2) + '\n');
        console.log(`\n===== 完成 =====`);
        console.log(`成功: ${ok} (其中复用已存在: ${skipped})  失败: ${fail}`);
        console.log(`图片总体积: ${(totalBytes / 1024 / 1024).toFixed(2)} MB (平均 ${ok ? (totalBytes / ok / 1024).toFixed(1) : 0} KB/张)`);
        if (failures.length) {
            console.log('\n失败列表（这些 URL 已失效，需人工替换或删除）:');
            failures.forEach((f) => console.log(`  - ${f.title}: ${f.reason}\n      ${f.url}`));
        }
    }
}

main();
