#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 awesome-gpt-image2-prompts 的提示词合并进本项目。

用法：
    python3 make/merge_gpt_image2_prompts.py [--source <目录>] [--dry-run]

做了什么：
  1. 把源项目的 images/* 复制到本项目的 images/gpt-image2/（幂等，按大小跳过）
  2. 把源项目的提示词转成 registry Prompt Record v1 + 本仓库扩展键，追加到
     prompts.json 末尾；已合并过的条目按 sourceItemId / prompt 文本去重

记录契约见仓库根目录的 PROMPT_RECORD_FORMAT.md，写入时键顺序固定为：
  id, sourceId, title, titleEn, prompt, description, coverUrl, referenceImageUrls,
  tags, author, sourceUrl, createdAt, mediaType, imageMode, imageModel, needsRef,
  sourceItemId
  titleEn、mediaType、needsRef、sourceItemId 是本仓库扩展键，每条记录都写；
  title 固定中文，titleEn 固定英文且必填非空（上游没有英文名时合并会直接报错，
  需先补英文名），mediaType 缺省 image，needsRef 缺省 false，sourceItemId 必填正整数

上游 source 字段到本仓库 sourceId 的映射：

    freestylefly/awesome-gpt-image-2   -> freestylefly-gpt-image-2
    moosl/awsome-gpt-image-2-prompts   -> moosl-awesome-gpt-image-2-prompts
    open-design                        -> open-design
    original                           -> awesome-gpt-image2-prompts

本项目自有条目（sourceId = banana-prompt-quicker）不参与改写，只在末尾追加新条目。
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SOURCE = os.path.join(os.path.expanduser("~"), "Downloads/awesome-gpt-image2-prompts-main")
CDN_ROOT = "https://cdn.jsdelivr.net/gh/zhbjerry/prompts@main/"
IMAGE_SUBDIR = "images/gpt-image2"
BASE_SOURCE_ID = "banana-prompt-quicker"

SOURCE_IDS = {
    "freestylefly/awesome-gpt-image-2": "freestylefly-gpt-image-2",
    "moosl/awsome-gpt-image-2-prompts": "moosl-awesome-gpt-image-2-prompts",
    "open-design": "open-design",
    "original": "awesome-gpt-image2-prompts",
}
SOURCE_HOMEPAGES = {
    BASE_SOURCE_ID: "https://github.com/zhbjerry/prompts",
    "freestylefly-gpt-image-2": "https://github.com/freestylefly/awesome-gpt-image-2",
    "moosl-awesome-gpt-image-2-prompts": "https://github.com/moosl/awsome-gpt-image-2-prompts",
    "open-design": "https://github.com/nexu-io/open-design",
    "awesome-gpt-image2-prompts": "https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts",
}


def single_line(value):
    """规范化单行文本：连续空白折叠成一个空格，去掉首尾空白。"""
    if not value:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def multi_line(value):
    """规范化多行文本：统一换行符，逐行去尾空白，整体去首尾空白。"""
    if not value:
        return ""
    text = str(value).replace("\r\n", "\n").replace("\r", "\n")
    return "\n".join(line.rstrip() for line in text.split("\n")).strip()


def http_url(value):
    """只保留绝对的 HTTP(S) 地址。"""
    url = single_line(value)
    return url if url.startswith(("http://", "https://")) else ""


# 与其它分类口径重复的主分类：统一归并到标准主分类，原分类名降为二级分类。
CATEGORY_ALIASES = {
    "角色肖像": "人像/角色",
    "食物摄影": "摄影",
}


def make_tags(category, sub_category=""):
    """分类标签：`主分类 - 二级分类` 拆成两个标签，其余分类原样保留。

    重复口径的主分类按 CATEGORY_ALIASES 归并，原分类名保留成二级分类。
    """
    parts = [p for p in single_line(category).split(" - ") if p]
    main = single_line(parts[0]) if parts else ""
    sub = single_line(parts[1]) if len(parts) > 1 else ""
    if main in CATEGORY_ALIASES:
        sub = sub or main
        main = CATEGORY_ALIASES[main]
    tags = []
    for item in [main, sub, sub_category]:
        text = single_line(item)
        if text and text not in tags:
            tags.append(text)
    return tags


def apply_category_aliases(record):
    """把已有记录里重复口径的主分类就地归并，原分类名保留成二级分类。"""
    tags = list(record.get("tags") or [])
    if not tags:
        return record
    alias = CATEGORY_ALIASES.get(single_line(tags[0]))
    if not alias:
        return record
    record["tags"] = [alias] + [t for t in [single_line(tags[0])] + list(tags[1:]) if t and t != alias]
    return record


def make_id(source_id, identity):
    """`<sourceId>:<sha256(来源原生 id)[:16]>`，见 PROMPT_RECORD_FORMAT.md 第 4 节。"""
    digest = hashlib.sha256(single_line(identity).encode("utf-8")).hexdigest()[:16]
    return f"{source_id}:{digest}"


def make_record(source_id, identity, title, prompt, description="", cover_url="",
                reference_image_urls=(), tags=(), author="", source_url="",
                created_at="", media_type="image", image_mode="", image_model="",
                title_en="", needs_ref=False, source_item_id=None):
    """按固定键顺序构造一条 v1 记录，扩展键没有值就省略。"""
    title_value = single_line(title)
    title_en_value = single_line(title_en)
    # titleEn 固定英文：上游没给英文名就停下来让人工补，不要用中文标题顶上
    if not title_en_value:
        sys.exit(f"上游条目缺少英文标题，请先补 titleEn 再合并：{source_id} / {identity} / {title_value}")
    record = {
        "id": make_id(source_id, identity),
        "sourceId": source_id,
        "title": title_value,
        "titleEn": title_en_value,
        "prompt": multi_line(prompt),
        "description": multi_line(description),
        "coverUrl": http_url(cover_url),
        "referenceImageUrls": [u for u in (http_url(u) for u in reference_image_urls) if u],
        "tags": list(tags),
        "author": single_line(author),
        "sourceUrl": http_url(source_url) or SOURCE_HOMEPAGES[source_id],
        "createdAt": single_line(created_at),
        "mediaType": single_line(media_type) or "image",
        "imageMode": single_line(image_mode),
        "imageModel": single_line(image_model),
    }
    # 扩展键每条记录都写
    record["needsRef"] = bool(needs_ref)
    record["sourceItemId"] = source_item_id
    return record


def normalize_prompt(text):
    """去空白 + 小写，用于识别重复提示词。"""
    return re.sub(r"\s+", " ", text or "").strip().lower()


def copy_images(source_dir, repo_root, dry_run=False):
    src_img_dir = os.path.join(source_dir, "images")
    dst_img_dir = os.path.join(repo_root, IMAGE_SUBDIR)
    if not os.path.isdir(src_img_dir):
        sys.exit(f"源图片目录不存在：{src_img_dir}")

    copied = skipped = 0
    for name in sorted(os.listdir(src_img_dir)):
        src = os.path.join(src_img_dir, name)
        dst = os.path.join(dst_img_dir, name)
        if not os.path.isfile(src):
            continue
        if os.path.exists(dst) and os.path.getsize(dst) == os.path.getsize(src):
            skipped += 1
            continue
        if not dry_run:
            os.makedirs(dst_img_dir, exist_ok=True)
            shutil.copy2(src, dst)
        copied += 1
    return copied, skipped


def pick_titles(src_item):
    """挑出真正可读的标题。

    源项目里不少条目的 title_cn 被填成了分类名（例如 154 条都叫「UI与界面」），
    真实标题在 title_en 里，源站也是拿 title_en 当主标题展示的。
    这里统一成：title = 可读标题，titleEn = 英文副标题（必填非空，上游没有英文名时由 make_record 回落到 title）。
    """
    cn = single_line(src_item.get("title_cn"))
    en = single_line(src_item.get("title_en"))
    category = single_line(src_item.get("category_cn"))
    if cn and cn != category:
        return cn, en
    return (en or cn), ""


def to_repo_entry(src_item):
    """把一条上游记录转成本项目的 v1 记录。"""
    image = single_line(src_item.get("image"))
    title, title_en = pick_titles(src_item)
    return make_record(
        source_id=SOURCE_IDS[single_line(src_item.get("source"))],
        identity=src_item["id"],
        title=title,
        prompt=src_item["prompt"],
        description=src_item.get("note") or "",
        cover_url=(CDN_ROOT + IMAGE_SUBDIR + "/" + os.path.basename(image)) if image else "",
        tags=make_tags(src_item.get("category_cn"), ""),
        author=src_item.get("author") or src_item.get("source") or "",
        source_url=src_item.get("link") or "",
        image_mode="edit" if src_item.get("needs_ref") else "generate",
        title_en=title_en,
        needs_ref=bool(src_item.get("needs_ref")),
        source_item_id=src_item["id"],
    )


def disambiguate_titles(base, appended, new_entries):
    """让新合并条目的标题在全库唯一。

    源项目里不少条目标题同名（例如 23 条都叫「信息图可视化设计」），而扩展用
    `${title}-${author}` 当收藏和列表的唯一键，重名会互相覆盖。这里只给新合并
    进来的条目加「（2）（3）…」后缀，原有条目保持原样以免破坏已有收藏。
    """
    new_ids = {id(entry) for entry in new_entries}
    taken = {item.get("title") for item in base}
    taken.update(item.get("title") for item in appended if id(item) not in new_ids)

    renamed = 0
    for entry in new_entries:
        title = entry["title"]
        if title in taken:
            number = 2
            while f"{title}（{number}）" in taken:
                number += 1
            entry["title"] = f"{title}（{number}）"
            renamed += 1
        taken.add(entry["title"])
    return renamed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default=DEFAULT_SOURCE, help="awesome-gpt-image2-prompts 目录")
    parser.add_argument("--dry-run", action="store_true", help="只统计，不写文件")
    args = parser.parse_args()

    source_json = os.path.join(args.source, "prompts.json")
    repo_json = os.path.join(REPO_ROOT, "prompts.json")
    if not os.path.isfile(source_json):
        sys.exit(f"源数据不存在：{source_json}")

    with open(source_json, encoding="utf-8") as f:
        source_items = json.load(f)
    with open(repo_json, encoding="utf-8") as f:
        existing = json.load(f)

    # 本项目自有条目：不参与改写
    base = [item for item in existing if item.get("sourceId") == BASE_SOURCE_ID]
    # 之前已经合并进来的条目：按 sourceItemId 复用，保留可能的手工修改
    merged_before = {item["sourceItemId"]: item for item in existing
                     if item.get("sourceItemId") is not None and item.get("sourceId") != BASE_SOURCE_ID}
    base_prompts = {normalize_prompt(item.get("prompt")) for item in base}

    appended = []
    new_entries = []
    reused = 0
    skipped = []
    for src_item in source_items:
        if src_item["id"] in merged_before:
            # 已合并过：复用原记录（保住 id 和可能的手工修改）
            appended.append(merged_before[src_item["id"]])
            reused += 1
        elif normalize_prompt(src_item.get("prompt")) in base_prompts:
            skipped.append((src_item["id"], src_item.get("title_cn")))
        else:
            entry = to_repo_entry(src_item)
            appended.append(entry)
            new_entries.append(entry)
    # 源数据里已经不存在的历史条目照样保留，避免用不完整的源目录跑一次就丢数据
    source_ids = {item["id"] for item in source_items}
    orphans = [item for item in existing
               if item.get("sourceItemId") is not None
               and item.get("sourceId") != BASE_SOURCE_ID
               and item["sourceItemId"] not in source_ids]
    merged = [apply_category_aliases(item) for item in base + appended + orphans]

    # 源项目里不少条目标题是同名的（例如 23 条都叫「信息图可视化设计」），
    # 而扩展用 `${title}-${author}` 当收藏和列表的唯一键，重名会互相覆盖。
    # 这里只给新合并进来的重名条目加序号后缀；原有条目一律不动，避免破坏已有收藏。
    renamed = disambiguate_titles(base, appended, new_entries)

    copied, img_reused = copy_images(args.source, REPO_ROOT, args.dry_run)

    if not args.dry_run:
        with open(repo_json, "w", encoding="utf-8") as f:
            json.dump(merged, f, ensure_ascii=False, indent=2)
            f.write("\n")

    print(f"本项目原有 {len(base)} 条；源项目 {len(source_items)} 条："
          f"新增 {len(appended) - reused} 条，复用 {reused} 条，跳过重复 {len(skipped)} 条")
    print(f"其中 {renamed} 条重名条目已加序号后缀")
    if orphans:
        print(f"源数据里已不存在、按原样保留的历史条目 {len(orphans)} 条")
    if skipped:
        preview = "、".join(f"#{i} {title}" for i, title in skipped[:5])
        print(f"  跳过的重复项：{preview}" + (" …" if len(skipped) > 5 else ""))
    print(f"合计 {len(merged)} 条；主分类 {len({item['tags'][0] for item in merged if item.get('tags')})} 个")
    print(f"图片：复制 {copied} 张，已存在 {img_reused} 张"
          + ("（dry-run 未写入）" if args.dry_run else ""))

    missing = []
    for item in merged:
        cover = item.get("coverUrl") or ""
        if cover.startswith(CDN_ROOT):
            rel = cover[len(CDN_ROOT):]
            if not os.path.exists(os.path.join(REPO_ROOT, rel)):
                missing.append(rel)
    print(f"缺图 {len(missing)} 张" + (f"：{missing[:5]}" if missing else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
