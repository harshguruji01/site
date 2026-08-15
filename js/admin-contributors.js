let currentUser = null;
let currentProfile = null;
let applications = [];

document.addEventListener('DOMContentLoaded', () => {
    initCustomAuth();
});

function initCustomAuth() {
    const pass1 = prompt("Step 1: Enter Admin Password");
    if (pass1 !== "AdminHarsh@StoreApk") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    const pass2 = prompt("Step 2: Enter Secondary Password");
    if (pass2 !== "RealAdminHarsh@StoreApk") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    const email = prompt("Step 3: Enter Admin Email");
    if (email !== "harshguruji01@gmail.com") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    document.getElementById('admin-user-email').textContent = email;
    document.getElementById('unauthorized-msg').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    
    let checkInterval = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(checkInterval);
            initAdmin();
        }
    }, 100);
}

async function initAdmin() {
    const supabase = window.supabaseClient;
    
    // Bindings
    document.getElementById('btn-logout').addEventListener('click', async () => {
        window.location.href = 'index.html';
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('review-modal').classList.remove('active');
    });
    
    loadData();
}

async function loadData() {
    const supabase = window.supabaseClient;
    
    // Load all contributors
    const { data: apps, error } = await supabase
        .from('contributors')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (!error && apps) {
        applications = apps;
        renderTable();
        updateStats();
    }
}

async function updateStats() {
    document.getElementById('stat-total').textContent = applications.length;
    document.getElementById('stat-pending').textContent = applications.filter(a => a.status === 'PENDING').length;
    const approvedCount = applications.filter(a => a.status === 'ACTIVE').length;
    document.getElementById('stat-approved').textContent = approvedCount;
    document.getElementById('stat-active').textContent = approvedCount;
}

function renderTable() {
    const tbody = document.getElementById('app-table-body');
    tbody.innerHTML = '';
    
    if (applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No applications found.</td></tr>';
        return;
    }
    
    applications.forEach(app => {
        const tr = document.createElement('tr');
        
        let badgeClass = 'pending';
        if (app.status === 'ACTIVE') badgeClass = 'approved';
        if (app.status === 'REJECTED') badgeClass = 'rejected';
        
        const date = new Date(app.created_at).toLocaleDateString();
        const img = app.profile_image_path || 'logo.png';
        
        tr.innerHTML = `
            <td class="app-row"><img src="${img}" alt="Profile"></td>
            <td><strong>${app.display_name}</strong></td>
            <td>${app.role}</td>
            <td>${date}</td>
            <td><span class="badge ${badgeClass}">${app.status}</span></td>
            <td>
                <button class="btn" onclick="viewApplication('${app.id}')">View</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.viewApplication = function(id) {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    const body = document.getElementById('modal-body-content');
    const footer = document.getElementById('modal-footer-content');
    
    const img = app.profile_image_path || 'logo.png';
    
    body.innerHTML = `
        <div style="text-align:center; margin-bottom: 1.5rem;">
            <img src="${img}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:2px solid var(--border);">
            <h3 style="margin-top:0.5rem;">${app.display_name}</h3>
            <span class="badge pending">${app.status}</span>
        </div>
        
        <div class="detail-grid">
            <div class="detail-label">Role</div><div class="detail-value">${app.role}</div>
            <div class="detail-label">Bio</div><div class="detail-value">${app.bio || '<i>No bio</i>'}</div>
        </div>
    `;
    
    if (app.status === 'PENDING') {
        footer.innerHTML = `
            <button class="btn" style="color:var(--danger); border-color:var(--danger);" onclick="rejectApp('${app.id}')">Reject</button>
            <button class="btn btn-primary" onclick="approveApp('${app.id}')">Approve</button>
        `;
    } else {
        footer.innerHTML = `
            <button class="btn" onclick="document.getElementById('review-modal').classList.remove('active')">Close</button>
        `;
    }
    
    document.getElementById('review-modal').classList.add('active');
}

window.approveApp = async function(id) {
    const supabase = window.supabaseClient;
    
    try {
        await supabase.from('contributors')
            .update({ status: 'ACTIVE' })
            .eq('id', id);
            
        document.getElementById('review-modal').classList.remove('active');
        loadData();
    } catch(err) {
        console.error(err);
        alert("Failed to approve");
    }
}

window.rejectApp = async function(id) {
    const supabase = window.supabaseClient;
    
    try {
        await supabase.from('contributors')
            .update({ status: 'REJECTED' })
            .eq('id', id);
            
        document.getElementById('review-modal').classList.remove('active');
        loadData();
    } catch(err) {
        console.error(err);
        alert("Failed to reject");
    }
}
