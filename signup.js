document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const nameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('password');
  const confirmPwdInput = document.getElementById('confirm-password');
  const togglePwd = document.getElementById('toggle-pwd');
  const capsWarning = document.getElementById('caps-warning');
  
  const strengthFill = document.getElementById('strength-fill');
  const strengthText = document.getElementById('strength-text');
  const termsCheckbox = document.getElementById('terms');
  
  const btnSignup = document.getElementById('btn-signup');
  const btnText = btnSignup.querySelector('.btn-text');
  const btnLoader = btnSignup.querySelector('.btn-loader');
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

  // Password Strength Meter
  pwdInput.addEventListener('input', () => {
    const val = pwdInput.value;
    let strength = 0;
    
    if (val.length >= 8) strength += 1;
    if (val.match(/[a-z]+/)) strength += 1;
    if (val.match(/[A-Z]+/)) strength += 1;
    if (val.match(/[0-9]+/)) strength += 1;
    if (val.match(/[$@#&!]+/)) strength += 1;

    strengthFill.className = 'strength-fill'; // Reset classes
    
    if (val.length === 0) {
      strengthFill.style.width = '0%';
      strengthText.textContent = '';
    } else if (strength <= 2) {
      strengthFill.style.width = '25%';
      strengthFill.classList.add('strength-weak');
      strengthText.textContent = 'Weak';
      strengthText.style.color = 'var(--error-color)';
    } else if (strength === 3) {
      strengthFill.style.width = '50%';
      strengthFill.classList.add('strength-fair');
      strengthText.textContent = 'Fair';
      strengthText.style.color = '#fbbf24';
    } else if (strength === 4) {
      strengthFill.style.width = '75%';
      strengthFill.classList.add('strength-good');
      strengthText.textContent = 'Good';
      strengthText.style.color = '#60a5fa';
    } else {
      strengthFill.style.width = '100%';
      strengthFill.classList.add('strength-strong');
      strengthText.textContent = 'Strong';
      strengthText.style.color = 'var(--success-color)';
    }
  });

  // Basic Validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let isValid = true;
    
    // Name
    if (!nameInput.value.trim()) {
      nameInput.closest('.input-group').classList.add('invalid');
      isValid = false;
    }
    
    // Email
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
      emailInput.closest('.input-group').classList.add('invalid');
      isValid = false;
    }

    // Password
    if (pwdInput.value.length < 8) {
      pwdInput.closest('.input-group').classList.add('invalid');
      isValid = false;
    }

    // Confirm Password
    if (!confirmPwdInput.value || confirmPwdInput.value !== pwdInput.value) {
      confirmPwdInput.closest('.input-group').classList.add('invalid');
      isValid = false;
    }
    
    // Terms
    const termsError = document.getElementById('terms-error');
    if (!termsCheckbox.checked) {
      termsError.style.display = 'block';
      isValid = false;
    } else {
      termsError.style.display = 'none';
    }

    return isValid;
  };

  // Live Validation Removal
  const inputs = [nameInput, emailInput, pwdInput, confirmPwdInput];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.input-group').classList.remove('invalid');
      globalError.style.display = 'none';
    });
  });
  
  termsCheckbox.addEventListener('change', () => {
    document.getElementById('terms-error').style.display = 'none';
  });

  // Form Submit Simulation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Show loading
      btnSignup.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'block';
      globalError.style.display = 'none';
      
      // Simulate API Call / Firebase Auth
      setTimeout(() => {
        // Success Mock (Redirect to Dashboard)
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      // Shake animation on form container
      form.style.animation = 'none';
      form.offsetHeight; 
      form.style.animation = 'shake 0.4s';
    }
  });
});
