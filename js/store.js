// js/store.js

const mockProducts = [
  {
    id: 1,
    title: "Advanced React Component Patterns",
    category: "coding",
    categoryLabel: "Coding Resources",
    desc: "Master modern React with this comprehensive 200-page e-book covering hooks, context, and performance.",
    price: "$29.00",
    isFree: false,
    rating: 4.9,
    reviews: 128,
    author: "HarshGuruJi",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Python Data Science Cheat Sheet",
    category: "pdf",
    categoryLabel: "PDF Collections",
    desc: "A quick reference guide for Pandas, NumPy, and Matplotlib. Perfect for quick revisions.",
    price: "Free",
    isFree: true,
    rating: 4.7,
    reviews: 450,
    author: "Community",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "AI Prompt Engineering Guide",
    category: "ai",
    categoryLabel: "AI Tools",
    desc: "Learn how to write perfect prompts for ChatGPT, Midjourney, and Claude to get exactly what you want.",
    price: "$15.00",
    isFree: false,
    rating: 4.8,
    reviews: 89,
    author: "HarshGuruJi",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Ultimate Cyber Security Roadmap 2026",
    category: "cyber",
    categoryLabel: "Cyber Security",
    desc: "Step-by-step guide to becoming an ethical hacker. Includes tools, resources, and certification paths.",
    price: "Free",
    isFree: true,
    rating: 5.0,
    reviews: 312,
    author: "HarshGuruJi",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Premium Glassmorphism UI Kit",
    category: "ui",
    categoryLabel: "UI Kits",
    desc: "100+ ready-to-use Figma components featuring modern glassmorphism design trends.",
    price: "$49.00",
    isFree: false,
    rating: 4.9,
    reviews: 56,
    author: "Design Studio",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Top 100 JavaScript Interview Questions",
    category: "notes",
    categoryLabel: "Study Notes",
    desc: "Frequently asked JS questions in FAANG interviews, complete with detailed explanations and code.",
    price: "Free",
    isFree: true,
    rating: 4.8,
    reviews: 890,
    author: "Community",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop"
  }
];

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  if (products.length === 0) {
    grid.innerHTML = `<p style="color:var(--store-text-muted); grid-column: 1/-1;">No products found matching your criteria.</p>`;
    return;
  }

  products.forEach(p => {
    const badgeHtml = p.isFree 
      ? `<span class="badge-free">FREE</span>` 
      : `<span class="badge-premium">PREMIUM</span>`;
      
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
        <div class="product-badges">${badgeHtml}</div>
      </div>
      <div class="product-content">
        <div class="product-category">${p.categoryLabel}</div>
        <div class="product-title">${p.title}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">${p.price}</div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn-preview" onclick="openModal(${p.id})">Preview</button>
            <button class="btn-buy" onclick="showToast('${p.isFree ? 'Downloaded' : 'Added to Cart'}!')">${p.isFree ? 'Get' : 'Buy'}</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openModal(id) {
  const p = mockProducts.find(x => x.id === id);
  if(!p) return;
  
  document.getElementById('modal-img').src = p.image;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-author').textContent = `By ${p.author}`;
  document.getElementById('modal-rating').textContent = `⭐ ${p.rating} (${p.reviews} reviews)`;
  document.getElementById('modal-desc').textContent = p.desc;
  
  const modal = document.getElementById('product-modal');
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('active');
}

function showToast(msg) {
  const toast = document.getElementById('store-toast');
  if(toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(mockProducts);

  // Search Logic
  const searchInput = document.getElementById('store-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = mockProducts.filter(p => p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term));
      renderProducts(filtered);
    });
  }

  // Filter Logic (Sidebar)
  const filters = document.querySelectorAll('.filter-checkbox');
  filters.forEach(cb => {
    cb.addEventListener('change', () => {
      const activeFilters = Array.from(filters).filter(x => x.checked).map(x => x.value);
      if (activeFilters.length === 0) {
        renderProducts(mockProducts);
      } else {
        const filtered = mockProducts.filter(p => {
          if (activeFilters.includes('free') && p.isFree) return true;
          if (activeFilters.includes('premium') && !p.isFree) return true;
          if (activeFilters.includes(p.category)) return true;
          return false;
        });
        renderProducts(filtered);
      }
    });
  });
  // Scroll listener for back-to-top button
  const fabToTop = document.getElementById('fab-totop');
  if (fabToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        fabToTop.classList.add('visible');
      } else {
        fabToTop.classList.remove('visible');
      }
    });
  }
});

function toggleMobileFilters() {
  const sidebar = document.getElementById('store-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.toggleMobileFilters = toggleMobileFilters;
