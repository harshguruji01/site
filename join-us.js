document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginMsg = document.getElementById('login-msg');
  const signupMsg = document.getElementById('signup-msg');

  function setActiveTab(target){
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-target') === target));
    if(target === 'login'){
      loginForm.classList.remove('hidden'); signupForm.classList.add('hidden');
    } else {
      signupForm.classList.remove('hidden'); loginForm.classList.add('hidden');
    }
  }

  tabs.forEach(t => t.addEventListener('click', () => setActiveTab(t.getAttribute('data-target'))));

  // Show/Hide password
  document.querySelectorAll('.show-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if(!input) return;
      if(input.type === 'password'){ input.type = 'text'; btn.textContent = 'Hide'; }
      else { input.type = 'password'; btn.textContent = 'Show'; }
      input.focus();
    });
  });

  // Helper messages
  function showMsg(el, text, ok){
    if(!el) return; el.style.color = ok ? '#0ea5a4' : '#ef4444'; el.textContent = text; 
  }

  // Login submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMsg(loginMsg, 'Validating...', true);
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if(!email || !password){ showMsg(loginMsg, 'Please enter email and password.', false); return; }
    try{
      const res = await loginUser({ email, password });
      if(res.success){ setSession(res.user, document.getElementById('login-remember').checked); showMsg(loginMsg, 'Login successful — redirecting...', true); setTimeout(()=> window.location.href = 'index.html', 900); }
      else { showMsg(loginMsg, res.message || 'Login failed', false); }
    }catch(err){ showMsg(loginMsg, 'An error occurred.', false); console.error(err); }
  });

  // Signup submit
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showMsg(signupMsg, 'Checking details...', true);
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const mobile = document.getElementById('signup-mobile').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const terms = document.getElementById('signup-terms').checked;
    if(!name || !email || !mobile || !password || !confirm){ showMsg(signupMsg, 'Please fill all fields.', false); return; }
    if(password.length < 6){ showMsg(signupMsg,'Password must be at least 6 characters', false); return; }
    if(password !== confirm){ showMsg(signupMsg,'Passwords do not match', false); return; }
    if(!terms){ showMsg(signupMsg,'Please accept Terms & Conditions', false); return; }
    try{
      const res = await registerUser({ name, email, mobile, password });
      if(res.success){ showMsg(signupMsg, 'Account created — please log in.', true); setTimeout(()=> setActiveTab('login'), 900); }
      else showMsg(signupMsg, res.message || 'Signup failed', false);
    }catch(err){ showMsg(signupMsg, 'An error occurred.', false); console.error(err); }
  });

  // Social buttons (demo)
  document.querySelectorAll('.social.google').forEach(b => b.addEventListener('click', () => alert('Demo: Google sign-in is not configured.')));
  document.querySelectorAll('.social.fb').forEach(b => b.addEventListener('click', () => alert('Demo: Facebook sign-in is not configured.')));

  // Import account handler (reads JSON exported from another browser)
  const importInput = document.getElementById('import-account');
  const importBtn = document.getElementById('import-account-btn');
  const importMsg = document.getElementById('import-account-msg');
  if (importBtn && importInput) {
    importBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      importMsg.textContent = '';
      const file = importInput.files[0];
      if (!file) { importMsg.style.color = '#ff3366'; importMsg.textContent = 'Please choose a .json file exported from your account.'; return; }
      try {
        const text = await file.text();
        const obj = JSON.parse(text);
        if (window.importAccountObject) {
          const res = await importAccountObject(obj);
          if (res.success) {
            importMsg.style.color = '#10b981'; importMsg.textContent = 'Account imported and logged in successfully.';
            setTimeout(()=> window.location.href = 'index.html', 900);
          } else {
            importMsg.style.color = '#ff3366'; importMsg.textContent = res.message || 'Import failed.';
          }
        } else {
          importMsg.style.color = '#ff3366'; importMsg.textContent = 'Import API is not available.';
        }
      } catch (err) { importMsg.style.color = '#ff3366'; importMsg.textContent = 'Invalid file or JSON parsing failed.'; }
    });
  }

  // Keyboard accessibility: Enter submits
  document.querySelectorAll('.form input').forEach(inp => inp.addEventListener('keypress', (e) => { if(e.key === 'Enter'){ e.preventDefault(); inp.form && inp.form.requestSubmit && inp.form.requestSubmit(); } }));

  // Initialize from hash
  const h = location.hash.replace('#',''); setActiveTab(h === 'signup' ? 'signup' : 'login');
});
