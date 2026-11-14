const fs = require('fs');
const path = require('path');

const guideHtml = `
  <!-- Comprehensive Cryptographic & Security Guide -->
  <section class="hg-guide-section">
    <h2>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      Comprehensive Guide: The Cryptography of Strong Passwords & NIST Standards
    </h2>
    <p>
      In an era where automated botnets and distributed GPU clusters perform billions of cryptographic hash evaluations per second, traditional passwords like "P@ssw0rd123" or pet names with birth years offer virtually zero protection. 
      The <strong>HarshGuruJi Secure Password Generator</strong> implements cryptographic best practices aligned with the <strong>National Institute of Standards and Technology (NIST Special Publication 800-63B)</strong> to engineer credentials resistant to modern cryptanalysis, rainbow tables, and distributed brute-force attacks.
    </p>

    <div class="hg-trust-banner">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <div>
        <strong>100% Client-Side Cryptographic Guarantee:</strong> All passwords and passphrases are generated in your local browser sandbox utilizing the hardware-backed Web Cryptography API. Zero data is transmitted over the network or saved to remote databases.
      </div>
    </div>

    <h3>1. The Mathematical Foundation: Shannon Information Entropy</h3>
    <p>
      Password strength is scientifically measured through <strong>information entropy</strong> (expressed in bits), a concept pioneered by Claude Shannon. Entropy quantifies the amount of uncertainty or unpredictability inherent in a string. The mathematical formula for password entropy is:
    </p>
    <div class="hg-formula-box">
      Entropy (Bits) = L &times; log<sub>2</sub>(R)
    </div>
    <p>
      Where <code>L</code> represents the total character length of the password, and <code>R</code> represents the character pool size (radix) from which each character is randomly sampled:
    </p>
    <ul>
      <li><strong>Numeric digits only (0–9):</strong> Radix <code>R = 10</code> &rarr; log<sub>2</sub>(10) &approx; 3.32 bits per character.</li>
      <li><strong>Lowercase letters only (a–z):</strong> Radix <code>R = 26</code> &rarr; log<sub>2</sub>(26) &approx; 4.70 bits per character.</li>
      <li><strong>Alphanumeric mix (a–z, A–Z, 0–9):</strong> Radix <code>R = 62</code> &rarr; log<sub>2</sub>(62) &approx; 5.95 bits per character.</li>
      <li><strong>Full ASCII printable set (letters, digits, symbols):</strong> Radix <code>R = 94</code> &rarr; log<sub>2</sub>(94) &approx; 6.55 bits per character.</li>
    </ul>
    <p>
      A 16-character password chosen randomly from a 94-character pool yields <code>16 &times; 6.55 = 104.8 bits</code> of entropy. That creates <strong>2<sup>104.8</sup> (over 3.7 &times; 10<sup>31</sup>)</strong> potential permutations, requiring millions of years for even top-tier GPU cracking rigs to enumerate.
    </p>

    <h3>2. Brute-Force Feasibility Comparison Table</h3>
    <p>
      The table below illustrates the estimated cracking duration for different password configurations when attacked by a modern brute-force rig capable of evaluating <strong>100 Billion (10<sup>11</sup>) SHA-256 hashes per second</strong>:
    </p>
    <div class="hg-table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Character Set Used</th>
            <th>8 Characters</th>
            <th>12 Characters</th>
            <th>16 Characters</th>
            <th>20 Characters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Numbers Only (0–9)</strong></td>
            <td>Instant (&lt; 0.001 sec)</td>
            <td>10 seconds</td>
            <td>1.15 days</td>
            <td>317 years</td>
          </tr>
          <tr>
            <td><strong>Lowercase Only (a–z)</strong></td>
            <td>2.08 seconds</td>
            <td>30.1 years</td>
            <td>1.3 &times; 10<sup>8</sup> years</td>
            <td>Trillions of years</td>
          </tr>
          <tr>
            <td><strong>Alphanumeric (a-z, A-Z, 0-9)</strong></td>
            <td>3.6 minutes</td>
            <td>1,020 years</td>
            <td>1.5 &times; 10<sup>11</sup> years</td>
            <td>Astronomical (&gt; Universe Age)</td>
          </tr>
          <tr>
            <td><strong>Complex (Letters + Digits + Symbols)</strong></td>
            <td>1.02 hours</td>
            <td>15,000 years</td>
            <td>1.1 &times; 10<sup>14</sup> years</td>
            <td>Unbreakable (&gt; Universe Age)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3>3. Modern Attack Vectors & Why Predictable Passwords Fail</h3>
    <div class="hg-guide-grid">
      <div class="hg-guide-card">
        <h4>Dictionary & Rule-Based Attacks</h4>
        <p>Attackers ingest leaked databases containing billions of real passwords and run transformation rules (e.g. replacing 'e' with '3' or appending '!2024'). Common substitutions do not fool modern crackers like Hashcat or John the Ripper.</p>
      </div>
      <div class="hg-guide-card">
        <h4>Credential Stuffing & Botnets</h4>
        <p>When one third-party service suffers a data breach, cybercriminals use automated bots to attempt those identical credentials across thousands of banking, email, and corporate systems.</p>
      </div>
      <div class="hg-guide-card">
        <h4>Rainbow Tables & Hash Lookup</h4>
        <p>Precomputed tables of cryptographic hash chains allow adversaries to reverse unsalted password hashes in milliseconds. Unique, high-entropy passwords render rainbow tables useless.</p>
      </div>
      <div class="hg-guide-card">
        <h4>Hardware CSPRNG vs Pseudo-Randomness</h4>
        <p>Standard JavaScript <code>Math.random()</code> is a PRNG with internal state that can be reverse-engineered. HarshGuruJi uses <code>crypto.getRandomValues()</code>, querying OS kernel entropy pools.</p>
      </div>
    </div>

    <h3>4. Memorable Passphrases vs. Complex Strings (The Diceware Paradigm)</h3>
    <p>
      As popularized by security experts and the famous XKCD #936 comic, human memory struggles to recall arbitrary 16-character strings like <code>k7#mP9$xL2!vQ8*w</code>, leading users to write them down or reuse them. 
      The <strong>Memorable Passphrase mode</strong> in this tool utilizes a curated dictionary of familiar words separated by hyphens (e.g., <code>correct-horse-battery-staple</code>). 
      Four randomly chosen words from a 7,776-word EFF wordlist yield approximately <code>4 &times; 12.92 = 51.7 bits</code> of entropy, while five words achieve nearly <strong>65 bits of entropy</strong>—making them practically uncrackable yet effortless for humans to memorize.
    </p>

    <h2>Frequently Asked Questions (FAQ)</h2>
    <div class="hg-faq-item">
      <h4>Why is Math.random() considered unsafe for generating security passwords?</h4>
      <p>Standard <code>Math.random()</code> relies on algorithmic pseudo-random number generators (such as xoshiro128+ or XorShift). Because its output depends on a predictable deterministic mathematical seed, an attacker observing a few generated outputs can mathematically reconstruct the generator's internal state and predict subsequent passwords. HarshGuruJi strictly utilizes the hardware-backed <code>window.crypto.getRandomValues()</code> API, which pulls entropy directly from physical CPU thermal noise and operating system cryptographic pools.</p>
    </div>
    <div class="hg-faq-item">
      <h4>How many bits of entropy are recommended for sensitive accounts?</h4>
      <p>NIST and leading cybersecurity authorities recommend a minimum of <strong>64 bits of entropy</strong> for standard user logins, and <strong>80 to 128+ bits</strong> for root administrators, master encryption keys, cryptocurrency wallets, and banking credentials. A random 16-to-20 character password with mixed symbols achieves well over 100 bits of entropy.</p>
    </div>
    <div class="hg-faq-item">
      <h4>Should I periodically change my passwords?</h4>
      <p>Under updated NIST SP 800-63B guidelines, mandatory arbitrary password expiration policies (such as forcing password changes every 90 days) are no longer recommended. Frequent forced changes encourage users to pick predictable variants (e.g. "Spring2024!" &rarr; "Summer2024!"). Instead, NIST advises creating strong, unique, high-entropy credentials managed via an encrypted password manager, and changing passwords only when a service breach or compromise is suspected.</p>
    </div>
    <div class="hg-faq-item">
      <h4>Does HarshGuruJi store or log generated passwords?</h4>
      <p>Absolutely not. HarshGuruJi operates under a strict Zero-Knowledge and Zero-Persistence architecture. Password synthesis executes entirely within your web browser's local memory stack. No input settings or generated keys are ever transmitted across WebSocket, REST, or tracking telemetry channels.</p>
    </div>
    <div class="hg-faq-item">
      <h4>What is the safest way to store passwords once generated?</h4>
      <p>Never record passwords in plain text files, emails, sticky notes, or unencrypted messaging apps. Use a reputable, end-to-end encrypted password manager (such as Bitwarden, 1Password, or KeePassXC) secured with a high-entropy master passphrase and hardware-backed Multi-Factor Authentication (MFA / FIDO2 security keys).</p>
    </div>
  </section>
`;

const schemaJson = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is Math.random() considered unsafe for generating security passwords?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard Math.random() relies on algorithmic pseudo-random number generators whose seed can be reverse-engineered. HarshGuruJi uses window.crypto.getRandomValues() to sample hardware-level OS entropy."
      }
    },
    {
      "@type": "Question",
      "name": "How many bits of entropy are recommended for sensitive accounts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "NIST and cybersecurity authorities recommend a minimum of 64 bits of entropy for standard accounts, and 80 to 128+ bits for root credentials and cryptocurrency keys."
      }
    },
    {
      "@type": "Question",
      "name": "Should I periodically change my passwords?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "NIST SP 800-63B no longer recommends arbitrary 90-day password rotations. Instead, generate high-entropy unique credentials and only change them upon suspected compromise."
      }
    },
    {
      "@type": "Question",
      "name": "Does HarshGuruJi store or log generated passwords?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. All passwords are synthesized 100% client-side in the browser using the Web Cryptography API. Zero data is ever sent to any server."
      }
    },
    {
      "@type": "Question",
      "name": "What is the safest way to store passwords once generated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Store your generated credentials in an end-to-end encrypted password manager like Bitwarden or 1Password paired with hardware-backed Multi-Factor Authentication (MFA)."
      }
    }
  ]
};

const schemaScript = `  <script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n  </script>\n`;

const files = [
  path.join(__dirname, '../tools/password-generator.html'),
  path.join(__dirname, '../tools/password-generator/index.html')
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace existing short guidelines-card
  const regexGuide = /<section class="guidelines-card">[\s\S]*?<\/section>/i;
  if (regexGuide.test(content)) {
    content = content.replace(regexGuide, guideHtml.trim());
  } else if (!content.includes('Comprehensive Guide: The Cryptography of Strong Passwords')) {
    // Insert before </main> or </div>
    content = content.replace('</main>', '</main>\n' + guideHtml.trim());
  }

  // Add FAQ schema if not present
  if (!content.includes('"@type": "FAQPage"')) {
    content = content.replace('</head>', schemaScript + '</head>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Enriched ' + file);
}
