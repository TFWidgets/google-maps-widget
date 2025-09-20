(function() {
    'use strict';

    // CSS стили с полной кастомизацией
    const inlineCSS = `
        .gmw-container {
            font-family: var(--gmw-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
            max-width: var(--gmw-max-width, 100%);
            margin: var(--gmw-margin, 20px auto);
            border-radius: var(--gmw-radius, 16px);
            overflow: hidden;
            box-shadow: var(--gmw-shadow, 0 8px 32px rgba(0,0,0,0.1));
            background: var(--gmw-bg, white);
        }
        
        .gmw-header {
            padding: var(--gmw-header-padding, 20px);
            background: var(--gmw-header-bg, linear-gradient(135deg, #4285f4 0%, #34a853 100%));
            color: var(--gmw-header-color, white);
            text-align: var(--gmw-header-align, left);
        }
        
        .gmw-title {
            margin: 0 0 8px 0;
            font-size: var(--gmw-title-size, 1.4em);
            font-weight: var(--gmw-title-weight, 600);
            color: var(--gmw-title-color, inherit);
        }
        
        .gmw-address {
            margin: 0;
            font-size: var(--gmw-address-size, 0.9em);
            opacity: var(--gmw-address-opacity, 0.9);
            color: var(--gmw-address-color, inherit);
        }
        
        .gmw-map-container {
            position: relative;
            height: var(--gmw-map-height, 300px);
            background: var(--gmw-map-bg, #f0f0f0);
        }
        
        .gmw-map {
            width: 100%;
            height: 100%;
        }
        
        .gmw-footer {
            padding: var(--gmw-footer-padding, 15px 20px);
            background: var(--gmw-footer-bg, #f8f9fa);
            display: flex;
            gap: var(--gmw-footer-gap, 10px);
            flex-wrap: wrap;
        }
        
        .gmw-button {
            flex: 1;
            min-width: 120px;
            padding: var(--gmw-button-padding, 10px 16px);
            background: var(--gmw-button-bg, #4285f4);
            color: var(--gmw-button-color, white);
            border: none;
            border-radius: var(--gmw-button-radius, 8px);
            font-weight: var(--gmw-button-weight, 500);
            font-size: var(--gmw-button-size, 0.9em);
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.3s ease;
        }
        
        .gmw-button:hover {
            background: var(--gmw-button-hover, #3367d6);
            transform: translateY(-2px);
        }
        
        .gmw-button.secondary {
            background: var(--gmw-button-secondary, #34a853);
        }
        
        .gmw-button.secondary:hover {
            background: var(--gmw-button-secondary-hover, #2d8f47);
        }
        
        .gmw-info-panel {
            padding: var(--gmw-info-padding, 15px 20px);
            background: var(--gmw-info-bg, #f8f9fa);
            border-top: var(--gmw-info-border, 1px solid #e9ecef);
            font-size: var(--gmw-info-size, 0.85em);
            color: var(--gmw-info-color, #666);
        }
        
        .gmw-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .gmw-info-row:last-child {
            margin-bottom: 0;
        }
        
        .gmw-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            color: #666;
        }
        
        .gmw-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4285f4;
            border-radius: 50%;
            animation: gmw-spin 1s linear infinite;
            margin-bottom: 15px;
        }
        
        .gmw-error {
            padding: 30px 20px;
            background: #fee2e2;
            color: #dc2626;
            text-align: center;
        }
        
        @keyframes gmw-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
            .gmw-footer {
                flex-direction: column;
            }
            .gmw-button {
                min-width: auto;
            }
        }
    `;

    // Темы карт Google Maps
    const MAP_STYLES = {
        standard: [],
        silver: [
            {"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},
            {"elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},
            {"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},
            {"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9c9c9"}]}
        ],
        night: [
            {"elementType":"geometry","stylers":[{"color":"#242f3e"}]},
            {"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},
            {"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},
            {"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]}
        ],
        retro: [
            {"elementType":"geometry","stylers":[{"color":"#ebe3cd"}]},
            {"elementType":"labels.text.fill","stylers":[{"color":"#523735"}]},
            {"featureType":"road","elementType":"geometry","stylers":[{"color":"#f5f1e6"}]},
            {"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#b9d3c2"}]}
        ]
    };

    try {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

        let clientId = currentScript.dataset.id;
        if (!clientId) {
            console.error('[GoogleMapsWidget] data-id обязателен');
            return;
        }

        // Нормализация clientId: убираем .js расширение
        if (clientId.endsWith('.js')) {
            clientId = clientId.slice(0, -3);
        }

        console.log(`[GoogleMapsWidget] Normalized clientId: ${clientId}`);

        // Добавляем стили один раз
        if (!document.querySelector('#google-maps-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'google-maps-widget-styles';
            style.textContent = inlineCSS;
            document.head.appendChild(style);
        }

        // Определяем baseUrl
        const baseUrl = currentScript.src ? 
            currentScript.src.replace(/\/[^\/]*$/, '') : 
            'https://maps-widget.tf-widgets.com';

        // URL конфига
        const configUrl = `${baseUrl}/configs/${encodeURIComponent(clientId)}.json?v=${Date.now()}`;

        // Создаем контейнер
        const container = createContainer(currentScript, clientId);
        
        // Показываем загрузку
        showLoading(container);

        // Загружаем конфигурацию
        loadConfig(configUrl, baseUrl)
            .then(config => {
                validateConfig(config);
                applyCustomStyles(container, config);
                initializeGoogleMap(container, config, clientId);
                console.log(`[GoogleMapsWidget] Виджет ${clientId} успешно создан`);
            })
            .catch(error => {
                console.error('[GoogleMapsWidget] Ошибка:', error);
                showError(container, clientId, error.message);
            });

    } catch (error) {
        console.error('[GoogleMapsWidget] Критическая ошибка:', error);
    }

    function createContainer(scriptElement, clientId) {
        const container = document.createElement('div');
        container.id = `google-maps-widget-${clientId}`;
        container.className = 'gmw-container';
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
        return container;
    }

    function showLoading(container) {
        container.innerHTML = `
            <div class="gmw-loading">
                <div class="gmw-spinner"></div>
                <div>Загрузка карты...</div>
            </div>
        `;
    }

    async function loadConfig(configUrl, baseUrl) {
        try {
            const response = await fetch(configUrl, {
                cache: 'no-cache',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.warn(`[GoogleMapsWidget] Основной конфиг недоступен, используем demo: ${error.message}`);
            
            const demoResponse = await fetch(`${baseUrl}/configs/demo.json?v=${Date.now()}`, {
                cache: 'no-cache',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!demoResponse.ok) {
                throw new Error('Конфигурация карты недоступна');
            }
            
            return await demoResponse.json();
        }
    }

    function validateConfig(config) {
        if (!config.apiKey) {
            throw new Error('API Key отсутствует в конфигурации');
        }
        
        if (!config.center || typeof config.center.lat !== 'number' || typeof config.center.lng !== 'number') {
            throw new Error('Координаты центра карты некорректны');
        }
    }

    function applyCustomStyles(container, config) {
        const s = config.styling || {};
        
        // Основные стили контейнера
        if (s.maxWidth) container.style.setProperty('--gmw-max-width', s.maxWidth);
        if (s.borderRadius) container.style.setProperty('--gmw-radius', s.borderRadius);
        if (s.shadow) container.style.setProperty('--gmw-shadow', s.shadow);
        if (s.fontFamily) container.style.setProperty('--gmw-font', s.fontFamily);
        
        // Заголовок
        if (s.primaryColor && s.secondaryColor) {
            container.style.setProperty('--gmw-header-bg', `linear-gradient(135deg, ${s.primaryColor} 0%, ${s.secondaryColor} 100%)`);
        } else if (s.headerBackground) {
            container.style.setProperty('--gmw-header-bg', s.headerBackground);
        }
        
        if (s.titleSize) container.style.setProperty('--gmw-title-size', s.titleSize);
        if (s.titleColor) container.style.setProperty('--gmw-title-color', s.titleColor);
        if (s.addressSize) container.style.setProperty('--gmw-address-size', s.addressSize);
        
        // Карта
        if (s.mapHeight) container.style.setProperty('--gmw-map-height', s.mapHeight);
        
        // Кнопки
        if (s.buttonBackground) container.style.setProperty('--gmw-button-bg', s.buttonBackground);
        if (s.buttonHover) container.style.setProperty('--gmw-button-hover', s.buttonHover);
        if (s.buttonSecondary) container.style.setProperty('--gmw-button-secondary', s.buttonSecondary);
        if (s.buttonRadius) container.style.setProperty('--gmw-button-radius', s.buttonRadius);
        
        // Информационная панель
        if (s.footerBackground) container.style.setProperty('--gmw-footer-bg', s.footerBackground);
        if (s.infoBackground) container.style.setProperty('--gmw-info-bg', s.infoBackground);
    }

    async function initializeGoogleMap(container, config, clientId) {
        // Создаем HTML структуру
        const { businessName, address, buttons = [], info = {} } = config;
        
        container.innerHTML = `
            <div class="gmw-header">
                <h3 class="gmw-title">${config.icon || '📍'} ${escapeHtml(businessName || 'Наше местоположение')}</h3>
                ${address ? `<p class="gmw-address">${escapeHtml(address)}</p>` : ''}
            </div>
            <div class="gmw-map-container">
                <div class="gmw-map" id="map-${clientId}"></div>
            </div>
            ${buttons.length > 0 ? `
                <div class="gmw-footer">
                    ${buttons.map(button => `
                        <a href="${escapeHtml(button.url)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="gmw-button ${button.type || ''}">
                            ${button.icon || ''} ${escapeHtml(button.text)}
                        </a>
                    `).join('')}
                </div>
            ` : ''}
            ${Object.keys(info).length > 0 ? `
                <div class="gmw-info-panel">
                    ${Object.entries(info).map(([key, value]) => `
                        <div class="gmw-info-row">
                            <span><strong>${escapeHtml(key)}:</strong></span>
                            <span>${escapeHtml(value)}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;

        // Загружаем Google Maps API
        await loadGoogleMapsAPI(config.apiKey);
        
        // Инициализируем карту
        const mapElement = document.getElementById(`map-${clientId}`);
        const mapOptions = {
            center: config.center,
            zoom: config.zoom || 15,
            mapTypeId: config.mapTypeId || 'roadmap',
            styles: MAP_STYLES[config.mapStyle] || config.customStyles || [],
            disableDefaultUI: config.disableDefaultUI || false,
            zoomControl: config.controls?.zoom !== false,
            streetViewControl: config.controls?.streetView || false,
            fullscreenControl: config.controls?.fullscreen || false,
            mapTypeControl: config.controls?.mapType || false
        };

        const map = new google.maps.Map(mapElement, mapOptions);

        // Добавляем маркеры
        if (config.markers && config.markers.length > 0) {
            config.markers.forEach(markerData => {
                const marker = new google.maps.Marker({
                    position: { lat: markerData.lat, lng: markerData.lng },
                    map: map,
                    title: markerData.title || '',
                    icon: markerData.icon ? createCustomIcon(markerData.icon, markerData.color) : null
                });

                // Добавляем информационное окно если есть
                if (markerData.infoWindow) {
                    const infoWindow = new google.maps.InfoWindow({
                        content: markerData.infoWindow
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                }
            });
        } else {
            // Добавляем маркер по центру карты по умолчанию
            new google.maps.Marker({
                position: config.center,
                map: map,
                title: businessName || 'Наше местоположение'
            });
        }
    }

    function loadGoogleMapsAPI(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=geometry`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                if (window.google && window.google.maps) {
                    resolve();
                } else {
                    reject(new Error('Google Maps API не загрузился'));
                }
            };

            script.onerror = () => {
                reject(new Error('Ошибка загрузки Google Maps API'));
            };

            document.head.appendChild(script);
        });
    }

    function createCustomIcon(emoji, color = '#4285f4') {
        if (emoji) {
            // SVG иконка с эмодзи
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                    <path fill="${color}" d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"/>
                    <circle fill="white" cx="16" cy="16" r="10"/>
                    <text x="16" y="20" font-size="12" text-anchor="middle" fill="black">${emoji}</text>
                </svg>
            `;
            
            return {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
                scaledSize: new google.maps.Size(32, 40),
                anchor: new google.maps.Point(16, 40)
            };
        }
        return null;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function showError(container, clientId, message) {
        container.innerHTML = `
            <div class="gmw-error">
                <h3 style="margin: 0 0 15px 0;">🗺️ Карта недоступна</h3>
                <p style="margin: 0; font-size: 0.9em;">ID: ${escapeHtml(clientId)}</p>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer;">Подробности</summary>
                    <p style="margin: 10px 0 0 0; font-size: 0.8em;">${escapeHtml(message)}</p>
                </details>
            </div>
        `;
    }
})();
