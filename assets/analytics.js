// Loaded only by the GitHub Pages export. This file makes no request until a
// visitor has granted analytics consent; private Sites pages never include it.
const analyticsConfig = globalThis.BSS_PUBLIC_CONFIG?.analytics;
if (analyticsConfig?.enabled === true && analyticsConfig.measurementId === 'G-Q1P3WTK92Z') initializeAnalytics();

function initializeAnalytics() {
  const measurementId = analyticsConfig.measurementId;
  const preferenceKey = 'bss.analytics.consent.v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  const disableKey = 'ga-disable-' + measurementId;
  const canonicalOrigin = 'https://www.ba-smartsolution.at';
  const knownPages = {
    '/': 'Apps & Software aus Wien · Baumgartner Smart Solution',
    '/leistungen/app-entwicklung/': 'App-Entwicklung in Wien | Baumgartner Smart Solution',
    '/leistungen/web-anwendungen/': 'Web-Anwendungen für Unternehmen | Baumgartner Smart Solution Wien',
    '/leistungen/automatisierung/': 'Digitalisierung & Automatisierung in Wien | Baumgartner Smart Solution',
    '/impressum/': 'Impressum | Baumgartner Smart Solution',
    '/datenschutz/': 'Datenschutz | Baumgartner Smart Solution'
  };
  // Unknown paths, app policies and the private workspace are never tagged.
  const path = location.pathname === '/index.html' ? '/' : location.pathname.endsWith('/') ? location.pathname : location.pathname + '/';
  if (location.origin !== canonicalOrigin || !Object.hasOwn(knownPages, path)) return;

  let preference = readPreference(), preferenceStored = Boolean(preference), active = false, tag = null, tagLoaded = false, expiryTimer = null, returnFocus = null;
  globalThis[disableKey] = true;
  const node = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const style = node('style');
  style.textContent = `.bss-analytics-panel{position:fixed;z-index:900;bottom:22px;left:22px;width:min(520px,calc(100vw - 44px));padding:24px;border:1px solid #5e526f;border-radius:20px;background:#15131c;color:#f5f2fb;box-shadow:0 18px 65px #0009;font:400 14px/1.6 system-ui,sans-serif}.bss-analytics-panel[hidden]{display:none}.bss-analytics-panel h2{font-size:19px;line-height:1.3;margin:0 0 10px}.bss-analytics-panel p{margin:8px 0;color:#d1cadc}.bss-analytics-panel a{color:#d7b7ff;text-underline-offset:3px}.bss-analytics-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.bss-analytics-actions button{flex:1 1 170px;min-height:44px;padding:10px 14px;border:1px solid #8c70ac;border-radius:10px;background:#292032;color:#fff;font:600 13px/1.4 system-ui,sans-serif;cursor:pointer}.bss-analytics-actions button:disabled{opacity:.6;cursor:default}.bss-analytics-actions button:hover:not(:disabled){background:#392843}.bss-analytics-settings{padding:0;border:0;background:none;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}.bss-analytics-panel button:focus-visible,.bss-analytics-settings:focus-visible,.bss-analytics-panel a:focus-visible{outline:3px solid #c78cff;outline-offset:4px}.bss-analytics-status{font-size:12px}.bss-analytics-fallback{position:fixed;bottom:18px;left:18px;z-index:800;background:#15131c;color:#e3d8ee;padding:8px 12px;border-radius:9px}@media(max-width:600px){.bss-analytics-panel{bottom:12px;left:12px;width:calc(100vw - 24px);padding:19px;max-height:calc(100dvh - 24px);overflow:auto}}`;
  document.head.append(style);

  const settings = node('button', 'bss-analytics-settings', 'Analyse-Einstellungen');
  settings.type = 'button'; settings.setAttribute('aria-controls', 'bss-analytics-preferences'); settings.setAttribute('aria-expanded', 'false');
  const footer = document.querySelector('.footer-bottom nav');
  if (footer) footer.append(settings); else { settings.classList.add('bss-analytics-fallback'); document.body.append(settings); }
  const panel = node('section', 'bss-analytics-panel'); panel.id = 'bss-analytics-preferences'; panel.setAttribute('aria-labelledby', 'bss-analytics-title');
  const heading = node('h2', '', 'Freiwillige Website-Analyse'); heading.id = 'bss-analytics-title';
  const explanation = node('p', '', 'Dürfen wir mit Google Analytics 4 messen, welche öffentlichen Seiten aufgerufen werden? Google erhält dabei technische Verbindungsdaten und gegebenenfalls die externe Herkunfts-Domain. Formularinhalte, Chatnachrichten, Suchparameter und die vollständige Herkunftsadresse werden nicht übermittelt. Ohne Zustimmung bleibt die Analyse ausgeschaltet.');
  const storageNotice = node('p', '', 'Ihre Auswahl gilt bis zu 180 Tage und lässt sich unten unter „Analyse-Einstellungen“ jederzeit ändern. Analyse-Cookies werden nur nach Zustimmung gesetzt.');
  const privacy = node('a', '', 'Datenschutzhinweise'); privacy.href = '/datenschutz/';
  const status = node('p', 'bss-analytics-status'); status.setAttribute('role', 'status');
  const actions = node('div', 'bss-analytics-actions');
  const decline = node('button'), accept = node('button', '', 'Analyse erlauben'); decline.type = accept.type = 'button';
  actions.append(decline, accept); panel.append(heading, explanation, storageNotice, privacy, status, actions); document.body.append(panel);

  settings.addEventListener('click', () => { returnFocus = settings; showPanel(); decline.focus(); });
  decline.addEventListener('click', () => { choose('denied'); hidePanel(); });
  accept.addEventListener('click', () => { choose('granted'); hidePanel(); });
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); hidePanel(); } });
  window.addEventListener('storage', event => {
    if (event.key !== preferenceKey) return;
    preference = readPreference(); preferenceStored = Boolean(preference); applyPreference(); render();
  });
  applyPreference(); render();
  if (preference) hidePanel(); else showPanel();

  function readPreference() {
    try {
      const value = JSON.parse(localStorage.getItem(preferenceKey) || 'null');
      if (!value || !['granted', 'denied'].includes(value.choice) || !Number.isFinite(value.at) || value.at > Date.now() || Date.now() - value.at >= maxAge) return null;
      return { choice: value.choice, at: value.at };
    } catch { return null; }
  }
  function choose(choice) {
    preference = { choice, at: Date.now() };
    try { localStorage.setItem(preferenceKey, JSON.stringify(preference)); preferenceStored = true; } catch {
      preferenceStored = false;
      // Clear an earlier grant if an updated preference cannot be stored.
      try { localStorage.removeItem(preferenceKey); } catch { /* The current page still honors withdrawal immediately. */ }
    }
    applyPreference(); render();
  }
  function applyPreference() {
    clearTimeout(expiryTimer);
    if (preference?.choice === 'granted') enable(); else disable();
    if (preference) {
      const remaining = preference.at + maxAge - Date.now();
      expiryTimer = setTimeout(() => {
        if (preference && Date.now() - preference.at >= maxAge) { preference = null; disable(); render(); showPanel(); }
        else applyPreference();
      }, Math.min(remaining + 1, 24 * 60 * 60 * 1000));
    }
  }
  function send() { (globalThis.dataLayer ||= []).push(arguments); }
  function referrerOrigin(value) {
    try {
      const source = new URL(value);
      if (!['https:', 'http:'].includes(source.protocol) || source.username || source.password) return '';
      if (['www.ba-smartsolution.at', 'ba-smartsolution.at'].includes(source.hostname)) return '';
      const config = globalThis.BSS_PUBLIC_CONFIG;
      if (source.origin === config.apiOrigin || source.origin === new URL(config.privateWorkspaceUrl).origin) return '';
      // URL.origin cannot contain a path, query, fragment or URL credentials.
      return source.origin;
    } catch { return ''; }
  }
  function enable() {
    if (active) return;
    active = true; globalThis[disableKey] = false;
    // This consent setup is deliberately queued only after an affirmative choice.
    // Enhanced Measurement and connected tags must be disabled in the web stream.
    send('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    const page = { page_location: canonicalOrigin + path, page_referrer: referrerOrigin(document.referrer), page_title: knownPages[path] };
    send('set', { ...page, allow_google_signals: false, allow_ad_personalization_signals: false, ads_data_redaction: true });
    send('js', new Date());
    send('config', measurementId, { ...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_domain: 'none', cookie_expires: 15552000, cookie_update: false, cookie_flags: 'SameSite=Lax;Secure' });
    send('event', 'page_view', { ...page, send_to: measurementId });
    if (!tagLoaded) {
      tag = node('script'); tag.async = true; tag.referrerPolicy = 'no-referrer';
      tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      tag.addEventListener('load', () => { tagLoaded = true; });
      tag.addEventListener('error', () => { if (active) { status.textContent = 'Die Analyse konnte nicht geladen werden. Die Website bleibt vollständig nutzbar.'; } });
      document.head.append(tag);
    }
  }
  function disable() {
    // The Google-supported kill switch also applies after an already loaded tag.
    // Removing a script cannot undo requests that were sent before withdrawal.
    globalThis[disableKey] = true; active = false;
    if (tag) { tag.remove(); tag = null; }
    if (Array.isArray(globalThis.dataLayer)) globalThis.dataLayer.length = 0;
    const domains = ['', location.hostname, '.' + location.hostname, 'ba-smartsolution.at', '.ba-smartsolution.at'];
    for (const name of ['_ga', '_ga_' + measurementId.slice(2)]) {
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain ? '; Domain=' + domain : ''}`;
    }
  }
  function render() {
    const granted = preference?.choice === 'granted';
    decline.textContent = granted ? 'Zustimmung widerrufen' : 'Ablehnen';
    accept.textContent = granted ? 'Auswahl beibehalten' : 'Analyse erlauben';
    status.textContent = granted ? 'Ein Widerruf stoppt künftige Analyseübermittlungen; bereits übertragene Daten werden dadurch nicht zurückgerufen.' : 'Analyse ist ausgeschaltet. Kontaktformular und Assistant sind unabhängig davon nutzbar.';
    if (preference) status.textContent += preferenceStored ? ' Ihre Auswahl ist gespeichert.' : ' Ihr Browser erlaubt das Speichern der Auswahl nicht; sie gilt in dieser geöffneten Seite.';
  }
  function showPanel() { panel.hidden = false; settings.setAttribute('aria-expanded', 'true'); }
  function hidePanel() { panel.hidden = true; settings.setAttribute('aria-expanded', 'false'); if (returnFocus) { returnFocus.focus(); returnFocus = null; } }
}
