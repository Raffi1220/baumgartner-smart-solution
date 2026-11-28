import { answerQuestion, makeBriefing, PROJECTS, BRIEF_FIELDS } from './knowledge.js?v=679bee7e9db3567c';

// Only the static public export supplies this non-secret endpoint configuration.
// No platform service credential or model credential is sent by the browser.
function assistantEndpoint(path) {
  const config = globalThis.BSS_PUBLIC_CONFIG;
  if (!config) {
    if (document.documentElement?.dataset?.bssPublic === 'true') throw new Error('Assistant configuration unavailable');
    return path;
  }
  const origin = new URL(config.apiOrigin);
  if (config.version !== 1 || origin.protocol !== 'https:' || origin.origin !== config.apiOrigin || origin.username || origin.password) throw new Error('Assistant configuration unavailable');
  return origin.origin + path;
}
const assistantCredentials = () => globalThis.BSS_PUBLIC_CONFIG ? 'omit' : 'same-origin';

const mount = document.querySelector('#bss-assistant-root');
if (mount) initializeAssistant(mount);

function initializeAssistant(root) {
  const t = {
    de: { open: 'BSS Assistant', close: 'Assistant schließen', mode: 'Lokale Wissensbasis', intro: 'Was möchten Sie einfacher machen?', welcome: 'Ich erkläre unsere Leistungen und helfe Ihnen, eine Idee in ein klares Projektbriefing zu verwandeln. Meine Antworten stammen aus einer kuratierten Wissensbasis; hier ist kein externes KI-Modell verbunden.', question: 'Ihre Frage', placeholder: 'Frage zu Apps, Software oder Zusammenarbeit …', send: 'Senden', services: 'Was bietet BSS?', workflow: 'Wie läuft ein Projekt ab?', cost: 'Was kostet eine Lösung?', start: 'Projektbriefing erstellen', privacy: 'Umgang mit Ihren Eingaben', privacyText: 'Ihre Eingaben bleiben im Arbeitsspeicher dieses geöffneten Fensters. Es gibt keinen gespeicherten Chatverlauf und keinen Versand an einen KI-Dienst. Übernehmen Sie ein Briefing in das Anfrageformular, prüfen Sie es dort vor dem Versand.', reset: 'Unterhaltung zurücksetzen', language: 'Sprache', you: 'Sie', assistant: 'BSS Assistant', brief: 'Ihr Projektbriefing', project: 'Welche Art von Lösung interessiert Sie?', previous: 'Zurück', skip: 'Noch offen', next: 'Weiter', summary: 'Bereit für das persönliche Gespräch.', summaryText: 'Prüfen Sie Ihr Briefing. Die Übernahme befüllt nur das Anfrageformular; sie sendet noch keine Nachricht.', transfer: 'Ins Anfrageformular übernehmen', restart: 'Briefing neu beginnen', cancel: 'Zur Unterhaltung', step: 'Frage', of: 'von', source: 'Mehr dazu', projectLabel: 'Projektart', limit: 'Bitte höchstens 1.000 Zeichen eingeben.', full: 'Die Unterhaltung ist voll. Setzen Sie sie zurück, um neue Fragen zu stellen.', field: 'Ihre Antwort', all: 'Noch offen', switched: 'Sprache geändert. Vorhandene Nachrichten bleiben in ihrer ursprünglichen Sprache.' },
    en: { open: 'BSS Assistant', close: 'Close assistant', mode: 'Local knowledge base', intro: 'What would you like to make easier?', welcome: 'I explain our services and help turn your idea into a clear project brief. My answers come from a curated knowledge base; no external AI model is connected here.', question: 'Your question', placeholder: 'Ask about apps, software or working together …', send: 'Send', services: 'What does BSS offer?', workflow: 'How does a project work?', cost: 'What does it cost?', start: 'Create a project brief', privacy: 'How your input is handled', privacyText: 'Your input stays in the memory of this open window. No chat history is stored or sent to an AI provider. If you transfer a brief to the inquiry form, review it there before sending.', reset: 'Reset conversation', language: 'Language', you: 'You', assistant: 'BSS Assistant', brief: 'Your project brief', project: 'What kind of solution are you interested in?', previous: 'Back', skip: 'To be clarified', next: 'Next', summary: 'Ready for a personal conversation.', summaryText: 'Review your brief. Transferring it only fills in the inquiry form; it does not send a message.', transfer: 'Transfer to inquiry form', restart: 'Start a new brief', cancel: 'Back to conversation', step: 'Question', of: 'of', source: 'Read more', projectLabel: 'Project type', limit: 'Please use no more than 1,000 characters.', full: 'This conversation is full. Reset it to ask new questions.', field: 'Your answer', all: 'To be clarified', switched: 'Language changed. Existing messages remain in their original language.' }
  };
  Object.assign(t.de, { aiTitle: 'Optional: KI-Unterstützung', aiInitial: 'Die optionale KI verarbeitet neue Fragen bei einem externen Anbieter. Prüfen Sie zuerst die Verfügbarkeit; vor einer Aktivierung werden Ihnen Anbieter und Datenverarbeitung angezeigt. Die lokale Wissensbasis bleibt ohne KI nutzbar.', aiNotice: 'Für die KI-Antwort werden Ihre neue Frage und der kurze KI-Verlauf über den BSS-Server an {provider} übermittelt. Frühere lokale Fragen und Ihr Projektbriefing werden nicht automatisch übertragen. Bitte keine vertraulichen Informationen, Passwörter oder sensiblen personenbezogenen Daten eingeben.', aiTerms: 'Datenverarbeitung bei {provider}', aiCheck: 'KI-Verfügbarkeit prüfen', aiChecking: 'Verfügbarkeit wird geprüft …', aiAvailable: '{provider} ist konfiguriert. Sie können die KI für neue Fragen aktivieren; eine Antwort wurde damit noch nicht geprüft.', aiUnavailable: 'KI ist derzeit nicht freigeschaltet. Die lokale Wissensbasis bleibt nutzbar.', aiConfigError: 'Die Verfügbarkeit konnte nicht geprüft werden. Sie können lokal fortfahren.', aiConsent: 'Meine neuen KI-Fragen und der zugehörige kurze Verlauf dürfen an {provider} übermittelt werden.', aiEnable: 'KI für neue Fragen aktivieren', aiDisable: 'Lokal fortfahren', aiActive: 'KI-Modus aktiv. Die nächste gesendete Frage wird an {provider} übermittelt.', aiMode: 'KI · {provider}', aiWelcome: 'Die KI hilft Ihnen bei Fragen zu den bestätigten BSS-Leistungen und bei der Klärung Ihres Vorhabens. Antworten können Fehler enthalten. Verbindliche Preise, Termine und Zusagen erhalten Sie im persönlichen Gespräch.', aiPrivacy: 'Im KI-Modus werden neue Fragen und der zugehörige kurze KI-Verlauf über den BSS-Server an {provider} übermittelt. BSS speichert keinen Chatverlauf. Es gelten die verlinkten Verarbeitungshinweise des Anbieters. Lokale frühere Fragen und Ihr Briefing werden nicht automatisch übertragen. Mit „Lokal fortfahren“ beenden Sie die Übermittlung neuer Fragen.', aiPending: '{provider} erstellt eine Antwort …', aiCancel: 'KI-Anfrage abbrechen', aiCancelled: 'KI-Anfrage abgebrochen. Eine bereits beim Anbieter begonnene Verarbeitung kann nicht sicher zurückgenommen werden.', aiFailure: 'Die KI-Antwort konnte nicht bestätigt werden. Sie können erneut fragen oder lokal fortfahren.', aiNeedsHuman: 'Für eine verbindliche Klärung bitte persönlich anfragen.', localAuthor: 'BSS Assistant · Wissensbasis', aiAuthor: 'BSS Assistant · KI' });
  Object.assign(t.en, { aiTitle: 'Optional: AI assistance', aiInitial: 'Optional AI processes new questions with an external provider. Check availability first; the provider and data processing are shown before activation. The local knowledge base remains available without AI.', aiNotice: 'For an AI response, your new question and a short AI conversation are sent through the BSS server to {provider}. Earlier local questions and your project brief are not sent automatically. Do not enter confidential information, passwords or sensitive personal data.', aiTerms: 'Data processing at {provider}', aiCheck: 'Check AI availability', aiChecking: 'Checking availability …', aiAvailable: '{provider} is configured. You can enable AI for new questions; this does not yet verify a live response.', aiUnavailable: 'AI is not enabled right now. The local knowledge base remains available.', aiConfigError: 'Availability could not be checked. You can continue locally.', aiConsent: 'My new AI questions and their short conversation may be sent to {provider}.', aiEnable: 'Enable AI for new questions', aiDisable: 'Continue locally', aiActive: 'AI mode is active. The next question you send will be passed to {provider}.', aiMode: 'AI · {provider}', aiWelcome: 'AI helps with questions about confirmed BSS services and clarifying your project. Answers may contain mistakes. Binding prices, timelines and commitments require a personal conversation.', aiPrivacy: 'In AI mode, new questions and their short AI conversation are sent through the BSS server to {provider}. BSS does not store chat history. The linked provider processing information applies. Earlier local questions and your brief are not sent automatically. Choose “Continue locally” to stop sending new questions.', aiPending: '{provider} is preparing an answer …', aiCancel: 'Cancel AI request', aiCancelled: 'AI request cancelled. Processing already started by the provider cannot reliably be undone.', aiFailure: 'The AI response could not be confirmed. Ask again or continue locally.', aiNeedsHuman: 'Please get in touch for a binding assessment.', localAuthor: 'BSS Assistant · Knowledge base', aiAuthor: 'BSS Assistant · AI' });
  let language = document.documentElement.lang.startsWith('de') ? 'de' : 'en';
  let messages = [], briefing = { project: 'Noch offen' }, briefStep = -1, mode = 'chat', previousFocus = null, pendingBriefing = null;
  let aiConfig = null, aiEnabled = false, aiBusy = false, aiChecking = false, aiController = null, aiHistory = [], aiNoticeKey = '';
  const providers = { groq: { name: 'Groq', privacyUrl: 'https://console.groq.com/docs/your-data' }, gemini: { name: 'Google Gemini', privacyUrl: 'https://aistudio.google.com/docs/terms' } };
  const text = key => t[language][key].replaceAll('{provider}', aiConfig?.provider || 'KI');
  const el = (tag, className, value) => { const node = document.createElement(tag); if (className) node.className = className; if (value !== undefined) node.textContent = value; return node; };
  const button = (value, className = 'bssa-button', handler) => { const node = el('button', className, value); node.type = 'button'; if (handler) node.addEventListener('click', handler); return node; };
  root.classList.add('bssa');
  const launch = button(text('open'), 'bssa-launch', open);
  launch.setAttribute('aria-haspopup', 'dialog'); launch.setAttribute('aria-controls', 'bssa-dialog'); launch.setAttribute('aria-expanded', 'false');
  const icon = el('span', 'bssa-symbol', '✦'); icon.setAttribute('aria-hidden', 'true'); launch.prepend(icon);
  const dialog = el('dialog', 'bssa-dialog'); dialog.id = 'bssa-dialog'; dialog.setAttribute('aria-labelledby', 'bssa-title');
  const header = el('header', 'bssa-header'), identity = el('div', 'bssa-identity');
  const title = el('h2', '', 'BSS Assistant'); title.id = 'bssa-title';
  const modeLabel = el('p', 'bssa-mode'); identity.append(title, modeLabel);
  const close = button('×', 'bssa-close', () => dialog.close());
  header.append(identity, close);
  const controls = el('div', 'bssa-controls'), languageControl = el('div', 'bssa-language'); languageControl.setAttribute('role', 'group');
  const de = button('DE', '', () => setLanguage('de')), en = button('EN', '', () => setLanguage('en')); languageControl.append(de, en);
  const privacy = el('details', 'bssa-privacy'), privacyLabel = el('summary'), privacyBody = el('p'); privacy.append(privacyLabel, privacyBody); controls.append(languageControl, privacy);
  const body = el('div', 'bssa-body'), chat = el('div', 'bssa-chat'), log = el('div', 'bssa-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite'); log.setAttribute('aria-relevant', 'additions text');
  const aiPanel = el('details', 'bssa-ai-panel'), aiTitle = el('summary'), aiNotice = el('p'), aiTerms = el('a'); aiTerms.target = '_blank'; aiTerms.rel = 'noopener noreferrer';
  const aiCheck = button('', 'bssa-ai-check', checkAIConfiguration), aiStatus = el('p', 'bssa-ai-status'); aiStatus.setAttribute('role', 'status');
  const aiConsentLabel = el('label', 'bssa-ai-consent'), aiConsent = el('input'), aiConsentText = el('span'); aiConsent.type = 'checkbox'; aiConsent.id = 'bssa-ai-consent'; aiConsentLabel.append(aiConsent, aiConsentText);
  const aiToggle = button('', 'bssa-ai-toggle', () => {
    if (aiEnabled) { cancelAI(); aiEnabled = false; aiHistory = []; aiConsent.checked = false; aiNoticeKey = aiConfig?.available ? 'aiAvailable' : 'aiUnavailable'; }
    else if (aiConfig?.available && aiConsent.checked) { aiEnabled = true; aiHistory = []; aiNoticeKey = 'aiActive'; }
    render(); input.focus();
  });
  aiConsent.addEventListener('change', renderAIControls); aiPanel.append(aiTitle, aiNotice, aiTerms, aiCheck, aiStatus, aiConsentLabel, aiToggle);
  const chips = el('div', 'bssa-chips'), start = button('', 'bssa-brief-start', () => { cancelAI(); mode = 'brief'; render(); focusBrief(); });
  chat.append(log, chips, start);
  const brief = el('section', 'bssa-brief');
  body.append(aiPanel, chat, brief);
  const form = el('form', 'bssa-form'), inputLabel = el('label', 'bssa-sr'), input = el('textarea'); input.id = 'bssa-input'; input.rows = 2; input.maxLength = 1000; inputLabel.htmlFor = input.id;
  const send = el('button', 'bssa-send'); send.type = 'submit'; const error = el('p', 'bssa-error'); error.setAttribute('role', 'status');
  const cancelRequest = button('', 'bssa-ai-cancel', () => cancelAI(true)); cancelRequest.hidden = true;
  form.append(inputLabel, input, send, cancelRequest, error);
  const footer = el('div', 'bssa-footer'), reset = button('', 'bssa-reset', () => { cancelAI(); messages = []; aiHistory = []; renderChat(); input.focus(); }); footer.append(reset);
  dialog.append(header, controls, body, form, footer); root.append(launch, dialog);

  dialog.addEventListener('close', () => {
    cancelAI();
    launch.setAttribute('aria-expanded', 'false');
    // Native dialog close is queued. Hand the focus to the contact form only
    // after it has completed, so normal focus restoration cannot undo it.
    if (pendingBriefing) {
      const detail = pendingBriefing; pendingBriefing = null;
      window.dispatchEvent(new CustomEvent('bss:briefing', { detail }));
      return;
    }
    if (previousFocus?.isConnected) previousFocus.focus(); else launch.focus();
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
  form.addEventListener('submit', event => { event.preventDefault(); submit(); });
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); submit(); } });
  window.addEventListener('bss:assistant-open', event => { if (event.detail?.mode === 'brief') { cancelAI(); retainBriefDraft(); mode = 'brief'; render(); } open(); });
  render();

  function open() {
    if (dialog.open) return;
    previousFocus = document.activeElement;
    dialog.showModal(); launch.setAttribute('aria-expanded', 'true');
    if (mode === 'brief') focusBrief(); else input.focus();
  }
  function retainBriefDraft() {
    const field = BRIEF_FIELDS[briefStep], response = brief.querySelector('#bssa-brief-response');
    if (mode === 'brief' && field && response) briefing[field.key] = response.value.slice(0, 1000);
  }
  function setLanguage(value) { if (language === value) return; retainBriefDraft(); language = value; render(); error.textContent = text('switched'); }
  async function submit(value = input.value) {
    if (aiBusy) return;
    const question = value.trim(); if (!question) { input.focus(); return; }
    if (question.length > 1000) { error.textContent = text('limit'); return; }
    if (messages.length >= 48) { error.textContent = text('full'); return; }
    const requestLanguage = language;
    error.textContent = ''; messages.push({ who: 'user', text: question, language: requestLanguage }); input.value = '';
    if (!aiEnabled) {
      messages.push({ who: 'assistant', ...answerQuestion(question, requestLanguage), language: requestLanguage, engine: 'knowledge' }); renderChat(); log.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'instant' }); input.focus(); return;
    }
    const controller = new AbortController(); aiController = controller; aiBusy = true; renderChat(); renderAIControls(); error.textContent = text('aiPending');
    let history = aiHistory.slice(-6); while (history.length && history.reduce((sum, item) => sum + item.content.length, question.length) > 6000) history = history.slice(2);
    const outbound = [...history, { role: 'user', content: question }], timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(assistantEndpoint('/api/assistant/chat'), { method: 'POST', credentials: assistantCredentials(), redirect: 'error', referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ language: requestLanguage, messages: outbound, consent: true, ageConfirmed: true, consentVersion: aiConfig.consentVersion }), signal: controller.signal });
      const result = await response.json();
      if (aiController !== controller) return;
      if (!response.ok || result?.success !== true || result.mode !== 'ai' || result.providerId !== aiConfig.providerId || typeof result.text !== 'string' || result.text.length > 1800 || !Array.isArray(result.sources)) throw new Error(typeof result?.message === 'string' ? result.message.slice(0, 500) : text('aiFailure'));
      const allowed = new Set(['#leistungen', '#ablauf', '#kontakt', '#portfolio', '/app-datenschutz/family-hub/']);
      const sources = result.sources.filter(source => allowed.has(source.href) && typeof source.label === 'string').map(source => ({ href: source.href, label: source.label.slice(0, 100) }));
      messages.push({ who: 'assistant', text: result.text, sources, needsHuman: result.needsHuman === true, language: requestLanguage, engine: 'ai', provider: aiConfig.provider });
      aiHistory = [...outbound, { role: 'assistant', content: result.text }].slice(-6); error.textContent = ''; renderChat(); log.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    } catch (failure) {
      if (aiController !== controller) return;
      error.textContent = controller.signal.aborted ? text('aiCancelled') : failure.message || text('aiFailure');
      if (!input.value) input.value = question;
    } finally {
      clearTimeout(timer); if (aiController === controller) { aiController = null; aiBusy = false; renderAIControls(); }
    }
  }
  function cancelAI(showMessage = false) { if (!aiController) return; aiController.abort(); aiController = null; aiBusy = false; if (showMessage) error.textContent = text('aiCancelled'); renderAIControls(); }
  async function checkAIConfiguration() {
    if (aiChecking || aiBusy || aiEnabled) return; aiChecking = true; aiNoticeKey = 'aiChecking'; renderAIControls();
    try {
      const response = await fetch(assistantEndpoint('/api/assistant/config'), { credentials: assistantCredentials(), redirect: 'error', referrerPolicy: 'no-referrer', cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5000) }), result = await response.json();
      if (!response.ok || typeof result?.available !== 'boolean') throw new Error('config');
      const provider = Object.hasOwn(providers, result.providerId) ? providers[result.providerId] : null;
      if (result.available && (!provider || typeof result.consentVersion !== 'string' || result.consentVersion.length > 80)) throw new Error('config');
      aiConfig = { available: result.available, providerId: provider ? result.providerId : null, provider: provider?.name, consentVersion: result.consentVersion, privacyUrl: provider?.privacyUrl }; aiConsent.checked = false; aiNoticeKey = result.available ? 'aiAvailable' : 'aiUnavailable';
    } catch { aiConfig = null; aiConsent.checked = false; aiNoticeKey = 'aiConfigError'; }
    finally { aiChecking = false; renderAIControls(); }
  }
  function renderAIControls() {
    aiPanel.hidden = mode !== 'chat'; aiTitle.textContent = text('aiTitle'); aiNotice.textContent = text(aiConfig?.provider ? 'aiNotice' : 'aiInitial'); aiTerms.textContent = text('aiTerms'); aiTerms.hidden = !aiConfig?.privacyUrl; if (aiConfig?.privacyUrl) aiTerms.href = aiConfig.privacyUrl;
    aiCheck.textContent = text(aiChecking ? 'aiChecking' : 'aiCheck'); aiCheck.disabled = aiChecking || aiBusy || aiEnabled; aiStatus.textContent = aiNoticeKey ? text(aiNoticeKey) : '';
    aiConsentText.textContent = (language === 'de' ? 'Ich bin mindestens 18 Jahre alt. ' : 'I am at least 18 years old. ') + text('aiConsent'); aiConsentLabel.hidden = !aiConfig?.available; aiConsent.disabled = aiEnabled || aiBusy;
    aiToggle.textContent = text(aiEnabled ? 'aiDisable' : 'aiEnable'); aiToggle.hidden = !aiConfig?.available; aiToggle.disabled = aiChecking || (!aiEnabled && !aiConsent.checked);
    send.disabled = aiBusy; reset.disabled = aiBusy; cancelRequest.hidden = !aiBusy; cancelRequest.textContent = text('aiCancel'); form.setAttribute('aria-busy', String(aiBusy));
    modeLabel.textContent = text(aiEnabled ? 'aiMode' : 'mode'); privacyBody.textContent = text(aiEnabled ? 'aiPrivacy' : 'privacyText');
  }
  function render() {
    modeLabel.textContent = text('mode'); close.setAttribute('aria-label', text('close')); launch.lastChild.textContent = text('open');
    languageControl.setAttribute('aria-label', text('language')); de.setAttribute('aria-pressed', String(language === 'de')); en.setAttribute('aria-pressed', String(language === 'en'));
    privacyLabel.textContent = text('privacy'); privacyBody.textContent = text('privacyText'); inputLabel.textContent = text('question'); input.placeholder = text('placeholder'); send.textContent = text('send'); reset.textContent = text('reset');
    chat.hidden = mode !== 'chat'; form.hidden = mode !== 'chat'; footer.hidden = mode !== 'chat'; brief.hidden = mode !== 'brief';
    renderChat(); renderAIControls(); if (mode === 'brief') renderBrief();
  }
  function renderChat() {
    log.replaceChildren();
    const intro = el('div', 'bssa-intro'); intro.append(el('h3', '', text('intro')), el('p', '', text(aiEnabled ? 'aiWelcome' : 'welcome'))); log.append(intro);
    for (const message of messages) {
      const item = el('article', `bssa-message bssa-${message.who}`); item.lang = message.language;
      const author = t[message.language][message.who === 'user' ? 'you' : message.engine === 'ai' ? 'aiAuthor' : 'localAuthor'];
      item.append(el('span', 'bssa-author', message.engine === 'ai' ? `${author} · ${message.provider}` : author), el('p', '', message.text));
      if (message.needsHuman) item.append(el('p', 'bssa-human-note', t[message.language].aiNeedsHuman));
      if (message.sources?.length) { const sources = el('div', 'bssa-sources'); for (const source of message.sources) { const link = el('a', '', source.label); link.href = source.href; if (source.href.startsWith('https://')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; } else link.addEventListener('click', () => dialog.close()); sources.append(link); } item.append(sources); }
      log.append(item);
    }
    chips.replaceChildren();
    for (const key of ['services', 'workflow', 'cost']) chips.append(button(text(key), '', () => submit(text(key))));
    start.textContent = text('start');
  }
  function focusBrief() { requestAnimationFrame(() => brief.querySelector('textarea,button')?.focus()); }
  function renderBrief() {
    brief.replaceChildren();
    const bar = el('div', 'bssa-brief-top'); bar.append(el('h3', '', text('brief')), button(text('cancel'), 'bssa-text-button', () => { retainBriefDraft(); mode = 'chat'; render(); input.focus(); })); brief.append(bar);
    if (briefStep === -1) {
      brief.append(el('p', 'bssa-prompt', text('project')));
      const options = el('div', 'bssa-projects');
      for (const project of PROJECTS) options.append(button(project[language], '', () => { briefing.project = project.value; briefStep = 0; renderBrief(); focusBrief(); }));
      brief.append(options); return;
    }
    if (briefStep >= BRIEF_FIELDS.length) {
      brief.append(el('h4', '', text('summary')), el('p', 'bssa-summary-note', text('summaryText')));
      const summary = el('dl', 'bssa-summary'); summary.append(el('dt', '', text('projectLabel')), el('dd', '', PROJECTS.find(p => p.value === briefing.project)?.[language] ?? text('all')));
      for (const field of BRIEF_FIELDS) summary.append(el('dt', '', field[language]), el('dd', '', briefing[field.key] || text('all')));
      brief.append(summary);
      const transfer = button(text('transfer'), 'bssa-transfer', () => { pendingBriefing = makeBriefing(briefing, language); dialog.close(); });
      brief.append(transfer, button(text('previous'), 'bssa-text-button', () => { briefStep = BRIEF_FIELDS.length - 1; renderBrief(); focusBrief(); }), button(text('restart'), 'bssa-text-button', () => { briefing = { project: 'Noch offen' }; briefStep = -1; renderBrief(); focusBrief(); })); return;
    }
    const field = BRIEF_FIELDS[briefStep];
    brief.append(el('p', 'bssa-step', `${text('step')} ${briefStep + 1} ${text('of')} ${BRIEF_FIELDS.length}`));
    const stepForm = el('form', 'bssa-step-form'), label = el('label', 'bssa-prompt', field[language]), response = el('textarea');
    response.id = 'bssa-brief-response'; response.maxLength = 1000; response.rows = 5; response.value = briefing[field.key] || ''; label.htmlFor = response.id; response.autocomplete = 'off';
    const actions = el('div', 'bssa-step-actions'), back = button(text('previous'), 'bssa-text-button', () => { briefing[field.key] = response.value.trim(); briefStep--; renderBrief(); focusBrief(); });
    const skip = button(text('skip'), 'bssa-text-button', () => { briefing[field.key] = ''; briefStep++; renderBrief(); focusBrief(); });
    const next = el('button', 'bssa-button', text('next')); next.type = 'submit'; actions.append(back, skip, next); stepForm.append(label, response, actions);
    stepForm.addEventListener('submit', event => { event.preventDefault(); briefing[field.key] = response.value.trim().slice(0, 1000); briefStep++; renderBrief(); focusBrief(); }); brief.append(stepForm);
  }
}
