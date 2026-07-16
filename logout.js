document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('btn-logout');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const btnText = logoutBtn.querySelector('.btn-text');
      const loader = logoutBtn.querySelector('.logout-loader');
      
      if (btnText && loader) {
        btnText.style.display = 'none';
        loader.style.display = 'block';
        logoutBtn.style.pointerEvents = 'none'; // Prevent double clicking
      }

      // Simulate a small delay for a smooth visual transition
      setTimeout(() => {
        // Perform logout actions, like clearing session data
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
        
        // Redirect to login page
        window.location.href = 'login.html';
      }, 800);
    });
  }
});
