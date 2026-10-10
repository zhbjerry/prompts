#!/usr/bin/env node

// 校验仓库内所有 JSON 文件的语法与结构合法性。
// 规则来源见 PROMPT_RECORD_FORMAT.md（prompts.json 记录格式 + 各配置文件契约）。
// 用法: node make/validate_json.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(process.env.VALIDATE_ROOT || path.join(__dirname, '..'));
// 跳过版本控制与本地忽略目录，本地校验结果与 CI 一致。
const SKIP_DIRS = new Set(['.git', 'node_modules', '.obsidian', '.claudian']);

const errors = [];
const info = [];

function err(file, msg) {
    errors.push(`${file}: ${msg}`);
}

// ---------- 通用 ----------

function listJsonFiles(dir, prefix, out) {
    out = out || [];
    for (const name of fs.readdirSync(dir).sort()) {
        if (SKIP_DIRS.has(name)) continue;
        const abs = path.join(dir, name);
        const rel = prefix ? `${prefix}/${name}` : name;
        const stat = fs.statSync(abs);
        if (stat.isDirectory()) {
            listJsonFiles(abs, rel, out);
        } else if (name.endsWith('.json')) {
            out.push(rel);
        }
    }
    return out;
}

function parseJson(rel) {
    const raw = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    try {
        return JSON.parse(raw);
    } catch (e) {
        err(rel, `JSON 语法错误：${e.message}`);
        return undefined;
    }
}

const isString = (v) => typeof v === 'string';
const isStringArray = (v) => Array.isArray(v) && v.every(isString);

function checkStringArray(file, where, arr, { allowEmpty = true } = {}) {
    if (!isStringArray(arr)) {
        err(file, `${where} 必须是字符串数组`);
        return;
    }
    if (arr.some((x) => x === '')) err(file, `${where} 含空元素`);
    if (!allowEmpty && arr.length === 0) err(file, `${where} 不能为空数组`);
    if (new Set(arr).size !== arr.length) err(file, `${where} 存在重复元素`);
}

function checkHttpUrl(file, where, url, { optional = false } = {}) {
    if (url === '' && (optional || url === '')) return;
    if (!isString(url)) {
        err(file, `${where} 必须是字符串`);
        return;
    }
    if (url === '') return;
    if (!/^https?:\/\/\S+$/.test(url)) err(file, `${where} 不是合法的 HTTP(S) 地址：${url}`);
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;
// title 固定中文、titleEn 固定英文：前者至少含一个汉字，后者不含汉字且至少含一个拉丁字母
const CJK_CHAR = /[\u4e00-\u9fff]/;
const LATIN_CHAR = /[A-Za-z]/;

// ---------- prompts.json ----------

// 自有来源：这些来源的条目由本仓库维护，sourceItemId 使用本地序号。
const OWN_SOURCE_IDS = new Set(['banana-prompt-quicker']);

const SOURCE_IDS = new Set([
    'banana-prompt-quicker',
    'freestylefly-gpt-image-2',
    'moosl-awesome-gpt-image-2-prompts',
    'open-design',
    'awesome-gpt-image2-prompts'
]);

const RECORD_KEYS = [
    'id', 'sourceId', 'title', 'titleEn', 'prompt', 'description', 'coverUrl',
    'referenceImageUrls', 'tags', 'author', 'sourceUrl', 'createdAt',
    'mediaType', 'imageMode', 'imageModel', 'needsRef', 'sourceItemId'
];

const MEDIA_TYPES = ['image', 'video'];

function validatePrompts(file, data) {
    if (!Array.isArray(data)) {
        err(file, '顶层必须是记录数组');
        return;
    }
    const seenIds = new Set();
    let ownPrefixEnd = -1; // 第一个非自有条目的下标

    data.forEach((rec, i) => {
        const at = `第 ${i + 1} 条（${rec && rec.title ? rec.title : '无标题'}）`;

        if (!rec || typeof rec !== 'object' || Array.isArray(rec)) {
            err(file, `${at} 不是对象`);
            return;
        }

        // 键集合与顺序
        const keys = Object.keys(rec);
        if (keys.length !== RECORD_KEYS.length || keys.some((k, n) => k !== RECORD_KEYS[n])) {
            err(file, `${at} 键集合/顺序不符合规范，实际为 [${keys.join(', ')}]`);
        }

        // 类型
        if (!isString(rec.id)) err(file, `${at} id 必须是字符串`);
        if (!isString(rec.sourceId)) err(file, `${at} sourceId 必须是字符串`);
        if (!isString(rec.title)) err(file, `${at} title 必须是字符串`);
        if (!isString(rec.prompt)) err(file, `${at} prompt 必须是字符串`);
        if (!isString(rec.description)) err(file, `${at} description 必须是字符串`);
        if (!isString(rec.coverUrl)) err(file, `${at} coverUrl 必须是字符串`);
        if (!isString(rec.author)) err(file, `${at} author 必须是字符串`);
        if (!isString(rec.sourceUrl)) err(file, `${at} sourceUrl 必须是字符串`);
        if (!isString(rec.createdAt)) err(file, `${at} createdAt 必须是字符串`);
        if (!isString(rec.mediaType)) err(file, `${at} mediaType 必须是字符串`);
        if (!isString(rec.imageMode)) err(file, `${at} imageMode 必须是字符串`);
        if (!isString(rec.imageModel)) err(file, `${at} imageModel 必须是字符串`);
        if (!isString(rec.titleEn)) err(file, `${at} titleEn 必须是字符串`);
        if (typeof rec.needsRef !== 'boolean') err(file, `${at} needsRef 必须是布尔值`);
        if (!Number.isInteger(rec.sourceItemId) || rec.sourceItemId < 1) {
            err(file, `${at} sourceItemId 必须是正整数`);
        }

        // 值约束
        if (rec.sourceId && !SOURCE_IDS.has(rec.sourceId)) err(file, `${at} 未知 sourceId：${rec.sourceId}`);
        if (!rec.title.trim()) err(file, `${at} title 为空`);
        if (!rec.prompt.trim()) err(file, `${at} prompt 为空`);
        if (!rec.titleEn.trim()) err(file, `${at} titleEn 为空`);
        if (!CJK_CHAR.test(rec.title)) err(file, `${at} title 必须含中文：${rec.title}`);
        if (CJK_CHAR.test(rec.titleEn) || !LATIN_CHAR.test(rec.titleEn)) {
            err(file, `${at} titleEn 必须写英文：${rec.titleEn}`);
        }
        if (!MEDIA_TYPES.includes(rec.mediaType)) {
            err(file, `${at} mediaType 取值非法：${rec.mediaType}`);
        }
        if (!['generate', 'edit', ''].includes(rec.imageMode)) {
            err(file, `${at} imageMode 取值非法：${rec.imageMode}`);
        }
        if (rec.createdAt && !DATE_ONLY.test(rec.createdAt) && !RFC3339.test(rec.createdAt)) {
            err(file, `${at} createdAt 格式非法：${rec.createdAt}`);
        }

        // 空值规则：任何键都不允许 null
        for (const k of keys) {
            if (rec[k] === null) err(file, `${at} ${k} 不允许为 null`);
        }

        // 数组
        checkStringArray(file, `${at} referenceImageUrls`, rec.referenceImageUrls);
        checkStringArray(file, `${at} tags`, rec.tags);

        // URL
        checkHttpUrl(file, `${at} coverUrl`, rec.coverUrl);
        checkHttpUrl(file, `${at} sourceUrl`, rec.sourceUrl, { optional: true });
        if (Array.isArray(rec.referenceImageUrls)) {
            rec.referenceImageUrls.forEach((u, n) => checkHttpUrl(file, `${at} referenceImageUrls[${n}]`, u));
        }

        // id 与摘要
        if (isString(rec.id)) {
            if (seenIds.has(rec.id)) err(file, `${at} id 重复：${rec.id}`);
            seenIds.add(rec.id);
            if (!/^[a-z0-9-]+:[0-9a-f]{16}$/.test(rec.id)) {
                err(file, `${at} id 格式非法：${rec.id}`);
            } else {
                const digest = crypto.createHash('sha256').update(String(rec.sourceItemId)).digest('hex').slice(0, 16);
                const expected = `${rec.sourceId}:${digest}`;
                if (rec.id !== expected) err(file, `${at} id 摘要不匹配，应为 ${expected}`);
            }
        }

        // 自有条目必须连续排在文件最前
        const isOwn = OWN_SOURCE_IDS.has(rec.sourceId);
        if (!isOwn && ownPrefixEnd === -1) ownPrefixEnd = i;
        if (isOwn && ownPrefixEnd !== -1) {
            err(file, `${at} 自有条目必须排在合并条目之前`);
        }

        // 分类与参考图口径
        if (rec.imageMode === 'edit' && rec.needsRef !== true && !(rec.referenceImageUrls || []).length) {
            err(file, `${at} 是 edit 但既无 needsRef 也无 referenceImageUrls`);
        }
    });

    info.push(`prompts.json：${data.length} 条记录，标识唯一`);
}

// ---------- config.json ----------

const CONFIG_SITES = ['aistudio', 'gemini', 'gemini_enterprise'];

function checkSelectorEntry(file, where, entry) {
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
        err(file, `${where} 必须是对象`);
        return;
    }
    if (!isString(entry.promptInput)) err(file, `${where}.promptInput 必须是字符串`);
    if (!isString(entry.insertButton)) err(file, `${where}.insertButton 必须是字符串`);
}

function validateConfig(file, data) {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        err(file, '顶层必须是对象');
        return;
    }
    const selectors = data.selectors;
    if (selectors === null || typeof selectors !== 'object' || Array.isArray(selectors)) {
        err(file, 'selectors 必须是对象');
    } else {
        for (const site of CONFIG_SITES) {
            if (selectors[site] === undefined) {
                err(file, `selectors.${site} 缺失`);
            } else {
                checkSelectorEntry(file, `selectors.${site}`, selectors[site]);
            }
        }
        if (!Array.isArray(selectors.dynamic)) {
            err(file, 'selectors.dynamic 必须是数组');
        } else {
            selectors.dynamic.forEach((item, i) => {
                checkSelectorEntry(file, `selectors.dynamic[${i}]`, item);
                if (!isString(item.host) || !item.host) err(file, `selectors.dynamic[${i}].host 必须是非空字符串`);
            });
        }
    }
    if (!Array.isArray(data.announcements)) {
        err(file, 'announcements 必须是数组');
    } else {
        data.announcements.forEach((item, i) => {
            if (item === null || typeof item !== 'object' || Array.isArray(item)) {
                err(file, `announcements[${i}] 必须是对象`);
                return;
            }
            if (!isString(item.content) || !item.content) err(file, `announcements[${i}].content 必须是非空字符串`);
            if (item.link !== undefined) checkHttpUrl(file, `announcements[${i}].link`, item.link);
            if (item.priority !== undefined && typeof item.priority !== 'number') {
                err(file, `announcements[${i}].priority 必须是数字`);
            }
        });
    }
    info.push('config.json：站点选择器与公告结构合法');
}

// ---------- extension/manifest.json ----------

function validateManifest(file, data) {
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
        err(file, '顶层必须是对象');
        return;
    }
    if (data.manifest_version !== 3) err(file, 'manifest_version 必须为 3');
    if (!isString(data.name) || !data.name) err(file, 'name 必须是非空字符串');
    if (!isString(data.version) || !/^\d+(\.\d+){1,3}$/.test(data.version)) {
        err(file, `version 不是合法版本号：${data.version}`);
    }
    if (data.background === null || typeof data.background !== 'object' || !isString(data.background.service_worker)) {
        err(file, 'background.service_worker 缺失');
    } else if (!fs.existsSync(path.join(ROOT, 'extension', data.background.service_worker))) {
        err(file, `background.service_worker 指向的文件不存在：${data.background.service_worker}`);
    }
    if (!Array.isArray(data.content_scripts) || data.content_scripts.length === 0) {
        err(file, 'content_scripts 必须是非空数组');
    } else {
        data.content_scripts.forEach((cs, i) => {
            if (!isStringArray(cs.matches) || cs.matches.length === 0) err(file, `content_scripts[${i}].matches 必须是非空字符串数组`);
            if (!isStringArray(cs.js)) {
                err(file, `content_scripts[${i}].js 必须是字符串数组`);
            } else {
                cs.js.forEach((j) => {
                    if (!fs.existsSync(path.join(ROOT, 'extension', j))) err(file, `content_scripts[${i}].js 引用的文件不存在：${j}`);
                });
            }
        });
    }
    if (data.icons !== undefined) {
        if (data.icons === null || typeof data.icons !== 'object' || Array.isArray(data.icons)) {
            err(file, 'icons 必须是对象');
        } else {
            for (const [size, iconPath] of Object.entries(data.icons)) {
                if (!/^\d+$/.test(size)) err(file, `icons.${size} 的键必须是像素尺寸`);
                if (!isString(iconPath) || !fs.existsSync(path.join(ROOT, 'extension', iconPath))) {
                    err(file, `icons.${size} 指向的文件不存在：${iconPath}`);
                }
            }
        }
    }
    info.push('extension/manifest.json：MV3 结构与引用文件合法');
}

// ---------- 入口 ----------

const VALIDATORS = {
    'prompts.json': validatePrompts,
    'config.json': validateConfig,
    'extension/manifest.json': validateManifest
};

// 可选：只校验命令行给出的文件，例如 `node make/validate_json.js prompts.json`
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
if (only.length) {
    const missing = only.filter((rel) => !fs.existsSync(path.join(ROOT, rel)));
    if (missing.length) {
        console.error(`✗ 文件不存在：${missing.join('、')}`);
        process.exit(1);
    }
}

const files = only.length ? only : listJsonFiles(ROOT, '');
info.push(`发现 ${files.length} 个 JSON 文件：${files.join('、')}`);

for (const rel of files) {
    const data = parseJson(rel);
    if (data === undefined) continue;
    const validator = VALIDATORS[rel];
    if (validator) validator(rel, data);
    else info.push(`${rel}：仅做语法校验`);
}

for (const line of info) console.log(`· ${line}`);

if (errors.length) {
    console.error(`\n✗ 校验失败，共 ${errors.length} 项：`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
}

console.log(`\n✓ 全部 JSON 合法（${files.length} 个文件）`);
