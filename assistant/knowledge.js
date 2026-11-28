// Curated, deterministic website answers. No model, remote request or storage.
export const KNOWLEDGE_VERSION = '2026-11-27';
export const PROJECTS = Object.freeze([
  { value: 'App-Entwicklung', de: 'Mobile App', en: 'Mobile app' },
  { value: 'Web-App / Plattform', de: 'Web-App / Plattform', en: 'Web app / platform' },
  { value: 'Unternehmenssoftware', de: 'Unternehmenssoftware', en: 'Business software' },
  { value: 'Digitalisierung / Automatisierung', de: 'Digitalisierung', en: 'Digital workflows' },
  { value: 'Noch offen', de: 'Noch offen', en: 'Still exploring' }
]);
export const BRIEF_FIELDS = Object.freeze([
  { key: 'problem', de: 'Was soll in Ihrem Arbeitsalltag einfacher werden?', en: 'What would you like to make easier in your day-to-day work?' },
  { key: 'audience', de: 'Wer wird die Lösung verwenden?', en: 'Who will use the solution?' },
  { key: 'workflow', de: 'Wie lösen Sie diese Aufgabe heute?', en: 'How do you handle this task today?' },
  { key: 'goal', de: 'Woran würden Sie erkennen, dass das Projekt erfolgreich ist?', en: 'What would a successful result look like?' },
  { key: 'timeframe', de: 'Gibt es einen gewünschten Zeitrahmen oder weitere Rahmenbedingungen?', en: 'Is there a preferred timeline or any other important constraint?' }
]);
const LINKS = {
  services: { href: '#leistungen', de: 'Leistungen ansehen', en: 'Explore services' },
  process: { href: '#ablauf', de: 'Zusammenarbeit ansehen', en: 'How we work' },
  contact: { href: '#kontakt', de: 'Kontakt aufnehmen', en: 'Get in touch' },
  family: { href: 'https://www.ba-smartsolution.at/app-datenschutz/family-hub/', de: 'Family Hub: Datenschutzerklärung', en: 'Family Hub privacy policy' }
};
const records = [
  {
    id: 'pricing', patterns: [/\b(preis\w*|kost\w*|budget|angebot|price\w*|cost\w*|quot\w*|fee\w*)\b/],
    de: 'Ein verbindlicher Preis hängt von Funktionen, Schnittstellen und Umfang Ihres Vorhabens ab. In der bestätigten Wissensbasis gibt es keine Preislisten oder Pauschalangebote. Ein kurzes Projektbriefing hilft, die Anforderungen für ein persönliches Angebot zu klären.',
    en: 'A reliable quote depends on the features, integrations and scope of your project. The confirmed knowledge base does not contain a price list or fixed-price packages. A short project brief helps clarify the requirements for a personal quote.', sources: ['contact'], brief: true
  },
  {
    id: 'timeline', patterns: [/\b(dauer|deadline|liefer\w*|verfugbar\w*|kapazitat\w*|zeitplan|wie lange|timeline|turnaround|delivery|availability|how long)\b/],
    de: 'Ein Liefertermin oder eine aktuelle freie Kapazität ist hier nicht bestätigt. Der Zeitplan wird nach Klärung von Umfang, Abhängigkeiten und Anforderungen abgestimmt. Sie können Ihren Wunschzeitraum in das Projektbriefing aufnehmen.',
    en: 'No delivery date or current availability is confirmed here. The schedule is agreed after clarifying scope, dependencies and requirements. You can include a preferred timeline in your project brief.', sources: ['process', 'contact'], brief: true
  },
  {
    id: 'copilot', patterns: [/\b(copilot|kunstliche intelligenz|artificial intelligence|ollama|\bki\b|\bai\b)\b/],
    de: 'BSS Copilot Lite ist als lokale Lösung für Unternehmenswissen, Dokumente und Analysen in Entwicklung. Der bisherige Stand ist ein Prototyp; Verfügbarkeit, unterstützte Dateiformate und produktiver Einsatz müssen persönlich geklärt werden. Der Assistant in diesem Fenster nutzt eine kuratierte Wissensbasis und kein angeschlossenes KI-Modell.',
    en: 'BSS Copilot Lite is being developed as a local solution for business knowledge, documents and analysis. The current known status is a prototype; availability, supported file formats and production use need personal clarification. The assistant in this window uses a curated knowledge base, not a connected AI model.', sources: ['contact']
  },
  {
    id: 'family', patterns: [/\b(family ?hub|familysync|familienapp|familien app)\b/],
    de: 'Für Family Hub ist eine eigene Datenschutzerklärung vorhanden. Sie beschreibt unter anderem Benutzerkonten, gemeinsame Familieninhalte, Kalender und optionale Standortfunktionen. Einen aktuellen App-Store-Status, Preis oder ein konkretes Veröffentlichungsdatum kann ich hier nicht bestätigen.',
    en: 'Family Hub has its own privacy policy. It describes accounts, shared family content, calendars and optional location features. I cannot confirm its current App Store availability, price or release date here.', sources: ['family', 'contact']
  },
  {
    id: 'contact', patterns: [/\b(kontakt\w*|email|e mail|telefon|standort|adresse|wien|vienna|austria|osterreich|contact|mailbox|location)\b/],
    de: 'Baumgartner Smart Solution entwickelt digitale Lösungen für Unternehmen mit Standort Wien, Österreich. Sie erreichen uns unter office@ba-smartsolution.at oder über die Projektanfrage auf dieser Seite. Ein Beratungstermin oder Rückruf wird hier nicht automatisch gebucht.',
    en: 'Baumgartner Smart Solution develops digital solutions for businesses and is based in Vienna, Austria. Contact office@ba-smartsolution.at or use the project inquiry form on this page. This assistant does not automatically book consultations or callbacks.', sources: ['contact']
  },
  {
    id: 'privacy', patterns: [/\b(datenschutz|daten\w*|data|privacy|tracking|cookie\w*|speicher\w*|storage|security|sicherheit)\b/],
    de: 'Die Unterhaltung in diesem Assistant bleibt im Arbeitsspeicher dieses geöffneten Fensters. Es gibt hier keine Speicherung des Chatverlaufs und keine Übermittlung an einen KI-Dienst. Ein Projektbriefing wird nur auf Ihren Klick in das Anfrageformular übernommen. Erst wenn Sie das Formular selbst absenden, wird die Anfrage an den Versanddienst übermittelt. Anforderungen an Datenschutz und Sicherheit Ihrer Software klären wir projektspezifisch.',
    en: 'This assistant keeps the conversation only in the memory of this open window. It does not store chat history or send it to an AI provider. A project brief is copied into the inquiry form only when you click the transfer button. The inquiry is sent to the delivery service only when you submit that form yourself. Privacy and security requirements for your software are agreed for each project.', sources: ['contact']
  },
  {
    id: 'process', patterns: [/\b(ablauf|lauft|zusammenarbeit|vorgehen|abnahme|freigabe|vorschau|schritt\w*|process|work together|approval|preview|how do you work|project work)\b/],
    de: 'Die Zusammenarbeit beginnt mit Ihrer Idee und klaren Anforderungen. Danach folgen Konzept und Planung, eine testbare Vorschau während der Entwicklung und die gemeinsame Abnahme. Feedback fließt in die weitere Abstimmung ein; die finale Übergabe erfolgt nach Ihrer Freigabe.',
    en: 'We start with your idea and clear requirements, then develop the concept and plan. You can review a working preview during development and give feedback. The final handover follows a joint review and your approval.', sources: ['process'], brief: true
  },
  {
    id: 'automation', patterns: [/\b(automati\w*|digitalis\w*|excel|formular\w*|workflow\w*|integration\w*|schnittstell\w*|prozess\w*)\b/],
    de: 'Baumgartner Smart Solution unterstützt die Digitalisierung von Abläufen, etwa mit digitalen Formularen, Verwaltungswerkzeugen und individuell abgestimmten Workflows. Ob eine vorhandene Software angebunden werden kann, hängt von ihren Schnittstellen und Zugriffsrechten ab. Beschreiben Sie am besten die heutige Aufgabe und das gewünschte Ergebnis.',
    en: 'Baumgartner Smart Solution helps digitize business processes with forms, management tools and tailored workflows. Connecting existing software depends on its interfaces and access permissions. Start by describing the task as it works today and the result you want.', sources: ['services'], brief: true
  },
  {
    id: 'web', patterns: [/\b(web\w*|browser\w*|plattform\w*|portal\w*|cloud|buchung\w*|platform\w*|booking\w*)\b/],
    de: 'Wir entwickeln browserbasierte Anwendungen für Organisation, Verwaltung, Buchungen und digitale Zusammenarbeit. Welche Funktionen, Rollen und Schnittstellen erforderlich sind, wird für Ihr Projekt festgelegt. Für den Einstieg hilft die Frage: Welche Aufgabe sollen Ihre Nutzer im Browser erledigen?',
    en: 'We develop browser-based applications for organization, administration, bookings and collaboration. Features, access roles and integrations are defined for your project. A useful starting point is: what should your users be able to accomplish in the browser?', sources: ['services'], brief: true
  },
  {
    id: 'mobile', patterns: [/\b(ios|android|iphone|ipad|mobil\w*|app\w*|smartphone\w*)\b/],
    de: 'Wir entwickeln individuelle mobile Anwendungen für iOS und Android – für Kunden, Teams oder interne Abläufe. Zielgruppe, Kernfunktionen und benötigte Geräte werden vor der Umsetzung gemeinsam geklärt. Eine veröffentlichte App oder ein bestimmtes Freigabedatum ist damit noch nicht zugesagt.',
    en: 'We develop custom mobile applications for iOS and Android, for customers, teams or internal processes. Audience, core features and supported devices are agreed before implementation. This does not by itself promise store publication or a specific approval date.', sources: ['services'], brief: true
  },
  {
    id: 'services', patterns: [/\b(leistung\w*|service\w*|software|unternehmen\w*|business|anbiet\w*|biet\w*|machen|offer\w*|help|hilfe|losung\w*|solution\w*)\b/],
    de: 'Baumgartner Smart Solution entwickelt individuelle Apps, Web-Anwendungen und Software für Unternehmen. Der Schwerpunkt liegt auf klaren Oberflächen und digitalen Abläufen, die zum tatsächlichen Arbeitsalltag passen. Ich kann Ihnen die Leistungen erklären oder Ihre Idee in ein kurzes Projektbriefing übersetzen.',
    en: 'Baumgartner Smart Solution develops custom apps, web applications and business software. The focus is clear interfaces and digital workflows that fit real day-to-day tasks. I can explain the services or help you turn your idea into a short project brief.', sources: ['services'], brief: true
  }
];

export function normalize(value) {
  return String(value ?? '').slice(0, 1500).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function answerQuestion(question, language = 'de') {
  const lang = language === 'en' ? 'en' : 'de';
  const normalized = normalize(question);
  if (!normalized) return { id: 'empty', text: lang === 'de' ? 'Welche Frage haben Sie zu Baumgartner Smart Solution?' : 'What would you like to know about Baumgartner Smart Solution?', sources: [], brief: false };
  const record = records.find(item => item.patterns.some(pattern => pattern.test(normalized)));
  if (!record) return {
    id: 'unknown',
    text: lang === 'de' ? 'Dazu finde ich keinen bestätigten Eintrag in meiner Wissensbasis. Ich kann Fragen zu unseren Leistungen, zur Zusammenarbeit, zu Family Hub und zum Entwicklungsstand von BSS Copilot Lite beantworten. Für eine individuelle Einschätzung können Sie Ihre Frage in eine Projektanfrage aufnehmen.' : 'I do not have a confirmed entry about that in my knowledge base. I can explain our services, how we work, Family Hub and the development status of BSS Copilot Lite. For a personal assessment, include your question in a project inquiry.',
    sources: [{ href: '#kontakt', label: LINKS.contact[lang] }], brief: true
  };
  return { id: record.id, text: record[lang], sources: record.sources.map(key => ({ href: LINKS[key].href, label: LINKS[key][lang] })), brief: !!record.brief };
}

export function makeBriefing(brief, language = 'de') {
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) throw new TypeError('Invalid briefing');
  const lang = language === 'en' ? 'en' : 'de';
  const project = PROJECTS.find(item => item.value === brief.project)?.value ?? 'Noch offen';
  const unknown = lang === 'de' ? 'Noch offen' : 'To be clarified';
  const values = BRIEF_FIELDS.map(field => {
    const value = typeof brief[field.key] === 'string' ? brief[field.key].trim().slice(0, 1000) : '';
    return `${field[lang]}\n${value || unknown}`;
  });
  return { project, description: [(lang === 'de' ? 'Projektbriefing aus dem BSS Assistant' : 'Project brief from BSS Assistant'), ...values].join('\n\n'), language: lang };
}
