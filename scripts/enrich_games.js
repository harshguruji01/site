const fs = require('fs');
const path = require('path');

// ==========================================
// 1. MEMORY MATCH GAME ENRICHMENT
// ==========================================
const memoryGuide = `
<section class="hg-guide-section">
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
    Complete Guide: The Cognitive Neuroscience &amp; Psychology of Memory Games
  </h2>
  <p>
    Card matching, also historically known as <em>Pelmanism</em> or <em>Pairs</em>, is more than an entertaining casual puzzle; it is a scientifically validated cognitive training exercise. 
    By requiring players to encode, store, and rapidly retrieve visual-spatial coordinates under working memory constraints, the game stimulates key neural pathways in the human brain.
    The <strong>HarshGuruJi Memory Match Game</strong> delivers a clean, responsive, browser-based brain training environment with zero installation and complete privacy.
  </p>

  <div class="hg-trust-banner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <div>
      <strong>Pure Client-Side Play:</strong> Game logic, shuffle randomization, and move counters run 100% locally in your browser memory. Play offline without network lag or tracking scripts.
    </div>
  </div>

  <h3>1. Working Memory &amp; Miller's Law (7 &plusmn; 2)</h3>
  <p>
    In 1956, Harvard cognitive psychologist George A. Miller published his landmark paper, <em>"The Magical Number Seven, Plus or Minus Two: Some Limits on Our Capacity for Processing Information."</em> 
    Miller demonstrated that human short-term working memory can hold approximately <strong>5 to 9 discrete information chunks</strong> simultaneously.
    In a standard 16-card (8-pair) grid, the game deliberately pushes past the unassisted capacity of short-term memory, forcing the brain to employ <em>chunking</em> and spatial indexing strategies to succeed.
  </p>

  <h3>2. Historical Origins: From 12th-Century Heian Japan to Modern Pelmanism</h3>
  <p>
    The roots of memory matching date back centuries:
  </p>
  <ul>
    <li><strong>Kai-awase (Japan, 12th Century):</strong> Aristocrats in Heian period Japan matched 360 pairs of hand-painted clam shells featuring classical waka poems and seasonal motifs.</li>
    <li><strong>The Pelman System (United Kingdom, 1899):</strong> Founded by Christopher Louis Pelman, the Pelman Institute promoted card-pairing exercises across Britain to build mental discipline, giving rise to the modern name "Pelmanism."</li>
    <li><strong>Digital Puzzle Renaissance:</strong> In the 1980s and 1990s, memory match transitioned to microcomputers and handheld consoles, becoming a staple tool in pediatric education and neuropsychological therapy.</li>
  </ul>

  <h3>3. Proven Strategies for Minimum Move Scores</h3>
  <div class="hg-guide-grid">
    <div class="hg-guide-card">
      <h4>Spatial Chunking</h4>
      <p>Divide the 4&times;4 grid into four distinct quadrants (Top-Left, Top-Right, Bottom-Left, Bottom-Right). Associating cards with relative quadrant coordinates reduces mental cognitive load.</p>
    </div>
    <div class="hg-guide-card">
      <h4>Systematic Scanning</h4>
      <p>Never flip cards randomly. Open cards in orderly row-by-row sweeps. When a matching twin was observed previously, your spatial map immediately connects both coordinates.</p>
    </div>
    <div class="hg-guide-card">
      <h4>Method of Loci (Memory Palace)</h4>
      <p>Connect revealed emojis into a rapid narrative thread (e.g. "The 🚀 rocket landed on the 💎 diamond in the top corner"). Narrative encoding engages episodic memory centers.</p>
    </div>
    <div class="hg-guide-card">
      <h4>Neuroplasticity Benefits</h4>
      <p>Regular visual-spatial recall exercises promote synaptogenesis in the prefrontal cortex, helping sharpen daily focus, reaction speed, and attention to detail across all ages.</p>
    </div>
  </div>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>What is the minimum number of moves mathematically required to win?</h4>
    <p>In an 8-pair (16-card) game, the absolute theoretical minimum is <strong>8 moves</strong> (if you achieve perfect lucky matches on every single turn). Under realistic optimal play where you systematically reveal each card, an expert score ranges between <strong>10 and 14 moves</strong>.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Does playing memory games help prevent age-related cognitive decline?</h4>
    <p>Clinical studies in neuropsychology indicate that regular engagement in working-memory tasks and puzzle solving helps build cognitive reserve, supporting neuroplasticity and maintaining executive brain function in older adults.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Can this game be played on mobile touchscreen devices?</h4>
    <p>Yes. The HarshGuruJi Memory Match interface is built with responsive CSS Grid and touch-optimized tap targets, ensuring fluid animations and responsive gameplay on iOS, Android, and desktop browsers alike.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How does the card shuffle algorithm work?</h4>
    <p>The card deck is randomized at the start of each round using the Fisher-Yates (Knuth) shuffle algorithm, ensuring an unbiased uniform distribution where every card configuration has equal statistical probability.</p>
  </div>
</section>
`;

const memorySchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the minimum number of moves mathematically required to win Memory Match?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The theoretical minimum is 8 moves with perfect lucky matches. Under optimal systematic strategy, expert scores range between 10 and 14 moves."
      }
    },
    {
      "@type": "Question",
      "name": "How does playing memory games benefit the brain?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Card matching exercises challenge the prefrontal cortex, enhancing short-term working memory capacity, visual discrimination, and spatial reasoning."
      }
    },
    {
      "@type": "Question",
      "name": "What is the historical origin of the memory matching card game?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The game traces back to 12th-century Japanese Kai-awase clam-matching and 19th-century British Pelmanism exercises developed for mental agility."
      }
    }
  ]
};

// ==========================================
// 2. SNAKE GAME ENRICHMENT
// ==========================================
const snakeGuide = `
<section class="hg-guide-section">
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
    Complete Guide: History, Game Theory &amp; Algorithms of the Classic Snake Game
  </h2>
  <p>
    The classic Snake game is one of the most recognizable and enduring arcade video game concepts in computing history. 
    Combining intuitive mechanics with escalating spatial tension, Snake challenges players to maneuver a constantly growing serpent across a bounded 2D grid while collecting food items and avoiding fatal collisions with perimeter walls or its own expanding tail.
    The <strong>HarshGuruJi Retro Snake Game</strong> recreates the vintage arcade experience with modern HTML5 Canvas rendering, ultra-responsive keyboard and touch controls, and zero latency.
  </p>

  <div class="hg-trust-banner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <div>
      <strong>High-Performance Canvas Engine:</strong> Rendered in pure client-side JavaScript at 60 FPS using <code>requestAnimationFrame</code>. Smooth input response with zero server overhead.
    </div>
  </div>

  <h3>1. The Evolution of Snake: From 1976 Arcade to 350 Million Nokia Phones</h3>
  <p>
    The design evolution of Snake spans four decades of computer entertainment:
  </p>
  <ul>
    <li><strong>Blockade (1976):</strong> The original monochrome arcade game developed by Gremlin Industries featured two players creating trailing walls, inspiring the light-cycle sequence in Disney's <em>Tron</em> (1982).</li>
    <li><strong>Worm (1978–1983):</strong> Peter Trefonas coded a single-player version for the TRS-80, establishing the mechanic of eating food to grow the player's tail length.</li>
    <li><strong>Nokia 6110 (1997):</strong> Programmed by Nokia design engineer Taneli Armanto, <em>Snake</em> was preloaded onto Nokia mobile handsets, introducing over 350 million users worldwide to mobile gaming.</li>
  </ul>

  <h3>2. Mathematical Game Theory: The Unbeatable Hamiltonian Cycle</h3>
  <p>
    Can Snake be played perfectly to completely fill an entire grid without ever crashing? In graph theory mathematics, the answer is <strong>yes</strong> through a <strong>Hamiltonian Cycle</strong>.
  </p>
  <div class="hg-formula-box">
    Hamiltonian Cycle: A closed graph loop visiting every vertex V &isin; G exactly once.
  </div>
  <p>
    If an $N \times M$ grid contains an even number of total cells (e.g., $20 \times 20 = 400$ cells), there exists a continuous closed cycle that snakes back and forth across every single coordinate before returning to the origin. 
    By strictly adhering to a pre-mapped Hamiltonian path, a player (or AI autonomous agent) is mathematically guaranteed to reach the maximum theoretical score without colliding with its own body, regardless of where food items randomly spawn!
  </p>

  <h3>3. AI Pathfinding Algorithms in Snake</h3>
  <div class="hg-guide-grid">
    <div class="hg-guide-card">
      <h4>Breadth-First Search (BFS)</h4>
      <p>BFS identifies the shortest path from the snake's head to the food coordinate. While fast, naive BFS often traps the snake in a dead-end pocket when its tail is long.</p>
    </div>
    <div class="hg-guide-card">
      <h4>A* (A-Star) Search</h4>
      <p>Uses Manhattan distance heuristics: $h(n) = |x_1 - x_2| + |y_1 - y_2|$ to navigate towards food while keeping a viable escape path to the moving tail.</p>
    </div>
    <div class="hg-guide-card">
      <h4>Tail Chasing Safety Rule</h4>
      <p>When no safe direct route to food exists without self-entrapment, the safest algorithm guides the head toward its own trailing tail tip, guaranteeing space until new lanes open.</p>
    </div>
    <div class="hg-guide-card">
      <h4>Reflex &amp; Spatial Training</h4>
      <p>For human players, high-speed Snake exercises peripheral visual scanning, fine motor reflexes, and forward-looking spatial contingency planning.</p>
    </div>
  </div>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>What controls are supported in this Snake game?</h4>
    <p>You can steer the snake using standard keyboard Arrow Keys (&uarr;, &darr;, &larr;, &rarr;) or desktop gamer WASD keys (W, A, S, D). On mobile devices, dedicated touch directional buttons provide seamless navigation.</p>
  </div>
  <div class="hg-faq-item">
    <h4>What happens when the snake touches the edge of the board?</h4>
    <p>In standard arcade tournament rules, the outer boundaries are solid walls. Crashing into the perimeter or colliding with the snake's own tail immediately terminates the run, logging your final score and length.</p>
  </div>
  <div class="hg-faq-item">
    <h4>How does the game increase in difficulty as you score?</h4>
    <p>Each collected food item elongates the serpent by one segment, reducing available free grid space and demanding tighter turning radiuses and higher forward spatial planning.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Is my high score saved?</h4>
    <p>Yes. Your personal highest score is automatically recorded in your browser's private LocalStorage sandbox, preserving your record between gaming sessions without requiring an account.</p>
  </div>
</section>
`;

const snakeSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the Hamiltonian Cycle strategy in the Snake game?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Hamiltonian Cycle is a closed loop visiting every grid cell exactly once. Following this path guarantees winning the game with the maximum possible score without collisions."
      }
    },
    {
      "@type": "Question",
      "name": "Who created the original mobile phone Snake game?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nokia engineer Taneli Armanto programmed the legendary Snake game for the Nokia 6110 in 1997."
      }
    },
    {
      "@type": "Question",
      "name": "What controls can I use to play Retro Snake on HarshGuruJi?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can use Keyboard Arrow Keys, WASD keys, or mobile touchscreen buttons for smooth 60 FPS steering."
      }
    }
  ]
};

// ==========================================
// 3. TIC-TAC-TOE GAME ENRICHMENT
// ==========================================
const tictactoeGuide = `
<section class="hg-guide-section">
  <h2>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
    Complete Guide: Game Theory, Minimax Algorithm &amp; Strategy in Tic-Tac-Toe
  </h2>
  <p>
    Tic-Tac-Toe (also known internationally as <em>Noughts and Crosses</em> or <em>Xs and Os</em>) is a classic two-player zero-sum sequential game played on a $3 \times 3$ grid. 
    Despite its straightforward objective—being the first to align three identical marks horizontally, vertically, or diagonally—the game serves as an indispensable teaching foundation in combinatorial game theory, discrete mathematics, and artificial intelligence heuristic search.
    The <strong>HarshGuruJi Tic-Tac-Toe Classic</strong> provides instantaneous, ad-free play featuring unbeatable AI algorithms and local two-player pass-and-play modes.
  </p>

  <div class="hg-trust-banner">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <div>
      <strong>Unbeatable Minimax AI Engine:</strong> AI move selection evaluates the entire game tree in client memory in under 2 milliseconds, guaranteeing mathematically optimal defense and offense.
    </div>
  </div>

  <h3>1. History &amp; Archaeological Origins: From Ancient Egypt to EDSAC 1952</h3>
  <p>
    Tic-Tac-Toe is among humanity's oldest documented structured games:
  </p>
  <ul>
    <li><strong>Ancient Egypt (1300 BCE):</strong> Archaeological excavations at Kurna have revealed three-in-a-row game boards inscribed directly into temple roof slates.</li>
    <li><strong>The Roman Empire (Terni Lapilli):</strong> Romans played an identical game using three pebbles on intersecting grid lines carved into public pavements and forum stones across the Empire.</li>
    <li><strong>OXO &amp; Early Computing (1952):</strong> British computer scientist Alexander S. Douglas wrote <em>OXO</em> for the Cambridge EDSAC mainframe computer as part of his doctoral dissertation, creating one of the earliest interactive video games in human history.</li>
  </ul>

  <h3>2. Combinatorial Game Theory: Why Tic-Tac-Toe Is a "Solved Game"</h3>
  <p>
    In applied game theory, Tic-Tac-Toe is classified as a <strong>finite, sequential, zero-sum game of perfect information</strong>. 
    Because both players observe all moves with zero hidden variables or dice rolls, the game is mathematically <em>solved</em>:
  </p>
  <div class="hg-formula-box">
    Total Possible Game Board Permutations: 9! = 362,880 moves
    <br>Distinct Legal Board Configurations: 5,478 states (765 considering rotational symmetry)
  </div>
  <p>
    Mathematical analysis proves that when both participants play rationally without tactical mistakes, <strong>the outcome is always a forced draw (cat's game)</strong>. Neither player possesses a guaranteed winning advantage.
  </p>

  <h3>3. The Minimax Decision Algorithm Explained</h3>
  <p>
    The HarshGuruJi intelligent AI opponent uses the classic <strong>Minimax Decision Rule</strong> to pick moves. 
    The algorithm constructs a recursive game tree exploring every possible continuation to terminal leaves:
  </p>
  <ul>
    <li><strong>Maximizing Player (AI):</strong> Strives to choose the move with the highest utility score ($+10$ for an AI win).</li>
    <li><strong>Minimizing Player (Human):</strong> Assumed to play optimally to produce the lowest score ($-10$ for a human win).</li>
    <li><strong>Tie Game:</strong> Terminal board leaves with no three-in-a-row achieve a utility score of $0$.</li>
  </ul>

  <h3>4. The Unbeatable Human Strategy Guide</h3>
  <div class="hg-guide-grid">
    <div class="hg-guide-card">
      <h4>1. Opening in a Corner</h4>
      <p>Playing in a corner on turn 1 provides the highest probability of winning against casual opponents, creating traps that demand strict center counter-play.</p>
    </div>
    <div class="hg-guide-card">
      <h4>2. Defending the Center</h4>
      <p>If your opponent plays in a corner first, you <em>must</em> place your mark in the absolute center cell to prevent an immediate double-threat fork.</p>
    </div>
    <div class="hg-guide-card">
      <h4>3. Creating a Fork (Double Threat)</h4>
      <p>A fork creates two non-intersecting winning opportunities simultaneously, making it mathematically impossible for your opponent to block both lines on their turn.</p>
    </div>
    <div class="hg-guide-card">
      <h4>4. Blocking Opponent Forks</h4>
      <p>If your opponent threatens a fork, force them onto defense by creating an immediate two-in-a-row threat on an edge cell that they are compelled to block.</p>
    </div>
  </div>

  <h2>Frequently Asked Questions (FAQ)</h2>
  <div class="hg-faq-item">
    <h4>Can the AI opponent in this game ever be defeated?</h4>
    <p>In Hard / Expert mode, the AI evaluates the complete Minimax game tree with zero search depth limits. Because Tic-Tac-Toe is mathematically a solved draw under optimal play, you cannot defeat the AI; the best possible human result is a draw.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Why is a tie game in Tic-Tac-Toe called a "Cat's Game"?</h4>
    <p>The phrase originates from traditional playground folklore where a cat chases its own tail in circles without catching it, symbolizing a grid that is completely full with no winner.</p>
  </div>
  <div class="hg-faq-item">
    <h4>Can two people play against each other on the same screen?</h4>
    <p>Yes. The game includes a Pass-and-Play mode allowing two friends to alternate turns on the same touchscreen phone, tablet, or laptop keyboard.</p>
  </div>
</section>
`;

const tictactoeSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can you beat an AI that uses the Minimax algorithm in Tic-Tac-Toe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Tic-Tac-Toe is a solved game. An AI utilizing the full Minimax tree will always force a win or a draw, making it impossible to defeat."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best opening move in Tic-Tac-Toe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Opening in one of the four corners yields the highest strategic win probability, setting up multi-threat fork opportunities."
      }
    },
    {
      "@type": "Question",
      "name": "What is a 'Cat's Game' in Tic-Tac-Toe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Cat's Game refers to a tied match where all 9 squares are filled with no player achieving three in a row."
      }
    }
  ]
};

// ==========================================
// FILE APPLICATION RUNNER
// ==========================================
const updates = [
  {
    files: [
      path.join(__dirname, '../games/memory.html'),
      path.join(__dirname, '../games/memory/index.html')
    ],
    guide: memoryGuide,
    schema: memorySchema
  },
  {
    files: [
      path.join(__dirname, '../games/snake.html'),
      path.join(__dirname, '../games/snake/index.html')
    ],
    guide: snakeGuide,
    schema: snakeSchema
  },
  {
    files: [
      path.join(__dirname, '../games/tic-tac-toe.html'),
      path.join(__dirname, '../games/tic-tac-toe/index.html')
    ],
    guide: tictactoeGuide,
    schema: tictactoeSchema
  }
];

for (const u of updates) {
  const schemaScript = `  <script type="application/ld+json">\n${JSON.stringify(u.schema, null, 2)}\n  </script>\n`;
  for (const file of u.files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    const regexGuide = /<section class="hg-guide-section">[\s\S]*?<\/section>/i;
    if (regexGuide.test(content)) {
      content = content.replace(regexGuide, u.guide.trim());
    } else {
      content = content.replace('</main>', u.guide.trim() + '\n</main>');
    }
    if (!content.includes('"@type": "FAQPage"')) {
      content = content.replace('</head>', schemaScript + '</head>');
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Enriched ' + file);
  }
}
