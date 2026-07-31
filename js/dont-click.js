document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const entryScreen = document.getElementById('entry-screen');
  const confirmModal = document.getElementById('confirm-modal');
  const adPage = document.getElementById('ad-page');
  
  // Buttons
  const btnDeny = document.getElementById('btn-deny');
  const btnAllow = document.getElementById('btn-allow');
  const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
  const btnConfirmContinue = document.getElementById('btn-confirm-continue');
  
  // Header Controls
  const btnBack = document.getElementById('ctrl-back');
  const btnHome = document.getElementById('ctrl-home');
  const btnClose = document.getElementById('ctrl-close');
  const btnRefresh = document.getElementById('ctrl-refresh');
  const btnReport = document.getElementById('ctrl-report');
  
  // --- FLOW LOGIC ---

  // 1. Deny
  btnDeny.addEventListener('click', () => {
    btnDeny.innerHTML = 'Declining...';
    btnDeny.disabled = true;
    btnAllow.disabled = true;
    
    // Create and show decline message
    const msg = document.createElement('p');
    msg.innerText = "Advertisement viewing was declined. Redirecting...";
    msg.style.color = 'var(--accent-danger)';
    msg.style.marginTop = '1rem';
    msg.className = 'fade-in';
    document.querySelector('.button-group').appendChild(msg);

    setTimeout(() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    }, 1500);
  });

  // 2. Allow
  btnAllow.addEventListener('click', () => {
    // Hide warning, show modal
    document.querySelector('.warning-title').classList.add('hidden');
    document.querySelector('.warning-subtitle').classList.add('hidden');
    document.querySelector('.button-group').classList.add('hidden');
    
    confirmModal.classList.remove('hidden');
    confirmModal.classList.add('slide-up');
  });

  // 3. Confirm - Cancel
  btnConfirmCancel.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
  });

  // 4. Confirm - Continue (ENTER AD PAGE)
  btnConfirmContinue.addEventListener('click', () => {
    entryScreen.classList.add('fade-out');
    setTimeout(() => {
      entryScreen.classList.add('hidden');
      adPage.style.display = 'block';
      adPage.classList.add('fade-in');
      initAds();
    }, 400); // Wait for fade-out
  });

  // --- USER CONTROLS ---
  btnBack.addEventListener('click', () => { window.history.back(); });
  btnHome.addEventListener('click', () => { window.location.href = 'index.html'; });
  btnClose.addEventListener('click', () => { window.location.href = 'index.html'; });
  btnRefresh.addEventListener('click', () => { 
    // Simulate refreshing ads without full page reload for performance
    const adBlocks = document.querySelectorAll('.ad-block');
    adBlocks.forEach(ad => {
      ad.classList.add('shimmer');
      setTimeout(() => ad.classList.remove('shimmer'), 1500 + Math.random() * 1000);
    });
  });
  btnReport.addEventListener('click', () => {
    alert("Thank you for your report. We will review the advertisements on this page for compliance.");
  });

  // --- AD INITIALIZATION & LAZY LOADING ---
  function initAds() {
    const adBlocks = document.querySelectorAll('.ad-block');
    
    // Intersection Observer for lazy loading ads (simulated with shimmer)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ad = entry.target;
          if (!ad.dataset.loaded) {
            ad.dataset.loaded = 'true';
            ad.classList.add('shimmer');
            // Simulate ad load delay
            setTimeout(() => {
              ad.classList.remove('shimmer');
              // Real ad scripts would be executed here
            }, 1000 + Math.random() * 2000);
          }
        }
      });
    }, { rootMargin: '200px 0px' });

    adBlocks.forEach(ad => observer.observe(ad));
  }
});
