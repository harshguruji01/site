const learningData = [
  {
    id: "lrn-001",
    title: "Chemical Reactions and Equations",
    description: "Complete notes and revision material for Class 10 Science.",
    classLevel: "Class 10",
    subject: "Science",
    type: "Notes",
    route: "learning/class-10-science.html",
    featured: true
  },
  {
    id: "lrn-002",
    title: "Polynomials & Algebra Practice",
    description: "Practice questions and step-by-step solutions for Algebra.",
    classLevel: "Class 9",
    subject: "Mathematics",
    type: "Practice",
    route: "learning/class-9-math.html",
    featured: true
  },
  {
    id: "lrn-003",
    title: "General Knowledge Quiz",
    description: "Test your general knowledge with this quick interactive quiz.",
    classLevel: "All Classes",
    subject: "General Knowledge",
    type: "Quiz",
    route: "learning/gk-quiz.html",
    featured: true
  }
];

const availableSubjects = {
    "All Classes": ["General Knowledge"],
    "Class 10": ["Science", "Mathematics", "Social Science", "English", "Hindi"],
    "Class 9": ["Mathematics", "Science", "Social Science", "English", "Hindi"]
};

document.addEventListener('DOMContentLoaded', () => {
  const classSelect = document.getElementById('class-select');
  const subjectContainer = document.getElementById('subject-container');
  const resourceGrid = document.getElementById('learning-grid');
  const searchInput = document.getElementById('learning-search');
  const clearBtn = document.getElementById('learning-search-clear');
  const resultCounter = document.getElementById('learning-result-count');
  const emptyState = document.getElementById('learning-empty-state');
  
  let currentClass = 'All Classes';
  let currentSubject = 'All';
  let searchQuery = '';

  function initURLParams() {
      const params = new URLSearchParams(window.location.search);
      const search = params.get('search');
      const cls = params.get('class');
      const sub = params.get('subject');

      if (search) {
          searchInput.value = search;
          searchQuery = search;
          if (clearBtn) clearBtn.style.display = 'flex';
      }
      
      if (cls && classSelect.querySelector(`option[value="${cls}"]`)) {
          classSelect.value = cls;
          currentClass = cls;
      }
      
      renderSubjects();
      
      if (sub) {
          currentSubject = sub;
          // select the button
          setTimeout(() => {
              const btn = document.querySelector(`.hub-filter-btn[data-subject="${sub}"]`);
              if(btn) {
                  document.querySelectorAll('.hub-filter-btn').forEach(b => b.classList.remove('active'));
                  btn.classList.add('active');
              }
          }, 50);
      }
  }

  function renderSubjects() {
      if(!subjectContainer) return;
      subjectContainer.innerHTML = '';
      
      // Always add All Subjects
      const allBtn = document.createElement('button');
      allBtn.className = 'hub-filter-btn' + (currentSubject === 'All' ? ' active' : '');
      allBtn.dataset.subject = 'All';
      allBtn.textContent = 'All Subjects';
      allBtn.onclick = () => setSubject('All', allBtn);
      subjectContainer.appendChild(allBtn);

      const subjects = availableSubjects[currentClass] || [];
      
      subjects.forEach(sub => {
          const btn = document.createElement('button');
          btn.className = 'hub-filter-btn' + (currentSubject === sub ? ' active' : '');
          btn.dataset.subject = sub;
          btn.textContent = sub;
          btn.onclick = () => setSubject(sub, btn);
          subjectContainer.appendChild(btn);
      });
  }

  function setSubject(sub, btnElement) {
      currentSubject = sub;
      document.querySelectorAll('#subject-container .hub-filter-btn').forEach(b => b.classList.remove('active'));
      if(btnElement) btnElement.classList.add('active');
      filterData();
  }

  function getTypeIcon(type) {
      if(type === 'Notes') return '📝';
      if(type === 'Practice') return '✏️';
      if(type === 'Quiz') return '❓';
      return '📚';
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
      card.href = res.route;
      card.className = 'hub-card tool-card';
      
      const typeIcon = getTypeIcon(res.type);
      const featuredBadge = res.featured ? "<span class='hub-card-badge' style='background: rgba(255,215,0,0.1); color: gold; border: 1px solid rgba(255,215,0,0.3); font-size: 0.7rem;'>Featured</span>" : "";

      card.innerHTML = "<div class='tool-card-header' style='display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 1.5rem 0;'>" +
            "<div style='font-size: 2rem;'>" + typeIcon + "</div>" +
            "<div class='tool-card-badges'>" + featuredBadge + "</div>" +
        "</div>" +
        "<div class='hub-card-content'>" +
          "<div style='color: var(--hub-text-secondary); font-size: 0.8rem; margin-bottom: 0.5rem;'>" + res.classLevel + " &bull; " + res.subject + "</div>" +
          "<h3 class='hub-card-title' style='margin-bottom: 0.5rem;'>" + res.title + "</h3>" +
          "<p class='hub-card-desc'>" + res.description + "</p>" +
          "<div style='margin-top: 1rem;'>" +
            "<span style='background: rgba(59,130,246,0.1); color: var(--hub-accent); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;'>" + res.type + "</span>" +
          "</div>" +
        "</div>" +
        "<div class='hub-card-footer'>" +
          "<span class='hub-btn primary tool-visit-btn' style='width: 100%;'>Open " + res.type + "</span>" +
        "</div>";
      fragment.appendChild(card);
    });

    resourceGrid.appendChild(fragment);
  }

  function filterData() {
    let filtered = learningData;

    // Filter by Class
    if (currentClass !== 'All Classes') {
      filtered = filtered.filter(r => r.classLevel === currentClass || r.classLevel === 'All Classes');
    }

    // Filter by Subject
    if (currentSubject !== 'All') {
      filtered = filtered.filter(r => r.subject === currentSubject);
    }

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.classLevel.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
      );
    }

    renderResources(filtered);
  }

  // Event Listeners
  if (classSelect) {
      classSelect.addEventListener('change', (e) => {
          currentClass = e.target.value;
          currentSubject = 'All'; // reset subject when class changes
          renderSubjects();
          filterData();
      });
  }

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

  // Topic Card quick links
  document.querySelectorAll('.topic-card').forEach(card => {
      card.addEventListener('click', () => {
          const s = card.dataset.search;
          if(searchInput) searchInput.value = s;
          searchQuery = s;
          if (clearBtn) clearBtn.style.display = 'flex';
          filterData();
          document.getElementById('learning-search-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
  });

  // Init
  initURLParams();
  filterData();
});
