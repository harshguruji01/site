export class QuizEngine {
    constructor(containerId, questions, options = {}) {
        this.container = document.getElementById(containerId);
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.options = {
            onComplete: options.onComplete || null
        };
        this.render();
    }

    render() {
        if (!this.container) return;

        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const q = this.questions[this.currentQuestionIndex];
        
        let html = `
            <div class="quiz-progress" style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--hub-text-secondary);">
                Question ${this.currentQuestionIndex + 1} of ${this.questions.length}
            </div>
            <h3 class="quiz-question" style="margin-bottom: 1.5rem;">${q.question}</h3>
            <div class="quiz-options" style="display: flex; flex-direction: column; gap: 0.75rem;">
        `;

        q.options.forEach((opt, idx) => {
            html += `<button class="quiz-option-btn" data-index="${idx}" style="padding: 1rem; text-align: left; background: var(--bg-color, #1a1a1a); border: 1px solid var(--hub-border); border-radius: 8px; cursor: pointer; color: var(--hub-text-primary); transition: 0.2s;">${opt}</button>`;
        });

        html += `</div>
            <div id="quiz-feedback" style="margin-top: 1.5rem; display: none;"></div>
            <button id="quiz-next-btn" class="hub-btn primary" style="margin-top: 1.5rem; display: none;">Next Question</button>
        `;

        this.container.innerHTML = html;

        // Attach events
        const optionBtns = this.container.querySelectorAll('.quiz-option-btn');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAnswer(parseInt(e.target.dataset.index), optionBtns));
        });

        const nextBtn = this.container.querySelector('#quiz-next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentQuestionIndex++;
                this.render();
            });
        }
    }

    handleAnswer(selectedIndex, optionBtns) {
        const q = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === q.correctAnswer;
        
        if (isCorrect) this.score++;

        optionBtns.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === q.correctAnswer) {
                btn.style.background = 'rgba(34, 197, 94, 0.2)';
                btn.style.borderColor = '#22c55e';
            } else if (idx === selectedIndex && !isCorrect) {
                btn.style.background = 'rgba(239, 68, 68, 0.2)';
                btn.style.borderColor = '#ef4444';
            }
        });

        const feedback = this.container.querySelector('#quiz-feedback');
        const nextBtn = this.container.querySelector('#quiz-next-btn');

        if (feedback) {
            feedback.style.display = 'block';
            feedback.innerHTML = `
                <div style="padding: 1rem; border-radius: 8px; ${isCorrect ? 'background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e;' : 'background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444;'}">
                    <strong style="color: ${isCorrect ? '#22c55e' : '#ef4444'};">${isCorrect ? 'Correct!' : 'Incorrect.'}</strong>
                    <p style="margin-top: 0.5rem; font-size: 0.95rem;">${q.explanation || ''}</p>
                </div>
            `;
        }
        
        if (nextBtn) nextBtn.style.display = 'inline-block';
    }

    showResults() {
        let html = `
            <div style="text-align: center;">
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Quiz Completed!</h3>
                <div style="font-size: 3rem; font-weight: bold; color: var(--hub-accent); margin-bottom: 1.5rem;">
                    ${this.score} / ${this.questions.length}
                </div>
                <button id="quiz-restart-btn" class="hub-btn primary">Restart Quiz</button>
            </div>
        `;
        this.container.innerHTML = html;

        const restartBtn = this.container.querySelector('#quiz-restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.render();
            });
        }

        if (this.options.onComplete) {
            this.options.onComplete(this.score, this.questions.length);
        }
    }
}
