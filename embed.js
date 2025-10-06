(function() {
    'use strict';

    const inlineCSS = `
        .bhw-container {
            font-family: var(--bhw-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            max-width: var(--bhw-max-width, 520px);
            margin: var(--bhw-margin, 20px auto);
        }
        
        .bhw-widget {
            background: var(--bhw-bg, #ffffff);
            border-radius: var(--bhw-radius, 20px);
            padding: var(--bhw-padding, 0);
            color: var(--bhw-text-color, white);
            box-shadow: var(--bhw-shadow, 0 20px 60px rgba(102, 126, 234, 0.4));
            position: relative;
            overflow: hidden;
        }
        
        .bhw-widget::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--bhw-overlay, radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%));
            pointer-events: none;
        }
        
        .bhw-header {
            text-align: var(--bhw-header-align, left);
            margin-bottom: var(--bhw-header-margin-bottom, 0);
            position: relative;
            z-index: 1;
            background: var(--bhw-header-bg, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
            padding: var(--bhw-header-padding, 24px);
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .bhw-timezone-info {
            width: var(--bhw-icon-size, 48px);
            height: var(--bhw-icon-size, 48px);
            background: var(--bhw-open-color, rgba(255,255,255,0.22));
            border-radius: var(--bhw-badge-radius, 12px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--bhw-icon-font-size, 20px);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.35);
            position: relative;
            z-index: 1;
        }
        
        .bhw-info {
            flex: 1;
            position: relative;
            z-index: 1;
        }
        
        .bhw-business-name {
            font-size: var(--bhw-name-size, 1.35em);
            font-weight: var(--bhw-name-weight, 700);
            margin-bottom: var(--bhw-name-margin-bottom, 6px);
            text-shadow: var(--bhw-name-shadow, 0 2px 8px rgba(0,0,0,0.3));
            color: var(--bhw-name-color, inherit);
            margin-top: 0;
        }
        
        .bhw-status-badge {
            margin: 0;
            opacity: var(--bhw-badge-opacity, 0.92);
            font-size: var(--bhw-badge-size, 0.9em);
            line-height: 1.35;
            font-weight: var(--bhw-badge-weight, 500);
            color: inherit;
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
            background: var(--bhw-error-bg, #f8f9fa);
            color: var(--bhw-error-text, #666);
            z-index: 2;
            text-align: center;
            padding: 24px;
        }
        
        .bhw-error-icon {
            font-size: 36px;
            margin-bottom: 12px;
            opacity: 0.7;
        }
        
        .bhw-closing-info {
            background: var(--bhw-info-bg, #f8f9fa);
            padding: var(--bhw-info-padding, 18px);
            border-radius: var(--bhw-info-radius, 0);
            text-align: center;
            font-weight: var(--bhw-info-weight, 600);
            margin-bottom: var(--bhw-info-margin-bottom, 0);
            color: var(--bhw-info-color, inherit);
            position: relative;
            z-index: 1;
            display: flex;
            gap: 10px;
        }
        
        .bhw-hours-time {
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
            color: white;
            display: inline-block;
        }
        
        .bhw-hours-time::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.15) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .bhw-hours-time.directions {
            background: var(--bhw-open-color, #4285f4);
        }
        
        .bhw-hours-time.call {
            background: var(--bhw-closed-color, #34a853);
        }
        
        .bhw-hours-time.website {
            background: var(--bhw-tertiary-color, #6366f1);
        }
        
        .bhw-hours-time:hover {
            transform: translateY(-2px);
            box-shadow: var(--bhw-btn-shadow-hover, 0 8px 24px rgba(0,0,0,0.18));
        }
        
        .bhw-hours-table {
            background: var(--bhw-table-bg, #ffffff);
            border-radius: var(--bhw-table-radius, 0);
            padding: var(--bhw-table-padding, 22px);
            color: var(--bhw-table-text, #333);
            margin: var(--bhw-table-margin, 0);
            position: relative;
            z-index: 1;
        }
        
        .bhw-hours-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--bhw-row-padding, 10px 0);
            border-bottom: var(--bhw-row-border, 1px solid #f0f0f0);
            font-size: var(--bhw-day-size, 0.9em);
        }
        
        .bhw-hours-row:last-child {
            border-bottom: none;
        }
        
        .bhw-day-name {
            font-weight: var(--bhw-day-weight, 600);
            color: var(--bhw-day-color, #666);
        }
        
        .bhw-hours-time.detail-value {
            color: var(--bhw-time-color, #333333);
            text-align: right;
            font-weight: var(--bhw-time-weight, 500);
            background: none;
            padding: 0;
            border-radius: 0;
            transform: none;
            box-shadow: none;
            cursor: default;
        }
        
        .bhw-hours-time.detail-value:hover {
            transform: none;
            box-shadow: none;
        }
        
        .bhw-loading {
            text-align: center;
            padding: var(--bhw-loading-padding, 40px);
            position: relative;
            z-index: 1;
            color: var(--bhw-loading-text-color, white);
        }
        
        .bhw-spinner {
            width: 40px;
            height: 40px;
            border: var(--bhw-spinner-border, 3px solid rgba(255,255,255,0.3));
            border-top: var(--bhw-spinner-top-border, 3px solid white);
            border-radius: 50%;
            animation: bhw-spin 1s linear infinite;
            margin: var(--bhw-spinner-margin, 0 auto 15px);
        }
        
        @keyframes bhw-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
            .bhw-widget {
                padding: var(--bhw-padding-mobile, 0);
            }
            .bhw-header {
                padding: var(--bhw-header-padding-mobile, 20px);
            }
            .bhw-hours-table {
                padding: var(--bhw-table-padding-mobile, 18px);
            }
            .bhw-business-name {
                font-size: var(--bhw-name-size-mobile, 1.2em);
            }
            .bhw-closing-info {
                flex-direction: column;
                gap: 8px;
            }
        }
    `;

    let leafletLoaded = false;
    function loadLeaflet() {
        if (leafletLoaded || window.L) return Promise.resolve();
        
        return new Promise((resolve) => {
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
                css.crossOrigin = '';
                document.head.appendChild(css);
            }

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
                    console.error('[BusinessHoursWidget] Failed to load Leaflet');
                    resolve();
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
            console.error('[BusinessHoursWidget] data-id обязателен');
            return;
        }

        if (clientId.endsWith('.js')) {
            clientId = clientId.slice(0, -3);
        }

        if (currentScript.dataset.bhwMounted === '1') return;
        currentScript.dataset.bhwMounted = '1';

        console.log(`[BusinessHoursWidget] Normalized clientId: ${clientId}`);

        if (!document.querySelector('#business-hours-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'business-hours-widget-styles';
            style.textContent = inlineCSS;
            document.head.appendChild(style);
        }

        // Определяем baseUrl
        const baseUrl = currentScript.src ? 
            currentScript.src.replace(/\/[^\/]*$/, '') : 
            './';

        // Создаем контейнер с уникальным классом
        const uniqueClass = `bhw-${clientId}-${Date.now()}`;
        const container = createContainer(currentScript, clientId, uniqueClass);
        
        // Показываем загрузку
        showLoading(container);

        // Загружаем Leaflet и конфигурацию параллельно
        Promise.all([
            loadLeaflet(),
            loadConfig(clientId, baseUrl)
        ]).then(([, config]) => {
            applyCustomStyles(container, config, uniqueClass);
            createBusinessHoursWidget(container, config, uniqueClass);
            console.log(`[BusinessHoursWidget] Виджет ${clientId} успешно создан`);
        })
        .catch(error => {
            console.error('[BusinessHoursWidget] Ошибка:', error);
            showError(container, clientId, error.message);
        });

    } catch (error) {
        console.error('[BusinessHoursWidget] Критическая ошибка:', error);
    }

    function createContainer(scriptElement, clientId, uniqueClass) {
        const container = document.createElement('div');
        container.id = `business-hours-widget-${clientId}`;
        container.className = `bhw-container ${uniqueClass}`;
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
        return container;
    }

    function showLoading(container) {
        container.innerHTML = `
            <div class="bhw-widget">
                <div class="bhw-loading">
                    <div class="bhw-spinner"></div>
                    <div>Загрузка карты...</div>
                </div>
            </div>
        `;
    }

    async function loadConfig(clientId, baseUrl) {
        if (clientId === 'local') {
            const localScript = document.querySelector('#bhw-local-config');
            if (!localScript) {
                throw new Error('Локальный конфиг не найден на странице (#bhw-local-config)');
            }
            try {
                return JSON.parse(localScript.textContent);
            } catch (err) {
                throw new Error('Ошибка парсинга локального конфига: ' + err.message);
            }
        } else {
            const configUrl = `${baseUrl}/configs/${encodeURIComponent(clientId)}.json?v=${Date.now()}`;
            try {
                const response = await fetch(configUrl, { cache: 'no-cache', headers: { 'Accept': 'application/json' } });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return await response.json();
            } catch (error) {
                console.warn(`[BusinessHoursWidget] Основной конфиг недоступен, используем demo: ${error.message}`);
                const demoResponse = await fetch(`${baseUrl}/configs/demo.json?v=${Date.now()}`, {
                    cache: 'no-cache',
                    headers: { 'Accept': 'application/json' }
                });
                if (!demoResponse.ok) throw new Error('Конфигурация недоступна');
                return await demoResponse.json();
            }
        }
    }

    function applyCustomStyles(container, config, uniqueClass) {
        const s = config.styling || {};
        
        const styleElement = document.createElement('style');
        styleElement.textContent = generateUniqueStyles(uniqueClass, s);
        container.appendChild(styleElement);
    }

    function generateUniqueStyles(uniqueClass, styling) {
        const s = styling;
        const background = s.primaryColor && s.secondaryColor ? 
            `linear-gradient(135deg, ${s.primaryColor} 0%, ${s.secondaryColor} 100%)` : 
            (s.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');

        return `
            .${uniqueClass} {
                font-family: ${s.fontFamily || 'inherit'};
            }
            
            .${uniqueClass} .bhw-widget {
                background: ${s.widgetBackground || '#ffffff'};
                border-radius: ${s.borderRadius || '20px'};
                color: ${s.textColor || 'white'};
            }
            
            .${uniqueClass} .bhw-header {
                background: ${background};
                padding: ${s.padding || '24px'};
            }
            
            .${uniqueClass} .bhw-business-name {
                font-size: ${s.businessNameSize || '1.35em'};
            }
            
            .${uniqueClass} .bhw-hours-time.directions {
                background: ${s.directionsColor || '#4285f4'};
            }
            
            .${uniqueClass} .bhw-hours-time.call {
                background: ${s.callColor || '#34a853'};
            }
            
            .${uniqueClass} .bhw-hours-time.website {
                background: ${s.websiteColor || '#6366f1'};
            }
            
            @media (max-width: 480px) {
                .${uniqueClass} .bhw-header {
                    padding: ${s.paddingMobile || '20px'};
                }
                .${uniqueClass} .bhw-business-name {
                    font-size: ${s.nameSizeMobile || '1.2em'};
                }
            }
        `;
    }

    function createBusinessHoursWidget(container, config, uniqueClass) {
        const mapId = `map-${uniqueClass}`;

        // Безопасное отображение иконки
        const iconHtml = generateTimezoneDisplay(config);

        container.innerHTML = `
            <div class="bhw-widget">
                <div class="bhw-header">
                    <div class="bhw-timezone-info">${iconHtml}</div>
                    <div class="bhw-info">
                        <h2 class="bhw-business-name">${escapeHtml(config.businessName || config.title || 'Map Location')}</h2>
                        <div class="bhw-status-badge">${escapeHtml(config.address || 'Address not provided')}</div>
                    </div>
                </div>
                
                <div class="bhw-map-container">
                    <div id="${mapId}" class="bhw-map"></div>
                    <div class="bhw-error" style="display: none;">
                        <div class="bhw-error-icon">⚠️</div>
                        <p>Map temporarily unavailable</p>
                    </div>
                </div>
                
                <div class="bhw-closing-info">
                    ${config.showDirections !== false ? `
                        <a href="${getDirectionsUrl(config.coordinates, config.address)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="bhw-hours-time directions">
                          🚗 Directions
                        </a>
                    ` : ''}
                    
                    ${config.showCall !== false && config.phone ? `
                        <a href="tel:${config.phone.replace(/[^\d+]/g, '')}" 
                           class="bhw-hours-time call">
                          📞 Call
                        </a>
                    ` : ''}
                    
                    ${config.showWebsite && config.website ? `
                        <a href="${escapeAttr(config.website)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="bhw-hours-time website">
                          🌐 Website
                        </a>
                    ` : ''}
                </div>
                
                <div class="bhw-hours-table">
                    ${config.phone ? createHoursRow('Phone:', config.phone) : ''}
                    ${config.email ? createHoursRow('Email:', config.email) : ''}
                    ${config.businessHours ? createHoursRow('Business Hours:', config.businessHours) : ''}
                    ${config.parking ? createHoursRow('Parking:', config.parking) : ''}
                </div>
            </div>
        `;

        // Инициализируем карту
        setTimeout(() => initializeMap(mapId, config), 100);
    }

    function createHoursRow(label, value) {
        return `
            <div class="bhw-hours-row">
                <span class="bhw-day-name">${escapeHtml(label)}</span>
                <span class="bhw-hours-time detail-value">${escapeHtml(value)}</span>
            </div>
        `;
    }

    function generateTimezoneDisplay(config) {
        // Приоритет: iconHtml > icon > дефолт
        if (config.iconHtml && config.iconHtml.trim()) {
            if (config.iconHtml.includes('&') || config.iconHtml.includes('<')) {
                return config.iconHtml;
            }
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

            const iconHtml = generateTimezoneDisplay(config);
            const customIcon = L.divIcon({
                html: `
                    <div style="
                        width: 40px; height: 40px;
                        background: ${config.styling?.directionsColor || '#4285f4'};
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

            const marker = L.marker([config.coordinates.lat, config.coordinates.lng], {
                icon: customIcon
            }).addTo(map);

            marker.bindPopup(`
                <div style="padding: 10px; min-width: 220px;">
                    <h4 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">${escapeHtml(config.businessName || config.title)}</h4>
                    <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${escapeHtml(config.address)}</p>
                    ${config.phone ? `<p style="margin: 0; font-size: 11px;"><strong>📞</strong> ${escapeHtml(config.phone)}</p>` : ''}
                </div>
            `);

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
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || '')}`;
    }

    function parseTime(timeStr) {
        const [hours, minutes] = String(timeStr).split(':').map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function escapeAttr(text) {
        return String(text || '').replace(/"/g, '&quot;');
    }

    function showError(container, clientId, message) {
        container.innerHTML = `
            <div class="bhw-widget bhw-error">
                <h3 style="margin: 0 0 15px 0;">🗺️ Map unavailable</h3>
                <p style="margin: 0; opacity: 0.9; font-size: 0.9em;">ID: ${escapeHtml(clientId)}</p>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; opacity: 0.8;">Details</summary>
                    <p style="margin: 10px 0 0 0; font-size: 0.8em; opacity: 0.7;">${escapeHtml(message)}</p>
                </details>
            </div>
        `;
    }
})();
