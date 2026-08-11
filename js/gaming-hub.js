const gameData = [
  {
    id: "gm-001",
    name: "Snake Classic",
    description: "The classic retro arcade snake game. Eat food to grow and don't hit the walls!",
    genre: "Arcade",
    categories: ["All", "PC", "Mobile", "Arcade", "Casual"],
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
    categories: ["All", "PC", "Mobile", "Puzzle", "Casual", "Educational"],
    tags: ["Brain", "Singleplayer"],
    route: "games/memory.html",
    platform: "Browser",
    featured: false
  },
  {
    id: "gm-003",
    name: "Tic Tac Toe",
    description: "Play the classic 3x3 grid game against a friend on the same device.",
    genre: "Board",
    categories: ["All", "PC", "Mobile", "Board", "Casual", "Multiplayer"],
    tags: ["Local Multiplayer", "Strategy"],
    route: "games/tic-tac-toe.html",
    platform: "Browser",
    featured: true
  },
  // Added accurate realistic games for educational discovery purposes
  {
    id: "gm-004",
    name: "Minecraft",
    description: "Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.",
    genre: "Survival",
    categories: ["All", "PC", "Console", "Mobile", "Adventure", "Survival", "Multiplayer", "Indie"],
    tags: ["Sandbox", "Crafting"],
    route: "https://www.minecraft.net/",
    platform: "Multi-Platform",
    featured: true
  },
  {
    id: "gm-005",
    name: "Counter-Strike 2",
    description: "For over two decades, Counter-Strike has offered an elite competitive experience.",
    genre: "Action",
    categories: ["All", "PC", "Action", "Esports", "Multiplayer"],
    tags: ["FPS", "Competitive"],
    route: "https://www.counter-strike.net/",
    platform: "PC",
    featured: true
  },
  {
    id: "gm-006",
    name: "Stardew Valley",
    description: "You've inherited your grandfather's old farm plot in Stardew Valley.",
    genre: "Simulation",
    categories: ["All", "PC", "Console", "Mobile", "Simulation", "Indie", "Casual"],
    tags: ["Farming", "RPG"],
    route: "https://www.stardewvalley.net/",
    platform: "Multi-Platform",
    featured: false
  },
  {
    id: "gm-007",
    name: "Dota 2",
    description: "Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes.",
    genre: "Strategy",
    categories: ["All", "PC", "Strategy", "Esports", "Multiplayer", "Action"],
    tags: ["MOBA", "Competitive"],
    route: "https://www.dota2.com/",
    platform: "PC",
    featured: false
  },
  {
    id: "gm-008",
    name: "Rocket League",
    description: "A high-powered hybrid of arcade-style soccer and vehicular mayhem.",
    genre: "Sports",
    categories: ["All", "PC", "Console", "Sports", "Racing", "Esports", "Multiplayer"],
    tags: ["Vehicular", "Competitive"],
    route: "https://www.rocketleague.com/",
    platform: "Multi-Platform",
    featured: false
  },
  {
    id: "gm-009",
    name: "Portal 2",
    description: "The "Portal" series draws from the award-winning formula of innovative gameplay, story, and music.",
    genre: "Puzzle",
    categories: ["All", "PC", "Console", "Puzzle", "Adventure"],
    tags: ["Co-op", "Physics"],
    route: "https://www.thinkwithportals.com/",
    platform: "PC, Console",
    featured: true
  },
  {
    id: "gm-010",
    name: "Unity Learn",
    description: "Official tutorials and courses for the Unity game engine.",
    genre: "Educational",
    categories: ["All", "Game Development", "Game Engines", "Educational"],
    tags: ["Tutorial", "Development"],
    route: "https://learn.unity.com/",
    platform: "Web",
    featured: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const gameGrid = document.getElementById('game-grid');
  const featuredGrid = document.getElementById('featured-games-grid');
  const searchInput = document.getElementById('game-search');
  const clearBtn = document.getElementById('game-search-clear');
  const filterBtns = document.querySelectorAll('.hub-filter-btn');
  const resultCounter = document.getElementById('game-result-count');
  const emptyState = document.getElementById('game-empty-state');
  const sortSelect = document.getElementById('game-sort');
  
  let currentCategory = 'All';
  let searchQuery = '';
  let currentSort = 'recommended';
  let debounceTimer;

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
          updateFilterButtons(cat);
      }
  }

  function updateFilterButtons(cat) {
    filterBtns.forEach(b => {
        if (b.dataset.filter === cat) b.classList.add('active');
        else b.classList.remove('active');
    });
  }

  function getGenreIcon(genre) {
      if(genre === 'Arcade') return '🕹️';
      if(genre === 'Puzzle') return '🧩';
      if(genre === 'Board') return '🎲';
      if(genre === 'Racing') return '🏎️';
      if(genre === 'Action') return '⚔️';
      if(genre === 'Adventure') return '🗺️';
      if(genre === 'Strategy') return '♟️';
      if(genre === 'Simulation') return '🏗️';
      if(genre === 'Sports') return '⚽';
      if(genre === 'Survival') return '🏕️';
      if(genre === 'Educational') return '📚';
      return '🎮';
  }

  function createGameCard(game) {
      const card = document.createElement('a');
      const isExternal = game.route.startsWith('http');
      card.href = game.route;
      if (isExternal) {
          card.target = '_blank';
          card.rel = 'noopener noreferrer';
      }
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
          "<span class='hub-btn primary tool-visit-btn' style='width: 100%;'>" + (isExternal ? "Official Page →" : "Play Now →") + "</span>" +
        "</div>";
      return card;
  }

  function renderFeaturedGames() {
    if (!featuredGrid) return;
    featuredGrid.innerHTML = '';
    const featured = gameData.filter(g => g.featured).slice(0, 4);
    featured.forEach(game => {
        featuredGrid.appendChild(createGameCard(game));
    });
  }

  function renderGames(games) {
    if (!gameGrid) return;
    gameGrid.innerHTML = '';
    
    if (resultCounter) {
      resultCounter.textContent = "Showing " + games.length + " result" + (games.length !== 1 ? "s" : "");
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
      fragment.appendChild(createGameCard(game));
    });

    gameGrid.appendChild(fragment);
  }

  function filterAndSortData() {
    let filtered = gameData;

    // Filter by Category
    if (currentCategory !== 'All') {
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
        g.platform.toLowerCase().includes(q) ||
        g.categories.some(c => c.toLowerCase().includes(q))
      );
    }

    // Sort
    if (currentSort === 'az') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (currentSort === 'za') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (currentSort === 'recommended') {
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    renderGames(filtered);
  }

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = searchQuery.length > 0 ? 'flex' : 'none';
      }
      
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filterAndSortData();
      }, 300);
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
          updateFilterButtons(btn.dataset.filter);
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

  // Init
  initURLParams();
  renderFeaturedGames();
  filterAndSortData();
});
