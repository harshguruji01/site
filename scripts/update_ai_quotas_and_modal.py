# -*- coding: utf-8 -*-
"""
Update ai.webguruji.online quotas and add the Context Limit Upgrade System.
- Guest limit: 2 -> 8
- Logged-in member limit: 10 -> 20
- Context limits: $5 = 50,000; $15 = 175,000; $25 = 325,000
- Plan purchase redirect to webguruji.online/contact.html
- Real-time live limit sync with Admin Panel
"""
import os
import re

AI_INDEX_PATH = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\ai\index.html"
AI_DASH_PATH = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\ai\dashboard.html"
AI_PUB_DASH_PATH = r"c:\Users\harsh\OneDrive\Desktop\HarshGuruJi\ai\public\dashboard.html"

UPGRADE_MODAL_HTML = """
  <!-- 6. GURUAI PREMIUM CONTEXT & QUOTA UPGRADE MODAL -->
  <div id="upgradeModal"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md hidden animate-in fade-in duration-200">
    <div
      class="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl shadow-indigo-950/70 p-5 sm:p-8 text-slate-100">
      
      <!-- Close Button -->
      <button onclick="closeUpgradeModal()"
        class="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        aria-label="Close Upgrade Modal">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Modal Header -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <span>⭐</span> GuruAI Premium Upgrade &amp; Context Expansion
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
          Upgrade Your Context &amp; Daily Limits
        </h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Free tier includes <strong>8 requests</strong> (guest) and <strong>20 requests</strong> (members). Upgrade to unlock continuous multi-turn memory, massive token context windows, and priority inference.
        </p>
      </div>

      <!-- 3 Tier Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        <!-- Tier 1: Starter Pro ($5) -->
        <div class="rounded-2xl bg-slate-950/90 border border-slate-800 p-5 sm:p-6 flex flex-col justify-between hover:border-slate-700 transition relative">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Starter Pro</span>
              <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs text-slate-200 font-mono font-bold">$5 / mo</span>
            </div>
            <div class="mb-4">
              <div class="text-3xl font-extrabold text-white font-heading">50,000</div>
              <div class="text-xs text-cyan-400 font-semibold tracking-wide">Tokens Context Limit</div>
            </div>
            <ul class="text-xs text-slate-300 space-y-2.5 mb-6">
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span><strong>100 Daily Chats</strong> (12h cycle)</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span>50,000 Token Memory Buffer</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span>Fast GPU processing speed</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span>Full homework &amp; coding tutorials</span>
              </li>
            </ul>
          </div>
          <button onclick="handlePlanBuy('Starter Pro ($5)', 50000, 5)"
            class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow">
            <span>Upgrade to Starter ($5)</span> ➔
          </button>
        </div>

        <!-- Tier 2: Power Scholar ($15 - Recommended / Best Value) -->
        <div class="rounded-2xl bg-gradient-to-b from-indigo-950/50 via-slate-950 to-slate-950 border-2 border-indigo-500/70 p-5 sm:p-6 flex flex-col justify-between hover:border-indigo-400 transition relative shadow-2xl shadow-indigo-950/60">
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow">
            🔥 Best Value • 3.5x Context
          </div>
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Power Scholar</span>
              <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-xs text-cyan-300 font-mono font-bold">$15 / mo</span>
            </div>
            <div class="mb-4">
              <div class="text-3xl font-extrabold text-white font-heading">175,000</div>
              <div class="text-xs text-indigo-300 font-semibold tracking-wide">Tokens Context Limit</div>
            </div>
            <ul class="text-xs text-slate-300 space-y-2.5 mb-6">
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span><strong>350 Daily Chats</strong> (12h cycle)</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span><strong>175,000 Token Memory</strong> (3.5x Starter)</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span>Multi-document analysis &amp; PDF digest</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span>Deep chain-of-thought problem solving</span>
              </li>
            </ul>
          </div>
          <button onclick="handlePlanBuy('Power Scholar ($15)', 175000, 15)"
            class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/40 hover:opacity-95 transition flex items-center justify-center gap-1.5">
            <span>Upgrade to Scholar ($15)</span> ➔
          </button>
        </div>

        <!-- Tier 3: Grandmaster Enterprise ($25) -->
        <div class="rounded-2xl bg-slate-950/90 border border-slate-800 p-5 sm:p-6 flex flex-col justify-between hover:border-slate-700 transition relative">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Grandmaster</span>
              <span class="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-xs text-purple-300 font-mono font-bold">$25 / mo</span>
            </div>
            <div class="mb-4">
              <div class="text-3xl font-extrabold text-white font-heading">325,000</div>
              <div class="text-xs text-purple-300 font-semibold tracking-wide">Tokens Context Limit</div>
            </div>
            <ul class="text-xs text-slate-300 space-y-2.5 mb-6">
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span><strong>Unlimited Priority Chats</strong> (24h)</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span><strong>325,000 Token Massive Context</strong></span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span>Full textbook &amp; codebase ingestion</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-400 font-bold">✔</span>
                <span>Dedicated GPU channel &amp; new models early access</span>
              </li>
            </ul>
          </div>
          <button onclick="handlePlanBuy('Grandmaster Enterprise ($25)', 325000, 25)"
            class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow">
            <span>Upgrade to Grandmaster ($25)</span> ➔
          </button>
        </div>

      </div>

      <!-- Compare With Less Cost Breakdown -->
      <div class="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 sm:p-5 mb-6">
        <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>📊</span> Value Comparison: Why Higher Tiers Cost Less Per Token
        </h4>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400">
                <th class="pb-2 font-semibold">Tier Plan</th>
                <th class="pb-2 font-semibold">Monthly Cost</th>
                <th class="pb-2 font-semibold">Context Limit</th>
                <th class="pb-2 font-semibold">Cost Per 10K Tokens</th>
                <th class="pb-2 font-semibold">Comparative Advantage</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td class="py-2.5 font-semibold text-slate-200">Starter Pro</td>
                <td class="py-2.5 font-mono">$5</td>
                <td class="py-2.5 text-cyan-400 font-mono">50,000</td>
                <td class="py-2.5 font-mono">$1.00 / 10k</td>
                <td class="py-2.5 text-slate-400">Standard Baseline</td>
              </tr>
              <tr class="bg-indigo-950/20">
                <td class="py-2.5 font-bold text-indigo-300">Power Scholar</td>
                <td class="py-2.5 font-mono font-bold">$15</td>
                <td class="py-2.5 text-cyan-300 font-mono font-bold">175,000</td>
                <td class="py-2.5 font-mono text-emerald-400 font-bold">$0.85 / 10k</td>
                <td class="py-2.5 text-emerald-400 font-semibold">+15% Cheaper &amp; 3.5x Context Volume</td>
              </tr>
              <tr>
                <td class="py-2.5 font-bold text-purple-300">Grandmaster</td>
                <td class="py-2.5 font-mono font-bold">$25</td>
                <td class="py-2.5 text-purple-300 font-mono font-bold">325,000</td>
                <td class="py-2.5 font-mono text-emerald-400 font-bold">$0.76 / 10k</td>
                <td class="py-2.5 text-emerald-400 font-semibold">+24% Cheaper &amp; 6.5x Context Volume</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Activation Notice -->
      <div class="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-200 flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">🛡️</span>
          <span>Clicking any plan redirects to <strong>webguruji.online/contact.html</strong>. Once your request is submitted, HarshGuruJi Admin activates your new limit live!</span>
        </div>
        <span class="text-[11px] font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded">Live Admin Sync</span>
      </div>

    </div>
  </div>
"""

UPGRADE_JS_FUNCTIONS = """
    // --- GURUAI UPGRADE & CONTEXT LIMIT CONTROLLER ---
    window.openUpgradeModal = function() {
      const modal = document.getElementById('upgradeModal');
      if (modal) modal.classList.remove('hidden');
    };

    window.closeUpgradeModal = function() {
      const modal = document.getElementById('upgradeModal');
      if (modal) modal.classList.add('hidden');
    };

    window.handlePlanBuy = function(planName, contextLimit, price) {
      const email = currentUser?.email || '';
      const params = new URLSearchParams({
        subject: 'ai_upgrade',
        plan: planName,
        context: contextLimit,
        price: price,
        email: email
      });
      const url = `https://webguruji.online/contact.html?${params.toString()}`;
      window.open(url, '_blank');
    };

    // Live Broadcast Listener for Admin limit updates
    try {
      const quotaChannel = new BroadcastChannel('guruai_quota_channel');
      quotaChannel.onmessage = (event) => {
        if (event.data && event.data.action === 'quota_updated') {
          if (!currentUser || event.data.userId === currentUser.id || event.data.email === currentUser.email) {
            initUserQuota(currentUser);
            showToast('⚡ Your GuruAI limit has been updated live by Admin!', 'success');
          }
        }
      };
    } catch(e) {}
"""

def update_ai_index():
    with open(AI_INDEX_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Update initial UI texts
    html = html.replace('id="quotaSidebarText">2/2 Left<', 'id="quotaSidebarText">8/8 Left<')
    html = html.replace('id="headerQuotaText">2/2 Left<', 'id="headerQuotaText">8/8 Left<')
    html = html.replace('id="footerQuotaText" class="font-mono">2 requests left<', 'id="footerQuotaText" class="font-mono">8 requests left<')
    html = html.replace("localStorage.getItem('guruai_allowance') || '2'", "localStorage.getItem('guruai_allowance') || '8'")

    # 2. Add Upgrade Button next to header quota badge if not present
    if 'id="headerUpgradeBtn"' not in html:
        upgrade_btn_header = """
          <!-- Upgrade Plan Button -->
          <button id="headerUpgradeBtn" onclick="openUpgradeModal()"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-amber-500/40 text-amber-300 hover:from-amber-500/30 hover:to-purple-500/30 shadow-sm shadow-amber-500/10">
            <span>⭐</span>
            <span>Upgrade</span>
          </button>
        """
        html = html.replace('<!-- Usage Allowance Badge -->', upgrade_btn_header + '\n          <!-- Usage Allowance Badge -->', 1)

    # 3. Add Upgrade Button in Sidebar
    if 'Upgrade Context &amp; Limits' not in html and 'Upgrade Context & Limits' not in html:
        sidebar_upgrade_btn = """
        <button onclick="openUpgradeModal()" class="w-full mt-2 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-amber-500/20 border border-indigo-500/40 hover:border-amber-400/60 text-amber-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition shadow-sm">
          <span>⭐</span>
          <span>Upgrade Context &amp; Limits</span>
        </button>
        """
        html = html.replace('id="quotaSidebarText">8/8 Left</span>\n        </div>', 'id="quotaSidebarText">8/8 Left</span>\n        </div>' + sidebar_upgrade_btn, 1)

    # 4. Insert Upgrade Modal before </main> or after authModal
    if 'id="upgradeModal"' not in html:
        html = html.replace('<!-- JAVASCRIPT APPLICATION CORE -->', UPGRADE_MODAL_HTML + '\n  <!-- JAVASCRIPT APPLICATION CORE -->', 1)

    # 5. Insert JS Functions
    if 'handlePlanBuy' not in html:
        html = html.replace('// 1. Supabase Initialization', UPGRADE_JS_FUNCTIONS + '\n    // 1. Supabase Initialization', 1)

    # 6. Update Quota System Logic
    old_init = """    // Quota Allowance System (10 requests / 12h for Member, 2 requests / 6h for Guest)
    function initUserQuota(user) {
      const now = Date.now();
      if (user) {
        maxRequests = 10;
        const windowDuration = 12 * 60 * 60 * 1000;
        const key = 'guruai_quota_user_' + user.id;
        let stored = null;
        try { stored = JSON.parse(localStorage.getItem(key)); } catch (e) { }

        if (!stored || typeof stored.remaining !== 'number' || !stored.windowStart || (now - stored.windowStart) > windowDuration) {
          stored = { remaining: 10, windowStart: now };
          localStorage.setItem(key, JSON.stringify(stored));
        }
        remainingAllowance = stored.remaining;
      } else {
        maxRequests = 2;
        const windowDuration = 6 * 60 * 60 * 1000;
        const key = 'guruai_quota_guest';
        let stored = null;
        try { stored = JSON.parse(localStorage.getItem(key)); } catch (e) { }

        if (!stored || typeof stored.remaining !== 'number' || !stored.windowStart || (now - stored.windowStart) > windowDuration) {
          stored = { remaining: 2, windowStart: now };
          localStorage.setItem(key, JSON.stringify(stored));
        }
        remainingAllowance = stored.remaining;
      }
      updateQuotaUI();
    }"""

    new_init = """    // Quota Allowance System (20 requests / 12h for Member, 8 requests / 6h for Guest)
    function initUserQuota(user) {
      const now = Date.now();
      if (user) {
        maxRequests = 20;
        const windowDuration = 12 * 60 * 60 * 1000;
        const key = 'guruai_quota_user_' + user.id;
        let stored = null;
        try { stored = JSON.parse(localStorage.getItem(key)); } catch (e) { }

        if (!stored || typeof stored.remaining !== 'number' || !stored.windowStart || (now - stored.windowStart) > windowDuration) {
          stored = { remaining: 20, windowStart: now };
          localStorage.setItem(key, JSON.stringify(stored));
        }
        remainingAllowance = stored.remaining;

        // Check for Live Custom Admin Quotas
        if (supabaseClient) {
          supabaseClient.from('user_ai_limits').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => {
            if (data && typeof data.max_requests === 'number' && data.max_requests > 0) {
              maxRequests = data.max_requests;
              if (stored.remaining > maxRequests) stored.remaining = maxRequests;
              updateQuotaUI();
              if (userTierLabel) userTierLabel.textContent = data.plan_name || `Member (${maxRequests}/12h)`;
              if (headerTierText) headerTierText.textContent = data.plan_tier || 'Pro';
            }
          }).catch(() => {});
        }
      } else {
        maxRequests = 8;
        const windowDuration = 6 * 60 * 60 * 1000;
        const key = 'guruai_quota_guest';
        let stored = null;
        try { stored = JSON.parse(localStorage.getItem(key)); } catch (e) { }

        if (!stored || typeof stored.remaining !== 'number' || !stored.windowStart || (now - stored.windowStart) > windowDuration) {
          stored = { remaining: 8, windowStart: now };
          localStorage.setItem(key, JSON.stringify(stored));
        }
        remainingAllowance = stored.remaining;
      }
      updateQuotaUI();
    }"""

    html = html.replace(old_init, new_init)

    # 7. Update chatForm exhausted check to show upgrade modal
    old_exhausted = """      if (remainingAllowance <= 0) {
        openAuthModal('login');
        showToast('Daily allowance exhausted. Please sign in to increase your limits!', 'error');
        return;
      }"""

    new_exhausted = """      if (remainingAllowance <= 0) {
        openUpgradeModal();
        showToast('Chat allowance exhausted. Upgrade your plan for higher limits & up to 325,000 context!', 'warning');
        return;
      }"""

    html = html.replace(old_exhausted, new_exhausted)

    # 8. Update headerQuotaBadge click to open upgrade modal
    html = html.replace("document.getElementById('headerQuotaBadge').onclick = () => openAuthModal('login');",
                        "document.getElementById('headerQuotaBadge').onclick = () => openUpgradeModal();")

    # 9. Update labels
    html = html.replace("userTierLabel.textContent = 'Member (10/12h)';", "userTierLabel.textContent = 'Member (20/12h)';")
    html = html.replace("Active Member • 10 requests / 12h", "Active Member • 20 requests / 12h")
    html = html.replace("Unlock 10 requests / 12h", "Unlock 20 requests / 12h")

    with open(AI_INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(html)
    print("Updated ai/index.html successfully!")

def update_dashboards():
    for p in [AI_DASH_PATH, AI_PUB_DASH_PATH]:
        if not os.path.exists(p):
            continue
        with open(p, "r", encoding="utf-8") as f:
            c = f.read()

        c = c.replace("maxAllowance = 10;", "maxAllowance = 20;")
        c = c.replace("maxAllowance = 2;", "maxAllowance = 8;")
        c = c.replace("stored = { remaining: 10, windowStart: now };", "stored = { remaining: 20, windowStart: now };")
        c = c.replace("stored = { remaining: 2, windowStart: now };", "stored = { remaining: 8, windowStart: now };")
        c = c.replace('id="quotaCapLabel" class="font-mono text-cyan-400 font-bold">10 Max<', 'id="quotaCapLabel" class="font-mono text-cyan-400 font-bold">20 Max<')
        c = c.replace('id="remainingQuotaNum" class="text-3xl font-extrabold font-heading text-white">10<', 'id="remainingQuotaNum" class="text-3xl font-extrabold font-heading text-white">20<')
        c = c.replace('id="maxQuotaNum">10<', 'id="maxQuotaNum">20<')

        with open(p, "w", encoding="utf-8") as f:
            f.write(c)
        print("Updated dashboard:", p)

if __name__ == "__main__":
    update_ai_index()
    update_dashboards()
