#!/usr/bin/env node

// 一次性迁移：把自有条目（sourceId 为 banana-prompt-quicker）的 sourceItemId
// 从 null 改为显式的本地序号，使 id 不再依赖数组下标。
//
// 迁移保持 id 不变：旧规则的身份输入是「数组下标 + 1」，这里按同样的下标顺序
// 写入 sourceItemId，因此重算出的 digest 与迁移前完全一致。
//
// 用法: node make/migrate_own_source_item_id.js [--dry-run]

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OWN_SOURCE_ID = 'banana-prompt-quicker';
const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'prompts.json');
const DRY_RUN = process.argv.includes('--dry-run');

const digestOf = (identity) =>
    crypto.createHash('sha256').update(String(identity)).digest('hex').slice(0, 16);

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let changed = 0;
let mismatched = 0;

data.forEach((rec, i) => {
    if (rec.sourceId !== OWN_SOURCE_ID || rec.sourceItemId !== null) return;
    rec.sourceItemId = i + 1;
    changed += 1;
    const expected = `${rec.sourceId}:${digestOf(rec.sourceItemId)}`;
    if (rec.id !== expected) {
        mismatched += 1;
        console.warn(`⚠️  第 ${i + 1} 条 id 会变化：${rec.id} → ${expected}`);
    }
});

if (mismatched > 0) {
    console.error(`\n❌ 有 ${mismatched} 条 id 会改变，已中止，未写入。`);
    process.exit(1);
}

console.log(`待迁移自有条目：${changed} 条，id 全部保持不变。`);

if (DRY_RUN) {
    console.log('（dry-run，未写入文件）');
    process.exit(0);
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`✅ 已写入 ${path.relative(ROOT, FILE)}`);
