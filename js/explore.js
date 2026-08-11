/**
 * explore.js - Global Discovery Hub Logic for HarshGuruJi
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Static Curated Data Fallbacks
  const EXPLORE_SOURCES = {
    education: [
      { id: 'edu1', title: 'MIT OpenCourseWare', desc: 'Free access to MIT course content.', category: 'Education', icon: '🎓', source: 'MIT', url: 'https://ocw.mit.edu/' },
      { id: 'edu2', title: 'Khan Academy', desc: 'Free online courses, lessons and practice.', category: 'Education', icon: '🏫', source: 'Khan Academy', url: 'https://www.khanacademy.org/' },
      { id: 'edu3', title: 'Coursera', desc: 'Build skills with courses from top universities.', category: 'Education', icon: '💻', source: 'Coursera', url: 'https://www.coursera.org/' },
      { id: 'edu4', title: 'edX', desc: 'Access 2000 free online courses from 140 leading institutions.', category: 'Education', icon: '📚', source: 'edX', url: 'https://www.edx.org/' }
    ],
    ai: [
      { id: 'ai1', title: 'ChatGPT', desc: 'OpenAI\'s conversational AI model.', category: 'AI', icon: '🤖', source: 'OpenAI', url: 'https://chat.openai.com/' },
      { id: 'ai2', title: 'Google Gemini', desc: 'Google\'s multimodal AI model.', category: 'AI', icon: '✨', source: 'Google', url: 'https://gemini.google.com/' },
      { id: 'ai3', title: 'Hugging Face', desc: 'The AI community building the future.', category: 'AI', icon: '🤗', source: 'Hugging Face', url: 'https://huggingface.co/' },
      { id: 'ai4', title: 'Anthropic Claude', desc: 'Next-generation AI assistant based on research into training helpful, honest, and harmless AI systems.', category: 'AI', icon: '🧠', source: 'Anthropic', url: 'https://claude.ai/' }
    ],
    technology: [
      { id: 'tech1', title: 'MDN Web Docs', desc: 'Resources for developers, by developers.', category: 'Technology', icon: '🌐', source: 'Mozilla', url: 'https://developer.mozilla.org/' },
      { id: 'tech2', title: 'GitHub', desc: 'Where the world builds software.', category: 'Technology', icon: '🐙', source: 'GitHub', url: 'https://github.com/' },
      { id: 'tech3', title: 'Stack Overflow', desc: 'Where developers learn, share, & build careers.', category: 'Technology', icon: '💻', source: 'Stack Exchange', url: 'https://stackoverflow.com/' },
      { id: 'tech4', title: 'W3Schools', desc: 'The world\'s largest web developer site.', category: 'Technology', icon: '🛠️', source: 'W3Schools', url: 'https://www.w3schools.com/' }
    ],
    science: [
      { id: 'sci1', title: 'Nature', desc: 'Leading international weekly journal of science.', category: 'Science', icon: '🔬', source: 'Nature', url: 'https://www.nature.com/' },
      { id: 'sci2', title: 'ScienceDaily', desc: 'Your source for the latest research news.', category: 'Science', icon: '📰', source: 'ScienceDaily', url: 'https://www.sciencedaily.com/' },
      { id: 'sci3', title: 'Scientific American', desc: 'Science news, articles, and information.', category: 'Science', icon: '🌎', source: 'Scientific American', url: 'https://www.scientificamerican.com/' },
      { id: 'sci4', title: 'CERN', desc: 'European Organization for Nuclear Research.', category: 'Science', icon: '⚛️', source: 'CERN', url: 'https://home.cern/' }
    ],
    space: [
      { id: 'spc1', title: 'NASA', desc: 'National Aeronautics and Space Administration.', category: 'Space', icon: '🚀', source: 'NASA', url: 'https://www.nasa.gov/' },
      { id: 'spc2', title: 'SpaceX', desc: 'Designs, manufactures and launches advanced rockets and spacecraft.', category: 'Space', icon: '🛰️', source: 'SpaceX', url: 'https://www.spacex.com/' },
      { id: 'spc3', title: 'ESA', desc: 'European Space Agency.', category: 'Space', icon: '🌌', source: 'ESA', url: 'https://www.esa.int/' },
      { id: 'spc4', title: 'Hubble Space Telescope', desc: 'Discoveries from the Hubble Space Telescope.', category: 'Space', icon: '🔭', source: 'HubbleSite', url: 'https://hubblesite.org/' }
    ],
    cybersecurity: [
      { id: 'cyb1', title: 'OWASP', desc: 'Open Web Application Security Project.', category: 'Cybersecurity', icon: '🔐', source: 'OWASP', url: 'https://owasp.org/' },
      { id: 'cyb2', title: 'NIST Cybersecurity', desc: 'Cybersecurity framework and resources.', category: 'Cybersecurity', icon: '🛡️', source: 'NIST', url: 'https://www.nist.gov/cybersecurity' },
      { id: 'cyb3', title: 'Hack The Box', desc: 'Cybersecurity training platform.', category: 'Cybersecurity', icon: '🏴‍☠️', source: 'Hack The Box', url: 'https://www.hackthebox.com/' },
      { id: 'cyb4', title: 'Cybrary', desc: 'Free cybersecurity and IT career development training.', category: 'Cybersecurity', icon: '💻', source: 'Cybrary', url: 'https://www.cybrary.it/' }
    ]
  };

  const DYNAMIC_SECTIONS = [
    { id: 'books', title: '📚 Books', fetcher: fetchBooks },
    { id: 'research', title: '🔬 Research', fetcher: fetchResearch }
  ];

  // Utility to create a card element
  function createCard(item) {
    const a = document.createElement('a');
    a.href = item.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'explore-card';

    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.textContent = item.category || 'Topic';
    a.appendChild(badge);

    const icon = document.createElement('div');
    icon.className = 'card-icon';
    icon.textContent = item.icon || '🔗';
    a.appendChild(icon);

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = item.title;
    a.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = item.desc || 'No description available.';
    a.appendChild(desc);

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    
    if (item.source) {
      const sourceDiv = document.createElement('span');
      sourceDiv.textContent = `Source: ${item.source}`;
      meta.appendChild(sourceDiv);
    }
    
    if (item.date) {
      const dateDiv = document.createElement('span');
      dateDiv.textContent = `Updated: ${item.date}`;
      meta.appendChild(dateDiv);
    }
    a.appendChild(meta);

    const action = document.createElement('div');
    action.className = 'card-action';
    action.innerHTML = 'Explore <span>→</span>';
    a.appendChild(action);

    return a;
  }

  // Render static categories
  function renderStaticSection(sectionId, data) {
    const container = document.getElementById(`${sectionId}-grid`);
    if (!container) return;
    
    container.innerHTML = '';
    if (data.length === 0) {
      container.innerHTML = '<div class="explore-empty-state"><p>No matching results found.</p></div>';
      return;
    }
    
    data.forEach(item => {
      container.appendChild(createCard(item));
    });
  }

  // --- API Fetchers ---
  async function fetchBooks() {
    try {
      const res = await fetch('https://openlibrary.org/subjects/science.json?limit=4');
      if (!res.ok) throw new Error('API Failed');
      const data = await res.json();
      return data.works.map(w => ({
        id: w.key,
        title: w.title,
        desc: w.authors ? 'By ' + w.authors.map(a => a.name).join(', ') : 'Unknown Author',
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
      // Using an open access API like Crossref for some dummy queries
      const res = await fetch('https://api.crossref.org/works?query=artificial+intelligence&select=title,URL,author,created&rows=4');
      if (!res.ok) throw new Error('API Failed');
      const data = await res.json();
      return data.message.items.map(i => ({
        id: i.URL,
        title: i.title ? i.title[0] : 'Untitled',
        desc: i.author ? i.author.map(a => a.family).join(', ') : 'Research Paper',
        category: 'Research',
        icon: '📑',
        source: 'Crossref',
        url: i.URL,
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
    for(let i=0; i<4; i++) {
      const skel = document.createElement('div');
      skel.className = 'explore-card skeleton-card';
      skel.innerHTML = `
        <div class="skeleton skeleton-icon"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-desc"></div>
        <div class="skeleton skeleton-desc short"></div>
      `;
      container.appendChild(skel);
    }

    try {
      // Check cache first (simplified)
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
      data.forEach(item => {
        container.appendChild(createCard(item));
      });

    } catch (err) {
      console.error(`Error loading ${section.id}:`, err);
      container.innerHTML = `
        <div class="explore-empty-state" style="grid-column: 1/-1;">
          <h3>Unable to load this section right now.</h3>
          <p>Please check your connection and try again.</p>
          <button class="btn-retry" onclick="window.location.reload()">Retry</button>
        </div>
      `;
    }
  }

  // Initialization
  Object.keys(EXPLORE_SOURCES).forEach(key => {
    renderStaticSection(key, EXPLORE_SOURCES[key]);
  });

  DYNAMIC_SECTIONS.forEach(sec => {
    renderDynamicSection(sec);
  });

  // --- Search & Filtering ---
  const searchInput = document.getElementById('explore-search');
  const searchClear = document.getElementById('search-clear');
  const chips = document.querySelectorAll('.explore-chip');
  const sections = document.querySelectorAll('.explore-section');

  let debounceTimer;

  function filterContent(query, category) {
    query = query.toLowerCase().trim();

    // 1. Filter section visibility by Category Chip
    sections.forEach(sec => {
      const secCat = sec.getAttribute('data-category');
      if (category === 'all' || secCat === category || secCat === 'featured') {
        sec.classList.remove('hidden');
      } else {
        sec.classList.add('hidden');
      }
    });

    // 2. Search within visible static sections
    if (query.length > 0) {
      sections.forEach(sec => {
        if (!sec.classList.contains('hidden')) {
          const secCat = sec.getAttribute('data-category');
          if (EXPLORE_SOURCES[secCat]) {
            const filtered = EXPLORE_SOURCES[secCat].filter(item => 
              item.title.toLowerCase().includes(query) || 
              item.desc.toLowerCase().includes(query)
            );
            renderStaticSection(secCat, filtered);
          }
          // Note: for dynamic sections, we're keeping it simple and just letting them show as is, 
          // or we could implement filtering on cached data.
          if (secCat === 'books' || secCat === 'research') {
             const cacheKey = `explore_cache_${secCat}`;
             const cached = sessionStorage.getItem(cacheKey);
             if (cached) {
                const data = JSON.parse(cached);
                const filtered = data.filter(item => 
                  item.title.toLowerCase().includes(query) || 
                  (item.desc && item.desc.toLowerCase().includes(query))
                );
                renderStaticSection(secCat, filtered);
             }
          }
        }
      });
    } else {
      // Reset static sections if search is cleared
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

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      searchClear.style.display = val.length > 0 ? 'block' : 'none';
      
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const activeChip = document.querySelector('.explore-chip.active');
        const activeCategory = activeChip ? activeChip.dataset.filter : 'all';
        filterContent(val, activeCategory);
      }, 300);
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      const activeChip = document.querySelector('.explore-chip.active');
      const activeCategory = activeChip ? activeChip.dataset.filter : 'all';
      filterContent('', activeCategory);
    });
  }

  if (chips) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filterVal = chip.dataset.filter;
        const query = searchInput ? searchInput.value : '';
        filterContent(query, filterVal);
      });
    });
  }

});
