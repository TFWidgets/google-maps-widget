(function() {
    'use strict';

    // Базовые CSS стили с унифицированными CSS-переменными
    const inlineCSS = `
        .mw-container {
            font-family: var(--mw-font, 'Inter', system-ui, sans-serif);
            max-width: var(--mw-max-width, 520px);
            margin: var(--mw-margin, 20px auto);
            width: 100%;
        }
        
        .mw-widget {
            background: var(--mw-bg, #ffffff);
            border-radius: var(--mw-widget-radius, 16px);
            overflow: hidden;
            box-shadow: var(--mw-shadow, 0 20px 60px rgba(0,0,0,0.15));
            position: relative;
        }
        
        .mw-header {
            background: var(--mw-header-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
            padding: var(--mw-padding, 24px);
            color: var(--mw-text-color, white);
            display: flex;
            align-items: center;
            gap: var(--mw-gap, 16px);
            position: relative;
            overflow: hidden;
        }
        
        .mw-header::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--mw-overlay, 
                radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            );
            pointer-events: none;
        }
        
        .mw-icon {
            width: var(--mw-icon-size, 48px);
            height: var(--mw-icon-size, 48px);
            background: var(--mw-block-bg, rgba(255,255,255,0.22));
            border-radius: var(--mw-block-radius, 12px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--mw-icon-font-size, 20px);
            backdrop-filter: blur(12px);
            border: var(--mw-block-border, 1px solid rgba(255,255,255,0.35));
            position: relative;
            z-index: 1;
        }
        
        .mw-info {
            flex: 1;
            position: relative;
            z-index: 1;
        }
        
        .mw-title {
            margin: 0 0 6px 0;
            font-size: var(--mw-title-size, 1.35em);
            font-weight: var(--mw-title-weight, 700);
            text-shadow: var(--mw-text-shadow, 0 2px 8px rgba(0,0,0,0.3));
            letter-spacing: var(--mw-title-spacing, 0.2px);
            color: var(--mw-title-color, inherit);
        }
        
        .mw-address {
            margin: 0;
            opacity: var(--mw-subtitle-opacity, 0.92);
            font-size: var(--mw-subtitle-size, 0.9em);
            line-height: 1.35;
            font-weight: var(--mw-subtitle-weight, 500);
            color: var(--mw-subtitle-color, inherit);
        }
        
        .mw-map-container {
            position: relative;
            height: var(--mw-map-height, 300px);
            background: #f0f2f5;
        }
        
        .mw-map {
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        
        .mw-error {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            color: #666;
            z-index: 2;
        }
        
        .mw-error-icon {
            font-size: 36px;
            margin-bottom: 12px;
            opacity: 0.7;
        }
        
        .mw-actions {
            display: flex;
            gap: var(--mw-actions-gap, 10px);
            padding: var(--mw-actions-padding, 18px);
            background: #f8f9fa;
        }
        
        .mw-btn {
            flex: 1;
            padding: var(--mw-btn-padding, 14px 18px);
            border-radius: var(--mw-btn-radius, 11px);
            text-decoration: none;
            font-weight: var(--mw-btn-weight, 700);
            font-size: var(--mw-btn-size, 0.9em);
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            font-family: var(--mw-value-font, inherit);
            color: white;
        }
        
        .mw-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.15) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .mw-btn-directions {
            background: var(--mw-btn-primary, #4285f4);
        }
        
        .mw-btn-call {
            background: var(--mw-btn-secondary, #34a853);
        }
        
        .mw-btn-website {
            background: var(--mw-btn-tertiary, #6366f1);
        }
        
        .mw-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--mw-btn-shadow-hover, 0 8px 24px rgba(0,0,0,0.18));
        }
        
        .mw-details {
            padding: var(--mw-details-padding, 22px);
        }
        
        .mw-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: var(--mw-detail-size, 0.9em);
        }
        
        .mw-detail:last-child {
            border-bottom: none;
        }
        
        .mw-detail-label {
            font-weight: var(--mw-detail-label-weight, 600);
            color: var(--mw-detail-label-color, #666);
        }
        
        .mw-detail-value {
            color: var(--mw-detail-value-color, #333333);
            text-align: right;
            font-weight: var(--mw-detail-value-weight, 500);
        }
        
        .mw-loading {
            text-align: center;
            padding: var(--mw-loading-padding, 40px);
            color: var(--mw-loading-color, #666);
        }
        
        .mw-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0,0,0,0.1);
            border-top: 3px solid #4285f4;
            border-radius: 50%;
            animation: mw-spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        @keyframes mw-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
            .mw-container {
                max-width: calc(100vw - 32px);
                margin: var(--mw-margin-mobile, 16px auto);
            }
            .mw-header {
                padding: var(--mw-padding-mobile, 20px);
            }
            .mw-title {
                font-size: var(--mw-title-size-mobile, 1.2em);
            }
            .mw-actions {
                flex-direction: column;
                gap: var(--mw-actions-gap-mobile, 8px);
            }
            .mw-details {
                padding: var(--mw-details-padding-mobile, 18px);
            }
        }
    `;

    // Динамическая загрузка Leaflet
    let leafletLoaded = false;
    function loadLeaflet() {
        if (leafletLoaded || window.L) return Promise.resolve();
        
        return new Promise((resolve) => {
            // CSS
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                css.crossOrigin = '';
                document.head.appendChild(css);
            }

            // JS
            if (!document.querySelector('script[src*="leaflet.js"]')) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                script.crossOrigin = '';
                script.onload = () => {
                    leafletLoaded = true;
                    resolve();
                };
                script.onerror = () => {
                    console.error('[MapsWidget] Failed to load Leaflet');
                    resolve(); // Resolve anyway, map will show error
                };
                document.head.appendChild(script);
            } else {
                leafletLoaded = true;
                resolve();
            }
        });
    }

    try {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

        let clientId = currentScript.dataset.id;
        if (!clientId) {
            console.error('[MapsWidget] data-id обязателен');
            return;
        }

        clientId = normalizeId(clientId);

        // Защита от повторного выполнения
        if (currentScript.dataset.mwMounted === '1') return;
        currentScript.dataset.mwMounted = '1';

        console.log(`[MapsWidget] 🚀 Инициализация виджета "${clientId}"`);

        // Добавляем базовые стили один раз в head
        if (!document.querySelector('#maps-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'maps-widget-styles';
            style.textContent = inlineCSS;
            document.head.appendChild(style);
        }

        const baseUrl = getBasePath(currentScript.src);
        const uniqueClass = `mw-${clientId}-${Date.now()}`;
        const container = createContainer(currentScript, clientId, uniqueClass);
        
        showLoading(container);

        // Загружаем Leaflet и конфигурацию параллельно
        Promise.all([
            loadLeaflet(),
            loadConfig(clientId, baseUrl)
        ]).then(([, fetchedConfig]) => {
            const finalConfig = mergeDeep(getDefaultConfig(), fetchedConfig);
            console.log(`[MapsWidget] 📋 Финальный конфиг для "${clientId}":`, finalConfig);
            
            applyCustomStyles(uniqueClass, finalConfig.style);
            createMapsWidget(container, finalConfig, uniqueClass);
            console.log(`[MapsWidget] ✅ Виджет "${clientId}" успешно создан`);
        }).catch(error => {
            console.warn(`[MapsWidget] ⚠️ Ошибка загрузки "${clientId}":`, error.message);
            const defaultConfig = getDefaultConfig();
            applyCustomStyles(uniqueClass, defaultConfig.style);
            createMapsWidget(container, defaultConfig, uniqueClass);
        });

    } catch (error) {
        console.error('[MapsWidget] 💥 Критическая ошибка:', error);
    }

    function normalizeId(id) {
        return (id || 'demo').replace(/\.(json|js)$/i, '');
    }

    function getBasePath(src) {
        if (!src) return './';
        try {
            const url = new URL(src, location.href);
            return url.origin + url.pathname.replace(/\/[^\/]*$/, '/');
        } catch (error) {
            return './';
        }
    }

    function createContainer(scriptElement, clientId, uniqueClass) {
        const container = document.createElement('div');
        container.id = `maps-widget-${clientId}`;
        container.className = `mw-container ${uniqueClass}`;
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
        return container;
    }

    function showLoading(container) {
        container.innerHTML = `
            <div class="mw-widget">
                <div class="mw-loading">
                    <div class="mw-spinner"></div>
                    <div>Loading map widget...</div>
                </div>
            </div>
        `;
    }

    // УНИФИЦИРОВАННАЯ СТРУКТУРА (точно как у countdown timer и click-to-call)
    function getDefaultConfig() {
        return {
            title: "Tech Hub Office",
            address: "Staroměstské náměstí 1, Prague, Czechia",
            coordinates: {
                lat: 50.0875,
                lng: 14.4213
            },
            zoom: 15,
            phone: "+420 123 456 789",
            email: "info@techhub.cz",
            website: "https://techhub.cz",
            businessHours: "Mon-Fri 9:00-18:00",
            parking: "Free for clients",
            showDirections: true,
            showCall: true,
            showWebsite: false,
            icon: "",
            iconHtml: "&#127970;", // 🏢 как HTML entity
            style: {
                fontFamily: "'Inter', system-ui, sans-serif",
                valueFontFamily: "'Inter', system-ui, sans-serif",
                colors: {
                    background: "#ffffff",
                    text: "white",
                    headerBackground: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    blockBackground: "rgba(255,255,255,0.22)",
                    blockBorder: "rgba(255,255,255,0.35)",
                    blockHover: "rgba(255,255,255,0.30)",
                    borderHover: "rgba(255,255,255,0.55)",
                    btnPrimary: "#4285f4",
                    btnSecondary: "#34a853",
                    btnTertiary: "#6366f1",
                    detailText: "#333333",
                    detailLabel: "#666"
                },
                borderRadius: {
                    widget: 16,
                    blocks: 12
                },
                sizes: {
                    fontSize: 1.0,
                    padding: 24,
                    blockPadding: 14,
                    gap: 10,
                    mapHeight: 300,
                    iconSize: 48,
                    actionsGap: 10,
                    actionsPadding: 18,
                    detailsPadding: 22
                },
                shadow: {
                    widget: "0 20px 60px rgba(0,0,0,0.15)",
                    widgetHover: "0 30px 80px rgba(0,0,0,0.20)",
                    text: "0 2px 8px rgba(0,0,0,0.3)",
                    btnHover: "0 8px 24px rgba(0,0,0,0.18)"
                }
            }
        };
    }

    function mergeDeep(base, override) {
        const result = { ...base, ...override };

        // Сливаем объекты первого уровня
        for (const key of ['style', 'coordinates']) {
            if (base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
                result[key] = { ...(base[key] || {}), ...(override[key] || {}) };
            }
        }

        // Сливаем объекты второго уровня в style (как у countdown timer)
        if (result.style) {
            for (const subKey of ['colors', 'borderRadius', 'sizes', 'shadow']) {
                if (base.style[subKey] && typeof base.style[subKey] === 'object' && !Array.isArray(base.style[subKey])) {
                    result.style[subKey] = { ...(base.style[subKey] || {}), ...(override.style?.[subKey] || {}) };
                }
            }
        }
        
        return result;
    }

    async function loadConfig(clientId, baseUrl) {
        // Локальный конфиг для разработки
        if (clientId === 'local') {
            const localScript = document.querySelector('#mw-local-config');
            if (!localScript) {
                throw new Error('Локальный конфиг не найден (#mw-local-config)');
            }
            try {
                const config = JSON.parse(localScript.textContent);
                console.log(`[MapsWidget] 📄 Локальный конфиг загружен:`, config);
                return config;
            } catch (err) {
                throw new Error('Ошибка парсинга локального JSON: ' + err.message);
            }
        }

        // Загрузка с сервера
        const configUrl = `${baseUrl}configs/${encodeURIComponent(clientId)}.json?v=${Date.now()}`;
        console.log(`[MapsWidget] 🌐 Загружаем конфиг: ${configUrl}`);
        
        const response = await fetch(configUrl, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const config = await response.json();
        console.log(`[MapsWidget] ✅ Серверный конфиг загружен:`, config);
        return config;
    }

    function applyCustomStyles(uniqueClass, style) {
        const styleId = `mw-style-${uniqueClass}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = generateUniqueStyles(uniqueClass, style);
    }

    // УНИФИЦИРОВАННЫЕ CSS-ПЕРЕМЕННЫЕ (как у countdown timer)
    function generateUniqueStyles(uniqueClass, style) {
        const s = style;
        const colors = s.colors || {};
        const sizes = s.sizes || {};
        const borderRadius = s.borderRadius || {};
        const shadow = s.shadow || {};
        const fs = sizes.fontSize || 1;

        return `
            .${uniqueClass} {
                --mw-font: ${s.fontFamily || "'Inter', system-ui, sans-serif"};
                --mw-value-font: ${s.valueFontFamily || "'Inter', system-ui, sans-serif"};
                --mw-max-width: ${Math.round(520 * fs)}px;
                --mw-bg: ${colors.background || "#ffffff"};
                --mw-widget-radius: ${borderRadius.widget || 16}px;
                --mw-padding: ${sizes.padding || 24}px;
                --mw-padding-mobile: ${Math.round((sizes.padding || 24) * 0.8)}px;
                --mw-text-color: ${colors.text || "white"};
                --mw-header-bg: ${colors.headerBackground || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
                --mw-shadow: ${shadow.widget || "0 20px 60px rgba(0,0,0,0.15)"};
                --mw-shadow-hover: ${shadow.widgetHover || "0 30px 80px rgba(0,0,0,0.20)"};
                --mw-text-shadow: ${shadow.text || "0 2px 8px rgba(0,0,0,0.3)"};
                --mw-icon-size: ${sizes.iconSize || 48}px;
                --mw-icon-font-size: ${Math.round((sizes.iconSize || 48) * 0.42)}px;
                --mw-title-size: ${1.35 * fs}em;
                --mw-title-size-mobile: ${1.2 * fs}em;
                --mw-subtitle-size: ${0.9 * fs}em;
                --mw-block-bg: ${colors.blockBackground || "rgba(255,255,255,0.22)"};
                --mw-block-border: 1px solid ${colors.blockBorder || "rgba(255,255,255,0.35)"};
                --mw-block-radius: ${borderRadius.blocks || 12}px;
                --mw-map-height: ${sizes.mapHeight || 300}px;
                --mw-gap: ${sizes.gap || 16}px;
                --mw-actions-gap: ${sizes.actionsGap || 10}px;
                --mw-actions-gap-mobile: ${Math.round((sizes.actionsGap || 10) * 0.8)}px;
                --mw-actions-padding: ${sizes.actionsPadding || 18}px;
                --mw-btn-padding: ${sizes.blockPadding || 14}px 18px;
                --mw-btn-radius: ${borderRadius.blocks || 11}px;
                --mw-btn-size: ${0.9 * fs}em;
                --mw-btn-weight: 700;
                --mw-btn-primary: ${colors.btnPrimary || "#4285f4"};
                --mw-btn-secondary: ${colors.btnSecondary || "#34a853"};
                --mw-btn-tertiary: ${colors.btnTertiary || "#6366f1"};
                --mw-btn-shadow-hover: ${shadow.btnHover || "0 8px 24px rgba(0,0,0,0.18)"};
                --mw-details-padding: ${sizes.detailsPadding || 22}px;
                --mw-details-padding-mobile: ${Math.round((sizes.detailsPadding || 22) * 0.8)}px;
                --mw-detail-size: ${0.9 * fs}em;
                --mw-detail-label-color: ${colors.detailLabel || "#666"};
                --mw-detail-value-color: ${colors.detailText || "#333333"};
            }
        `;
    }

    function createMapsWidget(container, config, uniqueClass) {
        const mapId = `map-${uniqueClass}`;

        // Безопасное отображение иконки
        const iconHtml = renderIcon(config);

        container.innerHTML = `
            <div class="mw-widget">
                <div class="mw-header">
                    <div class="mw-icon">${iconHtml}</div>
                    <div class="mw-info">
                        <h3 class="mw-title">${escapeHtml(config.title)}</h3>
                        <p class="mw-address">${escapeHtml(config.address)}</p>
                    </div>
                </div>
                
                <div class="mw-map-container">
                    <div id="${mapId}" class="mw-map"></div>
                    <div class="mw-error" style="display: none;">
                        <div class="mw-error-icon">⚠️</div>
                        <p>Map temporarily unavailable</p>
                    </div>
                </div>
                
                <div class="mw-actions">
                    ${config.showDirections ? `
                        <a href="${getDirectionsUrl(config.coordinates, config.address)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="mw-btn mw-btn-directions">
                          🚗 Directions
                        </a>
                    ` : ''}
                    
                    ${config.showCall && config.phone ? `
                        <a href="tel:${config.phone.replace(/[^\d+]/g, '')}" 
                           class="mw-btn mw-btn-call">
                          📞 Call
                        </a>
                    ` : ''}
                    
                    ${config.showWebsite && config.website ? `
                        <a href="${escapeAttr(config.website)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="mw-btn mw-btn-website">
                          🌐 Website
                        </a>
                    ` : ''}
                </div>
                
                <div class="mw-details">
                    ${config.phone ? detailRow('Phone:', config.phone) : ''}
                    ${config.email ? detailRow('Email:', config.email) : ''}
                    ${config.businessHours ? detailRow('Business Hours:', config.businessHours) : ''}
                    ${config.parking ? detailRow('Parking:', config.parking) : ''}
                </div>
            </div>
        `;

        // Инициализируем карту
        setTimeout(() => initializeMap(mapId, config), 100);
    }

    function detailRow(label, value) {
        return `
            <div class="mw-detail">
                <span class="mw-detail-label">${escapeHtml(label)}</span>
                <span class="mw-detail-value">${escapeHtml(value)}</span>
            </div>
        `;
    }

    // БЕЗОПАСНОЕ ОТОБРАЖЕНИЕ ИКОНОК (как в click-to-call)
    function renderIcon(config) {
        // Приоритет: iconHtml > icon > дефолт
        if (config.iconHtml && config.iconHtml.trim()) {
            // Если это HTML entity или простой HTML - вставляем как есть
            if (config.iconHtml.includes('&') || config.iconHtml.includes('<')) {
                return config.iconHtml;
            }
            // Если это эмодзи - экранируем
            return escapeHtml(config.iconHtml);
        }
        
        if (config.icon && config.icon.trim()) {
            return escapeHtml(config.icon);
        }
        
        // Дефолтная иконка
        return '&#127970;'; // 🏢
    }

    function initializeMap(mapId, config) {
        try {
            if (!window.L) {
                showMapError(mapId);
                return;
            }

            const map = L.map(mapId, {
                center: [config.coordinates.lat, config.coordinates.lng],
                zoom: config.zoom || 15,
                zoomControl: true,
                scrollWheelZoom: false
            });

            // Добавляем красивые тайлы
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

            // Создаем кастомную иконку
            const iconHtml = renderIcon(config);
            const customIcon = L.divIcon({
                html: `
                    <div style="
                        width: 40px; height: 40px;
                        background: ${config.style?.colors?.btnPrimary || '#4285f4'};
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        display: flex; align-items: center; justify-content: center;
                        box-shadow: 0 6px 18px rgba(0,0,0,0.25);
                        border: 3px solid white;
                    ">
                        <div style="
                            transform: rotate(45deg);
                            font-size: 16px;
                            color: white;
                        ">${iconHtml}</div>
                    </div>
                `,
                className: 'custom-map-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 35]
            });

            // Добавляем маркер
            const marker = L.marker([config.coordinates.lat, config.coordinates.lng], {
                icon: customIcon
            }).addTo(map);

            // Попап с информацией
            marker.bindPopup(`
                <div style="padding: 10px; min-width: 220px;">
                    <h4 style="margin: 0 0 8px 0; color: ${config.style?.colors?.detailText || '#333'}; font-size: 14px;">${escapeHtml(config.title)}</h4>
                    <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${escapeHtml(config.address)}</p>
                    ${config.phone ? `<p style="margin: 0; font-size: 11px;"><strong>📞</strong> ${escapeHtml(config.phone)}</p>` : ''}
                </div>
            `);

            // Управление скроллом
            map.on('click', () => map.scrollWheelZoom.enable());
            map.on('mouseout', () => map.scrollWheelZoom.disable());

        } catch (error) {
            console.error('Map initialization error:', error);
            showMapError(mapId);
        }
    }

    function showMapError(mapId) {
        const mapEl = document.getElementById(mapId);
        const errorEl = mapEl?.parentNode?.querySelector('.mw-error');
        if (mapEl && errorEl) {
            mapEl.style.display = 'none';
            errorEl.style.display = 'flex';
        }
    }

    function getDirectionsUrl(coordinates, address) {
        if (coordinates?.lat && coordinates?.lng) {
            return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
        }
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function escapeAttr(text) {
        return String(text || '').replace(/"/g, '&quot;');
    }
})();
