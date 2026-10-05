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
  if (clean_(p.website, 80)) return json({ ok: true });

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

  const replyText = buildReplyText_(data);
  const replyHtml = buildReplyHtml_(data);
  Utilities.sleep(1200);
  const threads = GmailApp.search('in:anywhere to:' + OWNER_EMAIL + ' subject:' + reference + ' newer_than:5m', 0, 5);
  if (threads.length) {
    threads[0].createDraftReply(replyText, { htmlBody: replyHtml });
  } else {
    GmailApp.createDraft(data.email, 'Re: ' + subject, replyText, { htmlBody: replyHtml });
  }

  return json({ ok: true, reference: reference });
}

function clean_(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function validEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function firstName_(name) {
  return name.split(/\s+/)[0] || name;
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
    'Nom : ' + data.name,
    'Élève : ' + (data.student || 'Non précisé'),
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
    '<p><strong>Nom :</strong> ' + escapeHtml_(data.name) +
    '<br><strong>Élève :</strong> ' + escapeHtml_(data.student || 'Non précisé') +
    '<br><strong>E-mail :</strong> ' + escapeHtml_(data.email) +
    '<br><strong>Téléphone :</strong> ' + escapeHtml_(data.phone || 'Non précisé') +
    '<br><strong>Niveau :</strong> ' + escapeHtml_(data.level) +
    '<br><strong>Matière :</strong> ' + escapeHtml_(data.subject) +
    '<br><strong>Format :</strong> ' + escapeHtml_(data.format || 'Non précisé') + '</p>' +
    '<p><strong>Objectif ou difficultés</strong><br>' + escapeHtml_(data.objective).replace(/\n/g, '<br>') + '</p>' +
    '</div>';
}

function buildReplyText_(data) {
  return [
    'Bonjour ' + firstName_(data.name) + ',',
    '',
    'Merci pour votre message et pour les informations concernant ' + (data.student || 'votre enfant') + '. Je l’ai bien reçu.',
    '',
    'Je vais revenir vers vous pour vous proposer un premier échange et voir ensemble le format, le rythme et le créneau les plus adaptés à votre besoin.',
    '',
    'Bien cordialement,',
    'Vincent',
    BUSINESS_NAME,
    BUSINESS_PHONE,
    'contact@avecvincent.fr'
  ].join('\n');
}

function buildReplyHtml_(data) {
  return '<div style="font-family:Arial,sans-serif;line-height:1.65;color:#142131">' +
    '<p>Bonjour ' + escapeHtml_(firstName_(data.name)) + ',</p>' +
    '<p>Merci pour votre message et pour les informations concernant ' + escapeHtml_(data.student || 'votre enfant') + '. Je l’ai bien reçu.</p>' +
    '<p>Je vais revenir vers vous pour vous proposer un premier échange et voir ensemble le format, le rythme et le créneau les plus adaptés à votre besoin.</p>' +
    '<p>Bien cordialement,<br><strong>Vincent</strong><br>' + BUSINESS_NAME + '<br>' + BUSINESS_PHONE + '<br>contact@avecvincent.fr</p>' +
    '</div>';
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

