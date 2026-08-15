class I18nService {
    constructor() {
        this.currentLang = window.storageService ? window.storageService.getLang() : 'en';
    }

    setLang(lang) {
        this.currentLang = lang;
        if (window.storageService) {
            window.storageService.setLanguage(lang);
        }
        this.translateDOM();
    }

    getText(key) {
        if (!window.i18n || !window.i18n[this.currentLang]) return key;
        return window.i18n[this.currentLang][key] || key;
    }

    translateDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.getText(key);
            // check if it's an input placeholder
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', translation);
            } else {
                el.textContent = translation;
            }
        });
    }
}

window.i18nService = new I18nService();
