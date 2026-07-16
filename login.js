document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('password');
  const togglePwd = document.getElementById('toggle-pwd');
  const capsWarning = document.getElementById('caps-warning');
  const btnLogin = document.getElementById('btn-login');
  const btnText = btnLogin.querySelector('.btn-text');
  const btnLoader = btnLogin.querySelector('.btn-loader');
  const globalError = document.getElementById('global-error');
  
  // Toggle Password Visibility
  togglePwd.addEventListener('click', () => {
    const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
    pwdInput.setAttribute('type', type);
    togglePwd.textContent = type === 'password' ? '🙈' : '👁';
  });

  // Caps Lock Detection
  pwdInput.addEventListener('keyup', (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      capsWarning.style.display = 'block';
    } else {
      capsWarning.style.display = 'none';
    }
  });

  // Basic Validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    // Email
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
      emailInput.closest('.input-group').classList.add('invalid');
      isValid = false;
    } else {
      emailInput.closest('.input-group').classList.remove('invalid');
    }

    // Password
    if (!pwdInput.value) {
      pwdInput.closest('.input-group').classList.add('invalid');
      isValid = false;
    } else {
      pwdInput.closest('.input-group').classList.remove('invalid');
    }

    return isValid;
  };

  // Live Validation Removal
  emailInput.addEventListener('input', () => {
    emailInput.closest('.input-group').classList.remove('invalid');
    globalError.style.display = 'none';
  });
  pwdInput.addEventListener('input', () => {
    pwdInput.closest('.input-group').classList.remove('invalid');
    globalError.style.display = 'none';
  });

  // Form Submit Simulation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Show loading
      btnLogin.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'block';
      globalError.style.display = 'none';
      
      // Simulate API Call / Firebase Auth
      setTimeout(() => {
        // Success Mock (Redirect to Dashboard)
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      // Shake animation on form container for general error
      form.style.animation = 'none';
      form.offsetHeight; /* trigger reflow */
      form.style.animation = 'shake 0.4s';
    }
  });
});
