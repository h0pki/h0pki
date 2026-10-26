(function(){
    var D = document;

    // === 1. УПРАВЛЕНИЕ ЯЗЫКОМ И СТИЛЬНАЯ КНОПКА C ФЛАГАМИ ===
    function getLang() { 
        return localStorage.getItem('site_lang') || 'be'; 
    }
    
    function setLang(lang) { 
        localStorage.setItem('site_lang', lang); 
        location.reload(); 
    }

    function renderLangSwitcher() {
        if (D.getElementById('lang-switcher')) return;
        var currentLang = getLang();

        // Добавляем адаптивные стили в head
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
                    /* Адаптив под мобильные устройства */
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

        // SVG Флаг БЧБ (Бело-красно-белый)
        var bcbFlag = '<svg width="18" height="12" viewBox="0 0 18 12" style="border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,0.15);"><rect width="18" height="12" fill="#FFFFFF"/><rect y="4" width="18" height="4" fill="#D62626"/></svg>';
        
        // SVG Флаг Великобритании (Union Jack)
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

    // === 2. СЛОВАРИ ТОЧНЫХ СОВПАДЕНИЙ ===
    var BE2EN = {
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

    var EN2BE = {
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

    // === 3. ПРЯМАЯ ЗАМЕНА ЭЛЕМЕНТОВ И ТЕКСТА ===
    function runTranslation() {
        var lang = getLang();
        var map = (lang === 'en') ? BE2EN : EN2BE;

        var elements = D.querySelectorAll('a, button, label, h1, h2, h3, h4, .title, .widget-title, span, div');
        elements.forEach(function(el){
            if (['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(el.tagName)) return;
            if (el.children.length === 0 && el.textContent) {
                var cleanTxt = el.textContent.trim().toLowerCase();
                if (map[cleanTxt]) {
                    el.textContent = map[cleanTxt];
                }
            }
        });

        D.querySelectorAll('input, textarea').forEach(function(el){
            if (el.placeholder) {
                var p = el.placeholder.trim().toLowerCase();
                if (map[p]) el.placeholder = map[p];
            }
            if (el.tagName === 'INPUT' && el.value && typeof el.value === 'string') {
                var v = el.value.trim().toLowerCase();
                if (map[v]) el.value = map[v];
            }
        });

        var w = D.createTreeWalker(D.body, 4, null, 0), n;
        while (n = w.nextNode()) {
            if (n.parentNode && ['SCRIPT','STYLE','TEXTAREA','INPUT'].includes(n.parentNode.tagName)) continue;
            var val = n.nodeValue;
            if (!val || !val.trim()) continue;
            var trimmedLower = val.trim().toLowerCase();
            if (map[trimmedLower]) {
                n.nodeValue = map[trimmedLower];
            }
        }
    }

    // === 4. ФИКС МЕНЮ И СОЦСЕТЕЙ ===
    function isMobile(){ return window.innerWidth <= 1024; }

    function fixMenuOnce(){
        var isMob = isMobile();
        D.querySelectorAll('a.sf-with-ul').forEach(function(link){
            if(link.getAttribute('data-pc-fixed')) return;
            var txt = (link.textContent||"").toLowerCase().trim();
            if(!txt.includes('слухаць') && !txt.includes('кантакт') && !txt.includes('listen') && !txt.includes('contact')) return;
            link.setAttribute('data-pc-fixed','1');
            if(!isMob){
                link.addEventListener('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }, true);
            }
        });
    }

    function fixSocialsAndFooter(){
        D.querySelectorAll('a[href*="twitter"],a[href*="t.me"]').forEach(function(l){
            var p = l.closest('.link-socials-item');
            if(!p) return;
            p.className = 'link-socials-item tc';
            l.href = "https://t.me/BelSmol";
            if(!l.querySelector('svg')){
                l.style = "";
                p.style = "";
                l.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" style="width:1em;height:1em;vertical-align:middle"><path d="M21.54 2.1l-20.6 7.95c-.8.3-.79.77.14 1.05l5.44 1.74 12.35-7.79c.58-.37 1.12-.17.68.22l-11 9.8v.02l.02.01-.02-.01v4.43c0 .64.35.79.73.4l2.13-2.07 4.44 3.28c.81.45 1.4.22 1.6-.75l2.9-13.65c.27-1.08-.38-1.57-1.12-1.25z"/></svg>';
            }
            var p2 = p.querySelector('.link-socials-item-popup');
            if(p2 && p2.textContent.toLowerCase().includes('twitter')) p2.textContent = 'Telegram';
        });

        D.querySelectorAll('div,footer,p').forEach(function(d){
            if(d.textContent.includes('RadioKing') && d.offsetHeight < 99) d.style.display = 'none';
        });
    }

    // === 5. СТИЛИ И ИНИЦИАЛИЗАЦИЯ ===
    if(!D.getElementById('tc')) {
        D.head.insertAdjacentHTML('beforeend','<style id="tc">.tc::before,.tc a::before{display:none!important}.tc{position:relative!important;overflow:hidden!important;background:0 0!important}.tc a{position:relative;z-index:2;transition:color .3s}.tc::after{content:"";position:absolute;top:-100%;left:0;width:100%;height:100%;background:#24A1DE;transition:top .25s;z-index:1}.tc:hover::after{top:0}.tc:hover a{color:#fff!important}</style>');
    }

    setInterval(function(){
        if(!D.body) return;
        renderLangSwitcher();
        runTranslation();
        fixMenuOnce();
        fixSocialsAndFooter();
    }, 500);

})();
