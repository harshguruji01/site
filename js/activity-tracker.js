import { db, auth } from './firebase.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export async function trackActivity(eventParams) {
    try {
        const user = auth.currentUser;
        if (!user) return; // Only track authenticated users
        
        const userId = user.uid;
        
        // Auto-detect missing fields
        const path = window.location.pathname;
        let defaultPageType = 'other';
        const normalPages = ['/', '/index.html', 'ai-hub.html', 'tool-hub.html', 'free-tools.html', 'gaming-hub.html', 'learning-hub.html', 'store.html', 'daily-special.html', 'about.html', 'contact.html', 'dashboard.html'];
        
        if (normalPages.some(p => path.endsWith(p))) defaultPageType = 'home';
        else if (path.includes('/tools/')) defaultPageType = 'tool';
        else if (path.includes('/games/')) defaultPageType = 'game';
        else if (path.includes('/learning/')) defaultPageType = 'learning';
        else if (path.includes('/store-')) defaultPageType = 'store';
        
        let defaultPageName = document.title ? document.title.split('|')[0].split('-')[0].trim() : "Unknown Page";
        const metaTitle = document.querySelector('meta[name="hg-page-title"]');
        if (metaTitle) defaultPageName = metaTitle.content;

        const payload = {
            user_id: userId,
            activity_type: eventParams.activity_type || 'page_view',
            page_type: eventParams.page_type || defaultPageType,
            page_name: eventParams.page_name || defaultPageName,
            page_path: eventParams.page_path || path,
            metadata: eventParams.metadata || {},
            timestamp: new Date().toISOString()
        };
        
        // Prevent massive duplicate page_view floods in single session state changes
        if (payload.activity_type === 'page_view') {
            const cacheKey = `last_page_view_${payload.page_path}`;
            const lastView = sessionStorage.getItem(cacheKey);
            const now = Date.now();
            if (lastView && now - parseInt(lastView) < 60000) {
                return;
            }
            sessionStorage.setItem(cacheKey, now.toString());
        }

        await addDoc(collection(db, 'activities'), payload);
    } catch (err) {
        // Silently catch tracking errors so application flow is never disrupted
        console.warn("Activity tracking notice:", err);
    }
}

// Expose globally so games and tools can trigger it easily
window.trackActivity = trackActivity;
