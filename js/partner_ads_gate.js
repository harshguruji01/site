document.addEventListener('DOMContentLoaded', () => {
  const gateContainer = document.getElementById('permission-gate-container');
  const mainContent = document.getElementById('ads-main-content');
  
  if (!gateContainer || !mainContent) return;

  // If already verified in this session, show main content immediately
  if (sessionStorage.getItem('partner_ads_verified') === 'true') {
    gateContainer.style.display = 'none';
    mainContent.style.display = 'block';
    // Dispatch custom event for ads-manager
    window.dispatchEvent(new Event('PartnerAdsVerified'));
    return;
  }

  // Steps
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const step4 = document.getElementById('step-4');

  // Helper to switch steps
  const switchStep = (current, next) => {
    current.classList.remove('active');
    setTimeout(() => {
      next.classList.add('active');
    }, 50); // slight delay for animation
  };

  // Step 1: 18+ Check
  document.getElementById('btn-back-1')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  document.getElementById('btn-next-1')?.addEventListener('click', () => {
    switchStep(step1, step2);
  });

  // Step 2: Warning
  document.getElementById('btn-back-2')?.addEventListener('click', () => {
    switchStep(step2, step1);
  });
  document.getElementById('btn-next-2')?.addEventListener('click', () => {
    switchStep(step2, step3);
  });

  // Step 3: Checkboxes
  const check1 = document.getElementById('check-1');
  const check2 = document.getElementById('check-2');
  const check3 = document.getElementById('check-3');
  const btnNext3 = document.getElementById('btn-next-3');

  const updateCheckboxState = () => {
    if (check1.checked && check2.checked && check3.checked) {
      btnNext3.classList.remove('disabled');
      btnNext3.removeAttribute('disabled');
    } else {
      btnNext3.classList.add('disabled');
      btnNext3.setAttribute('disabled', 'true');
    }
  };

  if (check1 && check2 && check3) {
    [check1, check2, check3].forEach(chk => {
      chk.addEventListener('change', updateCheckboxState);
    });
  }

  document.getElementById('btn-back-3')?.addEventListener('click', () => {
    switchStep(step3, step2);
  });
  btnNext3?.addEventListener('click', () => {
    if (!btnNext3.hasAttribute('disabled')) {
      switchStep(step3, step4);
    }
  });

  // Step 4: Final Confirmation
  document.getElementById('btn-cancel-4')?.addEventListener('click', () => {
    // Cancel stays on ads.html but returns to step 1
    switchStep(step4, step1);
    if (check1 && check2 && check3) {
      check1.checked = false;
      check2.checked = false;
      check3.checked = false;
    }
    updateCheckboxState();
  });

  document.getElementById('btn-finish')?.addEventListener('click', () => {
    sessionStorage.setItem('partner_ads_verified', 'true');
    gateContainer.style.display = 'none';
    mainContent.style.display = 'block';
    window.dispatchEvent(new Event('PartnerAdsVerified'));
  });
});
