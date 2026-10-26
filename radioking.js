(function(){
    var D = document;

    // === 1. УПРАВЛЕНИЕ ЯЗЫКОМ ===
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
        var box = D.createElement('div');
        box.id = 'lang-switcher';
        box.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;background:rgba(0,0,0,0.85);padding:7px 14px;border-radius:20px;display:flex;gap:8px;font-family:sans-serif;font-size:13px;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.4);user-select:none;';
        box.innerHTML = `
            <span id="btn-be" style="cursor:pointer;font-weight:${currentLang==='be'?'bold':'normal'};color:${currentLang==='be'?'#24A1DE':'#ccc'}">BE</span>
            <span style="color:#555">|</span>
            <span id="btn-en" style="cursor:pointer;font-weight:${currentLang==='en'?'bold':'normal'};color:${currentLang==='en'?'#24A1DE':'#ccc'}">EN</span>
        `;
        D.body.appendChild(box);
        D.getElementById('btn-be').onclick = function(){ setLang('be'); };
        D.getElementById('btn-en').onclick = function(){ setLang('en'); };
    }

    // === 2. СЛОВАРИ ТОЧНЫХ СОВПАДЕНИЙ ===
    
    // Белорусский -> Английский (для режима EN)
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

    // Английский -> Белорусский (для режима BE)
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

        // Прямая подмена текста элементов (шапка, меню, категории, кнопки)
        var elements = D.querySelectorAll('a, button, label, h1, h2, h3, h4, .title, .widget-title, span, div');
        elements.forEach(function(el){
            if (['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(el.tagName)) return;
            
            // Если внутри элемента нет других вложенных тегов, проверяем его текст
            if (el.children.length === 0 && el.textContent) {
                var cleanTxt = el.textContent.trim().toLowerCase();
                if (map[cleanTxt]) {
                    el.textContent = map[cleanTxt];
                }
            }
        });

        // Подмена инпутов и полей ввода
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

        // Дополнительный проход по текстовым узлам
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

    // Запуск проверки каждые 500 мс (без нагрузки на ЦП)
    setInterval(function(){
        if(!D.body) return;
        renderLangSwitcher();
        runTranslation();
        fixMenuOnce();
        fixSocialsAndFooter();
    }, 1000);

})();
