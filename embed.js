(function() {
    'use strict';

    // Базовые CSS стили с унифицированными CSS-переменными
    const inlineCSS = `
        .bhw-container {
            font-family: var(--bhw-font, 'Inter', system-ui, sans-serif);
            max-width: var(--bhw-max-width, 520px);
            margin: var(--bhw-margin, 20px auto);
            width: 100%;
        }
        
        .bhw-widget {
            background: var(--bhw-bg, #ffffff);
            border-radius: var(--bhw-widget-radius, 16px);
            overflow: hidden;
            box-shadow: var(--bhw-shadow, 0 20px 60px rgba(0,0,0,0.15));
            position: relative;
        }
        
        .bhw-header {
            background: var(--bhw-header-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
            padding: var(--bhw-padding, 24px);
            color: var(--bhw-text-color, white);
            display: flex;
            align-items: center;
            gap: var(--bhw-gap, 16px);
            position: relative;
            overflow: hidden;
        }
        
        .bhw-header::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--bhw-overlay, 
                radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            );
            pointer-events: none;
        }
        
        .bhw-icon {
            width: var(--bhw-icon-size, 48px);
            height: var(--bhw-icon-size, 48px);
            background: var(--bhw-block-bg, rgba(255,255,255,0.22));
            border-radius: var(--bhw-block-radius, 12px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--bhw-icon-font-size, 20px);
            backdrop-filter: blur(12px);
            border: var(--bhw-block-border, 1px solid rgba(255,255,255,0.35));
            position: relative;
            z-index: 1;
        }
        
        .bhw-info {
            flex: 1;
            position: relative;
            z-index: 1;
        }
        
        .bhw-title {
            margin: 0 0 6px 0;
            font-size: var(--bhw-title-size, 1.35em);
            font-weight: var(--bhw-title-weight, 700);
            text-shadow: var(--bhw-text-shadow, 0 2px 8px rgba(0,0,0,0.3));
            letter-spacing: var(--bhw-title-spacing, 0.2px);
            color: var(--bhw-title-color, inherit);
        }
        
        .bhw-address {
            margin: 0;
            opacity: var(--bhw-subtitle-opacity, 0.92);
            font-size: var(--bhw-subtitle-size, 0.9em);
            line-height: 1.35;
            font-weight: var(--bhw-subtitle-weight, 500);
            color: var(--bhw-subtitle-color, inherit);
        }
        
        .bhw-map-container {
            position: relative;
            height: var(--bhw-map-height, 300px);
            background: #f0f2f5;
        }
        
        .bhw-map {
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        
        .bhw-error {
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
        
        .bhw-error-icon {
            font-size: 36px;
            margin-bottom: 12px;
            opacity: 0.7;
        }
        
        .bhw-actions {
            display: flex;
            gap: var(--bhw-actions-gap, 10px);
            padding: var(--bhw-actions-padding, 18px);
            background: #f8f9fa;
        }
        
        .bhw-btn {
            flex: 1;
            padding: var(--bhw-btn-padding, 14px 18px);
            border-radius: var(--bhw-btn-radius, 11px);
            text-decoration: none;
            font-weight: var(--bhw-btn-weight, 700);
            font-size: var(--bhw-btn-size, 0.9em);
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            font-family: var(--bhw-value-font, inherit);
            color: white;
        }
        
        .bhw-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.15) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .bhw-btn-directions {
            background: var(--bhw-btn-primary, #4285f4);
        }
        
        .bhw-btn-call {
            background: var(--bhw-btn-secondary, #34a853);
        }
        
        .bhw-btn-website {
            background: var(--bhw-btn-tertiary, #6366f1);
        }
        
        .bhw-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--bhw-btn-shadow-hover, 0 8px 24px rgba(0,0,0,0.18));
        }
        
        .bhw-details {
            padding: var(--bhw-details-padding, 22px);
        }
        
        .bhw-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: var(--bhw-detail-size, 0.9em);
        }
        
        .bhw-detail:last-child {
            border-bottom: none;
        }
        
        .bhw-detail-label {
            font-weight: var(--bhw-detail-label-weight, 600);
            color: var(--bhw-detail-label-color, #666);
        }
        
        .bhw-detail-value {
            color: var(--bhw-detail-value-color, #333333);
            text-align: right;
            font-weight: var(--bhw-detail-value-weight, 500);
        }
        
        .bhw-loading {
            text-align: center;
            padding: var(--bhw-loading-padding, 40px);
            color: var(--bhw-loading-color, #666);
        }
        
        .bhw-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(0,0,0,0.1);
            border-top: 3px solid #4285f4;
            border-radius: 50%;
            animation: bhw-spin 1s linear infinite;
            margin: 0 auto 15px;
        }
        
        @keyframes bhw-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
            .bhw-container {
                max-width: calc(100vw - 32px);
                margin: var(--bhw-margin-mobile, 16px auto);
            }
            .bhw-header {
                padding: var(--bhw-padding-mobile, 20px);
            }
            .bhw-title {
                font-size: var(--bhw-title-size-mobile, 1.2em);
            }
            .bhw-actions {
                flex-direction: column;
                gap: var(--bhw-actions-gap-mobile, 8px);
            }
            .bhw-details {
                padding: var(--bhw-details-padding-mobile, 18px);
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
                    console.error('[BusinessHoursMapsWidget] Failed to load Leaflet');
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
            console.error('[BusinessHoursMapsWidget] data-id обязателен');
            return;
        }

        clientId = normalizeId(clientId);

        // Защита от повторного выполнения
        if (currentScript.dataset.bhwMounted === '1') return;
        currentScript.dataset.bhwMounted = '1';

        console.log(`[BusinessHoursMapsWidget] 🚀 Инициализация виджета "${clientId}"`);

        // Добавляем базовые стили один раз в head с уникальным ID
        if (!document.querySelector('#business-hours-maps-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'business-hours-maps-widget-styles';
            style.textContent = inlineCSS;
            document.head.appendChild(style);
        }

        const baseUrl = getBasePath(currentScript.src);
        const uniqueClass = `bhw-maps-${clientId}-${Date.now()}`;
        const container = createContainer(currentScript, clientId, uniqueClass);
        
        showLoading(container);

        // Загружаем Leaflet и конфигурацию параллельно
        Promise.all([
            loadLeaflet(),
            loadConfig(clientId, baseUrl)
        ]).then(([, fetchedConfig]) => {
            const finalConfig = mergeDeep(getDefaultConfig(), fetchedConfig);
            console.log(`[BusinessHoursMapsWidget] 📋 Финальный конфиг для "${clientId}":`, finalConfig);
            
            applyCustomStyles(uniqueClass, finalConfig.style);
            createMapsWidget(container, finalConfig, uniqueClass);
            console.log(`[BusinessHoursMapsWidget] ✅ Виджет "${clientId}" успешно создан`);
        }).catch(error => {
            console.warn(`[BusinessHoursMapsWidget] ⚠️ Ошибка загрузки "${clientId}":`, error.message);
            const defaultConfig = getDefaultConfig();
            applyCustomStyles(uniqueClass, defaultConfig.style);
            createMapsWidget(container, defaultConfig, uniqueClass);
        });

    } catch (error) {
        console.error('[BusinessHoursMapsWidget] 💥 Критическая ошибка:', error);
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
        container.id = `business-hours-maps-widget-${clientId}`;
        container.className = `bhw-container ${uniqueClass}`;
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
        return container;
    }

    function showLoading(container) {
        container.innerHTML = `
            <div class="bhw-widget">
                <div class="bhw-loading">
                    <div class="bhw-spinner"></div>
                    <div>Loading map widget...</div>
                </div>
            </div>
        `;
    }

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
            const localScript = document.querySelector('#bhw-maps-local-config');
            if (!localScript) {
                throw new Error('Локальный конфиг не найден (#bhw-maps-local-config)');
            }
            try {
                const config = JSON.parse(localScript.textContent);
                console.log(`[BusinessHoursMapsWidget] 📄 Локальный конфиг загружен:`, config);
                return config;
            } catch (err) {
                throw new Error('Ошибка парсинга локального JSON: ' + err.message);
            }
        }

        // Загрузка с сервера
        const configUrl = `${baseUrl}configs/${encodeURIComponent(clientId)}.json?v=${Date.now()}`;
        console.log(`[BusinessHoursMapsWidget] 🌐 Загружаем конфиг: ${configUrl}`);
        
        const response = await fetch(configUrl, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const config = await response.json();
        console.log(`[BusinessHoursMapsWidget] ✅ Серверный конфиг загружен:`, config);
        return config;
    }

    function applyCustomStyles(uniqueClass, style) {
        const styleId = `bhw-maps-style-${uniqueClass}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = generateUniqueStyles(uniqueClass, style);
    }

    function generateUniqueStyles(uniqueClass, style) {
        const s = style || {};
        const colors = s.colors || {};
        const sizes = s.sizes || {};
        const borderRadius = s.borderRadius || {};
        const shadow = s.shadow || {};
        const fs = sizes.fontSize || 1;

        return `
            .${uniqueClass} {
                --bhw-font: ${s.fontFamily || "'Inter', system-ui, sans-serif"};
                --bhw-value-font: ${s.valueFontFamily || "'Inter', system-ui, sans-serif"};
                --bhw-max-width: ${Math.round(520 * fs)}px;
                --bhw-bg: ${colors.background || "#ffffff"};
                --bhw-widget-radius: ${borderRadius.widget || 16}px;
                --bhw-padding: ${sizes.padding || 24}px;
                --bhw-padding-mobile: ${Math.round((sizes.padding || 24) * 0.8)}px;
                --bhw-text-color: ${colors.text || "white"};
                --bhw-header-bg: ${colors.headerBackground || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
                --bhw-shadow: ${shadow.widget || "0 20px 60px rgba(0,0,0,0.15)"};
                --bhw-shadow-hover: ${shadow.widgetHover || "0 30px 80px rgba(0,0,0,0.20)"};
                --bhw-text-shadow: ${shadow.text || "0 2px 8px rgba(0,0,0,0.3)"};
                --bhw-icon-size: ${sizes.iconSize || 48}px;
                --bhw-icon-font-size: ${Math.round((sizes.iconSize || 48) * 0.42)}px;
                --bhw-title-size: ${1.35 * fs}em;
                --bhw-title-size-mobile: ${1.2 * fs}em;
                --bhw-subtitle-size: ${0.9 * fs}em;
                --bhw-block-bg: ${colors.blockBackground || "rgba(255,255,255,0.22)"};
                --bhw-block-border: 1px solid ${colors.blockBorder || "rgba(255,255,255,0.35)"};
                --bhw-block-radius: ${borderRadius.blocks || 12}px;
                --bhw-map-height: ${sizes.mapHeight || 300}px;
                --bhw-gap: ${sizes.gap || 16}px;
                --bhw-actions-gap: ${sizes.actionsGap || 10}px;
                --bhw-actions-gap-mobile: ${Math.round((sizes.actionsGap || 10) * 0.8)}px;
                --bhw-actions-padding: ${sizes.actionsPadding || 18}px;
                --bhw-btn-padding: ${sizes.blockPadding || 14}px 18px;
                --bhw-btn-radius: ${borderRadius.blocks || 11}px;
                --bhw-btn-size: ${0.9 * fs}em;
                --bhw-btn-weight: 700;
                --bhw-btn-primary: ${colors.btnPrimary || "#4285f4"};
                --bhw-btn-secondary: ${colors.btnSecondary || "#34a853"};
                --bhw-btn-tertiary: ${colors.btnTertiary || "#6366f1"};
                --bhw-btn-shadow-hover: ${shadow.btnHover || "0 8px 24px rgba(0,0,0,0.18)"};
                --bhw-details-padding: ${sizes.detailsPadding || 22}px;
                --bhw-details-padding-mobile: ${Math.round((sizes.detailsPadding || 22) * 0.8)}px;
                --bhw-detail-size: ${0.9 * fs}em;
                --bhw-detail-label-color: ${colors.detailLabel || "#666"};
                --bhw-detail-value-color: ${colors.detailText || "#333333"};
            }
        `;
    }

    function createMapsWidget(container, config, uniqueClass) {
        const mapId = `map-${uniqueClass}`;

        // Безопасное отображение иконки
        const iconHtml = renderIcon(config);

        container.innerHTML = `
            <div class="bhw-widget">
                <div class="bhw-header">
                    <div class="bhw-icon">${iconHtml}</div>
                    <div class="bhw-info">
                        <h3 class="bhw-title">${escapeHtml(config.title)}</h3>
                        <p class="bhw-address">${escapeHtml(config.address)}</p>
                    </div>
                </div>
                
                <div class="bhw-map-container">
                    <div id="${mapId}" class="bhw-map"></div>
                    <div class="bhw-error" style="display: none;">
                        <div class="bhw-error-icon">⚠️</div>
                        <p>Map temporarily unavailable</p>
                    </div>
                </div>
                
                <div class="bhw-actions">
                    ${config.showDirections ? `
                        <a href="${getDirectionsUrl(config.coordinates, config.address)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="bhw-btn bhw-btn-directions">
                          🚗 Directions
                        </a>
                    ` : ''}
                    
                    ${config.showCall && config.phone ? `
                        <a href="tel:${config.phone.replace(/[^\d+]/g, '')}" 
                           class="bhw-btn bhw-btn-call">
                          📞 Call
                        </a>
                    ` : ''}
                    
                    ${config.showWebsite && config.website ? `
                        <a href="${escapeAttr(config.website)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="bhw-btn bhw-btn-website">
                          🌐 Website
                        </a>
                    ` : ''}
                </div>
                
                <div class="bhw-details">
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
            <div class="bhw-detail">
                <span class="bhw-detail-label">${escapeHtml(label)}</span>
                <span class="bhw-detail-value">${escapeHtml(value)}</span>
            </div>
        `;
    }

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

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);

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
                className: 'bhw-custom-map-marker',
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
        const errorEl = mapEl?.parentNode?.querySelector('.bhw-error');
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
