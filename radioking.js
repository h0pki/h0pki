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

    // === 2. ПОИСК С УЧЕТОМ РЕГИСТРА И БУКВ І/I ===
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function makeRegex(text) {
        var pattern = escapeRegExp(text).replace(/[ІіIi]/g, '[ІіIi]');
        return new RegExp(pattern, 'gi');
    }

    // === 3. СЛОВАРИ (Двусторонний перевод) ===

    // А) EN -> BE (При выбранном белорусском языке)
    var en2be_pairs = [
        // Кнопка More в блоках
        ["MORE", "БОЛЬШ"],
        ["more", "БОЛЬШ"],
        ["More", "БОЛЬШ"],

        // Форма контактов
        ["CONTACT US!", "ЗВЯЖЫЦЕСЯ З НАМІ!"],
        ["Contact us!", "Звяжыцеся з намі!"],
        ["Contact us", "Звяжыцеся з намі"],
        ["First name *", "Імя *"],
        ["First name", "Імя"],
        ["Phone number", "Тэлефон"],
        ["Website", "Сайт"],
        ["Subject *", "Тэма *"],
        ["Subject", "Тэма"],
        ["Message *", "Паведамленне *"],
        ["Message", "Паведамленне"],
        ["Please copy the following letters", "Увядзіце сімвалы з малюнка"],
        ["Send message", "Адправіць паведамленне"],
        ["Send", "Адправіць"],

        // Системные уведомления и индикаторы
        ["Loading...", "Загружаецца..."],
        ["Loading..", "Загружаецца.."],
        ["Loading.", "Загружаецца."],
        ["Loading", "Загружаецца"],
        ["Listen podcast", "Слухаць падкаст"],
        ["Download podcast", "Спампаваць падкаст"],
        ["Comment", "Каментаваць"],
        ["comments", "Каментары"],
        ["log in", "Увайсці"],
        ["create account", "Стварыць акаўнт"],
        ["See also", "Глядзіце таксама"],
        ["views", "праглядаў"],

        // Даты и время
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

    // Б) BE -> EN (При выбранном английском языке)
    var be2en_pairs = [
        // Кнопка БОЛЬШ
        ["БОЛЬШ", "MORE"],
        ["Больш", "MORE"],
        ["больш", "MORE"],

        // Заголовки и формы
        ["ЗВЯЖЫЦЕСЯ З НАМІ!", "CONTACT US!"],
        ["Звяжыцеся з намі!", "Contact Us!"],
        ["Звяжыцеся з намі", "Contact Us"],
        ["Імя *", "First name *"],
        ["Імя", "First name"],
        ["Тэлефон", "Phone number"],
        ["Сайт", "Website"],
        ["Тэма *", "Subject *"],
        ["Тэма", "Subject"],
        ["Паведамленне *", "Message *"],
        ["Паведамленне", "Message"],
        ["Увядзіце сімвалы з малюнка", "Please copy the following letters"],
        ["Адправіць паведамленне", "Send message"],
        ["Адправіць", "Send"],

        // Разделы сайдбара и меню
        ["АПОШНІЯ НАВІНЫ", "LATEST NEWS"],
        ["Апошнія навіны", "Latest News"],
        ["АПОШНІЯ ПАДКАСТЫ", "LATEST PODCASTS"],
        ["Апошнія падкасты", "Latest Podcasts"],
        ["Нашы сацсеткі", "Our Socials"],
        ["Беларуская палітыка", "Belarusian Politics"],
        ["Беларусь-Смаленск", "Belarus-Smolensk"],
        ["Галоўная", "Home"],
        ["Навіны", "News"],
        ["Слухаць", "Listen"],
        ["Падкаст", "Podcast"],
        ["Музыка", "Music"],
        ["Відэа", "Videos"],
        ["Артыкулы", "Articles"],
        ["Кантакт", "Contact"],
        ["Каманда", "Team"],
        ["Плэйлісты", "Playlists"],
        ["Галерэя", "Gallery"],
        ["Беларусь", "Belarus"],
        ["Польшча", "Poland"],
        ["Расія", "Russia"],
        ["Смаленск", "Smolensk"],
        ["Украіна", "Ukraine"]
    ];

    be2en_pairs.sort((a,b) => b[0].length - a[0].length);
    be2en_pairs.forEach(p => {
        M_BE2EN.push({k: p[0], v: p[1]});
    });

    // === 4. ФУНКЦИЯ ПЕРЕВОДА ===
    function translatePage(dict) {
        var w = D.createTreeWalker(D.body, 4, null,
