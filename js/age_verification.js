document.addEventListener('DOMContentLoaded', () => {
  const adsBtn = document.getElementById('hero-ads-btn');
  const modalOverlay = document.getElementById('age-modal-overlay');
  const radioInputs = document.querySelectorAll('input[name="age_verify"]');

  if (adsBtn && modalOverlay) {
    // Open modal on click
    adsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
    });

    // Handle radio button selections
    radioInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        
        // Add a slight delay so the user can see the checkmark animation
        setTimeout(() => {
          if (selectedValue === 'under_18') {
            // Redirect to home page (or just close modal)
            modalOverlay.classList.remove('active');
            window.location.href = 'index.html';
          } else if (selectedValue === 'over_18') {
            // User is eligible, redirect to ads page
            window.location.href = 'ads.html';
          }
        }, 600); // 600ms delay for visual feedback
      });
    });

    // Close modal if clicking outside the modal box
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        // Uncheck all radios when closed
        radioInputs.forEach(radio => radio.checked = false);
      }
    });
  }
});
