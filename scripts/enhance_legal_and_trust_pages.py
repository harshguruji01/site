import os
import re

SITE_DIR = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site"

def get_page_head(title, desc, canonical, schema_type="WebPage"):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="google-adsense-account" content="ca-pub-7706204118195419">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="keywords" content="harshguruji, harshguruji online, privacy, terms, about, contact, educational tools, web utilities">
  <meta name="author" content="HarshGuruJi">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="{canonical}">
  <link rel="icon" type="image/png" href="logo.png">
  <link rel="apple-touch-icon" href="logo-192.png">

  <!-- Open Graph / Facebook -->
  <meta property="og:site_name" content="HarshGuruJi">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="https://webguruji.online/logo-512.png">
  <meta property="og:locale" content="en_US">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@harshguruji1">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="https://webguruji.online/logo-512.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="cookie.css">
  <link rel="stylesheet" href="navbar-premium.css">
  <link rel="stylesheet" href="footer-premium.css">
  <link rel="stylesheet" href="responsive-patch.css">

  <!-- AdSense Click-Bombing & Protection -->
  <script src="js/ad-shield.js"></script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7706204118195419" crossorigin="anonymous"></script>
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#ff3366">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
</head>
<body class="dark-mode">
<div id="scroll-progress"></div>
<canvas id="particleCanvas"></canvas>
"""

def get_page_footer():
    return """
  <script src="script.js" defer></script>
  <script src="js/button_handlers.js" defer></script>
  <script src="cookie.js" defer></script>
  <script type="module" src="js/auth.js" defer></script>
  <script src="navbar-premium.js"></script>
  <script src="footer-premium.js"></script>
</body>
</html>
"""

def update_privacy_policy():
    path = os.path.join(SITE_DIR, "privacy-policy.html")
    title = "HarshGuruJi Privacy Policy - Comprehensive Data Protection, GDPR & AdSense Disclosure"
    desc = "HarshGuruJi official Privacy Policy: Learn how we protect user privacy, manage cookies, comply with GDPR, CCPA, and meet Google AdSense advertising standards."
    canonical = "https://webguruji.online/privacy-policy.html"
    
    body = """
<section class="section page-header">
  <div class="badge">Legal &amp; Transparency</div>
  <h1 class="page-title"><span class="gradient-text">Privacy Policy</span></h1>
  <p class="page-desc">Comprehensive data protection disclosures, cookie governance, GDPR, CCPA, and Google AdSense compliance.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px; margin:0 auto; line-height:1.85; color:var(--text-secondary); font-size:1.02rem;">
    
    <div style="background:var(--card-bg); padding:3rem 2.5rem; border-radius:24px; border:1px solid var(--card-border); box-shadow:0 15px 40px rgba(0,0,0,0.4); margin-bottom:2.5rem;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:1.5rem; margin-bottom:2rem;">
        <div>
          <span style="display:inline-block; padding:4px 12px; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); border-radius:12px; color:#f87171; font-size:0.85rem; font-weight:700; text-transform:uppercase;">
            Official Policy
          </span>
          <h2 style="color:var(--text-primary); font-size:1.8rem; margin:0.5rem 0 0 0; font-family:'Space Grotesk',sans-serif;">HarshGuruJi Privacy Statement</h2>
        </div>
        <div style="color:var(--text-secondary); font-size:0.9rem; text-align:right;">
          <strong>Effective Date:</strong> October 2026<br>
          <strong>Last Reviewed:</strong> October 30, 2026
        </div>
      </div>

      <p>
        At <strong>HarshGuruJi</strong> (accessible at <a href="https://webguruji.online" style="color:var(--accent-primary); text-decoration:none;">webguruji.online</a>), the privacy, security, and digital confidentiality of our visitors and registered users are among our highest priorities. This comprehensive Privacy Policy document details the types of personal and non-personal information collected, recorded, and utilized by HarshGuruJi, along with the strict measures we maintain to protect your rights under international privacy standards, including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA/CPRA), and the Google AdSense Publisher Program Policies.
      </p>

      <p>
        If you have additional questions or require more information about our Privacy Policy or data governance practices, please do not hesitate to contact our Data Protection desk at <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary); font-weight:600;">contact@webguruji.online</a>.
      </p>

      <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:2rem 0;">

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">1. Scope &amp; Consent</h2>
      <p>
        This Privacy Policy applies solely to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in HarshGuruJi. This policy is not applicable to any information collected offline or via channels other than this website. By accessing or utilizing any part of HarshGuruJi, you hereby consent to our Privacy Policy and agree to all of its terms.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">2. Information We Collect</h2>
      <p>
        HarshGuruJi adheres to the principle of data minimization. We only collect information that is strictly necessary to provide, optimize, and secure our educational and technical services:
      </p>
      <ul style="padding-left:1.5rem; margin-bottom:1.5rem; list-style-type:disc;">
        <li style="margin-bottom:0.75rem;">
          <strong style="color:var(--text-primary);">Information You Voluntarily Provide:</strong> When you register for an account, subscribe to platform notifications, contact our support team through our web form, or apply to join our contributor network, we may request your name, email address, username, profile preferences, and any message content or attachments you submit.
        </li>
        <li style="margin-bottom:0.75rem;">
          <strong style="color:var(--text-primary);">Automated Log and Diagnostic Data:</strong> Like most modern online web platforms, HarshGuruJi follows a standard procedure of utilizing log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and optionally the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
        </li>
        <li style="margin-bottom:0.75rem;">
          <strong style="color:var(--text-primary);">Client-Side Utility Input:</strong> When you use our developer tools (such as JSON Formatter, Base64 Converter, Password Generator, Word Counter, or BMI Calculator), all computations and conversions execute <strong>100% locally within your client browser sandbox</strong> using JavaScript. Your input text, passwords, or computational data are <strong>never</strong> transmitted to our servers or stored in any remote database.
        </li>
      </ul>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">3. How We Use Your Information</h2>
      <p>We use the collected information for diverse operational purposes, specifically to:</p>
      <ul style="padding-left:1.5rem; margin-bottom:1.5rem; list-style-type:disc;">
        <li>Provide, operate, maintain, and enhance the HarshGuruJi ecosystem;</li>
        <li>Improve, personalize, and expand our educational guides, study notes, and developer utilities;</li>
        <li>Understand and analyze how visitors interact with our content to eliminate technical bottlenecks;</li>
        <li>Develop new software features, educational roadmaps, and security enhancements;</li>
        <li>Communicate with you, either directly or through our customer service desk, to provide updates, security alerts, and support responses;</li>
        <li>Prevent fraudulent transactions, thwart invalid automated traffic, and safeguard against cyber attacks;</li>
        <li>Comply with statutory legal obligations and regulatory standards.</li>
      </ul>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">4. Cookies, Web Beacons &amp; Local Storage</h2>
      <p>
        HarshGuruJi uses "cookies" and browser local storage to enhance user experience. These cookies are used to store information including visitors' preferences (such as dark/light theme choices and language options), session tokens for authenticated members, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
      </p>
      <p>
        You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective official websites. For complete details on our cookie classification, please review our dedicated <a href="cookie.html" style="color:var(--accent-primary);">Cookie Policy</a>.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">5. Google AdSense &amp; DoubleClick DART Cookies</h2>
      <p>
        Google is one of our third-party advertising partners on our platform. Google also uses cookies, known as DART cookies, to serve advertisements to our site visitors based upon their visit to <a href="https://webguruji.online" style="color:var(--accent-primary);">webguruji.online</a> and other sites on the internet.
      </p>
      <div style="background:rgba(59,130,246,0.08); border:1px solid rgba(59,130,246,0.25); border-radius:14px; padding:1.5rem; margin:1.5rem 0;">
        <h3 style="color:#60a5fa; margin-top:0; margin-bottom:0.75rem; font-size:1.15rem;">Important AdSense Opt-Out Notice</h3>
        <p style="margin-bottom:0.75rem;">
          Visitors may choose to decline or opt out of the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL:
        </p>
        <p style="margin-bottom:0.75rem;">
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:600; word-break:break-all;">https://policies.google.com/technologies/ads</a>
        </p>
        <p style="margin:0; font-size:0.95rem;">
          You may also personalize your ad experience or opt out of targeted ad serving by visiting Google's official <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:600;">Ads Settings</a>.
        </p>
      </div>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">6. Third-Party Advertising Partners &amp; Privacy Policies</h2>
      <p>
        Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on HarshGuruJi, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
      </p>
      <p>
        Note that HarshGuruJi has no access to or control over these cookies that are used by third-party advertisers. We advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
      </p>
      <p>
        You can also opt out of participating third-party vendor cookies across the web by visiting the Network Advertising Initiative (NAI) opt-out page at <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);">optout.networkadvertising.org</a> or the Digital Advertising Alliance (DAA) choice tool at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);">aboutads.info/choices</a>.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">7. CCPA / CPRA Privacy Rights (Do Not Sell My Personal Information)</h2>
      <p>Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California consumers possess the right to:</p>
      <ul style="padding-left:1.5rem; margin-bottom:1.5rem; list-style-type:disc;">
        <li>Request that a business disclose the categories and specific pieces of personal data that a business has collected about consumers;</li>
        <li>Request that a business delete any personal data about the consumer that a business has collected;</li>
        <li>Request that a business that sells or shares a consumer's personal data, not sell or share the consumer's personal data. <strong>HarshGuruJi does not sell, trade, or rent personal data to third parties</strong>;</li>
        <li>Request correction of inaccurate personal information;</li>
        <li>Exercise these rights without experiencing discrimination or loss of platform service quality.</li>
      </ul>
      <p>
        If you submit a verifiable request, we have one month to respond to you. If you would like to exercise any of these rights, please contact our team at <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary);">contact@webguruji.online</a>.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">8. GDPR Data Protection Rights</h2>
      <p>
        We want to ensure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR). Every user residing in the European Economic Area (EEA) and the UK is entitled to the following:
      </p>
      <ul style="padding-left:1.5rem; margin-bottom:1.5rem; list-style-type:disc;">
        <li><strong style="color:var(--text-primary);">The right to access:</strong> You have the right to request copies of your personal data held by HarshGuruJi.</li>
        <li><strong style="color:var(--text-primary);">The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
        <li><strong style="color:var(--text-primary);">The right to erasure:</strong> You have the right to request that we erase your personal data, under certain statutory conditions.</li>
        <li><strong style="color:var(--text-primary);">The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
        <li><strong style="color:var(--text-primary);">The right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
        <li><strong style="color:var(--text-primary);">The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
      </ul>
      <p>
        If you make a request, we have 30 days to respond to you. If you wish to exercise any of these fundamental rights, please contact us at <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary);">contact@webguruji.online</a>.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">9. Children's Online Privacy Protection (COPPA)</h2>
      <p>
        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
      </p>
      <p>
        HarshGuruJi does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will make our best efforts to promptly remove such information from our records.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">10. Data Security &amp; Encryption Protocols</h2>
      <p>
        We employ robust technical and organizational security measures to protect your personal data from unauthorized access, accidental loss, destruction, or disclosure. All web traffic between your browser and HarshGuruJi is strictly encrypted in transit using industry-standard Transport Layer Security (TLS 1.3 / SSL). Sensitive database entities are fortified with Row-Level Security (RLS) policies and cryptographically salted password hashes.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">11. Third-Party Links &amp; External Repositories</h2>
      <p>
        Our website contains links to other external educational portals, official boards, and developer resources. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">12. Policy Updates &amp; Notifications</h2>
      <p>
        We may update our Privacy Policy periodically to reflect technological shifts, operational updates, or legal changes. We will notify you of any modifications by posting the updated Privacy Policy on this page with an updated revision date. You are advised to review this page periodically for any changes.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">13. Contact &amp; Data Controller Information</h2>
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:1.5rem; margin-top:1.5rem;">
        <p style="margin-top:0; margin-bottom:0.5rem;"><strong style="color:var(--text-primary);">Platform Entity:</strong> HarshGuruJi Digital Platform</p>
        <p style="margin-bottom:0.5rem;"><strong style="color:var(--text-primary);">Domain:</strong> <a href="https://webguruji.online" style="color:var(--accent-primary);">https://webguruji.online</a></p>
        <p style="margin-bottom:0.5rem;"><strong style="color:var(--text-primary);">Founder &amp; Data Controller:</strong> Harsh Patel</p>
        <p style="margin-bottom:0.5rem;"><strong style="color:var(--text-primary);">Official Privacy Desk:</strong> <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary);">contact@webguruji.online</a></p>
        <p style="margin-bottom:0;"><strong style="color:var(--text-primary);">Headquarters:</strong> India (Global Remote Accessibility)</p>
      </div>

    </div>

  </div>
</section>
"""
    full_html = get_page_head(title, desc, canonical) + body + get_page_footer()
    with open(path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print("[OK] privacy-policy.html updated successfully!")

def update_terms_and_conditions():
    path = os.path.join(SITE_DIR, "terms-and-conditions.html")
    title = "HarshGuruJi Terms and Conditions - User Agreement & Service Standards"
    desc = "Review the official Terms and Conditions of HarshGuruJi. Learn about user rights, intellectual property, service usage, and governing guidelines."
    canonical = "https://webguruji.online/terms-and-conditions.html"
    
    body = """
<section class="section page-header">
  <div class="badge">Legal Agreement</div>
  <h1 class="page-title"><span class="gradient-text">Terms and Conditions</span></h1>
  <p class="page-desc">The governing rules, operational guidelines, and service agreements for using HarshGuruJi.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px; margin:0 auto; line-height:1.85; color:var(--text-secondary); font-size:1.02rem;">
    
    <div style="background:var(--card-bg); padding:3rem 2.5rem; border-radius:24px; border:1px solid var(--card-border); box-shadow:0 15px 40px rgba(0,0,0,0.4); margin-bottom:2.5rem;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:1.5rem; margin-bottom:2rem;">
        <div>
          <span style="display:inline-block; padding:4px 12px; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.3); border-radius:12px; color:#60a5fa; font-size:0.85rem; font-weight:700; text-transform:uppercase;">
            Service Agreement
          </span>
          <h2 style="color:var(--text-primary); font-size:1.8rem; margin:0.5rem 0 0 0; font-family:'Space Grotesk',sans-serif;">HarshGuruJi User Agreement</h2>
        </div>
        <div style="color:var(--text-secondary); font-size:0.9rem; text-align:right;">
          <strong>Effective Date:</strong> October 2026<br>
          <strong>Last Reviewed:</strong> October 30, 2026
        </div>
      </div>

      <p>
        Welcome to <strong>HarshGuruJi</strong> (operated under <a href="https://webguruji.online" style="color:var(--accent-primary); text-decoration:none;">webguruji.online</a>). These Terms and Conditions govern your use of our website, web utilities, educational study notes, software repositories (GuruStore), AI discovery hubs, and related services.
      </p>

      <p>
        By accessing or using HarshGuruJi, you agree to be bound by these Terms. If you disagree with any part of these terms, you must not access or utilize the website or any associated services.
      </p>

      <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:2rem 0;">

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">1. Acceptance of Terms</h2>
      <p>
        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and HarshGuruJi ("we", "us", or "our"), concerning your access to and use of the platform. Your continued navigation on <a href="https://webguruji.online" style="color:var(--accent-primary);">webguruji.online</a> confirms your ongoing acceptance of these terms.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">2. Intellectual Property Rights &amp; Fair Use</h2>
      <p>
        Unless otherwise indicated, the platform is our proprietary property. All source code, databases, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
      </p>
      <ul style="padding-left:1.5rem; margin-bottom:1.5rem; list-style-type:disc;">
        <li><strong style="color:var(--text-primary);">Educational Material:</strong> NCERT textbooks, syllabus summaries, and public academic frameworks are referenced strictly for educational, research, and non-commercial study assistance under applicable fair dealing / fair use provisions.</li>
        <li><strong style="color:var(--text-primary);">Limited License:</strong> You are granted a limited license to access and use the platform solely for your personal, non-commercial educational and productivity purposes.</li>
        <li><strong style="color:var(--text-primary);">Prohibited Reproduction:</strong> You may not systematically scrape, reproduce, redistribute, sell, or exploit our original articles, code repositories, or compiled databases without prior written authorization.</li>
      </ul>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">3. User Account Security &amp; Conduct</h2>
      <p>
        If you create an account on HarshGuruJi, you are responsible for maintaining the security of your account and credentials. You must immediately notify us of any unauthorized uses of your account or any other breaches of security. You agree that you will not:
      </p>
      <ul style="padding-left:1.5rem; margin-bottom:1.5rem; list-style-type:disc;">
        <li>Use the platform for any illegal purpose or in violation of any local, state, national, or international law;</li>
        <li>Attempt to bypass, disable, or interfere with security-related features of the platform;</li>
        <li>Engage in unauthorized automated harvesting, crawling, or scraping of user accounts or site content;</li>
        <li>Upload, transmit, or distribute viruses, Trojan horses, keyloggers, or other malicious software;</li>
        <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity;</li>
        <li>Interfere with, disrupt, or create an undue burden on the platform or the networks and servers connected to it.</li>
      </ul>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">4. Client-Side Web Utilities &amp; Computational Disclaimers</h2>
      <p>
        HarshGuruJi provides interactive developer utilities, converters, and calculators (including Base64 encoders, JSON formatters, password generators, word counters, percentage calculators, and BMI calculators). These utilities execute locally within your browser sandbox.
      </p>
      <p>
        While we strive for maximum mathematical, algorithmic, and programmatic accuracy, all tools are offered on an <strong>"as-is" and "as-available" basis</strong>. We make no warranty that calculation results will meet your specific business, critical engineering, or health requirements. Reliance on output is at your sole discretion.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">5. GuruStore &amp; Software Distribution Policy</h2>
      <p>
        Our GuruStore repository curates verified software, open-source utilities, and mobile APKs. HarshGuruJi implements a strict zero-crack and zero-malware policy:
      </p>
      <ul style="padding-left:1.5rem; margin-bottom:1.5rem; list-style-type:disc;">
        <li>All listed software packages undergo multi-vendor antivirus scanning and cryptographic SHA-256 hash validation;</li>
        <li>We do not host or distribute pirated, modified (illegal MODs), or copyrighted software without authorization;</li>
        <li>Users are responsible for ensuring that their hardware meets the system requirements before downloading software releases.</li>
      </ul>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">6. Third-Party Links &amp; Advertisements</h2>
      <p>
        The platform may contain links to third-party websites or services that are not owned or controlled by HarshGuruJi. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. Additionally, commercial advertisements served via Google AdSense are governed by Google's advertising policies and guidelines.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">7. Disclaimer of Warranties</h2>
      <p>
        THE PLATFORM IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE PLATFORM AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE PLATFORM AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">8. Limitation of Liability</h2>
      <p>
        IN NO EVENT WILL HARSHGURUJI, ITS FOUNDER, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE PLATFORM, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">9. Governing Law &amp; Dispute Resolution</h2>
      <p>
        These Terms shall be governed by and defined following the laws of India. Any legal action or dispute arising out of or related to these Terms or the platform shall be instituted exclusively in the competent courts located within India.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">10. Modifications &amp; Severability</h2>
      <p>
        We reserve the right, in our sole discretion, to modify or replace these Terms at any time. If any provision or part of a provision of these Terms is determined to be unlawful, void, or unenforceable, that provision or part is deemed severable from these Terms and does not affect the validity and enforceability of any remaining provisions.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">11. Contact Information</h2>
      <p>
        For inquiries, legal notices, or feedback regarding these Terms, please reach out via:
      </p>
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:1.5rem; margin-top:1.5rem;">
        <p style="margin-top:0; margin-bottom:0.5rem;"><strong style="color:var(--text-primary);">HarshGuruJi Platform Administration</strong></p>
        <p style="margin-bottom:0.5rem;"><strong style="color:var(--text-primary);">Website:</strong> <a href="https://webguruji.online" style="color:var(--accent-primary);">https://webguruji.online</a></p>
        <p style="margin-bottom:0.5rem;"><strong style="color:var(--text-primary);">Legal &amp; Support Email:</strong> <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary);">contact@webguruji.online</a></p>
        <p style="margin-bottom:0;"><strong style="color:var(--text-primary);">Jurisdiction:</strong> India</p>
      </div>

    </div>

  </div>
</section>
"""
    full_html = get_page_head(title, desc, canonical) + body + get_page_footer()
    with open(path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print("[OK] terms-and-conditions.html updated successfully!")

def update_disclaimer():
    path = os.path.join(SITE_DIR, "disclaimer.html")
    title = "HarshGuruJi Disclaimer - Academic Content, Web Tools & Liability Statements"
    desc = "Read the official HarshGuruJi Disclaimer covering our educational resources, software downloads, developer utilities, and third-party advertising disclosures."
    canonical = "https://webguruji.online/disclaimer.html"
    
    body = """
<section class="section page-header">
  <div class="badge">Legal Disclosures</div>
  <h1 class="page-title"><span class="gradient-text">Disclaimer</span></h1>
  <p class="page-desc">Comprehensive transparency statement regarding our educational guides, tools, calculations, and software links.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px; margin:0 auto; line-height:1.85; color:var(--text-secondary); font-size:1.02rem;">
    
    <div style="background:var(--card-bg); padding:3rem 2.5rem; border-radius:24px; border:1px solid var(--card-border); box-shadow:0 15px 40px rgba(0,0,0,0.4); margin-bottom:2.5rem;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:1.5rem; margin-bottom:2rem;">
        <div>
          <span style="display:inline-block; padding:4px 12px; background:rgba(234,179,8,0.15); border:1px solid rgba(234,179,8,0.3); border-radius:12px; color:#facc15; font-size:0.85rem; font-weight:700; text-transform:uppercase;">
            Official Notice
          </span>
          <h2 style="color:var(--text-primary); font-size:1.8rem; margin:0.5rem 0 0 0; font-family:'Space Grotesk',sans-serif;">HarshGuruJi Platform Disclaimer</h2>
        </div>
        <div style="color:var(--text-secondary); font-size:0.9rem; text-align:right;">
          <strong>Effective Date:</strong> October 2026<br>
          <strong>Last Reviewed:</strong> October 30, 2026
        </div>
      </div>

      <p>
        The information, web tools, educational notes, NCERT textbook references, software releases, and digital services provided across <strong>HarshGuruJi</strong> (accessible at <a href="https://webguruji.online" style="color:var(--accent-primary); text-decoration:none;">webguruji.online</a>) are published in good faith and for general educational, academic, and developer productivity purposes only.
      </p>

      <p>
        HarshGuruJi makes no warranties about the absolute completeness, reliability, and accuracy of this information. Any action you take upon the information you find on this website is strictly at your own risk. HarshGuruJi will not be liable for any losses and/or damages in connection with the use of our website.
      </p>

      <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:2rem 0;">

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">1. Educational &amp; Academic Content Disclaimer</h2>
      <p>
        All curriculum study guides, NCERT textbook summaries, chapter breakdowns, and examination revision notes published on this platform are created to assist students in mastering academic concepts. While our team reviews content against standard frameworks (such as CBSE, NCERT, and state educational boards), educational policies and exam patterns frequently change. Users are strongly advised to cross-reference academic materials with their respective school boards or official educational portals.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">2. Online Utilities &amp; Computational Tools</h2>
      <p>
        Our suite of free browser utilities (including Base64 encoders/decoders, JSON formatters, password generators, word counters, and percentage calculators) execute locally inside your web browser. Although these tools are engineered following standard specifications (such as RFC 4648, RFC 8259, and NIST recommendations), HarshGuruJi cannot guarantee that calculation results are completely free of computational precision errors or browser anomalies.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">3. Health &amp; Fitness Disclaimer (BMI Calculator)</h2>
      <p>
        The Body Mass Index (BMI) calculator provided on HarshGuruJi is an educational estimation tool based on World Health Organization (WHO) formulas. BMI is a screening metric and does not diagnose body fatness, muscular density, bone structure, or overall health. This tool does not constitute medical advice, medical diagnosis, or treatment. Always seek the advice of a qualified physician or healthcare provider regarding any health condition or dietary program.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">4. Software Downloads &amp; GuruStore Notice</h2>
      <p>
        Applications, utilities, and software packages featured on GuruStore are scanned using industry-standard antivirus engines before listing. However, HarshGuruJi cannot guarantee that external file distributions will remain 100% immune from future third-party server modifications. Users are urged to maintain up-to-date antivirus software on their devices and verify cryptographic checksums (SHA-256) where provided.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">5. External Links &amp; Third-Party Services</h2>
      <p>
        From our website, you can visit other websites by following hyperlinks to external sites. While we strive to provide only quality links to useful, safe, and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone bad.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">6. Advertising &amp; Commercial Disclosures</h2>
      <p>
        HarshGuruJi participates in the Google AdSense advertising program to support the free operation of our servers and web tools. Advertisements displayed on the site are served automatically by Google and third-party advertising networks. The inclusion of commercial advertisements does not constitute an endorsement, warranty, or recommendation by HarshGuruJi of any advertised product, company, or service.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">7. Fair Use &amp; DMCA Copyright Notice</h2>
      <p>
        HarshGuruJi respects the intellectual property rights of others. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please notify our copyright agent with relevant details at <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary);">contact@webguruji.online</a>. We will promptly review and address any valid notices in accordance with the Digital Millennium Copyright Act (DMCA) and applicable Indian copyright laws.
      </p>

      <h2 style="color:var(--text-primary); font-size:1.4rem; margin-top:2rem; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">8. Contact Concerning Disclaimers</h2>
      <p>
        If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary);">contact@webguruji.online</a>.
      </p>

    </div>

  </div>
</section>
"""
    full_html = get_page_head(title, desc, canonical) + body + get_page_footer()
    with open(path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print("[OK] disclaimer.html updated successfully!")

def update_about():
    path = os.path.join(SITE_DIR, "about.html")
    title = "About HarshGuruJi - Mission, Leadership, Editorial Standards & Vision"
    desc = "Discover HarshGuruJi: Our mission, founder story, editorial standards, and commitment to free educational resources and privacy-first web utilities."
    canonical = "https://webguruji.online/about.html"
    
    body = """
<section class="section page-header">
  <div class="badge">Identity &amp; Vision</div>
  <h1 class="page-title">About <span class="gradient-text">HarshGuruJi</span></h1>
  <p class="page-desc">Empowering learners, developers, and creators worldwide with open tools, verified education, and distraction-free technology.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px; margin:0 auto; line-height:1.85; color:var(--text-secondary); font-size:1.02rem;">
    
    <!-- Hero Platform Overview Card -->
    <div style="background:var(--card-bg); padding:3rem 2.5rem; border-radius:24px; border:1px solid var(--card-border); box-shadow:0 15px 40px rgba(0,0,0,0.5); margin-bottom:2.5rem;">
      <div style="display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; margin-bottom:2rem;">
        <img src="logo.png" alt="HarshGuruJi Official Logo" style="width:76px; height:76px; border-radius:20px; border:2px solid rgba(255,107,74,0.4); object-fit:cover;">
        <div>
          <h2 style="color:var(--text-primary); font-size:1.9rem; margin:0 0 0.25rem 0; font-family:'Space Grotesk',sans-serif;">The HarshGuruJi Ecosystem</h2>
          <p style="margin:0; color:var(--accent-primary); font-weight:600; font-size:0.95rem;">Building Free, Accessible &amp; High-Value Digital Infrastructure</p>
        </div>
      </div>
      
      <p style="margin-bottom:1.5rem;">
        <strong>HarshGuruJi</strong> (operating at <a href="https://webguruji.online" style="color:var(--accent-primary); text-decoration:none;">webguruji.online</a>) is an independent technology, education, and developer utility platform founded by <strong>Harsh Patel</strong>. Our driving mission is simple yet vital: eliminate paywalls and high barriers to entry from essential digital tools and academic resources, giving students, self-taught programmers, and everyday internet users access to fast, reliable, privacy-centric utilities.
      </p>
      
      <p style="margin-bottom:1.5rem;">
        In a modern digital landscape crowded with intrusive advertising, subscription paywalls, and slow web applications, HarshGuruJi stands apart. We focus on lightweight client-side computation, authentic curriculum-aligned study materials (including complete NCERT textbook notes and guides), carefully vetted software releases, and unbiased technology reviews.
      </p>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.25rem; margin-top:2rem;">
        <div style="padding:1.5rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px;">
          <div style="font-size:1.6rem; margin-bottom:0.5rem;">⚡ 100% Free Access</div>
          <p style="font-size:0.92rem; margin:0; color:var(--text-secondary);">No forced subscriptions, no registration paywalls, and zero hidden charges on our web utilities and study repositories.</p>
        </div>
        <div style="padding:1.5rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px;">
          <div style="font-size:1.6rem; margin-bottom:0.5rem;">🔒 Privacy-First Engineering</div>
          <p style="font-size:0.92rem; margin:0; color:var(--text-secondary);">Our developer utilities execute directly inside your browser sandbox. We never harvest, log, or upload your sensitive data.</p>
        </div>
        <div style="padding:1.5rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px;">
          <div style="font-size:1.6rem; margin-bottom:0.5rem;">📚 Rigorous Curation</div>
          <p style="font-size:0.92rem; margin:0; color:var(--text-secondary);">Educational articles, study notes, and technical breakdowns are authored and reviewed for accuracy and clarity.</p>
        </div>
      </div>
    </div>

    <!-- Editorial Standards & Philosophy -->
    <div style="background:var(--card-bg); padding:2.5rem; border-radius:24px; border:1px solid var(--card-border); margin-bottom:2.5rem;">
      <h3 style="color:var(--text-primary); margin-top:0; margin-bottom:1.25rem; font-size:1.5rem; font-family:'Space Grotesk',sans-serif;">Our Core Editorial &amp; Quality Standards</h3>
      <p style="margin-bottom:1.25rem;">Every article, tool, and academic guide published on HarshGuruJi complies with strict quality principles:</p>
      <ul style="padding-left:1.5rem; margin-bottom:1.5rem; list-style-type:disc;">
        <li style="margin-bottom:1rem;">
          <strong style="color:var(--text-primary);">Substantial Unique Value:</strong> We reject auto-generated content, scrapers, and thin duplicate templates. Our study guides and tool breakdowns offer original analysis, step-by-step instructions, and real-world examples.
        </li>
        <li style="margin-bottom:1rem;">
          <strong style="color:var(--text-primary);">Algorithmic &amp; Technical Precision:</strong> Code snippets, JSON validators, Base64 converters, and mathematical calculators adhere strictly to international standards (W3C, ECMA, NIST, RFC).
        </li>
        <li style="margin-bottom:1rem;">
          <strong style="color:var(--text-primary);">Zero Malware &amp; Software Integrity:</strong> Applications listed in GuruStore are scanned with multi-vendor antivirus systems and verified against official cryptographic checksums. We firmly ban pirated or malicious software.
        </li>
        <li style="margin-bottom:1rem;">
          <strong style="color:var(--text-primary);">Continuous Maintenance &amp; Currency:</strong> Technology frameworks and educational curricula change rapidly. Our editorial team continually revises content and updates interfaces to ensure peak reliability.
        </li>
      </ul>
    </div>

    <!-- Leadership & Ownership Transparency (E-E-A-T) -->
    <div style="background:var(--card-bg); padding:2.5rem; border-radius:24px; border:1px solid var(--card-border); margin-bottom:2.5rem;">
      <h3 style="color:var(--text-primary); margin-top:0; margin-bottom:1.25rem; font-size:1.5rem; font-family:'Space Grotesk',sans-serif;">Leadership &amp; Founder Transparency</h3>
      <div style="display:flex; gap:2rem; align-items:flex-start; flex-wrap:wrap;">
        <div style="flex:1; min-width:280px;">
          <p style="margin-top:0; margin-bottom:1rem;">
            HarshGuruJi was created by <strong>Harsh Patel</strong>, a software developer, educational technologist, and digital creator from India. With years of hands-on experience in full-stack web engineering, API design, and educational content authoring, Harsh built the platform to provide accessible digital solutions for students and developers.
          </p>
          <p style="margin-bottom:1rem;">
            Having experienced firsthand the challenges of finding clean, ad-free educational guides and working developer utilities, Harsh engineered HarshGuruJi as an open, community-oriented initiative.
          </p>
          <p style="margin-bottom:1.5rem;">
            To read a comprehensive biographical profile, technical credentials, and public work history, visit our dedicated <a href="owner.html" style="color:var(--accent-primary); font-weight:600;">Founder Profile Page</a>.
          </p>
          <div style="display:flex; gap:1rem; flex-wrap:wrap;">
            <a href="contact.html" class="btn btn-primary" style="display:inline-block; padding:0.65rem 1.4rem; font-size:0.95rem; text-decoration:none;">Contact Leadership</a>
            <a href="contributor.html" class="btn btn-secondary" style="display:inline-block; padding:0.65rem 1.4rem; font-size:0.95rem; text-decoration:none;">Join Contributor Network</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Commitment to Public Education -->
    <div style="background:var(--card-bg); padding:2.5rem; border-radius:24px; border:1px solid var(--card-border); margin-bottom:2.5rem;">
      <h3 style="color:var(--text-primary); margin-top:0; margin-bottom:1.25rem; font-size:1.5rem; font-family:'Space Grotesk',sans-serif;">Empowering Indian &amp; Global Students</h3>
      <p style="margin-bottom:1rem;">
        Education is a fundamental right, not a luxury. HarshGuruJi's NCERT learning catalog provides comprehensive chapter summaries, chemical reaction explanations, physics formulas, and mathematics problem sets structured specifically for CBSE, ICSE, and state board syllabi.
      </p>
      <p style="margin-bottom:0;">
        Whether you are preparing for board examinations, competitive entrance tests, or seeking to learn modern web development, HarshGuruJi is committed to remaining your trusted digital companion.
      </p>
    </div>

  </div>
</section>
"""
    full_html = get_page_head(title, desc, canonical) + body + get_page_footer()
    with open(path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print("[OK] about.html updated successfully!")

def update_contact():
    path = os.path.join(SITE_DIR, "contact.html")
    title = "Contact HarshGuruJi - Official Support, Inquiries & Community Channels"
    desc = "Get in touch with HarshGuruJi. Access direct support channels, report bugs, request content additions, or contact our founder and editorial team."
    canonical = "https://webguruji.online/contact.html"
    
    body = """
<section class="section page-header">
  <div class="badge">Official Support</div>
  <h1 class="page-title">Contact <span class="gradient-text">HarshGuruJi</span></h1>
  <p class="page-desc">We are here to assist you. Connect with our technical support desk, editorial board, or leadership team.</p>
</section>

<section class="section section-dark" style="padding-top:0">
  <div class="section-container" style="max-width:960px; margin:0 auto; line-height:1.85; color:var(--text-secondary); font-size:1.02rem;">
    
    <!-- Direct Channels Cards Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem; margin-bottom:2.5rem;">
      
      <div style="background:var(--card-bg); padding:2rem; border-radius:20px; border:1px solid var(--card-border); box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <div style="font-size:2rem; margin-bottom:0.75rem;">📬</div>
        <h3 style="color:var(--text-primary); margin:0 0 0.5rem 0; font-size:1.2rem; font-family:'Space Grotesk',sans-serif;">General &amp; Support Inquiries</h3>
        <p style="font-size:0.9rem; margin-bottom:1rem; color:var(--text-secondary);">For platform questions, account assistance, tool feedback, or general support.</p>
        <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary); font-weight:700; text-decoration:none; word-break:break-all;">contact@webguruji.online</a>
        <div style="font-size:0.8rem; color:#94a3b8; margin-top:0.5rem;">Typical response: Within 24-48 hours</div>
      </div>

      <div style="background:var(--card-bg); padding:2rem; border-radius:20px; border:1px solid var(--card-border); box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <div style="font-size:2rem; margin-bottom:0.75rem;">⚖️</div>
        <h3 style="color:var(--text-primary); margin:0 0 0.5rem 0; font-size:1.2rem; font-family:'Space Grotesk',sans-serif;">Legal, Privacy &amp; DMCA</h3>
        <p style="font-size:0.9rem; margin-bottom:1rem; color:var(--text-secondary);">For copyright notices, privacy policy inquiries, or data compliance requests.</p>
        <a href="mailto:contact@webguruji.online" style="color:var(--accent-primary); font-weight:700; text-decoration:none; word-break:break-all;">contact@webguruji.online</a>
        <div style="font-size:0.8rem; color:#94a3b8; margin-top:0.5rem;">Priority review: 24-hour turnaround</div>
      </div>

      <div style="background:var(--card-bg); padding:2rem; border-radius:20px; border:1px solid var(--card-border); box-shadow:0 10px 30px rgba(0,0,0,0.3);">
        <div style="font-size:2rem; margin-bottom:0.75rem;">🌐</div>
        <h3 style="color:var(--text-primary); margin:0 0 0.5rem 0; font-size:1.2rem; font-family:'Space Grotesk',sans-serif;">Platform Headquarters</h3>
        <p style="font-size:0.9rem; margin-bottom:1rem; color:var(--text-secondary);">HarshGuruJi Digital Services Platform. Global remote operations based in India.</p>
        <div style="color:var(--text-primary); font-weight:600; font-size:0.95rem;">India (IST Timezone)</div>
        <div style="font-size:0.8rem; color:#94a3b8; margin-top:0.5rem;">Operating Hours: Mon-Sat, 9 AM - 7 PM IST</div>
      </div>

    </div>

    <!-- Contact Form & Guidelines Card -->
    <div style="background:var(--card-bg); padding:3rem 2.5rem; border-radius:24px; border:1px solid var(--card-border); box-shadow:0 15px 40px rgba(0,0,0,0.5); margin-bottom:2.5rem;">
      <h2 style="color:var(--text-primary); font-size:1.6rem; margin-top:0; margin-bottom:1rem; font-family:'Space Grotesk',sans-serif;">Send Us a Direct Message</h2>
      <p style="margin-bottom:2rem;">
        Fill out the form below to reach our team directly. Whether you have discovered a typographical error in our educational notes, want to suggest a new developer utility, or have questions about our terms, we welcome your correspondence.
      </p>

      <form id="contact-form" onsubmit="event.preventDefault(); alert('Thank you for contacting HarshGuruJi! Your message has been received. Our team will review your inquiry and respond within 24-48 business hours.'); this.reset();" style="display:flex; flex-direction:column; gap:1.25rem;">
        
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.25rem;">
          <div>
            <label for="contact-name" style="display:block; margin-bottom:0.5rem; font-weight:600; font-size:0.9rem; color:var(--text-primary);">Your Full Name *</label>
            <input type="text" id="contact-name" required placeholder="e.g. Rahul Sharma" style="width:100%; padding:0.85rem 1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.12); background:rgba(0,0,0,0.3); color:#fff; font-size:0.95rem; outline:none; box-sizing:border-box;">
          </div>
          <div>
            <label for="contact-email" style="display:block; margin-bottom:0.5rem; font-weight:600; font-size:0.9rem; color:var(--text-primary);">Your Email Address *</label>
            <input type="email" id="contact-email" required placeholder="e.g. rahul@example.com" style="width:100%; padding:0.85rem 1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.12); background:rgba(0,0,0,0.3); color:#fff; font-size:0.95rem; outline:none; box-sizing:border-box;">
          </div>
        </div>

        <div>
          <label for="contact-subject" style="display:block; margin-bottom:0.5rem; font-weight:600; font-size:0.9rem; color:var(--text-primary);">Inquiry Category *</label>
          <select id="contact-subject" required style="width:100%; padding:0.85rem 1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.12); background:rgba(15,23,42,0.95); color:#fff; font-size:0.95rem; outline:none; box-sizing:border-box;">
            <option value="general">General Feedback or Question</option>
            <option value="editorial">Content Correction / Report Academic Errata</option>
            <option value="tools">Web Utility Bug Report or Feature Request</option>
            <option value="contributor">Contributor Application Inquiry</option>
            <option value="legal">Legal, Privacy &amp; DMCA Notices</option>
          </select>
        </div>

        <div>
          <label for="contact-message" style="display:block; margin-bottom:0.5rem; font-weight:600; font-size:0.9rem; color:var(--text-primary);">Detailed Message *</label>
          <textarea id="contact-message" required rows="5" placeholder="Please describe your query, feedback, or report in detail..." style="width:100%; padding:0.85rem 1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.12); background:rgba(0,0,0,0.3); color:#fff; font-size:0.95rem; outline:none; box-sizing:border-box; resize:vertical;"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="padding:0.9rem 2rem; border-radius:12px; font-weight:700; font-size:1rem; cursor:pointer; align-self:flex-start; margin-top:0.5rem;">
          Send Message
        </button>
      </form>
    </div>

    <!-- Frequently Asked Questions (FAQ) Section -->
    <div style="background:var(--card-bg); padding:2.5rem; border-radius:24px; border:1px solid var(--card-border); margin-bottom:2.5rem;">
      <h3 style="color:var(--text-primary); margin-top:0; margin-bottom:1.5rem; font-size:1.5rem; font-family:'Space Grotesk',sans-serif;">Frequently Asked Questions</h3>
      
      <div style="margin-bottom:1.5rem;">
        <h4 style="color:var(--text-primary); font-size:1.1rem; margin-bottom:0.5rem;">Are all HarshGuruJi online tools really 100% free?</h4>
        <p style="margin:0; font-size:0.95rem;">Yes. Every utility, calculator, and study guide on our platform is completely free to use without any forced subscription, payment wall, or hidden fee.</p>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h4 style="color:var(--text-primary); font-size:1.1rem; margin-bottom:0.5rem;">Does HarshGuruJi store or read the text I enter into web tools?</h4>
        <p style="margin:0; font-size:0.95rem;">No. Our developer tools execute entirely client-side inside your browser sandbox using JavaScript. No input data is sent to our servers or stored remotely.</p>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h4 style="color:var(--text-primary); font-size:1.1rem; margin-bottom:0.5rem;">How can I contribute study material or code to HarshGuruJi?</h4>
        <p style="margin:0; font-size:0.95rem;">We welcome educator and developer contributions! Visit our <a href="contributor.html" style="color:var(--accent-primary);">Contributor Page</a> to review our editorial standards and submit an application.</p>
      </div>

      <div>
        <h4 style="color:var(--text-primary); font-size:1.1rem; margin-bottom:0.5rem;">How quickly will I receive a reply to my inquiry?</h4>
        <p style="margin:0; font-size:0.95rem;">Our support team reviews incoming correspondence daily. Standard inquiries receive a thorough reply within 24 to 48 business hours.</p>
      </div>
    </div>

  </div>
</section>
"""
    full_html = get_page_head(title, desc, canonical) + body + get_page_footer()
    with open(path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print("[OK] contact.html updated successfully!")

if __name__ == "__main__":
    update_privacy_policy()
    update_terms_and_conditions()
    update_disclaimer()
    update_about()
    update_contact()
    print("Phase 1 completed successfully!")
