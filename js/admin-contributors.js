// Admin Contributor & Golden Tick Verification Controller

const ADMIN_PASS = "harshguruji01@gmail.com";
let applicationsData = [];
let usersData = [];
let currentAppFilter = 'ALL';
let currentUserFilter = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
    initAuthGate();
});

// 1. Password Security Gate & Session Checking
function initAuthGate() {
    const authGate = document.getElementById('auth-gate');
    const adminApp = document.getElementById('admin-app');
    const authForm = document.getElementById('auth-gate-form');
    const passInput = document.getElementById('admin-pass-input');
    const lockBtn = document.getElementById('btn-lock');

    function unlockAdmin() {
        if (window.grantDirectAdminAccess) {
            window.grantDirectAdminAccess();
        } else {
            sessionStorage.setItem('hg_contributor_admin_unlocked', 'true');
        }
        if (authGate) authGate.style.display = 'none';
        if (adminApp) adminApp.style.display = 'block';
        waitForSupabaseAndLoad();
    }

    // 1. Check if entering from admin.html or already authenticated in session
    if (window.checkAdminAccess && window.checkAdminAccess()) {
        unlockAdmin();
        return;
    }

    // Check existing unlock in session
    if (sessionStorage.getItem('hg_contributor_admin_unlocked') === 'true') {
        unlockAdmin();
        return;
    }

    // Check if user is already logged in as harshguruji01@gmail.com
    let checkAuthInterval = setInterval(async () => {
        if (window.supabaseClient) {
            clearInterval(checkAuthInterval);
            try {
                const { data: { session } } = await window.supabaseClient.auth.getSession();
                if (session && session.user && session.user.email && session.user.email.toLowerCase() === 'harshguruji01@gmail.com') {
                    unlockAdmin();
                    return;
                }
            } catch (err) {
                console.warn("Session check fallback:", err);
            }
        }
    }, 100);

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = passInput.value.trim();
            if (val.toLowerCase() === ADMIN_PASS.toLowerCase()) {
                unlockAdmin();
            } else {
                showToast("Invalid admin email password! Access denied.", "error");
                passInput.value = '';
                passInput.focus();
            }
        });
    }

    if (lockBtn) {
        lockBtn.addEventListener('click', () => {
            if (window.clearAdminSessions) {
                window.clearAdminSessions();
            } else {
                sessionStorage.removeItem('hg_contributor_admin_unlocked');
            }
            window.location.href = 'index.html';
        });
    }
}

function waitForSupabaseAndLoad() {
    let interval = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(interval);
            bindEvents();
            loadAllData();
        }
    }, 80);
}

function bindEvents() {
    // Search listeners
    const appSearch = document.getElementById('app-search-input');
    if (appSearch) {
        appSearch.addEventListener('input', () => renderApplications());
    }

    const userSearch = document.getElementById('user-search-input');
    if (userSearch) {
        userSearch.addEventListener('input', () => renderUsers());
    }
}

// 2. Load Data from Supabase
async function loadAllData() {
    const supabase = window.supabaseClient;
    if (!supabase) return;

    try {
        // Fetch Contributors
        const { data: apps, error: appErr } = await supabase
            .from('contributors')
            .select('*')
            .order('created_at', { ascending: false });

        if (!appErr && apps) {
            applicationsData = apps;
            updateAppStats();
            renderApplications();
        }

        // Fetch Profiles
        const { data: users, error: userErr } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (!userErr && users) {
            usersData = users;
            updateUserStats();
            renderUsers();
        }
    } catch (err) {
        console.error("Error loading data:", err);
        showToast("Error loading data from database", "error");
    }
}

// 3. Application Stats & Render
function updateAppStats() {
    const total = applicationsData.length;
    const pending = applicationsData.filter(a => (a.status || '').toUpperCase() === 'PENDING').length;
    const active = applicationsData.filter(a => (a.status || '').toUpperCase() === 'ACTIVE').length;
    const rejected = applicationsData.filter(a => (a.status || '').toUpperCase() === 'REJECTED').length;

    const elTotal = document.getElementById('stat-total-apps');
    const elPending = document.getElementById('stat-pending-apps');
    const elActive = document.getElementById('stat-active-apps');
    const elRejected = document.getElementById('stat-rejected-apps');
    const tabBadge = document.getElementById('tab-badge-pending');

    if (elTotal) elTotal.textContent = total;
    if (elPending) elPending.textContent = pending;
    if (elActive) elActive.textContent = active;
    if (elRejected) elRejected.textContent = rejected;

    if (tabBadge) {
        if (pending > 0) {
            tabBadge.textContent = pending;
            tabBadge.style.display = 'inline-flex';
        } else {
            tabBadge.style.display = 'none';
        }
    }
}

function renderApplications() {
    const tbody = document.getElementById('applications-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('app-search-input')?.value || '').toLowerCase().trim();

    let list = applicationsData.filter(app => {
        const status = (app.status || 'PENDING').toUpperCase();
        if (currentAppFilter !== 'ALL' && status !== currentAppFilter) return false;

        if (searchTerm) {
            const name = (app.display_name || '').toLowerCase();
            const role = (app.role || '').toLowerCase();
            const bio = (app.bio || '').toLowerCase();
            return name.includes(searchTerm) || role.includes(searchTerm) || bio.includes(searchTerm);
        }
        return true;
    });

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 3rem;">No applications found in this filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(app => {
        const status = (app.status || 'PENDING').toUpperCase();
        let badgeClass = 'pending';
        let badgeLabel = 'Pending';

        if (status === 'ACTIVE') {
            badgeClass = 'active';
            badgeLabel = 'Active';
        } else if (status === 'REJECTED') {
            badgeClass = 'rejected';
            badgeLabel = 'Rejected';
        }

        const date = app.created_at ? new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
        const img = app.profile_image_path || 'logo.png';
        const isVerified = status === 'ACTIVE';

        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="avatar-wrapper">
                            <img src="${escapeHtml(img)}" alt="${escapeHtml(app.display_name)}" onerror="this.src='logo.png'">
                            ${isVerified ? '<span class="golden-tick" title="Golden Verified">✓</span>' : ''}
                        </div>
                        <div>
                            <div class="user-name-title">${escapeHtml(app.display_name)}</div>
                            <div class="user-subtitle">${escapeHtml(app.full_name || app.role || 'Contributor')}</div>
                        </div>
                    </div>
                </td>
                <td><span style="font-weight: 500; color: #e5e7eb;">${escapeHtml(app.role || 'Contributor')}</span></td>
                <td style="color: var(--text-muted); font-size: 0.85rem;">${date}</td>
                <td><span class="status-badge ${badgeClass}">${badgeLabel}</span></td>
                <td>
                    <div class="actions-cluster">
                        <button class="btn btn-outline btn-sm" onclick="openAppModal('${app.id}')">View</button>
                        ${status !== 'ACTIVE' ? `
                            <button class="btn btn-success btn-sm" onclick="activateContributor('${app.id}', '${app.user_id || ''}')" title="Activate Contributor and grant Golden Tick">Activate</button>
                        ` : `
                            <button class="btn btn-danger btn-sm" onclick="deactivateContributor('${app.id}', '${app.user_id || ''}')" title="Deactivate and revoke Golden Tick">Deactivate</button>
                        `}
                        <button class="btn btn-outline btn-sm" onclick="deleteApplication('${app.id}', '${app.user_id || ''}')" title="Delete application" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);">🗑</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 4. Application Modal Preview
window.openAppModal = function(id) {
    const app = applicationsData.find(a => a.id === id);
    if (!app) return;

    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('app-modal-body');
    const modalFoot = document.getElementById('app-modal-foot');
    if (!modal || !modalBody || !modalFoot) return;

    const status = (app.status || 'PENDING').toUpperCase();
    const isVerified = status === 'ACTIVE';
    const rawImg = app.avatar_url || app.profile_image_path;
    const img = (rawImg && rawImg !== 'logo.png') ? rawImg : `https://ui-avatars.com/api/?name=${encodeURIComponent(app.display_name || 'Contributor')}&background=6366f1&color=fff`;
    const date = app.created_at ? new Date(app.created_at).toLocaleString() : 'N/A';

    modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1.5rem;">
            <div class="avatar-wrapper" style="width: 80px; height: 80px; margin-bottom: 0.75rem;">
                <img src="${escapeHtml(img)}" alt="${escapeHtml(app.display_name)}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(app.display_name || 'Contributor')}&background=6366f1&color=fff'" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                ${isVerified ? '<span class="golden-tick" style="width: 24px; height: 24px; font-size: 14px; top: -2px; left: -2px;" title="Golden Verified">✓</span>' : ''}
            </div>
            <h3 style="color: #fff; font-size: 1.3rem; margin-bottom: 0.2rem;">${escapeHtml(app.display_name)}</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">${escapeHtml(app.full_name || '')}</p>
            <span class="status-badge ${status === 'ACTIVE' ? 'active' : (status === 'REJECTED' ? 'rejected' : 'pending')}">${status}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; background: rgba(0,0,0,0.25); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-light);">
            <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Proposed Role</span>
                <p style="color: #fff; font-weight: 500;">${escapeHtml(app.role || 'Contributor')}</p>
            </div>
            <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Bio / Skills</span>
                <p style="color: #e5e7eb; font-size: 0.9rem; white-space: pre-wrap; margin-top: 0.2rem;">${escapeHtml(app.bio || 'No bio provided.')}</p>
            </div>
            ${app.instagram ? `
                <div>
                    <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Instagram</span>
                    <p><a href="${escapeHtml(app.instagram)}" target="_blank" style="color: #60a5fa; text-decoration: none;">${escapeHtml(app.instagram)}</a></p>
                </div>
            ` : ''}
            ${app.youtube ? `
                <div>
                    <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">YouTube</span>
                    <p><a href="${escapeHtml(app.youtube)}" target="_blank" style="color: #f87171; text-decoration: none;">${escapeHtml(app.youtube)}</a></p>
                </div>
            ` : ''}
            <div>
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Applied On</span>
                <p style="color: var(--text-muted); font-size: 0.85rem;">${date}</p>
            </div>
        </div>
    `;

    modalFoot.innerHTML = `
        <button class="btn btn-outline" onclick="closeAppModal()">Close</button>
        ${status !== 'ACTIVE' ? `
            <button class="btn btn-success" onclick="activateContributor('${app.id}', '${app.user_id || ''}'); closeAppModal();">⭐ Activate &amp; Give Golden Tick</button>
        ` : `
            <button class="btn btn-danger" onclick="deactivateContributor('${app.id}', '${app.user_id || ''}'); closeAppModal();">Deactivate &amp; Remove Golden Tick</button>
        `}
    `;

    modal.classList.add('active');
};

window.closeAppModal = function() {
    const modal = document.getElementById('app-modal');
    if (modal) modal.classList.remove('active');
};

// 5. Activate Contributor (Grants Status + Golden Tick)
window.activateContributor = async function(appId, userId) {
    const supabase = window.supabaseClient;
    if (!supabase) return;

    try {
        // 1. Update contributor row
        const { error: cErr } = await supabase
            .from('contributors')
            .update({
                status: 'ACTIVE',
                verified: true,
                approved_at: new Date().toISOString()
            })
            .eq('id', appId);

        if (cErr) throw cErr;

        // 2. Grant golden_tick in profiles
        if (userId) {
            await supabase
                .from('profiles')
                .update({ golden_tick: true })
                .eq('id', userId);
        } else {
            // Find user in applications by exact email
            const app = applicationsData.find(a => a.id === appId);
            if (app && app.email) {
                await supabase
                    .from('profiles')
                    .update({ golden_tick: true })
                    .eq('email', app.email.trim());
            }
        }

        showToast("Contributor Activated & Golden Tick awarded! ⭐", "success");
        await loadAllData();
    } catch (err) {
        console.error("Activation failed:", err);
        showToast("Failed to activate contributor", "error");
    }
};

// 6. Deactivate Contributor (Revokes Status + Golden Tick)
window.deactivateContributor = async function(appId, userId) {
    const supabase = window.supabaseClient;
    if (!supabase) return;

    try {
        // 1. Update contributor row
        const { error: cErr } = await supabase
            .from('contributors')
            .update({
                status: 'REJECTED',
                verified: false
            })
            .eq('id', appId);

        if (cErr) throw cErr;

        // 2. Revoke golden_tick in profiles
        if (userId) {
            await supabase
                .from('profiles')
                .update({ golden_tick: false })
                .eq('id', userId);
        } else {
            const app = applicationsData.find(a => a.id === appId);
            if (app && app.email) {
                await supabase
                    .from('profiles')
                    .update({ golden_tick: false })
                    .eq('email', app.email.trim());
            }
        }

        showToast("Contributor deactivated & Golden Tick removed", "info");
        await loadAllData();
    } catch (err) {
        console.error("Deactivation failed:", err);
        showToast("Failed to deactivate contributor", "error");
    }
};

// 7. Delete Application
window.deleteApplication = async function(appId, userId) {
    if (!confirm("Are you sure you want to permanently delete this application?")) return;

    const supabase = window.supabaseClient;
    if (!supabase) return;

    try {
        const { error } = await supabase
            .from('contributors')
            .delete()
            .eq('id', appId);

        if (error) throw error;

        // Also remove golden tick from profile if applicable
        if (userId) {
            await supabase
                .from('profiles')
                .update({ golden_tick: false })
                .eq('id', userId);
        }

        showToast("Application deleted successfully", "info");
        await loadAllData();
    } catch (err) {
        console.error("Delete failed:", err);
        showToast("Failed to delete application", "error");
    }
};

// 8. Universal User Golden Tick Manager
function updateUserStats() {
    const total = usersData.length;
    const golden = usersData.filter(u => u.golden_tick === true).length;
    const regular = total - golden;

    const elTotal = document.getElementById('stat-total-users');
    const elGolden = document.getElementById('stat-golden-users');
    const elRegular = document.getElementById('stat-regular-users');
    const tabBadge = document.getElementById('tab-badge-verified');

    if (elTotal) elTotal.textContent = total;
    if (elGolden) elGolden.textContent = golden;
    if (elRegular) elRegular.textContent = regular;

    if (tabBadge) {
        if (golden > 0) {
            tabBadge.textContent = golden;
            tabBadge.style.display = 'inline-flex';
        } else {
            tabBadge.style.display = 'none';
        }
    }
}

function renderUsers() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('user-search-input')?.value || '').toLowerCase().trim();

    let list = usersData.filter(u => {
        const hasGolden = u.golden_tick === true;
        if (currentUserFilter === 'GOLDEN' && !hasGolden) return false;
        if (currentUserFilter === 'NON_GOLDEN' && hasGolden) return false;

        if (searchTerm) {
            const name = (u.display_name || '').toLowerCase();
            const uname = (u.username || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            return name.includes(searchTerm) || uname.includes(searchTerm) || email.includes(searchTerm);
        }
        return true;
    });

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 3rem;">No users found in this filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(u => {
        const hasGolden = u.golden_tick === true;
        const displayName = u.display_name || (u.email ? u.email.split('@')[0] : 'User');
        const img = (u.avatar_url && u.avatar_url !== 'logo.png') ? u.avatar_url : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff`;
        const emailOrUser = u.email || (u.username ? '@' + u.username : 'Registered User');

        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="avatar-wrapper">
                            <img src="${escapeHtml(img)}" alt="${escapeHtml(displayName)}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff';">
                            ${hasGolden ? '<span class="golden-tick" title="Golden Verified">✓</span>' : ''}
                        </div>
                        <div>
                            <div class="user-name-title">
                                <span>${escapeHtml(displayName)}</span>
                                ${u.is_admin ? '<span style="font-size: 0.65rem; background: rgba(99,102,241,0.2); color:#818cf8; padding: 2px 6px; border-radius: 4px;">ADMIN</span>' : ''}
                            </div>
                            <div class="user-subtitle">ID: ${u.id.substring(0, 8)}...</div>
                        </div>
                    </div>
                </td>
                <td style="color: var(--text-muted); font-size: 0.88rem;">${escapeHtml(emailOrUser)}</td>
                <td>
                    ${hasGolden ? `
                        <span class="status-badge gold">⭐ Golden Verified</span>
                    ` : `
                        <span class="status-badge" style="background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid var(--border);">Standard</span>
                    `}
                </td>
                <td>
                    <div class="actions-cluster">
                        ${hasGolden ? `
                            <button class="btn btn-danger btn-sm" onclick="toggleUserGoldenTick('${u.id}', false)">
                                <span>❌ Remove Golden Tick</span>
                            </button>
                        ` : `
                            <button class="btn btn-gold btn-sm" onclick="toggleUserGoldenTick('${u.id}', true)">
                                <span>⭐ Give Golden Tick</span>
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 9. 1-Click Toggle Golden Tick for any User
window.toggleUserGoldenTick = async function(userId, enable) {
    const supabase = window.supabaseClient;
    if (!supabase) return;

    try {
        // Update profiles table
        const { error: pErr } = await supabase
            .from('profiles')
            .update({ golden_tick: enable })
            .eq('id', userId);

        if (pErr) throw pErr;

        // Also sync contributor record if user exists as contributor
        if (enable) {
            await supabase
                .from('contributors')
                .update({ status: 'ACTIVE', verified: true })
                .eq('user_id', userId);
        } else {
            await supabase
                .from('contributors')
                .update({ verified: false })
                .eq('user_id', userId);
        }

        showToast(enable ? "Golden Tick granted to user! ⭐" : "Golden Tick revoked from user.", "success");
        await loadAllData();
    } catch (err) {
        console.error("Toggle golden tick failed:", err);
        showToast("Failed to update Golden Tick status", "error");
    }
};

// Tab Switching
window.switchTab = function(tab) {
    const paneApps = document.getElementById('tab-pane-applications');
    const paneUsers = document.getElementById('tab-pane-users');
    const btnApps = document.getElementById('tab-btn-applications');
    const btnUsers = document.getElementById('tab-btn-users');

    if (tab === 'applications') {
        paneApps.style.display = 'block';
        paneUsers.style.display = 'none';
        btnApps.classList.add('active');
        btnUsers.classList.remove('active');
    } else {
        paneApps.style.display = 'none';
        paneUsers.style.display = 'block';
        btnApps.classList.remove('active');
        btnUsers.classList.add('active');
    }
};

// Filter Pills
window.setAppFilter = function(filter, btn) {
    currentAppFilter = filter;
    document.querySelectorAll('#tab-pane-applications .filter-pills .pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderApplications();
};

window.setUserFilter = function(filter, btn) {
    currentUserFilter = filter;
    document.querySelectorAll('#tab-pane-users .filter-pills .pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderUsers();
};

// Toast Helper
function showToast(msg, type = "success") {
    const toast = document.getElementById('admin-toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    if (toastIcon) {
        toastIcon.textContent = type === 'error' ? '⚠️' : (type === 'info' ? 'ℹ️' : '✓');
    }

    toast.className = `toast-box show`;
    setTimeout(() => {
        toast.className = 'toast-box';
    }, 3200);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
