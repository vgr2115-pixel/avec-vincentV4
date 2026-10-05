const OWNER_EMAIL = 'contact@avecvincent.fr';
const BUSINESS_NAME = 'AVEC VINCENT';
const BUSINESS_PHONE = '06 03 87 22 63';

function doGet() {
  return json({ ok: true, service: BUSINESS_NAME });
}

function authorizeGmail() {
  GmailApp.getAliases();
  return 'Gmail authorization ready';
}

function doPost(e) {
  const p = (e && e.parameter) || {};

  const data = {
    name: clean_(p.name, 120),
    student: clean_(p.student, 80),
    email: clean_(p.email, 200),
    phone: clean_(p.phone, 30),
    level: clean_(p.level, 80),
    subject: clean_(p.subject, 120),
    format: clean_(p.format, 80),
    objective: clean_(p.objective, 1800)
  };

  if (!data.name || !data.email || !data.level || !data.subject || !data.objective || !validEmail_(data.email)) {
    console.warn('Demande refusée : champs obligatoires manquants ou e-mail invalide');
    return json({ ok: false, error: 'invalid_request' });
  }

  const reference = Utilities.getUuid().slice(0, 8).toUpperCase();
  const subject = 'Demande de cours — ' + data.subject + ' · ' + reference;
  const requestText = buildRequestText_(data, reference);
  const requestHtml = buildRequestHtml_(data, reference);
  GmailApp.sendEmail(OWNER_EMAIL, subject, requestText, {
    htmlBody: requestHtml,
    name: BUSINESS_NAME + ' — demandes de cours',
    replyTo: data.email
  });
  console.log('Demande envoyée à ' + OWNER_EMAIL + ' — référence ' + reference);

  return json({ ok: true, reference: reference });
}

function clean_(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function validEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildRequestText_(data, reference) {
  return [
    'Nouvelle demande depuis le site AVEC VINCENT',
    'Référence : ' + reference,
    '',
    'Nom et prénom : ' + data.name,
    'E-mail : ' + data.email,
    'Téléphone : ' + (data.phone || 'Non précisé'),
    'Niveau : ' + data.level,
    'Matière ou besoin : ' + data.subject,
    'Format : ' + (data.format || 'Non précisé'),
    '',
    'Objectif ou difficultés :',
    data.objective,
    '',
    'Répondre à cette demande : ' + data.email
  ].join('\n');
}

function buildRequestHtml_(data, reference) {
  return '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#142131">' +
    '<p><strong>Nouvelle demande depuis le site AVEC VINCENT</strong><br>Référence : ' + escapeHtml_(reference) + '</p>' +
    '<p><strong>Nom et prénom :</strong> ' + escapeHtml_(data.name) +
    '<br><strong>E-mail :</strong> ' + escapeHtml_(data.email) +
    '<br><strong>Téléphone :</strong> ' + escapeHtml_(data.phone || 'Non précisé') +
    '<br><strong>Niveau :</strong> ' + escapeHtml_(data.level) +
    '<br><strong>Matière :</strong> ' + escapeHtml_(data.subject) +
    '<br><strong>Format :</strong> ' + escapeHtml_(data.format || 'Non précisé') + '</p>' +
    '<p><strong>Objectif ou difficultés</strong><br>' + escapeHtml_(data.objective).replace(/\n/g, '<br>') + '</p>' +
    '</div>';
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
