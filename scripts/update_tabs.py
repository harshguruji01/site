import os

with open('login.html', 'r', encoding='utf-8') as f:
    c = f.read()

tabs_login = """      <!-- Authentication Navigation Tabs -->
      <div class="auth-tabs-nav" role="tablist" aria-label="WebGuruJi Authentication Tabs">
        <a href="login.html" class="auth-tab-btn active" role="tab" aria-selected="true" id="webguruji-login-tab" title="WebGuruJi Login Tab">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          <span>Login Tab</span>
        </a>
        <a href="signup.html" class="auth-tab-btn" role="tab" aria-selected="false" id="webguruji-signup-tab" title="WebGuruJi Sign Up Tab">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          <span>Sign Up Tab</span>
        </a>
      </div>

      <div class="auth-header">
        <h1 class="auth-title">WebGuruJi Login Page</h1>
        <p class="auth-subtitle">Official WebGuruJi Login-Tab. Sign in to your WebGuruJi &amp; HarshGuruJi account.</p>
      </div>"""

old_header_login = """      <div class="auth-header">
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Log in to continue to HarshGuruJi.</p>
      </div>"""

if old_header_login in c:
    c = c.replace(old_header_login, tabs_login)
    with open('login.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated login.html tabs and heading')
else:
    print('Pattern not found in login.html')

with open('signup.html', 'r', encoding='utf-8') as f:
    sc = f.read()

tabs_signup = """      <!-- Authentication Navigation Tabs -->
      <div class="auth-tabs-nav" role="tablist" aria-label="WebGuruJi Authentication Tabs">
        <a href="login.html" class="auth-tab-btn" role="tab" aria-selected="false" id="webguruji-login-tab" title="WebGuruJi Login Tab">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          <span>Login Tab</span>
        </a>
        <a href="signup.html" class="auth-tab-btn active" role="tab" aria-selected="true" id="webguruji-signup-tab" title="WebGuruJi Sign Up Tab">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          <span>Sign Up Tab</span>
        </a>
      </div>

      <div class="auth-header">
        <h1 class="auth-title">WebGuruJi Sign Up Page</h1>
        <p class="auth-subtitle">Official WebGuruJi Sign Up Tab. Create your free WebGuruJi &amp; HarshGuruJi account.</p>
      </div>"""

old_header_signup = """      <div class="auth-header">
        <h1 class="auth-title">Create an Account</h1>
        <p class="auth-subtitle">Join HarshGuruJi today.</p>
      </div>"""

if old_header_signup in sc:
    sc = sc.replace(old_header_signup, tabs_signup)
    with open('signup.html', 'w', encoding='utf-8') as f:
        f.write(sc)
    print('Updated signup.html tabs and heading')
else:
    print('Pattern not found in signup.html')
