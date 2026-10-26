(function(){
    var D = document, 
        Q = s => D.querySelectorAll(s);

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

    // === 2. ПОДГОТОВКА И ПРЕКОМПИЛЯЦИЯ СЛОВАРЕЙ (Однократно при загрузке) ===
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function compileDict(pairs) {
        var list = [];
        pairs.forEach(p => {
            var pattern = escapeRegExp(p[0]).replace(/[ІіIi]/g, '[ІіIi]');
            list.push({
                k: p[0],
                v: p[1],
                reg: new RegExp(pattern, 'giu')
            });
        });
        list.sort((a, b) => b.k.length - a.k.length);
        return list;
    }

    // А) EN -> BE
    var M_EN2BE = compileDict([
        ["FIRST NAME *", "ІМЯ *"], ["First name *", "Імя *"], ["First Name *", "Імя *"],
        ["FIRST NAME", "ІМЯ"], ["First name", "Імя"], ["First Name", "Імя"],
        ["PHONE NUMBER", "ТЭЛЕФОН"], ["Phone number", "Тэлефон"], ["Phone Number", "Тэлефон"],
        ["WEBSITE", "САЙТ"], ["Website", "Сайт"],
        ["SUBJECT *", "ТЭМА *"], ["Subject *", "Тэма *"], ["SUBJECT", "ТЭМА"], ["Subject", "Тэма"],
        ["MESSAGE *", "ПАВЕДАМЛЕННЕ *"], ["Message *", "Паведамленне *"], ["MESSAGE", "ПАВЕДАМЛЕННЕ"], ["Message", "Паведамленне"],
        ["PLEASE COPY THE FOLLOWING LETTERS", "УВЯДЗІЦЕ СІМВАЛЫ З МАЛЮНКА"], ["Please copy the following letters", "Увядзіце сімвалы з малюнка"],
        ["SEND MESSAGE", "АДПРАВІЦЬ ПАВЕДАМЛЕННЕ"], ["Send message", "Адправіць паведамленне"],
        ["SEND", "АДПРАВІЦЬ"], ["Send", "Адправіць"],
        ["CONTACT US!", "ЗВЯЖЫЦЕСЯ З НАМІ!"], ["Contact us!", "Звяжыцеся з намі!"], ["CONTACT US", "ЗВЯЖЫЦЕСЯ З НАМІ"], ["Contact us", "Звяжыцеся з намі"],
        ["MUSICS", "МУЗЫКА"], ["Musics", "Музыка"],
        ["MORE", "БОЛЬШ"], ["More", "БОЛЬШ"], ["more", "БОЛЬШ"],
        ["LOADING...", "ЗАГРУЖАЕЦЦА..."], ["Loading...", "Загружаецца..."], ["Loading..", "Загружаецца.."], ["Loading.", "Загружаецца."], ["Loading", "Загружаецца"],
        ["LISTEN PODCAST", "СЛУХАЦЬ ПАДКАСТ"], ["Listen podcast", "Слухаць падкаст"],
        ["DOWNLOAD PODCAST", "СПАМАВАЦЬ ПАДКАСТ"], ["Download podcast", "Спампаваць падкаст"],
        ["COMMENT", "КАМЕНТАВАЦЬ"], ["Comment", "Каментаваць"],
        ["COMMENTS", "КАМЕНТАРЫ"], ["comments", "Каментары"],
        ["LOG IN", "УВАЙСЦІ"], ["log in", "Увайсці"],
        ["CREATE ACCOUNT", "СТВАРЫЦЬ АКАЎНТ"], ["create account", "Стварыць акаўнт"],
        ["SEE ALSO", "ГЛЯДЗІЦЕ ТАКСАМА"], ["See also", "Глядзіце таксама"],
        ["VIEWS", "ПРАГЛЯДАЎ"], ["views", "праглядаў"],
        ["January", "студзеня"], ["February", "лютага"], ["March", "сакавіка"], ["April", "красавіка"],
        ["May", "траўня"], ["June", "чэрвеня"], ["July", "ліпеня"], ["August", "жніўня"],
        ["September", "верасня"], ["October", "кастрычніка"], ["November", "лістапада"], ["December", "снежня"],
        ["hours ago", "ГАДЗІН ТАМУ"], ["hour ago", "ГАДЗІНУ ТАМУ"], ["minutes ago", "ХВІЛІН ТАМУ"],
        ["minute ago", "ХВІЛІНУ ТАМУ"], ["days ago", "ДЗЁН ТАМУ"], ["day ago", "ДЗЕНЬ ТАМУ"],
        ["weeks ago", "ТЫДНЯЎ ТАМУ"], ["week ago", "ТЫДЗЕНЬ ТАМУ"], ["months ago", "МЕСЯЦАЎ ТАМУ"],
        ["month ago", "МЕСЯЦ ТАМУ"], ["years ago", "ГАДОЎ ТАМУ"], ["year ago", "ГОД ТАМУ"]
    ]);

    // Б) BE -> EN
    var M_BE2EN = compileDict([
        ["Звяжыцеся з намі!", "Contact Us!"], ["Звяжыцеся з намі", "Contact Us"],
        ["ЗВЯЖЫЦЕСЯ З НАМІ!", "CONTACT US!"], ["ЗВЯЖЫЦЕСЯ З НАМІ", "CONTACT US"],
        ["АПОШНІЯ НАВІНЫ", "LATEST NEWS"], ["Апошнія навіны", "Latest News"],
        ["АПОШНІЯ ПАДКАСТЫ", "LATEST PODCASTS"], ["Апошнія падкасты", "Latest Podcasts"],
        ["НАШЫ САЦСЕТКІ", "OUR SOCIALS"], ["Нашы сацсеткі", "Our Socials"],
        ["Беларуская палітыка", "Belarusian Politics"], ["Беларусь-Смаленск", "Belarus-Smolensk"],
        ["Вядоўцы", "Hosts"], ["ВЯДОЎЦЫ", "HOSTS"],
        ["Кіраўніцтва", "Management"], ["КІРАЎНІЦТВА", "MANAGEMENT"],
        ["ГАЛОЎНАЯ", "HOME"], ["Галоўная", "Home"],
        ["НАВІНЫ", "NEWS"], ["Навіны", "News"], ["навіны", "news"],
        ["СЛУХАЦЬ", "LISTEN"], ["Слухаць", "Listen"],
        ["ПАДКАСТЫ", "PODCASTS"], ["Падкасты", "Podcasts"],
        ["ПАДКАСТ", "PODCAST"], ["Падкаст", "Podcast"],
        ["МУЗЫКА", "MUSIC"], ["Музыка", "Music"],
        ["ВІДЭА", "VIDEO"], ["Відэа", "Video"],
        ["АРТЫКУЛЫ", "ARTICLES"], ["Артыкулы", "Articles"],
        ["КАНТАКТ", "CONTACT"], ["Кантакт", "Contact"],
        ["КАМАНДА", "TEAM"], ["Каманда", "Team"],
        ["ПЛЭЙЛІСТЫ", "PLAYLISTS"], ["Плэйлісты", "Playlists"],
        ["ГАЛЕРЭЯ", "GALLERY"], ["Галерэя", "Gallery"],
        ["Беларусь", "Belarus"], ["Польшча", "Poland"], ["Расія", "Russia"], ["Смаленск", "Smolensk"], ["Украіна", "Ukraine"],
        ["БОЛЬШ", "MORE"], ["Больш", "More"], ["больш", "more"]
    ]);

    // === 3. ФУНКЦИЯ ПЕРЕВОДА (Оптимизированная) ===
    function translatePage(dict) {
        var w = D.createTreeWalker(D.body, 4, null, 0), n;
        while(n = w.nextNode()){
            if(n.parentNode && ['SCRIPT','STYLE','TEXTAREA'].includes(n.parentNode.tagName)) continue;
            var t = n.nodeValue;
            if(!t || !t.trim()) continue;
            
            var newT = t;
            for(var i = 0; i < dict.length; i++) {
                var item = dict[i];
                item.reg.lastIndex = 0;
                if(item.reg.test(newT)) {
                    item.reg.lastIndex = 0;
                    newT = newT.replace(item.reg, item.v);
                }
            }
            if(newT !== t) n.nodeValue = newT;
        }

        Q('input, textarea, button, label').forEach(e => {
            for(var i = 0; i < dict.length; i++) {
                var item = dict[i];
                if(e.placeholder) {
                    item.reg.lastIndex = 0;
                    if(item.reg.test(e.placeholder)) {
                        item.reg.lastIndex = 0;
                        e.placeholder = e.placeholder.replace(item.reg, item.v);
                    }
                }
                if(e.tagName === 'INPUT' && e.value && typeof e.value === 'string') {
                    item.reg.lastIndex = 0;
                    if(item.reg.test(e.value)) {
                        item.reg.lastIndex = 0;
                        e.value = e.value.replace(item.reg, item.v);
                    }
                }
            }
        });
    }

    // === 4. СТИЛИ И ФИКС МЕНЮ ===
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
    setInterval(fixMenuOnce, 2500);

    // === 5. ЦИКЛ ВЫПОЛНЕНИЯ (Каждую 1 секунду) ===
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
