/**
 * universe-rooms.js - WebGuruJi Dedicated 3D Rooms & Interactive Spatial Systems
 * Powers AI Room, Tool Matrix, Gaming Arena, Digital Classroom, Store, Profile, Search & Daily Special.
 */

(function () {
  'use strict';

  // Fallback data registries in case individual scripts didn't load first
  const REAL_AI_TOOLS = window.aiToolsData || [
    { name: "ChatGPT", category: "AI Chat", desc: "Advanced conversational AI by OpenAI.", link: "https://chatgpt.com", icon: "🤖" },
    { name: "Claude", category: "AI Chat", desc: "Next-gen AI assistant by Anthropic.", link: "https://claude.ai", icon: "🧠" },
    { name: "Gemini", category: "AI Chat", desc: "Google's most capable multimodal model.", link: "https://gemini.google.com", icon: "✨" },
    { name: "Midjourney", category: "AI Image", desc: "State-of-the-art visual generator.", link: "https://www.midjourney.com", icon: "🎨" },
    { name: "GitHub Copilot", category: "AI Coding", desc: "Your AI pair programmer.", link: "https://github.com/features/copilot", icon: "💻" },
    { name: "Cursor", category: "AI Coding", desc: "The AI-first code editor.", link: "https://cursor.sh", icon: "⚡" },
    { name: "Perplexity", category: "AI Research", desc: "AI-powered cited answer engine.", link: "https://www.perplexity.ai", icon: "🔍" },
    { name: "Synthesia", category: "AI Video", desc: "Create professional AI videos.", link: "https://www.synthesia.io", icon: "🎬" }
  ];

  const REAL_TOOLS = window.toolData || [
    { id: "word-counter", name: "Word Counter", category: "Text Tools", desc: "Instantly count words, characters, and sentences.", route: "tools/word-counter.html", icon: "📝" },
    { id: "case-converter", name: "Case Converter", category: "Text Tools", desc: "Convert text to UPPERCASE, lowercase, Title Case.", route: "tools/case-converter.html", icon: "🔤" },
    { id: "password-gen", name: "Password Generator", category: "Generators", desc: "Generate highly secure random passwords.", route: "tools/password-generator.html", icon: "🔐" },
    { id: "json-format", name: "JSON Formatter", category: "Developer Tools", desc: "Format, beautify and validate JSON instantly.", route: "tools/json-formatter.html", icon: "⚙️" },
    { id: "base64", name: "Base64 Encoder", category: "Developer Tools", desc: "Encode or decode Base64 strings locally.", route: "tools/base64.html", icon: "🔒" }
  ];

  const REAL_GAMES = window.gameData || [
    { name: "Snake Classic", genre: "Arcade", desc: "Retro arcade snake. Eat food and avoid walls.", route: "games/snake.html", icon: "🐍" },
    { name: "Memory Match", genre: "Puzzle", desc: "Test your memory and match all card pairs.", route: "games/memory.html", icon: "🎴" },
    { name: "Tic Tac Toe", genre: "Board", desc: "Classic 3x3 strategic grid battle.", route: "games/tic-tac-toe.html", icon: "❌" },
    { name: "Minecraft", genre: "Survival", desc: "Explore infinite blocky worlds.", route: "https://www.minecraft.net/", icon: "⛏️" },
    { name: "Counter-Strike 2", genre: "Action", desc: "Elite competitive tactical shooter.", route: "https://www.counter-strike.net/", icon: "🎯" }
  ];

  const REAL_APPS = window.MOCK_APPS || [
    { name: "Telegram", category: "Communication", desc: "Fast and secure cloud-based messaging.", platform: "Android / Windows", link: "https://telegram.org/", icon: "✈️" },
    { name: "Visual Studio Code", category: "Development", desc: "Code editing redefined. Free & open source.", platform: "Windows / Mac / Linux", link: "https://code.visualstudio.com/", icon: "💻" },
    { name: "Claude", category: "AI Assistant", desc: "Anthropic desktop and mobile assistant.", platform: "All Platforms", link: "https://claude.ai", icon: "🤖" },
    { name: "OBS Studio", category: "Media", desc: "Free and open source software for video recording and live streaming.", platform: "Windows / Mac", link: "https://obsproject.com/", icon: "📹" },
    { name: "Blender", category: "3D Design", desc: "Open source 3D creation suite.", platform: "Windows / Linux / Mac", link: "https://www.blender.org/", icon: "🎨" }
  ];

  // DOM Elements
  let roomsContainer;
  let searchOverlay;
  let gameModal;
  let toastContainer;

  function init() {
    roomsContainer = document.getElementById('universe-rooms-overlay');
    searchOverlay = document.getElementById('universe-search-overlay');
    toastContainer = document.getElementById('universe-toasts');

    setupCustomCursor();
    setupDockListeners();
    setupAIRoom();
    setupToolsRoom();
    setupGamingRoom();
    setupLearningRoom();
    setupStoreRoom();
    setupProfileRoom();
    setupDailySpecialRoom();
    setupSearchGateway();
  }

  // Custom 3D Cursor
  function setupCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let dot = document.querySelector('.cyber-cursor-dot');
    let ring = document.querySelector('.cyber-cursor-ring');

    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'cyber-cursor-dot';
      document.body.appendChild(dot);
    }
    if (!ring) {
      ring = document.createElement('div');
      ring.className = 'cyber-cursor-ring';
      document.body.appendChild(ring);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function loopCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(loopCursor);
    }
    loopCursor();

    document.querySelectorAll('button, a, input, .holo-card, .dock-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // Toast System
  function showToast(msg, icon = '✦') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'spatial-toast';
    toast.innerHTML = `<span style="color:var(--u-cyan);">${icon}</span> <span>${msg}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // Show specific room
  function showRoom(roomId) {
    if (roomId === 'search') {
      openSearchGateway();
      return;
    }

    closeSearchGateway();

    document.querySelectorAll('.universe-room').forEach(r => {
      r.classList.remove('active');
    });

    if (roomId === 'UNIVERSE') {
      return; // Central overview has no blocking room overlay
    }

    const targetRoom = document.getElementById(`room-${roomId}`);
    if (targetRoom) {
      targetRoom.classList.add('active');
    }
  }

  // Setup Dock and Return Buttons
  function setupDockListeners() {
    document.querySelectorAll('.dock-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const room = btn.getAttribute('data-room');
        if (window.UniverseEngine) {
          window.UniverseEngine.navigateToRoom(room);
        }
      });
    });

    document.querySelectorAll('.btn-orbit-return').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.UniverseEngine) {
          window.UniverseEngine.navigateToRoom('UNIVERSE');
        }
      });
    });
  }

  // 1. AI ROOM SETUP
  function setupAIRoom() {
    const chatFeed = document.getElementById('ai-chat-feed');
    const input = document.getElementById('ai-input-field');
    const sendBtn = document.getElementById('btn-ai-send');
    const chips = document.querySelectorAll('.prompt-chip');
    const ttsToggle = document.getElementById('ai-tts-toggle');
    let ttsEnabled = false;

    if (ttsToggle) {
      ttsToggle.addEventListener('click', () => {
        ttsEnabled = !ttsEnabled;
        ttsToggle.classList.toggle('active', ttsEnabled);
        showToast(ttsEnabled ? "AI Voice Synthesis Enabled" : "AI Voice Muted", "🎙️");
      });
    }

    function appendMessage(sender, text) {
      if (!chatFeed) return;
      const bubble = document.createElement('div');
      bubble.className = `ai-bubble ${sender}`;
      bubble.innerHTML = text;
      chatFeed.appendChild(bubble);
      chatFeed.scrollTop = chatFeed.scrollHeight;

      if (sender === 'assistant' && ttsEnabled && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/<[^>]*>/g, '');
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }
    }

    async function handleAISubmit() {
      if (!input) return;
      const query = input.value.trim();
      if (!query) return;

      input.value = '';
      appendMessage('user', query);

      if (window.UniverseEngine) {
        window.UniverseEngine.setAICoreState('listening');
      }

      // Typing indicator
      const typingBubble = document.createElement('div');
      typingBubble.className = 'ai-bubble assistant';
      typingBubble.innerHTML = '<em>GuruJi AI is processing knowledge vectors...</em>';
      chatFeed.appendChild(typingBubble);
      chatFeed.scrollTop = chatFeed.scrollHeight;

      setTimeout(() => {
        if (window.UniverseEngine) {
          window.UniverseEngine.setAICoreState('processing');
        }
      }, 400);

      // Real query via Wikipedia API fallback with educational summary
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          typingBubble.remove();
          if (data.extract) {
            appendMessage('assistant', `<strong>${data.title}</strong>: ${data.extract} <br><br><small style="color:var(--u-cyan);">Source: GuruJi Verified Knowledge Base</small>`);
          } else {
            generateContextualAIResponse(query, typingBubble);
          }
        } else {
          generateContextualAIResponse(query, typingBubble);
        }
      } catch (e) {
        generateContextualAIResponse(query, typingBubble);
      }

      if (window.UniverseEngine) {
        setTimeout(() => window.UniverseEngine.setAICoreState('response'), 1000);
        setTimeout(() => window.UniverseEngine.setAICoreState('idle'), 3500);
      }
    }

    function generateContextualAIResponse(query, typingBubble) {
      typingBubble.remove();
      const q = query.toLowerCase();
      let reply = "Hello! I am GuruJi AI in the HarshGuruJi Digital Universe. I am here to assist you with learning, mathematics, tools, coding, and scientific curiosity!";

      if (q.includes('photo') || q.includes('plant')) {
        reply = "Photosynthesis is the miraculous biochemical process where green plants, algae, and cyanobacteria transform sunlight, water, and CO₂ into chemical energy (glucose) and oxygen. Formula: <strong>6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂</strong> 🌱";
      } else if (q.includes('ai') || q.includes('tool')) {
        reply = "You can explore over 50+ cutting-edge AI tools right here in our <strong>AI Tools Matrix</strong>, including ChatGPT, Claude, Cursor, Midjourney, and Gemini! Switch tabs on the right to browse by category.";
      } else if (q.includes('harsh') || q.includes('webguruji') || q.includes('who are you')) {
        reply = "Welcome to <strong>HARSHGURUJI (WebGuruJi)</strong>! Our mission is to provide accessible, futuristic educational tools, software utilities, daily insights, and AI companions for curious minds worldwide.";
      } else {
        reply = `Interesting question about "${query}"! In the HarshGuruJi knowledge matrix, continuous curiosity is the key to deep mastery. Feel free to explore our Tools Room, Learning Classroom, and Daily Special insights for more!`;
      }
      appendMessage('assistant', reply);
    }

    if (sendBtn) sendBtn.addEventListener('click', handleAISubmit);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAISubmit();
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (input) {
          input.value = chip.textContent;
          handleAISubmit();
        }
      });
    });

    // Populate AI Directory Grid
    renderAITools(REAL_AI_TOOLS);
  }

  function renderAITools(tools) {
    const grid = document.getElementById('ai-tools-grid');
    if (!grid) return;
    grid.innerHTML = '';

    tools.forEach(t => {
      const card = document.createElement('a');
      card.href = t.website || t.link || '#';
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'holo-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="holo-card-icon">${t.icon || '🤖'}</div>
          <span style="font-size:0.7rem; color:var(--u-cyan); font-family:var(--u-font-mono);">${t.category}</span>
        </div>
        <h4 class="holo-card-title">${t.name}</h4>
        <p class="holo-card-desc">${t.description || t.desc}</p>
        <div class="holo-card-footer">
          <span>Launch AI</span>
          <span>↗</span>
        </div>
      `;
      grid.appendChild(card);
    });

    // Setup filter buttons
    document.querySelectorAll('.ai-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ai-filter-tab').forEach(x => x.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-cat');
        if (cat === 'All') {
          renderAITools(REAL_AI_TOOLS);
        } else {
          const filtered = REAL_AI_TOOLS.filter(item => item.category === cat);
          renderAITools(filtered.length ? filtered : REAL_AI_TOOLS);
        }
      });
    });
  }

  // 2. TOOLS ROOM SETUP (3D Matrix + 2D List Mode)
  function setupToolsRoom() {
    const matrixView = document.getElementById('tools-matrix-view');
    const listView = document.getElementById('tools-list-view');
    const toggleBtn = document.getElementById('toggle-tools-view-btn');
    let isList = false;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        isList = !isList;
        matrixView.style.display = isList ? 'none' : 'grid';
        listView.style.display = isList ? 'flex' : 'none';
        toggleBtn.textContent = isList ? "🧊 Switch to 3D Matrix" : "📋 Switch to 2D List";
        showToast(isList ? "2D List View Activated" : "3D Spatial Matrix Activated", "🔧");
      });
    }

    renderTools();
  }

  function renderTools() {
    const matrix = document.getElementById('tools-matrix-view');
    const list = document.getElementById('tools-list-view');
    if (!matrix || !list) return;

    matrix.innerHTML = '';
    list.innerHTML = '';

    REAL_TOOLS.forEach(tool => {
      // 3D Matrix Card
      const card = document.createElement('div');
      card.className = 'holo-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="holo-card-icon">${tool.icon || '🔧'}</div>
          <span style="font-size:0.7rem; color:var(--u-blue); font-family:var(--u-font-mono);">${tool.category}</span>
        </div>
        <h4 class="holo-card-title">${tool.name}</h4>
        <p class="holo-card-desc">${tool.description || tool.desc}</p>
        <div class="holo-card-footer">
          <a href="${tool.route}" class="hud-btn" style="width:100%; justify-content:center;">Open Tool ↗</a>
        </div>
      `;
      matrix.appendChild(card);

      // 2D List Item
      const listItem = document.createElement('div');
      listItem.className = 'tools-2d-item';
      listItem.innerHTML = `
        <div style="display:flex; align-items:center; gap:1rem;">
          <span style="font-size:1.5rem;">${tool.icon || '🔧'}</span>
          <div>
            <strong style="color:#fff; font-size:1.05rem;">${tool.name}</strong>
            <div style="font-size:0.85rem; color:var(--u-text-muted);">${tool.description || tool.desc}</div>
          </div>
        </div>
        <a href="${tool.route}" class="hud-btn">Launch Tool <span>→</span></a>
      `;
      list.appendChild(listItem);
    });
  }

  // 3. GAMING ROOM
  function setupGamingRoom() {
    const grid = document.getElementById('gaming-arena-grid');

    if (!grid) return;
    grid.innerHTML = '';

    REAL_GAMES.forEach(game => {
      const card = document.createElement('div');
      card.className = 'holo-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="holo-card-icon">${game.icon || '🎮'}</div>
          <span style="font-size:0.7rem; color:var(--u-purple); font-family:var(--u-font-mono);">${game.genre}</span>
        </div>
        <h4 class="holo-card-title">${game.name}</h4>
        <p class="holo-card-desc">${game.description || game.desc}</p>
        <div class="holo-card-footer">
          <button type="button" class="hud-btn play-game-btn" style="width:100%; justify-content:center;">
            Play Game ▶
          </button>
        </div>
      `;

      card.querySelector('.play-game-btn').addEventListener('click', () => {
        if (window.UniverseSound) window.UniverseSound.playChime();
        if (game.route.startsWith('http')) {
          window.open(game.route, '_blank');
        } else {
          window.location.href = game.route;
        }
      });

      grid.appendChild(card);
    });
  }

  // 4. LEARNING ROOM & QUIZ TERMINAL
  function setupLearningRoom() {
    const classContainer = document.getElementById('learning-classes-grid');
    if (classContainer) {
      classContainer.innerHTML = '';
      for (let c = 1; c <= 12; c++) {
        const pill = document.createElement('a');
        pill.href = `learning/class.html?id=${c}`;
        pill.className = 'hud-btn';
        pill.style.padding = '0.7rem 1.2rem';
        pill.style.borderRadius = '50px';
        pill.innerHTML = `<span>🎓 Class ${c}</span>`;
        classContainer.appendChild(pill);
      }
    }

    // Interactive GK Quiz Terminal
    const quizQuestion = document.getElementById('quiz-term-question');
    const quizOptions = document.getElementById('quiz-term-options');
    const quizScoreDisplay = document.getElementById('quiz-term-score');

    const sampleQuestions = [
      {
        q: "What is the primary gas found in Earth's atmosphere?",
        opts: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        ans: 1
      },
      {
        q: "Which planet is known as the Red Planet?",
        opts: ["Venus", "Jupiter", "Mars", "Saturn"],
        ans: 2
      },
      {
        q: "What is the speed of light in vacuum?",
        opts: ["3 × 10⁸ m/s", "1.5 × 10⁸ m/s", "3 × 10⁶ m/s", "3000 km/s"],
        ans: 0
      }
    ];

    let currentQ = 0;
    let score = 0;

    function renderQuestion() {
      if (!quizQuestion || !quizOptions) return;
      const data = sampleQuestions[currentQ];
      quizQuestion.textContent = `Q${currentQ + 1}: ${data.q}`;
      quizOptions.innerHTML = '';

      data.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hud-btn';
        btn.style.width = '100%';
        btn.style.textAlign = 'left';
        btn.style.padding = '0.75rem 1rem';
        btn.textContent = `${['A', 'B', 'C', 'D'][idx]}. ${opt}`;

        btn.addEventListener('click', () => {
          if (idx === data.ans) {
            btn.style.background = 'rgba(16, 185, 129, 0.4)';
            btn.style.borderColor = '#10b981';
            score += 10;
            if (window.UniverseSound) window.UniverseSound.playChime();
            showToast("Correct! +10 Knowledge XP", "✨");
          } else {
            btn.style.background = 'rgba(239, 68, 68, 0.4)';
            btn.style.borderColor = '#ef4444';
            if (window.UniverseSound) window.UniverseSound.playBeep(300, 0.1);
          }
          if (quizScoreDisplay) quizScoreDisplay.textContent = `Score: ${score} XP`;

          setTimeout(() => {
            currentQ = (currentQ + 1) % sampleQuestions.length;
            renderQuestion();
          }, 1000);
        });

        quizOptions.appendChild(btn);
      });
    }

    renderQuestion();
  }

  // 5. STORE ROOM SETUP
  function setupStoreRoom() {
    const grid = document.getElementById('store-marketplace-grid');
    if (!grid) return;
    grid.innerHTML = '';

    REAL_APPS.forEach(app => {
      const card = document.createElement('div');
      card.className = 'holo-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div class="holo-card-icon">${app.icon || '🛍️'}</div>
          <span style="font-size:0.7rem; color:var(--u-amber); font-family:var(--u-font-mono);">${app.category}</span>
        </div>
        <h4 class="holo-card-title">${app.name}</h4>
        <p class="holo-card-desc">${app.longDescription || app.description || app.desc}</p>
        <div style="font-size:0.75rem; color:var(--u-text-dim);">Platform: ${app.platform || 'Universal'}</div>
        <div class="holo-card-footer">
          <a href="${app.downloadUrl || app.officialUrl || app.link || '#'}" target="_blank" rel="noopener" class="hud-btn" style="width:100%; justify-content:center;">
            Get Verified App ↗
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // 6. PROFILE ROOM SETUP
  function setupProfileRoom() {
    const savedCount = document.getElementById('profile-saved-count');
    const toolsUsed = document.getElementById('profile-tools-count');
    if (savedCount) savedCount.textContent = "7 Assets";
    if (toolsUsed) toolsUsed.textContent = "14 Sessions";
  }

  // 7. DAILY SPECIAL ROOM SETUP
  function setupDailySpecialRoom() {
    const dateEl = document.getElementById('daily-special-date');
    const quoteEl = document.getElementById('daily-special-quote');
    const tipEl = document.getElementById('daily-special-tip');

    const now = new Date();
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (quoteEl) {
      quoteEl.textContent = `"The beautiful thing about learning is that no one can take it away from you." — B.B. King`;
    }
    if (tipEl) {
      tipEl.textContent = `Master the 20-20-20 Rule: Every 20 minutes spent looking at a screen, look at an object 20 feet away for 20 seconds. It prevents digital eye fatigue!`;
    }
  }

  // 8. HOLOGRAPHIC SEARCH GATEWAY
  function setupSearchGateway() {
    const input = document.getElementById('search-gateway-input');
    const results = document.getElementById('search-gateway-results');
    const closeBtn = document.getElementById('close-search-gateway-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSearchGateway);
    }

    if (input && results) {
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) {
          results.innerHTML = '<div style="color:var(--u-text-dim); text-align:center; padding:2rem;">Start typing to scan through Tools, AI Models, Games, and Courses...</div>';
          return;
        }

        const hits = [];

        // Search in tools
        REAL_TOOLS.forEach(t => {
          if (t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) {
            hits.push({ title: t.name, desc: t.desc, type: 'Tool', link: t.route, icon: '🔧' });
          }
        });

        // Search in AI
        REAL_AI_TOOLS.forEach(a => {
          if (a.name.toLowerCase().includes(q) || (a.desc && a.desc.toLowerCase().includes(q))) {
            hits.push({ title: a.name, desc: a.desc, type: 'AI Tool', link: a.website || a.link, icon: '🤖' });
          }
        });

        // Search in Games
        REAL_GAMES.forEach(g => {
          if (g.name.toLowerCase().includes(q) || (g.desc && g.desc.toLowerCase().includes(q))) {
            hits.push({ title: g.name, desc: g.desc, type: 'Game', link: g.route, icon: '🎮' });
          }
        });

        // Search in Apps
        REAL_APPS.forEach(ap => {
          if (ap.name.toLowerCase().includes(q)) {
            hits.push({ title: ap.name, desc: ap.desc, type: 'Store App', link: ap.downloadUrl || ap.link, icon: '🛍️' });
          }
        });

        if (hits.length === 0) {
          results.innerHTML = `<div style="color:var(--u-text-muted); text-align:center; padding:2rem;">No holographic entities found matching "${input.value}".</div>`;
          return;
        }

        results.innerHTML = '';
        hits.slice(0, 10).forEach(h => {
          const item = document.createElement('a');
          item.href = h.link;
          item.className = 'tools-2d-item';
          item.innerHTML = `
            <div style="display:flex; align-items:center; gap:1rem;">
              <span style="font-size:1.5rem;">${h.icon}</span>
              <div>
                <strong style="color:#fff;">${h.title}</strong> <span style="font-size:0.75rem; color:var(--u-cyan);">[${h.type}]</span>
                <div style="font-size:0.85rem; color:var(--u-text-muted);">${h.desc}</div>
              </div>
            </div>
            <span style="color:var(--u-cyan);">Launch ↗</span>
          `;
          results.appendChild(item);
        });
      });
    }
  }

  function openSearchGateway() {
    if (searchOverlay) {
      searchOverlay.classList.add('active');
      const input = document.getElementById('search-gateway-input');
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  }

  function closeSearchGateway() {
    if (searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  }

  // Public Interface
  window.UniverseRooms = {
    init: init,
    showRoom: showRoom,
    showToast: showToast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
