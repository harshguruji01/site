import { supabase } from './supabase.js';

let currentUser = null;
let profileImageFile = null;

document.addEventListener('DOMContentLoaded', () => {
    let checkInterval = setInterval(async () => {
        if (window.AuthManager && window.AuthManager.currentUser) {
            clearInterval(checkInterval);
            currentUser = window.AuthManager.currentUser;
            await initApplication();
        } else if (window.AuthManager && window.AuthManager.authResolved && !window.AuthManager.currentUser) {
            clearInterval(checkInterval);
            document.getElementById('unauthorized-msg').style.display = 'block';
        }
    }, 100);
});

async function initApplication() {
    // Check if already applied or active
    try {
        const { data: act } = await supabase.from('contributors').select('status').eq('user_id', currentUser.id).order('created_at', {ascending: false}).limit(1).single();
        if (act && act.status === 'ACTIVE') {
            document.getElementById('already-applied-text').textContent = "You are already a contributor.";
            document.getElementById('already-applied-msg').style.display = 'block';
            return;
        } else if (act && act.status === 'PENDING') {
            document.getElementById('already-applied-text').textContent = "Your contributor application is already under review.";
            document.getElementById('already-applied-msg').style.display = 'block';
            return;
        }
    } catch(e) { console.error(e); }

    document.getElementById('application-content').style.display = 'block';
    
    // Fill account info
    const profile = window.AuthManager.currentProfile;
    document.getElementById('acc-name').textContent = profile?.display_name || currentUser.email.split('@')[0];
    document.getElementById('acc-email').textContent = currentUser.email;
    document.getElementById('acc-id').textContent = `ID: ${currentUser.id}`;
    
    // File upload handler
    const dropzone = document.getElementById('image-dropzone');
    const fileInput = document.getElementById('profile_image');
    
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleImage(e.target.files[0]));
    
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent-primary)'; });
    dropzone.addEventListener('dragleave', (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--hub-border)'; });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--hub-border)';
        if(e.dataTransfer.files.length > 0) {
            handleImage(e.dataTransfer.files[0]);
        }
    });

    // Form submit
    document.getElementById('contributor-form').addEventListener('submit', handleSubmit);
}

function handleImage(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        alert("Image exceeds 5MB limit.");
        return;
    }
    profileImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('image-preview').src = e.target.result;
        document.getElementById('image-preview').style.display = 'inline-block';
        document.getElementById('image-text').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

async function handleSubmit(e) {
    e.preventDefault();
    
    // Validations
    const phrase1 = document.getElementById('confirm_step_1').value.trim();
    if (phrase1 !== "I Wants To Became Contributor") {
        document.getElementById('err_step_1').style.display = 'block';
        return;
    } else {
        document.getElementById('err_step_1').style.display = 'none';
    }

    const phrase2 = document.getElementById('confirm_step_2').value.trim();
    if (phrase2 !== "I Agree With All Terms And Condition") {
        document.getElementById('err_step_2').style.display = 'block';
        return;
    } else {
        document.getElementById('err_step_2').style.display = 'none';
    }

    const btn = document.getElementById('submit-btn');
    btn.textContent = 'Submitting Application...';
    btn.disabled = true;

    try {
        let imageUrl = null;
        if (profileImageFile) {
            const ext = profileImageFile.name.split('.').pop();
            const filePath = `${currentUser.id}/profile.${ext}`;
            const { error: upErr } = await supabase.storage.from('contributor-assets').upload(filePath, profileImageFile, { upsert: true });
            if (upErr) throw new Error("Image upload failed: " + upErr.message);
            const { data: pubUrl } = supabase.storage.from('contributor-assets').getPublicUrl(filePath);
            imageUrl = pubUrl.publicUrl;
        }

        // Gather areas
        const areas = [];
        document.querySelectorAll('input[name="area"]:checked').forEach(cb => areas.push(cb.value));

        // Gather skills
        const skillsRaw = document.getElementById('skills').value;
        const skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(s => s) : [];

        const application = {
            user_id: currentUser.id,
            display_name: document.getElementById('display_name').value,
            role: document.getElementById('role').value,
            bio: document.getElementById('bio').value,
            profile_image_path: imageUrl,
            status: 'PENDING',
            contribution_areas: areas,
            skills: skills
        };

        const { error: dbErr } = await supabase.from('contributors').insert(application);
        if (dbErr) throw new Error(dbErr.message);

        document.getElementById('application-content').style.display = 'none';
        document.getElementById('success-msg').style.display = 'block';
        
    } catch (err) {
        console.error(err);
        alert("Failed to submit application: " + err.message);
        btn.textContent = 'Submit Contributor Application';
        btn.disabled = false;
    }
}
