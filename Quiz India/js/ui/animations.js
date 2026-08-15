class Animations {
    
    static showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Add color based on type
        if (type === 'success') {
            toast.style.borderColor = 'var(--success)';
            toast.style.color = 'var(--success)';
        } else if (type === 'error') {
            toast.style.borderColor = 'var(--danger)';
            toast.style.color = 'var(--danger)';
        } else if (type === 'level-up') {
            toast.style.borderColor = 'var(--accent)';
            toast.style.color = 'var(--accent)';
            toast.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.5)';
        }

        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static fireConfetti() {
        const container = document.getElementById('results-confetti');
        if (!container) return;
        container.innerHTML = '';
        
        const colors = ['#f59e0b', '#22c55e', '#6366f1', '#ec4899', '#3b82f6'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Randomize animation
            const duration = Math.random() * 2 + 2; // 2-4s
            const delay = Math.random() * 0.5;
            
            confetti.style.animation = `fall ${duration}s ease-in ${delay}s forwards`;
            
            // Add some rotation
            const rot = Math.random() * 360;
            confetti.style.transform = `rotate(${rot}deg)`;
            
            container.appendChild(confetti);
        }
        
        // Dynamic keyframes for falling confetti (added to document head if not exists)
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    static animateNumber(element, start, end, duration = 1000) {
        if (!element) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            element.textContent = Math.floor(easeProgress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    }
}

window.Animations = Animations;
