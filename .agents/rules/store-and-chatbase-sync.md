# Dual-Platform Synchronization Rules: Store & ChatBase

## 1. Store Synchronization Rule
Whenever making any changes, features, bug fixes, UI upgrades, or data modifications related to the **Store**:
You MUST implement them in **BOTH** places:
1. **Subdomain Store:** `store.webguruji.online` (and its configuration / PWA setup)
2. **Main Domain Store:** `webguruji.online/store.html` (along with `store-detail.html` and related `data/apps.json` / `css/store.css` / `js/store.js`)

Both store endpoints must stay 100% in sync regarding catalog items, download buttons, search behaviors, and design systems.

---

## 2. ChatBase Web & App Dual-Platform Rule
Whenever making any changes, features, policies, or engine enhancements related to **ChatBase**:
You MUST implement them across **BOTH Web and App** places:
1. **Web Application:**
   - `chat.webguruji.online`
   - `webguruji.online/chat-app.html`
   - `webguruji.online/chat.html` (Showcase and launchpad)
2. **App Architecture (Android & Responsive Client):**
   - Platform Capability Matrix (`js/chatbase-capabilities.js`)
   - 5-item mobile bottom navigation bar and mobile viewports
   - Android-specific policies and limits (as defined in ChatBase Master Prompts)

---

## 3. General Principle
Always identify all corresponding touchpoints for a given feature and implement updates comprehensively across every related surface. Never leave one surface updated while another remains outdated.
