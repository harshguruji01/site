import os

files = [
    r'c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\ai\dashboard.html',
    r'c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\ai\public\dashboard.html'
]

snippet = """
      // Check for Live Custom Admin Quotas
      if (supabase && currentUser) {
        const emailQuery = currentUser.email ? `,email.ilike.${currentUser.email.toLowerCase().trim()}` : '';
        supabase.from('user_ai_limits').select('*').or(`user_id.eq.${currentUser.id}${emailQuery}`).maybeSingle().then(({ data }) => {
          if (data && data.max_requests > 0) {
            maxAllowance = data.max_requests;
            document.getElementById('maxQuotaNum').textContent = maxAllowance;
            document.getElementById('quotaCapLabel').textContent = `${maxAllowance} Max`;
            if (data.plan_name) document.getElementById('tierBadgeText').textContent = data.plan_name;
            const pct = Math.max(0, Math.min(100, (remainingAllowance / maxAllowance) * 100));
            document.getElementById('quotaProgressBar').style.width = pct + '%';
          }
        }).catch(() => {});
      }
"""

bc_code = """
      try {
        const quotaBc = new BroadcastChannel('guruai_quota_channel');
        quotaBc.onmessage = (e) => {
          if (e.data && e.data.type === 'QUOTA_UPDATED') {
            calculateQuota();
          }
        };
      } catch(e) {}
"""

for p in files:
    if not os.path.exists(p):
        continue
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'user_ai_limits' not in content:
        target = 'calculateQuota();\n    }'
        if target in content:
            content = content.replace(target, 'calculateQuota();\n' + snippet + '    }')
        
        target2 = '// Start Countdown Timer'
        if target2 in content and 'guruai_quota_channel' not in content:
            content = content.replace(target2, bc_code + '\n      // Start Countdown Timer')
            
        with open(p, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated:', p)
    else:
        print('Already updated:', p)
