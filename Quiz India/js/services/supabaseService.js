import { supabase } from '../../../js/supabase.js';
import { getProfile } from '../../../js/profile.js';

class SupabaseService {
    constructor() {
        this.client = supabase;
        this.user = null;
        this.profile = null;
    }

    async initSession() {
        if (!this.client) return null;
        const { data: { session } } = await this.client.auth.getSession();
        this.user = session?.user || null;
        
        if (this.user) {
            this.profile = await getProfile(this.user.id);
            await this.syncToLocal();
        }
        
        // Listen for auth changes
        this.client.auth.onAuthStateChange(async (_event, session) => {
            this.user = session?.user || null;
            if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
                if (this.user) {
                    this.profile = await getProfile(this.user.id);
                }
                await this.syncToLocal();
                if (window.refreshProfileUI) window.refreshProfileUI();
            } else if (_event === 'SIGNED_OUT') {
                this.profile = null;
                // Wait, if logged out, maybe don't wipe data immediately to avoid data loss for offline,
                // But the user's progress should be tied to account. For now, just reload the page.
                window.location.reload();
            }
        });
        
        return this.user;
    }

    // Auth methods (Fallback if user tries to login from game)
    async signInWithGoogle() {
        if (!this.client) return;
        await this.client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } });
    }

    async signOut() {
        if (!this.client) return;
        await this.client.auth.signOut();
        this.user = null;
        this.profile = null;
    }

    // Database Syncing
    
    // Call this to push current local state to cloud
    async pushToCloud() {
        if (!this.client || !this.user) return;
        
        const localData = window.storageService.data;
        
        try {
            await this.client.from('quiz_stats').upsert({
                user_id: this.user.id,
                xp: localData.stats.xp,
                level: localData.stats.level,
                quizzes_played: localData.stats.quizzesPlayed,
                questions_answered: localData.stats.questionsAnswered,
                correct_answers: localData.stats.correctAnswers,
                best_streak: localData.stats.bestStreak,
                current_streak: localData.stats.currentStreak,
                last_active_date: localData.stats.lastActiveDate,
                class_level: localData.profile.classLevel,
                language: localData.profile.language,
                updated_at: new Date().toISOString()
            });
        } catch(e) {
            console.error("Error pushing to cloud", e);
        }
    }

    // Call this to pull cloud state to local device
    async syncToLocal() {
        if (!this.client || !this.user) return;
        
        try {
            const { data, error } = await this.client
                .from('quiz_stats')
                .select('*')
                .eq('user_id', this.user.id)
                .single();
                
            if (data && !error) {
                const localData = window.storageService.data;
                
                // Merge data (cloud takes precedence for stats)
                localData.stats.xp = Math.max(localData.stats.xp, data.xp || 0);
                localData.stats.level = Math.max(localData.stats.level, data.level || 1);
                localData.stats.quizzesPlayed = Math.max(localData.stats.quizzesPlayed, data.quizzes_played || 0);
                localData.stats.questionsAnswered = Math.max(localData.stats.questionsAnswered, data.questions_answered || 0);
                localData.stats.correctAnswers = Math.max(localData.stats.correctAnswers, data.correct_answers || 0);
                localData.stats.bestStreak = Math.max(localData.stats.bestStreak, data.best_streak || 0);
                
                // Profile comes from global auth 'profiles' table (fetched during initSession)
                if (this.profile) {
                    localData.profile.name = this.profile.display_name || this.profile.username || localData.profile.name;
                    localData.profile.avatar = this.profile.avatar_url || '👤';
                }
                
                if (data.class_level) localData.profile.classLevel = data.class_level;
                if (data.language) localData.profile.language = data.language;
                
                // Save merged data back to local storage
                localStorage.setItem('quiz_india_data', JSON.stringify(localData));
            } else if (error && error.code === 'PGRST116') {
                // Not found - user is playing for first time. Push local data up.
                await this.pushToCloud();
            }
        } catch(e) {
            console.error("Error pulling from cloud", e);
        }
    }
}

// Instantiate and make available globally
window.supabaseService = new SupabaseService();
