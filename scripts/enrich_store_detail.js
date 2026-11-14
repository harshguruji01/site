const fs = require('fs');
const path = require('path');

const defaultDesc = `
            <p>
              <strong>Play Chess by Chess Prince</strong> is one of the most widely acclaimed classical board strategy applications on mobile and web platforms. 
              Engineered for both beginner chess learners and competitive tournament players, it delivers an intelligent adaptive chess AI engine with 10 difficulty tiers, 
              endgame tactical puzzles, move hints, board customizations, and local two-player pass-and-play support.
            </p>
            <h4 style="color:#60a5fa;margin-top:1.2rem;margin-bottom:0.6rem;">Key Features &amp; Capabilities</h4>
            <ul style="color:#94a3b8;margin-left:1.5rem;line-height:1.7;">
              <li><strong>10 Adaptive AI Difficulty Tiers:</strong> Scale effortlessly from complete beginner to master grandmaster rating calculations.</li>
              <li><strong>Over 400 Chess Puzzles:</strong> Challenge your tactical foresight with mate-in-1, mate-in-2, and strategic pawn endgame drills.</li>
              <li><strong>Comprehensive Move History:</strong> Undo moves, study alternative opening lines, and inspect notation logs.</li>
              <li><strong>Offline Pass &amp; Play:</strong> Play face-to-face with friends and family on a single touchscreen device with zero internet required.</li>
              <li><strong>Customizable Boards:</strong> Choose between classic wood, marble, slate, and high-contrast digital piece sets.</li>
            </ul>
            <p style="margin-top:1rem;color:#94a3b8;">
              Every software package in the HarshGuruJi GuruStore repository is subjected to automated multi-engine antivirus audits via VirusTotal, SHA-256 cryptographic checksum matching, and permission reviews to guarantee 100% clean, safe downloads.
            </p>
`;

const editorialSection = `
    <!-- Comprehensive GuruStore Safe Download & Verification Protocol -->
    <section class="hg-guide-section" style="max-width:1200px; margin:3.5rem auto 2.5rem; width:100%;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        GuruStore Software Security, Verification &amp; Antivirus Audit Protocols
      </h2>
      <p>
        In an open software ecosystem, user trust, device integrity, and digital security are paramount. 
        Unlike unverified third-party APK mirrors and repackaged software sites that distribute bloatware, spyware, or adware-injected binaries, 
        <strong>HarshGuruJi's GuruStore</strong> adheres to strict multi-layer verification protocols to ensure that every mobile APK, desktop package, and web utility is 100% genuine and safe.
      </p>

      <div class="hg-trust-banner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <div>
          <strong>Strict Multi-Engine Scanning:</strong> Every hosted installation package is cross-checked against over 70 commercial antivirus engines (including Kaspersky, Bitdefender, Sophos, and Microsoft Defender) with zero tolerance for malware or deceptive behavior.
        </div>
      </div>

      <h3>Our 4-Step Package Vetting Pipeline</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>1. Cryptographic Hash Integrity</h4>
          <p>We compute SHA-256 and MD5 cryptographic hashes for every uploaded binary to guarantee that files are not tampered with, intercepted, or modified in transit.</p>
        </div>
        <div class="hg-guide-card">
          <h4>2. Static Permission Analysis</h4>
          <p>Android manifests are decompiled and inspected to ensure packages do not request suspicious or excessive runtime permissions (such as background SMS, audio recording, or unauthorized location queries).</p>
        </div>
        <div class="hg-guide-card">
          <h4>3. Adware &amp; Tracker Auditing</h4>
          <p>We flag and reject applications containing aggressive third-party SDKs, persistent popup injectors, or abusive background analytics that drain battery life and harvest user data.</p>
        </div>
        <div class="hg-guide-card">
          <h4>4. Developer Identity Verification</h4>
          <p>Packages are matched against verified original developer signatures (APK keystore signatures) to prevent malicious impersonation or unauthorized third-party repackaging.</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>How do I safely install an APK on Android?</h4>
        <p>After downloading the verified APK from GuruStore, open your device's <em>Settings &gt; Security &gt; Install Unknown Apps</em> and grant permission to your browser or file manager. Tap the downloaded file to complete installation. All packages on GuruStore are safe and scanned.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Are downloads on HarshGuruJi GuruStore free?</h4>
        <p>Yes. All applications, games, tools, and developer packages hosted directly on GuruStore are 100% free with direct, high-speed download links. We do not use deceptive ad countdowns, fake download buttons, or third-party installer wrappers.</p>
      </div>
      <div class="hg-faq-item">
        <h4>How can developers submit their apps to GuruStore?</h4>
        <p>Independent software engineers, indie game developers, and tool creators can submit applications for editorial review by navigating to our Contributor Portal or contacting our software team at <a href="mailto:contact@webguruji.online" style="color:#60a5fa;">contact@webguruji.online</a>.</p>
      </div>
    </section>
`;

const files = [
  path.join(__dirname, '../store-detail.html'),
  path.join(__dirname, '../store-detail/index.html'),
  path.join(__dirname, '../store/store-detail.html')
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace description with defaultDesc using regex
  content = content.replace(
    /(<div class="app-description-text" id="app-description">)[\s\S]*?(<\/div>)/i,
    `$1${defaultDesc.trim()}\n          $2`
  );

  // Append editorial section before </main>
  if (!content.includes('GuruStore Software Security, Verification &amp; Antivirus Audit Protocols')) {
    content = content.replace(/(<\/main>)/i, editorialSection + '\n$1');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Enriched ' + file);
}
