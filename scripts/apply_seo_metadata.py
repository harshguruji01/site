import os
import re
import json

SITE_ORIGIN = "https://www.webguruji.online"
LOGO_URL = f"{SITE_ORIGIN}/logo-512.png"

PAGES_CONFIG = {
    # 1. Homepage
    "index.html": {
        "title": "HarshGuruJi - Free Online Tools, Learning Hub, AI & Store",
        "description": "HarshGuruJi is your all-in-one platform for free online developer tools, NCERT study resources, AI directories, browser games, and verified application downloads.",
        "keywords": "HarshGuruJi, webguruji, free online tools, learning hub, NCERT books, AI directory, online games, software store",
        "canonical": f"{SITE_ORIGIN}/",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}],
        "type": "website"
    },
    # 2. Login Page (Highlighted by user)
    "login.html": {
        "title": "Login - HarshGuruJi | Access Your Account, Tools & Hub",
        "description": "Sign in to your HarshGuruJi account. Access free online tools, learning resources, NCERT study materials, AI directory, and exclusive user features.",
        "keywords": "HarshGuruJi login, webguruji sign in, account login, student portal login, access tools",
        "canonical": f"{SITE_ORIGIN}/login.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Login", "url": f"{SITE_ORIGIN}/login.html"}],
        "type": "website"
    },
    # 3. Signup
    "signup.html": {
        "title": "Create Free Account | HarshGuruJi - Sign Up & Join Us",
        "description": "Create your free HarshGuruJi account today. Unlock unlimited access to developer tools, educational resources, online games, and personalized dashboard.",
        "keywords": "HarshGuruJi signup, create account, register webguruji, free student account, join harshguruji",
        "canonical": f"{SITE_ORIGIN}/signup.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Sign Up", "url": f"{SITE_ORIGIN}/signup.html"}],
        "type": "website"
    },
    # 4. Forgot Password
    "forgot-password.html": {
        "title": "Forgot Password | Reset Your HarshGuruJi Account Access",
        "description": "Forgot your HarshGuruJi account password? Enter your registered email to receive a secure password reset link and regain immediate access to your account.",
        "keywords": "forgot password, reset password, harshguruji account recovery, recover password",
        "canonical": f"{SITE_ORIGIN}/forgot-password.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Forgot Password", "url": f"{SITE_ORIGIN}/forgot-password.html"}],
        "type": "website"
    },
    # 5. Reset Password
    "reset-password.html": {
        "title": "Reset Password | Set New HarshGuruJi Account Password",
        "description": "Set a new, secure password for your HarshGuruJi account. Ensure your account credentials remain safe and protected.",
        "keywords": "reset password, new password, harshguruji security, update password",
        "canonical": f"{SITE_ORIGIN}/reset-password.html",
        "robots": "noindex, follow",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Reset Password", "url": f"{SITE_ORIGIN}/reset-password.html"}],
        "type": "website"
    },
    # 6. Store
    "store.html": {
        "title": "HarshGuruJi Store - Apps, Software, AI Tools & APK Downloads",
        "description": "Browse and download verified Android APKs, Windows software, AI productivity tools, and web applications safely with direct high-speed links.",
        "keywords": "HarshGuruJi store, apk download, free software, windows apps, ai tools download, verified applications",
        "canonical": f"{SITE_ORIGIN}/store.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Store", "url": f"{SITE_ORIGIN}/store.html"}],
        "type": "website"
    },
    # 7. Store Detail / Download
    "store-detail.html": {
        "title": "App Details & Download | HarshGuruJi Store",
        "description": "Download verified, virus-scanned applications, APKs, and desktop software with complete changelogs, specs, and safe direct download links.",
        "keywords": "app download, apk download, software download, verified apk, harshguruji store",
        "canonical": f"{SITE_ORIGIN}/store-detail.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Store", "url": f"{SITE_ORIGIN}/store.html"}, {"name": "App Detail", "url": f"{SITE_ORIGIN}/store-detail.html"}],
        "type": "website"
    },
    # 8. Free Tools
    "free-tools.html": {
        "title": "Free Online Tools - Calculators, Converters & Generators | HarshGuruJi",
        "description": "Explore free web utilities and developer tools including password generators, text case converters, JSON formatters, word counters, and Base64 encoders.",
        "keywords": "free online tools, password generator, json formatter, word counter, case converter, web utilities",
        "canonical": f"{SITE_ORIGIN}/free-tools.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Free Tools", "url": f"{SITE_ORIGIN}/free-tools.html"}],
        "type": "website"
    },
    # 9. Tools Hub
    "tools.html": {
        "title": "Tools Hub - Productive Web Utilities & Dev Tools | HarshGuruJi",
        "description": "Discover useful tools for work, study, development, and everyday tasks. High performance, browser-based utilities with complete privacy.",
        "keywords": "tools hub, developer tools, productivity utilities, web tools, harshguruji tools",
        "canonical": f"{SITE_ORIGIN}/tools.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools Hub", "url": f"{SITE_ORIGIN}/tools.html"}],
        "type": "website"
    },
    # 10. Learning Hub
    "learning-hub.html": {
        "title": "Learning Hub - Study Resources, Notes & NCERT Books | HarshGuruJi",
        "description": "Empower your education with free study notes, NCERT textbooks for Classes 1 to 12, interactive quizzes, study methods, and exam preparation guides.",
        "keywords": "learning hub, ncert books, class 1 to 12 notes, study materials, student resources, education portal",
        "canonical": f"{SITE_ORIGIN}/learning-hub.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning Hub", "url": f"{SITE_ORIGIN}/learning-hub.html"}],
        "type": "website"
    },
    # 11. Learning
    "learning.html": {
        "title": "NCERT Learning Portal - Classes 1 to 12 | HarshGuruJi",
        "description": "Access free educational resources, chapter notes, NCERT textbooks, syllabus guides, and practice tests for students from Class 1 to Class 12.",
        "keywords": "ncert portal, cbse class 1-12, ncert textbooks, study notes, student learning hub",
        "canonical": f"{SITE_ORIGIN}/learning.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning.html"}],
        "type": "website"
    },
    # 12. Education
    "education.html": {
        "title": "Education Portal - Academic Concepts & Learning | HarshGuruJi",
        "description": "Curated educational guides, academic subjects, and foundational knowledge designed to make complex concepts simple and engaging for all students.",
        "keywords": "education portal, academic learning, study guides, educational articles, student knowledge",
        "canonical": f"{SITE_ORIGIN}/education.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Education", "url": f"{SITE_ORIGIN}/education.html"}],
        "type": "website"
    },
    # 13. Technology
    "technology.html": {
        "title": "Technology Hub - Tech Trends, Computing & Software | HarshGuruJi",
        "description": "Stay ahead with technology news, computer science fundamentals, programming tutorials, and innovative tech updates curated by HarshGuruJi.",
        "keywords": "technology hub, tech trends, computer science, programming guides, software news",
        "canonical": f"{SITE_ORIGIN}/technology.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Technology", "url": f"{SITE_ORIGIN}/technology.html"}],
        "type": "website"
    },
    # 14. AI Hub
    "ai-hub.html": {
        "title": "AI Hub - Artificial Intelligence Directory & Tools | HarshGuruJi",
        "description": "Explore leading AI tools, machine learning software, LLMs, and prompt guides to supercharge your creativity, productivity, and learning.",
        "keywords": "ai hub, artificial intelligence directory, generative ai, best ai tools, llm models",
        "canonical": f"{SITE_ORIGIN}/ai-hub.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "AI Hub", "url": f"{SITE_ORIGIN}/ai-hub.html"}],
        "type": "website"
    },
    # 15. AI Directory
    "ai.html": {
        "title": "AI Directory - Curated Artificial Intelligence Resources | HarshGuruJi",
        "description": "Curated directory of artificial intelligence tools, machine learning libraries, chatbots, and AI platforms for students, creators, and developers.",
        "keywords": "ai directory, top ai tools, ai apps, artificial intelligence, harshguruji ai",
        "canonical": f"{SITE_ORIGIN}/ai.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "AI Directory", "url": f"{SITE_ORIGIN}/ai.html"}],
        "type": "website"
    },
    # 16. Gaming Hub
    "gaming-hub.html": {
        "title": "Gaming Hub - Play Free Online Browser Games | HarshGuruJi",
        "description": "Play classic and modern online browser games for free. Enjoy Snake, Tic-Tac-Toe, Memory Match, puzzle games, and arcade classics with no install.",
        "keywords": "gaming hub, free online games, browser games, play snake game, tic tac toe online, memory game",
        "canonical": f"{SITE_ORIGIN}/gaming-hub.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Gaming Hub", "url": f"{SITE_ORIGIN}/gaming-hub.html"}],
        "type": "website"
    },
    # 17. Gaming
    "gaming.html": {
        "title": "Online Games - Free Play In Browser | HarshGuruJi Gaming",
        "description": "Explore free web games, gaming resources, and browser-based entertainment. Instant play with no downloads required.",
        "keywords": "online games, browser arcade, play games free, retro games, harshguruji gaming",
        "canonical": f"{SITE_ORIGIN}/gaming.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Gaming", "url": f"{SITE_ORIGIN}/gaming.html"}],
        "type": "website"
    },
    # 18. Daily Special
    "daily-special.html": {
        "title": "Daily Special - Today in History & Daily Facts | HarshGuruJi",
        "description": "Discover what happened today in history. Daily updated historical events, famous birthdays, milestones, and inspiring daily knowledge.",
        "keywords": "today in history, daily special, historical facts, famous birthdays, daily knowledge, on this day",
        "canonical": f"{SITE_ORIGIN}/daily-special.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Daily Special", "url": f"{SITE_ORIGIN}/daily-special.html"}],
        "type": "website"
    },
    # 19. Daily Life
    "daily-life.html": {
        "title": "Daily Life - Productivity, Wellness & Lifestyle Hacks | HarshGuruJi",
        "description": "Practical tips and actionable guides for everyday life: time management, mental wellness, goal setting, healthy habits, and personal growth.",
        "keywords": "daily life hacks, productivity tips, wellness advice, healthy habits, life balance, personal growth",
        "canonical": f"{SITE_ORIGIN}/daily-life.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Daily Life", "url": f"{SITE_ORIGIN}/daily-life.html"}],
        "type": "website"
    },
    # 20. Insights
    "insights.html": {
        "title": "Insights & Wisdom - Life Lessons & Mindful Thoughts | HarshGuruJi",
        "description": "Deep thoughts, life lessons, and philosophical wisdom curated to broaden your perspective and inspire mindful decision-making.",
        "keywords": "life insights, wisdom quotes, mindful living, personal development, philosophical thoughts",
        "canonical": f"{SITE_ORIGIN}/insights.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Insights", "url": f"{SITE_ORIGIN}/insights.html"}],
        "type": "website"
    },
    # 21. Explore
    "explore.html": {
        "title": "Explore & Discover - Topics, Tools & Knowledge | HarshGuruJi",
        "description": "Explore the complete universe of HarshGuruJi. Discover featured categories, top educational topics, tools, games, and community resources.",
        "keywords": "explore harshguruji, discover knowledge, educational topics, free tools directory",
        "canonical": f"{SITE_ORIGIN}/explore.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Explore", "url": f"{SITE_ORIGIN}/explore.html"}],
        "type": "website"
    },
    # 22. Contact
    "contact.html": {
        "title": "Contact Us | HarshGuruJi Support & Feedback",
        "description": "Get in touch with the HarshGuruJi team. Have questions, suggestions, or feedback? Send us a message and our support team will get back to you.",
        "keywords": "contact harshguruji, customer support, feedback, get in touch, help desk",
        "canonical": f"{SITE_ORIGIN}/contact.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Contact Us", "url": f"{SITE_ORIGIN}/contact.html"}],
        "type": "website"
    },
    # 23. About
    "about.html": {
        "title": "About Us - HarshGuruJi | Mission, Story & Vision",
        "description": "Learn about HarshGuruJi's mission to make education, developer tools, and technology accessible, free, and engaging for everyone worldwide.",
        "keywords": "about harshguruji, our mission, harshguruji founder, platform history, vision",
        "canonical": f"{SITE_ORIGIN}/about.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "About Us", "url": f"{SITE_ORIGIN}/about.html"}],
        "type": "website"
    },
    # 24. Contributor
    "contributor.html": {
        "title": "Our Contributors - The Team Behind HarshGuruJi",
        "description": "Meet the talented educators, developers, and writers contributing high quality tools and educational content to HarshGuruJi.",
        "keywords": "harshguruji contributors, editorial team, authors, open source contributors",
        "canonical": f"{SITE_ORIGIN}/contributor.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Contributors", "url": f"{SITE_ORIGIN}/contributor.html"}],
        "type": "website"
    },
    # 25. Join Contributor
    "join-contributor.html": {
        "title": "Become a Contributor | Write & Build with HarshGuruJi",
        "description": "Join our contributor community. Share your expertise, publish guides or tools, earn the Golden Tick verified badge, and reach thousands of learners.",
        "keywords": "become a contributor, join harshguruji, guest author, developer submission, write for us",
        "canonical": f"{SITE_ORIGIN}/join-contributor.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Join Contributor", "url": f"{SITE_ORIGIN}/join-contributor.html"}],
        "type": "website"
    },
    # 26. Apply Contributor
    "apply-contributor.html": {
        "title": "Contributor Application Form | HarshGuruJi Careers & Creators",
        "description": "Submit your application to become an official contributor at HarshGuruJi. Share your skills, articles, or coding projects with our global audience.",
        "keywords": "contributor application, apply harshguruji, creator form, guest author application",
        "canonical": f"{SITE_ORIGIN}/apply-contributor.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Apply Contributor", "url": f"{SITE_ORIGIN}/apply-contributor.html"}],
        "type": "website"
    },
    # 27. Cookie Policy
    "cookie.html": {
        "title": "Cookie Policy | HarshGuruJi - How We Use Cookies",
        "description": "Official Cookie Policy for HarshGuruJi (webguruji.online). Understand necessary cookies, preferences, analytics, and how to manage your privacy settings.",
        "keywords": "cookie policy, harshguruji cookies, privacy preferences, consent management",
        "canonical": f"{SITE_ORIGIN}/cookie.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Cookie Policy", "url": f"{SITE_ORIGIN}/cookie.html"}],
        "type": "website"
    },
    # 28. Privacy Policy
    "privacy-policy.html": {
        "title": "Privacy Policy | HarshGuruJi - Data Protection & User Privacy",
        "description": "Read HarshGuruJi's Privacy Policy. Understand how we collect, use, and protect your personal information and ensure transparent data handling.",
        "keywords": "privacy policy, harshguruji privacy, user data protection, privacy terms",
        "canonical": f"{SITE_ORIGIN}/privacy-policy.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Privacy Policy", "url": f"{SITE_ORIGIN}/privacy-policy.html"}],
        "type": "website"
    },
    # 29. Terms and Conditions
    "terms-and-conditions.html": {
        "title": "Terms and Conditions | HarshGuruJi - Terms of Service",
        "description": "Read the Terms and Conditions for HarshGuruJi platform usage. Understand user rights, responsibilities, content policies, and service guidelines.",
        "keywords": "terms and conditions, terms of service, user agreement, website terms",
        "canonical": f"{SITE_ORIGIN}/terms-and-conditions.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Terms and Conditions", "url": f"{SITE_ORIGIN}/terms-and-conditions.html"}],
        "type": "website"
    },
    # 30. Chat Showcase
    "chat.html": {
        "title": "HarshGuruJi Chat - Real-Time 1-on-1 Messaging Application",
        "description": "Official showcase for HarshGuruJi Chat. Experience fast, private 1-on-1 messaging with live delivery receipts, audio notes, and unique GuruJi ID discovery.",
        "keywords": "harshguruji chat, private messaging, realtime chat, instant messenger, secure chat online",
        "canonical": f"{SITE_ORIGIN}/chat.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Chat", "url": f"{SITE_ORIGIN}/chat.html"}],
        "type": "website"
    },
    # 31. Ads Center
    "ads.html": {
        "title": "Partner Network & Advertisements | HarshGuruJi",
        "description": "Explore verified partner advertisements and sponsored showcases across 5 curated categories on the HarshGuruJi network.",
        "keywords": "harshguruji ads, partner network, sponsored tools, advertising directory",
        "canonical": f"{SITE_ORIGIN}/ads.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Partner Ads", "url": f"{SITE_ORIGIN}/ads.html"}],
        "type": "website"
    },
    # 32. Subdirectory Tools
    "tools/password-generator.html": {
        "title": "Strong Password Generator - Free Online Security Tool | HarshGuruJi",
        "description": "Generate cryptographically strong, random passwords with custom length, symbols, and numbers locally in your browser. Fast, free, and 100% private.",
        "keywords": "password generator, random password, strong password, security tool, online password generator",
        "canonical": f"{SITE_ORIGIN}/tools/password-generator.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/free-tools.html"}, {"name": "Password Generator", "url": f"{SITE_ORIGIN}/tools/password-generator.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    "tools/word-counter.html": {
        "title": "Word Counter & Character Counter Tool | HarshGuruJi",
        "description": "Free online word and character counter. Calculate reading time, speaking time, word density, and paragraph statistics in real time.",
        "keywords": "word counter, character counter, text analyzer, reading time, word count tool",
        "canonical": f"{SITE_ORIGIN}/tools/word-counter.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/free-tools.html"}, {"name": "Word Counter", "url": f"{SITE_ORIGIN}/tools/word-counter.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    "tools/json-formatter.html": {
        "title": "JSON Formatter, Validator & Beautifier | HarshGuruJi",
        "description": "Free online JSON formatter, validator, and beautifier. Indent, inspect, minify, and validate JSON code with syntax error detection.",
        "keywords": "json formatter, json validator, json beautifier, json parser, dev tools",
        "canonical": f"{SITE_ORIGIN}/tools/json-formatter.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/free-tools.html"}, {"name": "JSON Formatter", "url": f"{SITE_ORIGIN}/tools/json-formatter.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    "tools/case-converter.html": {
        "title": "Text Case Converter - UPPERCASE, lowercase, Title Case | HarshGuruJi",
        "description": "Convert text cases easily: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case instantly for free.",
        "keywords": "case converter, uppercase to lowercase, title case converter, camelcase generator, text tool",
        "canonical": f"{SITE_ORIGIN}/tools/case-converter.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/free-tools.html"}, {"name": "Case Converter", "url": f"{SITE_ORIGIN}/tools/case-converter.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    "tools/base64.html": {
        "title": "Base64 Encode & Decode Online Tool | HarshGuruJi",
        "description": "Fast and secure online Base64 encoder and decoder. Convert text and binary data to and from Base64 string format with one click.",
        "keywords": "base64 encoder, base64 decoder, base64 converter, encode online, decode online",
        "canonical": f"{SITE_ORIGIN}/tools/base64.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Tools", "url": f"{SITE_ORIGIN}/free-tools.html"}, {"name": "Base64 Tool", "url": f"{SITE_ORIGIN}/tools/base64.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 33. Subdirectory Games
    "games/snake.html": {
        "title": "Play Snake Game Online - Classic Retro Arcade | HarshGuruJi Games",
        "description": "Play classic retro Snake game in your browser for free. Eat apples, grow longer, beat your high scores, and enjoy smooth responsive controls.",
        "keywords": "snake game, play snake online, retro snake, classic arcade game, browser games",
        "canonical": f"{SITE_ORIGIN}/games/snake.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Gaming", "url": f"{SITE_ORIGIN}/gaming-hub.html"}, {"name": "Snake", "url": f"{SITE_ORIGIN}/games/snake.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    "games/tic-tac-toe.html": {
        "title": "Play Tic Tac Toe Online - 2 Player & AI Match | HarshGuruJi Games",
        "description": "Play classic Tic-Tac-Toe (Noughts & Crosses) online for free against an intelligent AI or challenge a friend in two-player mode.",
        "keywords": "tic tac toe, play tic tac toe online, xo game, noughts and crosses, 2 player games",
        "canonical": f"{SITE_ORIGIN}/games/tic-tac-toe.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Gaming", "url": f"{SITE_ORIGIN}/gaming-hub.html"}, {"name": "Tic Tac Toe", "url": f"{SITE_ORIGIN}/games/tic-tac-toe.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    "games/memory.html": {
        "title": "Memory Match Card Game - Brain Training Game | HarshGuruJi Games",
        "description": "Train your memory and focus with this free interactive card matching game. Flip cards, find matching pairs, and track your best moves.",
        "keywords": "memory game, card match game, brain training, memory match online, concentration game",
        "canonical": f"{SITE_ORIGIN}/games/memory.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Gaming", "url": f"{SITE_ORIGIN}/gaming-hub.html"}, {"name": "Memory Match", "url": f"{SITE_ORIGIN}/games/memory.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 34. Subdirectory Learning
    "learning/pdf-library.html": {
        "title": "NCERT PDF Books & Textbooks Viewer (Class 1-12) | HarshGuruJi",
        "description": "Read and view official NCERT textbooks online for Classes 1 to 12. Free PDF viewer for Science, Math, English, Social Science, and Hindi.",
        "keywords": "ncert pdf books, download ncert books, class 1 to 12 textbooks, cbse textbooks online",
        "canonical": f"{SITE_ORIGIN}/learning/pdf-library.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "PDF Library", "url": f"{SITE_ORIGIN}/learning/pdf-library.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    "learning/class.html": {
        "title": "NCERT Class Dashboard - Select Class & Subjects | HarshGuruJi",
        "description": "Interactive NCERT class dashboard for Classes 1 to 12. Select your class, explore subjects, syllabus, chapters, and free study notes.",
        "keywords": "ncert class dashboard, cbse classes, study materials by class, school syllabus",
        "canonical": f"{SITE_ORIGIN}/learning/class.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "Class Dashboard", "url": f"{SITE_ORIGIN}/learning/class.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 35. Quiz India
    "Quiz India/index.html": {
        "title": "Quiz India - Interactive Learning & GK Quiz Game | HarshGuruJi",
        "description": "Test your knowledge with Quiz India! Interactive General Knowledge quizzes on history, geography, science, politics, and current affairs.",
        "keywords": "quiz india, gk quiz, online quiz game, general knowledge india, test your knowledge",
        "canonical": f"{SITE_ORIGIN}/Quiz%20India/",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Quiz India", "url": f"{SITE_ORIGIN}/Quiz%20India/"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 36. Learning Subject
    "learning/subject.html": {
        "title": "NCERT Subject Explorer & Syllabus | HarshGuruJi Learning Hub",
        "description": "Explore NCERT subjects, chapter listings, textbooks, and interactive study material for school students on HarshGuruJi Learning Hub.",
        "keywords": "ncert subjects, syllabus explorer, class subjects, study materials",
        "canonical": f"{SITE_ORIGIN}/learning/subject.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "Subject Explorer", "url": f"{SITE_ORIGIN}/learning/subject.html"}],
        "type": "website",
        "asset_prefix": "../"
    },
    # 37. Learning Chapter
    "learning/chapter.html": {
        "title": "NCERT Chapter Notes & Study Guide | HarshGuruJi Learning Hub",
        "description": "Detailed NCERT chapter notes, summaries, textbook questions, and interactive learning aids on HarshGuruJi Learning Hub.",
        "keywords": "ncert chapter notes, study guide, chapter summary, class notes",
        "canonical": f"{SITE_ORIGIN}/learning/chapter.html",
        "breadcrumbs": [{"name": "Home", "url": f"{SITE_ORIGIN}/"}, {"name": "Learning", "url": f"{SITE_ORIGIN}/learning-hub.html"}, {"name": "Chapter Notes", "url": f"{SITE_ORIGIN}/learning/chapter.html"}],
        "type": "website",
        "asset_prefix": "../"
    }
}

NOINDEX_PAGES = [
    "admin.html",
    "admin-chatbase.html",
    "admin-contacts.html",
    "admin-requests.html",
    "adminapkupload.html",
    "admincontributors.html",
    "dashboard.html",
    "settings.html",
    "appearance.html",
    "verify-contributor.html",
    "app.html",
    "learning/class-10-science.html",
    "learning/gk-quiz.html"
]

def build_schema_json(cfg):
    url = cfg["canonical"]
    name = cfg["title"].split(" | ")[0].split(" - ")[0].strip()
    
    schema_items = []
    
    # Breadcrumbs
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
            "name": "HarshGuruJi",
            "url": f"{SITE_ORIGIN}/"
        }
    }
    schema_items.append(webpage_schema)

    # For homepage, add WebSite search action
    if url in (f"{SITE_ORIGIN}/", f"{SITE_ORIGIN}/index.html"):
        website_schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "HarshGuruJi",
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

def build_head_seo_block(rel_path, cfg):
    asset_prefix = cfg.get("asset_prefix", "")
    icon_href = f"{asset_prefix}logo.png"
    robots_rule = cfg.get("robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1")
    
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
        '  <meta property="og:site_name" content="HarshGuruJi">',
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

def process_public_file(filepath, cfg):
    if not os.path.exists(filepath):
        print(f"Skipping missing file: {filepath}")
        return
        
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Look for </head>
    head_match = re.search(r'(<head[^>]*>)(.*?)(</head>)', content, re.IGNORECASE | re.DOTALL)
    if not head_match:
        print(f"Could not find <head> in {filepath}")
        return

    head_open = head_match.group(1)
    head_content = head_match.group(2)
    head_close = head_match.group(3)

    # Clean existing SEO meta tags to avoid any duplication
    cleaned_head = head_content
    # Remove existing <title>
    cleaned_head = re.sub(r'<title[^>]*>.*?</title>', '', cleaned_head, flags=re.IGNORECASE | re.DOTALL)
    # Remove existing meta description, keywords, author, robots
    cleaned_head = re.sub(r'<meta[^>]+(?:name=["\'](?:description|keywords|author|robots)["\'][^>]*|content=["\'][^"\']*["\'][^>]*name=["\'](?:description|keywords|author|robots)["\'])[^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    # Remove existing canonical link
    cleaned_head = re.sub(r'<link[^>]+rel=["\']canonical["\'][^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    # Remove existing icons
    cleaned_head = re.sub(r'<link[^>]+(?:rel=["\'](?:icon|shortcut icon|apple-touch-icon)["\'])[^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    # Remove existing og / twitter meta tags
    cleaned_head = re.sub(r'<meta[^>]+(?:property|name)=["\'](?:og:[^"\']+|twitter:[^"\']+)["\'][^>]*>', '', cleaned_head, flags=re.IGNORECASE)
    # Remove existing schema ld+json
    cleaned_head = re.sub(r'<script\s+type=["\']application/ld\+json["\'][^>]*>.*?</script>', '', cleaned_head, flags=re.IGNORECASE | re.DOTALL)
    # Remove old SEO comment banners
    cleaned_head = re.sub(r'<!--\s*(?:Open Graph|Twitter Card|Schema\.org|Facebook)[^>]*-->', '', cleaned_head, flags=re.IGNORECASE)

    # Clean multiple consecutive blank lines
    cleaned_head = re.sub(r'\n\s*\n\s*\n+', '\n\n', cleaned_head)

    # Generate new SEO block
    new_seo = build_head_seo_block(filepath, cfg)

    # Assemble new head: put new SEO right after charset and viewport if present, or at top of head
    # Check if charset/viewport exist in head
    meta_charset = re.search(r'<meta[^>]+charset=[^>]+>', cleaned_head, re.IGNORECASE)
    meta_viewport = re.search(r'<meta[^>]+name=["\']viewport["\'][^>]+>', cleaned_head, re.IGNORECASE)

    # Keep charset & viewport at the very beginning
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
    print(f"Successfully updated SEO for: {filepath}")

def process_noindex_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    head_match = re.search(r'(<head[^>]*>)(.*?)(</head>)', content, re.IGNORECASE | re.DOTALL)
    if not head_match:
        return

    head_open = head_match.group(1)
    head_content = head_match.group(2)
    head_close = head_match.group(3)

    # Check if robots tag exists
    cleaned = re.sub(r'<meta[^>]+(?:name=["\']robots["\'][^>]*|content=["\'][^"\']*["\'][^>]*name=["\']robots["\'])[^>]*>', '', head_content, flags=re.IGNORECASE)
    robots_tag = '\n  <meta name="robots" content="noindex, nofollow">'
    new_head_content = robots_tag + cleaned
    new_full_content = content[:head_match.start()] + head_open + new_head_content + head_close + content[head_match.end():]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_full_content)
    print(f"Added noindex to: {filepath}")

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    os.chdir(base_dir)

    print("Updating public pages with search result metadata...")
    for rel_path, cfg in PAGES_CONFIG.items():
        process_public_file(rel_path, cfg)

    print("\nSecuring private & admin pages with noindex...")
    for rel_path in NOINDEX_PAGES:
        process_noindex_file(rel_path)

if __name__ == "__main__":
    main()
