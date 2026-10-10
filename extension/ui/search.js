(function () {
    const { h } = window.DOM;

    // 类型筛选：大类（图片 / 视频）+ 图片下的二级（文生图 / 编辑），视频不参与生成方式筛选
    const TYPE_OPTIONS = [
        { key: 'all', label: '全部', media: 'all', mode: 'all', level: 0 },
        { key: 'image', label: '图片', media: 'image', mode: 'all', level: 0 },
        { key: 'image:generate', label: '文生图', media: 'image', mode: 'generate', level: 1, parent: 'image' },
        { key: 'image:edit', label: '编辑', media: 'image', mode: 'edit', level: 1, parent: 'image' },
        { key: 'video', label: '视频', media: 'video', mode: 'all', level: 0 }
    ];
    const TYPE_MAP = {};
    TYPE_OPTIONS.forEach((option) => { TYPE_MAP[option.key] = option; });

    function matchesType(prompt, option) {
        if (option.media !== 'all' && (prompt.media_type === 'video' ? 'video' : 'image') !== option.media) return false;
        if (option.mode !== 'all' && (prompt.mode === 'edit' ? 'edit' : 'generate') !== option.mode) return false;
        return true;
    }

    function typeLabelOf(key) {
        const option = TYPE_MAP[key];
        if (!option || option.level === 0) return option ? option.label : '全部';
        return (TYPE_MAP[option.parent] ? TYPE_MAP[option.parent].label + ' › ' : '') + option.label;
    }

    // 通用下拉筛选：支持搜索、悬停展开（移动端只用点击），分类与类型共用
    function createFilterDropdown(config) {
        const { colors, isMobile } = config;
        let open = false;
        let query = '';

        const triggerText = h('span', {
            style: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; text-align: center;'
        });
        const arrow = h('span', {
            style: 'display: flex; align-items: center; transition: transform 0.2s; opacity: 0.6;',
            innerHTML: '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1L5 5L9 1"/></svg>'
        });
        const trigger = h('div', {
            style: `padding: ${isMobile ? '10px 14px' : '8px 12px'}; border: 1px solid ${colors.border}; border-radius: 16px; background: ${colors.surface}; color: ${colors.text}; font-size: ${isMobile ? '14px' : '13px'}; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s; min-width: 80px; justify-content: space-between; user-select: none;`,
            onclick: (e) => {
                e.stopPropagation();
                if (open) close(); else openPanel();
            },
            onmouseenter: !isMobile ? (e) => {
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.boxShadow = `0 2px 8px ${colors.shadow}`;
            } : null,
            onmouseleave: !isMobile ? (e) => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.boxShadow = 'none';
            } : null
        }, [triggerText, arrow]);

        const searchInput = h('input', {
            type: 'text',
            placeholder: config.searchPlaceholder || '搜索…',
            style: `width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid ${colors.inputBorder || colors.border}; border-radius: 10px; background: ${colors.inputBg || colors.surface}; color: ${colors.text}; font-size: 13px; outline: none;`,
            oninput: (e) => { query = e.target.value; renderOptions(); },
            onclick: (e) => e.stopPropagation()
        });
        const searchWrap = h('div', {
            style: `padding: 8px; border-bottom: 1px solid ${colors.border};`
        }, [searchInput]);
        const optionsEl = h('div', { style: `overflow-y: auto; padding: 4px; scrollbar-width: thin; scrollbar-color: ${colors.border} transparent;` });

        const panel = h('div', {
            style: `position: absolute; top: 100%; left: 0; margin-top: 8px; min-width: 220px; max-width: calc(100vw - 32px); background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 16px; box-shadow: 0 10px 40px ${colors.shadow}; display: none; flex-direction: column; overflow: hidden; backdrop-filter: blur(20px); max-height: 320px; z-index: 9999;`
        }, [searchWrap, optionsEl]);

        const container = h('div', { style: 'position: relative;' }, [trigger, panel]);

        function openPanel() {
            open = true;
            query = '';
            searchInput.value = '';
            renderOptions();
            panel.style.display = 'flex';
            arrow.style.transform = 'rotate(180deg)';
        }
        function close() {
            open = false;
            panel.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
        }
        function renderOptions() {
            const selected = config.getSelectedKey();
            triggerText.textContent = config.label + '：' + config.labelOf(selected);
            const all = config.options();
            const q = query.trim().toLowerCase();
            const visible = all.filter((option) => {
                if (!q) return true;
                if (option.label.toLowerCase().indexOf(q) !== -1) return true;
                // 二级命中时保留父级，方便看出层级
                return all.some((child) => child.parent === option.key && child.label.toLowerCase().indexOf(q) !== -1);
            });

            optionsEl.innerHTML = '';
            if (!visible.length) {
                optionsEl.appendChild(h('div', {
                    style: `padding: 12px; text-align: center; color: ${colors.textSecondary}; font-size: 13px;`
                }, '没有匹配项'));
                return;
            }
            visible.forEach((option) => {
                const isSelected = option.key === selected;
                const row = h('div', {
                    style: `padding: 9px 12px; border-radius: 10px; font-size: 13px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; white-space: nowrap; ${option.level === 1 ? 'padding-left: 24px;' : ''} ${isSelected ? `background: ${colors.primary}20; color: ${colors.primary}; font-weight: 600;` : `color: ${colors.text};`}`,
                    onmouseenter: (e) => {
                        if (!isSelected) e.currentTarget.style.background = colors.surfaceHover;
                    },
                    onmouseleave: (e) => {
                        e.currentTarget.style.background = isSelected ? `${colors.primary}20` : 'transparent';
                    },
                    onclick: (e) => {
                        e.stopPropagation();
                        config.onSelect(option.key);
                        renderOptions();
                        close();
                    }
                }, [
                    h('span', {}, option.label),
                    h('span', { style: `font-size: 12px; color: ${colors.textSecondary};` }, String(option.count))
                ]);
                optionsEl.appendChild(row);
            });
        }

        const onDocumentClick = (e) => {
            if (open && !container.contains(e.target)) close();
        };
        document.addEventListener('click', onDocumentClick);

        if (!isMobile) {
            container.addEventListener('mouseenter', openPanel);
            container.addEventListener('mouseleave', close);
        }

        return { container, refresh: renderOptions, close, destroy: () => document.removeEventListener('click', onDocumentClick) };
    }

    window.UI = window.UI || {};
    window.UI.Search = class SearchComponent {
        constructor(props) {
            this.props = props;
            this.state = {
                keyword: '',
                selectedCategory: props.selectedCategory || 'all',
                selectedType: props.selectedType || 'all',
                activeFilters: props.activeFilters || new Set(),
                sortMode: props.sortMode || 'recommend',
                recentWeekEnabled: props.recentWeekEnabled || false
            };
            this.element = null;
            this.categoryDropdown = null;
            this.typeDropdown = null;
        }

        destroy() {
            if (this.categoryDropdown) this.categoryDropdown.destroy();
            if (this.typeDropdown) this.typeDropdown.destroy();
            if (this.element) {
                this.element.remove();
            }
        }

        updateState(newState) {
            this.state = { ...this.state, ...newState };
            this.updateView();
        }

        updateView() {
            if (!this.element) return;

            const { colors, isMobile } = this.props;

            // 排序按钮
            const sortBtn = this.element.querySelector('#sort-mode-btn');
            if (sortBtn) {
                const currentModeText = this.state.sortMode === 'recommend' ? '随机焕新' : '推荐排序';
                sortBtn.innerHTML = this.state.sortMode === 'recommend'
                    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
                    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';

                const tooltip = this.element.querySelector('#sort-tooltip');
                if (tooltip) tooltip.textContent = `切换${currentModeText}`;
            }

            // 下拉筛选
            if (this.categoryDropdown) this.categoryDropdown.refresh();
            if (this.typeDropdown) this.typeDropdown.refresh();

            // 收藏 / 自定义按钮
            ['favorite', 'custom'].forEach(key => {
                const btn = this.element.querySelector(`#filter-${key}`);
                if (btn) {
                    const isActive = this.state.activeFilters.has(key);
                    if (isActive) {
                        btn.style.cssText = `padding: ${isMobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.primary}; border-radius: 20px; background: ${colors.primary}; color: white; font-size: ${isMobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation; box-shadow: 0 2px 8px ${colors.shadow};`;
                    } else {
                        btn.style.cssText = `padding: ${isMobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.border}; border-radius: 20px; background: ${colors.surface}; color: ${colors.text}; font-size: ${isMobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation;`;
                    }
                }
            });

            // 最近一周
            const recentWeekBtn = this.element.querySelector('#filter-recent-week');
            if (recentWeekBtn) {
                const isActive = this.state.recentWeekEnabled;
                if (isActive) {
                    recentWeekBtn.style.cssText = `padding: ${isMobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.primary}; border-radius: 20px; background: ${colors.primary}; color: white; font-size: ${isMobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation; box-shadow: 0 2px 8px ${colors.shadow};`;
                } else {
                    recentWeekBtn.style.cssText = `padding: ${isMobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.border}; border-radius: 20px; background: ${colors.surface}; color: ${colors.text}; font-size: ${isMobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation;`;
                }
            }
        }

        // 供外部在数据变化后刷新下拉（分类 / 类型选项与计数）
        refreshDropdowns() {
            if (this.categoryDropdown) this.categoryDropdown.refresh();
            if (this.typeDropdown) this.typeDropdown.refresh();
        }

        categoryOptions() {
            const { categories = new Set(['全部']), prompts = [] } = this.props;
            const counts = {};
            prompts.forEach((prompt) => {
                const key = prompt.category || '未分类';
                counts[key] = (counts[key] || 0) + 1;
            });
            const list = Array.from(categories).filter((cat) => cat !== '全部')
                .sort((a, b) => (counts[b] || 0) - (counts[a] || 0) || a.localeCompare(b));
            return [{ key: 'all', label: '全部', level: 0, count: prompts.length }]
                .concat(list.map((cat) => ({ key: cat, label: cat, level: 0, count: counts[cat] || 0 })));
        }

        typeOptions() {
            const prompts = this.props.prompts || [];
            return TYPE_OPTIONS.map((option) => ({
                key: option.key,
                label: option.label,
                level: option.level,
                parent: option.parent,
                count: prompts.filter((prompt) => matchesType(prompt, option)).length
            }));
        }

        render() {
            const { colors, isMobile } = this.props;

            // 搜索框
            const searchInput = h('input', {
                type: 'text',
                id: 'prompt-search',
                placeholder: '搜索...',
                style: `flex: 1; padding: ${isMobile ? '14px 20px' : '12px 18px'}; border: 1px solid ${colors.inputBorder}; border-radius: 16px; outline: none; font-size: ${isMobile ? '16px' : '14px'}; background: ${colors.inputBg}; color: ${colors.text}; box-sizing: border-box; transition: all 0.2s;`,
                oninput: (e) => {
                    this.state.keyword = e.target.value;
                    if (this.props.onSearch) this.props.onSearch(e.target.value);
                },
                onfocus: (e) => e.target.style.borderColor = colors.primary,
                onblur: (e) => e.target.style.borderColor = colors.inputBorder
            });

            // 排序按钮
            const sortBtn = h('button', {
                id: 'sort-mode-btn',
                style: `padding: ${isMobile ? '10px' : '8px'}; border: none; background: transparent; color: ${colors.textSecondary}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border-radius: 8px;`,
                onclick: () => {
                    const newMode = this.state.sortMode === 'recommend' ? 'random' : 'recommend';
                    this.updateState({ sortMode: newMode });
                    if (this.props.onSortChange) this.props.onSortChange(newMode);
                },
                onmouseenter: !isMobile ? (e) => {
                    e.currentTarget.style.color = colors.primary;
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = `${colors.primary}10`;
                    const tooltip = this.element.querySelector('#sort-tooltip');
                    if (tooltip) tooltip.style.opacity = '1';
                } : null,
                onmouseleave: !isMobile ? (e) => {
                    e.currentTarget.style.color = colors.textSecondary;
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'transparent';
                    const tooltip = this.element.querySelector('#sort-tooltip');
                    if (tooltip) tooltip.style.opacity = '0';
                } : null
            });

            const tooltip = h('div', {
                id: 'sort-tooltip',
                style: `position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); background: ${colors.surface}; color: ${colors.text}; padding: 6px 12px; border-radius: 8px; font-size: 12px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; box-shadow: 0 4px 12px ${colors.shadow}; border: 1px solid ${colors.border}; z-index: 1000;`
            });

            const sortBtnContainer = h('div', {
                style: 'position: relative; display: flex; align-items: center;'
            }, [sortBtn, tooltip]);

            // 分类下拉
            this.categoryDropdown = createFilterDropdown({
                colors,
                isMobile,
                label: '分类',
                searchPlaceholder: '搜索分类…',
                options: () => this.categoryOptions(),
                getSelectedKey: () => this.state.selectedCategory,
                labelOf: (key) => (key === 'all' ? '全部' : key),
                onSelect: (key) => {
                    this.updateState({ selectedCategory: key });
                    if (this.props.onCategoryChange) this.props.onCategoryChange(key);
                }
            });

            // 类型下拉（大类 + 二级）
            this.typeDropdown = createFilterDropdown({
                colors,
                isMobile,
                label: '类型',
                searchPlaceholder: '搜索类型…',
                options: () => this.typeOptions(),
                getSelectedKey: () => this.state.selectedType,
                labelOf: typeLabelOf,
                onSelect: (key) => {
                    this.updateState({ selectedType: key });
                    if (this.props.onTypeChange) this.props.onTypeChange(key);
                }
            });

            const dropdownsContainer = h('div', {
                style: `display: flex; gap: 8px; align-items: center; ${isMobile ? 'flex-wrap: wrap;' : ''}`
            }, [this.categoryDropdown.container, this.typeDropdown.container]);

            const buttonsContainer = h('div', {
                style: `display: flex; gap: 8px; ${isMobile ? 'flex: 1; justify-content: flex-end;' : ''}`
            });

            // 最近一周
            const recentWeekBtn = h('button', {
                id: 'filter-recent-week',
                style: `padding: ${isMobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.border}; border-radius: 20px; background: ${colors.surface}; color: ${colors.text}; font-size: ${isMobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation;`,
                onclick: () => {
                    const newValue = !this.state.recentWeekEnabled;
                    this.updateState({ recentWeekEnabled: newValue });
                    if (this.props.onRecentWeekChange) this.props.onRecentWeekChange(newValue);
                },
                onmouseenter: !isMobile ? (e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = `0 2px 8px ${colors.shadow}`;
                } : null,
                onmouseleave: !isMobile ? (e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = this.state.recentWeekEnabled ? `0 2px 8px ${colors.shadow}` : 'none';
                } : null
            }, '最近一周');
            buttonsContainer.appendChild(recentWeekBtn);

            // 收藏 / 自定义（生成方式已并入「类型」下拉）
            const filters = [
                { key: 'favorite', label: '收藏' },
                { key: 'custom', label: '自定义' }
            ];

            filters.forEach(filter => {
                const btn = h('button', {
                    id: `filter-${filter.key}`,
                    style: `padding: ${isMobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.border}; border-radius: 20px; background: ${colors.surface}; color: ${colors.text}; font-size: ${isMobile ? '14px' : '13px'}; cursor: pointer; transition: all 0.25s ease; white-space: nowrap; touch-action: manipulation;`,
                    onclick: () => {
                        const key = filter.key;
                        const next = new Set(this.state.activeFilters);
                        if (next.has(key)) next.delete(key); else next.add(key);
                        this.updateState({ activeFilters: next });
                        if (this.props.onFilterChange) this.props.onFilterChange(next);
                    },
                    onmouseenter: !isMobile ? (e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = `0 2px 8px ${colors.shadow}`;
                    } : null,
                    onmouseleave: !isMobile ? (e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = this.state.activeFilters.has(filter.key) ? `0 2px 8px ${colors.shadow}` : 'none';
                    } : null
                }, filter.label);
                buttonsContainer.appendChild(btn);
            });

            // 添加提示词
            const addBtn = h('button', {
                title: '添加自定义 Prompt',
                style: `padding: ${isMobile ? '10px 18px' : '8px 18px'}; border: 1px solid ${colors.primary}; border-radius: 20px; background: ${colors.primary}; color: white; font-size: ${isMobile ? '18px' : '16px'}; font-weight: 600; cursor: pointer; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center; line-height: 1; box-shadow: 0 2px 8px ${colors.shadow};`,
                onclick: () => {
                    if (this.props.onAddPrompt) this.props.onAddPrompt();
                }
            }, '+');
            buttonsContainer.appendChild(addBtn);

            const filterContainer = h('div', {
                style: `display: flex; gap: 8px; align-items: center; ${isMobile ? 'justify-content: space-between; flex-wrap: wrap;' : ''}; position: relative; z-index: 101;`
            }, [dropdownsContainer, buttonsContainer]);

            const searchContainer = h('div', {
                style: `${isMobile ? 'width: 100%;' : 'flex: 1;'} display: flex; align-items: center; gap: 8px; position: relative;`
            }, [searchInput, sortBtnContainer]);

            this.element = h('div', {
                style: `padding: ${isMobile ? '16px' : '20px 24px'}; border-bottom: 1px solid ${colors.border}; display: flex; ${isMobile ? 'flex-direction: column; gap: 12px;' : 'align-items: center; gap: 16px;'}; overflow: visible; z-index: 100; position: relative;`
            }, [searchContainer, filterContainer]);

            this.updateView();
            return this.element;
        }
    };
})();
