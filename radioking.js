(function(){
    var D = document, 
        Q = s => D.querySelectorAll(s), 
        M = [];

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

    // === 2. СЛОВАРЬ (Белорусский перевод) ===
    "Listen podcast|Cлyxаць пaдкacт|Download podcast|Cпaмaвaць пaдкacт|more|БOЛЬШ|Comment|Kaмeнтaвaть|comments|Кaмeнтapы|log in|Увaйcцi|create account|Cтвapыць aкayнт|first name|Iмя|phone number|Тэлeфoн|subject|Тэмa|message|Пaвeдaмлeннe|website|Caйт|See also|Глядзiцe такcaмa|send message|Aдпpaвiць|views|пpaглядaў|January|cтyдзeня|February|лютaгa|March|caкaвiкa|April|кpacaвiкa|May|тpaўня|June|чэpвeня|July|лiпeня|August|жнiўня|September|вepacня|October|кacтpычнiкa|November|лicтaпaдa|December|cнeжня".split("|").forEach((v,i,a)=>{if(i%2==0)M.push({k:v,v:a[i+1]})});
    "hours|ГAДЗIН|hour|ГAДЗIНY|minutes|ХВIЛIН|minute|ХВIЛIНY|days|ДЗЁН|day|ДЗEНЬ|weeks|ТЫДНЯЎ|week|ТЫДЗEНЬ|months|МECЯЦAЎ|month|МECЯЦ|years|ГAДOЎ|year|ГOД".split("|").forEach((v,i,a)=>{if(i%2==0)M.push({k:v+" ago",v:a[i+1]+" ТAМY"})});
    
    M.sort((a,b)=>b.k.length-a.k.length);

    // === 3. СТИЛИ ДЛЯ АНИМАЦИИ И СОЦСЕТЕЙ ===
    if(!D.getElementById('tc')) {
        D.head.insertAdjacentHTML('beforeend','<style id="tc">.tc::before,.tc a::before{display:none!important}.tc{position:relative!important;overflow:hidden!important;background:0 0!important}.tc a{position:relative;z-index:2;transition:color .3s}.tc::after{content:"";position:absolute;top:-100%;left:0;width:100%;height:100%;background:#24A1DE;transition:top .25s;z-index:1}.tc:hover::after{top:0}.tc:hover a{color:#fff!important}</style>');
    }

    // === 4. ФИКС МЕНЮ НА ПК ===
    function isMobile(){ return window.innerWidth <= 1024; }

    function fixMenuOnce(){
        var isMob = isMobile();
        Q('a.sf-with-ul').forEach(function(link){
            if(link.getAttribute('data-pc-fixed')) return;
            var txt = (link.textContent||"").toLowerCase().trim();
            var isTarget = txt.includes('слухаць') || txt.includes('кантакт') || txt.includes('listen') || txt.includes('contact');
            
            if(!isTarget) return
