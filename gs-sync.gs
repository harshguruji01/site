/**
 * Google Apps Script prototype for simple user sync.
 * Deploy as a Web App (Execute as: Me, Who has access: Anyone, even anonymous)
 * NOTE: This is a simple demo prototype NOT for production use. Use proper authentication and a DB in production.
 */

function doGet(e) {
  try {
    const action = e.parameter.action || '';
    if (action === 'getUser' && e.parameter.email) {
      const email = e.parameter.email.toLowerCase();
      const store = PropertiesService.getScriptProperties().getProperty('USERS_JSON') || '[]';
      const users = JSON.parse(store);
      const user = users.find(u => (u.email || '').toLowerCase() === email) || null;
      return ContentService.createTextOutput(JSON.stringify({ success: true, user: user })).setMimeType(ContentService.MimeType.JSON).setHeader('Access-Control-Allow-Origin','*');
    }
    if (action === 'listSubscribers') {
      const subs = JSON.parse(PropertiesService.getScriptProperties().getProperty('NEWSLETTER_SUBS') || '[]');
      return ContentService.createTextOutput(JSON.stringify({ success: true, subscribers: subs })).setMimeType(ContentService.MimeType.JSON).setHeader('Access-Control-Allow-Origin','*');
    }
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Unknown action' })).setMimeType(ContentService.MimeType.JSON).setHeader('Access-Control-Allow-Origin','*');
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: String(err) })).setMimeType(ContentService.MimeType.JSON).setHeader('Access-Control-Allow-Origin','*');
  }
}

function doPost(e) {
  try {
    const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const action = body.action || '';
    if (action === 'saveUser' && body.user && body.user.email) {
      const usersRaw = PropertiesService.getScriptProperties().getProperty('USERS_JSON') || '[]';
      const users = JSON.parse(usersRaw);
      const email = (body.user.email || '').toLowerCase();
      const idx = users.findIndex(u => (u.email||'').toLowerCase() === email);
      if (idx !== -1) {
        users[idx] = Object.assign(users[idx], body.user);
      } else {
        users.push(body.user);
      }
      PropertiesService.getScriptProperties().setProperty('USERS_JSON', JSON.stringify(users));
      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON).setHeader('Access-Control-Allow-Origin','*');
    }
    if (action === 'saveSubscriber' && body.email) {
      const subsRaw = PropertiesService.getScriptProperties().getProperty('NEWSLETTER_SUBS') || '[]';
      const subs = JSON.parse(subsRaw);
      if (!subs.includes(body.email)) subs.push(body.email);
      PropertiesService.getScriptProperties().setProperty('NEWSLETTER_SUBS', JSON.stringify(subs));
      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON).setHeader('Access-Control-Allow-Origin','*');
    }
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Unknown action' })).setMimeType(ContentService.MimeType.JSON).setHeader('Access-Control-Allow-Origin','*');
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: String(err) })).setMimeType(ContentService.MimeType.JSON).setHeader('Access-Control-Allow-Origin','*');
  }
}
