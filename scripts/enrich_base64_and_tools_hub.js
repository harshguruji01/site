const fs = require('fs');
const path = require('path');

// --- Base64 Enrichment ---
const base64Guide = `
<section class="hg-guide-section">
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
    Comprehensive Engineering Guide: RFC 4648 Base64 Encoding &amp; Data URIs
  </h2>
  <p>
    <strong>Base64</strong> is a standardized binary-to-text encoding algorithm defined by the Internet Engineering Task Force (IETF) in <strong>RFC 4648</strong>. 
    It translates raw byte sequences into a resilient 64-character subset of printable US-ASCII. 
    This prevents binary transmission corruption across legacy network gateways, SMTP email transfer agents, and HTTP headers that are strictly designed for printable text.
    The <strong>HarshGuruJi Base64 Encoder &amp; Decoder</strong> enables engineers, network analysts, and students to convert UTF-8 strings, inspect binary tokens, and generate valid Data URIs with zero data sent over the network.
  </p>

  <div class="hg-trust-banner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <div>
      <strong>100% Client-Side Processing:</strong> All byte manipulation is executed inside your local web browser engine using native Web APIs. Proprietary keys, passwords, and authorization tokens remain strictly confidential.
    </div>
  </div>

  <h3>1. Mathematical Translation: 8-Bit Bytes to 6-Bit Radix-64</h3>
  <p>
    In digital computing, standard characters are stored in 8-bit bytes ($2^8 = 256$ possible values). 
    Base64 groups incoming streams of three 8-bit bytes (24 total bits) and divides them into four 6-bit chunks ($2^6 = 64$ combinations). 
    Each 6-bit decimal value (0 to 63) maps directly to a predefined index character in the RFC 4648 alphabet:
  </p>
  <div class="hg-table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Index Range</th>
          <th>Binary Chunk</th>
          <th>Output Characters</th>
          <th>Purpose in Standards</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>0 &ndash; 25</code></td>
          <td><code>000000 &ndash; 011001</code></td>
          <td><code>A &ndash; Z</code></td>
          <td>Uppercase Latin letters</td>
        </tr>
        <tr>
          <td><code>26 &ndash; 51</code></td>
          <td><code>011010 &ndash; 110011</code></td>
          <td><code>a &ndash; z</code></td>
          <td>Lowercase Latin letters</td>
        </tr>
        <tr>
          <td><code>52 &ndash; 61</code></td>
          <td><code>110100 &ndash; 111101</code></td>
          <td><code>0 &ndash; 9</code></td>
          <td>Standard Arabic numerals</td>
        </tr>
        <tr>
          <td><code>62</code></td>
          <td><code>111110</code></td>
          <td><code>+</code> (Standard) or <code>-</code> (URL Safe)</td>
          <td>Index 62 punctuation</td>
        </tr>
        <tr>
          <td><code>63</code></td>
          <td><code>111111</code></td>
          <td><code>/</code> (Standard) or <code>_</code> (URL Safe)</td>
          <td>Index 63 punctuation</td>
        </tr>
        <tr>
          <td><em>Padding</em></td>
          <td><em>Zero-padded</em></td>
          <td><code>=</code></td>
          <td>Appended when source bytes are not a multiple of 3</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>2. Why Does Base64 Expand File Size by ~33%?</h3>
  <p>
    Because Base64 translates 3 bytes (24 bits) of raw data into 4 ASCII characters (32 bits), it introduces an unavoidable <strong>33.3% storage and bandwidth overhead</strong> ($4 / 3 = 1.333$). 
    For example, a 75 KB binary image expands to approximately 100 KB when Base64-encoded. 
    However, this trade-off is often worthwhile for small web assets, as inlining small icons eliminates extra HTTP/TCP handshake latencies.
  </p>

  <h3>3. Base64 vs. URL-Safe Base64 (base64url)</h3>
  <p>
    Standard Base64 utilizes the characters <code>+</code> and <code>/</code>, which possess reserved syntactic meanings in URLs (where <code>+</code> represents a space and <code>/</code> separates path segments). 
    To permit safe usage in URLs, HTTP query strings, and <strong>JSON Web Tokens (JWT)</strong>, RFC 4648 §5 establishes <em>base64url</em>:
  </p>
  <ul>
    <li>Replace <code>+</code> with hyphen <code>-</code>.</li>
    <li>Replace <code>/</code> with underscore <code>_</code>.</li>
    <li>Omit trailing <code>=</code> padding characters.</li>
  </ul>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Is Base64 a form of data encryption?</h4>
    <p>No. Base64 is an open encoding scheme designed for data transmission compatibility, not security. Anyone with access to a Base64 string can decode it instantly without a key. To protect confidential credentials, encrypt them first using AES-GCM or RSA before encoding.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Why do some Base64 strings end with one or two equals signs (=)?</h4>
    <p>The equals sign is a padding character. Base64 processes input in 3-byte chunks. If the input has 1 byte left over (8 bits), two equals signs (<code>==</code>) are added to complete the 4-character block. If 2 bytes remain (16 bits), one equals sign (<code>=</code>) is added.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How do I use Base64 strings as inline images in HTML and CSS?</h4>
    <p>Use the Data URI syntax: <code>&lt;img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="Icon"&gt;</code>. In CSS: <code>background-image: url('data:image/svg+xml;base64,...');</code>.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How does HarshGuruJi handle multi-byte UTF-8 characters (emojis, Hindi, Chinese)?</h4>
    <p>Standard JavaScript <code>btoa()</code> throws an exception when encountering characters outside the Latin1 (0–255) range. HarshGuruJi implements a modern <code>TextEncoder</code> / <code>Uint8Array</code> pipeline to safely handle full UTF-8 international text, symbols, and emojis.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Is my data transmitted to any external server during conversion?</h4>
    <p>No. All encoding and decoding procedures run 100% locally in your web browser. No network sockets or cloud logging services are invoked.</p>
  </div>
</section>
`;

const base64Schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Base64 a form of data encryption?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Base64 is an encoding format designed for transmission reliability, not encryption. It can be decoded instantly without a key."
      }
    },
    {
      "@type": "Question",
      "name": "Why do some Base64 strings end with one or two equals signs (=)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Equals signs are padding characters used when the input byte length is not evenly divisible by 3."
      }
    },
    {
      "@type": "Question",
      "name": "How do I embed Base64 images directly into HTML?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prefix the encoded string with the Data URI scheme: data:image/png;base64,<encoded_data> inside an img src attribute."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between standard Base64 and URL-Safe Base64?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "URL-Safe Base64 replaces + with - and / with _ to prevent conflicts in URL query parameters and JSON Web Tokens (JWT)."
      }
    },
    {
      "@type": "Question",
      "name": "Is data uploaded to a server when using this tool?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. All conversion is performed 100% locally in client-side browser memory with zero network requests."
      }
    }
  ]
};

const base64SchemaScript = `  <script type="application/ld+json">\n${JSON.stringify(base64Schema, null, 2)}\n  </script>\n`;

const base64Files = [
  path.join(__dirname, '../tools/base64.html'),
  path.join(__dirname, '../tools/base64/index.html')
];

for (const file of base64Files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  const regexGuide = /<section class="hg-guide-section">[\s\S]*?<\/section>/i;
  if (regexGuide.test(content)) {
    content = content.replace(regexGuide, base64Guide.trim());
  } else {
    content = content.replace('</main>', base64Guide.trim() + '\n</main>');
  }
  if (!content.includes('"@type": "FAQPage"')) {
    content = content.replace('</head>', base64SchemaScript + '</head>');
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('Enriched ' + file);
}

// --- Tools Hub Enrichment ---
const toolsHubEditorial = `
    <!-- Comprehensive Editorial & Architecture Guide -->
    <div class="hg-guide-section" style="margin-top:3.5rem;">
      <h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        HarshGuruJi Tools Hub: Architecture, Standards & Privacy Philosophy
      </h2>
      <p>
        The HarshGuruJi Tools Hub is a curated catalog of high-performance developer utilities, mathematical calculators, text formatters, and security generators. 
        Unlike traditional online utility websites that transmit user keystrokes, personal passwords, and confidential JSON payloads to backend tracking servers, 
        every application in the HarshGuruJi ecosystem adheres to a strict <strong>Zero-Server Privacy Architecture</strong>. 
        Calculations execute 100% locally in your browser sandbox using modern HTML5 APIs, Web Workers, and the Web Cryptography standard.
      </p>

      <div class="hg-trust-banner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <div>
          <strong>Strict Zero-Knowledge Guarantee:</strong> No keystroke logging, no analytical tracking of input data, and zero server-side database persistence across all HarshGuruJi tools.
        </div>
      </div>

      <h3>Architectural Pillars of Our Utility Suite</h3>
      <div class="hg-guide-grid">
        <div class="hg-guide-card">
          <h4>🔒 Web Cryptography API</h4>
          <p>Tools like the Secure Password Generator query hardware-backed entropy from your device's CPU rather than predictable pseudo-random seeds, meeting strict NIST SP 800-63B standards.</p>
        </div>
        <div class="hg-guide-card">
          <h4>⚡ Zero Network Latency</h4>
          <p>Because processing runs in client memory, tools operate at 0ms latency. Large text blocks and megabytes of JSON are parsed and formatted without network round trips.</p>
        </div>
        <div class="hg-guide-card">
          <h4>📱 Adaptive Cross-Platform Design</h4>
          <p>Responsive CSS flexbox and grid layouts ensure seamless usability across smartphones, tablets, high-DPI laptops, and multi-monitor desktop workstations.</p>
        </div>
        <div class="hg-guide-card">
          <h4>📜 Standards Compliance</h4>
          <p>Our formatters and encoders strictly adhere to official international specifications including IETF RFC 8259 (JSON), RFC 4648 (Base64), and WHO clinical guidelines (BMI).</p>
        </div>
      </div>

      <h2>Frequently Asked Questions (FAQ)</h2>
      <div class="hg-faq-item">
        <h4>Are HarshGuruJi online tools completely free to use?</h4>
        <p>Yes. All tools on HarshGuruJi are 100% free with unlimited daily usage. There are no paywalls, mandatory account registrations, or premium tiers for basic utility functions.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Can I use these tools while offline?</h4>
        <p>Once a tool page is loaded in your browser, its core JavaScript logic runs entirely in your local browser runtime. Many tools will continue to function seamlessly even if your internet connection temporarily drops.</p>
      </div>
      <div class="hg-faq-item">
        <h4>Are my passwords or confidential code snippets logged?</h4>
        <p>Never. HarshGuruJi has no backend endpoint capturing tool inputs. Everything stays within your browser's private memory heap and is discarded the moment you refresh or navigate away.</p>
      </div>
    </div>
`;

const toolsHubFiles = [
  path.join(__dirname, '../tools.html'),
  path.join(__dirname, '../tools/index.html'),
  path.join(__dirname, '../free-tools.html'),
  path.join(__dirname, '../free-tools/index.html')
];

for (const file of toolsHubFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('HarshGuruJi Tools Hub: Architecture, Standards & Privacy Philosophy')) {
    content = content.replace(/(<\/section>\s*<\/main>)/i, toolsHubEditorial + '\n  $1');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}
