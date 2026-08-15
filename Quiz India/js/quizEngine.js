class QuizEngine {
    constructor() {
        this.questions = [];
        this.currentQIndex = 0;
        
        // State
        this.score = 0;
        this.xpEarned = 0;
        this.correctCount = 0;
        this.streak = 0;
        this.bestQuizStreak = 0;
        
        this.timer = null;
        this.timeLeft = 60;
        this.maxTime = 60;
        
        this.isAnswered = false;
        this.mode = 'quick'; // quick, classic, daily
        
        this.onQuestionChange = null;
        this.onAnswerFeedback = null;
        this.onQuizComplete = null;
        this.onTimerUpdate = null;
    }

    startQuiz(mode, subjectId = null) {
        this.mode = mode;
        this.score = 0;
        this.xpEarned = 0;
        this.correctCount = 0;
        this.streak = 0;
        this.bestQuizStreak = 0;
        this.currentQIndex = 0;
        
        // Setup questions based on mode
        let count = 10;
        if (mode === 'classic') count = 20;
        
        if (mode === 'daily') {
            this.questions = window.getDailyChallengeQuestions();
            count = this.questions.length;
        } else {
            this.questions = window.getRandomQuestions(count, subjectId);
        }

        if (this.questions.length === 0) {
            alert("No questions available for this category.");
            return false;
        }
        
        this.maxTime = mode === 'quick' ? 30 : 60;
        this.loadNextQuestion();
        return true;
    }

    loadNextQuestion() {
        if (this.currentQIndex >= this.questions.length) {
            this.finishQuiz();
            return;
        }

        this.isAnswered = false;
        const q = this.questions[this.currentQIndex];
        
        // Reset timer
        this.timeLeft = this.maxTime;
        this.startTimer();
        
        if (this.onQuestionChange) {
            this.onQuestionChange({
                questionNumber: this.currentQIndex + 1,
                total: this.questions.length,
                qData: q,
                streak: this.streak,
                score: this.score
            });
        }
    }

    startTimer() {
        this.stopTimer();
        if (this.onTimerUpdate) this.onTimerUpdate(this.timeLeft, this.maxTime);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            if (this.onTimerUpdate) this.onTimerUpdate(this.timeLeft, this.maxTime);
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.handleTimeout();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    handleTimeout() {
        if (this.isAnswered) return;
        this.isAnswered = true;
        this.streak = 0; // reset streak
        if (window.soundService) window.soundService.playWrong();
        
        if (this.onAnswerFeedback) {
            this.onAnswerFeedback({
                correct: false,
                isTimeout: true,
                correctIdx: this.questions[this.currentQIndex].correctAnswer,
                xpGained: 0,
                explanation: this.questions[this.currentQIndex].explanation
            });
        }
    }

    submitAnswer(selectedIndex) {
        if (this.isAnswered) return;
        this.isAnswered = true;
        this.stopTimer();

        const q = this.questions[this.currentQIndex];
        const isCorrect = (selectedIndex === q.correctAnswer);
        
        let xpGained = 0;
        
        if (isCorrect) {
            this.correctCount++;
            this.streak++;
            if (this.streak > this.bestQuizStreak) this.bestQuizStreak = this.streak;
            
            // Base XP
            xpGained = q.difficulty === 'hard' ? 20 : (q.difficulty === 'medium' ? 15 : 10);
            
            // Speed bonus
            if (this.timeLeft > this.maxTime * 0.8) xpGained += 5;
            
            // Streak bonus
            if (this.streak >= 3) xpGained += 5;
            if (this.streak >= 5) xpGained += 10;
            
            this.xpEarned += xpGained;
            this.score += (xpGained * 10); // arbitrary score multiplier
            
            if (window.soundService) window.soundService.playCorrect();
        } else {
            this.streak = 0; // reset streak
            if (window.soundService) window.soundService.playWrong();
        }

        if (this.onAnswerFeedback) {
            this.onAnswerFeedback({
                correct: isCorrect,
                isTimeout: false,
                correctIdx: q.correctAnswer,
                selectedIdx: selectedIndex,
                xpGained: xpGained,
                explanation: q.explanation
            });
        }
    }

    next() {
        this.currentQIndex++;
        this.loadNextQuestion();
    }

    finishQuiz() {
        this.stopTimer();
        
        // Completion bonus
        if (this.mode === 'daily') this.xpEarned += 100;
        else this.xpEarned += 20; // flat completion bonus

        // Save to local storage
        if (window.storageService) {
            window.storageService.addQuizResult({
                score: this.score,
                xp: this.xpEarned,
                correct: this.correctCount,
                total: this.questions.length,
                mode: this.mode
            });
        }

        if (this.onQuizComplete) {
            this.onQuizComplete({
                score: this.score,
                xp: this.xpEarned,
                correct: this.correctCount,
                total: this.questions.length,
                bestStreak: this.bestQuizStreak
            });
        }
    }
}

window.QuizEngine = QuizEngine;
