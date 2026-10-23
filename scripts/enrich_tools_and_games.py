# -*- coding: utf-8 -*-
"""
Script to enrich tools/*.html and games/*.html with rich, authoritative educational
content, guides, formulas, practical examples, and FAQ sections.
This permanently cures "Low value content" and "Thin content" violations in Google AdSense.
"""
import os
import re

TOOLS_DIR = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site\tools"
GAMES_DIR = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\site\games"

STYLE_SNIPPET = """
<style>
.hg-guide-section {
  max-width: 900px;
  margin: 3rem auto 2rem;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  color: #cbd5e1;
  line-height: 1.8;
  font-size: 1rem;
}
.hg-guide-section h2 {
  font-size: 1.6rem;
  color: #f8fafc;
  margin-top: 1.8rem;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}
.hg-guide-section h2:first-of-type {
  margin-top: 0;
}
.hg-guide-section h3 {
  font-size: 1.25rem;
  color: #60a5fa;
  margin-top: 1.5rem;
  margin-bottom: 0.6rem;
}
.hg-guide-section p {
  margin-bottom: 1.2rem;
}
.hg-guide-section ul, .hg-guide-section ol {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}
.hg-guide-section li {
  margin-bottom: 0.5rem;
}
.hg-guide-section table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.95rem;
}
.hg-guide-section th, .hg-guide-section td {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}
.hg-guide-section th {
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
}
.hg-faq-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1rem;
}
.hg-faq-item h4 {
  color: #f1f5f9;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}
.hg-faq-item p {
  margin-bottom: 0;
  color: #94a3b8;
}
</style>
"""

BASE64_CONTENT = """
<section class="hg-guide-section">
  <h2>Comprehensive Guide: Understanding Base64 Encoding and Decoding</h2>
  <p>
    Base64 is a binary-to-text encoding scheme defined by the Internet Engineering Task Force (IETF) in <strong>RFC 4648</strong>.
    It represents arbitrary binary data, such as images, cryptographic keys, or formatted text strings, using a limited set of 64 ASCII characters.
    This online Base64 encoder and decoder tool by <strong>HarshGuruJi</strong> allows developers, data analysts, and students to seamlessly inspect, convert, and debug data in real time directly within the browser without transmitting information over third-party servers.
  </p>

  <h3>How Base64 Encoding Works Under the Hood</h3>
  <p>
    Computers store text and files in bytes, where each byte consists of 8 bits. Base64 divides a stream of 8-bit bytes into 6-bit chunks ($2^6 = 64$ combinations).
    Each 6-bit value is then mapped directly to a character in the standard 64-character alphabet:
  </p>
  <ul>
    <li><strong>A–Z</strong>: Uppercase letters (index 0 to 25)</li>
    <li><strong>a–z</strong>: Lowercase letters (index 26 to 51)</li>
    <li><strong>0–9</strong>: Digits (index 52 to 61)</li>
    <li><strong>+</strong> and <strong>/</strong>: Special symbols (index 62 and 63)</li>
    <li><strong>=</strong>: Padding character used when the input byte count is not divisible by 3</li>
  </ul>

  <h3>Why Does Base64 Increase File Size?</h3>
  <p>
    Because Base64 represents 3 raw bytes (24 bits) using 4 ASCII characters (4 bytes), the resulting encoded text is approximately <strong>33% larger</strong> than the original source data. Despite this size overhead, Base64 is essential across network protocols that are designed exclusively for printable ASCII characters, preventing corrupted data caused by transmission gateways and mail transfer agents.
  </p>

  <h3>Common Real-World Use Cases</h3>
  <ul>
    <li><strong>Inline Data URIs:</strong> Embedding small SVG icons, PNG logos, or WebP images directly inside HTML and CSS stylesheets to reduce HTTP round-trip requests.</li>
    <li><strong>HTTP Basic Authentication:</strong> Encoding username and password credentials into the standard <code>Authorization: Basic &lt;credentials&gt;</code> header.</li>
    <li><strong>MIME Email Attachments:</strong> Packaging binary attachments in SMTP email messages without risking character corruption across international gateways.</li>
    <li><strong>Web API Data Payloads:</strong> Safely transmitting binary tokens, JWT payloads, and cryptographic hashes inside JSON structures.</li>
  </ul>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Is Base64 a form of encryption?</h4>
    <p>No. Base64 is an encoding mechanism, not encryption. Anyone can decode a Base64 string instantly without requiring a secret key or password. Sensitive data must always be encrypted using algorithms like AES-256 before transmission.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Is my data private when using this tool?</h4>
    <p>Yes. The HarshGuruJi Base64 tool runs entirely on the client side inside your web browser using JavaScript. No text, passwords, or files are sent to any remote server or stored in any database.</p>
  </div>
  <div class="hg-faq-item">
    <h4>What does the equal sign (=) mean at the end of a Base64 string?</h4>
    <p>The equal sign (=) is a padding character. Base64 groups input data into 3-byte blocks. If the input ends with 1 extra byte, two padding characters (==) are appended. If it ends with 2 extra bytes, one padding character (=) is added.</p>
  </div>
</section>
"""

BMI_CONTENT = """
<section class="hg-guide-section">
  <h2>Complete Guide: Understanding Your Body Mass Index (BMI)</h2>
  <p>
    Body Mass Index (BMI) is a recognized screening metric developed by Belgian mathematician Adolphe Quetelet in the 19th century.
    It provides an accessible, non-invasive method to classify human body weight into distinct health categories according to guidelines established by the <strong>World Health Organization (WHO)</strong>.
    HarshGuruJi's interactive BMI Calculator enables users to measure their score accurately and understand the health indicators associated with each category.
  </p>

  <h3>The Mathematical Formula Behind BMI</h3>
  <p>
    The standard formula calculates Body Mass Index by dividing an individual's weight in kilograms by their height in meters squared:
  </p>
  <p style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; font-family: monospace; text-align: center; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.1);">
    BMI = Weight (kg) &divide; [Height (m)]&sup2;
  </p>

  <h3>WHO Standard Weight Categories for Adults</h3>
  <table>
    <thead>
      <tr>
        <th>Classification</th>
        <th>BMI Range (kg/m&sup2;)</th>
        <th>Associated Health Risk Level</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Underweight</strong></td>
        <td>&lt; 18.5</td>
        <td>Increased risk of nutritional deficiency and osteoporosis</td>
      </tr>
      <tr>
        <td><strong>Normal Weight</strong></td>
        <td>18.5 – 24.9</td>
        <td>Optimal health baseline and lowest cardiovascular risk</td>
      </tr>
      <tr>
        <td><strong>Overweight</strong></td>
        <td>25.0 – 29.9</td>
        <td>Moderate risk of hypertension, type-2 diabetes, and joint strain</td>
      </tr>
      <tr>
        <td><strong>Obese (Class I–III)</strong></td>
        <td>&ge; 30.0</td>
        <td>Elevated risk of cardiovascular diseases and metabolic disorders</td>
      </tr>
    </tbody>
  </table>

  <h3>Important Clinical Limitations of BMI</h3>
  <p>
    While BMI is a widely utilized population-level screening metric, health professionals emphasize that it does not distinguish between lean muscle mass and adipose (fat) tissue. For example:
  </p>
  <ul>
    <li><strong>Athletes and Bodybuilders:</strong> Individuals with significant muscular development may register in the "overweight" or "obese" categories despite having very low body fat percentages.</li>
    <li><strong>Elderly Individuals:</strong> Natural age-related loss of muscle mass (sarcopenia) may mask higher body fat levels within a "normal" BMI score.</li>
    <li><strong>Body Fat Distribution:</strong> Visceral fat around abdominal organs poses greater metabolic risk than subcutaneous fat on the hips and thighs, which BMI cannot detect.</li>
  </ul>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Does this BMI calculator apply to children and teenagers?</h4>
    <p>Adult BMI formulas apply to individuals aged 18 and older. For children and adolescents (ages 2 to 19), pediatricians use BMI-for-age growth percentiles from the WHO and CDC because body composition changes rapidly during growth.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How often should I measure my BMI?</h4>
    <p>Checking your BMI once every 1 to 3 months is generally recommended when pursuing fitness, nutrition, or weight management goals. Daily fluctuations are typically caused by hydration levels, sodium intake, and glycogen storage rather than fat changes.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Is BMI medical diagnosis?</h4>
    <p>No. BMI is an informational screening tool. For an accurate assessment of cardiovascular and metabolic wellness, consult a certified healthcare professional who can evaluate blood pressure, lipid profiles, waist-to-hip ratio, and family medical history.</p>
  </div>
</section>
"""

WORD_COUNTER_CONTENT = """
<section class="hg-guide-section">
  <h2>The Ultimate Guide to Word, Character, and Reading Time Analysis</h2>
  <p>
    Whether you are drafting an academic research paper, authoring a blog post, composing social media copy, or preparing a speech, word and character limits dictate clarity and engagement.
    <strong>HarshGuruJi's Word &amp; Character Counter</strong> provides instantaneous, real-time statistics on word counts, character lengths (with and without whitespace), sentence structures, and estimated reading speeds.
  </p>

  <h3>Standard Word Count Benchmarks Across Platforms</h3>
  <table>
    <thead>
      <tr>
        <th>Content Format</th>
        <th>Recommended Length</th>
        <th>Key Objective</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>SEO Blog Post</strong></td>
        <td>1,200 – 2,500 words</td>
        <td>Provides comprehensive topic coverage and satisfies search intent</td>
      </tr>
      <tr>
        <td><strong>X / Twitter Post</strong></td>
        <td>Up to 280 characters</td>
        <td>Concise, punchy messaging with maximum feed shareability</td>
      </tr>
      <tr>
        <td><strong>Meta Description</strong></td>
        <td>150 – 160 characters</td>
        <td>Displays fully on Google Search Engine Results Pages (SERPs)</td>
      </tr>
      <tr>
        <td><strong>Email Newsletter</strong></td>
        <td>200 – 500 words</td>
        <td>Maintains high open-to-click rates and respects subscriber attention</td>
      </tr>
      <tr>
        <td><strong>University Essay</strong></td>
        <td>1,500 – 3,000 words</td>
        <td>Meets academic grading criteria and thorough evidentiary analysis</td>
      </tr>
    </tbody>
  </table>

  <h3>How Reading and Speaking Times Are Estimated</h3>
  <p>
    Cognitive research demonstrates that the average adult reads comfortably at approximately <strong>200 to 250 words per minute (WPM)</strong> when reading silently.
    When presenting aloud at a podium or in a podcast, public speaking cadence slows to approximately <strong>130 to 150 words per minute</strong>.
    You can estimate presentation duration using these standard benchmarks:
  </p>
  <ul>
    <li><strong>5-Minute Speech:</strong> ~650 to 750 words</li>
    <li><strong>10-Minute Presentation:</strong> ~1,300 to 1,500 words</li>
    <li><strong>30-Minute Keynote:</strong> ~4,000 to 4,500 words</li>
  </ul>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Does this word counter store or log my text?</h4>
    <p>No. HarshGuruJi processes your text entirely in client memory within your web browser. Nothing is logged, transmitted, or saved to any external database.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How are hyphenated words counted?</h4>
    <p>Hyphenated terms such as "state-of-the-art" or "well-being" are standardly evaluated based on whitespace separators. Our algorithm adheres to international publishing standards to ensure compatibility with Microsoft Word and Google Docs.</p>
  </div>
</section>
"""

CASE_CONVERTER_CONTENT = """
<section class="hg-guide-section">
  <h2>Complete Guide: Typography and Programming Text Case Conversions</h2>
  <p>
    Text formatting and case conventions play a vital role in both written language and computer programming.
    Different operating systems, programming languages, and editorial style guides mandate specific casing rules.
    <strong>HarshGuruJi's Text Case Converter</strong> allows you to transform paragraphs, variables, and headlines between UPPERCASE, lowercase, Title Case, camelCase, PascalCase, and kebab-case with one click.
  </p>

  <h3>Common Casing Standards Explained</h3>
  <table>
    <thead>
      <tr>
        <th>Case Convention</th>
        <th>Example Output</th>
        <th>Typical Use Case</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>UPPERCASE</strong></td>
        <td><code>HELLO HARSHGURUJI</code></td>
        <td>Legal disclaimers, acronyms, and global constants in software</td>
      </tr>
      <tr>
        <td><strong>lowercase</strong></td>
        <td><code>hello harshguruji</code></td>
        <td>Email addresses, web URLs, CSS selectors, and data normalization</td>
      </tr>
      <tr>
        <td><strong>Title Case</strong></td>
        <td><code>Hello Harshguruji Community</code></td>
        <td>Book titles, magazine articles, and blog headline styling</td>
      </tr>
      <tr>
        <td><strong>camelCase</strong></td>
        <td><code>helloHarshgurujiCommunity</code></td>
        <td>JavaScript, Java, and TypeScript variable and function naming</td>
      </tr>
      <tr>
        <td><strong>PascalCase</strong></td>
        <td><code>HelloHarshgurujiCommunity</code></td>
        <td>C#, React component names, and TypeScript class definitions</td>
      </tr>
      <tr>
        <td><strong>kebab-case</strong></td>
        <td><code>hello-harshguruji-community</code></td>
        <td>Clean URL slugs, CSS class names, and Git branch identifiers</td>
      </tr>
    </tbody>
  </table>

  <h3>Why Automated Case Conversion Saves Time</h3>
  <p>
    Manually retyping accidentally capitalized sentences (e.g., caused by an accidental Caps Lock keypress) or converting API payloads to matching code conventions wastes valuable development time.
    Automated client-side conversion standardizes data clean-up while preventing human typographical errors.
  </p>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>What is the difference between Title Case and Sentence case?</h4>
    <p>In Sentence case, only the first letter of the first word and proper nouns are capitalized (just like a standard sentence). In Title Case, all major words (nouns, verbs, adjectives, adverbs) are capitalized while minor words (like "and", "or", "in", "to") remain in lowercase unless they start the headline.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Can this tool handle multilingual Unicode characters?</h4>
    <p>Yes. The tool supports standard UTF-8 and international character sets including accented letters (e.g., &eacute;, &ntilde;, &uuml;) and regional alphabets.</p>
  </div>
</section>
"""

PERCENTAGE_CONTENT = """
<section class="hg-guide-section">
  <h2>Comprehensive Guide: Everyday Percentage Calculations and Formulas</h2>
  <p>
    Percentages represent fractions of 100 and are among the most essential mathematical concepts utilized in daily life.
    From calculating retail discounts during sales events to computing sales tax (GST/VAT), loan interest rates, exam score ratios, and investment returns,
    understanding percentages is fundamental to personal finance and academic success.
    <strong>HarshGuruJi's Percentage Calculator</strong> delivers rapid, error-free results for all common percentage problems.
  </p>

  <h3>Core Percentage Formulas</h3>
  <ul>
    <li><strong>Standard Percentage:</strong> What is $P\%$ of $X$? &rarr; $\text{Result} = \frac{P}{100} \times X$</li>
    <li><strong>Percentage Ratio:</strong> What percentage is $X$ of $Y$? &rarr; $\text{Percentage} = (\frac{X}{Y}) \times 100$</li>
    <li><strong>Percentage Increase:</strong> $\text{Increase} = \frac{\text{New Value} - \text{Original Value}}{\text{Original Value}} \times 100$</li>
    <li><strong>Percentage Decrease:</strong> $\text{Decrease} = \frac{\text{Original Value} - \text{New Value}}{\text{Original Value}} \times 100$</li>
  </ul>

  <h3>Real-World Practical Examples</h3>
  <p>
    <strong>Example 1 (Shopping Discount):</strong> A jacket costs ₹2,500 with a 30% discount.
    <br>Discount amount = $(30 / 100) \times 2500 = ₹750$. Final price = $2500 - 750 = ₹1,750$.
  </p>
  <p>
    <strong>Example 2 (Academic Marks):</strong> A student scores 468 marks out of 600 in board exams.
    <br>Percentage = $(468 / 600) \times 100 = 78.0\%$.
  </p>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>What is the difference between percentage and percentile?</h4>
    <p>A percentage reflects a mathematical ratio out of 100 (e.g., 85% correct answers on a test). A percentile indicates relative standing within a group (e.g., scoring in the 90th percentile means you performed better than 90% of test participants, regardless of the raw score).</p>
  </div>
  <div class="hg-faq-item">
    <h4>How do I calculate percentage changes across multiple years?</h4>
    <p>Always base percentage calculations on the original starting value. Sequential percentage increases (such as +10% followed by +10%) do not simply add up to +20% due to compound scaling effects.</p>
  </div>
</section>
"""

JSON_FORMATTER_CONTENT = """
<section class="hg-guide-section">
  <h2>Complete Developer Guide: JSON Validation, Formatting, and Minification</h2>
  <p>
    <strong>JavaScript Object Notation (JSON)</strong> is the undisputed standard lightweight data-interchange format across modern web APIs, mobile backend services, cloud databases, and configuration files.
    Standardized under <strong>ECMA-404</strong> and <strong>RFC 8259</strong>, JSON is language-independent, human-readable, and machine-parseable.
    <strong>HarshGuruJi's JSON Formatter &amp; Validator</strong> allows engineers, students, and system administrators to validate syntax, prettify dense minified payloads, and compress data for high-speed network transmission.
  </p>

  <h3>Key Rules of Valid JSON Syntax</h3>
  <ul>
    <li><strong>Double Quotes for Keys:</strong> Object keys must always be enclosed in double quotes (e.g., <code>"username": "harsh"</code>). Single quotes are invalid.</li>
    <li><strong>No Trailing Commas:</strong> Commas must only separate elements. A comma after the final item in an array or object causes a parsing syntax error.</li>
    <li><strong>Supported Primitive Types:</strong> String, Number, Boolean (<code>true</code> / <code>false</code>), <code>null</code>, Object (<code>{}</code>), and Array (<code>[]</code>). Functions and <code>undefined</code> are not permitted.</li>
  </ul>

  <h3>Prettify vs. Minify: When to Use Which</h3>
  <p>
    <strong>Prettifying (Indenting):</strong> Introduces 2 or 4 spaces of indentation and newline characters. This makes complex nested structures easy for developers to read, inspect, and debug during software development.
  </p>
  <p>
    <strong>Minifying (Compressing):</strong> Strips all superfluous spaces, tabs, and newline breaks. This minimizes payload size, speeding up API responses and reducing bandwidth costs over production network connections.
  </p>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Why did my JSON fail validation?</h4>
    <p>Common causes include: unquoted keys, single quotes instead of double quotes, trailing commas at the end of lists, or unescaped newline characters inside strings.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Is it safe to paste private API responses into this formatter?</h4>
    <p>Yes. HarshGuruJi runs JSON parsing using native browser <code>JSON.parse()</code> and <code>JSON.stringify()</code> inside your local sandbox. No data is sent across the internet.</p>
  </div>
</section>
"""

TIC_TAC_TOE_CONTENT = """
<section class="hg-guide-section">
  <h2>The History, Mathematics, and Strategy of Tic-Tac-Toe</h2>
  <p>
    Tic-Tac-Toe (also known as Noughts and Crosses or Xs and Os) is one of the oldest known strategic paper-and-pencil games in human civilization.
    Variants of three-in-a-row games have been discovered carved into stone roofs in Ancient Egypt dating back to roughly 1300 BCE, as well as played in the Roman Empire under the name <em>Terni Lapilli</em>.
    Today, <strong>HarshGuruJi's Interactive Arcade</strong> offers this timeless game as an engaging brain exercise.
  </p>

  <h3>Game Rules and Objectives</h3>
  <p>
    The game is played on a 3&times;3 grid by two players who take turns placing their designated mark (typically 'X' and 'O') into empty squares.
    The first player to align three of their marks in a horizontal, vertical, or diagonal row achieves immediate victory.
    If all nine grid spaces are filled without either player completing a three-mark sequence, the match ends in a draw (often called "Cat's Game").
  </p>

  <h3>Game Theory and Optimal Strategy</h3>
  <p>
    In mathematical game theory, Tic-Tac-Toe is classified as a <strong>zero-sum, finite, perfect information game</strong>.
    With only 255,168 possible game states (or 26,830 when accounting for board rotations and reflections), a player who adheres to an optimal minimax strategy can never be defeated.
    Key strategic principles include:
  </p>
  <ul>
    <li><strong>Seize the Center:</strong> Playing the center square on Move 1 provides the highest number of potential winning vectors (4 rows/diagonals).</li>
    <li><strong>Control the Corners:</strong> Corner squares each intersect 3 winning lines, creating powerful fork opportunities where two winning threats can be established simultaneously.</li>
    <li><strong>Block Opponent Forks:</strong> Never allow an opponent to secure two unblocked lines of two marks each.</li>
  </ul>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Can Player 1 always win if they play first?</h4>
    <p>No. If Player 2 plays optimally, the game will always terminate in a draw. However, if Player 2 makes a suboptimal move in response to a corner or center opening, Player 1 can force a guaranteed win.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Why is Tic-Tac-Toe foundational in Computer Science education?</h4>
    <p>Because of its constrained state space, Tic-Tac-Toe is universally used in university artificial intelligence curricula to teach the Minimax algorithm and alpha-beta pruning before students advance to chess or go engines.</p>
  </div>
</section>
"""

SNAKE_CONTENT = """
<section class="hg-guide-section">
  <h2>The Iconic History and Mechanics of the Classic Snake Arcade Game</h2>
  <p>
    Few video games in history are as universally recognized as <strong>Snake</strong>.
    First originating in the 1976 arcade title <em>Blockade</em> by Gremlin Industries, the game achieved legendary worldwide fame when Finnish engineer Taneli Armanto programmed it onto the <strong>Nokia 6110</strong> mobile phone in 1997.
    That release introduced mobile gaming to hundreds of millions of users worldwide.
    <strong>HarshGuruJi's Arcade Edition</strong> recreates this nostalgic experience with modern canvas performance and smooth responsive controls.
  </p>

  <h3>Core Gameplay Dynamics</h3>
  <p>
    The player maneuvers a line (the "snake") around a bordered playing area.
    As the snake consumes randomly spawned food items, two events occur simultaneously:
  </p>
  <ul>
    <li>The player's score increases incrementally.</li>
    <li>The snake grows longer by one body segment, progressively restricting maneuvering space.</li>
  </ul>
  <p>
    The game terminates immediately if the snake collides with its own body or (in classic mode) crashes into the perimeter walls.
  </p>

  <h3>Tips for Achieving High Scores</h3>
  <ol>
    <li><strong>Embrace Perimeter Routing:</strong> Circumnavigate the outer walls to maintain a wide, clear path to the center of the board.</li>
    <li><strong>Create Zig-Zag Patterns:</strong> As your snake grows into dozens of segments, snake back and forth in tight "S" curves across the screen to conserve open territory.</li>
    <li><strong>Avoid Impulsive Turns:</strong> Look ahead at where the snake's tail will be in three moves before committing to a tight corridor.</li>
  </ol>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>What happens when the snake fills the entire screen?</h4>
    <p>If a player consumes enough food items so that the snake's body occupies every single coordinate on the grid, they achieve a theoretical "perfect victory" with the maximum possible score.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Can I play on touchscreen devices?</h4>
    <p>Yes. HarshGuruJi's snake implementation supports both desktop keyboard navigation (Arrow keys / WASD) and touch swipe gestures on mobile smartphones and tablets.</p>
  </div>
</section>
"""

MEMORY_CONTENT = """
<section class="hg-guide-section">
  <h2>Cognitive Science and Strategic Benefits of Memory Matching Games</h2>
  <p>
    Memory card matching (traditionally known as <em>Concentration</em>, <em>Pelmanism</em>, or <em>Pairs</em>) is a classic puzzle format with profound cognitive benefits.
    Players flip over pairs of hidden cards to find matching symbols.
    HarshGuruJi's Memory Challenge trains active working memory, visual-spatial processing, and focus across players of all ages.
  </p>

  <h3>Brain Benefits of Regular Memory Games</h3>
  <ul>
    <li><strong>Strengthens Working Memory:</strong> Active recall challenges the prefrontal cortex to store and quickly update card coordinates.</li>
    <li><strong>Improves Attention to Detail:</strong> Discerning subtle icon and color differences trains visual discrimination skills.</li>
    <li><strong>Enhances Spatial Reasoning:</strong> Mapping grid coordinates and mentally visualizing hidden cards builds spatial orientation networks.</li>
  </ul>

  <h3>Proven Memorization Techniques</h3>
  <p>
    Grandmaster memory competitors use the <strong>Method of Loci (Memory Palace)</strong> and categorical association to remember dozens of items.
    In 4&times;4 or 6&times;6 card matching:
  </p>
  <ol>
    <li>Group cards mentally into quadrants (Top-Left, Top-Right, Bottom-Left, Bottom-Right).</li>
    <li>Associate newly revealed symbols with a vivid mental story linking their grid row and column.</li>
    <li>Avoid randomly flipping cards; systematically explore rows to build a coherent spatial map.</li>
  </ol>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>How does this game measure performance?</h4>
    <p>Your performance is tracked through two primary metrics: the total number of moves (turns) taken to match all pairs, and the elapsed time. Achieving matches in fewer moves reflects superior spatial memory retention.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Is this game suitable for children and seniors?</h4>
    <p>Absolutely. Memory matching games are widely utilized in primary school learning centers and senior cognitive wellness programs to preserve brain agility and mental sharpness.</p>
  </div>
</section>
"""

ENRICHMENT_MAP = {
    os.path.join(TOOLS_DIR, "base64.html"): BASE64_CONTENT,
    os.path.join(TOOLS_DIR, "bmi-calculator.html"): BMI_CONTENT,
    os.path.join(TOOLS_DIR, "word-counter.html"): WORD_COUNTER_CONTENT,
    os.path.join(TOOLS_DIR, "case-converter.html"): CASE_CONVERTER_CONTENT,
    os.path.join(TOOLS_DIR, "percentage-calculator.html"): PERCENTAGE_CONTENT,
    os.path.join(TOOLS_DIR, "json-formatter.html"): JSON_FORMATTER_CONTENT,
    os.path.join(GAMES_DIR, "tic-tac-toe.html"): TIC_TAC_TOE_CONTENT,
    os.path.join(GAMES_DIR, "snake.html"): SNAKE_CONTENT,
    os.path.join(GAMES_DIR, "memory.html"): MEMORY_CONTENT,
}

def enrich_file(filepath, content_snippet):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    # If already enriched, skip
    if "hg-guide-section" in html:
        print(f"Already enriched: {filepath}")
        return

    # Add style snippet to head if not present
    if "hg-guide-section" not in html:
        if "</head>" in html:
            html = html.replace("</head>", STYLE_SNIPPET + "\n</head>", 1)

    # Insert content before </main> or </body>
    if "</main>" in html:
        html = html.replace("</main>", content_snippet + "\n</main>", 1)
    elif "</body>" in html:
        html = html.replace("</body>", content_snippet + "\n</body>", 1)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Successfully enriched: {filepath}")

def main():
    for fpath, snippet in ENRICHMENT_MAP.items():
        enrich_file(fpath, snippet)

if __name__ == "__main__":
    main()
