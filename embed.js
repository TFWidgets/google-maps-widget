(() => {
  'use strict';

  const scripts = Array.from(document.querySelectorAll('script[src*="embed.js"]'));
  if (!scripts.length) return;

  // Красивый дефолт с минимальными настройками
  const defaultConfig = {
    title: "🏢 Tech Hub Office",
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
    theme: {
      primary: "#4285f4",
      secondary: "#34a853",
      background: "#ffffff",
      text: "#333333",
      headerBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: 16,
      mapHeight: 300
    },
    fontFamily: "'Inter', system-ui, sans-serif"
  };

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
        document.head.appendChild(script);
      } else {
        leafletLoaded = true;
        resolve();
      }
    });
  }

  scripts.forEach(async (script) => {
    if (script.dataset.mwMounted === '1') return;
    script.dataset.mwMounted = '1';

    const id = (script.dataset.id || 'demo').replace(/\.(json|js)$/, '');
    const basePath = getBasePath(script.src);
    const cfg = await loadConfig(id, basePath);

    await loadLeaflet();
    mountWidget(script, cfg, id);
  });

  function mountWidget(host, cfg, id) {
    const config = mergeDeep(defaultConfig, cfg || {});
    const uniqueClass = `mw-${id}-${Date.now()}`;
    
    const container = document.createElement('div');
    container.className = `mw-container ${uniqueClass}`;
    host.parentNode.insertBefore(container, host);

    const mapId = `map-${uniqueClass}`;

    // Генерируем стили
    const style = document.createElement('style');
    style.textContent = generateStyles(config, uniqueClass);
    document.head.appendChild(style);

    // HTML структура
    container.innerHTML = `
      <div class="mw-widget">
        <div class="mw-header">
          <div class="mw-icon">🏢</div>
          <div class="mw-info">
            <h3 class="mw-title">${escapeHtml(config.title)}</h3>
            <p class="mw-address">${escapeHtml(config.address)}</p>
          </div>
        </div>
        
        <div class="mw-map-container">
          <div id="${mapId}" class="mw-map"></div>
          <div class="mw-error" style="display: none;">
            <div class="mw-error-icon">⚠️</div>
            <p>Карта временно недоступна</p>
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
          ${config.phone ? `
            <div class="mw-detail">
              <span class="mw-detail-label">Phone:</span>
              <span class="mw-detail-value">${escapeHtml(config.phone)}</span>
            </div>
          ` : ''}
          
          ${config.email ? `
            <div class="mw-detail">
              <span class="mw-detail-label">Email:</span>
              <span class="mw-detail-value">${escapeHtml(config.email)}</span>
            </div>
          ` : ''}
          
          ${config.businessHours ? `
            <div class="mw-detail">
              <span class="mw-detail-label">Business Hours:</span>
              <span class="mw-detail-value">${escapeHtml(config.businessHours)}</span>
            </div>
          ` : ''}
          
          ${config.parking ? `
            <div class="mw-detail">
              <span class="mw-detail-label">Parking:</span>
              <span class="mw-detail-value">${escapeHtml(config.parking)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Инициализируем карту
    setTimeout(() => initializeMap(mapId, config), 100);
  }

  function generateStyles(config, uniqueClass) {
    const t = config.theme;
    
    return `
      .${uniqueClass} {
        font-family: ${config.fontFamily};
        max-width: 520px;
        margin: 20px auto;
        width: 100%;
      }
      
      .${uniqueClass} .mw-widget {
        background: ${t.background};
        border-radius: ${t.borderRadius}px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        position: relative;
      }
      
      .${uniqueClass} .mw-header {
        background: ${t.headerBg};
        padding: 24px;
        color: white;
        display: flex;
        align-items: center;
        gap: 16px;
        position: relative;
        overflow: hidden;
      }
      
      .${uniqueClass} .mw-header::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 25% 20%, rgba(255,255,255,0.18) 0%, transparent 55%);
        pointer-events: none;
      }
      
      .${uniqueClass} .mw-icon {
        width: 48px;
        height: 48px;
        background: rgba(255,255,255,0.22);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255,255,255,0.35);
        position: relative;
        z-index: 1;
      }
      
      .${uniqueClass} .mw-info {
        flex: 1;
        position: relative;
        z-index: 1;
      }
      
      .${uniqueClass} .mw-title {
        margin: 0 0 6px 0;
        font-size: 1.35em;
        font-weight: 700;
        text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        letter-spacing: 0.2px;
      }
      
      .${uniqueClass} .mw-address {
        margin: 0;
        opacity: 0.92;
        font-size: 0.9em;
        line-height: 1.35;
        font-weight: 500;
      }
      
      .${uniqueClass} .mw-map-container {
        position: relative;
        height: ${t.mapHeight}px;
        background: #f0f2f5;
      }
      
      .${uniqueClass} .mw-map {
        width: 100%;
        height: 100%;
        z-index: 1;
      }
      
      .${uniqueClass} .mw-error {
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
      
      .${uniqueClass} .mw-error-icon {
        font-size: 36px;
        margin-bottom: 12px;
        opacity: 0.7;
      }
      
      .${uniqueClass} .mw-actions {
        display: flex;
        gap: 10px;
        padding: 18px;
        background: #f8f9fa;
      }
      
      .${uniqueClass} .mw-btn {
        flex: 1;
        padding: 14px 18px;
        border-radius: 11px;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.9em;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      
      .${uniqueClass} .mw-btn::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(45deg, rgba(255,255,255,0.15) 0%, transparent 50%);
        pointer-events: none;
      }
      
      .${uniqueClass} .mw-btn-directions {
        background: ${t.primary};
        color: white;
      }
      
      .${uniqueClass} .mw-btn-call {
        background: ${t.secondary};
        color: white;
      }
      
      .${uniqueClass} .mw-btn-website {
        background: #6366f1;
        color: white;
      }
      
      .${uniqueClass} .mw-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      }
      
      .${uniqueClass} .mw-details {
        padding: 22px;
      }
      
      .${uniqueClass} .mw-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;
        font-size: 0.9em;
      }
      
      .${uniqueClass} .mw-detail:last-child {
        border-bottom: none;
      }
      
      .${uniqueClass} .mw-detail-label {
        font-weight: 600;
        color: #666;
      }
      
      .${uniqueClass} .mw-detail-value {
        color: ${t.text};
        text-align: right;
        font-weight: 500;
      }
      
      @media (max-width: 480px) {
        .${uniqueClass} {
          margin: 16px auto;
        }
        
        .${uniqueClass} .mw-header {
          padding: 20px;
        }
        
        .${uniqueClass} .mw-title {
          font-size: 1.2em;
        }
        
        .${uniqueClass} .mw-actions {
          flex-direction: column;
        }
        
        .${uniqueClass} .mw-details {
          padding: 18px;
        }
      }
    `;
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
      const customIcon = L.divIcon({
        html: `
          <div style="
            width: 40px; height: 40px;
            background: ${config.theme.primary};
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
            ">🏢</div>
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
          <h4 style="margin: 0 0 8px 0; color: ${config.theme.text}; font-size: 14px;">${escapeHtml(config.title)}</h4>
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

  // Вспомогательные функции
  async function loadConfig(id, basePath) {
    const url = `${basePath}configs/${id}.json`;
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) return defaultConfig;
      return await r.json();
    } catch {
      return defaultConfig;
    }
  }

  function getBasePath(src) {
    try {
      const u = new URL(src, location.href);
      return u.pathname.replace(/\/[^\/]*$/, '/');
    } catch { return './'; }
  }

  function mergeDeep(target, source) {
    const output = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = mergeDeep(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
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
