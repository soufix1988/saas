const nodemailer = require('nodemailer');

const EMAIL_TRANSLATIONS = {
  fr: {
    confirmed: 'Votre rendez-vous est confirmé',
    pending: 'Votre demande de rendez-vous est en attente',
    cancelled: 'Votre rendez-vous a été annulé',
    modified: 'Votre rendez-vous a été modifié',
    received: 'Votre demande a bien été reçue',
    greeting: 'Bonjour',
    date: 'Date',
    time: 'Heure',
    status: 'Statut',
    regards: 'Cordialement',
  },
  en: {
    confirmed: 'Your appointment is confirmed',
    pending: 'Your appointment request is pending',
    cancelled: 'Your appointment has been cancelled',
    modified: 'Your appointment has been modified',
    received: 'Your request has been received',
    greeting: 'Hello',
    date: 'Date',
    time: 'Time',
    status: 'Status',
    regards: 'Best regards',
  },
  es: {
    confirmed: 'Su cita está confirmada',
    pending: 'Su solicitud de cita está pendiente',
    cancelled: 'Su cita ha sido cancelada',
    modified: 'Su cita ha sido modificada',
    received: 'Su solicitud ha sido recibida',
    greeting: 'Hola',
    date: 'Fecha',
    time: 'Hora',
    status: 'Estado',
    regards: 'Atentamente',
  },
  de: {
    confirmed: 'Ihr Termin ist bestätigt',
    pending: 'Ihre Terminanfrage ist ausstehend',
    cancelled: 'Ihr Termin wurde abgesagt',
    modified: 'Ihr Termin wurde geändert',
    received: 'Ihre Anfrage wurde erhalten',
    greeting: 'Hallo',
    date: 'Datum',
    time: 'Uhrzeit',
    status: 'Status',
    regards: 'Mit freundlichen Grüßen',
  },
  ar: {
    confirmed: 'تم تأكيد موعدك',
    pending: 'طلب موعدك قيد الانتظار',
    cancelled: 'تم إلغاء موعدك',
    modified: 'تم تعديل موعدك',
    received: 'تم استلام طلبك',
    greeting: 'مرحباً',
    date: 'التاريخ',
    time: 'الوقت',
    status: 'الحالة',
    regards: 'مع التحية',
  },
  he: {
    confirmed: 'הפגישה שלך מאושרת',
    pending: 'בקשת הפגישה שלך ממתינה',
    cancelled: 'הפגישה שלך בוטלה',
    modified: 'הפגישה שלך שונתה',
    received: 'בקשתך התקבלה',
    greeting: 'שלום',
    date: 'תאריך',
    time: 'שעה',
    status: 'סטטוס',
    regards: 'בברכה',
  },
};

function getTransport() {
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: { user: 'resend', pass: process.env.RESEND_API_KEY },
    });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

function extractEmailFromData(data) {
  if (!data) return null;
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  for (const val of Object.values(data)) {
    if (typeof val === 'string') {
      const match = val.match(emailRegex);
      if (match) return match[0];
    }
  }
  return null;
}

function buildEmailHtml({ subject, greeting, bodyLines, appName, lang, color = '#111827' }) {
  const rtl = ['ar', 'he'].includes(lang);
  const dir = rtl ? 'rtl' : 'ltr';
  const fontFamily = lang === 'ar' ? "'Cairo', 'Tajawal', sans-serif" : "'Helvetica Neue', Arial, sans-serif";

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  ${lang === 'ar' ? '<link href="https://fonts.googleapis.com/css2?family=Cairo&display=swap" rel="stylesheet">' : ''}
  <style>
    body { margin: 0; padding: 0; background: #f4f6f8; font-family: ${fontFamily}; direction: ${dir}; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .header { background: ${color}; color: #fff; padding: 28px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
    .body { padding: 32px; color: #333; }
    .body p { margin: 0 0 12px; line-height: 1.6; font-size: 15px; }
    .info-row { background: #f9fafb; border-radius: 8px; padding: 12px 16px; margin: 16px 0; }
    .info-row strong { color: #111; }
    .footer { background: #f9fafb; padding: 20px 32px; text-align: center; font-size: 13px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>${appName || 'FormSaaS'}</h1></div>
    <div class="body">
      <p>${greeting},</p>
      ${bodyLines.map(line => `<p>${line}</p>`).join('\n')}
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} ${appName || 'FormSaaS'}</div>
  </div>
</body>
</html>`;
}

async function sendAppointmentEmail({ to, type, entry, formName, appName, lang = 'fr', color, customMessage }) {
  if (!to) return;
  const t = EMAIL_TRANSLATIONS[lang] || EMAIL_TRANSLATIONS.fr;
  const subjectMap = {
    confirmed: t.confirmed,
    pending: t.pending,
    cancelled: t.cancelled,
    modified: t.modified,
    received: t.received,
  };
  const subject = `${appName || 'FormSaaS'} — ${subjectMap[type] || type}`;
  const bodyLines = [
    `<strong>${formName}</strong>`,
    customMessage || '',
    entry?.rdv_date ? `<div class="info-row"><strong>${t.date}:</strong> ${entry.rdv_date}</div>` : '',
    entry?.rdv_time ? `<div class="info-row"><strong>${t.time}:</strong> ${entry.rdv_time}</div>` : '',
    t.regards,
  ].filter(Boolean);

  const html = buildEmailHtml({ subject, greeting: t.greeting, bodyLines, appName, lang, color });
  const transport = getTransport();
  await transport.sendMail({
    from: process.env.FROM_EMAIL || 'noreply@formsaas.com',
    to,
    subject,
    html,
  });
}

module.exports = { sendAppointmentEmail, extractEmailFromData };
