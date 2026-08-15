// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initCustomAuth();
});

function initCustomAuth() {
    // 1st Password
    const pass1 = prompt("Step 1: Enter Admin Password");
    if (pass1 !== "AdminHarsh@StoreApk") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    // 2nd Password
    const pass2 = prompt("Step 2: Enter Secondary Password");
    if (pass2 !== "RealAdminHarsh@StoreApk") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    // Email
    const email = prompt("Step 3: Enter Admin Email");
    if (email !== "harshguruji01@gmail.com") {
        alert("Access Denied.");
        window.location.href = "index.html";
        return;
    }
    
    // Auth Success
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

function initAdmin() {
    // Load Stats
    loadStats();
    
    // Setup File Handlers
    setupFileHandlers();
    
    // Setup Form
    document.getElementById('apk-upload-form').addEventListener('submit', handleUpload);
    document.getElementById('btn-reset').addEventListener('click', () => {
        document.getElementById('apk-upload-form').reset();
        resetFileBoxes();
    });
    
    // Slug generation
    document.getElementById('app-name').addEventListener('input', (e) => {
        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        document.getElementById('app-slug').value = slug;
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        window.location.reload();
    });
}

async function loadStats() {
    const supabase = window.supabaseClient;
    
    const { data: apps, error } = await supabase.from('store_apps').select('status, downloads');
    if (error || !apps) return;
    
    let total = apps.length;
    let published = apps.filter(a => a.status === 'Published').length;
    let drafts = apps.filter(a => a.status === 'Draft').length;
    let downloads = apps.reduce((sum, a) => sum + (a.downloads || 0), 0);
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-published').textContent = published;
    document.getElementById('stat-drafts').textContent = drafts;
    document.getElementById('stat-downloads').textContent = downloads;
}

// --- FILE HANDLERS ---
function setupFileHandlers() {
    setupDropzone('logo-dropzone', 'app-logo', 'logo-filename');
    setupDropzone('apk-dropzone', 'app-apk', 'apk-filename');
    setupDropzone('screenshots-dropzone', 'app-screenshots', 'screenshots-filename', true);
}

function setupDropzone(zoneId, inputId, textId, isMultiple = false) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    const text = document.getElementById(textId);
    
    zone.addEventListener('click', () => input.click());
    
    input.addEventListener('change', (e) => {
        if (input.files.length > 0) {
            if (isMultiple) {
                text.textContent = `${input.files.length} file(s) selected`;
            } else {
                text.textContent = input.files[0].name;
            }
            zone.style.borderColor = 'var(--success)';
        }
    });
    
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--primary)';
    });
    
    zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (input.files.length === 0) zone.style.borderColor = 'var(--border)';
    });
    
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            input.files = e.dataTransfer.files;
            const event = new Event('change');
            input.dispatchEvent(event);
        }
    });
}

function resetFileBoxes() {
    document.getElementById('logo-filename').textContent = "Drag & Drop or Click to Select (PNG/WebP)";
    document.getElementById('apk-filename').textContent = "Drag & Drop or Click to Select (.apk)";
    document.getElementById('screenshots-filename').textContent = "Select multiple screenshot images";
    document.querySelectorAll('.file-upload-box').forEach(b => b.style.borderColor = 'var(--border)');
}

// --- UPLOAD LOGIC ---
async function handleUpload(e) {
    e.preventDefault();
    
    const supabase = window.supabaseClient;
    const slug = document.getElementById('app-slug').value.trim();
    
    // Check if slug exists
    const { data: existing } = await supabase.from('store_apps').select('id').eq('slug', slug).single();
    if (existing) {
        showToast("Error: An app with this slug already exists.", "error");
        return;
    }
    
    // Get Files
    const logoFile = document.getElementById('app-logo').files[0];
    const apkFile = document.getElementById('app-apk').files[0];
    const screenshots = document.getElementById('app-screenshots').files;
    
    if (!logoFile || !apkFile) {
        showToast("Logo and APK are required.", "error");
        return;
    }
    
    // UI Progress Setup
    const overlay = document.getElementById('progress-overlay');
    overlay.classList.add('active');
    
    let logoUrl = '';
    let apkPath = '';
    let screenshotUrls = [];
    
    try {
        // 1. Upload Logo
        updateProgress('logo', 50);
        const logoExt = logoFile.name.split('.').pop();
        const logoPath = `${slug}/icon.${logoExt}`;
        const { error: logoErr } = await supabase.storage.from('app-logos').upload(logoPath, logoFile, { upsert: true });
        if (logoErr) throw new Error("Logo upload failed: " + logoErr.message);
        const { data: logoPub } = supabase.storage.from('app-logos').getPublicUrl(logoPath);
        logoUrl = logoPub.publicUrl;
        updateProgress('logo', 100);
        
        // 2. Upload APK
        updateProgress('apk', 30);
        const version = document.getElementById('app-version').value;
        apkPath = `${slug}/${version}/${apkFile.name}`;
        // Since APK can be large, we'll just fake progress for UI, supabase JS doesn't have onProgress yet in standard upload
        const { error: apkErr } = await supabase.storage.from('apk-files').upload(apkPath, apkFile, { upsert: true });
        if (apkErr) throw new Error("APK upload failed: " + apkErr.message);
        
        const { data: apkPub } = supabase.storage.from('apk-files').getPublicUrl(apkPath);
        const downloadUrl = apkPub.publicUrl;
        updateProgress('apk', 100);
        
        // 3. Upload Screenshots
        if (screenshots.length > 0) {
            let scCount = 0;
            for (let i = 0; i < screenshots.length; i++) {
                const sc = screenshots[i];
                const scExt = sc.name.split('.').pop();
                const scPath = `${slug}/sc_${i}.${scExt}`;
                const { error: scErr } = await supabase.storage.from('app-screenshots').upload(scPath, sc, { upsert: true });
                if (!scErr) {
                    const { data: scPub } = supabase.storage.from('app-screenshots').getPublicUrl(scPath);
                    screenshotUrls.push(scPub.publicUrl);
                }
                scCount++;
                updateProgress('screenshots', (scCount / screenshots.length) * 100);
            }
        } else {
            updateProgress('screenshots', 100);
        }
        
        // 4. Save to DB
        document.getElementById('progress-item-db').querySelector('.pct').textContent = "Saving...";
        
        const fileSizeStr = (apkFile.size / (1024 * 1024)).toFixed(1) + " MB";
        
        const status = document.getElementById('app-status').value;
        const appData = {
            name: document.getElementById('app-name').value,
            slug: slug,
            short_description: document.getElementById('app-short-desc').value,
            description: document.getElementById('app-full-desc').value,
            logo_url: logoUrl,
            category: document.getElementById('app-category').value,
            subcategory: document.getElementById('app-subcategory').value,
            developer_name: document.getElementById('app-developer').value,
            package_name: document.getElementById('app-package').value,
            version: version,
            version_code: parseInt(document.getElementById('app-version-code').value) || 1,
            file_size: fileSizeStr,
            whats_new: document.getElementById('app-whats-new').value,
            apk_storage_path: apkPath,
            download_url: downloadUrl,
            screenshots: screenshotUrls,
            featured: document.getElementById('app-featured').checked,
            verified: document.getElementById('app-verified').checked,
            status: status,
            published_at: status === 'Published' ? new Date().toISOString() : null
        };
        
        const { error: dbErr } = await supabase.from('store_apps').insert(appData);
        if (dbErr) throw new Error("Database error: " + dbErr.message);
        
        document.getElementById('progress-item-db').querySelector('.pct').textContent = "Done!";
        document.getElementById('progress-item-db').querySelector('.pct').style.color = "var(--success)";
        
        setTimeout(() => {
            overlay.classList.remove('active');
            showToast("Application uploaded successfully!", "success");
            document.getElementById('apk-upload-form').reset();
            resetFileBoxes();
            loadStats();
        }, 1500);
        
    } catch (err) {
        overlay.classList.remove('active');
        console.error(err);
        showToast(err.message, "error");
    }
}

function updateProgress(id, pct) {
    const item = document.getElementById(`progress-item-${id}`);
    if(item) {
        item.querySelector('.progress-fill').style.width = `${pct}%`;
        item.querySelector('.pct').textContent = `${Math.round(pct)}%`;
    }
}

function showToast(msg, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s forwards reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
