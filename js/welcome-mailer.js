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
      displayName: isAi ? 'GuruAI by HarshGuruJi' : 'HarshGuruJi',
      subject: isAi
        ? 'Welcome to GuruAI by HarshGuruJi! 🎉 Welcome to AI Chat & Creative Studio'
        : 'Welcome to HarshGuruJi! 🎉 Welcome to the Official Platform & Learning Hub',
      text: isAi
        ? `Namaste ${safeName}!\n\nWelcome to GuruAI by HarshGuruJi! Aapka account successfully create ho gaya hai.\n\nAap GuruAI Chat Studio me 10 daily conversation requests aur 5 SDXL image creations enjoy kar sakte hain.\n\nVisit: https://ai.webguruji.online\nOfficial Site: https://webguruji.online\nSupport: info@webguruji.online`
        : `Namaste ${safeName}!\n\nWelcome to HarshGuruJi! Aapka account successfully create ho gaya hai.\n\nAap hamare all-in-one learning hub, developer tools, NCERT books aur GuruAI Chatbot ka bina kisi rukawat labh utha sakte hain.\n\nVisit: https://webguruji.online\nGuruAI: https://ai.webguruji.online\nSupport: info@webguruji.online`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${isAi ? 'Welcome to GuruAI by HarshGuruJi' : 'Welcome to HarshGuruJi'}</title>
</head>
<body style="margin:0;padding:0;background-color:#070a13;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#e2e8f0;">
  <center style="width:100%;background-color:#070a13;padding:30px 10px 50px 10px;">
    <table width="100%" style="background-color:#0f172a;margin:0 auto;max-width:620px;border-radius:20px;border:1px solid #1e293b;border-top:4px solid #6366f1;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:linear-gradient(135deg, ${isAi ? '#4f46e5 0%, #7c3aed 50%, #06b6d4 100%' : '#3b82f6 0%, #6366f1 50%, #06b6d4 100%'});padding:38px 24px;text-align:center;">
          <div style="display:inline-block;background:rgba(15,23,42,0.9);padding:7px 18px;border-radius:9999px;font-size:12px;font-weight:800;letter-spacing:1px;color:#38bdf8;text-transform:uppercase;border:1px solid rgba(255,255,255,0.25);">${isAi ? 'GuruAI ✦ HarshGuruJi Studio' : 'HarshGuruJi ✦ Official Ecosystem'}</div>
          <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:16px 0 6px 0;letter-spacing:-0.5px;">${isAi ? 'Welcome to GuruAI Studio! 🤖' : 'Welcome to HarshGuruJi! 🎉'}</h1>
          <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;font-weight:500;">${isAi ? 'Your Personal AI Creative & Intelligence Workspace is Activated' : 'Your All-in-One Digital Hub for Learning, Developer Tools & AI is Ready'}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 28px;">
          <div style="font-size:23px;font-weight:800;color:#ffffff;margin-bottom:12px;">Namaste, ${safeName}! 👋</div>
          <p style="font-size:15px;line-height:1.65;color:#cbd5e1;margin-bottom:24px;">
            ${isAi 
              ? 'Aapka account <strong>GuruAI Studio</strong> par successfully activate ho gaya hai! Ab aap high-speed conversational AI, contextual coding answers, aur SDXL Ultra-HD image generation ka bina kisi rukawat anand le sakte hain.'
              : 'Aapka account <strong>HarshGuruJi Official Platform</strong> par successfully create ho gaya hai! Ab aap hamare all-in-one AI ecosystem, free NCERT digital textbooks, developer utilities aur software store ka bina kisi rukawat labh utha sakte hain.'}
          </p>

          <!-- VIP Member Access Pass Card -->
          <div style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%);border:1px solid #334155;border-radius:14px;padding:18px 20px;margin:24px 0 28px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #1f293d;padding-bottom:12px;margin-bottom:12px;">
              <tr>
                <td align="left">
                  <span style="font-size:11px;font-weight:800;color:#38bdf8;letter-spacing:1.5px;text-transform:uppercase;">✦ OFFICIAL MEMBER ACCESS PASS</span>
                </td>
                <td align="right">
                  <span style="font-size:11px;background:rgba(16,185,129,0.15);color:#34d399;padding:4px 10px;border-radius:999px;font-weight:800;border:1px solid rgba(52,211,153,0.3);">ACTIVE & VERIFIED ✓</span>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;line-height:1.7;">
              <tr>
                <td style="color:#94a3b8;padding:4px 0;">Registered Email:</td>
                <td style="color:#f8fafc;font-weight:700;text-align:right;padding:4px 0;">${to}</td>
              </tr>
              <tr>
                <td style="color:#94a3b8;padding:4px 0;">Membership Tier:</td>
                <td style="color:#38bdf8;font-weight:700;text-align:right;padding:4px 0;">Lifetime Free Access</td>
              </tr>
              <tr>
                <td style="color:#94a3b8;padding:4px 0;">Daily AI Quota:</td>
                <td style="color:#c084fc;font-weight:700;text-align:right;padding:4px 0;">10 Chats + 5 SDXL Images / Day</td>
              </tr>
            </table>
          </div>

          <!-- Feature Cards -->
          <div style="background:#1e293b;border:1px solid #334155;border-radius:14px;padding:16px;margin-bottom:12px;">
            <div style="font-size:14px;font-weight:700;color:#f8fafc;margin-bottom:4px;">💬 Guru-Flash 1.1 AI Assistant</div>
            <div style="font-size:13px;color:#94a3b8;line-height:1.5;">10 high-speed daily conversation requests with deep context, programming help & instant explanations.</div>
          </div>
          <div style="background:#1e293b;border:1px solid #334155;border-radius:14px;padding:16px;margin-bottom:12px;">
            <div style="font-size:14px;font-weight:700;color:#f8fafc;margin-bottom:4px;">🎨 SDXL Ultra-HD Image Studio</div>
            <div style="font-size:13px;color:#94a3b8;line-height:1.5;">5 photorealistic image creations daily directly from natural language prompts.</div>
          </div>
          <div style="background:#1e293b;border:1px solid #334155;border-radius:14px;padding:16px;margin-bottom:12px;">
            <div style="font-size:14px;font-weight:700;color:#f8fafc;margin-bottom:4px;">📚 Free NCERT Digital Textbooks & Tools</div>
            <div style="font-size:13px;color:#94a3b8;line-height:1.5;">Classes 6 to 12 complete books, chapter PDFs, and free developer utilities at your fingertips.</div>
          </div>

          <!-- Hero Action Button -->
          <div style="text-align:center;margin:32px 0 24px 0;">
            <a href="${isAi ? 'https://ai.webguruji.online' : 'https://webguruji.online'}" style="display:inline-block;background:linear-gradient(135deg,#6366f1 0%,#06b6d4 100%);color:#ffffff;text-decoration:none;padding:15px 36px;border-radius:12px;font-weight:800;font-size:15px;letter-spacing:0.3px;box-shadow:0 10px 25px rgba(99,102,241,0.45);">${isAi ? '🚀 Launch GuruAI Studio Now' : '✨ Explore HarshGuruJi Hub Now'}</a>
          </div>

          <!-- Support & Trust Box -->
          <div style="background:rgba(30,41,59,0.5);border:1px solid #1e293b;border-radius:12px;padding:16px 20px;text-align:center;margin:24px 0 10px 0;">
            <div style="font-size:13px;font-weight:700;color:#f1f5f9;margin-bottom:4px;">🛡️ Official Communication & Direct Support</div>
            <p style="font-size:12px;color:#94a3b8;line-height:1.5;margin:0;">
              Sent securely from <strong>info@webguruji.online</strong>.<br/>
              Agar aapko koi bhi sawal ya madad chahiye, aap <strong>direct is email ka reply kar sakte hain</strong>.
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:28px;">
          <div style="height:1px;background-color:#1f293d;margin:24px 0;"></div>
          <div style="text-align:center;font-size:12px;color:#64748b;line-height:1.6;padding:0 20px;">
            <p style="margin:0 0 8px 0;font-weight:600;color:#94a3b8;">
              © ${currentYear} HarshGuruJi (webguruji.online). All rights reserved.
            </p>
            <p style="margin:0;">
              <a href="https://webguruji.online" style="color:#818cf8;text-decoration:none;margin:0 6px;">Official Website</a> • 
              <a href="https://ai.webguruji.online" style="color:#818cf8;text-decoration:none;margin:0 6px;">GuruAI Studio</a> • 
              <a href="https://webguruji.online/tools.html" style="color:#818cf8;text-decoration:none;margin:0 6px;">Tools Hub</a> • 
              <a href="https://webguruji.online/books.html" style="color:#818cf8;text-decoration:none;margin:0 6px;">NCERT Books</a> • 
              <a href="https://webguruji.online/privacy-policy.html" style="color:#818cf8;text-decoration:none;margin:0 6px;">Privacy Policy</a>
            </p>
          </div>
        </td>
      </tr>
    </table>
  </center>
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
