document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('btn-logout');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Perform logout actions, like clearing session data
      localStorage.removeItem('userToken');
      sessionStorage.removeItem('userToken');
      
      // Redirect to login page
      window.location.href = 'login.html';
    });
  }
});
