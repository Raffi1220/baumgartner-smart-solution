export const WORKSPACE_SEED = Object.freeze([
  { id: 'w1', text: 'Anforderungen gemeinsam abstimmen', done: true, category: 'Planung' },
  { id: 'w2', text: 'Ersten Entwurf durchsehen', done: true, category: 'Design' },
  { id: 'w3', text: 'Feedback aus dem Team sammeln', done: false, category: 'Abstimmung' },
  { id: 'w4', text: 'Mobile Ansicht gemeinsam testen', done: false, category: 'Qualität' },
  { id: 'w5', text: 'Nächste Freigabe vorbereiten', done: false, category: 'Abnahme' }
]);
export const FAMILY_SEED = Object.freeze([
  { id: 'f1', title: 'Gemeinsames Abendessen', date: '2026-12-07', person: 'Alex' },
  { id: 'f2', title: 'Musikstunde', date: '2026-12-08', person: 'Kim' },
  { id: 'f3', title: 'Wocheneinkauf', date: '2026-12-09', person: 'Sam' },
  { id: 'f4', title: 'Ausflug planen', date: '2026-12-12', person: 'Alex' }
]);
export const COPILOT_SEED = Object.freeze([
  { month: 'Oktober', revenue: 8400, cost: 5900 },
  { month: 'November', revenue: 9600, cost: 6300 },
  { month: 'Dezember', revenue: 11200, cost: 7200 }
]);

export function taskStats(tasks) {
  const total = tasks.length, done = tasks.filter(item => item.done === true).length;
  return { total, done, open: total - done, percent: total ? Math.round(done / total * 100) : 0 };
}
export function cleanDemoText(value, max = 90) {
  if (typeof value !== 'string') return null;
  const text = value.trim().replace(/\s+/g, ' ');
  return text.length && text.length <= max ? text : null;
}
export function validDemoDate(value) {
  if (typeof value !== 'string' || !/^20\d{2}-\d{2}-\d{2}$/.test(value) || value < '2025-01-01' || value > '2035-12-31') return false;
  const date = new Date(value + 'T12:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function calculateDemo(rows) {
  if (!Array.isArray(rows) || rows.length !== 3) return { error: 'Bitte genau drei Monate angeben.' };
  const output = [];
  for (const row of rows) {
    if (!row || typeof row.month !== 'string') return { error: 'Ungültige Monatsangabe.' };
    const values = {};
    for (const key of ['revenue', 'cost']) {
      const raw = row[key];
      if ((typeof raw !== 'number' && typeof raw !== 'string') || String(raw).trim() === '') return { error: 'Bitte alle Beträge ausfüllen.' };
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0 || value > 1000000 || Math.abs(value * 100 - Math.round(value * 100)) > 0.000001) return { error: 'Bitte Beträge von 0 bis 1.000.000 Euro mit höchstens zwei Nachkommastellen eingeben.' };
      values[key] = Math.round(value * 100);
    }
    output.push({ month: row.month.slice(0, 30), revenue: values.revenue / 100, cost: values.cost / 100, difference: (values.revenue - values.cost) / 100 });
  }
  const sum = key => output.reduce((value, row) => value + Math.round(row[key] * 100), 0) / 100;
  const revenue = sum('revenue'), cost = sum('cost'), difference = Math.round((revenue - cost) * 100) / 100;
  return { rows: output, revenue, cost, difference, best: [...output].sort((a, b) => b.difference - a.difference)[0] };
}
export function makeDemoReport(result) {
  if (!result || result.error || !Array.isArray(result.rows)) throw new TypeError('A valid calculation is required');
  const euro = value => new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(value);
  return [
    'BSS Copilot Lite – lokaler Demo-Bericht',
    'Fiktive Beispieldaten. Feste Rechenregeln; kein KI-Modell.',
    '', ...result.rows.map(row => `${row.month}: Umsatz ${euro(row.revenue)} – Kosten ${euro(row.cost)} = Differenz ${euro(row.difference)}`),
    '', `Umsatz gesamt: ${euro(result.revenue)}`, `Kosten gesamt: ${euro(result.cost)}`, `Differenz: ${euro(result.difference)}`,
    '', `Rechenweg: ${euro(result.revenue)} – ${euro(result.cost)} = ${euro(result.difference)}`,
    'Die Differenz berücksichtigt ausschließlich die hier eingegebenen Umsätze und Kosten. Sie ist keine vollständige Gewinnermittlung.',
    'Die Eingaben wurden lokal im geöffneten Browserfenster verarbeitet.'
  ].join('\n');
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-bss-demos]');
  if (root) setupDemos(root);
}
function setupDemos(root) {
  const query = value => root.querySelector(value), all = value => [...root.querySelectorAll(value)];
  const node = (tag, className, text) => { const element = document.createElement(tag); if (className) element.className = className; if (text !== undefined) element.textContent = text; return element; };
  const tabs = all('[data-demo-tab]');
  function selectTab(tab, focus = false) {
    for (const item of tabs) { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; }
    for (const panel of all('[data-demo-panel]')) panel.hidden = panel.dataset.demoPanel !== tab.dataset.demoTab;
    if (focus) tab.focus();
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      const index = tabs.indexOf(tab), keys = { ArrowRight: (index + 1) % tabs.length, ArrowDown: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, ArrowUp: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
      if (Object.hasOwn(keys, event.key)) { event.preventDefault(); selectTab(tabs[keys[event.key]], true); }
    });
  }

  let tasks = WORKSPACE_SEED.map(item => ({ ...item })), taskFilter = 'all', taskSerial = 0;
  const taskList = query('[data-workspace-tasks]'), taskStatus = query('[data-workspace-status]'), taskForm = query('[data-workspace-form]');
  function renderTasks() {
    const stats = taskStats(tasks); query('[data-workspace-open]').textContent = stats.open; query('[data-workspace-done]').textContent = stats.done; query('[data-workspace-percent]').textContent = `${stats.percent} %`; query('[data-workspace-progress]').value = stats.percent;
    query('[data-workspace-progress]').setAttribute('aria-valuetext', `${stats.done} von ${stats.total} Aufgaben erledigt`);
    for (const filter of all('[data-workspace-filter]')) filter.setAttribute('aria-pressed', String(filter.dataset.workspaceFilter === taskFilter));
    taskList.replaceChildren();
    const visible = tasks.filter(task => taskFilter === 'all' || (taskFilter === 'done' ? task.done : !task.done));
    for (const task of visible) {
      const item = node('li', task.done ? 'bss-demo-task is-done' : 'bss-demo-task'), label = node('label'), checkbox = node('input'); checkbox.type = 'checkbox'; checkbox.checked = task.done;
      const copy = node('span', 'bss-demo-task-copy'); copy.append(node('span', '', task.text), node('small', '', task.category));
      checkbox.addEventListener('change', () => { task.done = checkbox.checked; const previousIndex = visible.indexOf(task); renderTasks(); const next = taskList.querySelectorAll('input'); (next[Math.min(previousIndex, next.length - 1)] || taskForm.elements.task).focus(); taskStatus.textContent = task.done ? 'Aufgabe erledigt. Der Fortschritt wurde aktualisiert.' : 'Aufgabe wieder geöffnet.'; });
      label.append(checkbox, copy); item.append(label); taskList.append(item);
    }
    if (!visible.length) taskList.append(node('li', 'bss-demo-empty', taskFilter === 'done' ? 'Hier erscheinen Ihre erledigten Aufgaben.' : 'Keine Aufgaben in dieser Ansicht.'));
  }
  for (const filter of all('[data-workspace-filter]')) filter.addEventListener('click', () => { taskFilter = filter.dataset.workspaceFilter; renderTasks(); });
  taskForm.addEventListener('submit', event => {
    event.preventDefault(); const text = cleanDemoText(taskForm.elements.task.value);
    if (!text) { taskStatus.textContent = 'Bitte eine Aufgabe mit höchstens 90 Zeichen eingeben.'; return; }
    if (tasks.length >= 30) { taskStatus.textContent = 'Die Demo ist auf 30 Aufgaben begrenzt. Sie können sie jederzeit zurücksetzen.'; return; }
    tasks.push({ id: `user-${++taskSerial}`, text, done: false, category: 'Ihre Demo-Aufgabe' }); taskForm.reset(); taskFilter = 'all'; renderTasks(); taskStatus.textContent = 'Demo-Aufgabe hinzugefügt.'; taskForm.elements.task.focus();
  });
  query('[data-workspace-reset]').addEventListener('click', () => { tasks = WORKSPACE_SEED.map(item => ({ ...item })); taskFilter = 'all'; taskForm.reset(); renderTasks(); taskStatus.textContent = 'Das Beispielprojekt wurde zurückgesetzt.'; });
  renderTasks();

  let events = FAMILY_SEED.map(item => ({ ...item })), eventSerial = 0;
  const people = ['Alex', 'Sam', 'Kim'], familyStatus = query('[data-family-status]'), agenda = query('[data-family-agenda]'), familyFilter = query('[data-family-filter]'), eventForm = query('[data-family-form]');
  const shortDate = new Intl.DateTimeFormat('de-AT', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }), weekDay = new Intl.DateTimeFormat('de-AT', { weekday: 'short', timeZone: 'UTC' });
  function renderEvents() {
    const filtered = events.filter(item => familyFilter.value === 'all' || item.person === familyFilter.value).sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'de'));
    query('[data-family-count]').textContent = `${filtered.length} ${filtered.length === 1 ? 'Termin' : 'Termine'}`; agenda.replaceChildren();
    for (const entry of filtered) {
      const date = new Date(entry.date + 'T12:00:00Z'), item = node('li', 'bss-demo-event'), dateBox = node('time', 'bss-demo-date'); dateBox.dateTime = entry.date; dateBox.append(node('strong', '', shortDate.format(date)), node('span', '', weekDay.format(date)));
      const info = node('div', 'bss-demo-event-info'); info.append(node('strong', '', entry.title));
      const person = node('span', `bss-demo-person bss-demo-person-${entry.person.toLowerCase()}`, entry.person); info.append(person); item.append(dateBox, info); agenda.append(item);
    }
    if (!filtered.length) agenda.append(node('li', 'bss-demo-empty', 'Für diese Person gibt es noch keinen Demo-Termin.'));
  }
  familyFilter.addEventListener('change', renderEvents);
  eventForm.addEventListener('submit', event => {
    event.preventDefault(); const title = cleanDemoText(eventForm.elements.title.value, 70), date = eventForm.elements.date.value, person = eventForm.elements.person.value;
    if (!title || !validDemoDate(date) || !people.includes(person)) { familyStatus.textContent = 'Bitte Titel, Person und ein gültiges Datum zwischen 2025 und 2035 angeben.'; return; }
    if (events.length >= 16) { familyStatus.textContent = 'Die Demo enthält bereits 16 Termine. Zurücksetzen stellt die Ausgangsdaten wieder her.'; return; }
    events.push({ id: `event-${++eventSerial}`, title, date, person }); familyFilter.value = person; renderEvents(); eventForm.elements.title.value = ''; query('.bss-demo-event-create').open = false; familyStatus.textContent = `Demo-Termin für ${person} hinzugefügt. Die Ansicht zeigt diese Person.`; familyFilter.focus();
  });
  for (const task of all('[data-family-task]')) task.addEventListener('change', () => { familyStatus.textContent = task.checked ? 'Die gemeinsame Demo-Aufgabe ist erledigt.' : 'Die Demo-Aufgabe ist wieder offen.'; });
  query('[data-family-reset]').addEventListener('click', () => { events = FAMILY_SEED.map(item => ({ ...item })); familyFilter.value = 'all'; eventForm.reset(); for (const task of all('[data-family-task]')) task.checked = false; renderEvents(); familyStatus.textContent = 'Kalender und Aufgaben wurden zurückgesetzt.'; }); renderEvents();

  const money = value => new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value);
  const amount = value => new Intl.NumberFormat('de-AT', { maximumFractionDigits: 2 }).format(value);
  const copilotInputs = all('[data-copilot-value]'), reportButton = query('[data-copilot-download]'), copilotStatus = query('[data-copilot-status]');
  let currentResult;
  function renderCalculation() {
    const rows = COPILOT_SEED.map(row => ({ month: row.month })); for (const input of copilotInputs) rows[Number(input.dataset.copilotRow)][input.dataset.copilotValue] = input.value;
    const result = calculateDemo(rows); currentResult = result; reportButton.disabled = !!result.error;
    for (const input of copilotInputs) input.setAttribute('aria-invalid', String(!input.validity.valid || input.value.trim() === ''));
    const calculation = query('[data-copilot-calculation]'), chart = query('[data-copilot-chart]'); calculation.replaceChildren(); chart.replaceChildren();
    if (result.error) { copilotStatus.textContent = result.error; query('[data-copilot-revenue]').textContent = '—'; query('[data-copilot-cost]').textContent = '—'; query('[data-copilot-difference]').textContent = '—'; query('[data-copilot-insight]').textContent = 'Sobald alle Werte gültig sind, erscheint die Auswertung.'; return; }
    copilotStatus.textContent = ''; query('[data-copilot-revenue]').textContent = money(result.revenue); query('[data-copilot-cost]').textContent = money(result.cost); query('[data-copilot-difference]').textContent = money(result.difference);
    query('[data-copilot-difference]').classList.toggle('is-negative', result.difference < 0);
    const totalsEqual = result.rows.every(row => row.difference === result.rows[0].difference);
    query('[data-copilot-insight]').textContent = totalsEqual ? `Alle drei Monate zeigen dieselbe Differenz von ${money(result.best.difference)}. Insgesamt ergibt sich ${money(result.difference)} aus Umsatz minus eingegebenen Kosten.` : `${result.best.month} zeigt mit ${money(result.best.difference)} die höchste monatliche Differenz. Insgesamt bleiben ${money(result.difference)} aus Umsatz minus eingegebenen Kosten.`;
    calculation.append(node('p', '', `Umsatz: ${result.rows.map(row => amount(row.revenue)).join(' + ')} = ${money(result.revenue)}`), node('p', '', `Kosten: ${result.rows.map(row => amount(row.cost)).join(' + ')} = ${money(result.cost)}`), node('p', '', `Differenz: ${money(result.revenue)} − ${money(result.cost)} = ${money(result.difference)}`), node('p', 'bss-demo-calculation-note', 'Es werden ausschließlich die eingegebenen Umsätze und Kosten berücksichtigt.'));
    const highest = Math.max(1, ...result.rows.flatMap(row => [row.revenue, row.cost]));
    for (const row of result.rows) { const column = node('div', 'bss-demo-chart-column'), bars = node('div', 'bss-demo-chart-bars'), revenue = node('span', 'bss-demo-revenue-bar'), cost = node('span', 'bss-demo-cost-bar'); revenue.style.height = `${Math.max(0, row.revenue / highest * 100)}%`; cost.style.height = `${Math.max(0, row.cost / highest * 100)}%`; bars.append(revenue, cost); column.append(bars, node('span', '', row.month.slice(0, 3))); chart.append(column); }
    const legend = node('div', 'bss-demo-chart-legend'); legend.append(node('span', 'bss-demo-revenue-key', 'Umsatz'), node('span', 'bss-demo-cost-key', 'Kosten')); chart.append(legend);
  }
  for (const input of copilotInputs) input.addEventListener('input', renderCalculation);
  query('[data-copilot-reset]').addEventListener('click', () => { for (const input of copilotInputs) input.value = COPILOT_SEED[Number(input.dataset.copilotRow)][input.dataset.copilotValue]; renderCalculation(); copilotStatus.textContent = 'Die drei Beispielmonate wurden zurückgesetzt.'; });
  reportButton.addEventListener('click', () => {
    if (!currentResult || currentResult.error) return;
    const blob = new Blob([makeDemoReport(currentResult)], { type: 'text/plain;charset=utf-8' }), url = URL.createObjectURL(blob), link = node('a'); link.href = url; link.download = 'bss-copilot-demo-bericht.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); copilotStatus.textContent = 'Der Demo-Bericht wurde als Textdatei zum Download bereitgestellt.';
  }); renderCalculation();
}
