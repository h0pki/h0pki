(function(){
    var D = document, 
        Q = s => D.querySelectorAll(s), 
        M_EN2BE = [],
        M_BE2EN = [];

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
        
        D.getElementById('btn-be').onclick = () => setLang('be');
        D.getElementById('btn-en').onclick = () => setLang('en');
    }

    // === 2. ПОИСК С УЧЕТОМ UNICODE-РЕГИСТРА И БУКВ І/I ===
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function makeRegex(text) {
        var pattern = escapeRegExp(text).replace(/[ІіIi]/g, '[ІіIi]');
        return new RegExp(pattern, 'giu');
    }

    // === 3. СЛОВАРИ ===

    // А) EN -> BE (Для белорусской версии)
    var en2be_pairs = [
        // Формы и кнопки
        ["SEND MESSAGE", "АДПРАВІЦЬ ПАВЕДАМЛЕННЕ"],
        ["Send message", "Адправіць паведамленне"],
        ["FIRST NAME *", "ІМЯ *"],
        ["First name *", "Імя *"],
        ["First Name *", "Імя *"],
        ["FIRST NAME", "ІМЯ"],
        ["First name", "Імя"],
        ["First Name", "Імя"],
        ["PHONE NUMBER", "ТЭЛЕФОН"],
        ["Phone number", "Тэлефон"],
        ["Phone Number", "Тэлефон"],
        ["WEBSITE", "САЙТ"],
        ["Website", "Сайт"],
        ["SUBJECT *", "ТЭМА *"],
        ["Subject *", "Тэма *"],
        ["SUBJECT", "ТЭМА"],
        ["Subject", "Тэма"],
        ["MESSAGE *", "ПАВЕДАМЛЕННЕ *"],
        ["Message *", "Паведамленне *"],
        ["MESSAGE", "ПАВЕДАМЛЕННЕ"],
        ["Message", "Паведамленне"],
        ["PLEASE COPY THE FOLLOWING LETTERS", "УВЯДЗІЦЕ СІМВАЛЫ З MAЛЮНКА"],
        ["Please copy the following letters", "Увядзіце сімвалы з малюнка"],
        ["SEND", "АДПРАВІЦЬ"],
        ["Send", "Адправіць"],
        ["CONTACT US!", "ЗВЯЖЫЦЕСЯ З НАМІ!"],
        ["Contact us!", "Звяжыцеся з намі!"],
        ["CONTACT US", "ЗВЯЖЫЦЕСЯ З НАМІ"],
        ["Contact us", "Звяжыцеся з намі"],

        // Системные элементы
        ["MORE", "БОЛЬШ"],
        ["More", "БОЛЬШ"],
        ["more", "БОЛЬШ"],
        ["LOADING...", "ЗАГРУЖАЕЦЦА..."],
        ["Loading...", "Загружаецца..."],
        ["Loading..", "Загружаецца.."],
        ["Loading.", "Загружаецца."],
        ["Loading", "Загружаецца"],
        ["LISTEN PODCAST", "СЛУХАЦЬ ПАДКАСТ"],
        ["Listen podcast", "Слухаць падкаст"],
        ["DOWNLOAD PODCAST", "СПАМАВАЦЬ ПАДКАСТ"],
        ["Download podcast", "Спампаваць падкаст"],
        ["COMMENT", "КАМЕНТАВАЦЬ"],
        ["Comment", "Каментаваць"],
        ["COMMENTS", "КАМЕНТАРЫ"],
        ["comments", "Каментары"],
        ["LOG IN", "УВАЙСЦІ"],
        ["log in", "Увайсці"],
        ["CREATE ACCOUNT", "СТВАРЫЦЬ АКАЎНТ"],
        ["create account", "Стварыць акаўнт"],
        ["SEE ALSO", "ГЛЯДЗІЦЕ ТАКСАМА"],
        ["See also", "Глядзіце таксама"],
        ["VIEWS", "ПРАГЛЯДАЎ"],
        ["views", "праглядаў"],

        // Даты
        ["January", "студзеня"], ["February", "лютага"], ["March", "сакавіка"], ["April", "красавіка"],
        ["May", "траўня"], ["June", "чэрвеня"], ["July", "ліпеня"], ["August", "жніўня"],
        ["September", "верасня"], ["October", "кастрычніка"], ["November", "лістапада"], ["December", "снежня"],
        ["hours ago", "ГАДЗІН ТАМУ"], ["hour ago", "ГАДЗІНУ ТАМУ"], ["minutes ago", "ХВІЛІН ТАМУ"],
        ["minute ago", "ХВІЛІНУ ТАМУ"], ["days ago", "ДЗЁН ТАМУ"], ["day ago", "ДЗЕНЬ ТАМУ"],
        ["weeks ago", "ТЫДНЯЎ ТАМУ"], ["week ago", "ТЫДЗЕНЬ ТАМУ"], ["months ago", "МЕСЯЦАЎ ТАМУ"],
        ["month ago", "МЕСЯЦ ТАМУ"], ["years ago", "ГАДОЎ ТАМУ"], ["year ago", "ГОД ТАМУ"]
    ];

    en2be_pairs.sort((a,b) => b[0].length - a[0].length);
    en2be_pairs.forEach(p => {
        M_EN2BE.push({k: p[0], v: p[1]});
    });

    // Б) BE -> EN (Для английской версии)
    var be2en_pairs = [
        ["НАВІНЫ", "NEWS"],
        ["Навіны", "News"],
        ["навіны", "news"],
        ["ГАЛОЎНАЯ", "HOME"],
        ["Галоўная", "Home"],
        ["СЛУХАЦЬ", "LISTEN"],
        ["Слухаць", "Listen"],
        ["ВІДЭА", "VIDEO"],
        ["Відэа", "Video"],
        ["АРТЫКУЛЫ", "ARTICLES"],
        ["Артыкулы", "Articles"],
        ["КАНТАКТ", "CONTACT"],
        ["Кантакт", "Contact"],
        ["ПАДКАСТЫ", "PODCASTS"],
        ["Падкасты", "Podcasts"],
        ["ПАДКАСТ", "PODCAST"],
        ["Падкаст", "Podcast"],
        ["МУЗЫКА", "MUSIC"],
        ["Музыка", "Music"],
        ["КАМАНДА", "TEAM"],
        ["Каманда", "Team"],
        ["ЗВЯЖЫЦЕСЯ З НАМІ!", "CONTACT US!"],
        ["Звяжыцеся з намі!", "Contact Us!"],
        ["Звяжыцеся з намі", "Contact Us"],
        ["АПОШНІЯ НАВІНЫ", "LATEST NEWS"],
        ["Апошнія навіны", "Latest News"],
        ["АПОШНІЯ ПАДКАСТЫ", "LATEST PODCASTS"],
        ["Апошнія падкасты", "Latest Podcasts"],
        ["НАШЫ САЦСЕТКІ", "OUR SOCIALS"],
        ["Нашы сацсеткі", "Our Socials"],
        ["Беларуская палітыка", "Belarusian Politics"],
        ["Беларусь-Смаленск", "Belarus-Smolensk"],
        ["Беларусь", "Belarus"],
        ["Польшча", "Poland"],
        ["Расія", "Russia"],
        ["Смаленск", "Smolensk"],
        ["Украіна", "Ukraine"],
        ["Плэйлісты", "Playlists"],
        ["Галерэя", "Gallery"],
        ["БОЛЬШ", "MORE"],
        ["Больш", "More"],
        ["больш", "more"]
    ];

    be2en_pairs.sort((a,b) => b[0].length - a[0].length);
    be2en_pairs.forEach(p => {
        M_BE2EN.push({k: p[0], v: p[1]});
    });

    // === 4. ПРЯМАЯ ФУНКЦИЯ ПЕРЕВОДА (Без ловушки reg.test) ===
    function translatePage(dict) {
        // 1. Текстовые узлы DOM
        var w = D.createTreeWalker(D.body, 4, null, 0), n;
        while(n = w.nextNode()){
            if(n.parentNode && ['SCRIPT','STYLE','TEXTAREA'].includes(n.parentNode.tagName)) continue;
            var t = n.nodeValue, changed = 0;
            dict.forEach(x => {
                var reg = makeRegex(x.k);
                var newT = t.replace(reg, x.v);
                if(newT !== t){
                    t = newT;
                    changed = 1;
                }
            });
            if(changed) n.nodeValue = t;
        }

        // 2. Инпуты, Формы, Кнопки
        Q('input, textarea, button, label, a, h1, h2, h3, h4, .title').forEach(e => {
            dict.forEach(x => {
                var reg = makeRegex(x.k);
                
                if(e.placeholder) {
                    var newP = e.placeholder.replace(reg, x.v);
                    if(newP !== e.placeholder) e.placeholder = newP;
                }

                if(e.tagName === 'INPUT' && e.value && typeof e.value === 'string') {
                    var newV = e.value.replace(reg, x.v);
                    if(newV !== e.value) e.value = newV;
                }
            });
        });
    }

    // === 5. СТИЛИ И ФИКС МЕНЮ ===
    if(!D.getElementById('tc')) {
        D.head.insertAdjacentHTML('beforeend','<style id="tc">.tc::before,.tc a::before{display:none!important}.tc{position:relative!important;overflow:hidden!important;background:0 0!important}.tc a{position:relative;z-index:2;transition:color .3s}.tc::after{content:"";position:absolute;top:-100%;left:0;width:100%;height:100%;background:#24A1DE;transition:top .25s;z-index:1}.tc:hover::after{top:0}.tc:hover a{color:#fff!important}</style>');
    }

    function isMobile(){ return window.innerWidth <= 1024; }

    function fixMenuOnce(){
        var isMob = isMobile();
        Q('a.sf-with-ul').forEach(function(link){
            if(link.getAttribute('data-pc-fixed')) return;
            var txt = (link.textContent||"").toLowerCase().trim();
            var isTarget = txt.includes('слухаць') || txt.includes('кантакт') || txt.includes('listen') || txt.includes('contact');
            
            if(!isTarget) return;
            
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

    var resizeTimer;
    window.addEventListener('resize', function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
            Q('a.sf-with-ul[data-pc-fixed]').forEach(el => el.removeAttribute('data-pc-fixed'));
            fixMenuOnce();
        }, 250);
    });

    setTimeout(fixMenuOnce, 300);
    setTimeout(fixMenuOnce, 1000);
    setInterval(fixMenuOnce, 2000);

    // === 6. ОСНОВНОЙ ЦИКЛ ОБРАБОТКИ ===
    setInterval(() => {
        if(!D.body) return;

        renderLangSwitcher();

        var currentLang = getLang();
        if(currentLang === 'be') {
            translatePage(M_EN2BE);
        } else if(currentLang === 'en') {
            translatePage(M_BE2EN);
        }

        // Замена Twitter -> Telegram @BelSmol
        Q('a[href*="twitter"],a[href*="t.me"]').forEach(l => {
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

        // Скрытие брендинга RadioKing
        Q('div,footer,p').forEach(d => {
            if(d.textContent.includes('RadioKing') && d.offsetHeight < 99) d.style.display = 'none';
        });

    }, 1000);
})();
