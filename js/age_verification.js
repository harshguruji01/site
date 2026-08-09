document.addEventListener('DOMContentLoaded', () => {
  const adsBtn = document.getElementById('hero-ads-btn');

  if (adsBtn) {
    // Redirect directly to ads.html where the new permission gate lives
    adsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'ads.html';
    });
  }
});
