(function(){
    var D = document, 
        Q = s => D.querySelectorAll(s), 
        M_EN2BE = [],
        M_BE2EN = [];

    // === 1. УПРАВЛЕНИЕ ЯЗЫКОМ И ПЕРЕКЛЮЧАТЕЛЬ ===
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

    // === 2. СЛОВАРИ ===
    // А) Английский -> Белорусский (системные элементы RadioKing)
    "Listen podcast|Cлyxаць пaдкacт|Download podcast|Cпaмaвaць пaдкacт|more|БOЛЬШ|Comment|Kaмeнтaвaть|comments|Кaмeнтapы|log in|Увaйcцi|create account|Cтвapыць aкayнт|first name|Iмя|phone number|Тэлeфoн|subject|Тэмa|message|Пaвeдaмлeннe|website|Caйт|See also|Глядзiцe такcaмa|send message|Aдпpaвiць|views|пpaглядaў|January|cтyдзeня|February|лютaгa|March|caкaвiкa|April|кpacaвiкa|May|тpaўня|June|чэpвeня|July|лiпeня|August|жнiўня|September|вepacня|October|кacтpычнiкa|November|лicтaпaдa|December|cнeжня".split("|").forEach((v,i,a)=>{if(i%2==0)M_EN2BE.push({k:v,v:a[i+1]})});
    "hours|ГAДЗIН|hour|ГAДЗIНY|minutes|ХВIЛIН|minute|ХВIЛIНY|days|ДЗЁН|day|ДЗEНЬ|weeks|ТЫДНЯЎ|week|ТЫДЗEНЬ|months|МECЯЦAЎ|month|МECЯЦ|years|ГAДOЎ|year|ГOД".split("|").forEach((v,i,a)=>{if(i%2==0)M_EN2BE.push({k:v+" ago",v:a[i+1]+" ТAМY"})});
    M_EN2BE.sort((a,b)=>b.k.length-a.k.length);

    // Б) Белорусский -> Английский (ваши меню, категории и заголовки из панели)
    var be2en_pairs = [
        "ГАЛОЎНАЯ|HOME", "НАВІНЫ|NEWS", "СЛУХАЦЬ|LISTEN", "ВІДЭА|VIDEO", "АРТЫКУЛЫ|ARTICLES", "КАНТАКТ|CONTACT",
        "Галоўная|Home", "Навіны|News", "Слухаць|Listen", "Відэа|Video", "Артыкулы|Articles", "Кантакт|Contact",
        "АПОШНІЯ ПАДКАСТЫ|LATEST PODCASTS", "Апошнія падкасты|Latest Podcasts",
        "Беларуская палітыка|Belarusian Politics", "Беларусь|Belarus", "Беларусь-Смаленск|Belarus-Smolensk",
        "Польшча|Poland", "Расія|Russia", "Смаленск|Smolensk", "Украіна|Ukraine"
    ];
    be2en_pairs.forEach(pair => {
        var parts = pair.split("|");
        M_BE2EN.push({k: parts[0], v: parts[1]});
    });
    M_BE2EN.sort((a,b)=>b.k.length-a.k.length);

    // Функция подмены текста на странице
    function translatePage(dict) {
        var w = D.createTreeWalker(D.body, 4, null, 0), n;
        while(n = w.nextNode()){
            if(n.parentNode && ['SCRIPT','STYLE'].includes(n.parentNode.tagName)) continue;
            var t = n.nodeValue, c = 0;
            dict.forEach(x => {
                var r = new RegExp(x.k.includes(' ')?x.k:"\\b"+x.k+"\\b", "g");
                if(r.test(t)){ t = t.replace(r, x.v); c = 1; }
            });
            if(c) n.nodeValue = t;
        }

        Q('input,button,label,a[role="button"]').forEach(e => {
            var v = (e.value || e.textContent || "").trim();
            dict.forEach(x => {
                if(v.includes(x.k)){
                    if(e.value) e.value = e.value.replace(new RegExp(x.k,"g"), x.v);
                    else e.textContent = e.textContent.replace(new RegExp(x.k,"g"), x.v);
                }
            });
        });
    }

    // === 3. СТИЛИ И ФИКС МЕНЮ ===
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
    setInterval(fixMenuOnce, 3000);

    // === 4. ОСНОВНОЙ ЦИКЛ ОБРАБОТКИ ===
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

        // Скрытие плашек RadioKing
        Q('div,footer,p').forEach(d => {
            if(d.textContent.includes('RadioKing') && d.offsetHeight < 99) d.style.display = 'none';
        });

    }, 1000);
})();
