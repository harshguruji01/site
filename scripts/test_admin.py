with open('admin.html', 'r', encoding='utf-8') as f:
    c = f.read()

assert 'id="security-gate"' in c, "Missing security-gate element"
assert 'id="admin-gate-pass-form"' in c, "Missing admin-gate-pass-form element"
assert 'id="input-admin-email"' in c, "Missing input-admin-email element"
assert 'id="input-admin-id"' in c, "Missing input-admin-id element"
assert 'harshguruji01@gmail.com' in c, "Missing admin email"
assert '2547277654' in c, "Missing admin code"
assert 'SESSION_MAX_MS = 60 * 60 * 1000' in c, "Missing 1-hour session constant"
assert 'session-countdown' in c, "Missing session countdown timer display"
assert 'triggerSessionLogout' in c, "Missing auto-logout function"

with open('login.html', 'r', encoding='utf-8') as f:
    lc = f.read()

assert 'HarshGuruJi Login Tab' in lc, "Missing Login Tab text"
assert 'id="harshguruji-login-tab"' in lc, "Missing harshguruji-login-tab id"
assert 'harshguruji login-tab login page' in lc, "Missing exact user keywords"
assert 'HarshGuruJi Login Page' in lc, "Missing HarshGuruJi Login Page heading"

print("ALL ADMIN AND LOGIN VALIDATION TESTS PASSED 100%!")
