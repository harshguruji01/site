import { supabase } from './supabase.js';

export class DashboardManager {
    constructor() {
        this.activities = [];
        this.isLoading = true;
    }

    async init() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        this.userId = session.user.id;
        await this.fetchData();
        this.renderAll();
    }

    async fetchData() {
        try {
            const { data, error } = await supabase
                .from('user_activity')
                .select('*')
                .order('timestamp', { ascending: false });
                
            if (error) throw error;
            this.activities = data || [];
            this.isLoading = false;
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
            this.isLoading = false;
        }
    }

    renderAll() {
        if (this.isLoading) return;
        
        this.renderHeader();
        this.renderStatsCards();
        this.renderTimeline();
        this.renderMostVisited();
        this.renderCategorized('tool', 'tools-activity-container');
        this.renderCategorized('game', 'games-activity-container');
        this.renderCategorized('learning', 'learning-activity-container');
    }

    renderHeader() {
        const accountCreatedEvent = this.activities.find(a => a.activity_type === 'account_created');
        const creationDate = accountCreatedEvent 
            ? new Date(accountCreatedEvent.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : "Unknown";
            
        const lastActive = this.activities.length > 0 
            ? this.timeAgo(this.activities[0].timestamp)
            : "Never";

        document.getElementById('member-since').textContent = creationDate;
        document.getElementById('last-active').textContent = lastActive;
    }

    renderStatsCards() {
        document.getElementById('total-activity-count').textContent = this.activities.length;
        
        const toolsUsed = new Set(this.activities.filter(a => a.page_type === 'tool').map(a => a.page_path)).size;
        document.getElementById('tools-used-count').textContent = toolsUsed;

        const gamesPlayed = new Set(this.activities.filter(a => a.page_type === 'game').map(a => a.page_path)).size;
        document.getElementById('games-played-count').textContent = gamesPlayed;
        
        const learningPages = new Set(this.activities.filter(a => a.page_type === 'learning').map(a => a.page_path)).size;
        document.getElementById('learning-activity-count').textContent = learningPages;
    }

    renderTimeline() {
        const container = document.getElementById('recent-activity-container');
        container.innerHTML = '';
        
        if (this.activities.length === 0) {
            container.innerHTML = '<p class="empty-state">No activity found yet. Start exploring!</p>';
            return;
        }

        const recent = this.activities.slice(0, 10);
        recent.forEach(act => {
            const el = document.createElement('div');
            el.className = 'timeline-item';
            
            let icon = '📄';
            if (act.page_type === 'tool') icon = '🛠️';
            if (act.page_type === 'game') icon = '🎮';
            if (act.page_type === 'learning') icon = '📚';
            if (act.activity_type === 'search') icon = '🔎';

            el.innerHTML = `
                <div class="timeline-icon">${icon}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${act.activity_type === 'page_view' ? 'Visited' : 'Used'} ${act.page_name}</div>
                    <div class="timeline-time">${this.timeAgo(act.timestamp)}</div>
                </div>
            `;
            container.appendChild(el);
        });
    }

    renderMostVisited() {
        const counts = {};
        this.activities.forEach(act => {
            if (act.activity_type === 'page_view' && act.page_path && !act.page_path.includes('login') && !act.page_path.includes('dashboard')) {
                if (!counts[act.page_path]) counts[act.page_path] = { name: act.page_name, count: 0, path: act.page_path };
                counts[act.page_path].count++;
            }
        });

        const sorted = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
        const container = document.getElementById('most-visited-container');
        container.innerHTML = '';

        if (sorted.length === 0) {
            container.innerHTML = '<p class="empty-state">No visited pages yet.</p>';
            return;
        }

        sorted.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'rank-item';
            el.innerHTML = `
                <span class="rank-number">${index + 1}.</span>
                <a href="${item.path}" class="rank-name">${item.name}</a>
                <span class="rank-count">${item.count} visits</span>
            `;
            container.appendChild(el);
        });
    }

    renderCategorized(pageType, containerId) {
        const container = document.getElementById(containerId);
        if(!container) return;
        
        const counts = {};
        let lastUsed = {};
        
        this.activities.forEach(act => {
            if (act.page_type === pageType && act.page_path) {
                if (!counts[act.page_path]) {
                    counts[act.page_path] = { name: act.page_name, count: 0, path: act.page_path };
                    lastUsed[act.page_path] = act.timestamp;
                }
                counts[act.page_path].count++;
                if (new Date(act.timestamp) > new Date(lastUsed[act.page_path])) {
                    lastUsed[act.page_path] = act.timestamp;
                }
            }
        });

        const items = Object.values(counts).sort((a, b) => b.count - a.count);
        container.innerHTML = '';

        if (items.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }
        
        container.parentElement.style.display = 'block';

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cat-card';
            el.innerHTML = `
                <h4><a href="${item.path}">${item.name}</a></h4>
                <div class="cat-meta">Used ${item.count} times</div>
                <div class="cat-time">Last: ${this.timeAgo(lastUsed[item.path])}</div>
            `;
            container.appendChild(el);
        });
    }

    timeAgo(dateString) {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        if (Math.floor(seconds) < 30) return "Just now";
        return Math.floor(seconds) + " seconds ago";
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardManager();
    // Expose for debugging or UI callbacks
    window.Dashboard = dashboard; 
});