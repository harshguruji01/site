import os
import re
import json

SITE_ORIGIN = "https://webguruji.online"
LOGO_URL = f"{SITE_ORIGIN}/logo-512.png"

# Metadata for every single HTML file in the project
# Ensures WebGuruJi + HarshGuruJi branding, rich SEO keywords, canonical, breadcrumbs
PAGE_CONFIGS = {
    # 1. Homepage
    "index.html": {
        "title": "WebGuruJi - Free Online Tools, Learning Hub, NCERT Books, AI & Software Store | HarshGuruJi",
        "description": "Official WebGuruJi portal. Access free developer tools, NCERT textbooks (Classes 1-12), curated AI tools directory, online games, and verified software downloads.",
        "keywords": "webguruji, harshguruji, webguruji online, free online tools, learning hub, ncert books, ai directory, online games, software store, web guruji",
        "canonical": f"{SITE_ORIGIN}/",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}],
        "type": "website"
    },
    # 2. Login Page (Highlighted by user: "webguruji login-tab login page")
    "login.html": {
        "title": "WebGuruJi Login Tab - Official Login Page | HarshGuruJi Account Sign In",
        "description": "Official WebGuruJi login-tab and login page. Sign in to your WebGuruJi / HarshGuruJi account to access developer tools, AI Hub, NCERT study books, online games, and software store.",
        "keywords": "webguruji login-tab login page, webguruji login page, webguruji login-tab, webguruji login, webguruji sign in, harshguruji login, webguruji online login, webguruji student portal login, access tools",
        "canonical": f"{SITE_ORIGIN}/login.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "WebGuruJi Login Tab", "url": f"{SITE_ORIGIN}/login.html"}],
        "type": "website"
    },
    # 3. Signup Page
    "signup.html": {
        "title": "WebGuruJi Sign Up Tab - Create Account | HarshGuruJi Registration Portal",
        "description": "Official WebGuruJi sign up tab and registration page. Create your free WebGuruJi / HarshGuruJi account today to unlock developer tools, AI directory, study materials, and games.",
        "keywords": "webguruji signup tab, webguruji register, webguruji create account, webguruji sign up page, webguruji signup-tab, harshguruji signup, webguruji sign in, webguruji join",
        "canonical": f"{SITE_ORIGIN}/signup.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Sign Up Tab", "url": f"{SITE_ORIGIN}/signup.html"}],
        "type": "website"
    },
    # 4. Forgot Password
    "forgot-password.html": {
        "title": "WebGuruJi Forgot Password - Recover Account Access | HarshGuruJi",
        "description": "Forgot your WebGuruJi password? Enter your registered email to receive a secure password recovery link and regain access to your account and tools.",
        "keywords": "webguruji forgot password, recover password, harshguruji account recovery, reset password link, webguruji account help",
        "canonical": f"{SITE_ORIGIN}/forgot-password.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Forgot Password", "url": f"{SITE_ORIGIN}/forgot-password.html"}],
        "type": "website"
    },
    # 5. Reset Password
    "reset-password.html": {
        "title": "WebGuruJi Reset Password - Set New Secure Password | HarshGuruJi",
        "description": "Set a new, secure password for your WebGuruJi and HarshGuruJi account. Ensure your account credentials remain safe and protected.",
        "keywords": "webguruji reset password, new password, webguruji security, update password, harshguruji password reset",
        "canonical": f"{SITE_ORIGIN}/reset-password.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Reset Password", "url": f"{SITE_ORIGIN}/reset-password.html"}],
        "type": "website"
    },
    # 6. Store
    "store.html": {
        "title": "WebGuruJi Store - Apps, Software, AI Tools & APK Downloads | HarshGuruJi",
        "description": "Browse and download verified Android APKs, Windows desktop software, AI productivity tools, and browser games safely on WebGuruJi Store.",
        "keywords": "webguruji store, harshguruji store, apk download, free software, windows apps, ai tools download, verified applications, chess download",
        "canonical": f"{SITE_ORIGIN}/store.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Store", "url": f"{SITE_ORIGIN}/store.html"}],
        "type": "website"
    },
    # 7. Store Detail
    "store-detail.html": {
        "title": "WebGuruJi Store - App Details & Safe Direct Download | HarshGuruJi",
        "description": "Download verified, virus-scanned applications, APKs, and desktop software with complete changelogs, specs, and safe direct download links on WebGuruJi.",
        "keywords": "webguruji app download, webguruji store details, software download, verified apk download, harshguruji store",
        "canonical": f"{SITE_ORIGIN}/store-detail.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Store", "url": f"{SITE_ORIGIN}/store.html"}, {"name": "App Detail", "url": f"{SITE_ORIGIN}/store-detail.html"}],
        "type": "website"
    },
    # 8. Free Tools
    "free-tools.html": {
        "title": "WebGuruJi Free Online Tools - Calculators, Converters & Generators | HarshGuruJi",
        "description": "Explore free web utilities and developer tools on WebGuruJi: password generators, text case converters, JSON formatters, word counters, and Base64 encoders.",
        "keywords": "webguruji tools, free online tools, password generator, json formatter, word counter, case converter, web utilities, harshguruji tools",
        "canonical": f"{SITE_ORIGIN}/free-tools.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Free Tools", "url": f"{SITE_ORIGIN}/free-tools.html"}],
        "type": "website"
    },
    # 9. Tools Hub
    "tools.html": {
        "title": "WebGuruJi Tools Hub - Developer Utilities & Online Productivity Tools | HarshGuruJi",
        "description": "Discover high performance browser-based developer utilities and productive web tools on WebGuruJi with complete privacy and zero installation.",
        "keywords": "webguruji tools hub, developer tools, productivity utilities, web tools, harshguruji tools, json tools",
        "canonical": f"{SITE_ORIGIN}/tools.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools Hub", "url": f"{SITE_ORIGIN}/tools.html"}],
        "type": "website"
    },
    # 10. Learning Hub
    "learning-hub.html": {
        "title": "WebGuruJi Learning Hub - Study Notes, NCERT Books & Revision Guides | HarshGuruJi",
        "description": "Empower your education with free study notes, NCERT textbooks for Classes 1 to 12, interactive quizzes, study methods, and exam preparation on WebGuruJi.",
        "keywords": "webguruji learning hub, ncert books, class 1 to 12 notes, study materials, student resources, education portal, harshguruji learning",
        "canonical": f"{SITE_ORIGIN}/learning-hub.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning Hub", "url": f"{SITE_ORIGIN}/learning-hub.html"}],
        "type": "website"
    },
    # 11. Learning Portal
    "learning.html": {
        "title": "WebGuruJi NCERT Learning Portal - Classes 1 to 12 Study Material | HarshGuruJi",
        "description": "Access free NCERT textbooks, chapter summaries, syllabus guides, and interactive academic resources across Classes 1 through 12 on WebGuruJi.",
        "keywords": "webguruji learning, ncert classes 1 to 12, cbse study portal, ncert digital library, online education, harshguruji",
        "canonical": f"{SITE_ORIGIN}/learning.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning Portal", "url": f"{SITE_ORIGIN}/learning.html"}],
        "type": "website"
    },
    # 12. NCERT Books
    "books.html": {
        "title": "WebGuruJi Books - NCERT Books Library Class 1 to 12 PDF Free Download | HarshGuruJi",
        "description": "Download official NCERT textbooks in PDF format for Classes 1 to 12 across all subjects: Science, Mathematics, Social Science, Hindi, and English on WebGuruJi Books.",
        "keywords": "webguruji books, ncert books pdf, class 10 ncert, class 12 ncert, free ncert download, textbook pdf, harshguruji books",
        "canonical": f"{SITE_ORIGIN}/books.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "NCERT Books", "url": f"{SITE_ORIGIN}/books.html"}],
        "type": "website"
    },
    # 13. AI Hub
    "ai-hub.html": {
        "title": "WebGuruJi AI Hub - Best AI Directory & Artificial Intelligence Tools | HarshGuruJi",
        "description": "Explore the ultimate directory of generative AI tools, LLMs, AI chatbots, image generators, and coding assistants curated on WebGuruJi AI Hub.",
        "keywords": "webguruji ai hub, ai tools directory, best ai tools, chatgpt, gemini, claude, generative ai, artificial intelligence, harshguruji ai",
        "canonical": f"{SITE_ORIGIN}/ai-hub.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "AI Hub", "url": f"{SITE_ORIGIN}/ai-hub.html"}],
        "type": "website"
    },
    # 14. AI Directory
    "ai.html": {
        "title": "WebGuruJi AI Directory - Curated AI Tools, Prompts & Resources | HarshGuruJi",
        "description": "Browse hundreds of categorized artificial intelligence tools for writing, coding, image creation, research, and video editing on WebGuruJi AI Directory.",
        "keywords": "webguruji ai, ai directory, artificial intelligence resources, ai apps, top ai websites, harshguruji ai",
        "canonical": f"{SITE_ORIGIN}/ai.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "AI Directory", "url": f"{SITE_ORIGIN}/ai.html"}],
        "type": "website"
    },
    # 15. Gaming Hub
    "gaming-hub.html": {
        "title": "WebGuruJi Gaming Hub - Play Free Online Browser Games | HarshGuruJi Games",
        "description": "Play free online browser games on WebGuruJi Gaming Hub: Snake, Tic Tac Toe, Memory Match, Quiz India, and retro arcade titles with zero downloads.",
        "keywords": "webguruji gaming hub, free online games, browser games, play snake online, tic tac toe game, memory card game, harshguruji gaming",
        "canonical": f"{SITE_ORIGIN}/gaming-hub.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Gaming Hub", "url": f"{SITE_ORIGIN}/gaming-hub.html"}],
        "type": "website"
    },
    # 16. Gaming Portal
    "gaming.html": {
        "title": "WebGuruJi Gaming Portal - Free Online Games & Browser Arcade | HarshGuruJi",
        "description": "Enjoy free responsive web games on WebGuruJi Gaming: retro arcade, brain teasers, strategy games, and multiplayer challenges playable on mobile and desktop.",
        "keywords": "webguruji gaming, online browser games, free games to play, html5 games, arcade games online, harshguruji",
        "canonical": f"{SITE_ORIGIN}/gaming.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Gaming", "url": f"{SITE_ORIGIN}/gaming.html"}],
        "type": "website"
    },
    # 17. ChatBase App
    "chat-app.html": {
        "title": "WebGuruJi ChatBase App - Download Android APK & Features | HarshGuruJi",
        "description": "Download the official ChatBase Android APK. Features instant real-time messaging, encrypted chat, media sharing, and sleek modern dark interface on WebGuruJi.",
        "keywords": "webguruji chatbase, download chatbase apk, real-time messaging app, private chat android, harshguruji chat app",
        "canonical": f"{SITE_ORIGIN}/chat-app.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "ChatBase App", "url": f"{SITE_ORIGIN}/chat-app.html"}],
        "type": "website"
    },
    # 18. Chat Application
    "chat.html": {
        "title": "WebGuruJi Chat - Free Real-Time Messaging & Chat Application | HarshGuruJi",
        "description": "Connect and chat in real-time with WebGuruJi Chat. High speed, browser-based messaging with end-to-end reliability and zero lag.",
        "keywords": "webguruji chat, online messenger, real-time chat, web chat app, harshguruji chat, live messaging",
        "canonical": f"{SITE_ORIGIN}/chat.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Chat", "url": f"{SITE_ORIGIN}/chat.html"}],
        "type": "website"
    },
    # 19. Education
    "education.html": {
        "title": "WebGuruJi Education Portal - Academic Concepts, Notes & Lessons | HarshGuruJi",
        "description": "Academic concepts, student guides, exam preparation tips, and structured educational articles on WebGuruJi Education Portal.",
        "keywords": "webguruji education, academic notes, study guides, student learning, exam preparation, harshguruji education",
        "canonical": f"{SITE_ORIGIN}/education.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Education", "url": f"{SITE_ORIGIN}/education.html"}],
        "type": "website"
    },
    # 20. Technology
    "technology.html": {
        "title": "WebGuruJi Technology Hub - Software Trends, Computing & Web Dev | HarshGuruJi",
        "description": "Stay updated with software development tutorials, modern computing architecture, web standards, and cybersecurity insights on WebGuruJi Tech Hub.",
        "keywords": "webguruji technology, tech trends, programming tutorials, software development, computing, harshguruji tech",
        "canonical": f"{SITE_ORIGIN}/technology.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Technology", "url": f"{SITE_ORIGIN}/technology.html"}],
        "type": "website"
    },
    # 21. Daily Special
    "daily-special.html": {
        "title": "WebGuruJi Daily Special - Today in History, Daily Facts & Quotes | HarshGuruJi",
        "description": "Discover fascinating historical events that happened on this day, curated daily trivia, scientific milestones, and inspiring thoughts on WebGuruJi Daily Special.",
        "keywords": "webguruji daily special, today in history, daily facts, this day in history, daily trivia, harshguruji",
        "canonical": f"{SITE_ORIGIN}/daily-special.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Daily Special", "url": f"{SITE_ORIGIN}/daily-special.html"}],
        "type": "website"
    },
    # 22. Daily Life
    "daily-life.html": {
        "title": "WebGuruJi Daily Life - Productivity Hacks & Wellness Tips | HarshGuruJi",
        "description": "Practical life hacks, mental models, time-management tips, and digital wellness strategies to elevate your daily routine on WebGuruJi Daily Life.",
        "keywords": "webguruji daily life, productivity hacks, digital wellness, time management, life tips, harshguruji",
        "canonical": f"{SITE_ORIGIN}/daily-life.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Daily Life", "url": f"{SITE_ORIGIN}/daily-life.html"}],
        "type": "website"
    },
    # 23. Insights
    "insights.html": {
        "title": "WebGuruJi Insights & Wisdom - Life Lessons & Mindful Thoughts | HarshGuruJi",
        "description": "Thoughtful articles on philosophy, cognitive science, personal growth, mindfulness, and creative thinking on WebGuruJi Insights.",
        "keywords": "webguruji insights, life lessons, personal growth, mindfulness, philosophy, wisdom, harshguruji",
        "canonical": f"{SITE_ORIGIN}/insights.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Insights", "url": f"{SITE_ORIGIN}/insights.html"}],
        "type": "website"
    },
    # 24. Explore
    "explore.html": {
        "title": "WebGuruJi Explore & Discover - Topics, Tools & Knowledge Base | HarshGuruJi",
        "description": "Search and explore the comprehensive index of tools, books, games, articles, and AI services across the WebGuruJi ecosystem.",
        "keywords": "webguruji explore, search webguruji, discover tools, knowledge base, harshguruji explore",
        "canonical": f"{SITE_ORIGIN}/explore.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Explore", "url": f"{SITE_ORIGIN}/explore.html"}],
        "type": "website"
    },
    # 25. About Us
    "about.html": {
        "title": "WebGuruJi About Us - Mission, Story & Vision | HarshGuruJi",
        "description": "Learn about the mission, philosophy, and journey behind WebGuruJi and HarshGuruJi — empowering users with free education, tools, and digital technology.",
        "keywords": "webguruji about us, harshguruji mission, about webguruji, who is harshguruji, platform vision",
        "canonical": f"{SITE_ORIGIN}/about.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "About Us", "url": f"{SITE_ORIGIN}/about.html"}],
        "type": "website"
    },
    # 26. Contact Us
    "contact.html": {
        "title": "WebGuruJi Contact Us - Support, Help & Feedback | HarshGuruJi",
        "description": "Get in touch with the WebGuruJi team. Submit inquiries, bug reports, feature suggestions, or partnership proposals directly.",
        "keywords": "webguruji contact, harshguruji support, customer help, contact us, submit feedback, webguruji online support",
        "canonical": f"{SITE_ORIGIN}/contact.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Contact Us", "url": f"{SITE_ORIGIN}/contact.html"}],
        "type": "website"
    },
    # 27. Founder / Owner
    "owner.html": {
        "title": "Harsh Patel (WebGuruJi / HarshGuruJi) - Founder & Lead Architect",
        "description": "Meet Harsh Patel, creator, founder, and lead software architect of WebGuruJi (HarshGuruJi). Read about his technical vision and background.",
        "keywords": "harsh patel, webguruji founder, harshguruji owner, webguruji architect, lead developer, harshguruji01",
        "canonical": f"{SITE_ORIGIN}/owner.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Founder & Owner", "url": f"{SITE_ORIGIN}/owner.html"}],
        "type": "profile"
    },
    # 28. Contributors
    "contributor.html": {
        "title": "WebGuruJi Contributors - The Team & Creators | HarshGuruJi",
        "description": "Meet the talented developers, writers, editors, and open-source contributors powering the WebGuruJi ecosystem.",
        "keywords": "webguruji contributors, harshguruji team, content creators, open source contributors, webguruji staff",
        "canonical": f"{SITE_ORIGIN}/contributor.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Contributors", "url": f"{SITE_ORIGIN}/contributor.html"}],
        "type": "website"
    },
    # 29. Join Contributor
    "join-contributor.html": {
        "title": "WebGuruJi Become a Contributor - Write & Build with HarshGuruJi",
        "description": "Join WebGuruJi as a content creator, developer, or study material author. Gain recognition, build your portfolio, and help millions of learners.",
        "keywords": "webguruji join contributor, become creator, write for webguruji, student author, contributor program",
        "canonical": f"{SITE_ORIGIN}/join-contributor.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Join Contributor", "url": f"{SITE_ORIGIN}/join-contributor.html"}],
        "type": "website"
    },
    # 30. Apply Contributor
    "apply-contributor.html": {
        "title": "WebGuruJi Contributor Application Form | HarshGuruJi Careers",
        "description": "Submit your application to become an official WebGuruJi contributor. Fill out the application form with your skills and writing samples.",
        "keywords": "webguruji contributor application, apply to write, join webguruji team, developer application",
        "canonical": f"{SITE_ORIGIN}/apply-contributor.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Apply Contributor", "url": f"{SITE_ORIGIN}/apply-contributor.html"}],
        "type": "website"
    },
    # 31. Verify Contributor Status
    "verify-contributor.html": {
        "title": "WebGuruJi Contributor Application Status Tracker | HarshGuruJi",
        "description": "Check the verification and approval status of your WebGuruJi and HarshGuruJi contributor application in real-time.",
        "keywords": "webguruji verify contributor, check application status, contributor verification, harshguruji application status",
        "canonical": f"{SITE_ORIGIN}/verify-contributor.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Verify Status", "url": f"{SITE_ORIGIN}/verify-contributor.html"}],
        "type": "website"
    },
    # 32. Privacy Policy
    "privacy-policy.html": {
        "title": "WebGuruJi Privacy Policy - Data Protection & User Privacy | HarshGuruJi",
        "description": "Read WebGuruJi's Privacy Policy. Learn how we safeguard your personal data, handle cookies, maintain GDPR compliance, and respect user privacy.",
        "keywords": "webguruji privacy policy, data protection, privacy rights, cookie usage, harshguruji privacy",
        "canonical": f"{SITE_ORIGIN}/privacy-policy.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Privacy Policy", "url": f"{SITE_ORIGIN}/privacy-policy.html"}],
        "type": "website"
    },
    # 33. Terms and Conditions
    "terms-and-conditions.html": {
        "title": "WebGuruJi Terms and Conditions - User Agreement | HarshGuruJi",
        "description": "Review the Terms and Conditions governing your use of WebGuruJi and HarshGuruJi services, tools, software downloads, and educational resources.",
        "keywords": "webguruji terms and conditions, terms of service, user agreement, website rules, harshguruji terms",
        "canonical": f"{SITE_ORIGIN}/terms-and-conditions.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Terms & Conditions", "url": f"{SITE_ORIGIN}/terms-and-conditions.html"}],
        "type": "website"
    },
    # 34. Cookie Policy
    "cookie.html": {
        "title": "WebGuruJi Cookie Policy - Transparency & Cookies | HarshGuruJi",
        "description": "Understand how WebGuruJi uses essential, analytics, and preference cookies to deliver an optimized and secure user browsing experience.",
        "keywords": "webguruji cookie policy, how we use cookies, cookie preferences, privacy settings, harshguruji",
        "canonical": f"{SITE_ORIGIN}/cookie.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Cookie Policy", "url": f"{SITE_ORIGIN}/cookie.html"}],
        "type": "website"
    },
    # 35. Ads & Sponsorship
    "ads.html": {
        "title": "WebGuruJi Partner Network & Advertisements | HarshGuruJi",
        "description": "Learn about WebGuruJi advertising policies, Google AdSense integration, partner networks, and ethical advertising standards.",
        "keywords": "webguruji ads, advertising policy, partner network, adsense guidelines, harshguruji ads",
        "canonical": f"{SITE_ORIGIN}/ads.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Advertisements", "url": f"{SITE_ORIGIN}/ads.html"}],
        "type": "website"
    },
    # 36. App Redirect / Download Portal
    "app.html": {
        "title": "WebGuruJi App Download Portal - Direct Software & APK Links | HarshGuruJi",
        "description": "Download verified mobile applications and desktop software safely with high speed direct links on WebGuruJi App Portal.",
        "keywords": "webguruji app, apk download, direct software download, android apps, harshguruji app",
        "canonical": f"{SITE_ORIGIN}/app.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "App Portal", "url": f"{SITE_ORIGIN}/app.html"}],
        "type": "website"
    },
    # 37. Dashboard
    "dashboard.html": {
        "title": "WebGuruJi User Dashboard - Profile & Tool Hub | HarshGuruJi",
        "description": "Manage your WebGuruJi account profile, saved developer tools, learning progress, AI bookmarks, and personal dashboard settings.",
        "keywords": "webguruji dashboard, harshguruji dashboard, user profile, account settings, member portal, webguruji account",
        "canonical": f"{SITE_ORIGIN}/dashboard.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Dashboard", "url": f"{SITE_ORIGIN}/dashboard.html"}],
        "type": "website"
    },
    # 38. Settings
    "settings.html": {
        "title": "WebGuruJi Account Settings - Preferences & Security | HarshGuruJi",
        "description": "Configure your WebGuruJi account preferences, theme settings, notifications, privacy, and security options.",
        "keywords": "webguruji settings, account preferences, security settings, notification options, webguruji portal",
        "canonical": f"{SITE_ORIGIN}/settings.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Settings", "url": f"{SITE_ORIGIN}/settings.html"}],
        "type": "website"
    },
    # 39. Appearance
    "appearance.html": {
        "title": "WebGuruJi Appearance Settings - Themes & Customization | HarshGuruJi",
        "description": "Customize your WebGuruJi interface: switch dark and light themes, adjust color accents, contrast, and typography styling.",
        "keywords": "webguruji appearance, theme settings, dark mode, customization, interface preferences, harshguruji",
        "canonical": f"{SITE_ORIGIN}/appearance.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Appearance", "url": f"{SITE_ORIGIN}/appearance.html"}],
        "type": "website"
    },
    # 40. Quiz India
    "Quiz India/index.html": {
        "title": "WebGuruJi Quiz India - Interactive GK Quiz Game | HarshGuruJi Learning",
        "description": "Play Quiz India on WebGuruJi: an engaging general knowledge and trivia quiz game covering history, geography, science, and Indian culture.",
        "keywords": "webguruji quiz india, quiz india game, gk quiz, interactive trivia game, harshguruji quiz, general knowledge india",
        "canonical": f"{SITE_ORIGIN}/Quiz%20India/",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Quiz India", "url": f"{SITE_ORIGIN}/Quiz%20India/"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 41. Password Generator Tool
    "tools/password-generator.html": {
        "title": "WebGuruJi Password Generator - Strong Secure Password Tool | HarshGuruJi",
        "description": "Generate cryptographically secure, random passwords instantly with custom length, symbols, digits, and mnemonic passphrases on WebGuruJi.",
        "keywords": "webguruji password generator, strong password generator, random password tool, secure password generator, harshguruji tools",
        "canonical": f"{SITE_ORIGIN}/tools/password-generator.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/tools.html"}, {"name": "Password Generator", "url": f"{SITE_ORIGIN}/tools/password-generator.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 42. Word Counter Tool
    "tools/word-counter.html": {
        "title": "WebGuruJi Word Counter - Character & Word Count Tool | HarshGuruJi",
        "description": "Count words, characters, sentences, paragraphs, and estimate reading time in real-time with WebGuruJi Word Counter tool.",
        "keywords": "webguruji word counter, character counter, text length count, word count tool, reading time estimator, harshguruji",
        "canonical": f"{SITE_ORIGIN}/tools/word-counter.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/tools.html"}, {"name": "Word Counter", "url": f"{SITE_ORIGIN}/tools/word-counter.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 43. JSON Formatter Tool
    "tools/json-formatter.html": {
        "title": "WebGuruJi JSON Formatter - Beautify, Validate & Parse JSON | HarshGuruJi",
        "description": "Beautify, format, validate, and minify JSON code online with instant syntax highlighting and error detection on WebGuruJi JSON Formatter.",
        "keywords": "webguruji json formatter, json validator, json beautifier, format json online, json parser, harshguruji tools",
        "canonical": f"{SITE_ORIGIN}/tools/json-formatter.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/tools.html"}, {"name": "JSON Formatter", "url": f"{SITE_ORIGIN}/tools/json-formatter.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 44. Case Converter Tool
    "tools/case-converter.html": {
        "title": "WebGuruJi Case Converter - UPPERCASE, lowercase, Title Case Tool | HarshGuruJi",
        "description": "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case instantly with WebGuruJi Case Converter.",
        "keywords": "webguruji case converter, uppercase converter, lowercase converter, title case, camelcase converter, harshguruji tools",
        "canonical": f"{SITE_ORIGIN}/tools/case-converter.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/tools.html"}, {"name": "Case Converter", "url": f"{SITE_ORIGIN}/tools/case-converter.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 45. Base64 Tool
    "tools/base64.html": {
        "title": "WebGuruJi Base64 Encode & Decode Online Tool | HarshGuruJi",
        "description": "Encode text and files to Base64 or decode Base64 strings to plain text instantly in your browser with complete privacy on WebGuruJi.",
        "keywords": "webguruji base64, base64 encode, base64 decode, base64 converter online, harshguruji tools",
        "canonical": f"{SITE_ORIGIN}/tools/base64.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/tools.html"}, {"name": "Base64 Tool", "url": f"{SITE_ORIGIN}/tools/base64.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 46. BMI Calculator Tool
    "tools/bmi-calculator.html": {
        "title": "WebGuruJi BMI Calculator - Free Body Mass Index Calculator | HarshGuruJi",
        "description": "Calculate your Body Mass Index (BMI) easily with height and weight in metric or imperial units, plus health category insights on WebGuruJi.",
        "keywords": "webguruji bmi calculator, body mass index, bmi check, healthy weight calculator, harshguruji tools",
        "canonical": f"{SITE_ORIGIN}/tools/bmi-calculator.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/tools.html"}, {"name": "BMI Calculator", "url": f"{SITE_ORIGIN}/tools/bmi-calculator.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 47. Percentage Calculator Tool
    "tools/percentage-calculator.html": {
        "title": "WebGuruJi Percentage Calculator - Free Online Math Calculator | HarshGuruJi",
        "description": "Quickly calculate percentages, discounts, percentage increases/decreases, and marks percentage with WebGuruJi Percentage Calculator.",
        "keywords": "webguruji percentage calculator, calculate percentage, discount calculator, percentage increase, math tool, harshguruji",
        "canonical": f"{SITE_ORIGIN}/tools/percentage-calculator.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/tools.html"}, {"name": "Percentage Calculator", "url": f"{SITE_ORIGIN}/tools/percentage-calculator.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 48. Snake Game
    "games/snake.html": {
        "title": "WebGuruJi Snake Game - Classic Retro Arcade Online | HarshGuruJi Games",
        "description": "Play classic Snake game online for free on WebGuruJi Games. Responsive controls, high score tracking, retro nostalgia, playable on mobile and desktop.",
        "keywords": "webguruji snake game, play snake online, retro snake game, arcade snake, harshguruji games, free online game",
        "canonical": f"{SITE_ORIGIN}/games/snake.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Games", "url": f"{SITE_ORIGIN}/gaming-hub.html"}, {"name": "Snake Game", "url": f"{SITE_ORIGIN}/games/snake.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 49. Tic Tac Toe Game
    "games/tic-tac-toe.html": {
        "title": "WebGuruJi Tic Tac Toe - 2 Player & Smart AI Match | HarshGuruJi Games",
        "description": "Play Tic Tac Toe online against smart AI or challenge a friend in 2-player mode with score tracking on WebGuruJi Games.",
        "keywords": "webguruji tic tac toe, play tic tac toe, 2 player game, noughts and crosses, ai game online, harshguruji games",
        "canonical": f"{SITE_ORIGIN}/games/tic-tac-toe.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Games", "url": f"{SITE_ORIGIN}/gaming-hub.html"}, {"name": "Tic Tac Toe", "url": f"{SITE_ORIGIN}/games/tic-tac-toe.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 50. Memory Match Game
    "games/memory.html": {
        "title": "WebGuruJi Memory Match - Brain Training Card Game | HarshGuruJi Games",
        "description": "Test and train your brain memory with card matching challenges across multiple difficulty levels on WebGuruJi Memory Match.",
        "keywords": "webguruji memory game, brain training game, card match game, memory test online, harshguruji games",
        "canonical": f"{SITE_ORIGIN}/games/memory.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Games", "url": f"{SITE_ORIGIN}/gaming-hub.html"}, {"name": "Memory Game", "url": f"{SITE_ORIGIN}/games/memory.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 51. Learning Class
    "learning/class.html": {
        "title": "WebGuruJi NCERT Class Dashboard - Select Class & Subjects | HarshGuruJi",
        "description": "Browse NCERT study materials by class (Classes 1 through 12). Select your stream, class, and subjects on WebGuruJi Learning.",
        "keywords": "webguruji ncert classes, class 1 to 12 dashboard, select ncert class, cbse curriculum, harshguruji learning",
        "canonical": f"{SITE_ORIGIN}/learning/class.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "Class Dashboard", "url": f"{SITE_ORIGIN}/learning/class.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 52. Learning Subject
    "learning/subject.html": {
        "title": "WebGuruJi NCERT Subject Explorer & Syllabus Guide | HarshGuruJi",
        "description": "Explore NCERT subjects: Mathematics, Physics, Chemistry, Biology, History, Geography, and Languages with complete syllabus on WebGuruJi.",
        "keywords": "webguruji ncert subjects, subject explorer, syllabus guide, class subjects ncert, harshguruji learning",
        "canonical": f"{SITE_ORIGIN}/learning/subject.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "Subjects", "url": f"{SITE_ORIGIN}/learning/subject.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 53. Learning Chapter
    "learning/chapter.html": {
        "title": "WebGuruJi NCERT Chapter Notes & Study Guide | HarshGuruJi Learning Hub",
        "description": "Detailed NCERT chapter notes, summaries, textbook questions, and interactive learning aids on WebGuruJi Learning Hub.",
        "keywords": "webguruji chapter notes, ncert study guide, chapter summary, class notes, harshguruji learning",
        "canonical": f"{SITE_ORIGIN}/learning/chapter.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "Chapter Notes", "url": f"{SITE_ORIGIN}/learning/chapter.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 54. Learning PDF Library
    "learning/pdf-library.html": {
        "title": "WebGuruJi NCERT PDF Books & Textbooks Viewer (Class 1-12) | HarshGuruJi",
        "description": "Online interactive PDF textbook reader for all NCERT books (Classes 1 to 12). View chapters, download PDFs, and revise on WebGuruJi.",
        "keywords": "webguruji ncert pdf, online pdf viewer, read ncert books online, class 10 science pdf, harshguruji pdf library",
        "canonical": f"{SITE_ORIGIN}/learning/pdf-library.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "PDF Library", "url": f"{SITE_ORIGIN}/learning/pdf-library.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 55. Class 10 Science
    "learning/class-10-science.html": {
        "title": "WebGuruJi Class 10 Science NCERT Notes & Chapter PDFs | HarshGuruJi",
        "description": "Access free Class 10 Science NCERT textbook chapters, chemical reactions, formulas, and revision notes on WebGuruJi Learning.",
        "keywords": "webguruji class 10 science, ncert class 10 science, chemical reactions notes, class 10 study materials, harshguruji",
        "canonical": f"{SITE_ORIGIN}/learning/class-10-science.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "Class 10 Science", "url": f"{SITE_ORIGIN}/learning/class-10-science.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 56. GK Quiz
    "learning/gk-quiz.html": {
        "title": "WebGuruJi GK Quiz - General Knowledge & Learning Test | HarshGuruJi",
        "description": "Test your general knowledge with WebGuruJi GK Quiz. Free interactive trivia, current affairs, and competitive exam questions.",
        "keywords": "webguruji gk quiz, general knowledge quiz, interactive quiz game, harshguruji quiz, online test",
        "canonical": f"{SITE_ORIGIN}/learning/gk-quiz.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "GK Quiz", "url": f"{SITE_ORIGIN}/learning/gk-quiz.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 57. Class 10 Science Chapter 1 Document
    "learning/class-10/science/ncert/01-chemical-reactions-and-equations.html": {
        "title": "WebGuruJi NCERT Class 10 Science Chapter 1: Chemical Reactions & Equations",
        "description": "Read NCERT Class 10 Science Chapter 1: Chemical Reactions and Equations textbook PDF, key equations, and balancing reactions on WebGuruJi.",
        "keywords": "webguruji chemical reactions and equations, class 10 science chapter 1, ncert chemistry notes, harshguruji",
        "canonical": f"{SITE_ORIGIN}/learning/class-10/science/ncert/01-chemical-reactions-and-equations.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "Chapter 1", "url": f"{SITE_ORIGIN}/learning/class-10/science/ncert/01-chemical-reactions-and-equations.html"}],
        "type": "article",
        "asset_prefix": "../../../../"
    },
    # 58. OAuth Consent
    "oauth/consent/index.html": {
        "title": "WebGuruJi App Authorization & OAuth Consent | HarshGuruJi",
        "description": "Authorize third-party integration and review application permissions on WebGuruJi OAuth Consent screen.",
        "keywords": "webguruji oauth, authorize app, permission consent, secure sign in, harshguruji oauth",
        "canonical": f"{SITE_ORIGIN}/oauth/consent/",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "OAuth", "url": f"{SITE_ORIGIN}/oauth/consent/"}],
        "type": "website",
        "asset_prefix": "../../"
    },
    # 59. Admin Panel (Protected by Gate Pass)
    "admin.html": {
        "title": "WebGuruJi Admin Panel - Master Command Center Gate Pass | HarshGuruJi",
        "description": "WebGuruJi Master Admin Command Center and administrative control portal with gate pass security.",
        "keywords": "webguruji admin, admin panel, master command center, webguruji gate pass, harshguruji admin",
        "canonical": f"{SITE_ORIGIN}/admin.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Admin Gate Pass", "url": f"{SITE_ORIGIN}/admin.html"}],
        "type": "website"
    },
    # 60. Admin Subpage APK Upload
    "adminapkupload.html": {
        "title": "WebGuruJi Admin APK Upload Portal | HarshGuruJi Admin",
        "description": "Publish and manage Android APK downloads and software packages inside WebGuruJi Admin Suite.",
        "keywords": "webguruji admin apk, apk upload portal, harshguruji admin",
        "canonical": f"{SITE_ORIGIN}/adminapkupload.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Admin APK", "url": f"{SITE_ORIGIN}/adminapkupload.html"}],
        "type": "website"
    },
    # 61. Admin Books
    "adminbooks.html": {
        "title": "WebGuruJi Admin Books Studio | HarshGuruJi Admin",
        "description": "Manage NCERT books catalog, chapter PDFs, and digital library resources inside WebGuruJi Admin Suite.",
        "keywords": "webguruji admin books, ncert catalog manager, harshguruji admin",
        "canonical": f"{SITE_ORIGIN}/adminbooks.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Admin Books", "url": f"{SITE_ORIGIN}/adminbooks.html"}],
        "type": "website"
    },
    # 62. Admin Contributors
    "admincontributors.html": {
        "title": "WebGuruJi Admin Contributors Review | HarshGuruJi Admin",
        "description": "Review and verify creator applications and contributor profiles inside WebGuruJi Admin Suite.",
        "keywords": "webguruji admin contributors, creator applications review, harshguruji admin",
        "canonical": f"{SITE_ORIGIN}/admincontributors.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Admin Contributors", "url": f"{SITE_ORIGIN}/admincontributors.html"}],
        "type": "website"
    },
    # 63. Admin Chatbase
    "admin-chatbase.html": {
        "title": "WebGuruJi Admin ChatBase Management | HarshGuruJi Admin",
        "description": "ChatBase application management, golden ticks, and user status controls inside WebGuruJi Admin Suite.",
        "keywords": "webguruji admin chatbase, chat moderation, harshguruji admin",
        "canonical": f"{SITE_ORIGIN}/admin-chatbase.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Admin ChatBase", "url": f"{SITE_ORIGIN}/admin-chatbase.html"}],
        "type": "website"
    },
    # 64. Admin Contacts
    "admin-contacts.html": {
        "title": "WebGuruJi Admin User Messages & Inquiries | HarshGuruJi Admin",
        "description": "Review incoming user messages, contact submissions, and support feedback inside WebGuruJi Admin Suite.",
        "keywords": "webguruji admin contacts, user messages, support inbox, harshguruji admin",
        "canonical": f"{SITE_ORIGIN}/admin-contacts.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Admin Contacts", "url": f"{SITE_ORIGIN}/admin-contacts.html"}],
        "type": "website"
    },
    # 65. Admin Requests
    "admin-requests.html": {
        "title": "WebGuruJi Admin System Requests | HarshGuruJi Admin",
        "description": "Administrative system requests and moderation dashboard inside WebGuruJi Admin Suite.",
        "keywords": "webguruji admin requests, moderation queue, harshguruji admin",
        "canonical": f"{SITE_ORIGIN}/admin-requests.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Admin Requests", "url": f"{SITE_ORIGIN}/admin-requests.html"}],
        "type": "website"
    }
}

def build_schema_json(cfg):
    url = cfg["canonical"]
    schema_items = []

    # BreadcrumbList Schema
    if "breadcrumbs" in cfg and len(cfg["breadcrumbs"]) > 1:
        element_list = []
        for idx, item in enumerate(cfg["breadcrumbs"], 1):
            element_list.append({
                "@type": "ListItem",
                "position": idx,
                "name": item["name"],
                "item": item["url"]
            })
        breadcrumb_schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": element_list
        }
        schema_items.append(breadcrumb_schema)

    # WebPage Schema
    webpage_schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": cfg["title"],
        "url": url,
        "description": cfg["description"],
        "inLanguage": "en",
        "isPartOf": {
            "@type": "WebSite",
            "name": "WebGuruJi",
            "alternateName": ["HarshGuruJi", "webguruji.online"],
            "url": f"{SITE_ORIGIN}/"
        }
    }
    schema_items.append(webpage_schema)

    # For homepage, add WebSite search action
    if url in (f"{SITE_ORIGIN}/", f"{SITE_ORIGIN}/index.html"):
        website_schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "WebGuruJi",
            "alternateName": ["HarshGuruJi", "webguruji.online"],
            "url": f"{SITE_ORIGIN}/",
            "description": cfg["description"],
            "potentialAction": {
                "@type": "SearchAction",
                "target": f"{SITE_ORIGIN}/explore.html?q={{search_term_string}}",
                "query-input": "required name=search_term_string"
            }
        }
        schema_items.append(website_schema)

    output = ""
    for item in schema_items:
        output += f'\n  <script type="application/ld+json">\n  {json.dumps(item, indent=2)}\n  </script>'
    return output

def build_head_seo_block(cfg):
    asset_prefix = cfg.get("asset_prefix", "")
    icon_href = f"{asset_prefix}logo.png"
    # EVERY SINGLE PAGE IS INDEXABLE FOR GOOGLE SEARCH CONSOLE CRAWLER!
    robots_rule = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"

    schema_block = build_schema_json(cfg)

    lines = [
        f'  <title>{cfg["title"]}</title>',
        f'  <meta name="description" content="{cfg["description"]}">',
        f'  <meta name="keywords" content="{cfg["keywords"]}">',
        f'  <meta name="author" content="HarshGuruJi">',
        f'  <meta name="robots" content="{robots_rule}">',
        f'  <link rel="canonical" href="{cfg["canonical"]}">',
        f'  <link rel="icon" type="image/png" href="{icon_href}">',
        f'  <link rel="apple-touch-icon" href="{asset_prefix}logo-192.png">',
        '',
        '  <!-- Open Graph / Facebook -->',
        '  <meta property="og:site_name" content="WebGuruJi">',
        f'  <meta property="og:type" content="{cfg.get("type", "website")}">',
        f'  <meta property="og:url" content="{cfg["canonical"]}">',
        f'  <meta property="og:title" content="{cfg["title"]}">',
        f'  <meta property="og:description" content="{cfg["description"]}">',
        f'  <meta property="og:image" content="{LOGO_URL}">',
        '  <meta property="og:locale" content="en_US">',
        '',
        '  <!-- Twitter Card -->',
        '  <meta name="twitter:card" content="summary_large_image">',
        '  <meta name="twitter:site" content="@harshguruji1">',
        f'  <meta name="twitter:title" content="{cfg["title"]}">',
        f'  <meta name="twitter:description" content="{cfg["description"]}">',
        f'  <meta name="twitter:image" content="{LOGO_URL}">',
        schema_block
    ]
    return "\n".join(lines)

def apply_seo_to_file(filepath, cfg):
    if not os.path.exists(filepath):
        print(f"Skipping missing: {filepath}")
        return

    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    head_match = re.search(r'(<head[^>]*>)(.*?)(</head>)', content, re.IGNORECASE | re.DOTALL)
    if not head_match:
        print(f"Could not find <head> in {filepath}")
        return

    head_open = head_match.group(1)
    head_content = head_match.group(2)
    head_close = head_match.group(3)

    cleaned_head = head_content
    # Remove existing <title>
    cleaned_head = re.sub(r'<title[^>]*>.*?</title>', '', cleaned_head, flags=re.IGNORECASE | re.DOTALL)
    # Remove existing meta description, keywords, author, robots
    cleaned_head = re.sub(r'<meta[^>]+(?:name=["\'](?:description|keywords|author|robots)["\'][^>]*|content=["\'][^"\']*["\'][^>]*name=["\'](?:description|keywords|author|robots)["\'])[^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    cleaned_head = re.sub(r'<meta[^>]+id=["\']meta-description["\'][^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    # Remove existing canonical link
    cleaned_head = re.sub(r'<link[^>]+rel=["\']canonical["\'][^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    # Remove existing icons
    cleaned_head = re.sub(r'<link[^>]+(?:rel=["\'](?:icon|shortcut icon|apple-touch-icon)["\'])[^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    # Remove existing og / twitter meta tags
    cleaned_head = re.sub(r'<meta[^>]+(?:property|name|id)=["\'](?:og:[^"\']+|twitter:[^"\']+|og-title|og-description|og-image|tw-title|tw-description|tw-image)["\'][^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    # Remove existing schema ld+json
    cleaned_head = re.sub(r'<script\s+type=["\']application/ld\+json["\'][^>]*>.*?</script>', '', cleaned_head, flags=re.IGNORECASE | re.DOTALL)
    # Remove old SEO comment banners
    cleaned_head = re.sub(r'<!--\s*(?:Open Graph|Twitter Card|Schema\.org|Facebook)[^>]*-->', '', cleaned_head, flags=re.IGNORECASE)
    # Clean blank lines
    cleaned_head = re.sub(r'\n\s*\n\s*\n+', '\n\n', cleaned_head)

    new_seo = build_head_seo_block(cfg)

    meta_charset = re.search(r'<meta[^>]+charset=[^>]+>', cleaned_head, re.IGNORECASE)
    meta_viewport = re.search(r'<meta[^>]+name=["\']viewport["\'][^>]+>', cleaned_head, re.IGNORECASE)

    prefix_tags = ""
    if meta_charset:
        cleaned_head = cleaned_head.replace(meta_charset.group(0), "")
        prefix_tags += f"\n  {meta_charset.group(0).strip()}"
    else:
        prefix_tags += '\n  <meta charset="UTF-8">'

    if meta_viewport:
        cleaned_head = cleaned_head.replace(meta_viewport.group(0), "")
        prefix_tags += f"\n  {meta_viewport.group(0).strip()}"
    else:
        prefix_tags += '\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">'

    new_head_content = f"{prefix_tags}\n{new_seo}\n{cleaned_head.lstrip()}"
    new_full_content = content[:head_match.start()] + head_open + new_head_content + head_close + content[head_match.end():]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_full_content)
    print(f"Applied SEO to: {filepath}")

def main():
    print("Applying complete SEO & indexing capability to all 65 pages...")
    for rel_path, cfg in PAGE_CONFIGS.items():
        apply_seo_to_file(rel_path, cfg)
    print("\nFinished applying SEO metadata to all pages.")

if __name__ == "__main__":
    main()
