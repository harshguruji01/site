import { supabase } from './supabase.js';

export async function trackActivity(eventParams) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return; // Only track authenticated users
        
        const userId = session.user.id;
        
        // Auto-detect missing fields using the logic we built in navbar
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
            metadata: eventParams.metadata || {}
        };
        
        // Prevent massive duplicate page_view floods in single session state changes
        if (payload.activity_type === 'page_view') {
            const cacheKey = `last_page_view_${payload.page_path}`;
            const lastView = sessionStorage.getItem(cacheKey);
            const now = Date.now();
            // Debounce page views for the same path to 1 minute
            if (lastView && now - parseInt(lastView) < 60000) {
                return;
            }
            sessionStorage.setItem(cacheKey, now.toString());
        }

        const { error } = await supabase.from('user_activity').insert([payload]);
        if (error) {
            console.error("Error tracking activity:", error);
        }
    } catch (err) {
        console.error("Activity tracking failed:", err);
    }
}

// Expose globally so games and tools can trigger it easily
window.trackActivity = trackActivity;
