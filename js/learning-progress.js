import { AuthManager } from './auth.js';
import { supabase } from './supabase.js';

export const ProgressManager = {
    // Save locally or to DB
    async saveProgress(subjectId, chapterId, type, data) {
        const key = `progress_${subjectId}_${chapterId}`;
        
        let localData = JSON.parse(localStorage.getItem(key)) || {};
        localData[type] = data; // e.g. type: 'quiz', data: {score: 8, total: 10}
        localData.lastAccessed = new Date().toISOString();
        
        localStorage.setItem(key, JSON.stringify(localData));

        if (AuthManager.currentUser) {
            // If logged in, optionally sync with Supabase here
            // Example:
            // await supabase.from('learning_progress').upsert({ user_id: AuthManager.currentUser.id, subject_id: subjectId, chapter_id: chapterId, data: localData });
            console.log("Progress saved remotely (simulated).");
        }
    },

    getProgress(subjectId, chapterId) {
        const key = `progress_${subjectId}_${chapterId}`;
        return JSON.parse(localStorage.getItem(key)) || null;
    },

    // Renders related subjects based on learning-data.js
    renderRelatedSubjects(containerId, classId, currentSubjectId, learningRegistry) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const subjects = learningRegistry.getSubjectsByClass(classId);
        const related = subjects.filter(s => s.id !== currentSubjectId);

        if (related.length === 0) {
            container.style.display = 'none';
            return;
        }

        let html = '<div class="topic-grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">';
        related.forEach(sub => {
            html += `
                <a href="../${sub.url}" class="topic-card" style="text-decoration: none; padding: 1rem; display: flex; align-items: center; gap: 0.75rem;">
                    <div style="font-size: 1.5rem;">${sub.icon}</div>
                    <div style="font-weight: 600; color: var(--hub-text-primary); margin: 0;">${sub.name}</div>
                </a>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }
};
