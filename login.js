// =========================================================================
// LOGIN.JS - Production Ready Login Script & Form Utilities
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const pwdInput = document.getElementById("password");
    const togglePwdBtn = document.getElementById("toggle-pwd");
    const capsWarning = document.getElementById("caps-warning");
    const loginBtn = document.getElementById("btn-login");
    const globalError = document.getElementById("global-error");
    const pwdStrengthWrap = document.getElementById("pwd-strength-wrap");
    const pwdStrengthFill = document.getElementById("pwd-strength-fill");
    const pwdStrengthText = document.getElementById("pwd-strength-text");

    // Toggle Password Visibility
    if (togglePwdBtn && pwdInput) {
        togglePwdBtn.addEventListener("click", () => {
            const currentType = pwdInput.getAttribute("type");
            const newType = currentType === "password" ? "text" : "password";
            pwdInput.setAttribute("type", newType);
            togglePwdBtn.textContent = newType === "password" ? "👁" : "🙈";
        });
    }

    // Caps Lock Warning
    if (pwdInput && capsWarning) {
        pwdInput.addEventListener("keyup", (e) => {
            if (e.getModifierState && e.getModifierState("CapsLock")) {
                capsWarning.style.display = "block";
            } else {
                capsWarning.style.display = "none";
            }
        });
    }

    // Password Strength Meter
    if (pwdInput && pwdStrengthWrap && pwdStrengthFill && pwdStrengthText) {
        pwdInput.addEventListener("input", () => {
            const val = pwdInput.value;
            if (!val) {
                pwdStrengthWrap.style.display = "none";
                return;
            }
            pwdStrengthWrap.style.display = "flex";
            
            let score = 0;
            if (val.length >= 6) score++;
            if (val.length >= 10) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            if (score <= 2) {
                pwdStrengthFill.style.width = "33%";
                pwdStrengthFill.style.background = "#ef4444";
                pwdStrengthText.textContent = "Weak";
                pwdStrengthText.style.color = "#ef4444";
            } else if (score <= 4) {
                pwdStrengthFill.style.width = "66%";
                pwdStrengthFill.style.background = "#f59e0b";
                pwdStrengthText.textContent = "Good";
                pwdStrengthText.style.color = "#f59e0b";
            } else {
                pwdStrengthFill.style.width = "100%";
                pwdStrengthFill.style.background = "#22c55e";
                pwdStrengthText.textContent = "Strong";
                pwdStrengthText.style.color = "#22c55e";
            }
        });
    }

    // Input error cleanup
    [emailInput, pwdInput].forEach((input) => {
        if (input) {
            input.addEventListener("input", () => {
                const group = input.closest(".input-group");
                if (group) group.classList.remove("invalid");
                if (globalError) globalError.style.display = "none";
            });
        }
    });

    // Form Validation Helper
    function validateForm() {
        let valid = true;
        const emailVal = emailInput ? emailInput.value.trim() : "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailVal || !emailRegex.test(emailVal)) {
            if (emailInput) emailInput.closest(".input-group")?.classList.add("invalid");
            valid = false;
        }

        if (pwdInput && !pwdInput.value) {
            pwdInput.closest(".input-group")?.classList.add("invalid");
            valid = false;
        }

        return valid;
    }

    // Form Submit Handler
    if (form) {
        form.addEventListener("submit", (e) => {
            if (!validateForm()) {
                e.preventDefault();
                form.style.animation = "none";
                void form.offsetHeight;
                form.style.animation = "shake 0.4s ease";
            }
        });
    }
});