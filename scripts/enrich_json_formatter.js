const fs = require('fs');
const path = require('path');

const guideHtml = `
<section class="hg-guide-section">
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
    Complete Developer Guide: RFC 8259 JSON Standards, Validation & Best Practices
  </h2>
  <p>
    <strong>JavaScript Object Notation (JSON)</strong> is the universal, language-agnostic data-interchange format powering modern cloud computing, RESTful microservices, GraphQL APIs, mobile backends, and NoSQL document databases (like MongoDB and CouchDB). 
    Standardized formally under <strong>IETF RFC 8259</strong> and <strong>ECMA-404</strong>, JSON provides a lightweight, human-readable, and machine-parseable syntax for serializing structured data.
    The <strong>HarshGuruJi JSON Formatter &amp; Validator</strong> enables software engineers, DevOps administrators, data scientists, and students to validate syntax errors in real-time, beautify compact responses for debugging, and minify payloads for high-throughput production delivery.
  </p>

  <div class="hg-trust-banner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <div>
      <strong>Enterprise-Grade Local Privacy:</strong> JSON parsing and formatting execute entirely within your client browser engine via native V8 C++ bindings. Proprietary database records, private API tokens, and confidential customer payloads never touch our servers.
    </div>
  </div>

  <h3>1. Supported Data Types Under RFC 8259</h3>
  <div class="hg-table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Data Type</th>
          <th>Syntax Example</th>
          <th>Specification Rules &amp; Edge Cases</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>String</strong></td>
          <td><code>"Hello World"</code></td>
          <td>Must be enclosed in strict ASCII double quotes (<code>"</code>). Escape sequences like <code>\\n</code>, <code>\\t</code>, and Unicode <code>\\uXXXX</code> are permitted.</td>
        </tr>
        <tr>
          <td><strong>Number</strong></td>
          <td><code>42</code>, <code>-3.1415</code>, <code>1.0e+5</code></td>
          <td>Base-10 integer or floating-point according to IEEE 754. Leading zeros (e.g. <code>042</code>), hex (<code>0x2A</code>), <code>NaN</code>, and <code>Infinity</code> are strictly prohibited.</td>
        </tr>
        <tr>
          <td><strong>Boolean</strong></td>
          <td><code>true</code>, <code>false</code></td>
          <td>Always strictly lowercase. Values like <code>True</code>, <code>FALSE</code>, <code>1</code>, or <code>0</code> are invalid booleans.</td>
        </tr>
        <tr>
          <td><strong>Null</strong></td>
          <td><code>null</code></td>
          <td>Represents an intentional empty or non-existent value. Always lowercase.</td>
        </tr>
        <tr>
          <td><strong>Object</strong></td>
          <td><code>{"key": "value"}</code></td>
          <td>Unordered key-value pairs wrapped in curly braces (<code>{}</code>). Keys must be strings enclosed in double quotes.</td>
        </tr>
        <tr>
          <td><strong>Array</strong></td>
          <td><code>["apple", 42, false]</code></td>
          <td>Ordered sequence of zero or more values enclosed in square brackets (<code>[]</code>). Can contain mixed data types.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3>2. The Top 5 Common JSON Syntax Pitfalls &amp; How to Fix Them</h3>
  <div class="hg-guide-grid">
    <div class="hg-guide-card">
      <h4>1. Trailing Commas</h4>
      <p>A comma placed after the final element in an array or object (e.g., <code>[1, 2, 3,]</code>) is valid in JavaScript but violates strict JSON specifications, causing parsers to crash with <code>Unexpected token }</code>.</p>
    </div>
    <div class="hg-guide-card">
      <h4>2. Single Quotes Instead of Double</h4>
      <p>Keys and strings in JSON <em>must</em> use double quotes (<code>"name"</code>). Using single quotes (<code>'name'</code>) or backticks triggers immediate syntax errors in standards-compliant RFC parsers.</p>
    </div>
    <div class="hg-guide-card">
      <h4>3. Including Comments</h4>
      <p>Unlike JavaScript, JSON does not allow single-line (<code>//</code>) or multi-line (<code>/* */</code>) comments. If your config files require comments, consider JSONC, YAML, or TOML instead.</p>
    </div>
    <div class="hg-guide-card">
      <h4>4. Unquoted Object Keys</h4>
      <p>JavaScript object literals permit bare identifiers (e.g. <code>{ title: "Demo" }</code>), but JSON strictly mandates that every key must be wrapped in double quotes (<code>{ "title": "Demo" }</code>).</p>
    </div>
  </div>

  <h3>3. Architectural Trade-Offs: Prettifying vs. Minifying</h3>
  <p>
    <strong>Development Prettification (Indented View):</strong> Formatting JSON with a 2-space or 4-space indentation tree structure provides human-readable visual hierarchy. Developers can instantly spot nested arrays, verify key relationships, and inspect complex API payloads during debugging.
  </p>
  <p>
    <strong>Production Minification (Zero Whitespace):</strong> In high-throughput cloud environments, every unnecessary byte incurs latency and bandwidth costs. Minifying JSON strips all whitespace, tabs, and newline characters, reducing payload size by <strong>20% to 50%</strong> without changing any underlying data values, maximizing network throughput across cellular and mobile connections.
  </p>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Why does valid JavaScript code fail when pasted into a JSON validator?</h4>
    <p>JavaScript Object syntax is a superset of JSON. Features permitted in JavaScript—such as trailing commas, unquoted keys, single quotes, functions, symbols, <code>undefined</code>, and comments—are strictly forbidden under RFC 8259 JSON standards to ensure cross-language compatibility between Python, Java, Go, C++, and PHP.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How does HarshGuruJi ensure zero data leakage for private API payloads?</h4>
    <p>All parsing, validation, and minification routines execute via your browser's built-in <code>JSON.parse()</code> and <code>JSON.stringify()</code> engine directly in client RAM. No HTTP requests, logging telemetry, or third-party webhooks receive your data.</p>
  </div>
  <div class="hg-faq-item">
    <h4>What is the difference between JSON and JSON5?</h4>
    <p>JSON5 is an extension to JSON designed to make it friendlier for human configuration files. JSON5 allows single-line comments, multi-line strings, trailing commas, and unquoted keys. Standard web APIs, however, continue to use RFC 8259 JSON for universal interoperability.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Can JSON handle large 64-bit integers without precision loss?</h4>
    <p>JavaScript engines represent JSON numbers as 64-bit floating-point numbers (IEEE 754), which safely represent integers up to <code>2<sup>53</sup> - 1</code> (9,007,199,254,740,991). When handling 64-bit database keys (like Snowflake IDs or Twitter IDs), backend APIs typically serialize them as quoted strings to prevent rounding errors in web browsers.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How can I format huge JSON files exceeding 10MB?</h4>
    <p>Because HarshGuruJi operates directly in browser memory without sending files over the network, your browser can format several megabytes of JSON instantly. For files larger than 100MB, streaming command-line utilities like <code>jq</code> are recommended to avoid browser tab memory exhaustion.</p>
  </div>
</section>
`;

const schemaJson = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why does valid JavaScript code fail when pasted into a JSON validator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JavaScript object literals allow unquoted keys, single quotes, and comments, which are strictly disallowed under RFC 8259 JSON standards for cross-language compatibility."
      }
    },
    {
      "@type": "Question",
      "name": "How does HarshGuruJi ensure zero data leakage for private API payloads?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All parsing and beautification execute locally in browser RAM using native Web APIs. Zero network requests or telemetry endpoints receive your payload."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between JSON and JSON5?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JSON5 is an unofficial human-friendly extension that allows comments and trailing commas, whereas RFC 8259 JSON remains the universal strict standard for web APIs."
      }
    },
    {
      "@type": "Question",
      "name": "Can JSON handle large 64-bit integers without precision loss?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JavaScript numbers safely handle integers up to 2^53 - 1. For 64-bit integers like database Snowflake IDs, APIs serialize them as quoted strings to prevent floating-point rounding."
      }
    },
    {
      "@type": "Question",
      "name": "What is the benefit of minifying JSON in production?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Minification removes all whitespace and line breaks, reducing payload bandwidth by 20% to 50% and speeding up mobile API delivery."
      }
    }
  ]
};

const schemaScript = `  <script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n  </script>\n`;

const files = [
  path.join(__dirname, '../tools/json-formatter.html'),
  path.join(__dirname, '../tools/json-formatter/index.html')
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace existing short hg-guide-section
  const regexGuide = /<section class="hg-guide-section">[\s\S]*?<\/section>/i;
  if (regexGuide.test(content)) {
    content = content.replace(regexGuide, guideHtml.trim());
  } else {
    content = content.replace('</main>', guideHtml.trim() + '\n</main>');
  }

  // Add FAQ schema if not present
  if (!content.includes('"@type": "FAQPage"')) {
    content = content.replace('</head>', schemaScript + '</head>');
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Enriched ' + file);
}
