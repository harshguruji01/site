// Procedural Question Database Generator for Quiz India
window.questionDb = [];

// Helper to shuffle options and track correct index
function createQuestion(subject, qEn, qHi, correctEn, correctHi, wrongAnswersEn, wrongAnswersHi, expEn, expHi, difficulty) {
    const optionsEn = [correctEn, ...wrongAnswersEn];
    const optionsHi = [correctHi, ...wrongAnswersHi];
    
    // Create array of indices to shuffle
    let indices = [0, 1, 2, 3];
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Apply shuffle
    const shuffledEn = indices.map(i => optionsEn[i]);
    const shuffledHi = indices.map(i => optionsHi[i]);
    
    // Find new correct index
    const correctIndex = indices.indexOf(0);

    return {
        id: subject + '_' + Math.random().toString(36).substr(2, 9),
        subject: subject,
        difficulty: difficulty,
        question: { en: qEn, hi: qHi },
        options: { en: shuffledEn, hi: shuffledHi },
        correctAnswer: correctIndex,
        explanation: { en: expEn, hi: expHi }
    };
}

// ----------------------------------------------------
// GENERATOR: Mathematics (200+ questions)
// ----------------------------------------------------
function generateMathQuestions(count) {
    for (let i = 0; i < count; i++) {
        const type = Math.floor(Math.random() * 4);
        let qEn, qHi, ans, wrong1, wrong2, wrong3, expEn, expHi, diff;
        
        if (type === 0) {
            // Multiplication
            let a = Math.floor(Math.random() * 20) + 11;
            let b = Math.floor(Math.random() * 15) + 5;
            ans = a * b;
            qEn = `What is ${a} × ${b}?`;
            qHi = `${a} × ${b} का मान क्या होगा?`;
            wrong1 = ans + (Math.floor(Math.random() * 10) + 1);
            wrong2 = ans - (Math.floor(Math.random() * 10) + 1);
            wrong3 = ans + 10;
            expEn = `Simple multiplication: ${a} × ${b} = ${ans}`;
            expHi = `सरल गुणा: ${a} × ${b} = ${ans}`;
            diff = 'easy';
        } else if (type === 1) {
            // Algebra
            let x = Math.floor(Math.random() * 10) + 2;
            let c = Math.floor(Math.random() * 20) + 5;
            let res = x * c;
            ans = c;
            qEn = `Solve for x: ${x}x = ${res}`;
            qHi = `x का मान ज्ञात करें: ${x}x = ${res}`;
            wrong1 = ans + 1; wrong2 = ans - 1; wrong3 = ans * 2;
            expEn = `Divide both sides by ${x}. Therefore x = ${ans}.`;
            expHi = `दोनों पक्षों को ${x} से विभाजित करें। इसलिए x = ${ans}.`;
            diff = 'medium';
        } else if (type === 2) {
            // Geometry (Area of rectangle)
            let w = Math.floor(Math.random() * 15) + 5;
            let h = Math.floor(Math.random() * 15) + 5;
            ans = w * h;
            qEn = `Find the area of a rectangle with width ${w} and height ${h}.`;
            qHi = `चौड़ाई ${w} और ऊंचाई ${h} वाले आयत का क्षेत्रफल ज्ञात करें।`;
            wrong1 = ans + 2; wrong2 = w * h + w; wrong3 = ans - h;
            expEn = `Area = width × height = ${w} × ${h} = ${ans}.`;
            expHi = `क्षेत्रफल = चौड़ाई × ऊंचाई = ${w} × ${h} = ${ans}.`;
            diff = 'medium';
        } else {
            // Percentages
            let base = (Math.floor(Math.random() * 10) + 1) * 50; // 50 to 500
            let pct = (Math.floor(Math.random() * 9) + 1) * 10; // 10% to 90%
            ans = (base * pct) / 100;
            qEn = `What is ${pct}% of ${base}?`;
            qHi = `${base} का ${pct}% क्या होगा?`;
            wrong1 = ans + 10; wrong2 = ans - 5; wrong3 = ans * 2;
            expEn = `${pct}% of ${base} is calculated as (${pct}/100) × ${base} = ${ans}.`;
            expHi = `${base} का ${pct}% (${pct}/100) × ${base} = ${ans} होता है।`;
            diff = 'hard';
        }

        window.questionDb.push(createQuestion('math', qEn, qHi, 
            ans.toString(), ans.toString(), 
            [wrong1.toString(), wrong2.toString(), wrong3.toString()], 
            [wrong1.toString(), wrong2.toString(), wrong3.toString()], 
            expEn, expHi, diff
        ));
    }
}

// ----------------------------------------------------
// GENERATOR: Computers (200+ questions)
// ----------------------------------------------------
function generateCompQuestions(count) {
    const memoryBases = [2, 4, 8, 16, 32, 64, 128, 256, 512];
    const shortcuts = [
        {k: "Ctrl+C", a: "Copy", h: "कॉपी (Copy)", w: ["Paste", "Cut", "Undo"], wh: ["पेस्ट", "कट", "अनडू"]},
        {k: "Ctrl+V", a: "Paste", h: "पेस्ट (Paste)", w: ["Copy", "Save", "Print"], wh: ["कॉपी", "सेव", "प्रिंट"]},
        {k: "Ctrl+Z", a: "Undo", h: "अनडू (Undo)", w: ["Redo", "Select All", "Delete"], wh: ["रीडू", "सेलेक्ट ऑल", "डिलीट"]},
        {k: "Ctrl+S", a: "Save", h: "सेव (Save)", w: ["Search", "Send", "Select"], wh: ["सर्च", "सेंड", "सेलेक्ट"]}
    ];

    for (let i = 0; i < count; i++) {
        const type = Math.floor(Math.random() * 2);
        if (type === 0) {
            // Memory conversions
            let gb = memoryBases[Math.floor(Math.random() * memoryBases.length)];
            let mb = gb * 1024;
            window.questionDb.push(createQuestion('comp', 
                `How many Megabytes (MB) are in ${gb} Gigabytes (GB)?`,
                `${gb} गीगाबाइट (GB) में कितने मेगाबाइट (MB) होते हैं?`,
                mb.toString() + " MB", mb.toString() + " MB",
                [(mb+1024).toString() + " MB", (gb*1000).toString() + " MB", (mb-1024).toString() + " MB"],
                [(mb+1024).toString() + " MB", (gb*1000).toString() + " MB", (mb-1024).toString() + " MB"],
                `1 GB = 1024 MB. So, ${gb} GB = ${gb} × 1024 = ${mb} MB.`,
                `1 GB = 1024 MB. इसलिए, ${gb} GB = ${gb} × 1024 = ${mb} MB.`,
                'medium'
            ));
        } else {
            // Shortcuts
            let sc = shortcuts[Math.floor(Math.random() * shortcuts.length)];
            window.questionDb.push(createQuestion('comp',
                `In Windows, what does the shortcut '${sc.k}' do?`,
                `विंडोज़ में, शॉर्टकट '${sc.k}' का क्या उपयोग है?`,
                sc.a, sc.h,
                sc.w, sc.wh,
                `${sc.k} is the universal shortcut for ${sc.a}.`,
                `${sc.k} ${sc.h} के लिए यूनिवर्सल शॉर्टकट है।`,
                'easy'
            ));
        }
    }
}

// ----------------------------------------------------
// GENERATOR: Science (200+ questions)
// ----------------------------------------------------
function generateScienceQuestions(count) {
    const elements = [
        {name: "Oxygen", sym: "O", num: 8, h: "ऑक्सीजन"},
        {name: "Carbon", sym: "C", num: 6, h: "कार्बन"},
        {name: "Gold", sym: "Au", num: 79, h: "सोना"},
        {name: "Iron", sym: "Fe", num: 26, h: "लोहा"},
        {name: "Helium", sym: "He", num: 2, h: "हीलियम"},
        {name: "Sodium", sym: "Na", num: 11, h: "सोडियम"}
    ];

    for (let i = 0; i < count; i++) {
        const type = Math.floor(Math.random() * 2);
        if (type === 0) {
            let el = elements[Math.floor(Math.random() * elements.length)];
            let wrongSymbols = ["X", "Ag", "Pb", "K", "N", "Cl"].sort(() => 0.5 - Math.random()).slice(0,3);
            window.questionDb.push(createQuestion('sci',
                `What is the chemical symbol for ${el.name}?`,
                `${el.h} का रासायनिक प्रतीक क्या है?`,
                el.sym, el.sym,
                wrongSymbols, wrongSymbols,
                `The chemical symbol for ${el.name} is ${el.sym}.`,
                `${el.h} का रासायनिक प्रतीक ${el.sym} है।`,
                'easy'
            ));
        } else {
            let el = elements[Math.floor(Math.random() * elements.length)];
            let wrongNums = [el.num+1, el.num-1, el.num+2].map(n => Math.abs(n).toString());
            window.questionDb.push(createQuestion('sci',
                `What is the atomic number of ${el.name}?`,
                `${el.h} की परमाणु संख्या क्या है?`,
                el.num.toString(), el.num.toString(),
                wrongNums, wrongNums,
                `The atomic number of ${el.name} is ${el.num}.`,
                `${el.h} की परमाणु संख्या ${el.num} है।`,
                'medium'
            ));
        }
    }
}

// ----------------------------------------------------
// GENERATOR: GK & SST & Lang (Templated randoms)
// ----------------------------------------------------
function generateTemplated(subject, templates, count) {
    for (let i = 0; i < count; i++) {
        let tmpl = templates[Math.floor(Math.random() * templates.length)];
        
        // Randomize wrong answers dynamically by swapping with other templates if needed
        let otherTmpls = templates.filter(t => t.c_en !== tmpl.c_en).sort(() => 0.5 - Math.random());
        let w_en = [otherTmpls[0].c_en, otherTmpls[1].c_en, otherTmpls[2].c_en];
        let w_hi = [otherTmpls[0].c_hi, otherTmpls[1].c_hi, otherTmpls[2].c_hi];
        
        window.questionDb.push(createQuestion(subject,
            tmpl.q_en, tmpl.q_hi,
            tmpl.c_en, tmpl.c_hi,
            w_en, w_hi,
            tmpl.exp_en, tmpl.exp_hi,
            'medium'
        ));
    }
}

const gkTemplates = [
    {q_en:"Which is the largest continent?", q_hi:"सबसे बड़ा महाद्वीप कौन सा है?", c_en:"Asia", c_hi:"एशिया", exp_en:"Asia is the largest.", exp_hi:"एशिया सबसे बड़ा है।"},
    {q_en:"Who is known as the Father of the Nation in India?", q_hi:"भारत में राष्ट्रपिता के रूप में किसे जाना जाता है?", c_en:"Mahatma Gandhi", c_hi:"महात्मा गांधी", exp_en:"Mahatma Gandhi led the independence movement.", exp_hi:"महात्मा गांधी ने स्वतंत्रता आंदोलन का नेतृत्व किया।"},
    {q_en:"Which planet is known as the Red Planet?", q_hi:"किस ग्रह को लाल ग्रह कहा जाता है?", c_en:"Mars", c_hi:"मंगल", exp_en:"Mars appears red due to iron oxide.", exp_hi:"आयरन ऑक्साइड के कारण मंगल लाल दिखाई देता है।"},
    {q_en:"What is the capital of India?", q_hi:"भारत की राजधानी क्या है?", c_en:"New Delhi", c_hi:"नई दिल्ली", exp_en:"New Delhi is the capital.", exp_hi:"नई दिल्ली राजधानी है।"}
];

const sstTemplates = [
    {q_en:"In which year did India gain independence?", q_hi:"भारत को स्वतंत्रता किस वर्ष मिली?", c_en:"1947", c_hi:"1947", exp_en:"India gained independence in 1947.", exp_hi:"भारत ने 1947 में स्वतंत्रता प्राप्त की।"},
    {q_en:"Who was the first Prime Minister of India?", q_hi:"भारत के पहले प्रधान मंत्री कौन थे?", c_en:"Jawaharlal Nehru", c_hi:"जवाहरलाल नेहरू", exp_en:"Nehru was the first PM.", exp_hi:"नेहरू पहले पीएम थे।"},
    {q_en:"What is the longest river in the world?", q_hi:"विश्व की सबसे लंबी नदी कौन सी है?", c_en:"Nile", c_hi:"नील", exp_en:"The Nile is traditionally considered the longest.", exp_hi:"नील नदी को परंपरागत रूप से सबसे लंबा माना जाता है।"},
    {q_en:"Which ocean is the largest?", q_hi:"सबसे बड़ा महासागर कौन सा है?", c_en:"Pacific Ocean", c_hi:"प्रशांत महासागर", exp_en:"The Pacific is the largest ocean.", exp_hi:"प्रशांत सबसे बड़ा महासागर है।"}
];

const langTemplates = [
    {q_en:"Which is a synonym for 'Happy'?", q_hi:"'Happy' का पर्यायवाची क्या है?", c_en:"Joyful", c_hi:"Joyful", exp_en:"Joyful means feeling happiness.", exp_hi:"Joyful का अर्थ खुशी महसूस करना है।"},
    {q_en:"What is the antonym of 'Brave'?", q_hi:"'Brave' का विलोम क्या है?", c_en:"Cowardly", c_hi:"Cowardly", exp_en:"Cowardly is the opposite of brave.", exp_hi:"Cowardly बहादुर का विलोम है।"},
    {q_en:"Identify the noun in: 'The quick dog'.", q_hi:"'The quick dog' में संज्ञा की पहचान करें।", c_en:"dog", c_hi:"dog", exp_en:"Dog is a naming word.", exp_hi:"Dog एक नामकरण शब्द है।"},
    {q_en:"Translate 'Water' to Hindi.", q_hi:"'Water' का हिंदी अनुवाद करें।", c_en:"पानी", c_hi:"पानी", exp_en:"Water means Pani in Hindi.", exp_hi:"Water का अर्थ हिंदी में पानी होता है।"}
];

// Initialize the massive database (200+ per subject = 1200+ total)
generateMathQuestions(210);
generateCompQuestions(210);
generateScienceQuestions(210);
generateTemplated('gk', gkTemplates, 210);
generateTemplated('sst', sstTemplates, 210);
generateTemplated('lang', langTemplates, 210);

// Global Accessors for the Quiz Engine
window.getRandomQuestions = function(count, subject = null) {
    let pool = window.questionDb;
    if (subject) {
        pool = pool.filter(q => q.subject === subject);
    }
    
    // Fisher-Yates shuffle the pool
    let shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
};

window.getDailyChallengeQuestions = function() {
    // Deterministic random based on date
    const today = new Date().toDateString();
    let seed = 0;
    for(let i=0; i<today.length; i++) seed += today.charCodeAt(i);
    
    let pool = [...window.questionDb];
    // Simple seeded shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        seed = (seed * 9301 + 49297) % 233280;
        const j = Math.floor((seed / 233280) * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    return pool.slice(0, 10);
};

console.log(`Database Initialized with ${window.questionDb.length} questions.`);