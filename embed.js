/*!
 * TF Widgets — Map & Location v2 (Google Maps)
 * Встраивание: <script src=".../embed.js" data-id="CLIENT_ID"></script>
 * Конфиг клиента: configs/CLIENT_ID.json (формат v1 поддерживается)
 * Карта — настоящая Google Maps через iframe:
 *   с ключом GMAPS_EMBED_KEY — официальный Maps Embed API (бесплатный, без лимитов);
 *   без ключа — публичная встраиваемая карта maps.google.com (тоже бесплатно).
 * Опция "clickToLoad": карта (и куки Google) грузится только после клика посетителя — удобно для GDPR.
 * Классы и CSS-переменные: префикс bhw- (общий для всех виджетов TF Widgets), всё ограничено классом .bhw-map.
 */
(function () {
    'use strict';
    var VERSION = '2.0.0';
    var LOG = '[TFW Map]';
    // Ключ Google Maps Embed API (Google Cloud → APIs & Services → Credentials). Пусто = карта без ключа.
    var GMAPS_EMBED_KEY = '';
    // Где работает живое превью BHWMap.render() (конфигуратор на сайте)
    var PREVIEW_DOMAINS = ['tf-widgets.com', '*.tf-widgets.com', '9ac5za-h1.myshopify.com'];

    var I18N = {
        en: { directions: 'Directions', call: 'Call', website: 'Website', email: 'Email', open: 'Open in Google Maps', show: 'Show map', consent: 'The map is provided by Google. Loading it may set cookies.', copy: 'Copy address', copied: 'Copied', hours: 'Hours', phone: 'Phone', address: 'Address' },
        es: { directions: 'Cómo llegar', call: 'Llamar', website: 'Sitio web', email: 'Email', open: 'Abrir en Google Maps', show: 'Mostrar mapa', consent: 'El mapa lo proporciona Google. Al cargarlo puede usar cookies.', copy: 'Copiar dirección', copied: 'Copiado', hours: 'Horario', phone: 'Teléfono', address: 'Dirección' },
        fr: { directions: 'Itinéraire', call: 'Appeler', website: 'Site web', email: 'E-mail', open: 'Ouvrir dans Google Maps', show: 'Afficher la carte', consent: 'La carte est fournie par Google. Son chargement peut déposer des cookies.', copy: 'Copier l’adresse', copied: 'Copié', hours: 'Horaires', phone: 'Téléphone', address: 'Adresse' },
        de: { directions: 'Route', call: 'Anrufen', website: 'Website', email: 'E-Mail', open: 'In Google Maps öffnen', show: 'Karte anzeigen', consent: 'Die Karte wird von Google bereitgestellt. Beim Laden können Cookies gesetzt werden.', copy: 'Adresse kopieren', copied: 'Kopiert', hours: 'Öffnungszeiten', phone: 'Telefon', address: 'Adresse' },
        it: { directions: 'Indicazioni', call: 'Chiama', website: 'Sito web', email: 'Email', open: 'Apri in Google Maps', show: 'Mostra mappa', consent: 'La mappa è fornita da Google. Il caricamento può impostare cookie.', copy: 'Copia indirizzo', copied: 'Copiato', hours: 'Orari', phone: 'Telefono', address: 'Indirizzo' },
        nl: { directions: 'Route', call: 'Bellen', website: 'Website', email: 'E-mail', open: 'Openen in Google Maps', show: 'Kaart tonen', consent: 'De kaart wordt geleverd door Google. Bij laden kunnen cookies worden geplaatst.', copy: 'Adres kopiëren', copied: 'Gekopieerd', hours: 'Openingstijden', phone: 'Telefoon', address: 'Adres' },
        pt: { directions: 'Como chegar', call: 'Ligar', website: 'Site', email: 'E-mail', open: 'Abrir no Google Maps', show: 'Mostrar mapa', consent: 'O mapa é fornecido pelo Google. Ao carregá-lo podem ser usados cookies.', copy: 'Copiar endereço', copied: 'Copiado', hours: 'Horário', phone: 'Telefone', address: 'Endereço' },
        pl: { directions: 'Wyznacz trasę', call: 'Zadzwoń', website: 'Strona', email: 'E-mail', open: 'Otwórz w Mapach Google', show: 'Pokaż mapę', consent: 'Mapę dostarcza Google. Jej załadowanie może zapisać pliki cookie.', copy: 'Kopiuj adres', copied: 'Skopiowano', hours: 'Godziny', phone: 'Telefon', address: 'Adres' },
        cs: { directions: 'Trasa', call: 'Zavolat', website: 'Web', email: 'E-mail', open: 'Otevřít v Mapách Google', show: 'Zobrazit mapu', consent: 'Mapu poskytuje Google. Její načtení může uložit cookies.', copy: 'Kopírovat adresu', copied: 'Zkopírováno', hours: 'Otevírací doba', phone: 'Telefon', address: 'Adresa' },
        sk: { directions: 'Trasa', call: 'Zavolať', website: 'Web', email: 'E-mail', open: 'Otvoriť v Mapách Google', show: 'Zobraziť mapu', consent: 'Mapu poskytuje Google. Jej načítanie môže uložiť cookies.', copy: 'Kopírovať adresu', copied: 'Skopírované', hours: 'Otváracie hodiny', phone: 'Telefón', address: 'Adresa' }
    };

    var ICON = {
        pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
        route: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.7 11.3 12.7 2.3a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5z"/></svg>',
        phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
        web: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-3a15.6 15.6 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h3a15.6 15.6 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16zm3-8h-3a8 8 0 0 1 4.4-3.6A15.6 15.6 0 0 0 8.1 8zM12 20c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6a15.6 15.6 0 0 0 1.4-3.6h3a8 8 0 0 1-4.4 3.6zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z"/></svg>',
        mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.4 7H4v.5l8 5.5 8-5.5V7h-.4z"/></svg>',
        clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7z"/></svg>',
        info: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>',
        copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z"/></svg>'
    };

    var inlineCSS = `
        .bhw-map { font-family: var(--bhw-font, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif); -webkit-font-smoothing: antialiased; box-sizing: border-box; font-size: var(--bhw-font-size, 15px); line-height: 1.45; }
        .bhw-map *, .bhw-map *::before, .bhw-map *::after { box-sizing: border-box; }
        .bhw-map.bhw-container { width: 100%; max-width: var(--bhw-max-width, 1000px); margin: var(--bhw-margin, 24px auto); }
        .bhw-map .bhw-widget {
            position: relative; overflow: hidden; isolation: isolate;
            display: grid; grid-template-columns: minmax(0, var(--bhw-info-w, 360px)) minmax(0, 1fr);
            background: var(--bhw-bg, #ffffff); color: var(--bhw-text-color, #111111);
            border: 1px solid var(--bhw-widget-border, rgba(0,0,0,.07)); border-radius: var(--bhw-widget-radius, 22px);
            box-shadow: var(--bhw-shadow, 0 24px 60px -28px rgba(0,0,0,.28));
        }
        .bhw-map.bhw-pos-right .bhw-widget { grid-template-columns: minmax(0, 1fr) minmax(0, var(--bhw-info-w, 360px)); }
        .bhw-map.bhw-pos-right .bhw-info { order: 2; }
        .bhw-map .bhw-info { display: flex; flex-direction: column; gap: 16px; padding: var(--bhw-padding, 28px); min-width: 0; }
        .bhw-map .bhw-map-box { position: relative; min-height: var(--bhw-map-h, 380px); background: #e8eaed; }
        .bhw-map .bhw-map-box iframe { position: absolute; inset: 0; display: block; width: 100%; height: 100%; border: 0; margin: 0; padding: 0; max-width: none; }

        /* карта сверху, карточка снизу */
        .bhw-map.bhw-stacked .bhw-widget, .bhw-map.bhw-narrow .bhw-widget { grid-template-columns: 1fr; }
        .bhw-map.bhw-stacked .bhw-map-box, .bhw-map.bhw-narrow .bhw-map-box { order: -1; min-height: 0; height: var(--bhw-map-h, 380px); }
        .bhw-map.bhw-stacked .bhw-info, .bhw-map.bhw-narrow .bhw-info { order: 2; }
        /* во всю ширину с карточкой поверх карты */
        .bhw-map.bhw-overlay .bhw-widget { display: block; min-height: var(--bhw-map-h, 420px); }
        .bhw-map.bhw-overlay .bhw-map-box { position: absolute; inset: 0; min-height: 0; }
        .bhw-map.bhw-overlay .bhw-info { position: relative; z-index: 2; width: min(var(--bhw-info-w, 360px), calc(100% - 32px)); margin: 16px; border-radius: calc(var(--bhw-widget-radius, 22px) - 6px); background: var(--bhw-bg, #fff); box-shadow: 0 18px 44px -14px rgba(0,0,0,.4); padding: calc(var(--bhw-padding, 28px) * .8); }
        .bhw-map.bhw-overlay.bhw-pos-right .bhw-info { margin-left: auto; }
        .bhw-map.bhw-overlay.bhw-narrow .bhw-widget { display: grid; min-height: 0; }
        .bhw-map.bhw-overlay.bhw-narrow .bhw-map-box { position: relative; }
        .bhw-map.bhw-overlay.bhw-narrow .bhw-info { width: auto; margin: 0; border-radius: 0; box-shadow: none; }

        .bhw-map .bhw-head { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .bhw-map .bhw-icon { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: calc(var(--bhw-block-radius, 12px) + 2px); background: var(--bhw-soft, rgba(0,0,0,.05)); font-size: 1.4em; line-height: 1; }
        .bhw-map .bhw-logo { flex: none; display: block; max-width: 120px; max-height: 44px; object-fit: contain; border: 0; margin: 0; }
        .bhw-map .bhw-name { margin: 0; padding: 0; font-family: inherit; font-size: var(--bhw-name-size, 1.3em); font-weight: 800; line-height: 1.2; letter-spacing: -.02em; }
        .bhw-map .bhw-tag { margin: 2px 0 0; font-size: .86em; opacity: .66; }
        .bhw-map .bhw-rows { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
        .bhw-map .bhw-row { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 10px; align-items: start; margin: 0; }
        .bhw-map .bhw-row svg { width: 18px; height: 18px; margin-top: 2px; color: var(--bhw-accent, #1a73e8); }
        .bhw-map .bhw-row-txt { min-width: 0; white-space: pre-line; overflow-wrap: anywhere; }
        .bhw-map .bhw-row a { color: inherit; text-decoration: none; border-bottom: 1px solid color-mix(in srgb, currentColor 25%, transparent); }
        .bhw-map .bhw-copy { display: inline-flex; align-items: center; gap: 5px; margin: 4px 0 0; padding: 0; min-height: 0; border: 0; background: none; box-shadow: none; font: inherit; font-size: .8em; font-weight: 600; color: inherit; opacity: .6; cursor: pointer; }
        .bhw-map .bhw-copy svg { width: 13px; height: 13px; margin: 0; color: inherit; }
        .bhw-map .bhw-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; padding-top: 4px; }
        .bhw-map .bhw-btn {
            flex: 1 1 auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin: 0; padding: 11px 14px; min-height: 0;
            border-radius: var(--bhw-block-radius, 12px); border: 1px solid var(--bhw-line, rgba(0,0,0,.12)); background: transparent; box-shadow: none;
            font: inherit; font-size: .9em; font-weight: 700; line-height: 1.2; color: inherit; text-decoration: none !important; white-space: nowrap; cursor: pointer; transition: transform .2s, filter .2s, background .2s;
        }
        .bhw-map .bhw-btn:hover { transform: translateY(-1px); background: var(--bhw-soft, rgba(0,0,0,.05)); }
        .bhw-map .bhw-btn.bhw-primary { background: var(--bhw-accent, #1a73e8); border-color: transparent; color: var(--bhw-accent-text, #fff); }
        .bhw-map .bhw-btn.bhw-primary:hover { filter: brightness(1.07); background: var(--bhw-accent, #1a73e8); }
        .bhw-map .bhw-btn svg { width: 17px; height: 17px; flex: none; }

        /* заглушка до согласия (GDPR) */
        .bhw-map .bhw-consent { position: absolute; inset: 0; display: grid; place-items: center; padding: 20px; text-align: center; background:
            linear-gradient(0deg, rgba(0,0,0,.02), rgba(0,0,0,.02)),
            repeating-linear-gradient(35deg, #e3e6ea 0 16px, #eceff2 16px 32px); color: #202124; }
        .bhw-map .bhw-consent-in { display: grid; justify-items: center; gap: 10px; max-width: 320px; }
        .bhw-map .bhw-consent svg { width: 34px; height: 34px; color: var(--bhw-accent, #1a73e8); }
        .bhw-map .bhw-consent p { margin: 0; font-size: .82em; opacity: .75; }
        .bhw-map .bhw-consent .bhw-btn { flex: none; background: var(--bhw-accent, #1a73e8); color: var(--bhw-accent-text, #fff); border-color: transparent; }

        .bhw-map .bhw-btn:focus-visible, .bhw-map .bhw-copy:focus-visible { outline: 2px solid var(--bhw-accent, #1a73e8); outline-offset: 2px; }
        @media (max-width: 560px) { .bhw-map .bhw-info { padding: var(--bhw-padding-mobile, 20px); } }
        @media (prefers-reduced-motion: reduce) { .bhw-map * { transition: none !important; } }

        /* защита от тем сайта, которые красят весь текст через color: ... !important */
        .bhw-map .bhw-info { color: var(--bhw-text-color, #111) !important; }
        .bhw-map .bhw-info :where(*) { color: inherit !important; }
        .bhw-map .bhw-info .bhw-row svg { color: var(--bhw-accent, #1a73e8) !important; }
        .bhw-map .bhw-btn.bhw-primary, .bhw-map .bhw-btn.bhw-primary *, .bhw-map .bhw-consent .bhw-btn, .bhw-map .bhw-consent .bhw-btn * { color: var(--bhw-accent-text, #fff) !important; }
        .bhw-map .bhw-consent { color: #202124 !important; }
        .bhw-map .bhw-consent :where(p, div, span, a) { color: inherit !important; }
        .bhw-map .bhw-consent svg { color: var(--bhw-accent, #1a73e8) !important; }
    `;

    /* =========================================================
       ПУБЛИЧНЫЕ API
       ========================================================= */
    window.BusinessHoursWidgets = window.BusinessHoursWidgets || {};
    window.BusinessHoursWidgets.map = window.BusinessHoursWidgets.map || {};

    // Живое превью для конфигуратора: BHWMap.render(container, config) -> { update, setState, destroy }
    var api = window.BHWMap = window.BHWMap || {};
    api.version = VERSION;
    api.defaults = getDefaultConfig;
    api.checkAccess = bhwCheckAccess;
    api.mapUrl = mapUrl;
    api.render = function (container, config) {
        var noop = { destroy: function () {}, update: function () {}, setState: function () {} };
        if (!bhwCheckAccess({ domains: PREVIEW_DOMAINS }).ok) { console.warn(LOG, 'preview is only available on tf-widgets.com'); return noop; }
        injectBaseStyles();
        if (container._bhwMapDestroy) container._bhwMapDestroy();
        var cls = container.__bhwMapClass || (container.__bhwMapClass = 'bhw-map-preview-' + Math.random().toString(36).slice(2, 8));
        var widget = null, lastSrc = '';
        function build(cfg) {
            var n = normalizeConfig(cfg || {});
            // карту (iframe) не трогаем, если её адрес не менялся: меняем только карточку и стили — превью не мигает
            var src = srcOf(n);
            if (widget && src === lastSrc && !n.clickToLoad) { widget.refresh(n); return; }
            if (widget) widget.destroy();
            widget = mountWidget(n, cls, 'preview', { inline: container });
            lastSrc = src;
        }
        build(config);
        var ctrl = {
            update: function (cfg) { build(cfg); },
            setState: function () {},
            destroy: function () { if (widget) widget.destroy(); widget = null; container._bhwMapDestroy = null; }
        };
        container._bhwMapDestroy = ctrl.destroy;
        return ctrl;
    };

    /* =========================================================
       АВТОЗАПУСК ПО <script data-id="..."> (только свой тег)
       ========================================================= */
    try {
        var currentScript = document.currentScript || (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        if (currentScript && currentScript.dataset && currentScript.dataset.id && currentScript.dataset.bhwMounted !== '1') {
            currentScript.dataset.bhwMounted = '1';
            var debug = currentScript.dataset.debug === '1';
            var clientId = normalizeId(currentScript.dataset.id);
            var baseUrl = getBasePath(currentScript.src);
            loadConfig(clientId, baseUrl)
                .then(function (fetched) {
                    var access = bhwCheckAccess(fetched);
                    if (!access.ok) {
                        console.warn(LOG, 'widget "' + clientId + '" is not active on ' + (location.hostname || 'this page') + ': ' + access.reason);
                        return;
                    }
                    injectBaseStyles();
                    var cfg = normalizeConfig(fetched);
                    if (debug) console.log(LOG, 'config "' + clientId + '":', cfg);
                    var mount = function () {
                        var w = mountWidget(cfg, 'bhw-map-' + clientId.replace(/[^a-z0-9_-]/gi, '') + '-' + Date.now(), clientId, { anchor: currentScript });
                        window.BusinessHoursWidgets.map[clientId] = w;
                    };
                    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
                })
                .catch(function (error) {
                    // Нет конфига = нет виджета
                    console.warn(LOG, 'config "' + clientId + '" not loaded:', error.message);
                });
        }
    } catch (error) {
        console.error(LOG, 'critical error:', error);
    }

    /* =========================================================
       ФУНКЦИИ
       ========================================================= */
    function injectBaseStyles() {
        if (!document.getElementById('map-widget-styles-v2')) {
            var style = document.createElement('style');
            style.id = 'map-widget-styles-v2';
            style.textContent = inlineCSS;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    /* ---------------------------------------------------------
       ДОСТУП (общий блок для всех виджетов TF Widgets — копировать без изменений)
       В конфиге клиента:
         "active": true,                       // false = виджет выключен (например, подписка отменена)
         "domains": ["client.com", "client-shop.myshopify.com", "*.client.com"]
       "client.com" разрешает client.com и www.client.com,
       "*.client.com" — любые поддомены (shop.client.com и т.д.).
       Без списка domains виджет не запускается.
       На localhost и при открытии файла с компьютера работает всегда (для тестов).
       --------------------------------------------------------- */
    function bhwCheckAccess(config) {
        config = config || {};
        if (config.active === false) return { ok: false, reason: 'widget is switched off ("active": false)' };
        var host = String(location.hostname || '').toLowerCase().replace(/^www\./, '');
        if (!host || host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:') return { ok: true };
        var list = config.domains;
        if (typeof list === 'string') list = list.split(/[\s,]+/);
        if (!Array.isArray(list) || !list.length) return { ok: false, reason: 'no "domains" in config' };
        for (var i = 0; i < list.length; i++) {
            var d = String(list[i] || '').trim().toLowerCase()
                .replace(/^[a-z]+:\/\//, '').replace(/[\/:].*$/, '').replace(/^www\./, '');
            if (!d) continue;
            if (d.indexOf('*.') === 0) {
                var base = d.slice(2);
                if (host === base || host.slice(-(base.length + 1)) === '.' + base) return { ok: true };
            } else if (host === d) {
                return { ok: true };
            }
        }
        return { ok: false, reason: 'domain is not in "domains"' };
    }

    function normalizeId(id) { return String(id || 'demo').replace(/\.(json|js)$/i, ''); }
    function getBasePath(src) {
        if (!src) return './';
        try { var url = new URL(src, location.href); return url.origin + url.pathname.replace(/\/[^\/]*$/, '/'); }
        catch (error) { return './'; }
    }
    function loadConfig(clientId, baseUrl) {
        if (clientId === 'local') {
            var el = document.querySelector('#bhw-local-config');
            if (!el) return Promise.reject(new Error('#bhw-local-config not found'));
            try { return Promise.resolve(JSON.parse(el.textContent)); } catch (e) { return Promise.reject(e); }
        }
        var url = baseUrl + 'configs/' + encodeURIComponent(clientId) + '.json?v=' + Date.now();
        return fetch(url, { cache: 'no-store', headers: { 'Accept': 'application/json' } })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    }

    function getDefaultConfig() {
        return {
            layout: 'split',                // split — карточка + карта рядом; stacked — карта сверху; overlay — карта во всю ширину, карточка поверх
            infoPosition: 'left',           // left | right (для split и overlay)
            name: 'Visit us',
            tagline: '',
            icon: '',
            logo: '',
            address: '',
            mapQuery: '',                   // что искать на карте, если отличается от адреса (например "Название, адрес")
            lat: null, lng: null,           // точные координаты (необязательно)
            zoom: 15,
            mapType: 'roadmap',             // roadmap | satellite
            mapHeight: 380,
            phone: '',
            email: '',
            website: '',
            hours: '',                      // несколько строк текста
            note: '',                       // парковка, вход и т.п.
            showDirections: true,
            showCall: true,
            showWebsite: false,
            showEmail: false,
            showCopy: true,
            clickToLoad: false,             // true — карта грузится после клика (GDPR)
            locale: 'en',
            style: {
                fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
                colors: {
                    background: '#ffffff',
                    text: '#111111',
                    accent: '#1a73e8',
                    accentText: '#ffffff',
                    widgetBorder: 'rgba(0, 0, 0, 0.07)',
                    line: 'rgba(0, 0, 0, 0.12)',
                    soft: 'rgba(0, 0, 0, 0.05)'
                },
                borderRadius: { widget: 22, blocks: 12 },
                sizes: { fontSize: 1, padding: 28, width: 1000, infoWidth: 360 },
                shadow: { widget: '0 24px 60px -28px rgba(0, 0, 0, 0.28)' }
            }
        };
    }

    function stripEmojiPrefix(s) { return String(s || '').replace(/^[\u{1F000}-\u{1FFFF}☀-➿️\s]+/u, '').trim(); }

    /* v1: { businessName|title, address, coordinates{lat,lng}, zoom, phone, email, website, businessHours, parking,
             showDirections, showCall, showWebsite, iconHtml, styling{...} | theme{...} | style{colors{btnPrimary...}} } */
    function normalizeConfig(raw) {
        raw = raw || {};
        var base = getDefaultConfig();
        var legacy = !raw.layout && (raw.businessName || raw.title || raw.coordinates);
        if (legacy) {
            var st = raw.styling || {}, th = raw.theme || {}, sc = (raw.style && raw.style.colors) || {};
            var titleRaw = raw.businessName || raw.title || '';
            var emoji = (String(titleRaw).match(/^([\u{1F000}-\u{1FFFF}☀-➿]️?)/u) || [])[1] || '';
            var accent = st.directionsColor || st.primaryColor || th.primary || sc.btnPrimary || '#1a73e8';
            raw = {
                layout: 'split', name: stripEmojiPrefix(titleRaw) || 'Visit us', icon: raw.iconHtml || emoji,
                address: raw.address || '', lat: raw.coordinates && raw.coordinates.lat, lng: raw.coordinates && raw.coordinates.lng,
                zoom: raw.zoom || 15, phone: raw.phone || '', email: raw.email || '', website: raw.website || '',
                hours: raw.businessHours || '', note: raw.parking ? 'Parking: ' + raw.parking : '',
                showDirections: raw.showDirections !== false, showCall: raw.showCall !== false, showWebsite: !!raw.showWebsite, showEmail: !!raw.email,
                mapHeight: th.mapHeight || (raw.style && raw.style.sizes && raw.style.sizes.mapHeight) || 360,
                style: {
                    fontFamily: st.fontFamily || raw.fontFamily || base.style.fontFamily,
                    colors: { background: st.widgetBackground || th.background || sc.background || '#ffffff', text: th.text || '#111111', accent: accent },
                    borderRadius: { widget: parseFloat(st.borderRadius) || th.borderRadius || 20 }
                }
            };
        }
        var cfg = mergeDeep(base, raw);
        cfg._t = mergeDeep(I18N[I18N[cfg.locale] ? cfg.locale : 'en'], {});
        cfg._legacy = !!legacy;
        return cfg;
    }

    function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
    function mergeDeep(base, over) {
        var out = {};
        Object.keys(base || {}).forEach(function (k) { out[k] = isObj(base[k]) ? mergeDeep(base[k], {}) : base[k]; });
        Object.keys(over || {}).forEach(function (k) {
            var v = over[k];
            if (isObj(v) && isObj(out[k])) out[k] = mergeDeep(out[k], v);
            else if (v !== undefined) out[k] = v;
        });
        return out;
    }
    function cssValue(v, fallback) { if (v === undefined || v === null || v === '') return fallback; return String(v).replace(/[;{}<>]/g, ''); }
    function num(v, fallback) { var n = Number(v); return isFinite(n) && v !== '' && v !== null ? n : fallback; }
    function safeUrl(url) {
        var u = String(url || '').trim();
        if (!u) return '';
        if (/^https?:\/\//i.test(u)) return u;
        if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return 'https://' + u;
        return '';
    }
    function escapeHtml(text) {
        return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function renderIcon(icon) {
        var s = String(icon || '').trim();
        if (!s) return '';
        if (/^(&#?[a-z0-9]+;\s*)+$/i.test(s)) return s;
        return escapeHtml(s.slice(0, 8));
    }
    function hasCoords(cfg) { return isFinite(parseFloat(cfg.lat)) && isFinite(parseFloat(cfg.lng)) && cfg.lat !== null && cfg.lng !== null && cfg.lat !== '' && cfg.lng !== ''; }
    function placeQuery(cfg) {
        if (cfg.mapQuery) return String(cfg.mapQuery);
        if (cfg.address) return (cfg.name && !cfg._legacy ? cfg.name + ', ' : '') + cfg.address;
        if (hasCoords(cfg)) return parseFloat(cfg.lat) + ',' + parseFloat(cfg.lng);
        return cfg.name || '';
    }
    /* адрес карты: официальный Embed API (с ключом) или публичная встраиваемая карта (без ключа) */
    function mapUrl(cfg) {
        var q = placeQuery(cfg); if (!q) return '';
        var z = Math.max(3, Math.min(21, Math.round(num(cfg.zoom, 15)))), sat = cfg.mapType === 'satellite', hl = cfg.locale || 'en';
        if (GMAPS_EMBED_KEY) {
            return 'https://www.google.com/maps/embed/v1/place?key=' + encodeURIComponent(GMAPS_EMBED_KEY) + '&q=' + encodeURIComponent(q) +
                '&zoom=' + z + '&maptype=' + (sat ? 'satellite' : 'roadmap') + '&language=' + encodeURIComponent(hl);
        }
        return 'https://maps.google.com/maps?q=' + encodeURIComponent(q) + '&z=' + z + '&t=' + (sat ? 'k' : 'm') + '&hl=' + encodeURIComponent(hl) + '&ie=UTF8&output=embed';
    }
    function srcOf(cfg) { return /^https:\/\/(maps\.google\.com\/maps\?|www\.google\.com\/maps\/embed\/)/.test(cfg._mapSrc || '') ? cfg._mapSrc : mapUrl(cfg); }
    function directionsUrl(cfg) {
        var d = hasCoords(cfg) && !cfg.address ? parseFloat(cfg.lat) + ',' + parseFloat(cfg.lng) : placeQuery(cfg);
        return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(d);
    }
    function openUrl(cfg) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(placeQuery(cfg)); }

    function applyCustomStyles(uniqueClass, cfg) {
        var id = 'bhw-map-style-' + uniqueClass;
        var el = document.getElementById(id);
        if (!el) { el = document.createElement('style'); el.id = id; (document.head || document.documentElement).appendChild(el); }
        var s = cfg.style || {}, c = s.colors || {}, z = s.sizes || {}, r = s.borderRadius || {}, sh = s.shadow || {};
        var fs = num(z.fontSize, 1), pad = num(z.padding, 28);
        el.textContent = '.' + uniqueClass + '{' +
            '--bhw-font:' + cssValue(s.fontFamily, "'Inter', system-ui, sans-serif") + ';' +
            '--bhw-font-size:' + (15 * fs).toFixed(2) + 'px;' +
            '--bhw-max-width:' + Math.round(num(z.width, 1000)) + 'px;' +
            '--bhw-info-w:' + Math.round(num(z.infoWidth, 360)) + 'px;' +
            '--bhw-map-h:' + Math.round(Math.max(200, Math.min(800, num(cfg.mapHeight, 380)))) + 'px;' +
            '--bhw-bg:' + cssValue(c.background, '#ffffff') + ';' +
            '--bhw-text-color:' + cssValue(c.text, '#111111') + ';' +
            '--bhw-accent:' + cssValue(c.accent, '#1a73e8') + ';' +
            '--bhw-accent-text:' + cssValue(c.accentText, '#ffffff') + ';' +
            '--bhw-widget-border:' + cssValue(c.widgetBorder, 'rgba(0,0,0,0.07)') + ';' +
            '--bhw-line:' + cssValue(c.line, 'rgba(0,0,0,0.12)') + ';' +
            '--bhw-soft:' + cssValue(c.soft, 'rgba(0,0,0,0.05)') + ';' +
            '--bhw-widget-radius:' + num(r.widget, 22) + 'px;' +
            '--bhw-block-radius:' + num(r.blocks, 12) + 'px;' +
            '--bhw-padding:' + pad + 'px;' +
            '--bhw-padding-mobile:' + Math.round(pad * .72) + 'px;' +
            '--bhw-shadow:' + cssValue(sh.widget, '0 24px 60px -28px rgba(0,0,0,0.28)') + ';' +
            '}';
        return id;
    }

    function infoHtml(cfg) {
        var T = cfg._t, logo = safeUrl(cfg.logo), icon = renderIcon(cfg.icon);
        var tel = String(cfg.phone || '').replace(/[^\d+]/g, ''), web = safeUrl(cfg.website), mail = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(cfg.email || '') ? cfg.email : '';
        var rows = [];
        if (cfg.address) rows.push('<li class="bhw-row">' + ICON.pin + '<div class="bhw-row-txt">' + escapeHtml(cfg.address) +
            (cfg.showCopy ? '<br><button class="bhw-copy" type="button">' + ICON.copy + '<span>' + escapeHtml(T.copy) + '</span></button>' : '') + '</div></li>');
        if (cfg.hours) rows.push('<li class="bhw-row">' + ICON.clock + '<div class="bhw-row-txt">' + escapeHtml(cfg.hours) + '</div></li>');
        if (tel) rows.push('<li class="bhw-row">' + ICON.phone + '<div class="bhw-row-txt"><a href="tel:' + escapeHtml(tel) + '">' + escapeHtml(cfg.phone) + '</a></div></li>');
        if (mail && cfg.showEmail) rows.push('<li class="bhw-row">' + ICON.mail + '<div class="bhw-row-txt"><a href="mailto:' + escapeHtml(mail) + '">' + escapeHtml(mail) + '</a></div></li>');
        if (cfg.note) rows.push('<li class="bhw-row">' + ICON.info + '<div class="bhw-row-txt">' + escapeHtml(cfg.note) + '</div></li>');
        var btns = [];
        if (cfg.showDirections && placeQuery(cfg)) btns.push('<a class="bhw-btn bhw-primary" href="' + escapeHtml(directionsUrl(cfg)) + '" target="_blank" rel="noopener">' + ICON.route + '<span>' + escapeHtml(T.directions) + '</span></a>');
        if (cfg.showCall && tel) btns.push('<a class="bhw-btn" href="tel:' + escapeHtml(tel) + '">' + ICON.phone + '<span>' + escapeHtml(T.call) + '</span></a>');
        if (cfg.showWebsite && web) btns.push('<a class="bhw-btn" href="' + escapeHtml(web) + '" target="_blank" rel="noopener">' + ICON.web + '<span>' + escapeHtml(T.website) + '</span></a>');
        return '<div class="bhw-info">' +
            '<div class="bhw-head">' + (logo ? '<img class="bhw-logo" src="' + escapeHtml(logo) + '" alt="">' : (icon ? '<span class="bhw-icon" aria-hidden="true">' + icon + '</span>' : '')) +
                '<div style="min-width:0">' + (cfg.name ? '<h3 class="bhw-name">' + escapeHtml(cfg.name) + '</h3>' : '') + (cfg.tagline ? '<p class="bhw-tag">' + escapeHtml(cfg.tagline) + '</p>' : '') + '</div></div>' +
            (rows.length ? '<ul class="bhw-rows">' + rows.join('') + '</ul>' : '') +
            (btns.length ? '<div class="bhw-actions">' + btns.join('') + '</div>' : '') +
        '</div>';
    }

    function makeIframe(cfg) {
        var f = document.createElement('iframe');
        f.src = srcOf(cfg);
        f.title = 'Map: ' + (cfg.name || cfg.address || 'location');
        f.loading = 'lazy';
        f.referrerPolicy = 'no-referrer-when-downgrade';
        f.setAttribute('allowfullscreen', '');
        return f;
    }

    function mountWidget(cfg, uniqueClass, id, opts) {
        opts = opts || {};
        var styleId = applyCustomStyles(uniqueClass, cfg);
        var layout = ['split', 'stacked', 'overlay'].indexOf(cfg.layout) >= 0 ? cfg.layout : 'split';
        var root = document.createElement('div');
        root.id = 'map-widget-' + id;
        function classes(c) { var l = ['split', 'stacked', 'overlay'].indexOf(c.layout) >= 0 ? c.layout : 'split'; return 'bhw-map bhw-container ' + uniqueClass + ' bhw-' + l + (c.infoPosition === 'right' ? ' bhw-pos-right' : ''); }
        root.className = classes(cfg);
        var T = cfg._t;
        root.innerHTML = '<div class="bhw-widget">' + infoHtml(cfg) + '<div class="bhw-map-box"></div></div>';
        var box = root.querySelector('.bhw-map-box');
        var widget = { root: root, config: cfg, id: id, iframe: null };
        function loadMap() {
            if (!srcOf(cfg)) return;
            var f = makeIframe(cfg);
            box.innerHTML = ''; box.appendChild(f); widget.iframe = f;
        }
        if (cfg.clickToLoad) {
            box.innerHTML = '<div class="bhw-consent"><div class="bhw-consent-in">' + ICON.pin +
                '<button class="bhw-btn" type="button">' + escapeHtml(T.show) + '</button><p>' + escapeHtml(T.consent) + '</p>' +
                '<a class="bhw-copy" style="opacity:.7" href="' + escapeHtml(openUrl(cfg)) + '" target="_blank" rel="noopener">' + escapeHtml(T.open) + '</a></div></div>';
            box.querySelector('.bhw-consent .bhw-btn').addEventListener('click', loadMap);
        } else loadMap();

        if (opts.inline) opts.inline.appendChild(root);
        else if (opts.anchor && opts.anchor.parentNode) opts.anchor.parentNode.insertBefore(root, opts.anchor.nextSibling);
        else document.body.appendChild(root);

        var cleanups = [];
        function bindCopy() {
            var copyBtn = root.querySelector('button.bhw-copy'); if (!copyBtn) return;
            copyBtn.addEventListener('click', function () {
                var T2 = widget.config._t, done = function () { copyBtn.querySelector('span').textContent = T2.copied; setTimeout(function () { copyBtn.querySelector('span').textContent = T2.copy; }, 1600); };
                var text = widget.config.address;
                if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
                else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); done(); }
            });
        }
        bindCopy();
        /* обновление без перезагрузки карты (для превью) */
        widget.refresh = function (c) {
            widget.config = c;
            applyCustomStyles(uniqueClass, c);
            var narrow = root.classList.contains('bhw-narrow');
            root.className = classes(c) + (narrow ? ' bhw-narrow' : '');
            var info = root.querySelector('.bhw-info'), tmp = document.createElement('div');
            tmp.innerHTML = infoHtml(c); info.replaceWith(tmp.firstChild);
            bindCopy();
        };
        /* узкое место (телефон, узкая колонка темы): карта сверху, карточка снизу */
        function sizeClass() {
            var w = opts.inline ? Math.max(0, opts.inline.clientWidth - 32) : (root.clientWidth || 0);
            root.classList.toggle('bhw-narrow', w > 0 && w < 640);
        }
        if (window.ResizeObserver) { var ro = new ResizeObserver(sizeClass); ro.observe(opts.inline || root); cleanups.push(function () { ro.disconnect(); }); }
        else { window.addEventListener('resize', sizeClass); cleanups.push(function () { window.removeEventListener('resize', sizeClass); }); }
        sizeClass();

        widget.destroy = function () { cleanups.forEach(function (f) { try { f(); } catch (e) {} }); root.remove(); var s = document.getElementById(styleId); if (s) s.remove(); };
        return widget;
    }
})();
