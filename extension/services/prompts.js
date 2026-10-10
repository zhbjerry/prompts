const GITHUB_PROMPTS_URL = 'https://raw.githubusercontent.com/zhbjerry/prompts/main/prompts.json';
// 缓存键带版本：记录结构或图片路径变化时递增，避免继续用旧结构的缓存（旧键会自然失效）。
const PROMPTS_CACHE_KEY = 'banana_prompts_cache_v2';
const PROMPTS_CACHE_DURATION = 60 * 60 * 1000; // 60 min

// prompts.json 采用 registry Prompt Record v1 + 本仓库扩展键（见 PROMPT_RECORD_FORMAT.md）。
// 扩展内部仍按旧字段渲染，这里在数据入口统一转换；旧缓存记录（无 sourceId）原样返回。
const SOURCE_HOMEPAGES = {
    'banana-prompt-quicker': 'https://github.com/zhbjerry/prompts',
    'freestylefly-gpt-image-2': 'https://github.com/freestylefly/awesome-gpt-image-2',
    'moosl-awesome-gpt-image-2-prompts': 'https://github.com/moosl/awsome-gpt-image-2-prompts',
    'open-design': 'https://github.com/nexu-io/open-design',
    'awesome-gpt-image2-prompts': 'https://github.com/davidwuw0811-boop/awesome-gpt-image2-prompts'
};

function normalizeRecord(record) {
    if (!record || !record.sourceId) return record;
    const tags = Array.isArray(record.tags) ? record.tags : [];
    const refs = Array.isArray(record.referenceImageUrls) ? record.referenceImageUrls : [];
    const homepage = SOURCE_HOMEPAGES[record.sourceId];
    return {
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
        needs_ref: record.needsRef === true,
        source: record.sourceId,
        note: record.description || '',
        created: record.createdAt || '',
        reference_image_urls: refs,
        id: record.id
    };
}

window.PromptManager = {
    async get() {
        return window.Fetcher.fetchWithCache(
            GITHUB_PROMPTS_URL,
            PROMPTS_CACHE_KEY,
            PROMPTS_CACHE_DURATION,
            async (prompts) => {
                await Promise.all(prompts.map(normalizeRecord).map(async (prompt) => {
                    if (prompt.reference_image_urls && Array.isArray(prompt.reference_image_urls)) {
                        const base64Images = await Promise.all(
                            prompt.reference_image_urls.map(async (url) => {
                                try {
                                    const file = await window.Utils.urlToFile(url, 'image.jpg');
                                    return await window.Utils.compressReferenceImage(file);
                                } catch (err) {
                                    console.error(`Failed to process image ${url}:`, err);
                                    return null;
                                }
                            })
                        );
                        prompt.referenceImages = base64Images.filter(img => img !== null);
                    }
                }));
                return prompts;
            }
        );
    }
};
