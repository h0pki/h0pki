(function(){
    var D = document;

    // Нормализация текста (удаление лишних пробелов и объединение І/I)
    function norm(str) {
        if (!str) return "";
        return str
            .replace(/[\u00A0\s]+/g, ' ')
            .trim()
            .toLowerCase()
            .replace(/[іi]/g, 'i');
    }

    // === 1. УПРАВЛЕНИЕ ЯЗЫКОМ И КНОПКА С ФЛАГАМИ ===
    function getLang() { 
        return localStorage.getItem('site_lang') || 'be'; 
    }
    
    function setLang(lang) { 
        localStorage.setItem('site_lang', lang); 
        location.reload(); 
    }

    function renderLangSwitcher() {
        var existing = D.getElementById('lang-switcher');
        if (existing) {
            if (!existing.querySelector('.lang-btn')) {
                existing.remove();
            } else {
                return;
            }
        }

        var currentLang = getLang();

        if (!D.getElementById('lang-switcher-styles')) {
            D.head.insertAdjacentHTML('beforeend', `
                <style id="lang-switcher-styles">
                    #lang-switcher {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 999999;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        padding: 6px 14px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                        font-size: 13px;
                        font-weight: 700;
                        color: #333;
                        box-shadow: 0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08);
                        user-select: none;
                        transition: all 0.2s ease;
                    }
                    .lang-btn {
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        padding-bottom: 3px;
                        border-bottom: 2px solid transparent;
                        color: #666;
                        transition: all 0.2s ease;
                    }
                    .lang-btn.active {
                        color: #0d5c8a;
                        border-bottom-color: #0d5c8a;
                    }
                    .lang-btn:hover {
                        color: #111;
                    }
                    .lang-divider {
                        color: #ccc;
                        font-weight: 300;
                    }
                    @media (max-width: 768px) {
                        #lang-switcher {
                            bottom: 12px;
                            right: 12px;
                            padding: 5px 10px;
                            font-size: 12px;
                            gap: 8px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                        }
                        .lang-btn {
                            gap: 4px;
                        }
                    }
                </style>
            `);
        }

        var box = D.createElement('div');
        box.id = 'lang-switcher';

        var bcbFlag = '<svg width="18" height="12" viewBox="0 0 18 12" style="border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,0.15);"><rect width="18" height="12" fill="#FFFFFF"/><rect y="4" width="18" height="4" fill="#D62626"/></svg>';
        var ukFlag = '<svg width="18" height="12" viewBox="0 0 60 30" style="border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,0.15);"><clipPath id="gb_clip"><path d="M0,0 v30 h60 v-30 z"/></clipPath><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4" clip-path="url(#gb_clip)"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></svg>';

        box.innerHTML = `
            <div id="btn-be" class="lang-btn ${currentLang==='be'?'active':''}">
                ${bcbFlag}
                <span>БЕЛ</span>
            </div>
            <span class="lang-divider">|</span>
            <div id="btn-en" class="lang-btn ${currentLang==='en'?'active':''}">
                ${ukFlag}
                <span>ENG</span>
            </div>
        `;
        D.body.appendChild(box);

        D.getElementById('btn-be').onclick = function(){ setLang('be'); };
        D.getElementById('btn-en').onclick = function(){ setLang('en'); };
    }

    // === 2. СЛОВАРИ ===
    var BE2EN_RAW = {
        "галоўная": "HOME",
        "навіны": "NEWS",
        "слухаць": "LISTEN",
        "відэа": "VIDEO",
        "артыкулы": "ARTICLES",
        "кантакт": "CONTACT",
        "падкаст": "PODCAST",
        "падкасты": "PODCASTS",
        "музыка": "MUSIC",
        "musics": "MUSIC",
        "каманда": "TEAM",
        "плэйлісты": "PLAYLISTS",
        "галерэя": "GALLERY",
        "апошнія навіны": "LATEST NEWS",
        "апошнія падкасты": "LATEST PODCASTS",
        "нашы сацсеткі": "OUR SOCIALS",
        "звяжыцеся з намі!": "CONTACT US!",
        "звяжыцеся з намі": "CONTACT US",
        "вядоўцы": "HOSTS",
        "кіраўніцтва": "MANAGEMENT",
        "беларуская палітыка": "BELARUSIAN POLITICS",
        "беларусь-смаленск": "BELARUS-SMOLENSK",
        "беларусь": "BELARUS",
        "польшча": "POLAND",
        "расія": "RUSSIA",
        "смаленск": "SMOLENSK",
        "украіна": "UKRAINE",
        "больш": "MORE",
        "увайсці": "LOG IN",
        "уваход": "LOG IN",
        "імя *": "FIRST NAME *",
        "імя": "FIRST NAME",
        "тэлефон": "PHONE NUMBER",
        "сайт": "WEBSITE",
        "тэма *": "SUBJECT *",
        "тэма": "SUBJECT",
        "паведамленне *": "MESSAGE *",
        "паведамленне": "MESSAGE",
        "увядзіце сімвалы з малюнка": "PLEASE COPY THE FOLLOWING LETTERS",
        "адправіць паведамленне": "SEND MESSAGE",
        "адправіць": "SEND"
    };

    var EN2BE_RAW = {
        "log in": "УВАЙСЦІ",
        "login": "УВАЙСЦІ",
        "log in!": "УВАЙСЦІ!",
        "home": "ГАЛОЎНАЯ",
        "news": "НАВІНЫ",
        "listen": "СЛУХАЦЬ",
        "video": "ВІДЭА",
        "articles": "АРТЫКУЛЫ",
        "contact": "КАНТАКТ",
        "podcast": "ПАДКАСТ",
        "podcasts": "ПАДКАСТЫ",
        "music": "МУЗЫКА",
        "musics": "МУЗЫКА",
        "team": "КАМАНДА",
        "playlists": "ПЛЭЙЛІСТЫ",
        "gallery": "ГАЛЕРЭЯ",
        "latest news": "АПОШНІЯ НАВІНЫ",
        "latest podcasts": "АПОШНІЯ ПАДКАСТЫ",
        "our socials": "НАШЫ САЦСЕТКІ",
        "contact us!": "ЗВЯЖЫЦЕСЯ З НАМІ!",
        "contact us": "ЗВЯЖЫЦЕСЯ З НАМІ",
        "hosts": "ВЯДОЎЦЫ",
        "management": "КІРАЎНІЦТВА",
        "belarusian politics": "БЕЛАРУСКАЯ ПАЛІТЫКА",
        "belarus-smolensk": "БЕЛАРУСЬ-СМАЛЕНСК",
        "belarus": "БЕЛАРУСЬ",
        "poland": "ПОЛЬШЧА",
        "russia": "РАСІЯ",
        "smolensk": "СМАЛЕНСК",
        "ukraine": "УКРАІНА",
        "more": "БОЛЬШ",
        "first name *": "ІМЯ *",
        "first name": "ІМЯ",
        "phone number": "ТЭЛЕФОН",
        "website": "САЙТ",
        "subject *": "ТЭМА *",
        "subject": "ТЭМА",
        "message *": "ПАВЕДАМЛЕННЕ *",
        "message": "ПАВЕДАМЛЕННЕ",
        "please copy the following letters": "УВЯДЗІЦЕ СІМВАЛЫ З МАЛЮНКА",
        "send message": "АДПРАВІЦЬ ПАВЕДАМЛЕННЕ",
        "send": "АДПРАВІЦЬ",
        "loading...": "ЗАГРУЖАЕЦЦА...",
        "loading..": "ЗАГРУЖАЕЦЦА..",
        "loading": "ЗАГРУЖАЕЦЦА"
    };

    var BE2EN = {}, EN2BE = {};
    for (var k in BE2EN_RAW) { BE2EN[norm(k)] = BE2EN_RAW[k]; }
    for (var k in EN2BE_RAW) { EN2BE[norm(k)] = EN2BE_RAW[k]; }

    function translateDates(text) {
        return text
            .replace(/(\d+)\s+days?\s+ago/gi, function(_, num){ return num == 1 ? '1 ДЗЕНЬ ТАМУ' : num + ' ДЗЁН ТАМУ'; })
            .replace(/(\d+)\s+weeks?\s+ago/gi, function(_, num){ return num == 1 ? '1 ТЫДЗЕНЬ ТАМУ' : num + ' ТЫДНЯЎ ТАМУ'; })
            .replace(/(\d+)\s+months?\s+ago
