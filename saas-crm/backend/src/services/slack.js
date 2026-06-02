const https = require('https');

async function sendSlackNotification(webhookUrl, formName, entry, fields) {
  if (!webhookUrl) return;
  const topFields = (fields || []).slice(0, 4);
  const lines = topFields.map(f => `*${f.label}:* ${entry.data?.[f.label] || '-'}`).join('\n');
  const date = new Date().toLocaleString('fr-FR');
  const payload = JSON.stringify({
    text: `📋 *Nouvelle réponse — ${formName}*\n${lines}\n_${date}_`,
  });
  return new Promise((resolve) => {
    try {
      const url = new URL(webhookUrl);
      const req = https.request({
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      }, resolve);
      req.on('error', resolve);
      req.write(payload);
      req.end();
    } catch { resolve(null); }
  });
}

module.exports = { sendSlackNotification };
