#!/usr/bin/env node
/**
 * 将 prompts.json 中所有 camo.githubusercontent.com 预览图迁移为本地图片。
 *
 * 流程：camo URL -> 解码原始 URL -> 下载 -> sips 压缩 (小体积) -> 存 images/banana/ -> 改写 coverUrl
 *
 * 用法：
 *   node make/migrate_camo_images.js          # 正式执行
 *   node make/migrate_camo_images.js --dry    # 仅预览，不下载/不改写
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const DRY = process.argv.includes('--dry');
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images', 'banana');
const PROMPTS_FILE = path.join(ROOT, 'prompts.json');
const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/zhbjerry/prompts@main/images/banana/';

// 压缩目标：预览缩略图，尽量小
const MAX_WIDTH = 720;      // 最长边
const TARGET_KB = 50;       // 目标体积上限
const MIN_QUALITY = 15;

// 标题 -> 英文文件名（不含扩展名）
const SLUG_MAP = {
    '复古宣传海报': 'vintage_promo_poster',
    '定制动漫手办': 'custom_anime_figure',
    '定制Q版钥匙串': 'custom_chibi_keychain',
    '原创宝可梦生成': 'original_pokemon_generate',
    '3D Q版大学拟人化形象': 'q_version_university_mascot',
    '剪影艺术': 'silhouette_art',
    '磨砂玻璃后的虚实对比剪影': 'frosted_glass_silhouette',
    '自拍生成摇头娃娃': 'selfie_bobblehead',
    '三只动物与地标自拍': 'animals_landmark_selfie',
    '透视3D出屏效果': 'pop_out_3d_perspective',
    '谷歌地图变身古代藏宝图': 'google_maps_treasure_map',
    '品牌化键盘键帽': 'branded_keycaps',
    '微型立体场景移轴摄影': 'miniature_tilt_shift',
    '镀铬emoji徽章': 'chrome_emoji_badge',
    '儿童涂色页插画': 'kids_coloring_page',
    '字母与单词含义融合': 'letter_word_meaning',
    '双重曝光': 'double_exposure',
    '超现实交互场景': 'surreal_interaction',
    '动物硅胶腕托': 'animal_wrist_rest',
    '发光线条解剖图': 'glowing_line_anatomy',
    '特色城市天气预报': 'city_weather_forecast',
    '乐高城市景观': 'lego_city_landscape',
    '创意绿植花盆': 'creative_plant_pot',
    '“极其平凡”的iPhone自拍': 'mediocre_iphone_selfie',
    '玻璃材质重塑': 'glass_material_retexture',
    '水晶球故事场景': 'crystal_ball_scene',
    '社交媒体相框融合': 'social_media_frame',
    '云彩艺术': 'cloud_art',
    '8位像素图标': '8bit_pixel_icon',
    '纸艺风格 Emoji 图标': 'papercraft_emoji',
    '时尚杂志封面风格': 'fashion_magazine_cover',
    'RPG 风格角色卡片制作': 'rpg_character_card',
    'Q版可爱俄罗斯套娃': 'q_matryoshka_doll',
    '3D 全家福婚纱照': '3d_family_wedding',
    '3D Q版情侣水晶球': '3d_q_snowglobe_couple',
    '实物与手绘涂鸦创意广告': 'real_object_doodle_ad',
    '日系双格漫画': 'two_panel_manga',
    '奇幻卡通插画': 'fantasy_cartoon_illustration',
    '手绘信息图卡片（IP版）': 'hand_drawn_infographic',
    '柔和风格3D广告': 'pastel_3d_ad',
    '极简主义3D插画': 'minimalist_3d_illustration',
    '毛茸茸emoji物体': 'fluffy_emoji_object',
    '全家福婚纱照Q版转换': 'family_wedding_q_version',
    '《泰坦尼克号》模仿': 'titanic_imitation',
    '折叠式纸雕立体绘本': 'papercraft_popup_book',
    '动漫贴纸集合': 'anime_sticker_set',
    '35mm胶片风格飞岛': '35mm_film_flying_island',
    '名画人物OOTD': 'painting_character_ootd',
    '扁平贴纸设计': 'flat_sticker_design',
    'Q版表情包制作': 'q_sticker_pack',
    '名画人物麦片广告': 'painting_cereal_ad',
    '极简主义3D插画（JSON配置版）': 'minimalist_3d_json',
    'Funko Pop公仔制作': 'funko_pop_figure',
    '小红书封面设计': 'xiaohongshu_cover',
    'Q版角色表情包制作': 'q_character_emoji_pack',
    '手办真人同框合影': 'figure_real_person_photo',
    '玩具盒中的国家立体模型': 'country_toybox_diorama',
    '复古CRT电脑启动屏幕': 'retro_crt_boot_screen',
    '二次元风格徽章': 'anime_badge',
    '3D Q版中式婚礼图': '3d_q_chinese_wedding',
    '讽刺海报生成': 'satirical_poster',
    '3D Q版风格转换': '3d_q_style_transfer',
    '3D情侣珠宝盒摆件': '3d_couple_jewelry_box',
    '讽刺漫画海报': 'satirical_comic_poster',
    '乐高人偶收藏展示': 'lego_minifigure_display',
    '个性化房间设计': 'personalized_room_design',
    '角色穿越传送门': 'character_portal',
    '键盘ESC键帽微型立体模型': 'esc_keycap_diorama',
    '奇幻水下场景冰棒': 'underwater_popsicle',
    '拍立得照片出框效果': 'polaroid_photo_out_of_frame',
};

function decodeCamo(url) {
    const m = url.match(/camo\.githubusercontent\.com\/[0-9a-f]+\/([0-9a-f]+)/);
    if (!m) return null;
    try {
        return Buffer.from(m[1], 'hex').toString('utf8');
    } catch (e) {
        return null;
    }
}

function downloadFile(url, redirects = 0) {
    return new Promise((resolve, reject) => {
        if (redirects > 5) return reject(new Error('重定向过多'));
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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

function slugFor(title) {
    if (SLUG_MAP[title]) return SLUG_MAP[title];
    // 兜底：无法映射时使用 hash，避免覆盖
    const h = Buffer.from(title).toString('hex').slice(0, 16);
    return `migrated_${h}`;
}

async function main() {
    const raw = fs.readFileSync(PROMPTS_FILE, 'utf8');
    const arr = JSON.parse(raw);

    const targets = arr
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => (p.coverUrl || '').includes('camo.githubusercontent.com'));

    console.log(`共 ${targets.length} 条待迁移${DRY ? ' (dry-run)' : ''}\n`);

    if (!DRY && !fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

    const usedSlugs = new Set();
    let ok = 0, fail = 0, totalBytes = 0;
    const failures = [];

    for (const { p, i } of targets) {
        const orig = decodeCamo(p.coverUrl);
        let slug = slugFor(p.title);
        if (usedSlugs.has(slug)) slug = `${slug}_${i}`;
        usedSlugs.add(slug);
        const outPath = path.join(IMAGES_DIR, `${slug}.jpg`);
        const cdnUrl = `${CDN_PREFIX}${slug}.jpg`;

        if (!orig) {
            console.log(`✗ [${p.title}] 无法解码 camo URL`);
            failures.push({ title: p.title, reason: 'decode fail' });
            fail++;
            continue;
        }

        if (DRY) {
            console.log(`· [${p.title}] -> ${slug}.jpg\n    src: ${orig}`);
            continue;
        }

        try {
            const buf = await downloadFile(orig);
            const tmp = path.join(__dirname, '.temp_migrate');
            fs.writeFileSync(tmp, buf);
            const size = compress(tmp, outPath);
            fs.unlinkSync(tmp);
            totalBytes += size;
            p.coverUrl = cdnUrl;
            ok++;
            console.log(`✓ [${p.title}] -> ${slug}.jpg (${(size / 1024).toFixed(1)} KB)`);
        } catch (e) {
            console.log(`✗ [${p.title}] 失败: ${e.message}`);
            failures.push({ title: p.title, reason: e.message });
            fail++;
        }
    }

    if (!DRY) {
        fs.writeFileSync(PROMPTS_FILE, JSON.stringify(arr, null, 2) + '\n');
        console.log(`\n===== 完成 =====`);
        console.log(`成功: ${ok}  失败: ${fail}`);
        console.log(`新增图片总体积: ${(totalBytes / 1024 / 1024).toFixed(2)} MB (平均 ${ok ? (totalBytes / ok / 1024).toFixed(1) : 0} KB/张)`);
        if (failures.length) {
            console.log('\n失败列表:');
            failures.forEach((f) => console.log(`  - ${f.title}: ${f.reason}`));
        }
    }
}

main();
