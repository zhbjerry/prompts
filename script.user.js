// ==UserScript==
// @name                Banana Prompt Quicker
// @namespace           https://github.com/zhbjerry/prompts
// @version             1.5.0
// @description         提示词快捷插入面板：网页版 / Chrome 扩展 / 油猴脚本共用同一份 prompts.json
// @author              Glidea
// @author              Johnbi
// @author              zhbjerry
// @license             MIT
// @match               https://aistudio.google.com/*
// @exclude             https://aistudio.google.com/app/_/*
// @exclude             https://aistudio.google.com/about:blank
// @match               https://gemini.google.com/*
// @exclude             https://gemini.google.com/_/*
// @exclude             https://gemini.google.com/about:blank
// @match               https://*.hf.space/*
// @match               https://x.com/i/grok
// @match               https://*.perplexity.ai/*
// @match               https://linuxdo.xuleo.com/*
// @match               https://sd.exacg.cc/*
// @match               https://copilot.microsoft.com/*
// @match               https://lmarena.ai/*
// @icon                data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY2xhc3M9Imljb25pZnkgaWNvbmlmeS0tbm90byI+PHBhdGggZD0iTTExOS4yMiA5NS4xMmMtMS4xNCAyLjM2LTUuOTEgMi4yMS04LjU0IDEuMzgtNi43Mi0yLjEyLTEwLjktNy45LTEwLjktNy45TDY1LjE0IDczLjlsLTEwLjYxLTUuNTdzLTIuMDYtMy41IDIuMDYtNi4xNyA3LjAxLTIuODcgNy4wMS0yLjg3bDExLjk0IDcuNnM3LjcxLTYgMTUuNTQtNi45MWM3LjQ4LS44NiAxNi43OSA1LjIyIDE5LjI0IDE2LjcgMS45OSA5LjMxIDUuMTQgMTIuNTkgNi4wOSAxMy44Ljk1IDEuMjIgMy43OSAyLjYyIDIuODEgNC42NHoiIGZpbGw9IiNmZjhlMDAiLz48cGF0aCBkPSJNNzcuNzIgMzIuMTVDNzQuNjUgMjEuOTkgNzAuNzcgMTAuMSA2NC45MSA2LjAzYy01LjE5LTMuNi0xMC4yNC0yLjk1LTEyLjY0LTEuMzggMCAwLTQuMzMgMS43Ny01LjQ3IDYuMjQtMS44OCA3LjM0LjU5IDE2LjE1IDIuMiAyNS4yNSAxLjYxIDkuMSAyLjQ1IDE1LjM2IDMuMTggMjIuNjcuMDcuNjYgMTIuMTYgMjIuMTggMTIuMTYgMjIuMThsOS42NSA1LjE3czcuMzctMTUuOTQgNy4yNi0xOC4xOWMtLjEtMi4yNi0xLjI5LTI4LjQtMy41My0zNS44MnoiIGZpbGw9IiNmZmU0YjQiLz48cGF0aCBkPSJNNTIuNTUgNjYuOTRjLS4xMyAyLjQzIDUuNzMgMjEuOCA1LjczIDIxLjhMNzQgODYuMTRzMTEuMTUtNi42IDExLjQ2LTE4LjU3Yy40OC0xOC4wNS0yLjYxLTI2LjU1LTQuODUtMzMuOTctMy4wOC0xMC4xNC05Ljk0LTIzLjUtMTUuNzUtMjcuNjQtMy40MS0yLjQzLTcuMTktMi43OS04Ljc0LTIuNDkgMCAwIDEwLjMyIDguMDggMTUuNTQgMjEuOXM2LjQ1IDI5Ljc5IDYuNDUgMjkuNzktMy44NCAyLjgzLTEyLjkgNC4xM2MtNyAxLjAxLTEzLjA0LS43LTEzLjA0LS43cy41NSA1LjI3LjM4IDguMzV6IiBmaWxsPSIjZmZlMjY1Ii8+PHBhdGggZD0iTTg1LjMzIDgzLjc1bC02LjI5LTEzLjE0LjM0LTQuNjhzMS4zNC0zLjkzLTcuMDMgMi40MmMtMy44OCAyLjk0LTYuMjIgOC4zNi02LjIyIDguMzZzLTEuMTgtMi45Mi01LjMyLTYuNzhjLTMuNjgtMy40Mi04LjYzLTUuMDgtOC42My01LjA4cy0xMC4yOC0yLTExLjQtMS4xM2MtNy4yNSA1LjY2LTEyLjU1IDEyLjU1LTEyLjU1IDEyLjU1TDIyLjkgOTYuNDJsLTguODYgNS40M3MyLjQyIDMuNTQgNS45MiAyLjIyYzIuNzMtMS4wMyA2LjExLTQuMTIgNy45My04LjAxIDIuNS01LjM1IDcuNzUtMTUuNDcgMTAuNDItMTguNjcgNS4xNi02LjE2IDEwLjIyLTguNDEgMTMuOTktNi42MiA0LjI5IDIuMDMuODYgMjIuMjkuODYgMjIuMjlsLTI3LjU4IDIzLjIxLS40NyAzLjE2czQuMDEgMy44NSAxNS4wNiAzLjQ5IDI1LjgzLTQuNDUgMzUuMTgtMTcuMmM4LjI1LTExLjI0IDkuOTgtMjEuOTcgOS45OC0yMS45N3oiIGZpbGw9IiNmZmE3MjYiLz48cGF0aCBkPSJNNjMuNTggODQuOTZjLjI0IDUuNTUtMy4yMiAxMy45Ni0xMS4yMiAyMC45Ny03Ljk5IDcuMDEtMTYuNDMgOS4zMy0yMS42NyA5LjczLTMuOC4yOS00LjkzLTEuODgtNC45My0xLjg4czcuNjYtNy4wNSAxMy4zNS0xMi43YzUuNC01LjM3IDExLjI4LTE2LjY1IDEyLjU2LTIxLjg0IDEuMjgtNS4xOS4xMi04LjY4LjEyLTguNjhzMi40OC42OSA2LjEzIDQuMzVjMy41NCAzLjU1IDUuNTMgNi45NyA1LjY2IDEwLjA1eiIgZmlsbD0iI2ZmYjgwMyIvPjxwYXRoIGQ9Ik0yOS40NSAxMTguNzRjLS44MyAxLjkzLTMuNjggMi4wMS00LjkyLjk0LTEuMTctMS4wMS0yLjMxLTMuMDItMS4xMy01LjI3Ljc4LTEuNDggMy4zNC0xLjg5IDQuNzgtLjc0czIuMDIgMy4zMiAxLjI3IDUuMDd6IiBmaWxsPSIjODc1YjU0Ii8+PHBhdGggZD0iTTIzLjc2IDk3Ljg0Yy0zLjI4IDQuNTUtNi41NyA1LjI0LTcuOTMgNS4zOS0xLjE5LjE0LTIuNDktMS4zOC0yLjM0LTIuNzguMTUtMS40IDIuNDUtMy4zNyAyLjczLTcuNjcuMjgtNC4zLS4wNi0yMC4wNyA4LjY5LTI5LjEzIDYuMTctNi4zOCAxMy43My00LjE4IDE4LjYxLTIuNDkgNS41IDEuOSA4LjY3IDMuNyA4LjY3IDMuN3MtNC41LS4zMS0xMi4yNiA1LjgxYy00LjUxIDMuNTYtNy4xNiA4LjQ1LTkuNjYgMTQuMDYtMS44IDQuMDYtNC4yIDkuOTEtNi41MSAxMy4xMXoiIGZpbGw9IiNmZWU0YjQiLz48cGF0aCBkPSJNMTExIDEwOS41OGMtLjkyIDEuODQtMy4xNyAyLjk4LTUuMTYgMi44OS00LjIxLS4xOC04LjA1LTIuMzUtMTIuMy03LjgzLTYuMDEtNy43Ni0xMS4yNC0yNi4zOC0xNS4xNi0zMS4zNC0yLjY1LTMuMzUtNS45NS01LjAxLTUuOTUtNS4wMXMxLjgyLTEuNTQgMy42NC0yLjQ5YzEuODItLjk1IDYuMjItLjUgNi4yMi0uNWwxOC43OCAzMC4xOCA5LjkzIDE0LjF6IiBmaWxsPSIjZmViODA0Ii8+PHBhdGggZD0iTTEwMC4zOSA2OC40NmM0LjEyIDUuODkgNC42NiAxMS4wNiA1LjI4IDE2LjM0LjU2IDQuNzcgMS43MSAxNC44IDMuNDQgMTguMDcgMS43NCAzLjI3IDMuNDMgNS40IDEuNTYgNy4zOXMtNy4zNyAxLjI4LTExLjMyLTMuMDJjLTMuMTgtMy40Ny00Ljk0LTcuMjUtNy4zMy0xMi44LTIuMzktNS41NS01LjkxLTE4LjY1LTEwLjQ4LTI0LjU3LTIuOTItMy43OC01LjgzLTMuODktNS44My0zLjg5czMuODUtMy4xNCAxMS4yLTMuMjJjNi41OS0uMDcgMTAuMDUuOCAxMy40OCA1Ljd6IiBmaWxsPSIjZmZlNGI0Ii8+PC9zdmc+
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_xmlhttpRequest
// @grant               GM_log
// @grant               GM_openInTab
// @grant               GM_registerMenuCommand
// @grant               GM_addStyle
// @connect             raw.githubusercontent.com
// @source              https://github.com/zhbjerry/prompts
// @homepageURL         https://github.com/zhbjerry/prompts
// @supportURL          https://github.com/zhbjerry/prompts/issues
// @downloadURL         https://raw.githubusercontent.com/zhbjerry/prompts/main/script.user.js
// @updateURL           https://raw.githubusercontent.com/zhbjerry/prompts/main/script.user.js
// ==/UserScript==
//

; (function () {
    'use strict'

        // 部分站点（如 copilot.microsoft.com）启用了 Trusted Types，未注册默认策略会拦截注入的内容
        ; (function () {
            if (typeof window != 'undefined' && 'trustedTypes' in window && 'createPolicy' in window.trustedTypes && typeof window.trustedTypes.createPolicy == 'function' && window.trustedTypes.defaultPolicy == null) {
                window.trustedTypes.createPolicy('default', { createScriptURL: (s) => s, createScript: (s) => s, createHTML: (s) => s })
            }
        })()

    GM_addStyle('#prompts-modal, #prompts-modal *, #prompts-modal *::before, #prompts-modal *::after{ font-family: Roboto,"Helvetica Neue",sans-serif; };')
    GM_addStyle('#prompts-search-section, #prompts-search-section *{ box-sizing: content-box; line-height: normal; };')
    GM_addStyle('#prompts-modal button{ margin: 0; padding: 0;};')
    GM_addStyle(':root { --prompts-modal-z-index: 100; --base-z-index: 1; }')
    // 面板内的滚动条跟随主题，避免在深色面板里出现亮色滚动条
    GM_addStyle('#prompts-modal ::-webkit-scrollbar{ width: 8px; height: 8px; }')
    GM_addStyle('#prompts-modal ::-webkit-scrollbar-track{ background: transparent; }')
    GM_addStyle('#prompts-modal ::-webkit-scrollbar-thumb{ background: rgba(128,128,128,.45); border-radius: 8px; }')
    GM_addStyle('#prompts-modal ::-webkit-scrollbar-thumb:hover{ background: rgba(128,128,128,.7); }')

    // 图标全部内联为 data URI，脚本不依赖任何外部静态资源
    const REPO_URL = 'https://github.com/zhbjerry/prompts'
    const RAW_BASE_URL = 'https://raw.githubusercontent.com/zhbjerry/prompts/main'
    const SITE_URL = 'https://zhbjerry.github.io/prompts'

    const FLASH_MODE_ICON =
        'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
                '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#2c0f5e"/></linearGradient></defs>' +
                '<rect width="400" height="300" fill="url(#g)"/>' +
                '<path d="M228 52L132 168h58l-18 80 96-118h-58l18-78z" fill="#ffe066"/>' +
                '<circle cx="330" cy="66" r="26" fill="#ffffff" opacity="0.12"/>' +
                '<circle cx="70" cy="240" r="40" fill="#ffffff" opacity="0.08"/>' +
                '</svg>'
        )

    // 效果图缺失或加载失败时的占位图
    function createPlaceholderImage(theme) {
        return (
            'data:image/svg+xml;charset=utf-8,' +
            encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
                    '<rect width="400" height="300" fill="' +
                    (theme === 'dark' ? '#2c2c2e' : '#f5f5f7') +
                    '"/>' +
                    '<path d="M150 190l40-50 30 36 25-28 55 62H150z" fill="#c7c7cc"/>' +
                    '<circle cx="255" cy="105" r="18" fill="#c7c7cc"/>' +
                    '</svg>'
            )
        )
    }

    // --- Polyfills for Chrome Extension API ---
    // 模拟 chrome.storage 使用 GM_storage
    const mockStorage = {
        get: (keys) =>
            new Promise((resolve) => {
                let result = {}
                const keyList = Array.isArray(keys) ? keys : [keys]
                keyList.forEach((key) => {
                    result[key] = GM_getValue(key)
                })
                resolve(result)
            }),
        set: (items) =>
            new Promise((resolve) => {
                for (const [key, value] of Object.entries(items)) {
                    GM_setValue(key, value)
                }
                resolve()
            }),
    }

    const chrome = {
        storage: {
            local: mockStorage,
            sync: mockStorage, // Tampermonkey 统一使用本地存储
        },
    }

    // 辅助函数：使用 GM_xmlhttpRequest 替代 fetch 以避免 CSP 问题
    function gmFetchJson(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            resolve(JSON.parse(response.responseText))
                        } catch (e) {
                            reject(e)
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${response.status}`))
                    }
                },
                onerror: function (err) {
                    reject(err)
                },
            })
        })
    }

    // prompts.json 采用 Prompt Record v1（见 PROMPT_RECORD_FORMAT.md），面板内部仍按旧字段渲染，
    // 这里在数据入口统一转换；非本仓库结构（无 sourceId）的记录原样返回。
    const SOURCE_HOMEPAGES = {
        'banana-prompt-quicker': 'https://github.com/zhbjerry/prompts',
        'freestylefly-gpt-image-2': 'https://github.com/freestylefly/awesome-gpt-image-2',
        'moosl-awesome-gpt-image-2-prompts': 'https://github.com/moosl/awsome-gpt-image-2-prompts',
        'open-design': 'https://github.com/nexu-io/open-design',
        'awesome-gpt-image2-prompts': 'https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts',
    }

    function normalizeRecord(record) {
        if (!record || !record.sourceId) return record
        const tags = Array.isArray(record.tags) ? record.tags : []
        const refs = Array.isArray(record.referenceImageUrls) ? record.referenceImageUrls : []
        const homepage = SOURCE_HOMEPAGES[record.sourceId]
        return {
            id: record.id,
            title: record.title,
            title_en: record.titleEn || '',
            preview: record.coverUrl || '',
            prompt: record.prompt,
            author: record.author,
            link: record.sourceUrl && record.sourceUrl !== homepage ? record.sourceUrl : '',
            mode: record.imageMode || 'generate',
            media_type: record.mediaType || 'image',
            category: tags[0] || '',
            sub_category: tags[1] || '',
            needs_ref: record.needsRef === true || refs.length > 0,
            source: record.sourceId,
            note: record.description || '',
            created: record.createdAt || '',
            reference_image_urls: refs,
        }
    }

    // --- ConfigManager (unified prompts + config) ---
    const ConfigManager = (() => {
        const configDetails = {
            url: `${RAW_BASE_URL}/config.json`,
            cacheKey: 'banana_config_cache_v2',
            cacheTsKey: 'banana_config_cache_v2_time',
            defaultValue: null,
        }

        const promptsDetails = {
            url: `${RAW_BASE_URL}/prompts.json`,
            cacheKey: 'banana_prompts_cache_v2',
            cacheTsKey: 'banana_prompts_cache_v2_time',
            defaultValue: [],
        }

        const CACHE_DURATION = 60 * 60 * 1000 // 60 min
        const inflight = new Map()

        async function getJsonWithCache(details) {
            const { url, cacheKey: key, cacheTsKey: tsKey, defaultValue } = details
            const cache = await chrome.storage.local.get([key, tsKey])
            const cachedData = cache[key]
            const cacheTimestamp = cache[tsKey]
            const now = Date.now()

            if (cachedData != null && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
                return cachedData
            }

            // 同一份 JSON 的并发请求合并成一个，避免首次打开面板时重复拉取
            if (inflight.has(key)) {
                return inflight.get(key)
            }

            const task = (async () => {
                try {
                    const data = await gmFetchJson(url)
                    await chrome.storage.local.set({ [key]: data, [tsKey]: Date.now() })
                    return data
                } catch (e) {
                    GM_log(`[Banana] Failed to fetch JSON from ${url}:`, e)
                    return cachedData ?? defaultValue
                }
            })()
            inflight.set(key, task)

            try {
                return await task
            } finally {
                inflight.delete(key)
            }
        }

        return {
            async get() {
                return getJsonWithCache(configDetails)
            },
            async getSelectors(platform, type) {
                const cfg = await this.get()
                const selectors = cfg && (cfg.selectors || cfg.selector)
                return selectors?.[platform]?.[type]
            },
            async getPrompts() {
                const data = await getJsonWithCache(promptsDetails)
                return (Array.isArray(data) ? data : []).map(normalizeRecord).filter(Boolean)
            },
            async getNsfwEnabled() {
                const key = 'banana-nsfw-enabled'
                const cache = await chrome.storage.local.get([key])
                return cache[key] || false
            },
            async setNsfwEnabled(enabled) {
                await chrome.storage.local.set({ 'banana-nsfw-enabled': enabled })
            },
        }
    })()

    // 默认主题颜色配置
    function getDefaultThemeColors(theme = 'light') {
        if (theme === 'dark') {
            return {
                background: '#141414',
                surface: '#1c1c1e',
                border: '#38383a',
                text: '#f5f5f7',
                textSecondary: '#98989d',
                primary: '#0a84ff',
                hover: '#2c2c2e',
                inputBg: '#1c1c1e',
                inputBorder: '#38383a',
                shadow: 'rgba(0,0,0,0.5)',
                surfaceHover: '#2c2c2e',
            }
        }

        return {
            background: '#ffffff',
            surface: '#f5f5f7',
            border: '#d2d2d7',
            text: '#1d1d1f',
            textSecondary: '#6e6e73',
            primary: '#007aff',
            hover: '#e8e8ed',
            inputBg: '#ffffff',
            inputBorder: '#d2d2d7',
            shadow: 'rgba(0,0,0,0.1)',
            surfaceHover: '#e8e8ed',
        }
    }

    // 20251127: switch to ConfigManager (config.json) only — remove selectors.json legacy usage
    async function getRemoteSelector(platform, type) {
        return ConfigManager.getSelectors(platform, type)
    }

    const FLASH_MODE_PROMPT = {
        title: '灵光模式',
        preview: FLASH_MODE_ICON,
        prompt: `你现在进入【灵光模式: 有灵感就够了】。请按照以下步骤辅助我完成创作：
1. 需求理解：分析我输入的粗略的想法描述（可能会包含图片）
2. 需求澄清：要求我做出细节澄清，提出 3 个你认为最重要的选择题（A/B/C/D），以明确我的生图或修图需求（例如风格、构图、光影、具体相关细节等）。请一次性列出这三个问题
3. 最终执行：等待我回答选择题后，根据我的原始描述和选择结果调用绘图工具生成图片（如果有附图，请务必作为参数传递给绘图工具，以保证一致性）

---

OK，我想要：`,
        link: 'https://www.xiaohongshu.com/user/profile/5f7dc54d0000000001004afb',
        author: 'Official@glidea',
        isFlash: true,
    }

    // 类型筛选：大类（图片 / 视频）+ 图片下的二级（文生图 / 编辑），视频不参与生成方式筛选
    const TYPE_OPTIONS = [
        { key: 'all', label: '全部', media: 'all', mode: 'all', level: 0 },
        { key: 'image', label: '图片', media: 'image', mode: 'all', level: 0 },
        { key: 'image:generate', label: '文生图', media: 'image', mode: 'generate', level: 1, parent: 'image' },
        { key: 'image:edit', label: '编辑', media: 'image', mode: 'edit', level: 1, parent: 'image' },
        { key: 'video', label: '视频', media: 'video', mode: 'all', level: 0 },
    ]
    const TYPE_MAP = {}
    TYPE_OPTIONS.forEach((option) => { TYPE_MAP[option.key] = option })

    function matchesType(prompt, option) {
        if (option.media !== 'all' && (prompt.media_type === 'video' ? 'video' : 'image') !== option.media) return false
        if (option.mode !== 'all' && (prompt.mode === 'edit' ? 'edit' : 'generate') !== option.mode) return false
        return true
    }

    function typeLabelOf(key) {
        const option = TYPE_MAP[key]
        if (!option || option.level === 0) return option ? option.label : '全部'
        return (TYPE_MAP[option.parent] ? TYPE_MAP[option.parent].label + ' › ' : '') + option.label
    }

    // 通用下拉筛选：支持搜索、悬停展开（移动端只用点击），分类与类型共用
    function createFilterDropdown(config) {
        const { colors, mobile } = config
        let open = false
        let query = ''

        const container = document.createElement('div')
        container.style.cssText = 'position: relative;'

        const trigger = document.createElement('div')
        trigger.style.cssText = `padding: ${mobile ? '10px 14px' : '8px 12px'}; border: 1px solid ${colors.border}; border-radius: 16px; background: ${colors.surface}; color: ${colors.text}; font-size: ${mobile ? '14px' : '13px'}; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s; min-width: 80px; justify-content: space-between; user-select: none;`

        const triggerText = document.createElement('span')
        triggerText.style.cssText = 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; text-align: center;'

        const arrowIcon = document.createElement('span')
        arrowIcon.innerHTML = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1L5 5L9 1"/></svg>'
        arrowIcon.style.cssText = 'display: flex; align-items: center; transition: transform 0.2s; opacity: 0.6;'

        trigger.appendChild(triggerText)
        trigger.appendChild(arrowIcon)

        const panel = document.createElement('div')
        panel.style.cssText = `position: absolute; top: 100%; left: 0; margin-top: 8px; min-width: 220px; max-width: calc(100vw - 32px); background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 16px; box-shadow: 0 10px 40px ${colors.shadow}; display: none; flex-direction: column; overflow: hidden; backdrop-filter: blur(20px); max-height: 320px; z-index: calc(var(--base-z-index) + 20);`

        const searchWrap = document.createElement('div')
        searchWrap.style.cssText = `padding: 8px; border-bottom: 1px solid ${colors.border};`
        const searchInput = document.createElement('input')
        searchInput.type = 'text'
        searchInput.placeholder = config.searchPlaceholder || '搜索…'
        searchInput.style.cssText = `width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid ${colors.border}; border-radius: 10px; background: ${colors.surface}; color: ${colors.text}; font-size: 13px; outline: none;`
        searchInput.oninput = () => { query = searchInput.value; renderOptions() }
        searchInput.onclick = (e) => e.stopPropagation()
        searchWrap.appendChild(searchInput)

        const optionsEl = document.createElement('div')
        optionsEl.style.cssText = `overflow-y: auto; padding: 4px; scrollbar-width: thin; scrollbar-color: ${colors.border} transparent;`

        panel.appendChild(searchWrap)
        panel.appendChild(optionsEl)
        container.appendChild(trigger)
        container.appendChild(panel)

        function openPanel() {
            open = true
            query = ''
            searchInput.value = ''
            renderOptions()
            panel.style.display = 'flex'
            arrowIcon.style.transform = 'rotate(180deg)'
        }
        function close() {
            open = false
            panel.style.display = 'none'
            arrowIcon.style.transform = 'rotate(0deg)'
        }
        function renderOptions() {
            const selected = config.getSelectedKey()
            triggerText.textContent = config.label + '：' + config.labelOf(selected)
            const all = config.options()
            const q = query.trim().toLowerCase()
            const visible = all.filter((option) => {
                if (!q) return true
                if (option.label.toLowerCase().indexOf(q) !== -1) return true
                return all.some((child) => child.parent === option.key && child.label.toLowerCase().indexOf(q) !== -1)
            })

            optionsEl.innerHTML = ''
            if (!visible.length) {
                const empty = document.createElement('div')
                empty.textContent = '没有匹配项'
                empty.style.cssText = `padding: 12px; text-align: center; color: ${colors.textSecondary}; font-size: 13px;`
                optionsEl.appendChild(empty)
                return
            }
            visible.forEach((option) => {
                const isSelected = option.key === selected
                const row = document.createElement('div')
                row.style.cssText = `padding: 9px 12px; border-radius: 10px; font-size: 13px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; white-space: nowrap; ${option.level === 1 ? 'padding-left: 24px;' : ''} ${isSelected ? `background: ${colors.primary}20; color: ${colors.primary}; font-weight: 600;` : `color: ${colors.text};`}`
                const labelEl = document.createElement('span')
                labelEl.textContent = option.label
                const countEl = document.createElement('span')
                countEl.textContent = String(option.count)
                countEl.style.cssText = `font-size: 12px; color: ${colors.textSecondary};`
                row.appendChild(labelEl)
                row.appendChild(countEl)
                row.onmouseenter = () => { if (!isSelected) row.style.background = colors.surfaceHover }
                row.onmouseleave = () => { row.style.background = isSelected ? `${colors.primary}20` : 'transparent' }
                row.onclick = (e) => {
                    e.stopPropagation()
                    config.onSelect(option.key)
                    renderOptions()
                    close()
                }
                optionsEl.appendChild(row)
            })
        }

        trigger.onclick = (e) => {
            e.stopPropagation()
            if (open) close(); else openPanel()
        }
        if (!mobile) {
            trigger.onmouseenter = () => {
                trigger.style.borderColor = colors.primary
                trigger.style.boxShadow = `0 2px 8px ${colors.shadow}`
            }
            trigger.onmouseleave = () => {
                trigger.style.borderColor = colors.border
                trigger.style.boxShadow = 'none'
            }
            container.onmouseenter = openPanel
            container.onmouseleave = close
        }

        document.addEventListener('click', (e) => {
            if (open && !container.contains(e.target)) close()
        })

        return { container, refresh: renderOptions, close }
    }

    // --- modal.js Logic ---
    class BananaModal {
        constructor(adapter) {
            this.adapter = adapter
            this.modal = null
            this.activeFilters = new Set()
            this.prompts = []
            this.customPrompts = []
            this.categories = new Set(['全部'])
            this.selectedCategory = 'all'
            this.selectedType = 'all'
            this.sortMode = 'recommend' // 'recommend' | 'random'
            this.nsfwEnabled = false
            this.currentPage = 1
            this.pageSize = this.isMobile() ? 8 : 12
            this.filteredPrompts = []
            this.favorites = []
            this.keyboardHandler = this.handleKeyboard.bind(this)
            this._isInitialized = false // 用于区分首次显示和重新显示
            this.loadFailed = false
            this.randomMap = new Map()

            this.loadNsfwEnabled()
            this.loadPrompts()
            this.loadSortMode()
        }

        async loadPrompts() {
            const staticPrompts = await ConfigManager.getPrompts()
            this.loadFailed = staticPrompts.length === 0
            this.customPrompts = await this.getCustomPrompts()
            this.prompts = [...this.customPrompts, ...staticPrompts]

            // Aggregate categories
            this.categories = new Set(['全部'])
            this.prompts.forEach((p) => {
                if (p.category) {
                    if (this.nsfwEnabled || p.category !== 'NSFW') {
                        this.categories.add(p.category)
                    }
                }
                if (p.category === 'NSFW') {
                    p.nsfw = true
                }
            })

            this.ensureRandomValues()

            this.refreshDropdowns()
            // 只在首次加载或有必要时重置页码
            await this.applyFilters(!this._isInitialized)
        }

        ensureRandomValues() {
            this.prompts.forEach((p) => {
                const key = `${p.title}-${p.author}`
                if (!this.randomMap.has(key)) {
                    this.randomMap.set(key, Math.random())
                }
                p._randomVal = this.randomMap.get(key)
            })
        }

        buildSearchText(prompt) {
            return [prompt.title, prompt.title_en, prompt.prompt, prompt.note, prompt.author, prompt.category, prompt.sub_category]
                .filter((value) => typeof value === 'string' && value)
                .join('\n')
                .toLowerCase()
        }

        refreshDropdowns() {
            if (this.categoryDropdown) this.categoryDropdown.refresh()
            if (this.typeDropdown) this.typeDropdown.refresh()
        }

        categoryOptions() {
            const counts = {}
            this.prompts.forEach((prompt) => {
                const key = prompt.category || '未分类'
                counts[key] = (counts[key] || 0) + 1
            })
            const list = Array.from(this.categories).filter((cat) => cat !== '全部')
                .sort((a, b) => (counts[b] || 0) - (counts[a] || 0) || a.localeCompare(b))
            return [{ key: 'all', label: '全部', level: 0, count: this.prompts.length }]
                .concat(list.map((cat) => ({ key: cat, label: cat, level: 0, count: counts[cat] || 0 })))
        }

        typeOptions() {
            return TYPE_OPTIONS.map((option) => ({
                key: option.key,
                label: option.label,
                level: option.level,
                parent: option.parent,
                count: this.prompts.filter((prompt) => matchesType(prompt, option)).length,
            }))
        }

        async loadSortMode() {
            const result = await chrome.storage.local.get(['banana-sort-mode'])
            this.sortMode = result['banana-sort-mode'] || 'recommend'
        }

        async setSortMode(mode) {
            this.sortMode = mode
            await chrome.storage.local.set({ 'banana-sort-mode': mode })
        }

        async loadNsfwEnabled() {
            const result = await ConfigManager.getNsfwEnabled()
            this.nsfwEnabled = result === true
        }

        async getCustomPrompts() {
            const result = await chrome.storage.local.get(['banana-custom-prompts'])
            return result['banana-custom-prompts'] || []
        }

        async compressImage(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (event) => {
                    const img = new Image()
                    img.src = event.target.result
                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        const MAX_WIDTH = 300
                        const MAX_HEIGHT = 300
                        let width = img.width
                        let height = img.height

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width
                                width = MAX_WIDTH
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height
                                height = MAX_HEIGHT
                            }
                        }

                        canvas.width = width
                        canvas.height = height
                        const ctx = canvas.getContext('2d')
                        ctx.drawImage(img, 0, 0, width, height)

                        // 压缩为 JPEG, 质量 0.7
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
                        resolve(dataUrl)
                    }
                    img.onerror = reject
                }
                reader.onerror = reject
            })
        }

        show() {
            if (!this.modal) {
                this.modal = this.createModal()
                document.body.appendChild(this.modal)
            }
            this.modal.style.display = 'flex'
            if (!this._isInitialized) {
                // 首次显示：完整初始化
                this.refreshDropdowns()
                this.applyFilters(true).then(() => (this._isInitialized = true))
            } else {
                // 重新显示：只刷新数据，保留状态
                this.loadPrompts()
            }
            // 添加键盘事件监听器
            document.addEventListener('keydown', this.keyboardHandler)
        }

        hide() {
            if (this.modal) {
                this.modal.style.display = 'none'
            }
            // 移除键盘事件监听器
            document.removeEventListener('keydown', this.keyboardHandler)
        }

        isMobile() {
            return window.innerWidth <= 768
        }

        // 加载动画的样式只按主题注入一次，避免每次渲染卡片都往页面里塞一份
        ensureSpinnerStyle(colors) {
            if (!this._spinnerStyleKeys) this._spinnerStyleKeys = new Set()
            const key = `${colors.border}|${colors.primary}`
            if (this._spinnerStyleKeys.has(key)) return
            this._spinnerStyleKeys.add(key)

            GM_addStyle(`
                @keyframes banana-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .banana-spinner {
                    width: 24px;
                    height: 24px;
                    border: 3px solid ${colors.border};
                    border-top: 3px solid ${colors.primary};
                    border-radius: 50%;
                    animation: banana-spin 1s linear infinite;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -12px;
                    margin-left: -12px;
                    z-index: 1;
                }`)
        }

        createModal() {
            const colors = this.adapter.getThemeColors()
            const mobile = this.isMobile()

            const modalElement = document.createElement('div')
            modalElement.id = 'prompts-modal'
            modalElement.style.cssText =
                'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: var(--prompts-modal-z-index);'

            const container = document.createElement('div')
            container.style.cssText = `background: ${colors.background}; border-radius: ${mobile ? '24px 24px 0 0' : '20px'}; box-shadow: 0 20px 60px ${colors.shadow}; max-width: ${mobile ? '100%' : '900px'}; width: ${mobile ? '100%' : '90%'}; max-height: ${mobile ? '90vh' : '85vh'}; display: flex; flex-direction: column; ${mobile ? 'margin-top: auto;' : ''}; overflow: visible;`

            const searchSection = this.createSearchSection(colors, mobile)
            const content = this.createContent(colors, mobile)

            container.appendChild(searchSection)
            container.appendChild(content)
            modalElement.appendChild(container)

            modalElement.addEventListener('click', (e) => {
                if (e.target === modalElement) {
                    this.hide()
                }
            })

            if (mobile) {
                modalElement.addEventListener('touchstart', (e) => {
                    if (e.target === modalElement) {
                        this.hide()
                    }
                })
            }

            return modalElement
        }

        createSearchSection(colors, mobile) {
            const searchSection = document.createElement('div')
            searchSection.id = 'prompts-search-section'
            searchSection.style.cssText = `padding: ${mobile ? '16px' : '20px 24px'}; border-bottom: 1px solid ${colors.border}; display: flex; ${mobile ? 'flex-direction: column; gap: 12px;' : 'align-items: center; gap: 16px;'}; overflow: visible; position: relative;`

            // 搜索框容器
            const searchContainer = document.createElement('div')
            searchContainer.style.cssText = `${mobile ? 'width: 100%;' : 'flex: 1;'} display: flex; align-items: center; gap: 8px; position: relative;`

            const searchInput = document.createElement('input')
            searchInput.type = 'text'
            searchInput.id = 'prompt-search'
            searchInput.placeholder = '搜索...'
            searchInput.style.cssText = `flex: 1; padding: ${mobile ? '14px 20px' : '12px 18px'}; border: 1px solid ${colors.inputBorder}; border-radius: 16px; outline: none; font-size: ${mobile ? '16px' : '14px'}; background: ${colors.inputBg}; color: ${colors.text}; box-sizing: border-box; transition: all 0.2s;`
            searchInput.addEventListener('input', () => this.applyFilters(true))

            searchInput.addEventListener('focus', () => {
                searchInput.style.borderColor = colors.primary
            })
            searchInput.addEventListener('blur', () => {
                const currentColors = this.adapter.getThemeColors()
                searchInput.style.borderColor = currentColors.inputBorder
            })

            // Sort Mode Button
            const sortBtnContainer = document.createElement('div')
            sortBtnContainer.style.cssText = 'position: relative; display: flex; align-items: center;'

            const sortBtn = document.createElement('button')
            sortBtn.id = 'sort-mode-btn'
            const currentModeText = this.sortMode === 'recommend' ? '随机焕新' : '推荐排序'
            sortBtn.innerHTML =
                this.sortMode === 'recommend'
                    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
                    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>'
            sortBtn.style.cssText = `padding: ${mobile ? '10px' : '8px'}; border: none; background: transparent; color: ${colors.textSecondary}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border-radius: 8px;`
            sortBtn.onclick = () => this.toggleSortMode()

            // Tooltip
            const tooltip = document.createElement('div')
            tooltip.id = 'sort-tooltip'
            tooltip.textContent = `切换${currentModeText}`
            tooltip.style.cssText = `position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); background: ${colors.surface}; color: ${colors.text}; padding: 6px 12px; border-radius: 8px; font-size: 12px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; box-shadow: 0 4px 12px ${colors.shadow}; border: 1px solid ${colors.border};`

            if (!mobile) {
                sortBtn.onmouseenter = () => {
                    sortBtn.style.color = colors.primary
                    sortBtn.style.transform = 'scale(1.1)'
                    sortBtn.style.background = `${colors.primary}10`
                    tooltip.style.opacity = '1'
                }
                sortBtn.onmouseleave = () => {
                    sortBtn.style.color = colors.textSecondary
                    sortBtn.style.transform = 'scale(1)'
                    sortBtn.style.background = 'transparent'
                    tooltip.style.opacity = '0'
                }
            }

            sortBtnContainer.appendChild(sortBtn)
            sortBtnContainer.appendChild(tooltip)

            searchContainer.appendChild(searchInput)
            searchContainer.appendChild(sortBtnContainer)

            const filterContainer = document.createElement('div')
            filterContainer.style.cssText = `display: flex; gap: 8px; align-items: center; ${mobile ? 'justify-content: space-between; flex-wrap: wrap;' : ''}; position: relative;`

            // 分类 / 类型下拉（支持搜索、悬停展开）
            this.categoryDropdown = createFilterDropdown({
                colors,
                mobile,
                label: '分类',
                searchPlaceholder: '搜索分类…',
                options: () => this.categoryOptions(),
                getSelectedKey: () => this.selectedCategory,
                labelOf: (key) => (key === 'all' ? '全部' : key),
                onSelect: (key) => {
                    this.selectedCategory = key
                    this.refreshDropdowns()
                    this.applyFilters(true)
                },
            })

            this.typeDropdown = createFilterDropdown({
                colors,
                mobile,
                label: '类型',
                searchPlaceholder: '搜索类型…',
                options: () => this.typeOptions(),
                getSelectedKey: () => this.selectedType,
                labelOf: typeLabelOf,
                onSelect: (key) => {
                    this.selectedType = TYPE_MAP[key] ? key : 'all'
                    this.refreshDropdowns()
                    this.applyFilters(true)
                },
            })

            const dropdownsContainer = document.createElement('div')
            dropdownsContainer.style.cssText = `display: flex; gap: 8px; align-items: center; ${mobile ? 'flex-wrap: wrap;' : ''}`
            dropdownsContainer.appendChild(this.categoryDropdown.container)
            dropdownsContainer.appendChild(this.typeDropdown.container)

            const buttonsContainer = document.createElement('div')
            buttonsContainer.style.cssText = `display: flex; gap: 8px; ${mobile ? 'flex: 1; justify-content: space-between;' : ''}`

            const filters = [
                { key: 'favorite', label: '收藏' },
                { key: 'custom', label: '自定义' },
            ]

            filters.forEach((filter) => {
                const btn = document.createElement('button')
                btn.id = `filter-${filter.key}`
                btn.textContent = filter.label
                btn.style.cssText = `padding: ${mobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.border}; border-radius: 20px; background: ${colors.surface}; color: ${colors.text}; font-size: ${mobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation;`
                btn.onclick = () => this.toggleFilter(filter.key)
                buttonsContainer.appendChild(btn)
            })

            const addBtn = document.createElement('button')
            addBtn.textContent = '+'
            addBtn.title = '添加自定义 Prompt'
            addBtn.style.cssText = `padding: ${mobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.primary}; border-radius: 20px; background: ${colors.primary}; color: white; font-size: ${mobile ? '18px' : '16px'}; font-weight: 600; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center; line-height: 1; box-shadow: 0 2px 8px ${colors.shadow};`
            addBtn.onclick = () => this.showAddPromptModal()

            buttonsContainer.appendChild(addBtn)

            filterContainer.appendChild(dropdownsContainer)
            filterContainer.appendChild(buttonsContainer)

            searchSection.appendChild(searchContainer)
            searchSection.appendChild(filterContainer)

            return searchSection
        }

        createContent(colors, mobile) {
            const container = document.createElement('div')
            container.style.cssText = 'flex: 1; display: flex; flex-direction: column; overflow: hidden;'

            const scrollArea = document.createElement('div')
            scrollArea.id = 'prompts-scroll-area'
            scrollArea.style.cssText = `flex: 1; overflow-y: auto; padding: ${mobile ? '16px' : '20px 24px'}; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: ${colors.border} transparent;`

            const grid = document.createElement('div')
            grid.id = 'prompts-grid'
            grid.style.cssText = `display: grid; grid-template-columns: ${mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'}; gap: ${mobile ? '12px' : '16px'};`

            scrollArea.appendChild(grid)

            const pagination = document.createElement('div')
            pagination.id = 'prompts-pagination'
            pagination.style.cssText = `padding: ${mobile ? '12px' : '16px'}; border-top: 1px solid ${colors.border}; display: flex; justify-content: center; align-items: center; gap: 16px; background: ${colors.surface}; border-radius: ${mobile ? '0' : '0 0 20px 20px'};`

            container.appendChild(scrollArea)
            container.appendChild(pagination)

            return container
        }

        toggleFilter(filterKey) {
            const btn = document.getElementById(`filter-${filterKey}`)
            if (!btn) return

            const colors = this.adapter.getThemeColors()
            const mobile = this.isMobile()

            const setInactiveStyle = (targetBtn) => {
                targetBtn.style.cssText = `padding: ${mobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.border}; border-radius: 20px; background: ${colors.surface}; color: ${colors.text}; font-size: ${mobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation;`

                if (!mobile) {
                    targetBtn.onmouseenter = () => {
                        targetBtn.style.transform = 'scale(1.05)'
                        targetBtn.style.boxShadow = `0 2px 8px ${colors.shadow}`
                    }
                    targetBtn.onmouseleave = () => {
                        targetBtn.style.transform = 'scale(1)'
                        targetBtn.style.boxShadow = 'none'
                    }
                }
            }

            if (this.activeFilters.has(filterKey)) {
                this.activeFilters.delete(filterKey)
                setInactiveStyle(btn)
            } else {
                this.activeFilters.add(filterKey)
                btn.style.cssText = `padding: ${mobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.primary}; border-radius: 20px; background: ${colors.primary}; color: white; font-size: ${mobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation; box-shadow: 0 2px 8px ${colors.shadow};`

                if (!mobile) {
                    btn.onmouseenter = () => {
                        btn.style.transform = 'scale(1.05)'
                        btn.style.boxShadow = `0 4px 12px ${colors.shadow}`
                    }
                    btn.onmouseleave = () => {
                        btn.style.transform = 'scale(1)'
                        btn.style.boxShadow = `0 2px 8px ${colors.shadow}`
                    }
                }
            }

            this.applyFilters(true)
        }

        async toggleSortMode() {
            const newMode = this.sortMode === 'recommend' ? 'random' : 'recommend'
            await this.setSortMode(newMode)
            if (newMode === 'random') {
                this.randomMap.clear()
                this.ensureRandomValues()
            }

            // 更新按钮图标和 tooltip
            const sortBtn = document.getElementById('sort-mode-btn')
            const tooltip = document.getElementById('sort-tooltip')
            if (sortBtn) {
                const currentModeText = newMode === 'recommend' ? '随机焕新' : '推荐排序'
                sortBtn.innerHTML =
                    newMode === 'recommend'
                        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
                        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>'

                if (tooltip) {
                    tooltip.textContent = `切换${currentModeText}`
                }
            }

            // 重新应用过滤和排序
            this.applyFilters(true)
        }

        async applyFilters(resetPage = true) {
            const searchInput = document.getElementById('prompt-search')
            const keyword = searchInput ? searchInput.value.toLowerCase() : ''

            this.favorites = await this.getFavorites()

            let filtered = this.prompts.filter((prompt) => {
                const matchesSearch = !keyword || this.buildSearchText(prompt).includes(keyword)

                if (!matchesSearch) return false

                // Category Filter
                if (this.selectedCategory !== 'all' && prompt.category !== this.selectedCategory) {
                    return false
                }

                // 类型筛选：图片 / 视频，图片下再分文生图 / 编辑
                if (!matchesType(prompt, TYPE_MAP[this.selectedType] || TYPE_MAP.all)) {
                    return false
                }

                // NSFW Filter
                if (!this.nsfwEnabled && prompt.nsfw === true) {
                    return false
                }

                if (this.activeFilters.size === 0) return true

                const promptId = `${prompt.title}-${prompt.author}`
                const isFavorite = this.favorites.includes(promptId)

                return Array.from(this.activeFilters).every((filter) => {
                    if (filter === 'favorite') return isFavorite
                    if (filter === 'custom') return prompt.isCustom
                    return false
                })
            })

            // Sort: Favorites > Custom > Others (根据 sortMode)
            // 先分组
            const favoriteItems = []
            const customItems = []
            const normalItems = []

            filtered.forEach((item) => {
                const itemId = `${item.title}-${item.author}`
                const isFavorite = this.favorites.includes(itemId)

                if (isFavorite) {
                    favoriteItems.push(item)
                } else if (item.isCustom) {
                    customItems.push(item)
                } else {
                    normalItems.push(item)
                }
            })

            // 普通项根据 sortMode 排序
            if (this.sortMode === 'random') {
                normalItems.sort((a, b) => a._randomVal - b._randomVal)
            }
            // recommend 模式下保持原顺序

            // 合并：Flash Mode > 收藏 > 自定义 > 普通
            filtered = [...favoriteItems, ...customItems, ...normalItems]

            // Always prepend Flash Mode
            filtered.unshift(FLASH_MODE_PROMPT)

            this.filteredPrompts = filtered

            // 智能处理页码：只在需要时重置，或者当前页超出范围时调整
            if (resetPage) {
                this.currentPage = 1
            } else {
                // 确保当前页在有效范围内
                const totalPages = Math.ceil(this.filteredPrompts.length / this.pageSize)
                if (this.currentPage > totalPages && totalPages > 0) {
                    this.currentPage = totalPages
                }
            }

            this.renderCurrentPage()
        }

        renderCurrentPage() {
            const grid = document.getElementById('prompts-grid')
            if (!grid) return

            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            const pageItems = this.filteredPrompts.slice(start, end)

            grid.innerHTML = ''

            if (this.loadFailed) {
                const colors = this.adapter.getThemeColors()
                const notice = document.createElement('div')
                notice.textContent = '提示词数据加载失败，请检查网络后重新打开面板'
                notice.style.cssText = `grid-column: 1 / -1; padding: 12px 16px; border-radius: 12px; background: ${colors.surface}; border: 1px solid ${colors.border}; color: ${colors.textSecondary}; font-size: 13px; text-align: center;`
                grid.appendChild(notice)
            }

            if (pageItems.length === 0) {
                const placeholder = document.createElement('div')
                const colors = this.adapter.getThemeColors()
                const mobile = this.isMobile()
                const columns = mobile ? 2 : 4
                const rows = Math.ceil(this.pageSize / columns)
                const cardMinHeight = mobile ? 240 : 260
                const gap = mobile ? 12 : 16
                const minHeight = rows * cardMinHeight + (rows - 1) * gap

                placeholder.style.cssText = `
                        grid-column: 1 / -1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: ${minHeight}px;
                        color: ${colors.textSecondary};
                        font-size: ${mobile ? '14px' : '16px'};
                    `
                placeholder.textContent = '没有找到相关提示词'
                grid.appendChild(placeholder)
            } else {
                pageItems.forEach((prompt) => {
                    const card = this.createPromptCard(prompt, this.favorites)
                    grid.appendChild(card)
                })

                if (pageItems.length < this.pageSize) {
                    const remaining = this.pageSize - pageItems.length
                    const mobile = this.isMobile()
                    const cardMinHeight = mobile ? 240 : 260
                    for (let i = 0; i < remaining; i++) {
                        const placeholder = document.createElement('div')
                        placeholder.style.cssText = `min-height: ${cardMinHeight}px; opacity: 0; pointer-events: none;`
                        grid.appendChild(placeholder)
                    }
                }
            }

            const scrollArea = document.getElementById('prompts-scroll-area')
            if (scrollArea) scrollArea.scrollTop = 0

            this.renderPagination()
        }

        renderPagination() {
            const pagination = document.getElementById('prompts-pagination')
            if (!pagination) return

            const totalPages = Math.ceil(this.filteredPrompts.length / this.pageSize)
            const colors = this.adapter.getThemeColors()
            const mobile = this.isMobile()

            pagination.innerHTML = ''

            if (totalPages <= 1) {
                pagination.style.display = 'none'
                return
            }

            if (mobile) {
                pagination.style.cssText = `padding: 12px; border-top: 1px solid ${colors.border}; display: flex; flex-direction: column; align-items: center; gap: 12px; background: ${colors.surface}; border-radius: 0;`
            } else {
                pagination.style.cssText = `padding: 16px 24px; border-top: 1px solid ${colors.border}; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; background: ${colors.surface}; border-radius: 0 0 20px 20px;`
            }

            const createBtn = (text, disabled, onClick) => {
                const btn = document.createElement('button')
                btn.textContent = text
                btn.disabled = disabled
                btn.style.cssText = `padding: ${mobile ? '10px 20px' : '8px 18px'}; border: 1px solid ${colors.border}; border-radius: 12px; background: ${disabled ? colors.surface : colors.primary}; color: ${disabled ? colors.textSecondary : '#fff'}; cursor: ${disabled ? 'not-allowed' : 'pointer'}; font-size: ${mobile ? '14px' : '13px'}; transition: all 0.25s ease; opacity: ${disabled ? 0.5 : 1}; font-weight: 500; user-select: none;`
                if (!disabled) {
                    btn.onclick = onClick
                    if (!mobile) {
                        btn.onmouseenter = () => {
                            btn.style.transform = 'scale(1.05)'
                            btn.style.boxShadow = `0 4px 12px ${colors.shadow}`
                        }
                        btn.onmouseleave = () => {
                            btn.style.transform = 'scale(1)'
                            btn.style.boxShadow = 'none'
                        }
                    }
                }
                return btn
            }

            const prevBtn = createBtn('上一页', this.currentPage === 1, () => this.changePage(-1))

            const pageInfo = document.createElement('div')
            const editablePageBtn = document.createElement('input')
            editablePageBtn.id = 'current-page-input'
            editablePageBtn.type = 'number'
            editablePageBtn.value = this.currentPage
            editablePageBtn.min = 1
            editablePageBtn.max = totalPages
            editablePageBtn.style.cssText = `width: fit-content; max-width: 100px; padding: ${mobile ? '8px' : '6px'}; border: 1px solid ${colors.border}; border-radius: 12px; background: ${colors.surface}; text-align: center; outline: none; box-sizing: border-box; margin: 0 8px;color: inherit; font-size: inherit; font-weight: inherit;`
            editablePageBtn.onchange = () => {
                let val = parseInt(editablePageBtn.value)
                if (isNaN(val) || val < 1) val = 1
                if (val > totalPages) val = totalPages
                this.currentPage = val
                this.renderCurrentPage()
            }
            const otherPageInfo = document.createElement('span')
            otherPageInfo.textContent = `/ ${totalPages}`
            otherPageInfo.style.width = '1.8rem'
            pageInfo.style.cssText = `color: ${colors.text}; font-size: ${mobile ? '14px' : '13px'}; font-weight: 500; display: flex; align-items: center; justify-content: center;`
            pageInfo.appendChild(editablePageBtn)
            pageInfo.appendChild(otherPageInfo)

            const nextBtn = createBtn('下一页', this.currentPage === totalPages, () => this.changePage(1))

            const controlsWrapper = document.createElement('div')
            controlsWrapper.style.cssText = 'display: flex; align-items: center; gap: 16px;'
            controlsWrapper.appendChild(prevBtn)
            controlsWrapper.appendChild(pageInfo)
            controlsWrapper.appendChild(nextBtn)

            const socialContainer = document.createElement('div')
            socialContainer.style.cssText = `display: flex; align-items: center; gap: ${mobile ? '12px' : '16px'}; justify-content: ${mobile ? 'center' : 'flex-end'};`

            const repoLink = document.createElement('a')
            repoLink.href = REPO_URL
            repoLink.target = '_blank'
            repoLink.title = 'GitHub 仓库'
            repoLink.innerHTML = `<svg fill="currentColor" height="20" width="20" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`
            repoLink.style.cssText = `color: ${colors.textSecondary}; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; padding: 8px; border-radius: 50%; cursor: pointer;`

            socialContainer.appendChild(repoLink)

            if (mobile) {
                pagination.appendChild(controlsWrapper)
                const spacer = document.createElement('div')
                pagination.appendChild(spacer)
            } else {
                const spacer = document.createElement('div')
                pagination.appendChild(spacer)
                pagination.appendChild(controlsWrapper)
                pagination.appendChild(socialContainer)
            }
        }

        changePage(delta) {
            this.currentPage += delta
            this.renderCurrentPage()
        }

        handleKeyboard(event) {
            if (!this.modal || this.modal.style.display === 'none') return
            const activeElement = document.activeElement
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) return
            const totalPages = Math.ceil(this.filteredPrompts.length / this.pageSize)
            if (totalPages <= 1) return
            if (event.key === 'ArrowLeft') {
                event.preventDefault()
                if (this.currentPage > 1) this.changePage(-1)
            } else if (event.key === 'ArrowRight') {
                event.preventDefault()
                if (this.currentPage < totalPages) this.changePage(1)
            }
        }

        createPromptCard(prompt, favorites) {
            const promptId = `${prompt.title}-${prompt.author}`
            const isFavorite = favorites.includes(promptId)
            const colors = this.adapter.getThemeColors()
            const theme = this.adapter.getCurrentTheme()
            const mobile = this.isMobile()

            const card = document.createElement('div')
            card.className = 'prompt-card'
            card.style.cssText = `background: ${colors.surface}; border-radius: 16px; border: 1px solid ${colors.border}; cursor: pointer; overflow: hidden; transition: all 0.3s ease; min-height: ${mobile ? '240px' : '260px'}; position: relative; touch-action: manipulation; display: flex; flex-direction: column;`

            if (!mobile) {
                card.addEventListener('mouseenter', () => {
                    card.style.boxShadow = `0 8px 24px ${colors.shadow}`
                    card.style.transform = 'translateY(-4px)'
                })
                card.addEventListener('mouseleave', () => {
                    card.style.boxShadow = 'none'
                    card.style.transform = 'translateY(0)'
                })
            }

            const imgContainer = document.createElement('div')
            imgContainer.style.cssText = `width: 100%; height: ${mobile ? '180px' : '200px'}; position: relative; background: ${colors.surfaceHover}; overflow: hidden;`

            const spinner = document.createElement('div')
            spinner.className = 'banana-spinner'
            this.ensureSpinnerStyle(colors)

            const placeholder = createPlaceholderImage(theme)
            const img = document.createElement('img')
            img.alt = prompt.title
            img.src = prompt.preview || placeholder
            img.style.cssText = `width: 100%; height: 100%; object-fit: cover; flex-shrink: 0; opacity: 0; transition: opacity 0.3s ease; position: relative;`

            img.onload = () => {
                img.style.opacity = '1'
                spinner.style.display = 'none'
            }
            img.onerror = () => {
                spinner.style.display = 'none'
                imgContainer.onclick = img.onclick
                if (img.dataset.fallback) return
                img.dataset.fallback = '1'
                img.style.objectFit = 'contain'
                img.style.opacity = '1'
                img.src = placeholder
            }

            // Check if already cached/loaded
            if (img.complete) {
                img.style.opacity = '1'
                spinner.style.display = 'none'
            }

            img.onclick = () => this.adapter.insertPrompt(prompt.prompt)

            imgContainer.appendChild(spinner)
            imgContainer.appendChild(img)

            const favoriteBtn = document.createElement('button')
            const favBtnBg = isFavorite ? 'rgba(255,193,7,0.9)' : theme === 'dark' ? 'rgba(48,49,52,0.9)' : 'rgba(255,255,255,0.9)'
            const favBtnColor = isFavorite ? '#000' : theme === 'dark' ? '#e8eaed' : '#5f6368'

            favoriteBtn.style.cssText = `position: absolute; top: 12px; right: 12px; width: ${mobile ? '36px' : '32px'}; height: ${mobile ? '36px' : '32px'}; border-radius: 50%; border: none; background: ${favBtnBg}; color: ${favBtnColor}; font-size: ${mobile ? '16px' : '14px'}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15); backdrop-filter: blur(10px); touch-action: manipulation;`
            favoriteBtn.textContent = isFavorite ? '⭐' : '☆'
            favoriteBtn.onclick = (e) => {
                e.stopPropagation()
                this.toggleFavorite(promptId)
            }

            const content = document.createElement('div')
            content.style.cssText = 'padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 8px; justify-content: flex-start; min-height: 0; overflow: hidden;'

            const title = document.createElement('h3')
            title.style.cssText = `font-size: ${mobile ? '15px' : '14px'}; font-weight: 500; color: ${colors.text}; margin: 0; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`
            title.textContent = prompt.title
            title.onclick = () => this.adapter.insertPrompt(prompt.prompt)

            const bottomRow = document.createElement('div')
            bottomRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-top: 4px;'

            const author = document.createElement('span')
            author.style.cssText = `font-size: ${mobile ? '13px' : '12px'}; color: ${colors.textSecondary}; font-weight: 400; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; margin-right: 8px;`
            author.textContent = prompt.author

            if (prompt.link) {
                author.style.textDecoration = 'underline'
                author.onclick = (e) => {
                    e.stopPropagation()
                    GM_openInTab(prompt.link, { active: true })
                }
            } else {
                author.onclick = () => this.adapter.insertPrompt(prompt.prompt)
            }

            const modeTag = document.createElement('span')
            let tagText = '生图'
            let tagBg = ''
            let tagColor = ''

            if (prompt.isFlash) {
                tagText = '万能'
                // Special Flash Mode styling (e.g., purple/gradient)
                tagBg = theme === 'dark' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(147, 51, 234, 0.12)'
                tagColor = theme === 'dark' ? '#a855f7' : '#9333ea'
            } else {
                const isEdit = prompt.mode === 'edit'
                tagText = isEdit ? '编辑' : '生图'
                tagBg = theme === 'dark' ? (isEdit ? 'rgba(10, 132, 255, 0.15)' : 'rgba(48, 209, 88, 0.15)') : isEdit ? 'rgba(0, 122, 255, 0.12)' : 'rgba(52, 199, 89, 0.12)'
                tagColor = theme === 'dark' ? (isEdit ? '#0a84ff' : '#30d158') : isEdit ? '#007aff' : '#34c759'
            }

            modeTag.style.cssText = `background: ${tagBg}; color: ${tagColor}; padding: 4px 10px; border-radius: 12px; font-size: ${mobile ? '12px' : '11px'}; font-weight: 600; backdrop-filter: blur(10px); flex-shrink: 0;`
            modeTag.textContent = tagText

            if (prompt.media_type === 'video') {
                const videoTag = document.createElement('span')
                videoTag.textContent = '视频'
                videoTag.title = '视频提示词'
                videoTag.style.cssText = `background: ${theme === 'dark' ? 'rgba(255, 159, 10, 0.15)' : 'rgba(255, 149, 0, 0.14)'}; color: ${theme === 'dark' ? '#ff9f0a' : '#c93400'}; padding: 4px 8px; border-radius: 12px; font-size: ${mobile ? '12px' : '11px'}; font-weight: 600; flex-shrink: 0; margin-left: 6px;`
                bottomRow.appendChild(videoTag)
            }

            if (prompt.needs_ref) {
                const refTag = document.createElement('span')
                refTag.textContent = '需参考图'
                refTag.title = '需要先上传参考图'
                refTag.style.cssText = `background: ${theme === 'dark' ? 'rgba(255, 159, 10, 0.15)' : 'rgba(255, 149, 0, 0.14)'}; color: ${theme === 'dark' ? '#ff9f0a' : '#c93400'}; padding: 4px 8px; border-radius: 12px; font-size: ${mobile ? '12px' : '11px'}; font-weight: 600; flex-shrink: 0; margin-left: 6px;`
                bottomRow.appendChild(refTag)
            }

            bottomRow.appendChild(author)
            bottomRow.appendChild(modeTag)
            content.appendChild(title)
            content.appendChild(bottomRow)

            if (prompt.isCustom) {
                const btnBg = theme === 'dark' ? 'rgba(48,49,52,0.9)' : 'rgba(255,255,255,0.9)'
                const btnColor = theme === 'dark' ? '#e8eaed' : '#5f6368'

                // 编辑按钮
                const editBtn = document.createElement('button')
                editBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`
                editBtn.title = '编辑'
                editBtn.style.cssText = `position: absolute; top: 12px; left: 12px; width: ${mobile ? '36px' : '32px'}; height: ${mobile ? '36px' : '32px'}; border-radius: 50%; border: none; background: ${btnBg}; color: ${btnColor}; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s ease; z-index: 2; backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.15);`

                editBtn.onclick = (e) => {
                    e.stopPropagation()
                    this.showAddPromptModal(prompt)
                }

                if (!mobile) {
                    editBtn.addEventListener('mouseenter', () => {
                        editBtn.style.transform = 'scale(1.15)'
                        editBtn.style.boxShadow = '0 6px 16px rgba(0,122,255,0.4)'
                    })
                    editBtn.addEventListener('mouseleave', () => {
                        editBtn.style.transform = 'scale(1)'
                        editBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                    })
                }

                // 删除按钮
                const deleteBtn = document.createElement('button')
                deleteBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`
                deleteBtn.title = '删除'
                deleteBtn.style.cssText = `position: absolute; top: 12px; left: ${mobile ? '56px' : '48px'}; width: ${mobile ? '36px' : '32px'}; height: ${mobile ? '36px' : '32px'}; border-radius: 50%; border: none; background: ${btnBg}; color: ${btnColor}; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s ease; z-index: 2; backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.15);`
                deleteBtn.onclick = (e) => {
                    e.stopPropagation()
                    if (confirm('确定要删除这个 Prompt 吗？')) {
                        this.deleteCustomPrompt(prompt.id)
                    }
                }
                if (!mobile) {
                    deleteBtn.addEventListener('mouseenter', () => {
                        deleteBtn.style.transform = 'scale(1.15)'
                        deleteBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)'
                    })
                    deleteBtn.addEventListener('mouseleave', () => {
                        deleteBtn.style.transform = 'scale(1)'
                        deleteBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                    })
                }

                card.appendChild(editBtn)
                card.appendChild(deleteBtn)
            }

            card.appendChild(imgContainer)
            card.appendChild(favoriteBtn)
            card.appendChild(content)

            return card
        }

        async getFavorites() {
            const result = await chrome.storage.sync.get(['banana-favorites'])
            return result['banana-favorites'] || []
        }

        async toggleFavorite(promptId) {
            const favorites = await this.getFavorites()
            const index = favorites.indexOf(promptId)
            if (index > -1) {
                favorites.splice(index, 1)
            } else {
                favorites.push(promptId)
            }
            await chrome.storage.sync.set({ 'banana-favorites': favorites })
            this.applyFilters(false)
        }

        showAddPromptModal(existingPrompt = null) {
            const colors = this.adapter.getThemeColors()
            const mobile = this.isMobile()

            const overlay = document.createElement('div')
            overlay.style.cssText =
                'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: calc(var(--prompts-modal-z-index) + 10);'
            overlay.onclick = (e) => {
                if (e.target === overlay) document.body.removeChild(overlay)
            }

            const dialog = document.createElement('div')
            dialog.style.cssText = `background: ${colors.surface}; padding: ${mobile ? '24px' : '32px'}; border-radius: 20px; width: ${mobile ? '90%' : '480px'}; max-width: 90%; box-shadow: 0 20px 60px ${colors.shadow}; display: flex; flex-direction: column; gap: 16px; color: ${colors.text};`

            const title = document.createElement('h3')
            title.textContent = existingPrompt ? '编辑自定义 Prompt' : '添加自定义 Prompt'
            title.style.cssText = 'margin: 0 0 4px 0; font-size: 20px; font-weight: 600;'

            const createInput = (placeholder, isTextarea = false) => {
                const input = document.createElement(isTextarea ? 'textarea' : 'input')
                input.placeholder = placeholder
                input.style.cssText = `width: 100%; padding: ${mobile ? '14px 16px' : '12px 16px'}; border: 1px solid ${colors.inputBorder}; border-radius: 12px; background: ${colors.inputBg}; color: ${colors.text}; font-size: 14px; outline: none; box-sizing: border-box; transition: all 0.2s; ${isTextarea ? 'min-height: 120px; resize: vertical; font-family: inherit;' : ''}`
                input.onfocus = () => {
                    input.style.borderColor = colors.primary
                    input.style.boxShadow = `0 0 0 3px ${colors.primary}15`
                }
                input.onblur = () => {
                    input.style.borderColor = colors.inputBorder
                    input.style.boxShadow = 'none'
                }
                return input
            }

            const titleInput = createInput('标题')
            if (existingPrompt) titleInput.value = existingPrompt.title

            // Mode Selection (Moved up)
            let selectedMode = existingPrompt?.mode || 'generate'
            const createModeSelection = () => {
                const modeContainer = document.createElement('div')

                modeContainer.style.cssText = `display: flex; background: ${colors.inputBg}; padding: 4px; border-radius: 10px; border: 1px solid ${colors.inputBorder};`
                const createOption = (value, label, iconSvg) => {
                    const isSelected = selectedMode === value

                    const option = document.createElement('div')
                    option.style.cssText = `flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; font-weight: ${isSelected ? '600' : '400'}; color: ${isSelected ? colors.text : colors.textSecondary}; background: ${isSelected ? colors.surface : 'transparent'}; box-shadow: ${isSelected ? `0 2px 8px ${colors.shadow}` : 'none'};`
                    option.onclick = () => {
                        selectedMode = value
                        modeContainer.parentNode.replaceChild(createModeSelection(), modeContainer)
                    }

                    const icon = document.createElement('span')
                    icon.innerHTML = iconSvg
                    icon.style.cssText = 'display: flex; align-items: center;'

                    option.appendChild(icon)
                    option.appendChild(document.createTextNode(label))
                    return option
                }
                const generateIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
                const editIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`
                modeContainer.appendChild(createOption('generate', '文生图', generateIcon))
                modeContainer.appendChild(createOption('edit', '编辑', editIcon))
                return modeContainer
            }
            const modeContainer = createModeSelection()

            // Image Upload UI
            const imageContainer = document.createElement('div')
            imageContainer.style.cssText = `width: 100%; height: 140px; border: 1px dashed ${colors.border}; border-radius: 12px; background: ${colors.inputBg}; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; transition: all 0.2s;`

            const fileInput = document.createElement('input')
            fileInput.type = 'file'
            fileInput.accept = 'image/*'
            fileInput.style.display = 'none'

            const placeholderIcon = document.createElement('span')
            placeholderIcon.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${colors.textSecondary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
            placeholderIcon.style.cssText = 'margin-bottom: 8px'

            const placeholderText = document.createElement('span')
            placeholderText.style.cssText = `font-size: 13px; color: ${colors.textSecondary}; font-weight: 500;`
            placeholderText.textContent = '点击上传封面图'

            const placeholderContainer = document.createElement('div')
            placeholderContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center; pointer-events: none;'
            placeholderContainer.appendChild(placeholderIcon)
            placeholderContainer.appendChild(placeholderText)

            const previewImg = document.createElement('img')
            previewImg.style.cssText = `width: 100%; height: 100%; object-fit: cover; display: none; position: absolute; top: 0; left: 0;`

            const clearBtn = document.createElement('button')
            clearBtn.innerHTML =
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
            clearBtn.style.cssText = `position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.5); color: white; border: none; cursor: pointer; display: none; align-items: center; justify-content: center; backdrop-filter: blur(4px); transition: all 0.2s; z-index: 10;`
            clearBtn.onclick = () => {
                fileInput.value = ''
                selectedFile = null
                previewImg.removeAttribute('src')
                previewImg.style.display = 'none'
                placeholderContainer.style.display = 'flex'
                clearBtn.style.display = 'none'
                imageContainer.style.borderStyle = 'dashed'
            }
            clearBtn.onmouseenter = (e) => (e.target.style.background = 'rgba(0,0,0,0.7)')
            clearBtn.onmouseleave = (e) => (e.target.style.background = 'rgba(0,0,0,0.5)')

            // Click handler for container
            imageContainer.onclick = (e) => {
                if (e.target !== clearBtn && !clearBtn.contains(e.target)) {
                    fileInput.click()
                }
            }

            let selectedFile = null

            // 如果是编辑模式且有预览图,显示预览图
            if (existingPrompt?.preview) {
                previewImg.src = existingPrompt.preview
                previewImg.style.display = 'block'
                placeholderContainer.style.display = 'none'
                imageContainer.style.borderStyle = 'solid'
                clearBtn.style.display = 'flex'
            }

            fileInput.onchange = (e) => {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0]
                    selectedFile = file

                    const reader = new FileReader()
                    reader.onload = (evt) => {
                        previewImg.src = evt.target.result
                        previewImg.style.display = 'block'
                        placeholderContainer.style.display = 'none'
                        imageContainer.style.borderStyle = 'solid'
                        clearBtn.style.display = 'flex'
                    }
                    reader.readAsDataURL(file)
                }
            }

            imageContainer.onmouseenter = (e) => {
                if (!selectedFile && !previewImg.src) {
                    e.target.style.borderColor = colors.primary
                    e.target.style.background = colors.surfaceHover
                }
            }
            imageContainer.onmouseleave = (e) => {
                if (!selectedFile && !previewImg.src) {
                    e.target.style.borderColor = colors.border
                    e.target.style.background = colors.inputBg
                }
            }

            imageContainer.appendChild(fileInput)
            imageContainer.appendChild(placeholderContainer)
            imageContainer.appendChild(previewImg)
            imageContainer.appendChild(clearBtn)

            const promptInput = createInput('Prompt 内容', true)
            if (existingPrompt) promptInput.value = existingPrompt.prompt

            // Category Dropdown for Add Prompt
            const categoryContainer = document.createElement('div')
            categoryContainer.style.cssText = 'position: relative; width: 100%;'

            const categoryTrigger = document.createElement('div')
            categoryTrigger.style.cssText = `width: 100%; padding: ${mobile ? '14px 16px' : '12px 16px'}; border: 1px solid ${colors.inputBorder}; border-radius: 12px; background: ${colors.inputBg}; color: ${colors.text}; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;`

            const addCategories = Array.from(this.categories)
                .filter((c) => c !== '全部')
                .sort((a, b) => a.localeCompare(b))
            let selectedAddCategory = existingPrompt?.category || addCategories[0]
            const categoryTriggerText = document.createElement('span')
            categoryTriggerText.textContent = selectedAddCategory

            const categoryArrow = document.createElement('span')
            categoryArrow.innerHTML = `<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1L5 5L9 1"/></svg>`
            categoryArrow.style.cssText = `display: flex; align-items: center; transition: transform 0.2s; opacity: 0.6;`

            categoryTrigger.appendChild(categoryTriggerText)
            categoryTrigger.appendChild(categoryArrow)

            const categoryOptions = document.createElement('div')
            categoryOptions.style.cssText = `position: absolute; top: 100%; left: 0; margin-top: 8px; width: 100%; background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 12px; box-shadow: 0 10px 40px ${colors.shadow}; display: none; flex-direction: column; overflow: hidden; backdrop-filter: blur(20px); max-height: 200px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: ${colors.border} transparent;`

            addCategories.forEach((cat) => {
                const option = document.createElement('div')
                option.textContent = cat
                const baseStyle = `padding: 10px 16px; cursor: pointer; transition: all 0.2s; font-size: 14px; background: transparent; color: ${colors.text};`
                option.style.cssText = baseStyle

                option.onmouseenter = () => {
                    option.style.background = colors.surfaceHover
                }
                option.onmouseleave = () => {
                    option.style.background = 'transparent'
                }
                option.onclick = (e) => {
                    e.stopPropagation()
                    selectedAddCategory = cat
                    categoryTriggerText.textContent = cat
                    categoryOptions.style.display = 'none'
                    categoryArrow.style.transform = 'rotate(0deg)'
                }
                categoryOptions.appendChild(option)
            })

            categoryTrigger.onclick = (e) => {
                e.stopPropagation()
                const isVisible = categoryOptions.style.display === 'flex'
                categoryOptions.style.display = isVisible ? 'none' : 'flex'
                categoryArrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)'
            }

            const closeDropdown = (e) => {
                if (!categoryContainer.contains(e.target)) {
                    categoryOptions.style.display = 'none'
                    categoryArrow.style.transform = 'rotate(0deg)'
                }
            }
            document.addEventListener('click', closeDropdown)
            const cleanup = () => document.removeEventListener('click', closeDropdown)

            categoryContainer.appendChild(categoryTrigger)
            categoryContainer.appendChild(categoryOptions)

            const btnContainer = document.createElement('div')
            btnContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;'

            const cancelBtn = document.createElement('button')
            cancelBtn.textContent = '取消'
            cancelBtn.style.cssText = `padding: ${mobile ? '12px 24px' : '10px 20px'}; border: 1px solid ${colors.border}; border-radius: 12px; background: transparent; color: ${colors.text}; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.25s ease;`
            cancelBtn.onclick = () => {
                cleanup()
                document.body.removeChild(overlay)
            }

            const saveBtn = document.createElement('button')
            saveBtn.textContent = '保存'
            saveBtn.style.cssText = `padding: ${mobile ? '12px 24px' : '10px 20px'}; border: none; border-radius: 12px; background: ${colors.primary}; color: white; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.25s ease; box-shadow: 0 2px 8px ${colors.shadow};`
            saveBtn.onclick = async () => {
                const titleVal = titleInput.value.trim()
                const promptVal = promptInput.value.trim()
                if (!titleVal || !promptVal) {
                    alert('请填写标题和内容')
                    return
                }

                let previewDataUrl = existingPrompt?.preview || createPlaceholderImage(this.adapter.getCurrentTheme())

                if (selectedFile) {
                    try {
                        saveBtn.textContent = '处理中...'
                        saveBtn.disabled = true
                        previewDataUrl = await this.compressImage(selectedFile)
                    } catch (err) {
                        console.error('图片压缩失败', err)
                        alert('图片处理失败,将使用默认图标')
                    } finally {
                        saveBtn.textContent = '保存'
                        saveBtn.disabled = false
                    }
                }

                const promptData = {
                    title: titleVal,
                    prompt: promptVal,
                    mode: selectedMode,
                    media_type: existingPrompt?.media_type || 'image',
                    category: selectedAddCategory,
                    preview: previewDataUrl,
                }

                if (existingPrompt) {
                    await this.updateCustomPrompt(existingPrompt.id, promptData)
                } else {
                    await this.saveCustomPrompt(promptData)
                }
                document.body.removeChild(overlay)
                cleanup()
            }

            btnContainer.appendChild(cancelBtn)
            btnContainer.appendChild(saveBtn)

            dialog.appendChild(title)
            dialog.appendChild(titleInput)
            dialog.appendChild(imageContainer)
            dialog.appendChild(categoryContainer)
            dialog.appendChild(promptInput)
            dialog.appendChild(modeContainer)
            dialog.appendChild(btnContainer)

            overlay.appendChild(dialog)
            document.body.appendChild(overlay)
        }

        async deleteCustomPrompt(promptId) {
            const customPrompts = await this.getCustomPrompts()
            const newPrompts = customPrompts.filter((p) => p.id !== promptId)
            await chrome.storage.local.set({ 'banana-custom-prompts': newPrompts })
            await this.loadPrompts()
        }

        async updateCustomPrompt(promptId, data) {
            const customPrompts = await this.getCustomPrompts()
            const index = customPrompts.findIndex((p) => p.id === promptId)

            if (index !== -1) {
                customPrompts[index] = {
                    ...customPrompts[index],
                    ...data,
                    id: promptId,
                    author: 'Me',
                    isCustom: true,
                }
                await chrome.storage.local.set({ 'banana-custom-prompts': customPrompts })
                await this.loadPrompts()
            }
        }

        async saveCustomPrompt(data) {
            const newPrompt = {
                ...data,
                author: 'Me',
                isCustom: true,
                id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
                preview: data.preview || createPlaceholderImage(this.adapter.getCurrentTheme()),
            }
            const customPrompts = await this.getCustomPrompts()
            customPrompts.unshift(newPrompt)
            await chrome.storage.local.set({ 'banana-custom-prompts': customPrompts })
            await this.loadPrompts()
        }
    }

    // --- content.js Logic ---
    class AIStudioAdapter {
        constructor() {
            this.modal = null
            this._initializingButton = false
        }

        async findPromptInput() {
            let el = document.querySelector('ms-prompt-input-wrapper textarea')
            if (el) {
                return el
            }
            el = document.querySelector('textarea')
            if (el) {
                return el
            }

            // Fallback.
            const s = await getRemoteSelector('aistudio', 'promptInput')
            return document.querySelector(s)
        }

        async findClosestInsertButton() {
            let el = document.querySelector('ms-run-button button')
            if (el) {
                return el
            }

            // Fallback.
            const s = await getRemoteSelector('aistudio', 'insertButton')
            return document.querySelector(s)
        }

        getCurrentTheme() {
            return document.body.classList.contains('dark-theme') ? 'dark' : 'light'
        }

        getThemeColors() {
            return getDefaultThemeColors(this.getCurrentTheme())
        }

        createButton() {
            const wrapper = document.createElement('div')
            wrapper.className = 'button-wrapper'
            const btn = document.createElement('button')
            btn.id = 'banana-btn'
            btn.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon'
            const updateButtonTheme = () => {
                const colors = this.getThemeColors()
                btn.style.cssText = `width: 40px; height: 40px; border-radius: 50%; border: none; background: ${colors.hover}; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-right: 8px; transition: background-color 0.2s;`
            }
            updateButtonTheme()
            btn.title = '快捷提示'
            btn.textContent = '🍌'
            btn.addEventListener('mouseenter', () => {
                const colors = this.getThemeColors()
                btn.style.background = colors.border
            })
            btn.addEventListener('mouseleave', () => {
                const colors = this.getThemeColors()
                btn.style.background = colors.hover
            })
            btn.addEventListener('click', () => {
                if (this.modal) this.modal.show()
            })
            wrapper.appendChild(btn)
            return wrapper
        }

        async initButton() {
            if (document.getElementById('banana-btn')) return true
            if (this._initializingButton) {
                return false
            }
            this._initializingButton = true

            try {
                const runButton = await this.findClosestInsertButton()
                if (!runButton) {
                    return false
                }

                const bananaBtn = this.createButton()
                const buttonWrapper = runButton.parentElement

                try {
                    buttonWrapper.parentElement.insertBefore(bananaBtn, buttonWrapper)
                } catch (error) {
                    console.error('插入香蕉按钮失败:', error)
                    buttonWrapper.insertAdjacentElement('beforebegin', bananaBtn)
                }

                return true
            } finally {
                this._initializingButton = false
            }
        }

        async insertPrompt(promptText) {
            const textarea = await this.findPromptInput()
            if (textarea) {
                textarea.value = promptText
                textarea.dispatchEvent(new Event('input', { bubbles: true }))

                textarea.focus()
                const length = promptText.length
                textarea.setSelectionRange(length, length)

                if (this.modal) this.modal.hide()
            }
        }

        waitForElements() {
            const checkInterval = setInterval(async () => {
                const input = await this.findPromptInput()
                if (input) {
                    const success = await this.initButton()
                    if (success) clearInterval(checkInterval)
                }
            }, 1000)
        }

        startObserver() {
            const observer = new MutationObserver(() => {
                const existingBtn = document.getElementById('banana-btn')
                if (!existingBtn) this.initButton()
            })
            observer.observe(document.body, { childList: true, subtree: true })
        }
    }

    class GeminiAdapter {
        constructor() {
            this.modal = null
            this._initializingButton = false
        }

        async findPromptInput() {
            let el = document.querySelector('div.ql-editor[contenteditable="true"]')
            if (el) {
                return el
            }

            // Fallback.
            const selector = await getRemoteSelector('gemini', 'promptInput')
            return document.querySelector(selector)
        }

        async findClosestInsertButton() {
            let xpath = document.evaluate(
                "//button[.//span[contains(text(), 'Create image')]]",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue
            if (xpath) {
                return xpath
            }

            let el = document.querySelector('button.toolbox-drawer-item-deselect-button:has(img.img-icon)')
            if (el) {
                return el
            }

            // Fallback.
            const s = await getRemoteSelector('gemini', 'insertButton')
            return document.querySelector(s)
        }

        getCurrentTheme() {
            return document.body.classList.contains('dark-theme') || document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
        }

        getThemeColors() {
            return getDefaultThemeColors(this.getCurrentTheme())
        }

        createButton() {
            const isMobile = window.innerWidth <= 768
            const btn = document.createElement('button')
            btn.id = 'banana-btn'
            btn.className = 'mat-mdc-button mat-mdc-button-base mat-unthemed'
            const updateButtonTheme = () => {
                const colors = this.getThemeColors()
                const mobile = window.innerWidth <= 768
                btn.style.cssText = `
                        height: 40px;
                        ${mobile ? 'width: 40px;' : ''}
                        border-radius: ${mobile ? '50%' : '20px'};
                        border: none;
                        background: transparent;
                        color: ${colors.text};
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-family: 'Google Sans', Roboto, Arial, sans-serif;
                        margin-left: 4px;
                        transition: background-color 0.2s;
                        padding: ${mobile ? '0' : '0 16px'};
                        gap: ${mobile ? '0' : '8px'};
                    `
            }
            updateButtonTheme()
            btn.title = '快捷提示'
            btn.innerHTML = isMobile ? '<span style="font-size: 18px;">🍌</span>' : '<span style="font-size: 16px;">🍌</span><span>Prompts</span>'
            btn.addEventListener('mouseenter', () => {
                const colors = this.getThemeColors()
                btn.style.background = colors.hover
            })
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'transparent'
            })
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                e.stopPropagation()
                if (this.modal) this.modal.show()
            })
            return btn
        }

        async initButton() {
            if (document.getElementById('banana-btn')) return true
            if (this._initializingButton) {
                return false
            }
            this._initializingButton = true

            try {
                const imageBtn = await this.findClosestInsertButton()
                if (!imageBtn) {
                    return false
                }

                const bananaBtn = this.createButton()
                try {
                    imageBtn.insertAdjacentElement('afterend', bananaBtn)
                } catch (error) {
                    console.error('插入香蕉按钮失败:', error)
                    return false
                }

                return true
            } finally {
                this._initializingButton = false
            }
        }

        async insertPrompt(promptText) {
            const textarea = await this.findPromptInput()
            if (textarea) {
                textarea.focus()
                const lines = promptText.split('\n')
                const htmlContent = lines
                    .map((line) => {
                        const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                        return `<p>${escaped || '<br>'}</p>`
                    })
                    .join('')
                textarea.innerHTML = htmlContent
                textarea.dispatchEvent(new Event('input', { bubbles: true }))

                // 聚焦并将光标定位到文字末尾
                textarea.focus()
                const range = document.createRange()
                const sel = window.getSelection()
                range.selectNodeContents(textarea)
                range.collapse(false) // false 表示折叠到末尾
                sel.removeAllRanges()
                sel.addRange(range)

                if (this.modal) this.modal.hide()
            }
        }

        waitForElements() { }

        startObserver() {
            const observer = new MutationObserver(async () => {
                const existingBtn = document.getElementById('banana-btn')
                const imageBtn = await this.findClosestInsertButton()
                if (imageBtn) {
                    if (!existingBtn) await this.initButton()
                } else {
                    if (existingBtn) existingBtn.remove()
                }
            })
            observer.observe(document.body, { childList: true, subtree: true })
        }
    }

    // 通用适配器，用于任意网站
    class UniversalAdapter {
        constructor() {
            this.modal = null
            this.lastFocusedElement = null
            this.trackFocusedElement()
        }

        // 跟踪最后聚焦的可编辑元素
        trackFocusedElement() {
            document.addEventListener('focusin', (e) => {
                if (this.isEditableElement(e.target)) {
                    this.lastFocusedElement = e.target
                }
            })
        }

        isEditableElement(el) {
            if (!el) return false
            return el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && ['text', 'search', 'email', 'url'].includes(el.type)) || el.isContentEditable
        }

        async findPromptInput() {
            // 优先使用最后聚焦的元素
            if (this.lastFocusedElement && this.isEditableElement(this.lastFocusedElement)) {
                return this.lastFocusedElement
            }
            // fallback 到当前激活元素
            const active = document.activeElement
            if (this.isEditableElement(active)) {
                return active
            }
            return null
        }

        async insertPrompt(promptText) {
            const el = await this.findPromptInput()
            if (!el || !this.isEditableElement(el)) {
                alert('🍌 请先点击输入框，然后再选择脚本菜单的 Banana Prompts')
                return
            }

            if (el.hasOwnProperty('__lexicalEditor')) {
                // 特殊处理富文本编辑器 Lexical
                el.focus()
                el.dispatchEvent(
                    new InputEvent('beforeinput', {
                        inputType: 'insertText',
                        data: promptText,
                        bubbles: true,
                        cancelable: true,
                    })
                )
            } else if (el.isContentEditable) {
                // contenteditable 处理 - 在光标位置插入
                const selection = window.getSelection()
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0)
                    range.deleteContents()

                    const lines = promptText.split('\n')
                    const fragment = document.createDocumentFragment()

                    lines.forEach((line, index) => {
                        const textNode = document.createTextNode(line)
                        fragment.appendChild(textNode)
                        if (index < lines.length - 1) {
                            fragment.appendChild(document.createElement('br'))
                        }
                    })

                    range.insertNode(fragment)
                    range.collapse(false)
                    selection.removeAllRanges()
                    selection.addRange(range)
                } else {
                    // 如果没有选区，追加到末尾
                    const htmlContent = promptText
                        .split('\n')
                        .map((line) => {
                            const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                            return `<p>${escaped || '<br>'}</p>`
                        })
                        .join('')
                    el.innerHTML += htmlContent
                }
                el.dispatchEvent(new Event('input', { bubbles: true }))
            } else {
                // textarea/input 处理 - 在光标位置插入
                const start = el.selectionStart
                const end = el.selectionEnd
                const currentValue = el.value

                const newValue = currentValue.substring(0, start) + promptText + currentValue.substring(end)
                // https://github.com/facebook/react/issues/10135
                const valueSetter = Object.getOwnPropertyDescriptor(el, 'value')?.set
                const prototype = Object.getPrototypeOf(el)
                const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set

                if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
                    prototypeValueSetter.call(el, newValue)
                } else if (valueSetter) {
                    valueSetter.call(el, newValue)
                } else {
                    el.value = newValue
                }

                // 设置光标位置到插入内容之后
                const newCursorPos = start + promptText.length
                el.setSelectionRange(newCursorPos, newCursorPos)

                el.dispatchEvent(new Event('input', { bubbles: true }))
                el.focus()
            }

            if (this.modal) {
                this.modal.hide()
            }
        }

        getCurrentTheme() {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }

        getThemeColors() {
            return getDefaultThemeColors(this.getCurrentTheme())
        }

        createButton() {
            const btn = document.createElement('div')
            btn.id = 'banana-floating-btn'
            btn.textContent = '🍌'
            btn.title = 'Banana Prompts'

            const isMobile = window.innerWidth <= 768
            const size = isMobile ? '40px' : '48px'
            const fontSize = isMobile ? '20px' : '24px'

            btn.style.cssText = `
                position: fixed;
                top: 50%;
                right: 0;
                width: ${size};
                height: ${size};
                transform: translateY(-50%) translateX(50%);
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 50% 0 0 50%;
                box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                z-index: var(--prompts-modal-z-index);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: ${fontSize};
                opacity: 0.5;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            `

            // Hover/Active Effects
            const onEnter = () => {
                btn.style.transform = 'translateY(-50%) translateX(0)'
                btn.style.opacity = '1'
                btn.style.background = 'rgba(255, 225, 0, 0.9)' // Banana yellow
                btn.style.boxShadow = '-4px 0 16px rgba(255, 200, 0, 0.4)'
            }

            const onLeave = () => {
                btn.style.transform = 'translateY(-50%) translateX(50%)'
                btn.style.opacity = '0.5'
                btn.style.background = 'rgba(255, 255, 255, 0.2)'
                btn.style.boxShadow = '-2px 0 8px rgba(0, 0, 0, 0.1)'
            }

            btn.addEventListener('mouseenter', onEnter)
            btn.addEventListener('mouseleave', onLeave)

            // Mobile touch support
            if (isMobile) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault() // prevent mouse emulation
                    onEnter()
                })
                btn.addEventListener('touchend', () => {
                    setTimeout(onLeave, 1500)
                    if (this.modal) this.modal.show()
                })
            }

            btn.addEventListener('click', (e) => {
                e.stopPropagation()
                if (this.modal) this.modal.show()
            })

            return btn
        }

        async initButton() {
            if (document.getElementById('banana-floating-btn')) return
            const btn = this.createButton()
            document.body.appendChild(btn)
        }

        waitForElements() { }
        startObserver() { }
    }

    // --- Initialization ---
    function init() {
        const hostname = window.location.hostname
        let adapter
        if (hostname.includes('aistudio')) {
            adapter = new AIStudioAdapter()
        } else if (hostname.includes('gemini')) {
            adapter = new GeminiAdapter()
        } else {
            // 其他网站使用通用适配器
            adapter = new UniversalAdapter()
        }
        const modal = new BananaModal(adapter)
        adapter.modal = modal

        // initialize button for all adapters
        if (adapter.initButton) {
            adapter.initButton()
        }

        // 只在特定平台初始化按钮和观察器
        if (hostname.includes('aistudio') || hostname.includes('gemini')) {
            adapter.waitForElements()
            adapter.startObserver()

            const handleNavigationChange = () => {
                setTimeout(() => {
                    adapter.initButton()
                }, 1000)
            }
            window.addEventListener('popstate', handleNavigationChange)
            window.addEventListener('pushstate', handleNavigationChange)
            window.addEventListener('replacestate', handleNavigationChange)
        }

        document.body.addEventListener('fire-modal', () => {
            if (modal) {
                modal.show()
            }
        })
        document.body.addEventListener('toggle-nsfw', async () => {
            if (modal) {
                await ConfigManager.setNsfwEnabled(!modal.nsfwEnabled)
                location.reload()
            }
        })
    }

    ; (async function () {
        const v = await ConfigManager.getNsfwEnabled()
        const nsfwEnabled = v ? '✅' : '❌'
        GM_registerMenuCommand(`${nsfwEnabled} NSFW`, () => document.body.dispatchEvent(new Event('toggle-nsfw')), {
            autoClose: true,
        })
        GM_registerMenuCommand('🍌 Insert Banana Prompts', () => document.body.dispatchEvent(new Event('fire-modal')), {
            autoClose: true,
        })
        GM_registerMenuCommand('🌐 打开提示词库网站', () => GM_openInTab(SITE_URL, { active: true }), {
            autoClose: true,
        })
    })()

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init()
    } else {
        window.addEventListener('load', init)
    }
})()
