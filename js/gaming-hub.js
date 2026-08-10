const gameData = [
  {
    id: "gm-001",
    name: "Snake Classic",
    description: "The classic retro arcade snake game. Eat food to grow and don't hit the walls!",
    genre: "Arcade",
    categories: ["All Games", "Arcade", "Casual"],
    tags: ["Classic", "Singleplayer"],
    route: "games/snake.html",
    platform: "Browser",
    featured: true
  },
  {
    id: "gm-002",
    name: "Memory Match",
    description: "Test your memory and match all pairs of cards as fast as possible.",
    genre: "Puzzle",
    categories: ["All Games", "Puzzle", "Casual", "Educational"],
    tags: ["Brain", "Singleplayer"],
    route: "games/memory.html",
    platform: "Browser",
    featured: true
  },
  {
    id: "gm-003",
    name: "Tic Tac Toe",
    description: "Play the classic 3x3 grid game against a friend on the same device.",
    genre: "Board",
    categories: ["All Games", "Board", "Casual", "Multiplayer"],
    tags: ["Local Multiplayer", "Strategy"],
    route: "games/tic-tac-toe.html",
    platform: "Browser",
    featured: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const gameGrid = document.getElementById('game-grid');
  const searchInput = document.getElementById('game-search');
  const clearBtn = document.getElementById('game-search-clear');
  const filterBtns = document.querySelectorAll('.hub-filter-btn');
  const resultCounter = document.getElementById('game-result-count');
  const emptyState = document.getElementById('game-empty-state');
  const sortSelect = document.getElementById('game-sort');
  
  let currentCategory = 'All Games';
  let searchQuery = '';
  let currentSort = 'recommended';

  function initURLParams() {
      const params = new URLSearchParams(window.location.search);
      const search = params.get('search');
      const cat = params.get('category');

      if (search) {
          if (searchInput) searchInput.value = search;
          searchQuery = search;
          if (clearBtn) clearBtn.style.display = 'flex';
      }
      
      if (cat) {
          currentCategory = cat;
          filterBtns.forEach(b => {
              if (b.dataset.filter === cat) b.classList.add('active');
              else b.classList.remove('active');
          });
      }
  }

  function getGenreIcon(genre) {
      if(genre === 'Arcade') return '🕹️';
      if(genre === 'Puzzle') return '🧩';
      if(genre === 'Board') return '🎲';
      if(genre === 'Racing') return '🏎️';
      if(genre === 'Action') return '⚔️';
      return '🎮';
  }

  function renderGames(games) {
    if (!gameGrid) return;
    
    gameGrid.innerHTML = '';
    
    if (resultCounter) {
      resultCounter.textContent = "Showing " + games.length + " game" + (games.length !== 1 ? "s" : "");
    }

    if (games.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      gameGrid.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    gameGrid.style.display = 'grid';

    const fragment = document.createDocumentFragment();

    games.forEach(game => {
      const card = document.createElement('a');
      card.href = game.route;
      card.className = 'hub-card tool-card';
      
      const genreIcon = getGenreIcon(game.genre);
      const featuredBadge = game.featured ? "<span class='hub-card-badge' style='background: rgba(255,215,0,0.1); color: gold; border: 1px solid rgba(255,215,0,0.3); font-size: 0.7rem;'>Featured</span>" : "";

      card.innerHTML = "<div class='tool-card-header' style='display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.5rem 0;'>" +
            "<div style='font-size: 2.5rem;'>" + genreIcon + "</div>" +
            "<div class='tool-card-badges'>" + featuredBadge + "</div>" +
        "</div>" +
        "<div class='hub-card-content'>" +
          "<h3 class='hub-card-title' style='margin-bottom: 0.25rem;'>" + game.name + "</h3>" +
          "<div style='color: var(--hub-accent); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.75rem;'>" + game.genre + " &bull; " + game.platform + "</div>" +
          "<p class='hub-card-desc'>" + game.description + "</p>" +
          "<div style='display:flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;'>" +
             game.tags.map(tag => "<span style='background: var(--hub-surface); border: 1px solid var(--hub-border); color: var(--hub-text-secondary); padding: 2px 8px; border-radius: 4px; font-size: 0.7rem;'>" + tag + "</span>").join('') +
          "</div>" +
        "</div>" +
        "<div class='hub-card-footer'>" +
          "<span class='hub-btn primary tool-visit-btn' style='width: 100%;'>Play Now →</span>" +
        "</div>";
      fragment.appendChild(card);
    });

    gameGrid.appendChild(fragment);
  }

  function filterAndSortData() {
    let filtered = gameData;

    // Filter by Category
    if (currentCategory !== 'All Games') {
      filtered = filtered.filter(g => g.categories.includes(currentCategory));
    }

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.description.toLowerCase().includes(q) ||
        g.genre.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q)) ||
        g.platform.toLowerCase().includes(q)
      );
    }

    // Sort
    if (currentSort === 'az') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'za') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderGames(filtered);
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (clearBtn) {
        clearBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
      }
      filterAndSortData();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      filterAndSortData();
    });
  }

  filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = btn.dataset.filter;
          filterAndSortData();
      });
  });

  if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
          currentSort = e.target.value;
          filterAndSortData();
      });
  }

  // Category Quick Links
  document.querySelectorAll('.topic-card').forEach(card => {
      card.addEventListener('click', () => {
          const cat = card.dataset.category;
          currentCategory = cat;
          filterBtns.forEach(b => {
              if (b.dataset.filter === cat) b.classList.add('active');
              else b.classList.remove('active');
          });
          filterAndSortData();
          document.getElementById('gaming-search-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
  });

  // Init
  initURLParams();
  filterAndSortData();
});
