(function(){
    var D = document, 
        Q = s => D.querySelectorAll(s);

    // === 1. УПРАВЛЕНИЕ ЯЗЫКОМ И НОВАЯ КНОПКА С ФЛАГАМИ ===
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

    // === 2. ПОДГОТОВКА И ПРЕКОМПИЛЯЦИЯ СЛОВАРЕЙ (Гибкий поиск с І/I) ===
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

    // === 3. НАДЕЖНАЯ ФУНКЦИЯ ПЕРЕВОДА ===
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
                newT = newT.replace(item.reg, item.v);
            }
            if(newT !== t) n.nodeValue = newT;
        }

        Q('input, textarea, button, label, a, h1, h2, h3, h4, .title, .widget-title').forEach(e => {
            for(var i = 0; i < dict.length; i++) {
                var item = dict[i];
                item.reg.lastIndex = 0;

                if(e.placeholder) {
                    var newP = e.placeholder.replace(item.reg, item.v);
                    if(newP !== e.placeholder) e.placeholder = newP;
                }

                if(e.tagName === 'INPUT' && e.value && typeof e.value === 'string') {
                    var newV = e.value.replace(item.reg, item.v);
                    if(newV !== e.value) e.value = newV;
                }
            }
        });
    }

    // === 4. ФИКС МЕНЮ И СОЦСЕТЕЙ ===
    function isMobile(){ return window.innerWidth <= 1024; }

    function fixMenuOnce(){
        var isMob = isMobile();
        Q('a.sf-with-ul').forEach(function(link){
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
        Q('a[href*="twitter"],a[href*="t.me"]').forEach(function(l){
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

        Q('div,footer,p').forEach(function(d){
            if(d.textContent.includes('RadioKing') && d.offsetHeight < 99) d.style.
