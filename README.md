# 🍌 AI 提示词库

个人自用的 AI 生图提示词合集，收录 GPT Image 2、Nano Banana、Gemini 的精选提示词，方便自己检索、复制和复用。数据集中在根目录 `prompts.json`，网页、Chrome 扩展和油猴脚本共用同一份。

## ✨ 内容

- **777 条提示词** —— 自有的 Nano Banana / Gemini 提示词 + 第三方 GPT Image 2 精选
- **27 个分类** —— 支持二级分类
- **中英文检索** —— 标题、副标题、正文、分类、作者、备注一起搜
- **图片 / 视频区分** —— `mediaType` 标记每条提示词产出图片还是视频；网页、扩展和油猴脚本都用可搜索的下拉筛选（分类，以及类型：图片下含文生图 / 编辑），视频不参与生成方式筛选，卡片带独立角标
- **需参考图提示** —— 标记「需要参考图」的条目，提示先上传参考图
- **效果图预览、一键复制**

## 🚀 使用

### 网页

本地直接打开 `index.html`，或访问 https://zhbjerry.github.io/prompts 。支持关键词搜索、分类筛选、可搜索的类型下拉（图片 / 视频，图片下含文生图 / 编辑）、「最近一周」筛选、复制提示词、查看效果图。

### Chrome 扩展（可选）

1. 打开 `chrome://extensions/`，开启右上角「开发者模式」
2. 点「加载已解压的扩展程序」，选择根目录下的 `extension/`
3. 在 Google AI Studio / Gemini 等站点用页面按钮插入提示词；任意输入框也可右键选择「🍌 Insert Banana Prompts」

### 油猴脚本（可选）

`script.user.js` 与网页、扩展共用同一份 `config.json` 和 `prompts.json`，不依赖第三方服务。

1. 先安装 [Tampermonkey](https://www.tampermonkey.net/)（或支持 `GM_*` API 的脚本管理器）
2. 打开 [script.user.js 的 raw 地址](https://raw.githubusercontent.com/zhbjerry/prompts/main/script.user.js) 安装
3. 在 AI Studio / Gemini 等站点点页面右侧的 🍌 悬浮按钮，或用脚本管理器菜单里的「🍌 Insert Banana Prompts」

支持的站点写在脚本头部的 `@match`；面板里可搜索，并用可搜索下拉按分类和类型（图片 / 视频，图片下含文生图 / 编辑）筛选，另有「收藏 / 自定义 / 最近一周」开关，也能添加自己的提示词。

### 本地管理后台

直接改 `prompts.json` 容易写错格式，用本地管理后台可视化增删改：

```bash
node make/admin/server.js          # 默认 http://localhost:8787
```

- 左侧列表可搜索、按来源 / 分类 / 图片视频筛选，带封面缩略图（点击可放大），支持勾选批量删除
- 「批量模式」切成全宽大图网格、去掉右侧详情，一屏展示更多素材；支持鼠标拖拽框选，按住 Shift / ⌘ 追加选择，一次删除多条
- 右侧表单编辑记录的全部字段，封面与参考图都有实时预览
- 保存时自动规范化、重算 `id` 并跑 `make/validate_json.js`，校验不过会回滚，不会把坏数据写进仓库
- 封面支持选本地图片或从 `coverUrl` 下载，自动压缩后存进 `images/` 并回填 CDN 地址
- 「孤儿图片」先 dry-run 列出没有被任何记录引用、且属于本仓库 CDN 的图片，确认后才删除；删除记录本身只改 JSON，不动图片
- 全部改动只落在本地文件，提交仍走 git

## 📊 数据

| 项目 | 数值 |
| --- | --- |
| 提示词 | 777 条 |
| 主分类 | 27 个 |
| 效果图 | 774 张 |
| 需要参考图 | 178 条 |
| 图片 / 视频 | 738 / 39 |
| 文生图 / 编辑 | 601 / 176 |

来源分布：

| 来源 | 条数 | 说明 |
| --- | --- | --- |
| `banana-prompt-quicker` | 284 | 自有的 Nano Banana / Gemini 提示词 |
| `freestylefly-gpt-image-2` | 308 | [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2) |
| `moosl-awesome-gpt-image-2-prompts` | 99 | [moosl/awsome-gpt-image-2-prompts](https://github.com/moosl/awsome-gpt-image-2-prompts) |
| `open-design` | 82 | [nexu-io/open-design](https://github.com/nexu-io/open-design) |
| `awesome-gpt-image2-prompts` | 4 | [awesome-gpt-image2-prompts](https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts) 的原创条目 |

## 🏷️ 分类

分类写在每条记录的 `tags` 里：`tags[0]` 是主分类，`tags[1]` 是可选的二级分类；筛选和下拉用主分类，二级分类以卡片角标展示并参与搜索。

复合分类（如 `图像模板 - 头像肖像`）写成主分类 `图像模板` + 二级分类 `头像肖像`，与 [awesome-gpt-image2-prompts](https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts) README 的「主要分类」口径一致。

主要分类（≥ 12 条）：

| 分类 | 数量 | 说明 |
| --- | --- | --- |
| UI与界面 | 154 | 各类 UI、界面样机与交互设计 |
| 有趣 | 121 | 纯创意玩法，好玩但不实用 |
| 生活 | 117 | 日常实用场景：换装、修图、家居、美食等 |
| 图像模板 | 43 | 头像肖像、社交媒体海报、游戏 UI、信息图、插画地图等成套模板 |
| 视频模板 | 39 | 电影叙事、动画、短视频、广告、武侠、舞蹈、特效等分镜模板 |
| 信息图设计 | 37 | 信息图表与数据可视化 |
| 工作 | 34 | 各行业提效工具：商务照、电商、封面、PPT 等 |
| 海报设计 | 25 | 各类海报与宣传物料 |
| 其他 | 25 | 长尾创意类别 |
| 3D/手办/潮玩 | 23 | 3D 模型、手办与潮玩 |
| 产品展示图 | 19 | 产品摄影与展示 |
| 动漫/插画 | 16 | 动漫与插画风格 |
| 摄影 | 18 | 各类摄影提示词 |
| 人像/角色 | 19 | 人物角色相关 |
| 学习 | 12 | 学习教育与知识可视化 |
| 3D渲染/材质 | 12 | 3D 渲染与材质 |

其余 11 个长尾分类：插画/艺术（11）、Logo设计（10）、风景/场景（9）、文字渲染（7）、古风/历史（7）、场景/叙事（5）、建筑/空间（4）、广告设计（3）、AI卡牌（3）、文档设计（3）、创意转换（1）。

## 🧩 数据格式

每条记录的字段、空值规则与 id 生成方式见 [PROMPT_RECORD_FORMAT.md](./PROMPT_RECORD_FORMAT.md)：

| 字段 | 说明 |
| --- | --- |
| `id` | `<sourceId>:<16 位小写十六进制>` 稳定标识，卡片编号按数组下标展示 |
| `sourceId` | 来源标识，取值见规范里的来源表 |
| `title` | 单行中文标题 |
| `titleEn` | 英文副标题，必填非空且只能写英文 |
| `prompt` | 提示词正文 |
| `description` | 使用说明（可选） |
| `coverUrl` | 效果图地址，没有则为空串 |
| `referenceImageUrls` | 参考图地址（可选） |
| `tags` | `[分类, 二级分类]`；筛选和下拉用第一个 |
| `author` / `sourceUrl` | 作者 / 原始链接，没有来源链接时回落到来源主页 |
| `createdAt` | 收录时间（可选） |
| `mediaType` | `image`（图片）/ `video`（视频） |
| `imageMode` | `generate`（文生图）/ `edit`（需要参考图） |
| `imageModel` | 模型标识，当前统一为空串 |
| `needsRef` | `true` 表示需要用户上传参考图，缺省 `false` |
| `sourceItemId` | 稳定条目标识：第三方为上游条目 id，自有为本仓库分配的整数序号 |

新增提示词必须按该规范写入 `prompts.json`：`titleEn`、`needsRef`、`sourceItemId` 每条都写，其中 `title` 固定中文、`titleEn` 固定英文且必填非空，`needsRef` 缺省 `false`，`sourceItemId` 必填正整数（自有条目取当前最大值加一，只增不减）。改完数据后跑 `node make/validate_json.js` 确认结构合法。

合并第三方来源提示词（可重复执行，按 `sourceItemId` 复用已合并条目、按提示词文本去重）：

```bash
python3 make/merge_gpt_image2_prompts.py --source ~/Downloads/awesome-gpt-image2-prompts-main
```

效果图与参考图统一平铺存放在 `images/`，文件名为 `img-0001` 起始的顺序编号（同一条记录的多张图用 `_2`、`_3` 后缀保持相邻，不含来源信息）。新增图片后执行 `node make/normalize-images.js`，会自动打平子目录、统一改名并回填 `prompts.json` 里的图片地址。

## 📁 文件说明

- `index.html` —— 可搜索的网页版提示词库
- `prompts.json` —— 提示词数据（格式见 [PROMPT_RECORD_FORMAT.md](./PROMPT_RECORD_FORMAT.md)）
- `PROMPT_RECORD_FORMAT.md` —— 记录格式、JSON 配置规范与校验说明
- `config.json` —— 扩展与脚本共用的站点注入选择器和公告
- `extension/` —— Chrome 扩展源码
- `script.user.js` —— 油猴脚本，与扩展共用 `config.json` 和 `prompts.json`
- `images/` —— 效果图与参考图（统一顺序编号，见 `make/normalize-images.js`）
- `make/` —— 合并第三方来源数据、下载/压缩图片等维护脚本，`make/validate_json.js` 校验全部 JSON
- `make/admin/` —— 本地提示词管理后台（增删改 + 图片上传 + 校验 + 孤儿图片清理）
- `.github/workflows/validate-json.yml` —— 提交时自动校验 JSON
- `privacy.html` —— 隐私政策
- `LICENSE` —— MIT License 与第三方说明
