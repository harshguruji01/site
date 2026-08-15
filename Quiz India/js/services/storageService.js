const STORAGE_KEY = 'quiz_india_data';

const defaultData = {
    profile: {
        name: null,
        classLevel: null,
        language: 'en', // 'en' or 'hi'
        avatar: '👤'
    },
    stats: {
        xp: 0,
        level: 1,
        quizzesPlayed: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        bestStreak: 0,
        currentStreak: 0,
        lastActiveDate: null
    },
    settings: {
        sound: true,
        theme: 'dark'
    },
    history: [],
    achievements: []
};

class StorageService {
    constructor() {
        this.data = this.loadData();
        this.checkDailyStreak();
    }

    loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                // Merge with defaultData to ensure new fields are present
                return { ...defaultData, ...JSON.parse(raw), 
                    profile: { ...defaultData.profile, ...(JSON.parse(raw).profile || {}) },
                    stats: { ...defaultData.stats, ...(JSON.parse(raw).stats || {}) },
                    settings: { ...defaultData.settings, ...(JSON.parse(raw).settings || {}) }
                };
            }
        } catch (e) {
            console.error("Failed to load local data", e);
        }
        return JSON.parse(JSON.stringify(defaultData));
    }

    saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            if (window.supabaseService && window.supabaseService.user) {
                // Don't await, let it run in background so UI doesn't lag
                window.supabaseService.pushToCloud();
            }
        } catch (e) {
            console.error("Failed to save local data", e);
        }
    }

    checkDailyStreak() {
        const today = new Date().toDateString();
        if (this.data.stats.lastActiveDate !== today) {
            // Check if it was exactly yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (this.data.stats.lastActiveDate === yesterday.toDateString()) {
                // Streak continues, but only increments upon playing a game, so we leave it.
            } else if (this.data.stats.lastActiveDate !== null) {
                // Missed a day
                this.data.stats.currentStreak = 0;
            }
            // We update lastActiveDate when a quiz is completed, not just opened.
        }
    }

    // Getters
    isNewUser() {
        return !this.data.profile.name;
    }

    getLang() {
        return this.data.profile.language || 'en';
    }

    getTheme() {
        return this.data.settings.theme || 'dark';
    }

    getProfile() {
        return this.data.profile;
    }

    getStats() {
        return this.data.stats;
    }

    // Setters
    setProfile(name, classLevel, lang) {
        this.data.profile.name = name;
        this.data.profile.classLevel = classLevel;
        this.data.profile.language = lang;
        this.saveData();
    }

    setLanguage(lang) {
        this.data.profile.language = lang;
        this.saveData();
    }

    setTheme(theme) {
        this.data.settings.theme = theme;
        this.saveData();
    }

    setSound(enabled) {
        this.data.settings.sound = enabled;
        this.saveData();
    }

    addQuizResult(result) {
        // Update stats
        this.data.stats.quizzesPlayed++;
        this.data.stats.questionsAnswered += result.total;
        this.data.stats.correctAnswers += result.correct;
        
        // Add XP
        this.data.stats.xp += result.xp;
        this.calculateLevel();

        // Update streak
        const today = new Date().toDateString();
        if (this.data.stats.lastActiveDate !== today) {
            this.data.stats.currentStreak++;
            this.data.stats.lastActiveDate = today;
            if (this.data.stats.currentStreak > this.data.stats.bestStreak) {
                this.data.stats.bestStreak = this.data.stats.currentStreak;
            }
        }

        // Save History (keep last 50)
        this.data.history.unshift({
            date: new Date().toISOString(),
            score: result.score,
            xp: result.xp,
            correct: result.correct,
            total: result.total,
            mode: result.mode
        });
        if (this.data.history.length > 50) this.data.history.pop();

        this.saveData();
    }

    calculateLevel() {
        const xp = this.data.stats.xp;
        // Simple formula: level = 1 + floor(sqrt(xp / 100))
        // So 100XP = lvl 2. 400XP = lvl 3. 900XP = lvl 4.
        const newLevel = 1 + Math.floor(Math.sqrt(xp / 100));
        
        if (newLevel > this.data.stats.level) {
            this.data.stats.level = newLevel;
            // Need to return this flag so UI can show level up animation
            return true;
        }
        return false;
    }

    getXpToNextLevel() {
        const currentLevel = this.data.stats.level;
        // The XP required to REACH the next level (currentLevel + 1)
        const targetXp = Math.pow(currentLevel, 2) * 100;
        return targetXp;
    }
    
    getXpOfCurrentLevel() {
        const currentLevel = this.data.stats.level;
        if(currentLevel === 1) return 0;
        return Math.pow(currentLevel - 1, 2) * 100;
    }

    resetData() {
        localStorage.removeItem(STORAGE_KEY);
        this.data = JSON.parse(JSON.stringify(defaultData));
        window.location.reload();
    }
}

window.storageService = new StorageService();
