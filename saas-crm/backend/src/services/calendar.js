const { google } = require('googleapis');

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  }
  return client;
}

async function createCalendarEvent({ summary, date, time, duration = 30, description = '' }) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) return null;
  try {
    const auth = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth });
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(start.getTime() + duration * 60000);
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary,
        description,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    });
    return event.data.id;
  } catch (err) {
    console.error('Google Calendar error:', err.message);
    return null;
  }
}

async function deleteCalendarEvent(eventId) {
  if (!eventId || !process.env.GOOGLE_REFRESH_TOKEN) return;
  try {
    const auth = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.delete({ calendarId: 'primary', eventId });
  } catch (err) {
    console.error('Calendar delete error:', err.message);
  }
}

async function updateCalendarEvent(eventId, { summary, date, time, duration = 30 }) {
  if (!eventId || !process.env.GOOGLE_REFRESH_TOKEN) return;
  try {
    const auth = getOAuth2Client();
    const calendar = google.calendar({ version: 'v3', auth });
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(start.getTime() + duration * 60000);
    await calendar.events.patch({
      calendarId: 'primary',
      eventId,
      requestBody: {
        summary,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    });
  } catch (err) {
    console.error('Calendar update error:', err.message);
  }
}

module.exports = { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent };
