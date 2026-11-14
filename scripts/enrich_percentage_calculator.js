const fs = require('fs');
const path = require('path');

const guideHtml = `
<section class="hg-guide-section">
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M19 5L5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>
    Comprehensive Mathematical Guide: Percentage Calculations, Formulas & Finance
  </h2>
  <p>
    Derived from the Latin <em>per centum</em> (meaning "by the hundred"), percentages are a universal mathematical language for expressing ratios, proportions, financial returns, and relative changes. 
    Whether computing commercial retail discounts, assessing corporate profit margins, determining compound investment growth, or evaluating academic exam scores, mastering percentage mathematics is indispensable.
    The <strong>HarshGuruJi Percentage Calculator</strong> delivers instantaneous, precision-verified calculations across all standard mathematical and financial scenarios.
  </p>

  <div class="hg-trust-banner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <div>
      <strong>Precision Client-Side Execution:</strong> All numerical calculations run in your local browser sandbox with IEEE 754 double-precision floating-point accuracy. No financial data is ever transmitted over network connections.
    </div>
  </div>

  <h3>1. Core Formulas & Mathematical Derivations</h3>
  <div class="hg-guide-grid">
    <div class="hg-guide-card">
      <h4>1. What is P% of X?</h4>
      <div class="hg-formula-box">Result = (P / 100) &times; X</div>
      <p>Used to calculate sales tax, tipping, interest payments, or discounts. Example: 18% GST on a ₹4,000 service = <code>(18 / 100) &times; 4000 = ₹720</code>.</p>
    </div>
    <div class="hg-guide-card">
      <h4>2. X is What Percent of Y?</h4>
      <div class="hg-formula-box">Percentage = (X / Y) &times; 100</div>
      <p>Calculates proportions, such as exam performance or budget allocations. Example: 450 marks out of 500 = <code>(450 / 500) &times; 100 = 90%</code>.</p>
    </div>
    <div class="hg-guide-card">
      <h4>3. Percentage Change (Increase / Decrease)</h4>
      <div class="hg-formula-box">&Delta;% = [(V<sub>new</sub> - V<sub>old</sub>) / V<sub>old</sub>] &times; 100</div>
      <p>Measures inflation, stock price changes, or revenue growth. A positive result indicates growth; a negative result represents decline.</p>
    </div>
    <div class="hg-guide-card">
      <h4>4. Reverse Percentage (Original Price)</h4>
      <div class="hg-formula-box">V<sub>original</sub> = V<sub>final</sub> / [1 &plusmn; (P / 100)]</div>
      <p>Determines pre-tax price or initial cost before a discount was applied. If a discounted item costs $80 after a 20% sale: <code>80 / 0.8 = $100</code>.</p>
    </div>
  </div>

  <h3>2. Essential Finance: Profit Margin vs. Markup Explained</h3>
  <p>
    In commerce, business owners frequently confuse <strong>Margin</strong> and <strong>Markup</strong>, which can lead to severe pricing mistakes:
  </p>
  <ul>
    <li><strong>Markup:</strong> The percentage added to the wholesale cost to reach the selling price. 
      <br><code>Markup % = [(Selling Price - Cost) / Cost] &times; 100</code>. If an item costs ₹100 and sells for ₹150, markup is <strong>50%</strong>.
    </li>
    <li><strong>Profit Margin:</strong> The percentage of the final selling price that constitutes profit. 
      <br><code>Margin % = [(Selling Price - Cost) / Selling Price] &times; 100</code>. On the same item, margin is <code>(50 / 150) &times; 100 = <strong>33.33%</strong></code>.
    </li>
  </ul>

  <h3>3. Quick Reference: Fractions, Decimals, and Percentages</h3>
  <div class="hg-table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Common Fraction</th>
          <th>Decimal Equivalent</th>
          <th>Percentage</th>
          <th>Practical Rule of Thumb</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1 / 2</strong></td>
          <td>0.500</td>
          <td>50.0%</td>
          <td>Divide by 2</td>
        </tr>
        <tr>
          <td><strong>1 / 3</strong></td>
          <td>0.333...</td>
          <td>33.33%</td>
          <td>Divide by 3</td>
        </tr>
        <tr>
          <td><strong>1 / 4</strong></td>
          <td>0.250</td>
          <td>25.0%</td>
          <td>Divide by 4 (or half of 50%)</td>
        </tr>
        <tr>
          <td><strong>1 / 5</strong></td>
          <td>0.200</td>
          <td>20.0%</td>
          <td>Multiply by 2 and move decimal left one place</td>
        </tr>
        <tr>
          <td><strong>1 / 8</strong></td>
          <td>0.125</td>
          <td>12.5%</td>
          <td>Half of 25%</td>
        </tr>
        <tr>
          <td><strong>1 / 10</strong></td>
          <td>0.100</td>
          <td>10.0%</td>
          <td>Shift decimal point left by one digit</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Why do two consecutive 10% discounts not equal a 20% discount?</h4>
    <p>Sequential discounts apply multiplicatively rather than additively. If a ₹1,000 item receives a 10% discount, its price becomes ₹900. An additional 10% discount is then calculated on ₹900 (₹90 reduction), resulting in a final price of ₹810—which equals an effective overall discount of <strong>19%</strong>, not 20%.</p>
  </div>
  <div class="hg-faq-item">
    <h4>What is the difference between a percentage and a percentage point?</h4>
    <p>A percentage reflects relative proportion, while a percentage point measures the arithmetic difference between two percentages. For instance, if a central bank increases interest rates from 4% to 5%, the rate increased by <strong>1 percentage point</strong>, but the relative increase in borrowing costs is <strong>25%</strong> (<code>(5 - 4) / 4 = 0.25</code>).</p>
  </div>
  <div class="hg-faq-item">
    <h4>How do I calculate GST or VAT included in a total receipt?</h4>
    <p>To extract tax from a gross amount: <code>Tax Amount = Gross Total - [Gross Total / (1 + (Tax Rate / 100))]</code>. For example, in a ₹1,180 receipt with 18% GST: <code>1,180 / 1.18 = ₹1,000 base price</code>, meaning exactly ₹180 was GST.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Does this calculator round numbers automatically?</h4>
    <p>Results are formatted to two decimal places for currency and general clarity, while preserving full IEEE 754 double precision in memory during intermediate mathematical operations.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Can percentages be greater than 100%?</h4>
    <p>Yes. Any growth exceeding the baseline value results in a percentage greater than 100%. For example, if a company's revenue doubles from $1M to $2M, it achieved a 100% increase; if it triples to $3M, it achieved a 200% increase.</p>
  </div>
</section>
`;

const schemaJson = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why do two consecutive 10% discounts not equal a 20% discount?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sequential discounts apply multiplicatively to the reduced subtotal. A 10% discount followed by another 10% discount results in an effective 19% total discount."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a percentage and a percentage point?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A percentage measures relative change, whereas a percentage point measures the direct arithmetic difference between two percentage values."
      }
    },
    {
      "@type": "Question",
      "name": "How do I calculate GST or VAT included in a total receipt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Divide the gross total by (1 + Tax Rate / 100) to find the pre-tax base price, then subtract the base price from the gross total."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between profit margin and markup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Markup is profit divided by cost, whereas profit margin is profit divided by revenue (selling price)."
      }
    },
    {
      "@type": "Question",
      "name": "Can percentages be greater than 100%?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. When a new value is more than double the starting baseline, the growth rate exceeds 100%."
      }
    }
  ]
};

const schemaScript = `  <script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n  </script>\n`;

const files = [
  path.join(__dirname, '../tools/percentage-calculator.html'),
  path.join(__dirname, '../tools/percentage-calculator/index.html')
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
