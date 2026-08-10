const aiToolsData = [
  {
    id: "t-001",
    name: "ChatGPT",
    description: "Advanced conversational AI by OpenAI for writing, coding, and brainstorming.",
    category: "AI Chat",
    tags: ["Productivity", "Writing", "Coding"],
    website: "https://chatgpt.com",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path></svg>",
    pricing: "Freemium",
    verified: true,
    featured: true
  },
  {
    id: "t-002",
    name: "Claude",
    description: "Next-generation AI assistant by Anthropic, known for large context windows and safe responses.",
    category: "AI Chat",
    tags: ["Research", "Writing", "Analysis"],
    website: "https://claude.ai",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path></svg>",
    pricing: "Freemium",
    verified: true,
    featured: true
  },
  {
    id: "t-003",
    name: "Gemini",
    description: "Google's most capable AI model, integrated with Google Workspace and search.",
    category: "AI Chat",
    tags: ["Productivity", "Search", "Multimodal"],
    website: "https://gemini.google.com",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'></path></svg>",
    pricing: "Freemium",
    verified: true,
    featured: true
  },
  {
    id: "t-004",
    name: "Midjourney",
    description: "State-of-the-art AI image generator operating via Discord. Best for artistic visuals.",
    category: "AI Image",
    tags: ["Design", "Art", "Creativity"],
    website: "https://www.midjourney.com",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect><circle cx='8.5' cy='8.5' r='1.5'></circle><polyline points='21 15 16 10 5 21'></polyline></svg>",
    pricing: "Paid",
    verified: true,
    featured: true
  },
  {
    id: "t-005",
    name: "GitHub Copilot",
    description: "Your AI pair programmer that suggests code and entire functions in real-time.",
    category: "AI Coding",
    tags: ["Developer", "Programming", "Automation"],
    website: "https://github.com/features/copilot",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='16 18 22 12 16 6'></polyline><polyline points='8 6 2 12 8 18'></polyline></svg>",
    pricing: "Paid",
    verified: true,
    featured: true
  },
  {
    id: "t-006",
    name: "Cursor",
    description: "The AI-first code editor. Built to make you extraordinarily productive.",
    category: "AI Coding",
    tags: ["IDE", "Programming", "Developer"],
    website: "https://cursor.sh",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='16 18 22 12 16 6'></polyline><polyline points='8 6 2 12 8 18'></polyline></svg>",
    pricing: "Freemium",
    verified: true,
    featured: false
  },
  {
    id: "t-007",
    name: "Perplexity",
    description: "AI-powered answer engine that searches the web and provides cited answers.",
    category: "AI Research",
    tags: ["Search", "Education", "Information"],
    website: "https://www.perplexity.ai",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='11' cy='11' r='8'></circle><line x1='21' y1='21' x2='16.65' y2='16.65'></line></svg>",
    pricing: "Freemium",
    verified: true,
    featured: true
  },
  {
    id: "t-008",
    name: "Synthesia",
    description: "Create professional AI videos from text in 130+ languages with AI avatars.",
    category: "AI Video",
    tags: ["Marketing", "Presentations", "Media"],
    website: "https://www.synthesia.io",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polygon points='23 7 16 12 23 17 23 7'></polygon><rect x='1' y='5' width='15' height='14' rx='2' ry='2'></rect></svg>",
    pricing: "Paid",
    verified: true,
    featured: false
  },
  {
    id: "t-009",
    name: "Runway",
    description: "Advancing creativity with artificial intelligence. Generate video from text or images.",
    category: "AI Video",
    tags: ["VFX", "Generation", "Creative"],
    website: "https://runwayml.com",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polygon points='23 7 16 12 23 17 23 7'></polygon><rect x='1' y='5' width='15' height='14' rx='2' ry='2'></rect></svg>",
    pricing: "Freemium",
    verified: true,
    featured: true
  },
  {
    id: "t-010",
    name: "ElevenLabs",
    description: "The most realistic AI voice generator and text to speech software.",
    category: "AI Audio",
    tags: ["Voice", "TTS", "Media"],
    website: "https://elevenlabs.io",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z'></path><path d='M19 10v2a7 7 0 0 1-14 0v-2'></path><line x1='12' y1='19' x2='12' y2='23'></line><line x1='8' y1='23' x2='16' y2='23'></line></svg>",
    pricing: "Freemium",
    verified: true,
    featured: false
  },
  {
    id: "t-011",
    name: "Notion AI",
    description: "Access the limitless power of AI, right inside Notion. Work faster and write better.",
    category: "AI Productivity",
    tags: ["Notes", "Writing", "Workflow"],
    website: "https://www.notion.so/product/ai",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path><polyline points='14 2 14 8 20 8'></polyline><line x1='16' y1='13' x2='8' y2='13'></line><line x1='16' y1='17' x2='8' y2='17'></line><polyline points='10 9 9 9 8 9'></polyline></svg>",
    pricing: "Paid",
    verified: true,
    featured: false
  },
  {
    id: "t-012",
    name: "Canva Magic Studio",
    description: "All the power of AI, all in one place. Generate designs, presentations, and images.",
    category: "AI Design",
    tags: ["Graphics", "Presentations", "Marketing"],
    website: "https://www.canva.com/magic",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 19l7-7 3 3-7 7-3-3z'></path><path d='M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z'></path><path d='M2 2l7.586 7.586'></path><circle cx='11' cy='11' r='2'></circle></svg>",
    pricing: "Freemium",
    verified: true,
    featured: true
  },
  {
    id: "t-013",
    name: "Gamma",
    description: "A new medium for presenting ideas. Powered by AI. Generate docs, decks and webpages.",
    category: "AI Productivity",
    tags: ["Presentations", "Business", "Design"],
    website: "https://gamma.app",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect><line x1='3' y1='9' x2='21' y2='9'></line><line x1='9' y1='21' x2='9' y2='9'></line></svg>",
    pricing: "Freemium",
    verified: true,
    featured: false
  },
  {
    id: "t-014",
    name: "Luma Dream Machine",
    description: "Next generation video generation model that creates high quality realistic shots.",
    category: "AI Video",
    tags: ["Generation", "Media", "Creative"],
    website: "https://lumalabs.ai/dream-machine",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polygon points='23 7 16 12 23 17 23 7'></polygon><rect x='1' y='5' width='15' height='14' rx='2' ry='2'></rect></svg>",
    pricing: "Freemium",
    verified: true,
    featured: false
  },
  {
    id: "t-015",
    name: "Suno",
    description: "Make a song about anything. AI music generation that creates full tracks with vocals.",
    category: "AI Audio",
    tags: ["Music", "Generation", "Creative"],
    website: "https://suno.com",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M9 18V5l12-2v13'></path><circle cx='6' cy='18' r='3'></circle><circle cx='18' cy='16' r='3'></circle></svg>",
    pricing: "Freemium",
    verified: true,
    featured: true
  },
  {
    id: "t-016",
    name: "Grammarly",
    description: "AI writing partner that helps you write clearly and effectively everywhere you type.",
    category: "AI Writing",
    tags: ["Editing", "Productivity", "Education"],
    website: "https://www.grammarly.com",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path><polyline points='14 2 14 8 20 8'></polyline><line x1='16' y1='13' x2='8' y2='13'></line><line x1='16' y1='17' x2='8' y2='17'></line><polyline points='10 9 9 9 8 9'></polyline></svg>",
    pricing: "Freemium",
    verified: true,
    featured: false
  },
  {
    id: "t-017",
    name: "Vercel v0",
    description: "Generative UI system by Vercel. Describe a UI and get functional React code.",
    category: "AI Coding",
    tags: ["UI", "Frontend", "Developer"],
    website: "https://v0.dev",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='16 18 22 12 16 6'></polyline><polyline points='8 6 2 12 8 18'></polyline></svg>",
    pricing: "Freemium",
    verified: true,
    featured: false
  },
  {
    id: "t-018",
    name: "Hugging Face",
    description: "The AI community building the future. Discover models, datasets, and applications.",
    category: "AI Developer",
    tags: ["Community", "Models", "Open Source"],
    website: "https://huggingface.co",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'></circle><path d='M8 14s1.5 2 4 2 4-2 4-2'></path><line x1='9' y1='9' x2='9.01' y2='9'></line><line x1='15' y1='9' x2='15.01' y2='9'></line></svg>",
    pricing: "Free",
    verified: true,
    featured: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('ai-grid');
  const searchInput = document.getElementById('ai-search');
  const clearBtn = document.getElementById('ai-search-clear');
  const filterBtns = document.querySelectorAll('.hub-filter-btn');
  const resultCounter = document.getElementById('ai-result-count');
  const emptyState = document.getElementById('ai-empty-state');
  
  // Use Case chips
  const useCaseChips = document.querySelectorAll('.use-case-card');

  let currentCategory = 'All';
  let searchQuery = '';

  function renderTools(tools) {
    if (!grid) return;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Update counter
    if (resultCounter) {
      resultCounter.textContent = "Showing " + tools.length + " AI tool" + (tools.length !== 1 ? "s" : "");
    }

    if (tools.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      grid.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';

    const fragment = document.createDocumentFragment();

    tools.forEach(tool => {
      const card = document.createElement('a');
      card.href = tool.website;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'hub-card ai-card';
      
      const badgeHtml = tool.featured ? "<span class='hub-card-badge featured-badge' style='background: rgba(255,215,0,0.1); color: gold; border: 1px solid rgba(255,215,0,0.3);'>Featured</span>" : 
                        (tool.pricing ? "<span class='hub-card-badge'>" + tool.pricing + "</span>" : "");
      
      const verifiedHtml = tool.verified ? "<span class='verified-icon' title='Verified Official' style='color: #3b82f6; margin-left: 4px;'><svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg></span>" : "";

      card.innerHTML = "<div class='ai-card-header' style='display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.5rem 0;'>" +
            "<div class='hub-card-icon ai-card-icon' style='padding: 0; color: var(--hub-accent); font-size: 2.5rem; background: var(--hub-surface); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid var(--hub-border);'>" + tool.icon + "</div>" +
            "<div class='ai-card-badges'>" +
                badgeHtml +
            "</div>" +
        "</div>" +
        "<div class='hub-card-content'>" +
          "<h3 class='hub-card-title' style='display: flex; align-items: center;'>" + tool.name + " " + verifiedHtml + "</h3>" +
          "<p class='hub-card-desc'>" + tool.description + "</p>" +
          
          "<div class='ai-card-tags' style='display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;'>" +
            "<span class='ai-tag category-tag' style='background: rgba(59,130,246,0.1); color: var(--hub-accent); padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 600;'>" + tool.category + "</span>" +
            tool.tags.map(tag => "<span class='ai-tag' style='background: var(--hub-surface); color: var(--hub-text-secondary); border: 1px solid var(--hub-border); padding: 4px 10px; border-radius: 50px; font-size: 0.75rem;'>" + tag + "</span>").join('') +
          "</div>" +
        "</div>" +
        "<div class='hub-card-footer'>" +
          "<span class='hub-btn primary ai-visit-btn' style='width: 100%;'>Open Tool <span style='margin-left: 4px;'>-></span></span>" +
        "</div>";
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  function filterData() {
    let filtered = aiToolsData;

    // Apply Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Apply Category
    if (currentCategory !== 'All') {
      filtered = filtered.filter(t => t.category === currentCategory);
    }

    renderTools(filtered);
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
      }
      filterData();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      filterData();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked
      btn.classList.add('active');
      
      currentCategory = btn.dataset.filter;
      filterData();
    });
  });

  useCaseChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const searchTerm = chip.dataset.search;
      if (searchInput) {
        searchInput.value = searchTerm;
        searchQuery = searchTerm;
        if (clearBtn) clearBtn.style.display = 'flex';
        
        // Reset category to All
        currentCategory = 'All';
        filterBtns.forEach(b => {
            if(b.dataset.filter === 'All') b.classList.add('active');
            else b.classList.remove('active');
        });
        
        filterData();
        
        // Scroll to grid
        document.getElementById('ai-search-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Initial render
  filterData();
});
