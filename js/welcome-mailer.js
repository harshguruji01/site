/**
 * HarshGuruJi Welcome Mailer
 * Connects Hostinger Mail API (info@webguruji.online) to user authentication.
 * Automatically sends welcome email on first user login/registration.
 */

const MAIL_API_ENDPOINT = 'https://ai.webguruji.online/api/mail/send';
const HOSTINGER_FALLBACK_URL = 'https://api.mail.hostinger.com/api/v1/mailboxes/AC955bc6c100d79999a2c5613002ee/send';
const HOSTINGER_TOKEN = 'afa0c378c26eae81c5d0fbb5848f69ae108dfe0043d020cbd90e73f8e0a44b21';

/**
 * Send welcome email to a new user
 * @param {Object} params
 * @param {string} params.to
 * @param {string} [params.name]
 * @param {string} [params.source='main'] - 'ai' | 'main'
 */
export async function sendWelcomeEmail({ to, name = 'Friend', source = 'main' }) {
  if (!to) {
    console.warn('Welcome mailer: No recipient email provided.');
    return { success: false, error: 'No recipient email' };
  }

  const safeName = String(name || 'Friend').trim();

  // 1. Try sending via ai.webguruji.online backend route
  try {
    const res = await fetch(MAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'welcome',
        to,
        name: safeName,
        source: source || 'main'
      })
    });

    if (res.ok) {
      console.log('✅ Welcome email dispatched via API route to:', to);
      return await res.json();
    }
    console.warn('API route response not ok (' + res.status + '), attempting direct Hostinger fallback...');
  } catch (err) {
    console.warn('API route network notice:', err.message, 'attempting direct Hostinger fallback...');
  }

  // 2. Direct fallback to Hostinger Mail API
  try {
    const currentYear = new Date().getFullYear();
    const isAi = source === 'ai';
    const payload = {
      to: [to],
      displayName: isAi ? 'GuruAI by HarshGuruJi <info@webguruji.online>' : 'HarshGuruJi <info@webguruji.online>',
      subject: isAi
        ? 'Welcome to GuruAI by HarshGuruJi! 🎉 Welcome to AI Chat & Creative Studio'
        : 'Welcome to HarshGuruJi! 🎉 Welcome to the Official Platform & Learning Hub',
      text: isAi
        ? `Namaste ${safeName}!\n\nWelcome to GuruAI by HarshGuruJi! Aapka account successfully create ho gaya hai.\n\nAap GuruAI Chat Studio me 10 daily conversation requests aur 5 SDXL image creations enjoy kar sakte hain.\n\nVisit: https://ai.webguruji.online\nOfficial Site: https://www.webguruji.online\nSupport: info@webguruji.online`
        : `Namaste ${safeName}!\n\nWelcome to HarshGuruJi! Aapka account successfully create ho gaya hai.\n\nAap hamare all-in-one learning hub, developer tools, NCERT books aur GuruAI Chatbot ka bina kisi rukawat labh utha sakte hain.\n\nVisit: https://www.webguruji.online\nGuruAI: https://ai.webguruji.online\nSupport: info@webguruji.online`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><title>${isAi ? 'Welcome to GuruAI' : 'Welcome to HarshGuruJi'}</title></head>
<body style="margin:0;padding:20px;background-color:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#e2e8f0;">
  <div style="max-width:580px;margin:0 auto;background:#111827;border:1px solid #1f293d;border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#4f46e5,#06b6d4);padding:30px 20px;text-align:center;">
      <div style="display:inline-block;background:#0b0f19;padding:8px 16px;border-radius:9999px;font-weight:800;font-size:16px;color:#fff;margin-bottom:12px;">${isAi ? 'GuruAI ✦ HarshGuruJi' : 'HarshGuruJi ✦ Official Hub'}</div>
      <h1 style="color:#fff;font-size:22px;margin:0;font-weight:800;">Welcome to the Family! 🎉</h1>
    </div>
    <div style="padding:28px 24px;">
      <h2 style="font-size:20px;color:#fff;margin-top:0;">Namaste, ${safeName}! 👋</h2>
      <p style="font-size:14px;color:#94a3b8;line-height:1.6;">
        ${isAi 
          ? 'Aapka account GuruAI Studio par successfully connect ho gaya hai. Ab aap 10 daily AI conversation requests aur 5 SDXL image creations ka bina kisi rukawat labh utha sakte hain.'
          : 'Aapka account HarshGuruJi Platform par successfully create ho gaya hai. Ab aap hamare GuruAI Chatbot, NCERT study books, aur developer tools ka bina kisi rukawat labh utha sakte hain.'}
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${isAi ? 'https://ai.webguruji.online' : 'https://www.webguruji.online'}" style="background:linear-gradient(135deg,#6366f1,#06b6d4);color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">${isAi ? 'Start Exploring GuruAI →' : 'Explore HarshGuruJi Hub →'}</a>
      </div>
      <hr style="border:none;border-top:1px solid #1f293d;margin:24px 0;"/>
      <p style="font-size:12px;color:#64748b;margin:0;text-align:center;">
        Sent from official mailbox: <strong>info@webguruji.online</strong><br/>
        © ${currentYear} HarshGuruJi (webguruji.online). All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`
    };

    const fbRes = await fetch(HOSTINGER_FALLBACK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HOSTINGER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (fbRes.ok || fbRes.status === 204) {
      console.log('✅ Welcome email dispatched via direct Hostinger fallback to:', to);
      return { success: true };
    }
    const errText = await fbRes.text();
    console.error('Direct Hostinger API error:', fbRes.status, errText);
  } catch (fbErr) {
    console.error('Failed to dispatch welcome email via direct fallback:', fbErr);
  }

  return { success: false };
}
