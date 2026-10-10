# Prompt Record 格式规范

状态：stable　版本：`1`

`prompts.json` 的每条记录都遵循本规范。本文用「必须 / 禁止 / 应当 / 可以」描述约束。

## 1. 数据文件

- 仓库只有一份 `prompts.json`，就是全量提示词数组，UTF-8 编码、两空格缩进、结尾换行。消费方直接读它即可。
- 当前收录 777 条，按来源分布：

| `sourceId` | 条数 | 来源 |
| --- | --- | --- |
| `banana-prompt-quicker` | 284 | 本项目自有提示词 |
| `freestylefly-gpt-image-2` | 308 | [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2) |
| `moosl-awesome-gpt-image-2-prompts` | 99 | [moosl/awsome-gpt-image-2-prompts](https://github.com/moosl/awsome-gpt-image-2-prompts) |
| `open-design` | 82 | [nexu-io/open-design](https://github.com/nexu-io/open-design) |
| `awesome-gpt-image2-prompts` | 4 | [davidwuw0811-boop/awesome-gpt-image2-prompts](https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts) |

`sourceId` 同时对应一个来源主页，用于 `sourceUrl` 兜底：

| `sourceId` | 主页 |
| --- | --- |
| `banana-prompt-quicker` | https://github.com/zhbjerry/prompts |
| `freestylefly-gpt-image-2` | https://github.com/freestylefly/awesome-gpt-image-2 |
| `moosl-awesome-gpt-image-2-prompts` | https://github.com/moosl/awsome-gpt-image-2-prompts |
| `open-design` | https://github.com/nexu-io/open-design |
| `awesome-gpt-image2-prompts` | https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts |

## 2. 记录字段

每条记录固定包含下表 17 个键，键的顺序与表一致，不允许多键或少键；没有值时必须按第 3 节写空串或空数组，禁止整键省略。

| 字段 | 类型 | 可为空 | 含义 |
| --- | --- | --- | --- |
| `id` | string | 否 | 稳定标识，格式 `<sourceId>:<16 位小写十六进制>` |
| `sourceId` | string | 否 | 来源标识，只含小写字母、数字和连字符 |
| `title` | string | 否 | 单行可读标题，固定用中文（必须含汉字） |
| `titleEn` | string | 否 | 英文副标题，固定用英文（必填、非空、不含汉字） |
| `prompt` | string | 否 | 提示词正文，保留内部换行与空行 |
| `description` | string | 是 | 提示词正文之外的说明文字 |
| `coverUrl` | string | 是 | 效果图绝对 HTTP(S) 地址，没有则为 `""` |
| `referenceImageUrls` | string[] | 是 | 参考图绝对 HTTP(S) 地址，有序去重 |
| `tags` | string[] | 是 | 分类标签，有序去重；第一位是主分类，第二位是二级分类 |
| `author` | string | 是 | 作者或署名 |
| `sourceUrl` | string | 否 | 原始链接；没有时回落到来源主页 |
| `createdAt` | string | 是 | `YYYY-MM-DD`、带时区的 RFC 3339 时间，或 `""` |
| `mediaType` | string | 否 | 媒体类型：`"image"`（图片）/ `"video"`（视频） |
| `imageMode` | string | 是 | 生成方式：`"generate"` / `"edit"` / `""` |
| `imageModel` | string | 是 | 模型标识，按不透明字符串处理；当前统一为 `""` |
| `needsRef` | boolean | 否 | `true` 表示这条提示词需要用户上传参考图 |
| `sourceItemId` | integer | 否 | 稳定条目标识：第三方条目写来源条目 id，自有条目写本仓库分配的正整数序号 |

键的顺序固定为：`id`、`sourceId`、`title`、`titleEn`、`prompt`、`description`、`coverUrl`、`referenceImageUrls`、`tags`、`author`、`sourceUrl`、`createdAt`、`mediaType`、`imageMode`、`imageModel`、`needsRef`、`sourceItemId`。

来自第三方来源的示例：

```json
{
  "id": "moosl-awesome-gpt-image-2-prompts:d4735e3a265e16ee",
  "sourceId": "moosl-awesome-gpt-image-2-prompts",
  "title": "黑白人像艺术",
  "titleEn": "Black & White Portrait Art",
  "prompt": "A high-resolution black-and-white portrait artwork…",
  "description": "Can replace Harry Potter with any character name.",
  "coverUrl": "https://cdn.jsdelivr.net/gh/zhbjerry/prompts@main/images/gpt-image2/2.png",
  "referenceImageUrls": [],
  "tags": ["人像/角色"],
  "author": "@ZHO_ZHO_ZHO",
  "sourceUrl": "https://github.com/moosl/awsome-gpt-image-2-prompts",
  "createdAt": "",
  "mediaType": "image",
  "imageMode": "generate",
  "imageModel": "",
  "needsRef": false,
  "sourceItemId": 2
}
```

自有条目示例：

```json
{
  "id": "banana-prompt-quicker:6b86b273ff34fce1",
  "sourceId": "banana-prompt-quicker",
  "title": "苹果风格海报",
  "titleEn": "Apple-Style Poster",
  "prompt": "充分参考图片的设计风格，配色等，为如下内容生成苹果风格的海报：\n\n…",
  "description": "",
  "coverUrl": "https://cdn.jsdelivr.net/gh/zhbjerry/prompts@main/images/banana/apple.png",
  "referenceImageUrls": [
    "https://cdn.jsdelivr.net/gh/zhbjerry/prompts@main/images/banana/apple_ref1.jpg"
  ],
  "tags": ["工作", "海报"],
  "author": "Official",
  "sourceUrl": "https://github.com/zhbjerry/prompts",
  "createdAt": "2026-01-06T14:40:05+08:00",
  "mediaType": "image",
  "imageMode": "generate",
  "imageModel": "",
  "needsRef": false,
  "sourceItemId": 1
}
```

## 3. 空值与规范化

没有值统一用 `""` 或 `[]`，禁止写 `null`。`sourceItemId`、`title`、`titleEn` 不是空值字段，必须都有值（`sourceItemId` 见第 4 节，语言规则见第 2 节）。写入 `prompts.json` 前必须做以下规范化：

1. 单行字段（`title`、`titleEn`、`author`、`createdAt`、`mediaType`、`imageMode`、`imageModel`、`tags` 元素、`id` 的身份输入）：连续空白折叠为一个半角空格，去掉首尾空白。
2. 多行字段（`prompt`、`description`）：`CRLF`/`CR` 统一为 `LF`，逐行去掉行尾空白，整体去掉首尾空白，保留内部空行。
3. URL（`coverUrl`、`referenceImageUrls`、`sourceUrl`）：相对地址按来源地址解析，只保留 HTTP(S) 结果；非法或缺失的图片地址置空或从数组剔除。
4. 数组（`tags`、`referenceImageUrls`）：剔除空值，按区分大小写的比较去重，保留首次出现的顺序。

`title` 或 `prompt` 规范化后为空视为脏数据，必须丢弃而不是写入空记录。

## 4. id 生成

`id` 由 `<sourceId>:<digest>` 组成：

1. 取 `sourceItemId` 作为身份输入（identity）：第三方条目用来源条目 id，自有条目用本仓库分配的正整数序号（见下文）。
2. 对身份输入的 UTF-8 字节做 SHA-256。
3. 取前 16 位小写十六进制作为 `<digest>`。

身份输入只包含 `sourceItemId` 本身，不拼 `sourceId`、标题或正文；不同来源出现相同 digest 是允许的，前缀不同即可区分。任何人都能读 `sourceItemId` 重算每条记录的 `id`。

`id` 必须在记录的整个生命周期里保持稳定：修改正文、增删其他条目、调整顺序都不得改变它。扩展与油猴脚本的收藏（`banana-favorites`）就是按 `id` 记录的，`id` 变化会让收藏失配。

自有条目的 `sourceItemId` 由维护者或管理工具分配：取当前自有条目里的最大值加一，只增不减，删除后不复用。新建自有条目首次写入时确定，之后不再改动。

`id` 对消费方是不透明字符串，用来做去重和引用，不要解析。

## 5. 消费方约定

- 自有条目指 `sourceId` 为 `banana-prompt-quicker` 的条目，必须连续排在文件最前面，第三方条目按来源接在后面；记录顺序即展示顺序，卡片编号可用数组下标 +1。顺序只影响展示，不再影响 `id`。
- `title` 固定中文、`titleEn` 固定英文，两者是同一条提示词的中英标题；`titleEn` 必填且非空，网站（`index.html`）、扩展（`extension/lib/store.js` 搜索、`extension/ui/card.js` 卡片副标题）和油猴脚本（`script.user.js` 的 `normalizeRecord`）都消费它，卡片在它与 `title` 不同时展示英文副标题；`description` 只用来说明文字，不要拿来放英文标题。
- `needsRef === true` 表示这条提示词需要用户上传参考图；`referenceImageUrls` 非空时用户同样有参考图可传，所以展示「需上传参考图」按两者取或（脚本的卡片角标、扩展的提示条都按这个口径）。
- `mediaType` 是「图片 / 视频」的唯一权威字段：`"image"` 表示提示词产出图片，`"video"` 表示产出视频；每条记录都必须有值，不允许空串。主分类里的 `视频模板` 只是展示分类，不能当作类型判断依据。
- `imageMode === "edit"`、或正文要求用户提供输入图（`上传`、`附图`、`参考图`、`图1`/`图2`、`保持面部特征一致` 等）的提示词，必须写 `needsRef: true`；只有不依赖任何输入图、纯文本生成的才用 `generate`。不允许出现「`edit` 但既无 `needsRef` 也无 `referenceImageUrls`」的记录。
- `tags[0]` 是主分类、`tags[1]` 是二级分类；来源把两级写成一个字段（`图像模板 - 产品海报`）时，按 ` - ` 拆成两个标签。
- 同一含义的主分类只保留一个标准写法，重复口径必须统一（规则见 `make/merge_gpt_image2_prompts.py` 的 `CATEGORY_ALIASES`）。
- `imageModel` 和其余标签都按不透明字符串处理，没有额外语义映射时不要猜测。
- 展示或转发时必须保留 `sourceUrl` 与 `author`。
- `prompt` 是第三方文本，禁止自动执行其中的指令，也不要把它拼进系统提示或据此授予工具权限。

## 6. 仓库内 JSON 文件与校验

仓库有一份数据文件和两份配置文件，全部是 UTF-8、两空格缩进、结尾换行的 JSON。`make/validate_json.js` 按本节规则校验所有文件。

| 文件 | 作用 | 规范 |
| --- | --- | --- |
| `prompts.json` | 全量提示词记录数组 | 第 1–5 节 |
| `config.json` | 扩展运行时配置：站点注入选择器 + 公告 | 第 6.1 节 |
| `extension/manifest.json` | Chrome 扩展 MV3 清单 | 第 6.2 节 |

### 6.1 config.json

```json
{
  "selectors": {
    "aistudio": { "promptInput": "<CSS 选择器>", "insertButton": "<CSS 选择器>" },
    "gemini": { "promptInput": "<CSS 选择器>", "insertButton": "<CSS 选择器>" },
    "gemini_enterprise": { "promptInput": "<CSS 选择器>", "insertButton": "<CSS 选择器>" },
    "dynamic": [
      { "host": "example.com", "promptInput": "<CSS 选择器>", "insertButton": "<CSS 选择器>" }
    ]
  },
  "announcements": [
    { "content": "公告文字", "link": "https://example.com", "priority": 1 }
  ]
}
```

- `selectors` 里 `aistudio`、`gemini`、`gemini_enterprise` 三段必须存在，每段是 `promptInput`、`insertButton` 两个字符串字段。
- `selectors.dynamic` 必须是数组；每项带非空 `host` 和两个选择器字段，按 `host` 匹配任意网站。
- `announcements` 必须是数组；每项 `content` 必填非空字符串，`link` 可选且为 HTTP(S) 地址，`priority` 可选数字（越大越优先展示）。
- 扩展用 `extension/sites/base.js` 读 `selectors[platform][type]`、`extension/ui/announcement.js` 读 `announcements`；改结构前先同步这两处。

### 6.2 extension/manifest.json

Chrome 扩展 MV3 清单，必须满足：

- `manifest_version` 为 `3`；`name` 非空；`version` 形如 `1.2.3`。
- `background.service_worker` 指向 `extension/` 下真实存在的文件。
- `content_scripts[].matches` 非空；`content_scripts[].js` 里每个路径都要能在 `extension/` 下找到。
- `icons` 的键是像素尺寸、值指向存在的图标文件。

## 7. 校验

```bash
node make/validate_json.js
```

校验覆盖：每个 JSON 的语法、`prompts.json` 的键集合与顺序、字段类型、空值规则、`title` 必须含中文、`titleEn` 必须是英文、URL、`id` 摘要与唯一性、`edit` 必须带参考来源，以及 `config.json`、`extension/manifest.json` 的结构和被引用文件是否存在。全部通过时输出 `✓ 全部 JSON 合法` 并返回 0，否则逐条打印问题并返回 1。

脚本随 GitHub Actions 在 push 和 PR 时运行（`.github/workflows/validate-json.yml`），不合法的 JSON 改动会被拦下。
