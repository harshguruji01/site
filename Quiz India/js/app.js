document.addEventListener('DOMContentLoaded', () => {
    // --- State & Initialization ---
    const storage = window.storageService;
    const i18n = window.i18nService;
    const engine = new window.QuizEngine();
    
    // Start App
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
        initApp();
    }, 100);

    async function initApp() {
        i18n.translateDOM();
        applyTheme();
        
        if (window.supabaseService) {
            await window.supabaseService.initSession();
            window.refreshProfileUI = () => {
                updateHomeStats();
                if (!document.getElementById('profile-view').classList.contains('hidden')) {
                    openProfile();
                }
            };
        }
        
        if (storage.isNewUser()) {
            showView('onboarding-view');
        } else {
            updateHomeStats();
            showView('home-view');
        }
        
        setupEventListeners();
    }

    // --- DOM Elements & View Management ---
    const views = document.querySelectorAll('.view');
    function showView(viewId) {
        views.forEach(v => {
            if (v.id === viewId) {
                v.classList.remove('hidden');
            } else {
                v.classList.add('hidden');
            }
        });
    }

    // --- Onboarding Logic ---
    document.getElementById('btn-ob-next-1').addEventListener('click', () => {
        const name = document.getElementById('ob-name-input').value.trim();
        if (!name) return;
        document.getElementById('onboarding-step-1').classList.add('hidden');
        document.getElementById('onboarding-step-2').classList.remove('hidden');
        if (window.soundService) window.soundService.playClick();
    });

    document.getElementById('btn-ob-back-2').addEventListener('click', () => {
        document.getElementById('onboarding-step-2').classList.add('hidden');
        document.getElementById('onboarding-step-1').classList.remove('hidden');
        if (window.soundService) window.soundService.playClick();
    });

    document.getElementById('btn-ob-next-2').addEventListener('click', () => {
        document.getElementById('onboarding-step-2').classList.add('hidden');
        document.getElementById('onboarding-step-3').classList.remove('hidden');
        if (window.soundService) window.soundService.playClick();
    });

    document.getElementById('btn-ob-back-3').addEventListener('click', () => {
        document.getElementById('onboarding-step-3').classList.add('hidden');
        document.getElementById('onboarding-step-2').classList.remove('hidden');
        if (window.soundService) window.soundService.playClick();
    });

    // Language selection cards
    let selectedLang = 'en';
    document.querySelectorAll('.lang-card').forEach(card => {
        card.addEventListener('click', (e) => {
            document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            selectedLang = target.getAttribute('data-lang');
            if (window.soundService) window.soundService.playClick();
        });
    });

    document.getElementById('btn-ob-finish').addEventListener('click', () => {
        const name = document.getElementById('ob-name-input').value.trim();
        const classLevel = document.getElementById('ob-class-select').value;
        
        storage.setProfile(name, classLevel, selectedLang);
        i18n.setLang(selectedLang);
        
        if (window.soundService) {
            window.soundService.playClick();
            window.soundService.playLevelUp();
        }
        window.Animations.showToast(i18n.getText('onboarding_name_title') + " " + name, "success");
        
        updateHomeStats();
        showView('home-view');
    });

    // --- Home Screen Logic ---
    function updateHomeStats() {
        const profile = storage.getProfile();
        const stats = storage.getStats();
        
        document.getElementById('home-user-name').textContent = profile.name || 'Player';
        document.getElementById('home-user-level').textContent = `Lvl ${stats.level}`;
        document.getElementById('home-streak-count').textContent = stats.currentStreak;
        
        const avatarEl = document.getElementById('home-avatar');
        if (profile.avatar && profile.avatar.startsWith('http')) {
            avatarEl.innerHTML = `<img src="${profile.avatar}" alt="Avatar" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
        } else {
            avatarEl.innerHTML = profile.avatar || '👤';
        }
        
        const xpOfCurrentLvl = storage.getXpOfCurrentLevel();
        const xpToNextLvl = storage.getXpToNextLevel();
        const progressXp = stats.xp - xpOfCurrentLvl;
        const totalRequired = xpToNextLvl - xpOfCurrentLvl;
        
        const pct = Math.min(100, Math.max(0, (progressXp / totalRequired) * 100));
        document.getElementById('home-xp-fill').style.width = `${pct}%`;
        document.getElementById('home-xp-text').textContent = `${progressXp} / ${totalRequired}`;
        
        renderSubjects();
    }

    function renderSubjects() {
        const container = document.getElementById('home-subjects-grid');
        const allContainer = document.getElementById('all-subjects-list');
        container.innerHTML = '';
        allContainer.innerHTML = '';
        
        const lang = i18n.currentLang;
        const subList = window.subjects || [];
        
        subList.forEach((sub, idx) => {
            const html = `
                <div class="subject-card" data-id="${sub.id}">
                    <div class="subject-icon" style="background:${sub.color}">${sub.icon}</div>
                    <div class="subject-title">${lang === 'hi' ? sub.hi_name : sub.name}</div>
                </div>
            `;
            allContainer.innerHTML += html;
            if (idx < 4) container.innerHTML += html; // only show 4 on home
        });

        // Add event listeners
        document.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const subId = e.currentTarget.getAttribute('data-id');
                if (window.soundService) window.soundService.playClick();
                if(engine.startQuiz('subject', subId)) {
                    showView('quiz-view');
                }
            });
        });
    }

    // Navigation Buttons
    document.getElementById('btn-all-subjects').addEventListener('click', () => {
        showView('subjects-view');
        if (window.soundService) window.soundService.playClick();
    });
    
    document.querySelectorAll('.btn-back-home').forEach(btn => {
        btn.addEventListener('click', () => {
            updateHomeStats();
            showView('home-view');
            if (window.soundService) window.soundService.playClick();
        });
    });

    document.getElementById('btn-profile').addEventListener('click', openProfile);
    document.getElementById('btn-nav-profile').addEventListener('click', openProfile);
    
    function openProfile() {
        const stats = storage.getStats();
        const profile = storage.getProfile();
        
        // Show/Hide Auth Buttons
        if (window.supabaseService && window.supabaseService.user) {
            document.getElementById('btn-open-auth').classList.add('hidden');
            document.getElementById('btn-logout').classList.remove('hidden');
        } else {
            document.getElementById('btn-open-auth').classList.remove('hidden');
            document.getElementById('btn-logout').classList.add('hidden');
        }
        
        document.getElementById('profile-name').textContent = profile.name;
        document.getElementById('profile-class').textContent = "Class " + profile.classLevel;
        document.getElementById('profile-level').textContent = stats.level;
        document.getElementById('profile-total-xp').textContent = stats.xp + " XP";
        
        const xpOfCurrentLvl = storage.getXpOfCurrentLevel();
        const xpToNextLvl = storage.getXpToNextLevel();
        const progressXp = stats.xp - xpOfCurrentLvl;
        const totalRequired = xpToNextLvl - xpOfCurrentLvl;
        const pct = Math.min(100, Math.max(0, (progressXp / totalRequired) * 100));
        
        document.getElementById('profile-xp-fill').style.width = `${pct}%`;
        document.getElementById('profile-xp-next').textContent = `${totalRequired - progressXp} XP to next level`;
        
        document.getElementById('stat-quizzes').textContent = stats.quizzesPlayed;
        document.getElementById('stat-questions').textContent = stats.questionsAnswered;
        const acc = stats.questionsAnswered === 0 ? 0 : Math.round((stats.correctAnswers / stats.questionsAnswered) * 100);
        document.getElementById('stat-accuracy').textContent = acc + "%";
        document.getElementById('stat-best-streak').textContent = stats.bestStreak;
        
        showView('profile-view');
    }

    // Reset Data
    document.getElementById('btn-reset-data').addEventListener('click', () => {
        if(confirm(i18n.getText('btn_reset_data') + "?")) {
            storage.resetData();
        }
    });

    // Modals
    document.getElementById('btn-settings').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.remove('hidden');
        document.getElementById('setting-lang-select').value = i18n.currentLang;
        document.getElementById('setting-sound-toggle').checked = storage.data.settings.sound;
        document.getElementById('setting-theme-toggle').checked = storage.data.settings.theme === 'dark';
    });

    document.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('hidden');
            
            // Save settings
            const newLang = document.getElementById('setting-lang-select').value;
            const newSound = document.getElementById('setting-sound-toggle').checked;
            const newTheme = document.getElementById('setting-theme-toggle').checked ? 'dark' : 'light';
            
            if (newLang !== i18n.currentLang) {
                i18n.setLang(newLang);
                updateHomeStats(); // re-render subjects translation
            }
            storage.setSound(newSound);
            storage.setTheme(newTheme);
            if (window.soundService) window.soundService.enabled = newSound;
            
            applyTheme();
        });
    });

    function applyTheme() {
        const theme = storage.getTheme();
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.remove('theme-dark');
        }
    }

    // Bottom Nav
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            if(targetId) {
                showView(targetId);
                // Update active state
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                if (e.currentTarget) e.currentTarget.classList.add('active');
            }
        });
    });

    // --- Quiz Engine Integration ---
    document.getElementById('btn-quick-quiz').addEventListener('click', () => {
        if (window.soundService) window.soundService.playClick();
        if(engine.startQuiz('quick')) showView('quiz-view');
    });
    
    document.getElementById('btn-classic-quiz').addEventListener('click', () => {
        if (window.soundService) window.soundService.playClick();
        if(engine.startQuiz('classic')) showView('quiz-view');
    });

    document.getElementById('btn-daily-challenge').addEventListener('click', () => {
        if (window.soundService) window.soundService.playClick();
        if(engine.startQuiz('daily')) showView('quiz-view');
    });

    document.getElementById('btn-quiz-exit').addEventListener('click', () => {
        if(confirm("Exit quiz? Your progress will be lost.")) {
            engine.stopTimer();
            updateHomeStats();
            showView('home-view');
        }
    });

    document.getElementById('btn-quiz-next').addEventListener('click', () => {
        document.getElementById('btn-quiz-next').classList.add('hidden');
        document.getElementById('q-feedback-area').classList.add('hidden');
        engine.next();
    });

    // Engine Callbacks
    engine.onQuestionChange = (data) => {
        const lang = i18n.currentLang;
        document.getElementById('quiz-q-tracker').textContent = `Q ${data.questionNumber} / ${data.total}`;
        document.getElementById('quiz-progress-bar').style.width = `${(data.questionNumber / data.total) * 100}%`;
        document.getElementById('quiz-score-val').textContent = data.score;
        document.getElementById('quiz-streak-hud').textContent = `Streak: ${data.streak}`;
        
        const qData = data.qData;
        const qTextNode = qData.question[lang] || qData.question['en'];
        const optionsList = qData.options[lang] || qData.options['en'];
        
        // Handle subject lookup
        const subj = window.subjects.find(s => s.id === qData.subject);
        document.getElementById('q-subject-label').textContent = subj ? (lang === 'hi' ? subj.hi_name : subj.name) : "Quiz";
        
        document.getElementById('q-difficulty-badge').textContent = qData.difficulty;
        
        // Reset Feedback
        document.getElementById('q-feedback-area').classList.add('hidden');
        document.getElementById('q-feedback-area').classList.remove('scale-up');
        document.getElementById('btn-quiz-next').classList.add('hidden');
        document.getElementById('btn-quiz-next').classList.remove('slide-up');
        
        // Format question text (support line breaks)
        document.getElementById('q-text').innerHTML = qTextNode.replace(/\n/g, '<br>');
        
        // Render Options
        const optContainer = document.getElementById('q-options-container');
        optContainer.innerHTML = '';
        
        optionsList.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            
            // Format true/false or A/B/C/D if needed, but for now just text
            btn.innerHTML = `<span>${optText}</span>`;
            
            btn.addEventListener('click', () => {
                // Disable all options
                document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
                btn.classList.add('selected');
                engine.submitAnswer(idx);
            });
            
            optContainer.appendChild(btn);
        });
    };

    engine.onTimerUpdate = (left, max) => {
        const display = document.getElementById('quiz-time-left');
        display.textContent = left;
        const container = document.getElementById('quiz-timer-display');
        
        if (left <= 5) {
            container.classList.add('warning');
        } else {
            container.classList.remove('warning');
        }
    };

    engine.onAnswerFeedback = (data) => {
        const lang = i18n.currentLang;
        
        const options = document.querySelectorAll('.quiz-option');
        if (data.isTimeout) {
            window.Animations.showToast(i18n.getText('msg_timeout'), 'error');
        } else {
            if (data.correct) {
                options[data.selectedIdx].classList.add('correct');
            } else {
                options[data.selectedIdx].classList.add('wrong');
            }
        }
        
        // Highlight correct option always
        if (options[data.correctIdx]) {
            options[data.correctIdx].classList.add('correct');
        }

        // Show feedback area
        const fbArea = document.getElementById('q-feedback-area');
        const fbTitle = document.getElementById('fb-title');
        const fbIcon = document.getElementById('fb-icon');
        const fbXp = document.getElementById('fb-xp');
        const fbExpl = document.getElementById('fb-explanation');
        
        fbArea.classList.remove('hidden');
        // trigger animation restart
        void fbArea.offsetWidth;
        fbArea.classList.add('scale-up');
        
        if (data.correct) {
            fbIcon.textContent = '✓';
            fbIcon.className = 'feedback-icon text-2xl text-green-400';
            fbTitle.textContent = i18n.getText('msg_correct');
            fbTitle.className = 'feedback-title font-bold text-xl text-green-400';
            fbXp.textContent = `+${data.xpGained} XP`;
            fbXp.style.display = 'block';
        } else {
            fbIcon.textContent = '✕';
            fbIcon.className = 'feedback-icon text-2xl text-danger';
            fbTitle.textContent = data.isTimeout ? i18n.getText('msg_timeout') : i18n.getText('msg_wrong');
            fbTitle.className = 'feedback-title font-bold text-xl text-danger';
            fbXp.style.display = 'none';
        }
        
        const explanationText = data.explanation[lang] || data.explanation['en'];
        fbExpl.textContent = explanationText || "";
        
        const nextBtn = document.getElementById('btn-quiz-next');
        nextBtn.classList.remove('hidden');
        void nextBtn.offsetWidth;
        nextBtn.classList.add('slide-up');
    };

    engine.onQuizComplete = (data) => {
        // check if level up
        const isLevelUp = storage.calculateLevel(); // re-calc just in case
        
        showView('results-view');
        
        document.getElementById('results-score').textContent = data.score;
        document.getElementById('results-xp').textContent = `+${data.xp}`;
        document.getElementById('results-correct').textContent = `${data.correct} / ${data.total}`;
        document.getElementById('results-streak').textContent = data.bestStreak;
        
        const acc = Math.round((data.correct / data.total) * 100);
        document.getElementById('results-accuracy-ring').style.strokeDasharray = `${acc}, 100`;
        window.Animations.animateNumber(document.getElementById('results-accuracy-text'), 0, acc, 1500);
        document.getElementById('results-accuracy-text').textContent = acc + '%';
        
        if (acc >= 80) {
            document.getElementById('results-message').textContent = "Outstanding Performance! 🌟";
        } else if (acc >= 50) {
            document.getElementById('results-message').textContent = "Good job! Keep practicing. 👍";
        } else {
            document.getElementById('results-message').textContent = "Don't give up! Review the answers. 📚";
        }

        setTimeout(() => {
            window.Animations.fireConfetti();
            if (isLevelUp) {
                setTimeout(() => {
                    if (window.soundService) window.soundService.playLevelUp();
                    window.Animations.showToast(i18n.getText('msg_level_up') + " " + storage.getStats().level, 'level-up');
                }, 1000);
            }
        }, 300);
    };

    document.getElementById('btn-results-home').addEventListener('click', () => {
        if (window.soundService) window.soundService.playClick();
        updateHomeStats();
        showView('home-view');
    });

    document.getElementById('btn-results-retry').addEventListener('click', () => {
        if (window.soundService) window.soundService.playClick();
        if(engine.startQuiz(engine.mode)) showView('quiz-view');
    });

    // --- Authentication Logic ---
    document.getElementById('btn-open-auth').addEventListener('click', () => {
        document.getElementById('auth-modal').classList.remove('hidden');
    });

    document.getElementById('btn-logout').addEventListener('click', async () => {
        if (confirm("Are you sure you want to logout?")) {
            if (window.supabaseService) await window.supabaseService.signOut();
            storage.resetData();
        }
    });

    document.getElementById('btn-auth-signup').addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        if (!email || !pass) return alert("Please enter email and password");
        if (!window.supabaseService) return alert("Supabase not configured!");
        
        const { data, error } = await window.supabaseService.signUp(email, pass);
        if (error) {
            alert(error.message);
        } else {
            alert("Signed up successfully! Checking session...");
            document.getElementById('auth-modal').classList.add('hidden');
        }
    });

    document.getElementById('btn-auth-login').addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        if (!email || !pass) return alert("Please enter email and password");
        if (!window.supabaseService) return alert("Supabase not configured!");
        
        const { data, error } = await window.supabaseService.signIn(email, pass);
        if (error) {
            alert(error.message);
        } else {
            document.getElementById('auth-modal').classList.add('hidden');
            window.Animations.showToast("Logged in securely", "success");
        }
    });

    document.getElementById('btn-auth-google').addEventListener('click', () => {
        if (window.supabaseService) window.supabaseService.signInWithGoogle();
    });

    function setupEventListeners() {
        // Fallback for anything not explicitly bound
    }
});