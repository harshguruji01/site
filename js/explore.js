/**
 * explore.js - Global Discovery Hub Logic for HarshGuruJi / WebGuruJi
 * Preserves all existing IDs, APIs, caching, and functionality while providing
 * premium UI/UX, featured spotlight rendering, keyboard shortcuts, and responsive interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Static Curated Data (Preserved from existing source of truth)
  const EXPLORE_SOURCES = {
    education: [
      { id: 'edu1', title: 'MIT OpenCourseWare', desc: 'Free access to thousands of MIT course materials for self-learners and educators worldwide.', category: 'Education', icon: '🎓', source: 'MIT', url: 'https://ocw.mit.edu/' },
      { id: 'edu2', title: 'Khan Academy', desc: 'Free world-class online courses, interactive practice lessons, and personalized learning dashboard.', category: 'Education', icon: '🏫', source: 'Khan Academy', url: 'https://www.khanacademy.org/' },
      { id: 'edu3', title: 'Coursera', desc: 'Build job-relevant skills with courses, certificates, and degree programs from leading universities.', category: 'Education', icon: '💻', source: 'Coursera', url: 'https://www.coursera.org/' },
      { id: 'edu4', title: 'edX', desc: 'Access 2,000+ free online courses from over 140 premier global institutions including Harvard and MIT.', category: 'Education', icon: '📚', source: 'edX', url: 'https://www.edx.org/' },
      { id: 'edu-quiz-india', title: 'Quiz India Game', desc: 'Interactive General Knowledge quiz & trivia game testing your Indian history, geography, science, polity, and world GK.', category: 'Education', icon: '🇮🇳', source: 'HarshGuruJi', url: 'Quiz India/index.html' }
    ],
    ai: [
      { id: 'ai1', title: 'ChatGPT', desc: 'OpenAI\'s flagship conversational generative AI model for coding, brainstorming, and productivity.', category: 'AI', icon: '🤖', source: 'OpenAI', url: 'https://chat.openai.com/' },
      { id: 'ai2', title: 'Google Gemini', desc: 'Google\'s advanced multimodal AI foundation model built from the ground up for cross-modal reasoning.', category: 'AI', icon: '✨', source: 'Google', url: 'https://gemini.google.com/' },
      { id: 'ai3', title: 'Hugging Face', desc: 'The leading open-source AI platform and hub for pre-trained machine learning models and datasets.', category: 'AI', icon: '🤗', source: 'Hugging Face', url: 'https://huggingface.co/' },
      { id: 'ai4', title: 'Anthropic Claude', desc: 'Next-generation constitutional AI assistant focused on safe, helpful, and reliable enterprise dialogue.', category: 'AI', icon: '🧠', source: 'Anthropic', url: 'https://claude.ai/' }
    ],
    technology: [
      { id: 'tech1', title: 'MDN Web Docs', desc: 'Comprehensive, battle-tested documentation and resources for web developers, maintained by Mozilla.', category: 'Technology', icon: '🌐', source: 'Mozilla', url: 'https://developer.mozilla.org/' },
      { id: 'tech2', title: 'GitHub', desc: 'The world\'s leading software development and version control platform powered by Git.', category: 'Technology', icon: '🐙', source: 'GitHub', url: 'https://github.com/' },
      { id: 'tech3', title: 'Stack Overflow', desc: 'The premier global knowledge base where software engineers learn, share knowledge, and solve bugs.', category: 'Technology', icon: '💻', source: 'Stack Exchange', url: 'https://stackoverflow.com/' },
      { id: 'tech4', title: 'W3Schools', desc: 'The world\'s largest web developer learning platform with interactive tutorials and live code sandboxes.', category: 'Technology', icon: '🛠️', source: 'W3Schools', url: 'https://www.w3schools.com/' }
    ],
    science: [
      { id: 'sci1', title: 'Nature', desc: 'The world\'s foremost peer-reviewed weekly scientific journal covering all disciplines.', category: 'Science', icon: '🔬', source: 'Nature', url: 'https://www.nature.com/' },
      { id: 'sci2', title: 'ScienceDaily', desc: 'Breaking science news, latest research findings, and scientific discoveries updated daily.', category: 'Science', icon: '📰', source: 'ScienceDaily', url: 'https://www.sciencedaily.com/' },
      { id: 'sci3', title: 'Scientific American', desc: 'Authoritative coverage of the most remarkable discoveries and advancements in science and technology.', category: 'Science', icon: '🌎', source: 'Scientific American', url: 'https://www.scientificamerican.com/' },
      { id: 'sci4', title: 'CERN', desc: 'European Organization for Nuclear Research probing fundamental particles and laws of the universe.', category: 'Science', icon: '⚛️', source: 'CERN', url: 'https://home.cern/' }
    ],
    space: [
      { id: 'spc1', title: 'NASA', desc: 'National Aeronautics and Space Administration leading human exploration of the Moon and Mars.', category: 'Space', icon: '🚀', source: 'NASA', url: 'https://www.nasa.gov/' },
      { id: 'spc2', title: 'SpaceX', desc: 'Designing, manufacturing, and launching revolutionary orbital rockets and interplanetary spacecraft.', category: 'Space', icon: '🛰️', source: 'SpaceX', url: 'https://www.spacex.com/' },
      { id: 'spc3', title: 'ESA', desc: 'European Space Agency coordinating gateway space exploration and Earth observation programs.', category: 'Space', icon: '🌌', source: 'ESA', url: 'https://www.esa.int/' },
      { id: 'spc4', title: 'Hubble & James Webb', desc: 'Deep cosmic imagery and monumental discoveries from humanity\'s most powerful space telescopes.', category: 'Space', icon: '🔭', source: 'HubbleSite', url: 'https://hubblesite.org/' }
    ],
    cybersecurity: [
      { id: 'cyb1', title: 'OWASP Foundation', desc: 'Open Web Application Security Project setting industry benchmarks for secure web applications.', category: 'Cybersecurity', icon: '🔐', source: 'OWASP', url: 'https://owasp.org/' },
      { id: 'cyb2', title: 'NIST Cybersecurity', desc: 'Standardized federal guidelines, best practices, and risk management frameworks for modern security.', category: 'Cybersecurity', icon: '🛡️', source: 'NIST', url: 'https://www.nist.gov/cybersecurity' },
      { id: 'cyb3', title: 'Hack The Box', desc: 'Gamified cybersecurity training platform with real-world hands-on pentesting challenges and labs.', category: 'Cybersecurity', icon: '🏴‍☠️', source: 'Hack The Box', url: 'https://www.hackthebox.com/' },
      { id: 'cyb4', title: 'Cybrary', desc: 'Interactive cybersecurity and IT career training platform with guided lab workflows.', category: 'Cybersecurity', icon: '💻', source: 'Cybrary', url: 'https://www.cybrary.it/' }
    ]
  };

  // Curated Featured Highlights from existing dataset
  const FEATURED_ITEMS = [
    {
      id: 'feat1',
      title: 'MIT OpenCourseWare',
      desc: 'Unlock over 2,500 courses spanning computer science, quantum physics, calculus, and engineering directly from MIT professors.',
      category: 'Education',
      icon: '🎓',
      source: 'MIT',
      badge: '★ Featured Education',
      url: 'https://ocw.mit.edu/'
    },
    {
      id: 'feat2',
      title: 'OpenAI ChatGPT',
      desc: 'Harness state-of-the-art conversational neural networks for coding, reasoning, summarization, and interactive learning.',
      category: 'AI',
      icon: '🤖',
      source: 'OpenAI',
      badge: '★ Featured AI',
      url: 'https://chat.openai.com/'
    },
    {
      id: 'feat3',
      title: 'MDN Web Docs',
      desc: 'The official developer standard reference for JavaScript, HTML5, CSS specifications, and Web APIs.',
      category: 'Technology',
      icon: '🌐',
      source: 'Mozilla',
      badge: '★ Developer Essential',
      url: 'https://developer.mozilla.org/'
    },
    {
      id: 'feat4',
      title: 'NASA Space Missions',
      desc: 'Explore real-time data, high-resolution cosmic telemetry, and mission logs from the International Space Station and Mars Rovers.',
      category: 'Space',
      icon: '🚀',
      source: 'NASA',
      badge: '★ Cosmos Hub',
      url: 'https://www.nasa.gov/'
    }
  ];

  const DYNAMIC_SECTIONS = [
    { id: 'books', title: '📚 Books', fetcher: fetchBooks },
    { id: 'research', title: '🔬 Research', fetcher: fetchResearch }
  ];

  // SVG Helper Icons
  const SVG_EXTERNAL_ARROW = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;
  const SVG_SOURCE_ICON = `<svg class="card-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
  const SVG_DATE_ICON = `<svg class="card-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;

  /**
   * Utility to create a modern explore card element
   * Preserves existing class names: explore-card, card-badge, card-icon, card-title, card-desc, card-meta, card-action
   */
  function createCard(item) {
    const a = document.createElement('a');
    a.href = item.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'explore-card';
    a.setAttribute('aria-label', `${item.title} - ${item.category || 'Topic'}`);

    // Top Header Row
    const headerRow = document.createElement('div');
    headerRow.className = 'card-header-row';

    const icon = document.createElement('div');
    icon.className = 'card-icon';
    icon.textContent = item.icon || '🔗';
    headerRow.appendChild(icon);

    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.textContent = item.category || 'Topic';
    headerRow.appendChild(badge);

    a.appendChild(headerRow);

    // Title
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = item.title;
    a.appendChild(title);

    // Description
    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = item.desc || 'Comprehensive knowledge resources and direct portal.';
    a.appendChild(desc);

    // Metadata
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    
    if (item.source) {
      const sourceSpan = document.createElement('span');
      sourceSpan.innerHTML = `${SVG_SOURCE_ICON} ${escapeHtml(item.source)}`;
      meta.appendChild(sourceSpan);
    }
    
    if (item.date) {
      const dateSpan = document.createElement('span');
      dateSpan.innerHTML = `${SVG_DATE_ICON} ${escapeHtml(item.date)}`;
      meta.appendChild(dateSpan);
    }
    a.appendChild(meta);

    // Action CTA
    const action = document.createElement('div');
    action.className = 'card-action';
    action.innerHTML = `<span>Explore</span> ${SVG_EXTERNAL_ARROW}`;
    a.appendChild(action);

    return a;
  }

  /**
   * Utility to create a featured spotlight card element
   */
  function createFeaturedCard(item) {
    const a = document.createElement('a');
    a.href = item.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'featured-card';
    a.setAttribute('aria-label', `Featured: ${item.title}`);

    const top = document.createElement('div');
    top.className = 'featured-card-top';

    const pill = document.createElement('div');
    pill.className = 'featured-pill';
    pill.textContent = item.badge || '★ Featured';
    top.appendChild(pill);

    const icon = document.createElement('div');
    icon.className = 'featured-icon';
    icon.textContent = item.icon || '⭐';
    top.appendChild(icon);

    a.appendChild(top);

    const title = document.createElement('h3');
    title.className = 'featured-title';
    title.textContent = item.title;
    a.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'featured-desc';
    desc.textContent = item.desc;
    a.appendChild(desc);

    const actionBar = document.createElement('div');
    actionBar.className = 'featured-action-bar';

    const sourceTag = document.createElement('span');
    sourceTag.style.cssText = 'color: var(--explore-text-muted); font-size: 0.85rem; font-weight: 500; display: inline-flex; align-items: center; gap: 6px;';
    sourceTag.innerHTML = `${SVG_SOURCE_ICON} ${escapeHtml(item.source || 'Curated')}`;
    actionBar.appendChild(sourceTag);

    const cta = document.createElement('span');
    cta.className = 'featured-cta';
    cta.innerHTML = `<span>Open Hub</span> ${SVG_EXTERNAL_ARROW}`;
    actionBar.appendChild(cta);

    a.appendChild(actionBar);

    return a;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Render Featured Items
  function renderFeaturedSection() {
    const container = document.getElementById('featured-grid');
    if (!container) return;
    container.innerHTML = '';
    FEATURED_ITEMS.forEach(item => {
      container.appendChild(createFeaturedCard(item));
    });
  }

  // Render static categories
  function renderStaticSection(sectionId, data) {
    const container = document.getElementById(`${sectionId}-grid`);
    if (!container) return;
    
    container.innerHTML = '';
    if (data.length === 0) {
      container.innerHTML = `
        <div class="explore-empty-state">
          <div class="explore-empty-icon" aria-hidden="true">🔍</div>
          <h3>No matching items in this topic</h3>
          <p>Try searching for a broader keyword or browse another section.</p>
        </div>
      `;
      return;
    }
    
    data.forEach(item => {
      container.appendChild(createCard(item));
    });
  }

  // --- API Fetchers (OpenLibrary & Crossref) ---
  async function fetchBooks() {
    try {
      const res = await fetch('https://openlibrary.org/subjects/science.json?limit=4');
      if (!res.ok) throw new Error('OpenLibrary API Failed');
      const data = await res.json();
      return (data.works || []).map(w => ({
        id: w.key,
        title: w.title || 'Scientific Publication',
        desc: w.authors && w.authors.length ? 'By ' + w.authors.map(a => a.name).join(', ') : 'Open Access Library Work',
        category: 'Books',
        icon: '📖',
        source: 'OpenLibrary',
        url: `https://openlibrary.org${w.key}`
      }));
    } catch (e) {
      throw e;
    }
  }

  async function fetchResearch() {
    try {
      const res = await fetch('https://api.crossref.org/works?query=artificial+intelligence&select=title,URL,author,created&rows=4');
      if (!res.ok) throw new Error('Crossref API Failed');
      const data = await res.json();
      return (data.message?.items || []).map(i => ({
        id: i.URL || Math.random().toString(),
        title: (i.title && i.title[0]) ? i.title[0] : 'Open Research Paper',
        desc: i.author ? i.author.map(a => a.family).filter(Boolean).join(', ') : 'Peer-reviewed Research',
        category: 'Research',
        icon: '📑',
        source: 'Crossref',
        url: i.URL || '#',
        date: i.created ? i.created['date-time'].split('T')[0] : null
      }));
    } catch (e) {
      throw e;
    }
  }

  // Render dynamic categories
  async function renderDynamicSection(section) {
    const container = document.getElementById(`${section.id}-grid`);
    if (!container) return;

    // Show skeletons initially
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const skel = document.createElement('div');
      skel.className = 'explore-card skeleton-card';
      skel.setAttribute('aria-hidden', 'true');
      skel.innerHTML = `
        <div class="card-header-row">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton" style="width: 60px; height: 18px; border-radius: 9999px;"></div>
        </div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-desc"></div>
        <div class="skeleton skeleton-desc short"></div>
        <div class="skeleton skeleton-btn" style="margin-top: auto;"></div>
      `;
      container.appendChild(skel);
    }

    try {
      const cacheKey = `explore_cache_${section.id}`;
      const cached = sessionStorage.getItem(cacheKey);
      let data = [];
      
      if (cached) {
        data = JSON.parse(cached);
      } else {
        data = await section.fetcher();
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      }

      container.innerHTML = '';
      if (!data || data.length === 0) {
        container.innerHTML = `
          <div class="explore-empty-state">
            <div class="explore-empty-icon" aria-hidden="true">📚</div>
            <h3>No entries currently available</h3>
            <p>Please check back later as resources are updated continuously.</p>
          </div>
        `;
        return;
      }

      data.forEach(item => {
        container.appendChild(createCard(item));
      });

    } catch (err) {
      console.warn(`[Explore Hub] Could not load live ${section.id}:`, err);
      container.innerHTML = `
        <div class="explore-empty-state">
          <div class="explore-empty-icon" aria-hidden="true">⚠️</div>
          <h3>Unable to load live ${escapeHtml(section.id)} stream</h3>
          <p>Network connectivity issue or external API rate limit. Please try again.</p>
          <button type="button" class="btn-retry" onclick="window.location.reload()">
            <span>Retry Connection</span>
          </button>
        </div>
      `;
    }
  }

  // --- Initial Render Execution ---
  renderFeaturedSection();

  Object.keys(EXPLORE_SOURCES).forEach(key => {
    renderStaticSection(key, EXPLORE_SOURCES[key]);
  });

  DYNAMIC_SECTIONS.forEach(sec => {
    renderDynamicSection(sec);
  });

  // --- Search & Filtering Engine ---
  const searchInput = document.getElementById('explore-search');
  const searchClear = document.getElementById('search-clear');
  const chips = document.querySelectorAll('.explore-chip');
  const sections = document.querySelectorAll('.explore-section');
  const globalEmpty = document.getElementById('explore-global-empty');
  const resetSearchBtn = document.getElementById('btn-reset-search');

  let debounceTimer;

  function filterContent(query, category) {
    query = (query || '').toLowerCase().trim();
    let totalMatches = 0;

    // 1. Filter section visibility by Category Chip
    sections.forEach(sec => {
      const secCat = sec.getAttribute('data-category');
      
      // Determine if section belongs to current category filter
      const matchesCategory = (category === 'all' || secCat === category);
      
      if (matchesCategory) {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });

    // 2. Filter content inside visible sections by search query
    if (query.length > 0) {
      sections.forEach(sec => {
        if (!sec.classList.contains('hidden')) {
          const secCat = sec.getAttribute('data-category');

          if (secCat === 'featured') {
            const filteredFeatured = FEATURED_ITEMS.filter(item => 
              item.title.toLowerCase().includes(query) || 
              item.desc.toLowerCase().includes(query) ||
              (item.source && item.source.toLowerCase().includes(query))
            );
            const container = document.getElementById('featured-grid');
            if (container) {
              container.innerHTML = '';
              if (filteredFeatured.length === 0) {
                sec.classList.add('hidden');
              } else {
                filteredFeatured.forEach(item => container.appendChild(createFeaturedCard(item)));
                totalMatches += filteredFeatured.length;
              }
            }
          } else if (EXPLORE_SOURCES[secCat]) {
            const filtered = EXPLORE_SOURCES[secCat].filter(item => 
              item.title.toLowerCase().includes(query) || 
              item.desc.toLowerCase().includes(query) ||
              (item.source && item.source.toLowerCase().includes(query))
            );
            renderStaticSection(secCat, filtered);
            if (filtered.length > 0) {
              totalMatches += filtered.length;
            }
          } else if (secCat === 'books' || secCat === 'research') {
            const cacheKey = `explore_cache_${secCat}`;
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
              const data = JSON.parse(cached);
              const filtered = data.filter(item => 
                item.title.toLowerCase().includes(query) || 
                (item.desc && item.desc.toLowerCase().includes(query)) ||
                (item.source && item.source.toLowerCase().includes(query))
              );
              renderStaticSection(secCat, filtered);
              if (filtered.length > 0) {
                totalMatches += filtered.length;
              }
            }
          }
        }
      });

      // Show/hide global empty banner
      if (globalEmpty) {
        if (totalMatches === 0) {
          globalEmpty.classList.add('active');
        } else {
          globalEmpty.classList.remove('active');
        }
      }

    } else {
      // Reset content if search is cleared
      if (globalEmpty) {
        globalEmpty.classList.remove('active');
      }

      renderFeaturedSection();

      sections.forEach(sec => {
        const secCat = sec.getAttribute('data-category');
        if (EXPLORE_SOURCES[secCat]) {
          renderStaticSection(secCat, EXPLORE_SOURCES[secCat]);
        }
        if (secCat === 'books' || secCat === 'research') {
          const cacheKey = `explore_cache_${secCat}`;
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            renderStaticSection(secCat, JSON.parse(cached));
          }
        }
      });
    }
  }

  // --- Search Input Listener with Debounce ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchClear) {
        searchClear.style.display = val.length > 0 ? 'inline-flex' : 'none';
      }
      
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const activeChip = document.querySelector('.explore-chip.active');
        const activeCategory = activeChip ? activeChip.dataset.filter : 'all';
        filterContent(val, activeCategory);
      }, 250);
    });
  }

  // --- Clear Search Button Listener ---
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClear.style.display = 'none';
      const activeChip = document.querySelector('.explore-chip.active');
      const activeCategory = activeChip ? activeChip.dataset.filter : 'all';
      filterContent('', activeCategory);
    });
  }

  // --- Global Empty State Reset Button ---
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      if (searchClear) {
        searchClear.style.display = 'none';
      }
      if (chips) {
        chips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        const allChip = document.querySelector('.explore-chip[data-filter="all"]');
        if (allChip) {
          allChip.classList.add('active');
          allChip.setAttribute('aria-selected', 'true');
        }
      }
      filterContent('', 'all');
    });
  }

  // --- Category Chips Click Listeners ---
  if (chips) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');

        // Smooth scroll chip into view on small screens
        chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        const filterVal = chip.dataset.filter;
        const query = searchInput ? searchInput.value : '';
        filterContent(query, filterVal);
      });
    });
  }

  // --- Keyboard Shortcuts (/ or Ctrl+K for search, Escape to clear/blur) ---
  document.addEventListener('keydown', (e) => {
    if (!searchInput) return;

    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    if (e.key === '/' && !isTyping) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !isTyping) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === 'Escape' && document.activeElement === searchInput) {
      if (searchInput.value.length > 0) {
        searchInput.value = '';
        if (searchClear) searchClear.style.display = 'none';
        const activeChip = document.querySelector('.explore-chip.active');
        const activeCategory = activeChip ? activeChip.dataset.filter : 'all';
        filterContent('', activeCategory);
      } else {
        searchInput.blur();
      }
    }
  });

});
