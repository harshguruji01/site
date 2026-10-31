/**
 * HarshGuruJi GuruAI - 21st.dev Modern AI Chat Input Controller
 * Component inspired by @jahed/components/ai-chat-input
 * Spring physics transitions, state morphing typography, models, effort levels,
 * attachments tray, voice input visualizer and Perplexity-style answer generation.
 */

(function initGuruAiChatInput() {
  function setup() {
    const wrapper = document.getElementById('guru-ai-input-wrapper');
    if (!wrapper) return;

    const capsule = document.getElementById('guru-ai-capsule');
    const textarea = document.getElementById('guru-ai-textarea');
    const fadeTop = document.getElementById('guru-ai-fade-top');
    const fadeBottom = document.getElementById('guru-ai-fade-bottom');
    const modelWrapper = document.getElementById('guru-ai-model-wrapper');
    const modelBtn = document.getElementById('guru-ai-model-btn');
    const currentModelSpan = document.getElementById('guru-ai-current-model');
    const modelMenuItems = document.querySelectorAll('.guru-ai-menu-item');
    const effortBtn = document.getElementById('guru-ai-effort-btn');
    const effortLabel = document.getElementById('guru-ai-effort-label');
    const effortIcon = document.querySelector('.guru-ai-effort-icon');
    const attachBtn = document.getElementById('guru-ai-attach-btn');
    const fileInput = document.getElementById('guru-ai-file-input');
    const tray = document.getElementById('guru-ai-tray');
    const trayInner = document.getElementById('guru-ai-tray-inner');
    const actionBtn = document.getElementById('guru-ai-action-btn');
    const voiceWaves = document.getElementById('guru-ai-voice-waves');
    const chatBody = document.querySelector('.ai-chat-demo .chat-body');

    let attachments = [];
    let isRecording = false;
    let recognition = null;
    let speechSupported = false;
    const effortLevels = ['Low', 'Medium', 'Max Effort'];
    let currentEffortIdx = 1; // Default Medium

    // Initialize Web Speech API if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          if (text) {
            textarea.value = (textarea.value ? textarea.value + ' ' : '') + text;
            updateActionState();
            autoResize();
          }
        };

        recognition.onerror = () => stopRecording();
        recognition.onend = () => stopRecording();
        speechSupported = true;
      } catch (e) {
        console.warn('SpeechRecognition initialization failed:', e);
      }
    }

    // Auto-resize textarea & update scroll fade masks
    function autoResize() {
      textarea.style.height = 'auto';
      const scrollH = textarea.scrollHeight;
      const targetH = Math.min(Math.max(scrollH, 44), 160);
      textarea.style.height = targetH + 'px';

      // Update fades
      const scrollTop = textarea.scrollTop;
      const clientH = textarea.clientHeight;
      if (fadeTop) {
        fadeTop.style.opacity = Math.min(scrollTop / 16, 1);
      }
      if (fadeBottom) {
        const remaining = scrollH - clientH - scrollTop;
        fadeBottom.style.opacity = remaining > 10 ? '1' : '0';
      }
    }

    textarea.addEventListener('input', () => {
      autoResize();
      updateActionState();
    });

    textarea.addEventListener('scroll', autoResize);

    // Update Action Button State: "mic" vs "send" vs "stop"
    function updateActionState() {
      if (isRecording) {
        actionBtn.setAttribute('data-state', 'stop');
        actionBtn.setAttribute('aria-label', 'Stop recording');
      } else if (textarea.value.trim().length > 0 || attachments.length > 0) {
        actionBtn.setAttribute('data-state', 'send');
        actionBtn.setAttribute('aria-label', 'Send prompt');
      } else {
        actionBtn.setAttribute('data-state', 'mic');
        actionBtn.setAttribute('aria-label', 'Use voice input');
      }
    }

    // Focus & Blur Capsule State
    textarea.addEventListener('focus', () => {
      capsule.classList.add('focused');
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        if (!textarea.value.trim() && attachments.length === 0) {
          capsule.classList.remove('focused');
        }
        if (modelWrapper) modelWrapper.classList.remove('open');
      }
    });

    // Model Selector Menu Toggle
    if (modelBtn && modelWrapper) {
      modelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modelWrapper.classList.toggle('open');
      });

      modelMenuItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const selectedModel = item.getAttribute('data-model');
          currentModelSpan.textContent = selectedModel;
          modelMenuItems.forEach((m) => m.classList.remove('active'));
          item.classList.add('active');
          modelWrapper.classList.remove('open');
        });
      });
    }

    // Effort Level Cycle
    function updateEffortUI() {
      const level = effortLevels[currentEffortIdx];
      effortLabel.textContent = level;
      if (effortIcon) {
        const b1 = effortIcon.querySelector('.bar-1');
        const b2 = effortIcon.querySelector('.bar-2');
        const b3 = effortIcon.querySelector('.bar-3');
        if (b1 && b2 && b3) {
          b1.style.opacity = '1';
          b2.style.opacity = level === 'Low' ? '0.35' : '1';
          b3.style.opacity = level === 'Max Effort' ? '1' : '0.35';
        }
      }
    }

    if (effortBtn) {
      effortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentEffortIdx = (currentEffortIdx + 1) % effortLevels.length;
        updateEffortUI();
      });
      updateEffortUI();
    }

    // Attachment File Upload Handlers
    if (attachBtn && fileInput) {
      attachBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
          const id = 'att-' + Math.random().toString(36).slice(2, 9);
          const isImg = file.type.startsWith('image/');
          const url = isImg ? URL.createObjectURL(file) : null;
          attachments.push({ id, file, url, name: file.name, isImg });
        });
        fileInput.value = '';
        renderAttachments();
        updateActionState();
      });
    }

    function renderAttachments() {
      if (!tray || !trayInner) return;
      trayInner.innerHTML = '';
      if (attachments.length > 0) {
        tray.classList.add('has-attachments');
        tray.setAttribute('aria-hidden', 'false');

        attachments.forEach((att) => {
          const item = document.createElement('div');
          item.className = 'guru-ai-tray-item';
          item.innerHTML = `
            ${att.isImg && att.url ? `<img src="${att.url}" alt="${att.name}" />` : `<span>📄</span>`}
            <span style="max-width: 130px; overflow: hidden; text-overflow: ellipsis;">${att.name}</span>
            <button type="button" class="guru-ai-tray-remove" title="Remove attachment" data-id="${att.id}">✕</button>
          `;

          item.querySelector('.guru-ai-tray-remove').addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (att.url) URL.revokeObjectURL(att.url);
            attachments = attachments.filter((a) => a.id !== att.id);
            renderAttachments();
            updateActionState();
          });

          trayInner.appendChild(item);
        });
      } else {
        tray.classList.remove('has-attachments');
        tray.setAttribute('aria-hidden', 'true');
      }
    }

    // Voice Input Toggle
    function startRecording() {
      isRecording = true;
      voiceWaves.classList.add('active');
      actionBtn.setAttribute('data-state', 'stop');

      if (recognition && speechSupported) {
        try {
          recognition.start();
        } catch (err) {
          console.warn('Recognition start error:', err);
          simulateSpeech();
        }
      } else {
        simulateSpeech();
      }
    }

    function stopRecording() {
      isRecording = false;
      voiceWaves.classList.remove('active');
      if (recognition && speechSupported) {
        try { recognition.stop(); } catch (_) {}
      }
      updateActionState();
    }

    function simulateSpeech() {
      const sampleQueries = [
        "Photosynthesis simple Hindi me samjhao",
        "Python list vs tuple difference",
        "Class 10 maths quadratic equations formula",
        "UP Board exam study timetable",
        "Newton ke 3 laws of motion simple explanation"
      ];
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      let i = 0;
      textarea.value = "";
      const timer = setInterval(() => {
        if (!isRecording) {
          clearInterval(timer);
          return;
        }
        if (i < randomQuery.length) {
          textarea.value += randomQuery[i];
          i++;
          autoResize();
          updateActionState();
        } else {
          clearInterval(timer);
          setTimeout(stopRecording, 400);
        }
      }, 50);
    }

    // Action Button Click
    actionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const state = actionBtn.getAttribute('data-state');
      if (state === 'mic') {
        startRecording();
      } else if (state === 'stop') {
        stopRecording();
      } else if (state === 'send') {
        submitQuery();
      }
    });

    // Enter Key Handler (Shift+Enter for newline)
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitQuery();
      }
    });

    // Educational Knowledge Base for Live Interactive Responses
    const knowledgeBase = [
      {
        triggers: ['photo', 'photosynthesis', 'plant', 'food', 'light'],
        answer: `<strong>Photosynthesis (प्रकाश संश्लेषण)</strong> ek aisi prakriya hai jisse paudhe apna bhojan banate hain [1].<br><br>
        🌱 <strong>Mukhya cheezein:</strong><br>
        • <strong>Sunlight (धूप):</strong> Energy source [2]<br>
        • <strong>Water (जल):</strong> Roots se absorb hota hai<br>
        • <strong>Carbon Dioxide (CO₂):</strong> Hawa se stomata dwara<br>
        • <strong>Formula:</strong> <code>6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂</code> [3]`,
        sources: [
          { name: 'NCERT Science Class 10', url: 'https://books.webguruji.online' },
          { name: 'HarshGuruJi Knowledge Hub', url: 'https://ai.webguruji.online' }
        ]
      },
      {
        triggers: ['python', 'list', 'tuple', 'diff', 'difference'],
        answer: `<strong>Python me List vs Tuple ka difference [1]:</strong><br><br>
        • <strong>List <code>[ ]</code>:</strong> Mutable hai (element badal sakte hain), thoda slow hota hai [2].<br>
        • <strong>Tuple <code>( )</code>:</strong> Immutable hai (read-only, change nahi hota), fast aur memory efficient hai [3].<br><br>
        💡 <em>Example:</em> <code>my_list = [1, 2, 3]</code> vs <code>my_tuple = (1, 2, 3)</code>`,
        sources: [
          { name: 'Python Official Docs', url: 'https://ai.webguruji.online' },
          { name: 'HarshGuruJi Coding Master', url: 'https://webguruji.online/education.html' }
        ]
      },
      {
        triggers: ['math', 'quadratic', 'equation', 'formula'],
        answer: `<strong>Quadratic Equation (द्विघात समीकरण) Formula [1]:</strong><br><br>
        General form: <code>ax² + bx + c = 0</code><br><br>
        ✨ <strong>Shreedharacharya Formula (Roots):</strong><br>
        <code>x = (-b ± √(b² - 4ac)) / (2a)</code> [2]<br><br>
        • Agar <strong>b² - 4ac > 0</strong>: Two real and distinct roots<br>
        • Agar <strong>b² - 4ac = 0</strong>: Two equal roots [3]`,
        sources: [
          { name: 'Class 10 NCERT Maths', url: 'https://books.webguruji.online' },
          { name: 'GuruAI Math Solver', url: 'https://ai.webguruji.online' }
        ]
      }
    ];

    function submitQuery() {
      const q = textarea.value.trim();
      if (!q && attachments.length === 0) return;

      const userText = q || 'Analyzed attached document / image';
      const currentModel = currentModelSpan.textContent;
      const currentEffort = effortLabel.textContent;

      // 1. Append User Message
      if (chatBody) {
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user';
        userMsg.innerHTML = `<div class="msg-bubble">${escapeHtml(userText)}</div>`;
        chatBody.appendChild(userMsg);

        // 2. Typing Indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = 'chat-msg ai typing-msg';
        typingMsg.innerHTML = `
          <img src="ai.png" alt="GuruAI" class="msg-avatar demo-avatar">
          <div class="msg-bubble">
            <div style="font-size: 0.75rem; color: #818CF8; margin-bottom: 0.25rem;">GuruAI searching sources (${currentModel} • ${currentEffort})...</div>
            <div class="guru-ai-typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        `;
        chatBody.appendChild(typingMsg);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Reset Textarea & Tray
        textarea.value = '';
        attachments = [];
        renderAttachments();
        updateActionState();
        autoResize();

        // 3. Generate Answer after realistic research latency
        setTimeout(() => {
          typingMsg.remove();

          // Match query against knowledge base
          const lower = userText.toLowerCase();
          const match = knowledgeBase.find((k) => k.triggers.some((t) => lower.includes(t)));

          let answerContent = '';
          let sourcesHtml = '';

          if (match) {
            answerContent = match.answer;
            sourcesHtml = `
              <div class="guru-ai-sources-tray">
                <span style="font-size: 0.68rem; color: #94A3B8; font-weight: 600;">Sources:</span>
                ${match.sources.map((s, idx) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="guru-ai-source-card">[${idx+1}] ${s.name}</a>`).join('')}
              </div>
            `;
          } else {
            answerContent = `Aapke sawaal <strong>"${escapeHtml(userText)}"</strong> ka Uttar GuruAI ne compile kiya hai [1]:<br><br>
            Ye topic students aur learners ke liye behad mahatvapurna hai. Iske deep analysis, step-by-step notes, citations aur model breakdown ke liye GuruAI web app par complete thread open karein [2].`;
            sourcesHtml = `
              <div class="guru-ai-sources-tray">
                <span style="font-size: 0.68rem; color: #94A3B8; font-weight: 600;">Verified:</span>
                <a href="https://ai.webguruji.online?q=${encodeURIComponent(userText)}" target="_blank" rel="noopener noreferrer" class="guru-ai-source-card">[1] HarshGuruJi Web Search</a>
                <a href="https://ai.webguruji.online?q=${encodeURIComponent(userText)}" target="_blank" rel="noopener noreferrer" class="guru-ai-source-card">[2] GuruAI Answer Engine</a>
              </div>
            `;
          }

          const aiMsg = document.createElement('div');
          aiMsg.className = 'chat-msg ai';
          aiMsg.innerHTML = `
            <img src="ai.png" alt="GuruAI" class="msg-avatar demo-avatar">
            <div class="msg-bubble">
              ${answerContent}
              ${sourcesHtml}
              <div style="margin-top: 0.6rem; padding-top: 0.4rem; border-top: 1px dashed rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem;">
                <span style="font-size: 0.72rem; color: #94A3B8;">Engine: <strong>${currentModel}</strong></span>
                <a href="https://ai.webguruji.online?q=${encodeURIComponent(userText)}" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; color: #818CF8; font-weight: 600; text-decoration: none;">Open full thread on GuruAI →</a>
              </div>
            </div>
          `;
          chatBody.appendChild(aiMsg);
          chatBody.scrollTop = chatBody.scrollHeight;
        }, 1100);
      }
    }

    function escapeHtml(str) {
      return str.replace(/[&<>'"]/g, (tag) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag));
    }

    // Set initial state
    updateActionState();
    autoResize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
