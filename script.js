// ── Shared daily thoughts pool ──
const DAILY_THOUGHTS = [
  { quote: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Knowledge is power.", author: "Francis Bacon" },
  { quote: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { quote: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Try not to become a man of success, but rather become a man of value.", author: "Albert Einstein" },
  { quote: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { quote: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { quote: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
  { quote: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { quote: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James" },
  { quote: "What we think, we become.", author: "Buddha" },
];

function getDayOfYear() {
  return Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
}

function injectDailySpecialNav() {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks || navLinks.querySelector('[data-nav-daily-special]')) return;

  const li = document.createElement('li');
  li.innerHTML = '<a href="daily-special.html" class="nav-link nav-daily-special" data-nav-daily-special>Daily Special</a>';
  const firstItem = navLinks.querySelector('li');
  if (firstItem) {
    navLinks.insertBefore(li, firstItem.nextSibling);
  } else {
    navLinks.appendChild(li);
  }

  if (window.location.pathname.endsWith('daily-special.html')) {
    navLinks.querySelectorAll('.nav-link.active').forEach(link => link.classList.remove('active'));
    li.querySelector('.nav-link').classList.add('active');
  }
}

function initDailySpecialTabs() {
  const subNav = document.getElementById('ds-sub-nav');
  if (!subNav) return;

  const buttons = subNav.querySelectorAll('.ds-sub-btn');
  const panels = document.querySelectorAll('.ds-tab-panel');

  function activateTab(tabId) {
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-ds-tab') === tabId);
    });
    panels.forEach(panel => {
      panel.classList.toggle('active', panel.getAttribute('data-ds-panel') === tabId);
    });
    if (history.replaceState) {
      history.replaceState(null, '', `#${tabId}`);
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.getAttribute('data-ds-tab'));
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash === 'news' || hash === 'thoughts' || hash === 'calendar') {
    activateTab(hash);
  }
}

function renderDailyThoughtsGrid(count) {
  const grid = document.getElementById('thoughts-grid');
  if (!grid) return;

  const dayOfYear = getDayOfYear();
  const total = Math.min(Math.max(count, 10), 15);
  let html = '';

  for (let i = 0; i < total; i++) {
    const t = DAILY_THOUGHTS[(dayOfYear + i) % DAILY_THOUGHTS.length];
    html += `
      <article class="thought-card">
        <div class="thought-card-num">Thought ${i + 1}</div>
        <p class="thought-text">"${t.quote}"</p>
        <footer class="thought-author">— ${t.author}</footer>
      </article>`;
  }

  grid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  injectDailySpecialNav();
  initDailySpecialTabs();
  renderDailyThoughtsGrid(12);

  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(5, 5, 5, 0.9)';
      navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(5, 5, 5, 0.7)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Number Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateStats = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        const updateCount = () => {
          count += increment;
          if (count < target) {
            entry.target.innerText = Math.ceil(count);
            requestAnimationFrame(updateCount);
          } else {
            entry.target.innerText = target;
          }
        };
        
        updateCount();
        observer.unobserve(entry.target);
      }
    });
  };

  const statsObserver = new IntersectionObserver(animateStats, { threshold: 0.5 });
  statNumbers.forEach(stat => statsObserver.observe(stat));

  // ─── Magical Floating Balls Background ───────────────────────────────
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Rich magical color palette
    const ballColors = [
      { r: 255, g: 51,  b: 102 },  // Hot Pink
      { r: 124, g: 58,  b: 237 },  // Purple
      { r: 6,   g: 182, b: 212 },  // Cyan
      { r: 245, g: 158, b: 11  },  // Amber
      { r: 16,  g: 185, b: 129 },  // Emerald
      { r: 239, g: 68,  b: 68  },  // Red
      { r: 99,  g: 102, b: 241 },  // Indigo
      { r: 236, g: 72,  b: 153 },  // Rose
      { r: 20,  g: 184, b: 166 },  // Teal
      { r: 251, g: 191, b: 36  },  // Yellow
    ];

    let balls = [];

    class MagicBall {
      constructor() {
        this.init();
      }
      init() {
        this.x      = Math.random() * canvas.width;
        this.y      = Math.random() * canvas.height;
        this.radius = Math.random() * 18 + 6;          // 6–24px
        this.baseRadius = this.radius;
        const c     = ballColors[Math.floor(Math.random() * ballColors.length)];
        this.r = c.r; this.g = c.g; this.b = c.b;
        this.opacity   = Math.random() * 0.35 + 0.25;  // 0.25–0.6
        this.speedX    = (Math.random() - 0.5) * 0.7;  // gentle drift
        this.speedY    = (Math.random() - 0.5) * 0.7;
        this.pulseDir  = 1;
        this.pulseSpeed= Math.random() * 0.015 + 0.005;
        this.pulseAmt  = Math.random() * 4 + 2;        // pulse 2–6px
        this.glowSize  = this.radius * 3.5;
        this.angle     = Math.random() * Math.PI * 2;
        this.wobble    = Math.random() * 0.008 + 0.003;
      }
      update() {
        // Gentle wobble / float
        this.angle += this.wobble;
        this.x += this.speedX + Math.sin(this.angle) * 0.3;
        this.y += this.speedY + Math.cos(this.angle * 0.7) * 0.3;

        // Pulse size
        this.radius += this.pulseSpeed * this.pulseDir;
        if (this.radius > this.baseRadius + this.pulseAmt) this.pulseDir = -1;
        if (this.radius < this.baseRadius - this.pulseAmt) this.pulseDir =  1;

        // Wrap around edges (seamless)
        if (this.x < -this.radius * 2) this.x = canvas.width  + this.radius;
        if (this.x > canvas.width  + this.radius * 2) this.x  = -this.radius;
        if (this.y < -this.radius * 2) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius * 2) this.y  = -this.radius;
      }
      draw() {
        // Outer glow (large, soft)
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowSize);
        glow.addColorStop(0,   `rgba(${this.r},${this.g},${this.b},${(this.opacity * 0.45).toFixed(2)})`);
        glow.addColorStop(0.4, `rgba(${this.r},${this.g},${this.b},${(this.opacity * 0.15).toFixed(2)})`);
        glow.addColorStop(1,   `rgba(${this.r},${this.g},${this.b},0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Inner glassy ball
        const grad = ctx.createRadialGradient(
          this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1,
          this.x, this.y, this.radius
        );
        grad.addColorStop(0,   `rgba(255,255,255,${(this.opacity * 0.9).toFixed(2)})`);
        grad.addColorStop(0.3, `rgba(${this.r},${this.g},${this.b},${(this.opacity * 0.85).toFixed(2)})`);
        grad.addColorStop(1,   `rgba(${Math.max(0,this.r-60)},${Math.max(0,this.g-60)},${Math.max(0,this.b-60)},${(this.opacity * 0.6).toFixed(2)})`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Specular highlight (top-left white dot)
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.28, this.y - this.radius * 0.28, this.radius * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(this.opacity * 0.7).toFixed(2)})`;
        ctx.fill();
      }
    }

    // Draw subtle connection lines between nearby balls
    function drawConnections() {
      const maxDist = 130;
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const dx = balls[i].x - balls[j].x;
          const dy = balls[i].y - balls[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(balls[i].x, balls[i].y);
            ctx.lineTo(balls[j].x, balls[j].y);
            ctx.strokeStyle = `rgba(${balls[i].r},${balls[i].g},${balls[i].b},${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function initBalls() {
      balls = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 55);
      for (let i = 0; i < count; i++) balls.push(new MagicBall());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnections();
      balls.forEach(b => { b.update(); b.draw(); });
      requestAnimationFrame(animate);
    }

    initBalls();
    animate();

    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initBalls();
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        if(navLinks && navLinks.classList.contains('active')){
          navLinks.classList.remove('active');
        }
      }
    });
  });

  // AI Chat Demo Simple Interaction
  const aiInput = document.getElementById('ai-demo-input');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiChatBody = document.querySelector('.chat-body');

  if(aiInput && aiSendBtn && aiChatBody) {
    aiSendBtn.addEventListener('click', () => {
      // Create user message
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user';
      userMsg.innerHTML = '<div class="msg-bubble">Tell me more!</div>';
      aiChatBody.appendChild(userMsg);
      
      // Auto reply
      setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-msg ai';
        aiMsg.innerHTML = '<img src="logo.png" class="msg-avatar" style="width:30px;height:30px;border-radius:50%;padding:0;background:transparent;flex-shrink:0;"/><div class="msg-bubble">I am GuruJi AI! Try the real version on our website to ask anything you want! 🚀</div>';
        aiChatBody.appendChild(aiMsg);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
      }, 1000);
    });
  }

  // --- WIKIPEDIA CONTENT FETCHING LOGIC ---
  
  // Helper to fetch and display Wikipedia Extract
  async function fetchWikiContent(topics, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Convert single string to array for search
    const topicsArray = Array.isArray(topics) ? topics : [topics];
    let loadedContent = false;
    let finalHtml = '';

    for (const topic of topicsArray) {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
        if (!response.ok) continue;
        const data = await response.json();
        
        let html = `<div style="background: rgba(255,255,255,0.02); padding: 2rem; border-radius: 15px; border: 1px solid var(--card-border); margin-bottom: 2rem; overflow: hidden;">`;
        html += `<h2 style="color:var(--text-primary); margin-bottom:0.5rem; font-size:2rem;">${data.title}</h2>`;
        if (data.description) html += `<p style="color:var(--accent-tertiary); margin-bottom:1.5rem; font-style:italic;">${data.description}</p>`;
        
        if (data.thumbnail && data.thumbnail.source) {
          html += `<img src="${data.thumbnail.source}" alt="${data.title}" style="max-width: 250px; border-radius: 10px; float: right; margin-left: 2rem; margin-bottom: 1rem; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">`;
        }
        
        html += `<div style="color:var(--text-secondary); line-height: 1.8; font-size: 1.05rem;">${data.extract_html || data.extract}</div>`;
        html += `<div style="clear:both;"></div>`;
        
        if (data.content_urls && data.content_urls.desktop) {
           html += `<a href="${data.content_urls.desktop.page}" target="_blank" class="btn btn-secondary" style="margin-top:2rem; display:inline-flex;">Read full article →</a>`;
        }
        html += `</div>`;
        finalHtml += html;
        loadedContent = true;
      } catch (err) {
        console.error("Failed fetching: ", topic);
      }
    }

    if (loadedContent) {
      container.innerHTML = finalHtml;
    } else {
      container.innerHTML = `<p>Sorry, we couldn't load content. Try searching for something else!</p>`;
    }
  }

  // Special function for Ask Anything page - Opens articles in article-viewer.html
  async function fetchWikiContentWithViewer(topics, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const topicsArray = Array.isArray(topics) ? topics : [topics];
    let loadedContent = false;
    let finalHtml = '';

    for (const topic of topicsArray) {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
        if (!response.ok) continue;
        const data = await response.json();
        
        let html = `<div style="background: rgba(255,255,255,0.02); padding: 2rem; border-radius: 15px; border: 1px solid var(--card-border); margin-bottom: 2rem; overflow: hidden;">`;
        html += `<h2 style="color:var(--text-primary); margin-bottom:0.5rem; font-size:2rem;">${data.title}</h2>`;
        if (data.description) html += `<p style="color:var(--accent-tertiary); margin-bottom:1.5rem; font-style:italic;">${data.description}</p>`;
        
        if (data.thumbnail && data.thumbnail.source) {
          html += `<img src="${data.thumbnail.source}" alt="${data.title}" style="max-width: 250px; border-radius: 10px; float: right; margin-left: 2rem; margin-bottom: 1rem; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">`;
        }
        
        html += `<div style="color:var(--text-secondary); line-height: 1.8; font-size: 1.05rem;">${data.extract_html || data.extract}</div>`;
        html += `<div style="clear:both;"></div>`;
        
        // Store article data and open in viewer page
        const articleTitle = data.title;
        html += `<button class="btn btn-secondary" style="margin-top:2rem; display:inline-flex; cursor:pointer; border:none; padding: 0.8rem 1.5rem; border-radius:50px;" onclick="openArticleViewer('${articleTitle}');">Read full article →</button>`;
        
        html += `</div>`;
        finalHtml += html;
        loadedContent = true;
      } catch (err) {
        console.error("Failed fetching: ", topic);
      }
    }

    if (loadedContent) {
      container.innerHTML = finalHtml;
    } else {
      container.innerHTML = `<p>Sorry, we couldn't load content. Try searching for something else!</p>`;
    }
  }

  // Function to open article viewer
  function openArticleViewer(articleTitle) {
    // Store article in localStorage
    localStorage.setItem('articleToView', articleTitle);
    // Open article-viewer.html with the title as a URL parameter
    window.open(`article-viewer.html?title=${encodeURIComponent(articleTitle)}`, '_blank');
  }

  // Function to search for custom articles (called from ask-anything.html)
  window.searchCustomArticle = function() {
    const searchInput = document.getElementById('article-search-input');
    if (searchInput && searchInput.value.trim()) {
      const searchQuery = searchInput.value.trim();
      openArticleViewer(searchQuery);
    } else {
      alert('Please enter a topic to search!');
    }
  };

  // Execute fetch based on page elements
  // -- Topics --
  if (document.getElementById('wiki-container-education')) {
    fetchWikiContent(['Education', 'E-learning', 'Higher_education', 'Learning_theory_(education)'], 'wiki-container-education');
  }
  if (document.getElementById('wiki-container-technology')) {
    fetchWikiContent(['Technology', 'Artificial_intelligence', 'Information_technology', 'Emerging_technologies'], 'wiki-container-technology');
  }
  if (document.getElementById('wiki-container-dailylife')) {
    fetchWikiContent(['Everyday_life', 'Habit', 'Time_management', 'Well-being'], 'wiki-container-dailylife');
  }

  // --- INTERACTIVE TOOLS LOGIC (free-tools.html) ---
  // Tool 1: Text Analyzer
  const textInput = document.getElementById('text-tool-input');
  if (textInput) {
    const wordCount = document.getElementById('tool-words');
    const charCount = document.getElementById('tool-chars');
    textInput.addEventListener('input', () => {
      const text = textInput.value;
      charCount.innerText = text.length;
      wordCount.innerText = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    });
  }

  // Tool 2: Password Generator
  const passGenBtn = document.getElementById('pass-gen-btn');
  if (passGenBtn) {
    const passOutput = document.getElementById('pass-output');
    const passLenSlider = document.getElementById('pass-length');
    const passLenDisplay = document.getElementById('pass-len-display');
    const passCopyBtn = document.getElementById('pass-copy-btn');
    
    passLenSlider.addEventListener('input', () => {
      passLenDisplay.innerText = passLenSlider.value;
    });
    
    passGenBtn.addEventListener('click', () => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let password = "";
      for (let i = 0; i < passLenSlider.value; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      passOutput.value = password;
    });
    
    passCopyBtn.addEventListener('click', () => {
      if(passOutput.value) {
        navigator.clipboard.writeText(passOutput.value);
        passCopyBtn.innerText = '✅';
        setTimeout(() => passCopyBtn.innerText = '📋', 2000);
      }
    });
  }

  // Tool 3: BMI Calculator
  const bmiBtn = document.getElementById('bmi-calc-btn');
  if (bmiBtn) {
    bmiBtn.addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('bmi-weight').value);
      const height = parseFloat(document.getElementById('bmi-height').value) / 100;
      const resultDiv = document.getElementById('bmi-result');
      
      if (!weight || !height || weight <= 0 || height <= 0) {
        resultDiv.innerText = "Please enter valid numbers!";
        resultDiv.style.color = "#ff3366";
        return;
      }
      
      const bmi = (weight / (height * height)).toFixed(1);
      let status = "";
      let color = "";
      
      if (bmi < 18.5) { status = "Underweight"; color = "#06b6d4"; }
      else if (bmi >= 18.5 && bmi < 24.9) { status = "Normal weight"; color = "#10b981"; }
      else if (bmi >= 25 && bmi < 29.9) { status = "Overweight"; color = "#ffbd2e"; }
      else { status = "Obese"; color = "#ff3366"; }
      
      resultDiv.innerHTML = `BMI: <span>${bmi}</span> <span style="font-size:0.9rem; font-weight:normal; color:${color}; display:block; margin-top:0.5rem;">(${status})</span>`;
    });
  }

  // -- Features --
  if (document.getElementById('wiki-container-insights')) {
    fetchWikiContent(['Wisdom', 'Insight', 'Knowledge', 'Self-awareness'], 'wiki-container-insights');
  }
  if (document.getElementById('wiki-container-ask')) {
    fetchWikiContentWithViewer(['Question', 'Information', 'Curiosity', 'Critical_thinking'], 'wiki-container-ask');
  }
  if (document.getElementById('wiki-container-explore')) {
    fetchWikiContent(['Learning', 'Exploration', 'Discovery_(observation)', 'Self-directed_learning'], 'wiki-container-explore');
  }

  // --- DAILY SPECIAL CALENDAR & "ON THIS DAY" with REAL-TIME UPDATES ---
  const calendarWidget = document.getElementById('calendar-widget');
  const onThisDayContainer = document.getElementById('wiki-container-onthisday');
  const importantEventsContainer = document.getElementById('important-events');
  
  if (calendarWidget && onThisDayContainer) {
    // Important Events & Holidays Database
    const importantDates = {
      '0101': ['🎆 New Year Day', '🎉 International New Year Celebration'],
      '0214': ['💝 Valentine\'s Day', '💕 Day of Love and Affection'],
      '0308': ['👩 International Women\'s Day', '🌸 Celebration of Women'],
      '0501': ['🎯 International Labour Day', '👷 Worker\'s Day Celebration'],
      '0815': ['🇮🇳 Indian Independence Movement Day', '🏴 Freedom Fighter\'s Day'],
      '1025': ['🔬 World Polio Day', '💉 Health Awareness Day'],
      '1026': ['🌍 United Nations Day', '🕊️ International Peace Day'],
      '1031': ['🎃 Halloween', '👻 Festival of Costumes'],
      '1225': ['🎄 Christmas Day', '🎅 Festival of Lights (Christian)'],
      '1231': ['🎊 New Year\'s Eve', '🥂 Celebration of New Beginnings'],
    };

    // Function to update calendar in real-time
    function updateCalendar() {
      const today = new Date();
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      
      // Update calendar display
      document.getElementById('cal-month').innerText = months[today.getMonth()];
      document.getElementById('cal-date').innerText = today.getDate();
      document.getElementById('cal-day').innerText = days[today.getDay()];
      
      // Update real-time clock
      const timeElement = document.getElementById('cal-time');
      if (timeElement) {
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        const seconds = String(today.getSeconds()).padStart(2, '0');
        timeElement.innerText = `${hours}:${minutes}:${seconds}`;
      }
      
      // Show important events/holidays for today
      if (importantEventsContainer) {
        const dateKey = String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');
        const todayEvents = importantDates[dateKey];
        
        if (todayEvents) {
          let eventsHtml = '';
          todayEvents.forEach(event => {
            eventsHtml += `<p>✨ ${event}</p>`;
          });
          importantEventsContainer.innerHTML = eventsHtml;
        } else {
          importantEventsContainer.innerHTML = '<p>💡 Today is a regular day - make it special!</p>';
        }
      }
    }

    // Update calendar immediately and then every second
    updateCalendar();
    setInterval(updateCalendar, 1000);

    const mm = String(new Date().getMonth() + 1).padStart(2, '0');
    const dd = String(new Date().getDate()).padStart(2, '0');

    // Fetch "On This Day" data from Wikipedia
    fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`)
      .then(res => res.json())
      .then(data => {
        let finalHtml = '';
        
        // Events
        if(data.events && data.events.length > 0) {
          finalHtml += '<div style="margin-bottom: 3rem;">';
          finalHtml += '<h2 style="color:var(--accent-tertiary); margin-bottom: 1rem;"><span style="font-size:1.5rem">📜</span> Historical Events</h2>';
          finalHtml += '<ul style="padding-left:1.5rem; color:var(--text-secondary); line-height:1.8;">';
          data.events.slice(0, 7).forEach(ev => {
            finalHtml += `<li style="margin-bottom:1rem;"><strong style="color:var(--text-primary)">${ev.year}:</strong> ${ev.text}</li>`;
          });
          finalHtml += '</ul></div>';
        }

        // Births
        if(data.births && data.births.length > 0) {
          finalHtml += '<div style="margin-bottom: 3rem;">';
          finalHtml += '<h2 style="color:var(--accent-primary); margin-bottom: 1rem;"><span style="font-size:1.5rem">🎂</span> Famous Births</h2>';
          finalHtml += '<ul style="padding-left:1.5rem; color:var(--text-secondary); line-height:1.8;">';
          data.births.slice(0, 5).forEach(ev => {
            finalHtml += `<li style="margin-bottom:1rem;"><strong style="color:var(--text-primary)">${ev.year}:</strong> ${ev.text}</li>`;
          });
          finalHtml += '</ul></div>';
        }

        // Deaths
        if(data.deaths && data.deaths.length > 0) {
          finalHtml += '<div>';
          finalHtml += '<h2 style="color:var(--accent-secondary); margin-bottom: 1rem;"><span style="font-size:1.5rem">🕊️</span> Notable Deaths</h2>';
          finalHtml += '<ul style="padding-left:1.5rem; color:var(--text-secondary); line-height:1.8;">';
          data.deaths.slice(0, 5).forEach(ev => {
            finalHtml += `<li style="margin-bottom:1rem;"><strong style="color:var(--text-primary)">${ev.year}:</strong> ${ev.text}</li>`;
          });
          finalHtml += '</ul></div>';
        }

        if(finalHtml === '') finalHtml = '<p style="color:var(--text-secondary);">No historical events found for today.</p>';
        onThisDayContainer.innerHTML = finalHtml;
      }).catch(err => {
        onThisDayContainer.innerHTML = '<p style="color:var(--text-secondary);">Failed to load historical events. Wikipedia may be unreachable.</p>';
      });
  }

  // ─── THOUGHT OF THE DAY (single, legacy widget) ───────────────────────
  const thoughtContainer = document.getElementById('thought-of-day');
  if (thoughtContainer) {
    const t = DAILY_THOUGHTS[getDayOfYear() % DAILY_THOUGHTS.length];
    thoughtContainer.innerHTML = `
      <blockquote class="thought-quote">
        <p class="thought-text">"${t.quote}"</p>
        <footer class="thought-author">— ${t.author}</footer>
      </blockquote>`;
  }

  // ─── NEWS FETCHER (RSS via rss2json proxy, auto-refresh) ──────────────
  function renderNews(containerId, items, fallbackMsg, limit) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!items || items.length === 0) {
      el.innerHTML = `<p class="news-loading">${fallbackMsg}</p>`;
      return;
    }
    const maxItems = limit || 8;
    let html = '';
    items.slice(0, maxItems).forEach(item => {
      const title  = item.title  || 'No Title';
      const link   = item.link   || item.url || '#';
      const source = item.author || item.source?.name || 'News Source';
      const pubDate = item.pubDate ? new Date(item.pubDate).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '';
      html += `
        <a class="news-card" href="${link}" target="_blank" rel="noopener noreferrer">
          <span class="news-title">${title}</span>
          <span class="news-meta">${source}${pubDate ? ' · ' + pubDate : ''}</span>
        </a>`;
    });
    el.innerHTML = html;
  }

  function updateNewsTimestamp() {
    const stamp = document.getElementById('news-last-updated');
    if (stamp) {
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      stamp.innerHTML = `<span class="pulse-dot"></span> Last updated: ${now} · auto-refresh every 5 min`;
    }
  }

  async function fetchNationalNews() {
    const indiaRSS = 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms';
    const indiaAPI = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(indiaRSS)}&count=10`;
    try {
      const r = await fetch(indiaAPI);
      const d = await r.json();
      if (d.items && d.items.length) {
        renderNews('national-news', d.items, 'Could not load national news right now.', 8);
        return;
      }
      throw new Error('empty');
    } catch {
      try {
        const fallbackRSS = 'https://feeds.feedburner.com/ndtvnews-india-news';
        const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(fallbackRSS)}&count=10`);
        const d = await r.json();
        renderNews('national-news', d.items, 'Could not load national news.', 8);
      } catch {
        const el = document.getElementById('national-news');
        if (el) el.innerHTML = '<p class="news-loading">National news unavailable right now.</p>';
      }
    }
  }

  async function fetchInternationalNews() {
    const bbcRSS = 'https://feeds.bbci.co.uk/news/world/rss.xml';
    const bbcAPI = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(bbcRSS)}&count=10`;
    try {
      const r = await fetch(bbcAPI);
      const d = await r.json();
      if (d.items && d.items.length) {
        renderNews('intl-news', d.items, 'Could not load international news right now.', 8);
        return;
      }
      throw new Error('empty');
    } catch {
      try {
        const fallbackRSS = 'https://feeds.reuters.com/reuters/worldNews';
        const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(fallbackRSS)}&count=10`);
        const d = await r.json();
        renderNews('intl-news', d.items, 'Could not load international news.', 8);
      } catch {
        const el = document.getElementById('intl-news');
        if (el) el.innerHTML = '<p class="news-loading">International news unavailable right now.</p>';
      }
    }
  }

  async function fetchAllNews() {
    await Promise.all([fetchNationalNews(), fetchInternationalNews()]);
    updateNewsTimestamp();
  }

  const nationalEl = document.getElementById('national-news');
  if (nationalEl) {
    fetchAllNews();
    setInterval(fetchAllNews, 5 * 60 * 1000);
  }

  const intlEl = document.getElementById('intl-news');
  if (intlEl && !nationalEl) {
    fetchAllNews();
    setInterval(fetchAllNews, 5 * 60 * 1000);
  }

  // --- HOMEPAGE DAILY IMPORTANCE AUTO-UPDATE ---
  const dailyFactCardText = document.getElementById('daily-fact-text');
  const dailyFactTitle = document.getElementById('daily-fact-title');
  const dailyFactFooter = document.getElementById('daily-fact-footer');

  if (dailyFactCardText && dailyFactTitle) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const monthsStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDateString = `${monthsStr[today.getMonth()]} ${today.getDate()}`;
    
    fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`)
      .then(res => res.json())
      .then(data => {
        // First check for Holidays/Observances (Importance of the day)
        if(data.holidays && data.holidays.length > 0) {
          const holiday = data.holidays[0];
          dailyFactTitle.innerText = `Today is ${currentDateString}`;
          dailyFactCardText.innerText = `Importance: ${holiday.text}.`;
          if (dailyFactFooter) dailyFactFooter.innerText = "🌟 Daily Observance";
        } 
        // Fallback to top historical event if no holidays
        else if (data.events && data.events.length > 0) {
          const ev = data.events[0];
          dailyFactTitle.innerText = `On this day in ${ev.year}`;
          dailyFactCardText.innerText = ev.text;
          if (dailyFactFooter) dailyFactFooter.innerText = "📜 Historical Event";
        } else {
          dailyFactTitle.innerText = `Today is ${currentDateString}`;
          dailyFactCardText.innerText = "Enjoy your day and keep learning new things!";
        }
      })
      .catch(err => {
        dailyFactTitle.innerText = `Today's Special`;
        dailyFactCardText.innerText = "Failed to load today's importance. Please check your internet connection.";
      });
  }
  
  // --- DYNAMIC DAILY UPDATES FROM GOOGLE SHEETS ---
  async function fetchDailyUpdatesFromSheet() {
    const quoteEl = document.getElementById('daily-quote-text');
    const tipTitleEl = document.getElementById('daily-tip-title');
    const tipTextEl = document.getElementById('daily-tip-text');
    
    // Only attempt if elements exist (primarily index.html)
    if (!quoteEl && !tipTitleEl && !tipTextEl) return;
    
    // Check if the Apps Script URL has been configured
    if (!GS_ENDPOINT || GS_ENDPOINT.includes('YOUR_GAS_WEBAPP_URL')) {
      console.log('Google Apps Script URL not configured. Using static fallback content.');
      return;
    }
    
    try {
      const response = await fetch(`${GS_ENDPOINT}?action=getDailyContent`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (data && data.success) {
        if (data.quoteText && quoteEl) {
          quoteEl.innerHTML = `"${data.quoteText}"` + (data.quoteAuthor ? ` — ${data.quoteAuthor}` : '');
        }
        if (data.tipTitle && tipTitleEl) {
          tipTitleEl.innerText = data.tipTitle;
        }
        if (data.tipText && tipTextEl) {
          tipTextEl.innerText = data.tipText;
        }
        console.log('Daily updates fetched successfully from Google Sheet');
      } else {
        console.warn('Google Sheet empty or returned unsuccessful response:', data.message);
      }
    } catch (error) {
      console.error('Error fetching daily content from Google Sheet:', error);
    }
  }

  fetchDailyUpdatesFromSheet();

  // --- SEARCH LOGIC ---
  const searchInputs = document.querySelectorAll('#site-search');
  const searchBtns = document.querySelectorAll('#search-btn');

  const doSearch = (query) => {
    if(!query.trim()) return;
    window.location.href = `search.html?q=${encodeURIComponent(query.trim())}`;
  };

  searchInputs.forEach((input, index) => {
    input.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') doSearch(input.value);
    });
    if(searchBtns[index]) {
      searchBtns[index].addEventListener('click', () => doSearch(input.value));
    }
  });

  // Handle Search Results Page
  const searchContainer = document.getElementById('wiki-container-search');
  const queryDisplay = document.getElementById('search-query-display');
  
  if (searchContainer && queryDisplay) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if(query) {
      queryDisplay.innerText = query;
      // First render local Q&A matches, then load Wikipedia content
      renderLocalQA(query, 'qa-container').finally(() => {
        fetchWikiContent(query, 'wiki-container-search');
      });
    } else {
      queryDisplay.innerText = 'Nothing';
      searchContainer.innerHTML = '<p>Please enter a search term in the search bar above.</p>';
    }
  }

  // Render local Q&A results from qa.json
  async function renderLocalQA(query, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '<div class="wiki-loading">Searching site Q&A...</div>';
    try {
      const res = await fetch('qa.json');
      if(!res.ok) throw new Error('Failed to load QA dataset');
      const qa = await res.json();
      const qLower = query.toLowerCase();
      // Simple matching: question or tags include query terms
      const results = qa.filter(item => {
        if(!item) return false;
        const inQuestion = item.question && item.question.toLowerCase().includes(qLower);
        const inAnswer = item.answer && item.answer.toLowerCase().includes(qLower);
        const inTags = item.tags && item.tags.join(' ').toLowerCase().includes(qLower);
        return inQuestion || inAnswer || inTags;
      });

      let html = '';
      if(results.length === 0) {
        html = '<div style="padding:1.2rem; color:var(--text-secondary);">No direct answers found on the site. Showing Wikipedia results below.</div>';
      } else {
        html = '<div style="display:flex; gap:1rem; flex-direction:column;">';
        for(const r of results) {
          html += `<div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius:12px; border:1px solid var(--card-border);">`;
          html += `<div style="font-weight:700; color:var(--text-primary); margin-bottom:0.4rem;">${r.question}</div>`;
          html += `<div style="color:var(--text-secondary); margin-bottom:0.6rem;">${r.answer}</div>`;
          if(r.tags && r.tags.length) html += `<div style="font-size:0.85rem; color:var(--accent-tertiary);">Tags: ${r.tags.join(', ')}</div>`;
          html += `</div>`;
        }
        html += '</div>';
      }
      container.innerHTML = html;
    } catch (err) {
      container.innerHTML = '<div style="color:var(--text-secondary);">Failed to load site Q&A.</div>';
      console.error(err);
    }
  }

  // --- FLOATING AI WIDGET FOR WHOLE SITE ---
  function createFloatingWidget() {
    const widgetBtn = document.createElement('div');
    widgetBtn.innerHTML = '<img src="logo.png" style="width: 35px; height: 35px; border-radius: 50%;" />';
    widgetBtn.id = 'global-ai-btn';
    widgetBtn.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: 50%; display: flex; justify-content: center; align-items: center;
      font-size: 2rem; color: white; cursor: pointer; box-shadow: 0 10px 30px var(--glow-primary);
      z-index: 9999; transition: transform 0.3s;
    `;
    widgetBtn.onmouseover = () => widgetBtn.style.transform = 'scale(1.1)';
    widgetBtn.onmouseout = () => widgetBtn.style.transform = 'scale(1)';
    
    const widgetBox = document.createElement('div');
    widgetBox.id = 'global-ai-box';
    widgetBox.style.cssText = `
      position: fixed; bottom: 100px; right: 30px; width: 320px; height: 420px;
      background: rgba(15, 15, 15, 0.95); border: 1px solid var(--glass-border);
      border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 9998;
      backdrop-filter: blur(20px); display: none; flex-direction: column; overflow: hidden;
      transform-origin: bottom right; transition: all 0.3s ease;
    `;
    
    widgetBox.innerHTML = `
      <div style="background: rgba(25,25,25,0.9); padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <img src="logo.png" style="height: 25px; border-radius: 5px;" />
          <span style="font-weight:600;">GuruJi AI</span>
        </div>
        <button id="close-widget" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer; line-height:1;">×</button>
      </div>
      <div id="widget-chat-body" style="flex:1; padding:1.2rem; overflow-y:auto; display:flex; flex-direction:column; gap:1rem;">
        <div style="background: rgba(255,255,255,0.05); padding:0.8rem 1rem; border-radius: 0 15px 15px 15px; font-size:0.9rem; max-width:85%; border: 1px solid rgba(255,255,255,0.05);">
          Hi! I am GuruJi AI. You can ask me anything and I will search the site's Wikipedia integration for you! 🚀
        </div>
      </div>
      <div style="padding:1rem; border-top: 1px solid rgba(255,255,255,0.05); display:flex; gap:0.8rem; background: rgba(10,10,10,0.9);">
        <input type="text" id="widget-input" placeholder="Ask anything..." style="flex:1; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:50px; padding:0.6rem 1.2rem; color:white; outline:none; font-family:'Inter', sans-serif;">
        <button id="widget-send" style="background:var(--accent-primary); border:none; width:40px; height:40px; border-radius:50%; color:white; font-size:1.2rem; cursor:pointer; display:flex; justify-content:center; align-items:center; transition:0.3s;">➔</button>
      </div>
    `;
    
    document.body.appendChild(widgetBox);
    document.body.appendChild(widgetBtn);
    
    let isOpen = false;
    window.toggleGuruJiWidget = () => {
      isOpen = !isOpen;
      widgetBox.style.display = isOpen ? 'flex' : 'none';
      if(isOpen) document.getElementById('widget-input').focus();
    };
    
    widgetBtn.onclick = window.toggleGuruJiWidget;
    document.getElementById('close-widget').onclick = window.toggleGuruJiWidget;
    
    const wInput = document.getElementById('widget-input');
    const wSend = document.getElementById('widget-send');
    const wBody = document.getElementById('widget-chat-body');
    
    const handleSend = () => {
      const text = wInput.value.trim();
      if(!text) return;
      
      const uMsg = document.createElement('div');
      uMsg.style.cssText = 'align-self: flex-end; background: var(--accent-secondary); padding: 0.8rem 1rem; border-radius: 15px 0 15px 15px; font-size: 0.9rem; max-width: 85%; color: white;';
      uMsg.innerText = text;
      wBody.appendChild(uMsg);
      wInput.value = '';
      wBody.scrollTop = wBody.scrollHeight;
      
      setTimeout(() => {
        const aMsg = document.createElement('div');
        aMsg.style.cssText = 'background: rgba(255,255,255,0.05); padding: 0.8rem 1rem; border-radius: 0 15px 15px 15px; font-size: 0.9rem; max-width: 85%; border: 1px solid rgba(255,255,255,0.05);';
        aMsg.innerHTML = `Here's what I found for "<strong>${text}</strong>": <br><br><a href="search.html?q=${encodeURIComponent(text)}" style="color:var(--accent-tertiary); text-decoration:none; font-weight:bold;">View Search Results ➔</a>`;
        wBody.appendChild(aMsg);
        wBody.scrollTop = wBody.scrollHeight;
      }, 800);
    };
    
    wSend.onclick = handleSend;
    wInput.onkeypress = (e) => { if(e.key === 'Enter') handleSend(); };
  }

  createFloatingWidget();

  // --- AUTH / SSO HELPERS ---
  // Configure your deployed Google Apps Script Web App URL here.
  // Deploy the script as a web app (see google-apps-script.md) and paste the URL.
  const GS_ENDPOINT = window.GS_ENDPOINT || 'https://YOUR_GAS_WEBAPP_URL';

  // --- Firebase Phone Auth (optional) ---
  // Firebase config provided by user
  const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "harsh-guru-ji-93963.firebaseapp.com",
    projectId: "harsh-guru-ji-93963",
    storageBucket: "harsh-guru-ji-93963.firebasestorage.app",
    messagingSenderId: "608363765469",
    appId: "1:608363765469:web:6eba382f98e13690358534"
  };

  let firebaseAvailable = false;
  if (window.firebase && !firebase.apps.length) {
    try {
      firebase.initializeApp(firebaseConfig);
      firebaseAvailable = true;
    } catch (e) {
      console.warn('Firebase init failed', e);
    }
  } else if (window.firebaseModular && window.firebaseModular.app) {
    // modular SDK initialized via firebase-init.js
    firebaseAvailable = true;
  }

  async function sendOtpViaFirebase(mobile) {
    if (!firebaseAvailable) throw new Error('Firebase not available');
    // ensure recaptcha container exists
    const container = document.getElementById('recaptcha-container');
    if (!container) throw new Error('recaptcha-container missing');
    // create recaptcha verifier (invisible)
    window.recaptchaVerifier = window.recaptchaVerifier || new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(mobile, appVerifier);
      // ask user for code via modal
      const code = await showOtpModal('Enter the SMS code sent to ' + mobile);
      if (!code) throw new Error('Code required');
      const result = await confirmationResult.confirm(code);
      return { success: true, result };
    } catch (err) {
      // reset recaptcha on error
      try { appVerifier.clear(); } catch (e) {}
      throw err;
    }
  }

  // Show OTP modal and resolve entered code or null if cancelled
  function showOtpModal(title) {
    return new Promise((resolve) => {
      const modal = document.getElementById('otp-modal');
      const input = document.getElementById('otp-modal-input');
      const submit = document.getElementById('otp-modal-submit');
      const cancel = document.getElementById('otp-modal-cancel');
      const titleEl = document.getElementById('otp-modal-title');
      const desc = document.getElementById('otp-modal-desc');
      titleEl.textContent = title || 'Enter code';
      desc.style.display = title ? 'block' : 'none';
      input.value = '';
      modal.style.display = 'flex';
      input.focus();
      function cleanup() { modal.style.display = 'none'; submit.removeEventListener('click', onSubmit); cancel.removeEventListener('click', onCancel); }
      function onSubmit(e) { e.preventDefault(); const v = input.value.trim(); cleanup(); resolve(v || null); }
      function onCancel(e) { e.preventDefault(); cleanup(); resolve(null); }
      submit.addEventListener('click', onSubmit);
      cancel.addEventListener('click', onCancel);
      input.addEventListener('keydown', function onKey(e) { if (e.key === 'Enter') { onSubmit(e); input.removeEventListener('keydown', onKey); } });
    });
  }

  // Show modal to collect new password (with confirm)
  function showNewPasswordModal() {
    return new Promise((resolve) => {
      const modal = document.getElementById('newpass-modal');
      const input = document.getElementById('newpass-modal-input');
      const input2 = document.getElementById('newpass-modal-input-2');
      const submit = document.getElementById('newpass-modal-submit');
      const cancel = document.getElementById('newpass-modal-cancel');
      input.value = '';
      input2.value = '';
      modal.style.display = 'flex';
      input.focus();
      function cleanup() { modal.style.display = 'none'; submit.removeEventListener('click', onSubmit); cancel.removeEventListener('click', onCancel); }
      function onSubmit(e) {
        e.preventDefault();
        const a = input.value.trim();
        const b = input2.value.trim();
        if (!a) return alert('Password required');
        if (a !== b) return alert('Passwords do not match');
        cleanup();
        resolve(a);
      }
      function onCancel(e) { e.preventDefault(); cleanup(); resolve(null); }
      submit.addEventListener('click', onSubmit);
      cancel.addEventListener('click', onCancel);
      input.addEventListener('keydown', function onKey(e) { if (e.key === 'Enter') { onSubmit(e); input.removeEventListener('keydown', onKey); } });
    });
  }

  // Show signup prompt for first-time visitors
  // Show signup prompt for first-time visitors (attempt autologin first)
  try {
    (async () => {
      try { await tryAutoLogin(); } catch (e) { console.warn('autologin failed', e); }
      if (!localStorage.getItem('loggedIn') && !localStorage.getItem('seenSignupPrompt')) {
        setTimeout(() => {
          showSignupModal();
          localStorage.setItem('seenSignupPrompt', '1');
        }, 1500);
      }
    })();
  } catch (e) {}

  function showSignupModal() {
    const m = document.createElement('div');
    m.id = 'signup-prompt';
    m.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);z-index:10000;';
    m.innerHTML = `<div style="background:var(--bg-secondary);padding:1.6rem;border-radius:12px;max-width:420px;width:100%;text-align:center;border:1px solid var(--glass-border);">
      <h3 style="margin-bottom:0.4rem;">Welcome to HarshGuruJi 👋</h3>
      <p style="color:var(--text-secondary);margin-bottom:1rem;">Create a free account to save preferences and ask questions.</p>
      <div style="display:flex;gap:0.6rem;justify-content:center;">
        <a href="join-us.html#signup" class="btn btn-primary">Sign Up</a>
        <a href="join-us.html#login" class="btn btn-secondary">Log In</a>
      </div>
      <button id="signup-close" style="margin-top:1rem;background:none;border:none;color:var(--text-secondary);cursor:pointer;">Continue without account</button>
    </div>`;
    document.body.appendChild(m);
    document.getElementById('signup-close').onclick = () => m.remove();
  }

  // Signup form submit handler (legacy signup.html only)
  const signupForm = document.querySelector('.auth-form');
  if (signupForm && document.getElementById('email') && !document.getElementById('join-us-page')) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if(!name || !email || !password) return alert('Please fill all fields');

      try {
        const res = await fetch(`${GS_ENDPOINT}?action=register`, {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ name, email, password })
        });
        const j = await res.json();
        if (j.success) {
          alert('Account created. Please log in.');
          window.location.href = 'login.html';
        } else {
          alert(j.message || 'Failed to create account');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to reach auth server. Check GS_ENDPOINT in script.js and deploy Apps Script.');
      }
    });
  }

  // Login handling (legacy login.html only — join-us uses auth.js)
  const loginForm = document.getElementById('login-form');
  if (loginForm && !document.getElementById('join-us-page')) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const rememberMe = document.getElementById('remember-me') ? document.getElementById('remember-me').checked : false;
      if(!username || !password) return alert('Enter credentials');
      try {
        const res = await fetch(`${GS_ENDPOINT}?action=login`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ username, password })
        });
        const j = await res.json();
        if (j.success) {
          // mark logged in locally
          localStorage.setItem('loggedIn', JSON.stringify({ name: j.name, email: j.email }));
          // If user chose remember me, request server to create an autologin token
          if (rememberMe) {
            try {
              const tokenRes = await fetch(`${GS_ENDPOINT}?action=saveAutoLogin`, {
                method: 'POST', headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ identifier: username, days: 30 })
              });
              const t = await tokenRes.json();
              if (t && t.success && t.token) {
                localStorage.setItem('autologinToken', t.token);
              }
            } catch (err) { console.warn('saveAutoLogin failed', err); }
          }
          alert('Logged in successfully');
          window.location.href = 'index.html';
        } else {
          if (j.reason === 'password_mismatch') {
            if (confirm('Password incorrect. Would you like to request a password reset OTP?')) {
              await sendResetOtp(username);
            }
          } else {
            alert(j.message || 'Login failed');
          }
        }
      } catch (err) {
        console.error(err);
        alert('Login failed: cannot reach auth server.');
      }
    });

    // forgot link
    const forgot = document.getElementById('forgot-link');
    if (forgot) forgot.addEventListener('click', async (e) => {
      e.preventDefault();
      const identifier = prompt('Enter your registered email or mobile to receive OTP');
      if (identifier) await sendResetOtp(identifier.trim());
    });

    // OTP login button
    const otpBtn = document.getElementById('login-otp-btn');
    if (otpBtn) otpBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const usernameField = document.getElementById('login-username');
      let identifier = usernameField && usernameField.value.trim();
        if (!identifier) {
        identifier = prompt('Enter your registered email or mobile to receive OTP');
        if (!identifier) return;
      }
      try {
        // request OTP from server (or Twilio/email)
        const sendRes = await fetch(`${GS_ENDPOINT}?action=sendOtp`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ identifier })
        });
        const s = await sendRes.json();
        if (!s.success) return alert(s.message || 'Failed to send OTP');
        const otp = await showOtpModal('Enter the OTP sent to your email/mobile');
        if (!otp) return alert('OTP required');
        const verifyRes = await fetch(`${GS_ENDPOINT}?action=verifyOtp`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ identifier, otp })
        });
        const v = await verifyRes.json();
        if (v && v.success) {
          // mark logged in locally
          localStorage.setItem('loggedIn', JSON.stringify({ name: v.name, email: v.email }));
          // remember me -> request autologin token
          const rememberMe = document.getElementById('remember-me') ? document.getElementById('remember-me').checked : false;
          if (rememberMe) {
            try {
              const tokenRes = await fetch(`${GS_ENDPOINT}?action=saveAutoLogin`, {
                method: 'POST', headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ identifier, days: 30 })
              });
              const t = await tokenRes.json();
              if (t && t.success && t.token) localStorage.setItem('autologinToken', t.token);
            } catch (e) { console.warn('saveAutoLogin failed', e); }
          }
          alert('Logged in successfully');
          window.location.href = 'index.html';
        } else {
          alert(v.message || 'OTP verification failed');
        }
      } catch (err) {
        console.error(err);
        alert('OTP login failed.');
      }
    });
  }

  // Attempt autologin using stored token
  async function tryAutoLogin() {
    try {
      const token = localStorage.getItem('autologinToken');
      if (!token) return;
      const res = await fetch(`${GS_ENDPOINT}?action=verifyAutoLogin`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ token })
      });
      const j = await res.json();
      if (j && j.success) {
        localStorage.setItem('loggedIn', JSON.stringify({ name: j.name, email: j.email }));
      } else {
        // clear invalid token
        localStorage.removeItem('autologinToken');
      }
    } catch (e) {
      console.error('tryAutoLogin error', e);
    }
  }

  async function sendResetOtp(identifier) {
    try {
      // If identifier looks like a phone number and Firebase is available, use Firebase Phone Auth
      const isPhone = /^\+?\d{10,15}$/.test(identifier.replace(/\s+/g, ''));
      if (isPhone && firebaseAvailable) {
        const mobile = identifier;
        try {
          await sendOtpViaFirebase(mobile);
          const newPass = await showNewPasswordModal();
          if (!newPass) return alert('Password required');
          const reset = await fetch(`${GS_ENDPOINT}?action=resetPassword`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ identifier, newPassword: newPass })
          });
          const r = await reset.json();
          if (r.success) alert('Password reset. Please log in.'); else alert(r.message || 'Reset failed');
          return;
        } catch (err) {
          console.error('Firebase phone auth failed', err);
          alert('Phone verification failed, falling back to email/SMS via server.');
        }
      }

      // Fallback: server-driven OTP (Twilio or email)
      const res = await fetch(`${GS_ENDPOINT}?action=sendOtp`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ identifier })
      });
      const j = await res.json();
      if (j.success) {
        const otp = await showOtpModal('Enter the OTP sent to your email/mobile');
        if (!otp) return alert('OTP required');
        const verify = await fetch(`${GS_ENDPOINT}?action=verifyOtp`, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ identifier, otp })
        });
        const v = await verify.json();
        if (v.success) {
          const newPass = await showNewPasswordModal();
          if (!newPass) return alert('Password required');
          const reset = await fetch(`${GS_ENDPOINT}?action=resetPassword`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ identifier, newPassword: newPass })
          });
          const r = await reset.json();
          if (r.success) alert('Password reset. Please log in.'); else alert(r.message || 'Reset failed');
        } else {
          alert(v.message || 'OTP verification failed');
        }
      } else {
        alert(j.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP.');
    }
  }

  // ── SCROLL PROGRESS BAR ──
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + '%';
    });
  }

  // ── BACK TO TOP BUTTON ──
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── COOKIE CONSENT ──
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (localStorage.getItem('cookieAccepted')) {
      cookieBanner.classList.add('hidden');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.add('hidden');
    });
  }

  // ── SCROLL REVEAL ANIMATION ──
  // Add .reveal class to key sections
  document.querySelectorAll('.section-header, .feature-card, .category-card, .daily-card, .faq-item, .about-stat').forEach(el => {
    el.classList.add('reveal');
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

});

// ── FAQ TOGGLE (global function) ──
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-question').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });
  // Open clicked if was closed
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ── NEWSLETTER HANDLER (global function) ──
function handleNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value.trim();
  const msg = document.getElementById('newsletter-msg');
  
  if (!email || !validateEmail(email)) {
    msg.style.color = '#ff3366';
    msg.innerText = '❌ Please enter a valid email address.';
    return;
  }
  
  // Store subscription in localStorage
  const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
  if (subscriptions.includes(email)) {
    msg.style.color = '#f59e0b';
    msg.innerText = '⚠️ This email is already subscribed.';
    return;
  }
  
  subscriptions.push(email);
  localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
  
  msg.style.color = '#10b981';
  msg.innerText = `✅ Thank you! "${email}" has been subscribed. You'll receive daily updates at 6 AM!`;
  document.getElementById('newsletter-email').value = '';
  
  // Note: For automatic email sending at 6 AM daily, a backend service is required.
  // This frontend stores subscriptions locally. To implement actual email delivery,
  // you need to integrate with a backend service like:
  // - EmailJS (client-side email service)
  // - Firebase Cloud Functions
  // - Node.js backend with cron job
  // - Third-party email API (SendGrid, Mailchimp, etc.)
}

// Email validation helper
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

