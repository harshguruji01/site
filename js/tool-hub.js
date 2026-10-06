const toolData = [
  {
    id: "tl-001",
    name: "Word Counter",
    description: "Instantly count words, characters, sentences, and paragraphs in your text.",
    category: "Text Tools",
    categories: ["Text Tools", "Calculators"],
    tags: ["Text", "Utility", "Writing", "Count", "Calculator", "Word", "Character", "Length", "Stats"],
    route: "tools/word-counter.html",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'></path><path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'></path></svg>",
    featured: true
  },
  {
    id: "tl-002",
    name: "Case Converter",
    description: "Convert your text to UPPERCASE, lowercase, Title Case, or Sentence case easily.",
    category: "Converters",
    categories: ["Converters", "Text Tools"],
    tags: ["Text", "Format", "Utility", "Converter", "Converters", "Case", "Uppercase", "Lowercase", "Title Case"],
    route: "tools/case-converter.html",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='4 7 4 4 20 4 20 7'></polyline><line x1='9' y1='20' x2='15' y2='20'></line><line x1='12' y1='4' x2='12' y2='20'></line></svg>",
    featured: false
  },
  {
    id: "tl-003",
    name: "Password Generator",
    description: "Generate highly secure, random passwords directly in your browser.",
    category: "Generators",
    categories: ["Generators"],
    tags: ["Security", "Random", "Utility", "Generator", "Password", "Generate Values", "Key", "Credential"],
    route: "tools/password-generator.html",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect><path d='M7 11V7a5 5 0 0 1 10 0v4'></path></svg>",
    featured: true
  },
  {
    id: "tl-004",
    name: "JSON Formatter",
    description: "Format, beautify, minify and validate your JSON data instantly.",
    category: "Developer Tools",
    categories: ["Developer Tools"],
    tags: ["Developer", "Code", "Format", "Data", "Format Code", "JSON", "Beautify", "Minify", "Validate"],
    route: "tools/json-formatter.html",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='16 18 22 12 16 6'></polyline><polyline points='8 6 2 12 8 18'></polyline></svg>",
    featured: true
  },
  {
    id: "tl-005",
    name: "Base64 Encoder & Decoder",
    description: "Encode text to Base64 or decode Base64 to text locally in the browser.",
    category: "Converters",
    categories: ["Converters", "Developer Tools"],
    tags: ["Developer", "Security", "Data", "Encoding", "Converter", "Converters", "Base64", "Decode", "Encode"],
    route: "tools/base64.html",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'></circle><line x1='8' y1='12' x2='16' y2='12'></line></svg>",
    featured: false
  },
  {
    id: "tl-006",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index (BMI) and health category according to WHO criteria.",
    category: "Calculators",
    categories: ["Calculators"],
    tags: ["Calculator", "Calculators", "Health", "Fitness", "BMI", "Body Mass Index", "Math", "Weight", "Height"],
    route: "tools/bmi-calculator.html",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'></path></svg>",
    featured: true
  },
  {
    id: "tl-007",
    name: "Percentage Calculator",
    description: "Calculate percentages, percentage increases, discounts, and fractions instantly.",
    category: "Calculators",
    categories: ["Calculators"],
    tags: ["Calculator", "Calculators", "Math", "Percentage", "Calculation", "Finance", "Discount"],
    route: "tools/percentage-calculator.html",
    icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><line x1='19' y1='5' x2='5' y2='19'></line><circle cx='6.5' cy='6.5' r='2.5'></circle><circle cx='17.5' cy='17.5' r='2.5'></circle></svg>",
    featured: false
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('tool-grid') || document.getElementById('hub-grid');
  const searchInput = document.getElementById('tool-search') || document.getElementById('hub-search');
  const clearBtn = document.getElementById('tool-search-clear') || document.getElementById('hub-search-clear');
  const filterBtns = document.querySelectorAll('.hub-filter-btn');
  const resultCounter = document.getElementById('tool-result-count');
  const emptyState = document.getElementById('tool-empty-state') || document.getElementById('hub-empty-state');
  
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
      resultCounter.textContent = "Showing " + tools.length + " tool" + (tools.length !== 1 ? "s" : "");
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
      card.href = tool.route;
      card.className = 'hub-card tool-card';
      
      const badgeHtml = tool.featured ? "<span class='hub-card-badge featured-badge' style='background: rgba(255,215,0,0.1); color: gold; border: 1px solid rgba(255,215,0,0.3);'>Featured</span>" : "";

      card.innerHTML = "<div class='tool-card-header' style='display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.5rem 0;'>" +
            "<div class='hub-card-icon tool-card-icon' style='padding: 0; color: var(--hub-accent, #3b82f6); font-size: 2.5rem; background: var(--hub-surface, #1e2230); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid var(--hub-border, rgba(255,255,255,0.1));'>" + tool.icon + "</div>" +
            "<div class='tool-card-badges'>" +
                badgeHtml +
            "</div>" +
        "</div>" +
        "<div class='hub-card-content'>" +
          "<h3 class='hub-card-title'>" + tool.name + "</h3>" +
          "<p class='hub-card-desc'>" + tool.description + "</p>" +
          
          "<div class='tool-card-tags' style='display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;'>" +
            "<span class='tool-tag category-tag' style='background: rgba(59,130,246,0.1); color: var(--hub-accent, #60a5fa); padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 600;'>" + tool.category + "</span>" +
          "</div>" +
        "</div>" +
        "<div class='hub-card-footer'>" +
          "<span class='hub-btn primary tool-visit-btn' style='width: 100%;'>Open Tool</span>" +
        "</div>";
      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  function filterData() {
    let filtered = toolData;

    // Apply Search (Word-Tokenized Matching)
    if (searchQuery) {
      const tokens = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter(t => {
        const fullContent = (
          t.name + " " +
          t.description + " " +
          t.category + " " +
          (t.categories || []).join(" ") + " " +
          t.tags.join(" ")
        ).toLowerCase();
        
        return tokens.every(token => fullContent.includes(token));
      });
    }

    // Apply Category
    if (currentCategory !== 'All') {
      const catLower = currentCategory.toLowerCase();
      filtered = filtered.filter(t => {
        if (t.category.toLowerCase() === catLower) return true;
        if (t.categories && t.categories.some(c => c.toLowerCase() === catLower)) return true;
        if (catLower === 'developer' && t.category.toLowerCase().includes('developer')) return true;
        return false;
      });
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
        const searchSec = document.getElementById('tool-search-section') || document.querySelector('.hub-search-section');
        if (searchSec) {
          searchSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // URL param filtering support
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  const catParam = urlParams.get('category');
  
  if (searchParam) {
      if (searchInput) searchInput.value = searchParam;
      searchQuery = searchParam;
      if (clearBtn) clearBtn.style.display = 'flex';
  }
  
  if (catParam) {
      currentCategory = catParam;
      filterBtns.forEach(b => {
          if (b.dataset.filter === catParam) b.classList.add('active');
          else b.classList.remove('active');
      });
  }

  // Initial render
  filterData();
});
