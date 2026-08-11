const learningData = [
  {
    id: "lrn-001",
    title: "Chemical Reactions and Equations",
    description: "Complete notes and revision material for Class 10 Science.",
    subject: "Science",
    type: "Guide",
    difficulty: "Beginner",
    route: "learning/class-10-science.html",
    featured: true
  },
  {
    id: "lrn-002",
    title: "Polynomials & Algebra Practice",
    description: "Practice questions and step-by-step solutions for Algebra.",
    subject: "Mathematics",
    type: "Practice",
    difficulty: "Intermediate",
    route: "learning/class-9-math.html",
    featured: true
  },
  {
    id: "lrn-003",
    title: "General Knowledge Quiz",
    description: "Test your general knowledge with this quick interactive quiz.",
    subject: "General",
    type: "Quiz",
    difficulty: "Beginner",
    route: "learning/gk-quiz.html",
    featured: false
  },
  {
    id: "lrn-004",
    title: "Introduction to Python",
    description: "Learn the basics of Python programming, syntax, and simple logic.",
    subject: "Programming",
    type: "Video",
    difficulty: "Beginner",
    route: "https://www.python.org/about/gettingstarted/",
    featured: true
  },
  {
    id: "lrn-005",
    title: "Calculus Fundamentals",
    description: "Deep dive into limits, derivatives, and integrals.",
    subject: "Mathematics",
    type: "Guide",
    difficulty: "Advanced",
    route: "learning/calculus.html",
    featured: false
  },
  {
    id: "lrn-006",
    title: "Interactive Periodic Table",
    description: "Explore elements, properties, and trends dynamically.",
    subject: "Science",
    type: "Tool",
    difficulty: "Beginner",
    route: "https://ptable.com/",
    featured: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const resourceGrid = document.getElementById('learning-grid');
  const searchInput = document.getElementById('learning-search');
  const clearBtn = document.getElementById('learning-search-clear');
  const resultCounter = document.getElementById('learning-result-count');
  const emptyState = document.getElementById('learning-empty-state');
  
  // Filters
  const subjectSelect = document.getElementById('filter-subject');
  const typeSelect = document.getElementById('filter-type');
  const difficultySelect = document.getElementById('filter-difficulty');
  
  let searchQuery = '';

  function getTypeIcon(type) {
      if(type === 'Guide') return '📖';
      if(type === 'Practice') return '✏️';
      if(type === 'Quiz') return '❓';
      if(type === 'Tool') return '🔧';
      if(type === 'Video') return '🎥';
      if(type === 'Book') return '📚';
      return '📄';
  }

  function renderResources(resources) {
    if (!resourceGrid) return;
    
    resourceGrid.innerHTML = '';
    
    if (resultCounter) {
      resultCounter.textContent = "Showing " + resources.length + " resource" + (resources.length !== 1 ? "s" : "");
    }

    if (resources.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      resourceGrid.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    resourceGrid.style.display = 'grid';

    const fragment = document.createDocumentFragment();

    resources.forEach(res => {
      const card = document.createElement('a');
      const isExternal = res.route.startsWith('http');
      card.href = res.route;
      if (isExternal) {
          card.target = '_blank';
          card.rel = 'noopener noreferrer';
      }
      card.className = 'hub-card tool-card';
      
      const typeIcon = getTypeIcon(res.type);
      const featuredBadge = res.featured ? "<span class='hub-card-badge' style='background: rgba(255,215,0,0.1); color: gold; border: 1px solid rgba(255,215,0,0.3); font-size: 0.7rem;'>Featured</span>" : "";

      card.innerHTML = "<div class='tool-card-header' style='display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.5rem 0;'>" +
            "<div style='font-size: 2rem;'>" + typeIcon + "</div>" +
            "<div class='tool-card-badges'>" + featuredBadge + "</div>" +
        "</div>" +
        "<div class='hub-card-content'>" +
          "<div style='color: var(--hub-text-secondary); font-size: 0.8rem; margin-bottom: 0.5rem;'>" + res.subject + " &bull; " + res.difficulty + "</div>" +
          "<h3 class='hub-card-title' style='margin-bottom: 0.5rem;'>" + res.title + "</h3>" +
          "<p class='hub-card-desc'>" + res.description + "</p>" +
          "<div style='margin-top: 1rem;'>" +
            "<span style='background: rgba(59,130,246,0.1); color: var(--hub-accent); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;'>" + res.type + "</span>" +
          "</div>" +
        "</div>" +
        "<div class='hub-card-footer'>" +
          "<span class='hub-btn primary tool-visit-btn' style='width: 100%;'>Open " + res.type + " →</span>" +
        "</div>";
      fragment.appendChild(card);
    });

    resourceGrid.appendChild(fragment);
  }

  function filterData() {
    if (!resourceGrid) return;
    
    let filtered = learningData;

    // Apply Select Filters
    if (subjectSelect && subjectSelect.value !== 'All') {
      filtered = filtered.filter(r => r.subject === subjectSelect.value);
    }
    if (typeSelect && typeSelect.value !== 'All') {
      filtered = filtered.filter(r => r.type === typeSelect.value);
    }
    if (difficultySelect && difficultySelect.value !== 'All') {
      filtered = filtered.filter(r => r.difficulty === difficultySelect.value);
    }

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
    }

    renderResources(filtered);
  }

  // Search Event Listener (Debounced)
  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
      }
      
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filterData();
      }, 300);
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

  // Select Event Listeners
  if (subjectSelect) subjectSelect.addEventListener('change', filterData);
  if (typeSelect) typeSelect.addEventListener('change', filterData);
  if (difficultySelect) difficultySelect.addEventListener('change', filterData);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
      }
    });
  });

  // Accordion Logic
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(acc => {
    acc.addEventListener('click', function() {
      this.classList.toggle('active');
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Init
  filterData();
});
