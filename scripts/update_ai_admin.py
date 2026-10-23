import re

path = r'c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\ai\admin.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add table header for AI Quota
old_th = '<th class="p-3.5">Admin Status</th>\n                <th class="p-3.5">Last Active</th>'
new_th = '<th class="p-3.5">Admin Status</th>\n                <th class="p-3.5">AI Quota &amp; Context</th>\n                <th class="p-3.5">Last Active</th>'
if old_th in html and 'AI Quota &amp; Context' not in html:
    html = html.replace(old_th, new_th)

# 2. Add limits fetch to loadUsers
target_fetch = """          if (profiles) {
            users = profiles.map(p => ({
              ...p,
              provider: pMap.get(p.id) || (p.email?.includes('gmail') ? 'google' : 'email')
            }));
          }"""

new_fetch = """          // Query live AI limits
          let limMap = new Map();
          try {
            const { data: limitsData } = await supabase.from('user_ai_limits').select('*');
            if (limitsData) {
              limitsData.forEach(l => {
                if (l.email) limMap.set(l.email.toLowerCase(), l);
                if (l.user_id) limMap.set(l.user_id, l);
              });
            }
          } catch(e) {}

          if (profiles) {
            users = profiles.map(p => {
              const uEmail = (p.email || '').toLowerCase();
              const lim = limMap.get(uEmail) || (p.id ? limMap.get(p.id) : null);
              return {
                ...p,
                provider: pMap.get(p.id) || (p.email?.includes('gmail') ? 'google' : 'email'),
                max_requests: lim ? lim.max_requests : 20,
                context_limit: lim ? lim.context_limit : 32000,
                plan_name: lim ? lim.plan_name : 'Free'
              };
            });
          }"""

if target_fetch in html and 'user_ai_limits' not in html:
    html = html.replace(target_fetch, new_fetch)

# 3. Add AI Quota TD in renderUsersTable
target_row = """            <td class="p-3.5">
              ${isAdmin ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-[11px]">
                  <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.5 5 5 .5-3.8 3.5 1 5-4.7-2.5-4.7 2.5 1-5-3.8-3.5 5-.5L10 2z"/></svg>
                  Admin
                </span>
              ` : `
                <span class="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">
                  Standard
                </span>
              `}
            </td>"""

new_row = """            <td class="p-3.5">
              ${isAdmin ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-[11px]">
                  <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l2.5 5 5 .5-3.8 3.5 1 5-4.7-2.5-4.7 2.5 1-5-3.8-3.5 5-.5L10 2z"/></svg>
                  Admin
                </span>
              ` : `
                <span class="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px]">
                  Standard
                </span>
              `}
            </td>
            <td class="p-3.5">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-bold text-[11px] ${user.max_requests > 20 ? 'text-amber-300' : 'text-slate-300'} font-mono">
                  ${user.max_requests || 20} chats
                </span>
                <span class="text-[10px] text-cyan-400 font-mono">
                  (${((user.context_limit || 32000) / 1000).toFixed(0)}k ctx)
                </span>
                <span class="text-[10px] px-1.5 py-0.5 rounded ${user.plan_name && user.plan_name !== 'Free' ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/60' : 'bg-slate-800 text-slate-400'}">
                  ${user.plan_name || 'Free'}
                </span>
              </div>
            </td>"""

if target_row in html:
    html = html.replace(target_row, new_row)

# 4. Add tuneUserLimits button and method
target_action = """              ${(user.email && user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) ? `
                <span class="text-[11px] text-amber-400/80 font-medium px-2 py-1 rounded bg-amber-400/10 border border-amber-400/20">Master Protected</span>
              ` : `
                <button 
                  onclick="toggleUserAdmin('${user.id}', '${user.email}', ${isAdmin})"
                  class="px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    isAdmin 
                      ? 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300' 
                      : 'bg-indigo-600/80 hover:bg-indigo-500 text-white shadow-sm'
                  }"
                >
                  ${isAdmin ? 'Revoke Admin' : 'Make Admin'}
                </button>
              `}"""

new_action = """              <div class="flex items-center justify-end gap-1.5">
                <button 
                  onclick="tuneUserLimits('${user.id}', '${user.email}', ${user.max_requests || 20}, ${user.context_limit || 32000}, '${user.plan_name || 'Free'}')"
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 transition"
                  title="Modify Live Chat Quota & Context Limit"
                >
                  ⚡ Limits
                </button>
              ${(user.email && user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) ? `
                <span class="text-[11px] text-amber-400/80 font-medium px-2 py-1 rounded bg-amber-400/10 border border-amber-400/20">Master Protected</span>
              ` : `
                <button 
                  onclick="toggleUserAdmin('${user.id}', '${user.email}', ${isAdmin})"
                  class="px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    isAdmin 
                      ? 'bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300' 
                      : 'bg-indigo-600/80 hover:bg-indigo-500 text-white shadow-sm'
                  }"
                >
                  ${isAdmin ? 'Revoke Admin' : 'Make Admin'}
                </button>
              `}
              </div>"""

if target_action in html:
    html = html.replace(target_action, new_action)

tune_fn = """
    // Live Quota & Context Tuner for Admin
    window.tuneUserLimits = async function(userId, email, curReq, curCtx, curPlan) {
      const choice = prompt(
        `Tune AI Quota & Context for: ${email}\\nCurrent: ${curPlan} (${curReq} chats, ${curCtx.toLocaleString()} context tokens)\\n\\nEnter option number or custom:\\n1. Free (20 chats / 32,000 context)\\n2. Starter Pro $5 (50 chats / 50,000 context)\\n3. Power Scholar $15 (150 chats / 175,000 context)\\n4. Grandmaster $25 (350 chats / 325,000 context)\\n5. Unlimited VIP (9999 chats / 500,000 context)\\n\\nOr type custom format: chats,context (e.g. 100,80000)`
      );

      if (!choice) return;

      let reqs = 20, ctx = 32000, plan = 'Free';
      const c = choice.trim();

      if (c === '1') { reqs = 20; ctx = 32000; plan = 'Free'; }
      else if (c === '2') { reqs = 50; ctx = 50000; plan = 'Starter Pro'; }
      else if (c === '3') { reqs = 150; ctx = 175000; plan = 'Power Scholar'; }
      else if (c === '4') { reqs = 350; ctx = 325000; plan = 'Grandmaster Enterprise'; }
      else if (c === '5') { reqs = 9999; ctx = 500000; plan = 'Unlimited VIP'; }
      else if (c.includes(',')) {
        const parts = c.split(',');
        reqs = parseInt(parts[0], 10) || 20;
        ctx = parseInt(parts[1], 10) || 32000;
        plan = 'Custom Tier';
      } else {
        alert("Invalid selection.");
        return;
      }

      try {
        const now = new Date().toISOString();
        const payload = {
          email: email.toLowerCase().trim(),
          max_requests: reqs,
          context_limit: ctx,
          plan_name: plan,
          is_active: true,
          updated_at: now
        };
        if (userId && userId !== 'null' && userId !== 'undefined') {
          payload.user_id = userId;
        }

        const { error } = await supabase.from('user_ai_limits').upsert([payload], { onConflict: 'email' });
        if (error) throw error;

        // Realtime cross-tab broadcast
        try {
          const bc = new BroadcastChannel('guruai_quota_channel');
          bc.postMessage({
            type: 'QUOTA_UPDATED',
            email: email.toLowerCase(),
            userId: userId || null,
            max_requests: reqs,
            context_limit: ctx,
            plan_name: plan,
            timestamp: Date.now()
          });
          bc.close();
        } catch(e) {}

        alert(`✅ Live limits applied for ${email}!\\nTier: ${plan}\\nChat Limit: ${reqs} / 12h\\nContext: ${ctx.toLocaleString()} tokens`);
        loadUsers();
      } catch(err) {
        alert("Failed to update limits: " + err.message);
      }
    };
"""

if 'tuneUserLimits' not in html:
    html = html.replace('// Update Header and Admin Gate Access', tune_fn + '\n    // Update Header and Admin Gate Access')

with open(path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated ai/admin.html successfully!")
