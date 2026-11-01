# HarshGuruJi Admin Panel & Site Blueprint Reference

> **Branding Rule**: Always use **HarshGuruJi** across all titles, headers, and UI. Production domain is `webguruji.online`.

---

## 1. Authentication & Gate Pass Security

- **Master Admin**: Harsh Patel
  - **Login Email**: `harshguruji01@gmail.com`
  - **Password / Pass**: `HarshGuruJi@2547277654`
  - **Role**: Master Admin (Full Read/Write access)
- **Subadmin Delegation**:
  - Master Admin can generate credentials (Email + Password) with assigned role (Viewer/Editor).
  - **Viewer Security Enforcement**: Subadmins have read-only access and cannot alter core settings or create further credentials.
- **Login Audit & Security Trail**:
  - Automatically logs every login attempt:
    - **Account Email**
    - **Password / Pass Used**
    - **Role / Tier**
    - **Timestamp** (Exact date & time)
    - **Result Status** (`Success`, `Blocked (Account Banned)`, `Blocked (Account Suspended)`, `Failed`)
- **Master Admin Controls**:
  - 1-click **Suspend** (temporary access pause).
  - 1-click **Ban** (permanent access denial).
  - 1-click **Delete** (credential removal).

---

## 2. Complete Pages Inventory (38+ Routes)

### Core & Navigation
- `/` or `/index.html` — Homepage
- `/best` or `/best.html` — Best of HarshGuruJi
- `/explore.html` — Explore Features & Directory
- `/daily-special.html` — Daily Special Highlights
- `/daily-life.html` — Daily Life Applications & Guides
- `/insights.html` — Tech & Knowledge Insights
- `/about.html` — About HarshGuruJi
- `/owner.html` — Founder & Creator Profile
- `/contact.html` — Contact & Support Form

### Community & Chat
- `/chat.html` & `/chat-app.html` — Community Live Chatroom

### Store & Downloads
- `/store.html` — App Store (Chess, ChatBase, GuruTube, System Service, etc.)
- `/store-detail.html` — App Detail & APK/EXE download landing page

### Books & NCERT Learning Hub
- `/books.html` — HarshGuruJi Books & PDF Library
- `/education.html` — Education Hub
- `/learning-hub.html` — Main Learning Hub
- `/learning.html` — Learning Dashboard
- `/learning/pdf-library.html` — PDF Document Library
- `/learning/class.html` — Class Directory (Classes 9, 10, 11, 12)
- `/learning/subject.html` — Subject Browser
- `/learning/chapter.html` — Chapter Content & Notes
- `/learning/class-10-science.html` — Class 10 Science Hub
- `/learning/class-10/science/ncert/01-chemical-reactions-and-equations.html` — NCERT Dedicated Chapter Reader
- `/learning/gk-quiz.html` & `/Quiz India/index.html` — GK & National Quizzes

### Free Utilities & Tools
- `/tools.html` & `/free-tools.html` — Utility suite including:
  - Password Generator
  - Word Counter
  - JSON Formatter
  - Case Converter
  - Base64 Encoder / Decoder
  - BMI Calculator
  - Percentage Calculator

### GuruAI Hub
- `/ai-hub.html` & `/ai.html` — GuruAI Web Portal
- `/technology.html` — Technology Showcase
- Subdomain: `ai.webguruji.online` (`ai/index.html`) — Full AI Chat Assistant with Live Quota Dashboard

### Gaming Hub
- `/gaming-hub.html` & `/gaming.html` — Games Arcade
- `/games/snake.html` — Snake Retro Game
- `/games/tic-tac-toe.html` — Tic-Tac-Toe
- `/games/memory.html` — Memory Match

### Contributors & Partners
- `/contributor.html` — Contributor Network Overview
- `/join-contributor.html` & `/apply-contributor.html` — Contributor Application
- `/verify-contributor.html` — Golden Tick & Badge Verification
- `/ads.html` — Partner & Sponsor Advertising

### Auth, Legal & Policies
- `/login.html` & `/signup.html` — User Authentication
- `/forgot-password.html` & `/reset-password.html` — Password Recovery
- `/privacy-policy.html` — Privacy Policy
- `/terms-and-conditions.html` — Terms of Service
- `/cookie.html` — Cookie Policy & Consent
- `/disclaimer.html` — Legal Disclaimer

---

## 3. Database Schema Catalog (Supabase Reference)

| Category | Table Name | Purpose |
| :--- | :--- | :--- |
| **Users & Auth** | `users`, `profiles`, `roles` | User accounts, profiles, roles & permissions |
| **Sessions & Auditing** | `sessions`, `login_events`, `audit_logs` | Active sessions, login history, security audit trail |
| **Traffic & Pages** | `page_views`, `pages`, `navigation_items` | Page analytics, route management, menu items |
| **Site Settings** | `site_settings`, `announcements`, `ads` | Maintenance mode, hero banners, sponsored ads |
| **Store & Apps** | `store_products`, `product_versions`, `downloads` | APK/EXE releases, versions, download counters |
| **Learning & NCERT** | `ncert_classes`, `ncert_subjects`, `ncert_books`, `ncert_chapters`, `pdf_files` | Class 9-12 curriculum, chapter notes, PDFs |
| **Quizzes** | `quizzes`, `quiz_questions` | GK quiz and interactive test question bank |
| **Tools & Utilities** | `tools`, `tool_usage` | Tools catalog and usage frequency metrics |
| **AI Hub & GuruAI** | `ai_chats`, `ai_requests`, `user_ai_limits`, `premium_requests` | Chat logs, prompt safety, daily 24h limits tuner |
| **Gaming** | `games`, `game_scores` | Game leaderboard and high scores |
| **Contributors** | `contributors`, `contributor_applications` | Golden Tick badges and applicant approvals |
| **Support** | `contact_messages` | Inquiries and support inbox |

---

## 4. Current Admin Panel Architecture (`admin.html`)

The live production admin panel is a self-contained, lightning-fast dashboard running directly on GitHub Pages and Hostinger without requiring a Node.js server.

### Key Active Modules:
1. **Gate Pass Security Modal**: Master Admin & Subadmin authentication with brute-force delay and real-time audit logging.
2. **GuruAI Live Operations Box**: Real-time user session roster, models switcher, remaining 24h chat quotas, and instant `+10` / `+25` limits adjustment.
3. **Books & PDF Library Studio**: Manage NCERT Class 9-12 links and study materials.
4. **Store Release Management**: Publish and update APKs, version changelogs, and download URLs.
5. **Inquiries & Contact Inbox**: View messages submitted via `/contact.html`.
6. **Golden Tick Contributor Management**: Review applications and grant verification badges.
7. **Subadmin Pass Delegation**: Master Admin creates viewer subadmins with 1-click ban/suspend/delete.
