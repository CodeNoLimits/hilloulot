window.VER7='mwua';window.NOM7='tsadikim';
(function(){
  var I=window.I18N||{};
  var pad=function(n){return String(n).padStart(2,'0')};
  // 12/11 : site statique, donc si la hilloula du bandeau d'accueil est passee on affiche la suivante
  (function(){
    var hero=document.querySelector('.hero[data-nexts]'); if(!hero)return;
    try{
      var cd=hero.querySelector('[data-cd]'), now=Date.now();
      var x=JSON.parse(hero.dataset.nexts).filter(function(n){return Date.parse(n.c)+864e5>now})[0];
      if(!x||!cd||cd.dataset.cd===x.c)return;
      var q=function(s){return hero.querySelector(s)}, sp=hero.querySelectorAll('.meta span');
      q('h1').textContent=x.n; if(q('.hn'))q('.hn').textContent=x.h;
      if(sp[0])sp[0].innerHTML='<b></b>',sp[0].firstChild.textContent=x.d; if(sp[1])sp[1].textContent=x.v; if(sp[2])sp[2].textContent=x.p;
      cd.dataset.cd=x.c; cd.setAttribute('aria-label',x.v); if(q('.eve'))q('.eve').textContent=x.e;
      var b=q('.acts .btn'), u=b&&b.getAttribute('href').replace(/[^\/]+\/$/,x.s+'/');  // meme prefixe que le lien d'origine (le site vit sous /hilloulot/ en ligne)
      if(u){b.setAttribute('href',u); if(q('.acts .lnk'))q('.acts .lnk').setAttribute('href',u+'#acces')}
    }catch(e){}
  })();
  // compte a rebours
  function tick(){
    var now=Date.now();
    document.querySelectorAll('[data-cd]').forEach(function(el){
      var t=Date.parse(el.dataset.cd), s=Math.max(0,Math.floor((t-now)/1000));
      var v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
      el.querySelectorAll('b').forEach(function(b,i){b.textContent=i?pad(v[i]):v[i]});
    });
  }
  // J-n : meme cible que le compte a rebours (minuit, heure de Jerusalem, du jour de la hiloula)
  function days(){
    var now=Date.now();
    document.querySelectorAll('[data-t]').forEach(function(el){
      var ms=Date.parse(el.dataset.t)-now, n=Math.ceil(ms/864e5);
      if(ms<=-864e5){el.hidden=true;return}  // date passee : pas de « Dans -3 jours »
      el.textContent = ms<=0&&ms>-864e5?I.today : n===1?I.tomorrow : (I.inDays||'{n}').replace('{n}',n);
    });
  }
  if(document.querySelector('[data-cd]')){tick();setInterval(tick,1000)}
  days();setInterval(days,60000);
  // en-tete opaque au defilement
  var h=document.querySelector('.hdr');
  function hs(){h&&h.classList.toggle('solid',scrollY>40)}hs();addEventListener('scroll',hs,{passive:true});
  // etoiles
  var c=document.querySelector('section canvas.stars');
  if(c&&c.getContext){
    var x=c.getContext('2d'),S=[],w,hh,dpr=Math.min(2,devicePixelRatio||1);
    function rs(){w=c.clientWidth;hh=c.clientHeight;c.width=w*dpr;c.height=hh*dpr;x.setTransform(dpr,0,0,dpr,0,0);S=[];var n=Math.round(w*hh/5200);for(var i=0;i<n;i++)S.push({x:Math.random()*w,y:Math.pow(Math.random(),1.7)*hh*.75,r:Math.random()*1.1+.2,p:Math.random()*6.28,s:.4+Math.random()*1.2})}
    rs();addEventListener('resize',rs);
    var red=matchMedia('(prefers-reduced-motion: reduce)').matches;
    (function fr(t){x.clearRect(0,0,w,hh);S.forEach(function(s){var a=.35+.45*Math.sin(s.p+(red?0:t/1000*s.s));x.globalAlpha=Math.max(.05,a);x.fillStyle='#f6eedd';x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill()});if(!red)requestAnimationFrame(fr)})(0);
  }
  // lecteur video
  document.querySelectorAll('.vf .ov').forEach(function(b){b.addEventListener('click',function(){var f=b.closest('.vf'),v=f.querySelector('video');if(!v)return;f.classList.add('playing');v.controls=true;v.play()})});
  // texte de Michael
  document.querySelectorAll('.mtext .tg').forEach(function(b){b.addEventListener('click',function(){var m=b.closest('.mtext');var o=m.classList.toggle('open');b.textContent=o?b.dataset.close:b.dataset.open;b.setAttribute('aria-expanded',o)})});
  // bougie
  document.querySelectorAll('.candle').forEach(function(b){
    var k='bougie-'+b.dataset.slug, lbl=b.querySelector('.lb');
    function set(on){b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);lbl.textContent=on?b.dataset.on:b.dataset.off}
    var on=false;try{on=localStorage.getItem(k)==='1'}catch(e){}set(on);
    b.addEventListener('click',function(){on=!on;set(on);try{localStorage.setItem(k,on?'1':'0')}catch(e){}});
  });
  // partage WhatsApp
  document.querySelectorAll('[data-share]').forEach(function(a){a.href='https://wa.me/?text='+encodeURIComponent(a.dataset.share+' '+location.href)});
  // carte
  var m=document.getElementById('map');
  if(m&&window.L&&window.PTS){var L=window.L;
    var map=L.map(m,{scrollWheelZoom:false,zoomControl:true,attributionControl:true});
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',{maxZoom:16,attribution:'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap'}).addTo(map);
    var il=[],ua=[];
    PTS.forEach(function(p){
      var c=p.c||1,z=c>1?Math.min(34,16+Math.round(Math.sqrt(c)*3)):16;
      var mk=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'',html:'<div class="pin'+(c>1?' pin7':'')+'" style="width:'+z+'px;height:'+z+'px">'+(c>1?'<span>'+c+'</span>':'')+'</div>',iconSize:[z,z],iconAnchor:[z/2,z/2]})}).addTo(map);
      mk.bindPopup('<b>'+p.n+'</b>'+p.d+'<br><a href="'+p.u+'">'+p.cta+' &rarr;</a>',{maxHeight:280,maxWidth:300});
      (p.il?il:ua).push([p.lat,p.lng]);
    });
    var views={il:L.latLngBounds(il).pad(.25),ua:L.latLngBounds(ua).pad(.8)};
    map.fitBounds(views.il);
    document.querySelectorAll('.maptabs button').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.maptabs button').forEach(function(o){o.setAttribute('aria-pressed',o===b)});map.flyToBounds(views[b.dataset.v],{duration:1.2})})});
  }
})();

/* ================= v3 ================= */
(function(){
  var red=matchMedia('(prefers-reduced-motion: reduce)').matches, I=window.I18N||{};
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
  // etoiles de l'ouverture (meme rendu que le heros) + etoile filante
  function sky(c){ if(!c||!c.getContext||c.dataset.on)return; c.dataset.on=1;
    var x=c.getContext('2d'),S=[],w,h,dpr=Math.min(2,devicePixelRatio||1),shoot=null;
    function rs(){w=c.clientWidth;h=c.clientHeight;c.width=w*dpr;c.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0);S=[];for(var i=0;i<Math.round(w*h/3800);i++)S.push({x:Math.random()*w,y:Math.pow(Math.random(),1.5)*h*.8,r:Math.random()*1.2+.2,p:Math.random()*6.28,s:.4+Math.random()*1.4})}
    rs();addEventListener('resize',rs);
    (function fr(t){x.clearRect(0,0,w,h);S.forEach(function(s){x.globalAlpha=Math.max(.05,.35+.45*Math.sin(s.p+(red?0:t/1000*s.s)));x.fillStyle='#f6eedd';x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill()});
      if(!red){ if(!shoot&&Math.random()<.004)shoot={x:Math.random()*w*.7+w*.2,y:Math.random()*h*.3,l:0};
        if(shoot){shoot.l+=14;var g=x.createLinearGradient(shoot.x,shoot.y,shoot.x-shoot.l,shoot.y+shoot.l*.45);g.addColorStop(0,'rgba(255,245,220,.9)');g.addColorStop(1,'rgba(255,245,220,0)');x.globalAlpha=1;x.strokeStyle=g;x.lineWidth=1.4;x.beginPath();x.moveTo(shoot.x,shoot.y);x.lineTo(shoot.x-shoot.l,shoot.y+shoot.l*.45);x.stroke();shoot.x-=6;shoot.y+=2.7;if(shoot.l>220)shoot=null}
        requestAnimationFrame(fr)} })(0);
  }
  // ouverture cinematographique (une fois par visite)
  var it=document.getElementById('intro');
  if(it){ if(red||(document.referrer.indexOf(location.origin+'/')===0&&!/reload/.test(((performance.getEntriesByType('navigation')||[])[0]||{}).type))){it.remove()} else { sky(it.querySelector('canvas')); ss('intro','1');
      var close=function(){if(it.classList.contains('out'))return;it.classList.add('out');dispatchEvent(new Event('introdone'));setTimeout(function(){it.remove()},1100)}; it.addEventListener('click',close); setTimeout(close,5600);} }
  // revelations au defilement
  if(document.documentElement.classList.contains('js-anim')&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){var k=0;es.forEach(function(e){if(e.isIntersecting){e.target.style.transitionDelay=(k++*70)+'ms';e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});
    var watch=function(){document.querySelectorAll('.rv:not(.in)').forEach(function(el){io.observe(el)})}; watch(); window.__watchRv=watch;
    // filet de securite : tout bloc deja passe au-dessus du bas de l'ecran est revele (telephones lents, defilement brusque)
    var tk=0, sweep=function(){tk=0;var hh=innerHeight;document.querySelectorAll('.rv:not(.in)').forEach(function(el){if(el.getBoundingClientRect().top<hh){el.classList.add('in');io.unobserve(el)}})};
    addEventListener('scroll',function(){if(!tk)tk=requestAnimationFrame(sweep)},{passive:true}); addEventListener('load',sweep);
  } else document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});
  // GSAP : parallaxe
  function anim(){ var g=window.gsap; if(!g||red||!document.documentElement.classList.contains('js-anim'))return;
    if(window.ScrollTrigger)g.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-px]').forEach(function(el){var im=el.querySelector('img');if(!im)return;g.fromTo(im,{yPercent:-6},{yPercent:8,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}})});
    document.querySelectorAll('.hero .in').forEach(function(el){g.to(el,{yPercent:-12,opacity:.35,ease:'none',scrollTrigger:{trigger:el.closest('.hero'),start:'top top',end:'bottom top',scrub:true}})});
    addEventListener('load',function(){ScrollTrigger.refresh()});
  }
  if(window.gsap)anim(); else addEventListener('load',anim);
  // compte a rebours : chiffre qui bascule
  if(!red)new MutationObserver(function(ms){ms.forEach(function(m){var b=m.target.nodeType===1?m.target:m.target.parentNode;if(b&&b.tagName==='B'&&b.closest('.cd')){b.classList.remove('tick');void b.offsetWidth;b.classList.add('tick')}})}).observe(document.body,{subtree:true,childList:true,characterData:true});
  // musique : jamais sans l'accord du visiteur (Mickael 03/11) ; 1re visite = encart qui propose, choix memorise ; apres un oui, reprise au premier geste de chaque page
  var au=document.getElementById('bgm'), sb=document.querySelector('.snd'), fade=null, duck=false;
  var GEST=['pointerdown','pointerup','touchend','click','keydown','wheel','scroll','touchstart'];
  function vol(to,ms,cb){clearInterval(fade);var st=au.volume,t0=Date.now();fade=setInterval(function(){var k=Math.min(1,(Date.now()-t0)/ms);au.volume=Math.max(0,Math.min(1,st+(to-st)*k));if(k>=1){clearInterval(fade);cb&&cb()}},40)}
  function detach(){GEST.forEach(function(ev){removeEventListener(ev,gest,true)})}
  function play(){ if(!au||!au.paused||ls('son')==='off')return; au.volume=0; var t=+ss('bgmT')||0; if(t&&!au.currentTime)try{au.currentTime=t}catch(e){}
    var p=au.play(); if(p&&p.then)p.then(function(){detach();vol(duck?0:.32,2500);sb&&sb.setAttribute('aria-pressed','true')}).catch(function(){}); }
  function stop(){ if(!au)return; vol(0,900,function(){au.pause()}); sb&&sb.setAttribute('aria-pressed','false') }
  function gest(e){ if(e.target&&e.target.closest&&e.target.closest('.snd'))return; var ua=navigator.userActivation; if(ua&&!ua.isActive)return; play() } // sans geste reconnu, play() telechargerait les 3,3 Mo pour rien
  if(au&&sb){
    sb.addEventListener('click',function(e){e.stopPropagation(); var q=document.querySelector('.sndq'); q&&q.remove(); if(au.paused){ls('son','on');play()}else{ls('son','off');detach();stop()}});
    if(ls('son')==='on'){ GEST.forEach(function(ev){addEventListener(ev,gest,{capture:true,passive:true})}); if(navigator.userActivation&&navigator.userActivation.hasBeenActive)play(); }
    else if(!ls('son')){ var ask=function(){
      var T={fr:['Une mélodie accompagne la visite.','Écouter','Sans musique'],en:['A melody accompanies your visit.','Listen','No music'],he:['מנגינה מלווה את הביקור באתר.','האזנה','בלי מוזיקה']}[document.documentElement.lang]||0; if(!T||ls('son'))return;
      var q=document.createElement('div'); q.className='sndq'; q.setAttribute('role','region'); q.setAttribute('aria-label',T[0]);
      q.innerHTML='<p>'+T[0]+'</p><div><button class="btn solid" type="button" data-v="on">'+T[1]+'</button><button class="btn" type="button" data-v="off">'+T[2]+'</button></div>';
      q.addEventListener('click',function(e){var b=e.target.closest('button'); if(!b)return; ls('son',b.dataset.v); q.remove(); if(b.dataset.v==='on')play()});
      document.body.appendChild(q); requestAnimationFrame(function(){q.classList.add('on')});
    }; var it0=document.getElementById('intro'); if(it0&&!it0.classList.contains('out'))addEventListener('introdone',function(){setTimeout(ask,1600)},{once:true}); else setTimeout(ask,1500); }
    addEventListener('pagehide',function(){if(!au.paused)ss('bgmT',au.currentTime)});
    document.querySelectorAll('video').forEach(function(v){v.addEventListener('play',function(){duck=true;if(!au.paused)vol(0,700)});['pause','ended'].forEach(function(ev){v.addEventListener(ev,function(){duck=false;if(!au.paused)vol(.32,1500)})})});
  }
  // filtres (calendrier et catalogue)
  document.querySelectorAll('.chips').forEach(function(g){
    var bs=g.querySelectorAll('button');
    function sel(f){bs.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===f)});
      document.querySelectorAll('.ev[data-c]').forEach(function(e){e.classList.toggle('hide',f!=='all'&&e.dataset.c!==f&&!(f==='fete'&&e.dataset.c==='jeune'))});
      document.querySelectorAll('.dl').forEach(function(d){d.classList.toggle('empty',!d.querySelector('.ev:not(.hide)'))});
      document.querySelectorAll('.tz[data-c]').forEach(function(e){e.classList.toggle('hide',f!=='all'&&e.dataset.c.split(' ').indexOf(f)<0)});
      if(f!=='all')document.querySelectorAll('.dbd').forEach(function(d){d.open=true});
      window.ScrollTrigger&&ScrollTrigger.refresh(); }
    bs.forEach(function(b){b.addEventListener('click',function(){sel(b.dataset.f);if(document.getElementById('tzs'))history.replaceState(null,'',b.dataset.f==='all'?location.pathname:'#'+b.dataset.f)})});
    var h=location.hash.slice(1); if(h&&g.querySelector('[data-f="'+h+'"]'))sel(h);
  });
  // grande bougie du jour
  document.querySelectorAll('.bigcandle').forEach(function(b){
    var lb=b.querySelector('.lb');
    function set(on){b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);lb.textContent=on?b.dataset.on:b.dataset.off}
    set(ls('bougie-'+b.dataset.slug)==='1');
    b.addEventListener('click',function(){var on=!b.classList.contains('on');set(on);ls('bougie-'+b.dataset.slug,on?'1':'0')});
  });
  // Aujourd'hui : evenements du jour reel (heure de Jerusalem)
  var lang=document.documentElement.lang, list=document.querySelector('#tev,[data-today-list]');
  if(list){
    var iso=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem'}).format(new Date());
    var L=window.EVL||{}, TV=window.TV||'', loc=window.LOCALE||lang;
    var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
    var li=function(e){var b='<span class="evc">'+esc(L[e.c]||e.c)+'</span>'+(e.u?'<a href="'+e.u+'">'+esc(e.t)+'</a>'+(e.c==='hil'?'<a class="vf7" href="'+e.u+'">'+({fr:'Voir la fiche',en:'See the page',he:'לדף הצדיק'}[lang]||'')+'</a>':''):'<span class="evt">'+esc(e.t)+'</span>')+(e.pl?'<em>'+esc(e.pl)+'</em>':'')+(e.v?'':'<small class="tv">'+esc(TV)+'</small>')+(e.pc?'<small class="pcn">'+esc(e.pc)+'</small>':'');return '<li class="ev c-'+e.c+(e.i?' wi':'')+'" data-c="'+e.c+'">'+(e.i?'<img class="evth" src="/hilloulot/img/th/'+e.i+'.webp" alt="" width="44" height="55" loading="lazy" decoding="async"><div>'+b+'</div>':b)+'</li>'};
    var civ=function(d,o){return new Intl.DateTimeFormat(loc,Object.assign({timeZone:'UTC'},o||{weekday:'long',day:'numeric',month:'long',year:'numeric'})).format(new Date(d+'T12:00:00Z'))};
    fetch('/hilloulot/'+lang+'/days.json').then(function(r){return r.json()}).then(function(D){
      for(var k0 in D)D[k0].e=(D[k0].e||[]).filter(function(e){return e.c!=='hil'||e.u});var day=D[iso]; if(!day)return;
      var h=document.querySelector('#thd,[data-today-hd]'); if(h&&day.h)h.textContent=day.h;
      var c=document.querySelector('#tciv,[data-today-civ]'); if(c)c.textContent=civ(iso);
      var ev=day.e; if(list.hasAttribute('data-today-list'))ev=ev.slice(0,9);
      list.innerHTML=ev.length?ev.map(li).join(''):'<li class="ev none">'+esc(list.dataset.none||'')+'</li>';
      document.querySelectorAll('.bigcandle').forEach(function(b){b.dataset.slug='jour-'+iso;var on=ls('bougie-jour-'+iso)==='1';b.classList.toggle('on',on);b.querySelector('.lb').textContent=on?b.dataset.on:b.dataset.off});
      var wk=document.getElementById('tweek'); if(wk){var out='',d=new Date(iso+'T12:00:00Z');
        for(var i=1;i<=7;i++){var k=new Date(+d+i*864e5).toISOString().slice(0,10),x=D[k];if(!x)continue;
          out+='<li class="rv"><h3>'+esc(x.h||'')+'<small>'+esc(civ(k))+'</small></h3><ul class="evs">'+(x.e.length?x.e.slice(0,3).map(li).join('')+(x.e.length>3?'<li class="ev more"><a href="/hilloulot/'+lang+'/calendar/">+ '+(x.e.length-3)+'</a></li>':''):'<li class="ev none">'+esc(list.dataset.none||'')+'</li>')+'</ul></li>'}
        wk.innerHTML=out; window.__watchRv?window.__watchRv():wk.querySelectorAll('.rv').forEach(function(e){e.classList.add('in')}) }
    }).catch(function(){});
  }
})();

/* ================= v4 : partage et recherche ================= */
(function(){
  var jiso=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem'}).format(new Date());
  document.querySelectorAll('.share').forEach(function(c){
    var p=c.querySelector('.sh1'); if(p&&c.dataset.iso===jiso&&p.dataset.shtoday)p.textContent=p.dataset.shtoday;
    var msg=function(){return [].map.call(c.querySelectorAll('.shmsg p'),function(x){return x.textContent}).concat(c.dataset.sum?[c.dataset.sum]:[]).join('\n\n')+'\n\n'+location.href};
    var wa=c.querySelector('[data-wa]'); if(wa)wa.href='https://wa.me/?text='+encodeURIComponent(msg());
    var b=c.querySelector('[data-sharebtn]');
    if(b)b.addEventListener('click',function(){var m=msg();
      if(navigator.share)navigator.share({title:b.dataset.title,text:m}).catch(function(){});
      else window.open('https://wa.me/?text='+encodeURIComponent(m),'_blank','noopener');});
  });
  // recherche par nom (page Tsadikim), combinee avec les filtres
  var q=document.getElementById('tzq');
  if(q){ var nr=document.getElementById('tznr');
    var norm=function(s){return String(s).normalize('NFD').replace(/[̀-֑ͯ-ׇ'’"״׳`-]/g,'').toLowerCase()};
    var run=function(){var v=norm(q.value.trim()),n=0;
      document.querySelectorAll('.tz[data-q]').forEach(function(li){var ok=!v||li.dataset.q.indexOf(v)>=0;li.classList.toggle('nq',!ok);if(ok&&!li.classList.contains('hide'))n++;if(ok)li.classList.add('in')});
      if(nr)nr.hidden=n>0; window.ScrollTrigger&&ScrollTrigger.refresh();};
    q.addEventListener('input',run); document.querySelectorAll('.chips button').forEach(function(b){b.addEventListener('click',function(){setTimeout(run,0)})});
  }
})();

/* ================= v4b : titres reveles (GSAP) ================= */
(function(){
  var d=document.documentElement; if(!d.classList.contains('js-anim'))return;
  var seg=window.Intl&&Intl.Segmenter?new Intl.Segmenter():null;
  var chars=function(w){return seg?Array.from(seg.segment(w),function(x){return x.segment}):Array.from(w)};
  function split(el){ if(el.children.length||el.classList.contains('st'))return null;
    var txt=el.textContent.trim(), he=/[֐-׿]/.test(txt), byWord=he||el.matches('.tcard h3'), ws=txt.split(/\s+/);
    el.textContent=''; el.setAttribute('aria-label',txt); el.classList.remove('rise');
    ws.forEach(function(w,i){var s=document.createElement('span');s.className='sw'+(byWord?' u':'');s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i);
      if(byWord)s.textContent=w; else chars(w).forEach(function(c){var k=document.createElement('span');k.className='sc';k.textContent=c;s.appendChild(k)});
      el.appendChild(s); if(i<ws.length-1)el.appendChild(document.createTextNode(' '))});
    el.classList.add('st'); return el; }
  var els=[].slice.call(document.querySelectorAll('.hero h1,.h2,.tcard h3')).map(split).filter(Boolean);
  window.__st=1;
  function reveal(el){ var g=window.gsap; el.classList.add('st-on'); if(!g){el.classList.add('lit');return}
    var big=el.matches('.hero h1'), u=el.querySelectorAll('.sc,.sw.u'), card=el.matches('.tcard h3');
    g.fromTo(u,{opacity:0,yPercent:card?30:65,rotateX:card?0:-70,filter:card?'blur(0px)':'blur(7px)'},{opacity:1,yPercent:0,rotateX:0,filter:'blur(0px)',transformOrigin:'50% 100%',duration:big?1.4:card?.8:1.1,ease:'expo.out',stagger:u.length>1&&u[0].classList.contains('u')?.09:(big?.032:.022),
      onComplete:function(){ g.set(u,{clearProps:'all'}); el.querySelectorAll('.sw').forEach(function(s){s.textContent=s.textContent}); el.classList.add('lit') }}); }
  function go(){ var hero=els.filter(function(e){return e.matches('.hero h1')}), rest=els.filter(function(e){return !e.matches('.hero h1')});
    var it=document.getElementById('intro');
    var startHero=function(){hero.forEach(reveal)};
    if(it&&!it.classList.contains('out')){ hero.forEach(function(e){e.classList.add('st-on');if(window.gsap)gsap.set(e.querySelectorAll('.sc,.sw.u'),{opacity:0})}); addEventListener('introdone',function(){setTimeout(startHero,250)},{once:true}) } else startHero();
    if('IntersectionObserver' in window){ var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){io.unobserve(x.target);reveal(x.target)}})},{rootMargin:'0px 0px -8% 0px'}); rest.forEach(function(e){io.observe(e)}) } else rest.forEach(reveal);
  }
  if(window.gsap)go(); else addEventListener('load',go);
})();
// v5 : panneau « Etre prevenu des hilloulot »
(function(){
  var d=document.getElementById('subd'); if(!d)return;
  document.querySelectorAll('[data-sub]').forEach(function(b){b.addEventListener('click',function(){if(d.showModal)d.showModal();else d.setAttribute('open','')})});
  d.addEventListener('click',function(e){if(e.target===d)d.close()});
  var f=d.querySelector('.subm'); if(!f)return;
  f.addEventListener('submit',function(e){e.preventDefault();var to=f.dataset.mail,em=f.email.value.trim(),r=(d.querySelector('[name=rythme]:checked')||{}).value||'week';
    if(!to||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){f.email.focus();return}
    var ok=function(){f.querySelector('.subok').hidden=false};
    if(/^https?:/.test(to)){var fd=new FormData();fd.append('email',em);fd.append('rythme',r);fd.append('langue',document.documentElement.lang);fetch(to,{method:'POST',body:fd,headers:{Accept:'application/json'}}).then(ok).catch(ok)}
    else{location.href='mailto:'+to+'?subject='+encodeURIComponent('Tsadikim — '+r)+'&body='+encodeURIComponent(em+' · '+r);ok()}});
})();

/* v7 reperes */
/* v7 : repères du calendrier en haut de l'accueil (Shabbat, Roch Hodech, prochaine fête) — demande de Mickaël, 06/11/2026.
   Dates : /fr/days.json (calendrier vérifié du site, jours civils) ; noms : days.json de la langue de la page. */
(function(){
  var box=document.querySelector('[data-rep7]'); if(!box||!window.fetch)return;
  var lang=document.documentElement.lang, l=lang, loc=window.LOCALE||l;
  var S={
    fr:{sh:'Shabbat',tonight:'Ce soir',today:'Aujourd’hui',fri:'Vendredi {d} au soir',rh:'Roch Hodech',one:'1 jour',two:'2 jours',eve:'dès le {d} au soir',eve0:'dès ce soir',fete:'Prochaine fête',inN:'dans {n} jours',tom:'demain',and:' et '},
    en:{sh:'Shabbat',tonight:'Tonight',today:'Today',fri:'Friday {d}, evening',rh:'Rosh Chodesh',one:'1 day',two:'2 days',eve:'from {d} in the evening',eve0:'from this evening',fete:'Next festival',inN:'in {n} days',tom:'tomorrow',and:' and '},
    he:{sh:'שבת',tonight:'הערב',today:'היום',fri:'יום שישי בערב, {d}',rh:'ראש חודש',one:'ראש חודש בן יום אחד',two:'ראש חודש בן יומיים',eve:'מתחיל ב{d} בערב',eve0:'מתחיל הערב',fete:'החג הבא',inN:'בעוד {n} ימים',tom:'מחר',and:' ו'}
  }[l]||null; if(!S)return;
  var t=function(k,v){return S[k].replace(/\{(\w)\}/g,function(_,x){return v[x]})};
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var iso=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem'}).format(new Date());
  var add=function(k,n){return new Date(Date.parse(k+'T12:00:00Z')+n*864e5).toISOString().slice(0,10)};
  var fmt=function(k,o){return new Intl.DateTimeFormat(loc,Object.assign({timeZone:'UTC'},o)).format(new Date(k+'T12:00:00Z'))};
  var wd=function(k){return fmt(k,{weekday:'long'})}, dm=function(k){return fmt(k,{weekday:'long',day:'numeric',month:'long'})};
  var veille=function(k){var v=add(k,-1);return v===iso?S.eve0:t('eve',{d:dm(v)})};
  var dans=function(n){return n===1?S.tom:n===2&&l==='he'?'בעוד יומיים':t('inN',{n:n})};
  var avant=function(n){return n>1?' · '+dans(n-1):''};  // jours jusqu'au soir où le jour commence (Mickaël, 24/11 : « 2 jours · dès mercredi soir » se lisait « dans 2 jours »)
  var ev=function(D,k,c){return ((D[k]||{}).e||[]).filter(function(e){return e.c===c})[0]};
  var card=function(kick,title,sub,cls){return '<li class="r7 '+cls+'"><small>'+esc(kick)+'</small><b>'+esc(title)+'</b>'+[].concat(sub).map(function(x){return '<span>'+esc(x)+'</span>'}).join('')+'</li>'};
  Promise.all([fetch('/hilloulot/fr/days.json').then(function(r){return r.json()}),l==='fr'?null:fetch('/hilloulot/'+lang+'/days.json').then(function(r){return r.json()})]).then(function(R){
    var F=R[0], L=R[1]||F, out='', i, k;
    // Shabbat
    var dow=new Date(iso+'T12:00:00Z').getUTCDay();
    if(dow===5)out+=card(S.sh,S.tonight,dm(iso),'r7on');
    else if(dow===6)out+=card(S.sh,S.today,dm(iso),'r7on');
    else{var fr=add(iso,5-dow);out+=card(S.sh,t('fri',{d:fmt(fr,{day:'numeric',month:'long'})}),dans(5-dow),'')}
    // Roch Hodech : 1 ou 2 jours (le 2e jour peut être aujourd'hui)
    for(i=0;i<70;i++){k=add(iso,i);if(ev(F,k,'roch_hodech'))break}
    if(i<70){var a=k; if(i===0&&ev(F,add(k,-1),'roch_hodech'))a=add(k,-1);
      var b=ev(F,add(a,1),'roch_hodech')?add(a,1):a, nm=(ev(L,a,'roch_hodech')||ev(F,a,'roch_hodech')).t;
      var days=a===b?dm(a):l==='he'?(a.slice(5,7)===b.slice(5,7)?'ימי '+wd(a).replace('יום ','')+' ו'+wd(b).replace('יום ','')+', '+fmt(a,{day:'numeric'})+' ו־'+fmt(b,{day:'numeric',month:'long'}):dm(a)+' ו'+dm(b)):fmt(a,{weekday:'long',day:'numeric'})+S.and+dm(b);
      var when=iso>=a?S.today+' · '+(a===b?S.one:S.two):veille(a)+avant(i);
      out+=card(S.rh,nm.replace(/^(Roch Hodech|Rosh Chodesh|ראש חודש)\s*/,''),[days,when],iso>=a?'r7on':'')}
    // prochaine fête (date du premier jour, elle commence la veille au soir)
    // une « veille de » n'est pas la fête : on prend le premier vrai jour
    for(i=0;i<400;i++){k=add(iso,i);var f0=ev(F,k,'fete');if(f0&&!/^Veille/.test(f0.t))break}
    if(i<400){var e=ev(L,k,'fete')||f0, n=e.t.split(/\s*[(:—]\s*/)[0];
      out+=card(S.fete,n,i===0?[S.today,dm(k)]:[dm(k),veille(k)+avant(i)],i===0?'r7on':'')}
    box.innerHTML=out; box.hidden=false;
  }).catch(function(){});
})();

/* v7 accueil */
/* Recherche par nom : français, anglais, hébreu, translittérations (23/11/2026, demande de David). Même code à la construction et dans le navigateur. */
var R7=(function(){
  var VIDE=/^(rabbi|rabi|rav|rabenou|rebbe|reb|r|le|la|de|du|des|of|the|ben|bar|bat|fils|son|tsadik|tzadik|tsaddik|tzaddik|saint|רבי|רב|הרב|ר|בן|בר|רבנו|רבינו|האדמור|אדמור)$/;
  function mots(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f\u0591-\u05c7'’‘`"״׳“”]/g,'').toLowerCase().replace(/[^a-z\u05d0-\u05ea0-9]+/g,' ').trim().split(' ').filter(Boolean)}
  function plie(w){
    if(/[א-ת]/.test(w))return w.replace(/ך/g,'כ').replace(/ם/g,'מ').replace(/ן/g,'נ').replace(/ף/g,'פ').replace(/ץ/g,'צ').replace(/יי/g,'י').replace(/וו/g,'ו');
    return w.replace(/tch|tsch/g,'h').replace(/tz|zz/g,'ts').replace(/sch|sh|ch|kh/g,'h').replace(/ph/g,'f').replace(/ck|q/g,'k').replace(/th/g,'t').replace(/gu(?=[ei])/g,'g').replace(/ou|oo/g,'u').replace(/dj|dg/g,'g').replace(/j|y/g,'i').replace(/w/g,'v').replace(/ai|ei|ay|ey/g,'a').replace(/é|e(?=$)/g,'').replace(/(.)\1+/g,'$1').replace(/h$/,'');
  }
  var os=function(w){return w.replace(/[aeiou]/g,'')};
  function cle(s){return mots(s).filter(function(w){return !VIDE.test(w)}).map(plie).filter(Boolean)}
  function lev1(a,b){if(Math.abs(a.length-b.length)>1)return false;for(var i=0;i<a.length&&a[i]===b[i];)i++;var x=a.slice(i),y=b.slice(i);return x.slice(1)===y.slice(1)||x===y.slice(1)||x.slice(1)===y}
  function tok(q,ks){var m=9;for(var i=0;i<ks.length;i++){var k=ks[i];
    if(k===q)m=Math.min(m,0);else if(k.indexOf(q)===0)m=Math.min(m,1);
    else if(/^[ולהבמש]/.test(k)&&k.slice(1).indexOf(q)===0)m=Math.min(m,1);
    else if(q.length>3&&k.indexOf(q)>0)m=Math.min(m,3);
    else if(q.length>3&&lev1(q,k))m=Math.min(m,4);
    else if(!/[א-ת]/.test(q)&&os(q).length>2&&os(q)===os(k))m=Math.min(m,5)}
    return m}
  function note(qs,ks){var t=0;for(var i=0;i<qs.length;i++){var x=tok(qs[i],ks);if(x===9)return -1;t+=x}return t}
  return {cle:cle,note:note};
})();
/* Accueil : hiloula du jour hébreu en cours (dès le coucher du soleil à Jérusalem) + recherche par nom. 23/11/2026, demande de David. */
(function(){
  var hero=document.querySelector('.hero[data-nexts]'); if(!hero||!window.fetch)return;
  var L=document.documentElement.lang,T={fr:{jour:'Hiloula du jour',venir:'À venir',aussi:'Aussi aujourd’hui',rien:'Aucune hiloula dans la liste aujourd’hui.',fiche:'Voir la fiche'},en:{jour:'Hilloula of the day',venir:'Coming up',aussi:'Also today',rien:'No hilloula in the list today.',fiche:'See the page'},he:{jour:'הילולת היום',venir:'ההילולה הקרובה',aussi:'עוד הילולות היום',rien:'אין הילולות היום',fiche:'לדף המלא'}}[L]; if(!T)return;
  var q=function(s){return hero.querySelector(s)};
  // coucher du soleil à Jérusalem (équations NOAA), en heure universelle
  function coucher(iso){var d=new Date(iso+'T12:00:00Z'),n=Math.floor((d-Date.UTC(d.getUTCFullYear(),0,0))/864e5),g=2*Math.PI/365*(n-1+.25),eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g)),de=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g),la=31.778*Math.PI/180,ha=Math.acos(Math.cos(90.833*Math.PI/180)/(Math.cos(la)*Math.cos(de))-Math.tan(la)*Math.tan(de))*180/Math.PI;return Date.parse(iso+'T00:00:00Z')+(720-4*(35.235-ha)-eq)*6e4}
  var sim=(location.search.match(/[?&]sim=([\dT:+Z.-]+)/)||[])[1],now=sim?Date.parse(decodeURIComponent(sim)):Date.now();
  var iso=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem'}).format(new Date(now));
  if(now>=coucher(iso))iso=new Date(Date.parse(iso+'T12:00:00Z')+864e5).toISOString().slice(0,10);
  var E=function(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
  var civ=function(i){return new Intl.DateTimeFormat({fr:'fr-FR',en:'en-GB',he:'he-IL'}[L],{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(i+'T12:00:00Z'))};
  fetch(hero.dataset.hil).then(function(r){return r.json()}).then(function(H){
    var jour=H.filter(function(x){return x.i===iso}).sort(function(a,b){return b.w-a.w||b.s-a.s}),suite=H.filter(function(x){return x.i>iso}).sort(function(a,b){return a.i<b.i?-1:a.i>b.i?1:b.w-a.w||b.s-a.s})[0];
    var x=jour[0]||suite; if(!x)return;
    var h1=q('h1'),sp=hero.querySelectorAll('.meta span'),b=q('.acts .btn'),ln=q('.acts .lnk'),k=q('.kick');
    h1.textContent=x.n;h1.removeAttribute('aria-label');h1.classList.remove('st','st-on'); if(q('.hn'))q('.hn').textContent=L==='he'?'':x.h;
    k.textContent=jour.length?T.jour:T.venir;
    if(sp[0])sp[0].innerHTML='<b></b>',sp[0].firstChild.textContent=x.d; if(sp[1])sp[1].textContent=civ(x.i); if(sp[2])sp[2].textContent=x.p||'';
    if(b){b.href=x.u;b.firstChild.nodeValue=x.f?b.firstChild.nodeValue:T.fiche} if(ln){ln.href=x.u+'#acces';ln.hidden=!x.f}
    var cd=q('[data-cd]'),eve=q('.eve');
    if(jour.length){hero.classList.add('jour7');if(cd)cd.hidden=true;if(eve)eve.hidden=true}
    else{if(cd)cd.dataset.cd=x.i+'T00:00:00+02:00';if(eve)eve.textContent=T.rien}
    // fond : photo du tsadik ; sinon essai comparé 90 % Kotel / 10 % kever de Rabbi Israël, tirage gardé par visiteur
    var bg=q('.bg img'),g='';if(!x.b){try{g=localStorage.getItem('fond7')}catch(e){}if(g!=='k'&&g!=='s'){g=Math.random()<.9?'k':'s';try{localStorage.setItem('fond7',g)}catch(e){}}var fo=(location.search.match(/[?&]fond=([ks])/)||[])[1];if(fo)g=fo}
    var KO=null;if(!x.b&&g!=='s'){var KS=JSON.parse(hero.dataset.kotel),kf=(location.search.match(/[?&]k=(\d)/)||[])[1],ki=kf?+kf:0;if(!kf){try{ki=(+(localStorage.getItem('kot7')||Math.floor(Math.random()*KS.length))+1)%KS.length;localStorage.setItem('kot7',ki)}catch(e){ki=Math.floor(Math.random()*KS.length)}}KO=KS[ki]||KS[0]}var ph=x.b||(g==='s'?hero.dataset.saba:KO.s);if(bg&&ph){var pre=new Image();pre.onload=function(){bg.src=ph;hero.classList.add('fond7');hero.classList.toggle('sab7',g==='s');hero.classList.toggle('kot7',g==='k');bg.style.setProperty('--kb',KO&&KO.j||.95)};pre.src=ph}
    var cf=document.querySelector('.crf7');if(cf&&g){cf.hidden=false;var ca=cf.querySelector('a');if(g==='s'){ca.textContent=hero.dataset.sabat;ca.href=hero.dataset.sabal}else if(KO&&KO.l){ca.textContent='Photo : '+KO.a;ca.href=KO.l}}
    if(g&&!fo&&!sim&&!navigator.webdriver&&navigator.sendBeacon){var vu=0,t0=document.hidden?0:Date.now(),fini=0,envoi=function(){if(fini)return;if(t0){vu+=Date.now()-t0;t0=0}if(vu<1000)return;fini=1;navigator.sendBeacon('https://hilloulot.dreamnovamcp.com/mesure',JSON.stringify({v:g,s:Math.min(1800,Math.round(vu/1000))}))};document.addEventListener('visibilitychange',function(){if(document.hidden){if(t0){vu+=Date.now()-t0;t0=0}}else if(!fini)t0=Date.now()});addEventListener('pagehide',envoi)}
    var ul=E('ul','au7');
    if(jour.length>1){var li=E('li','au7t',T.aussi);ul.appendChild(li);jour.slice(1,9).forEach(function(y){var l=E('li'),a=E('a','',y.n);a.href=y.u;l.appendChild(a);ul.appendChild(l)})}
    if(jour.length&&suite){var s=E('li','au7s');s.appendChild(E('span','',T.venir+' · '+suite.d.replace(/ 5787| תשפ״ז/,'')+' '));var sa=E('a','',suite.n);sa.href=suite.u;s.appendChild(sa);ul.appendChild(s)}
    var vieux=q('.au7');if(vieux)vieux.remove(); if(ul.children.length)q('.acts').insertAdjacentElement('afterend',ul);
  }).catch(function(){});
  // recherche
  var f=document.querySelector('[data-rc7]');if(!f)return;var inp=f.querySelector('input'),ul=f.querySelector('ul'),D=null,act=-1,cur=[];
  function charge(){return D?Promise.resolve(D):fetch(hero.dataset.hil).then(function(r){return r.json()}).then(function(H){H.forEach(function(x){x.c=R7.cle(x.k)});return D=H})}
  function montre(){var qs=R7.cle(inp.value);if(!inp.value.trim()||!qs.length){ul.hidden=true;inp.setAttribute('aria-expanded','false');return}
    charge().then(function(H){var r=H.map(function(x){return [R7.note(qs,x.c),x]}).filter(function(x){return x[0]>=0}).sort(function(a,b){return a[0]-b[0]||b[1].s-a[1].s}).slice(0,8);cur=r.map(function(x){return x[1]});act=-1;ul.textContent='';
      if(!cur.length){ul.appendChild(E('li','rc7v',f.dataset.vide))}
      cur.forEach(function(x,i){var l=E('li');l.id='rc7-'+i;l.setAttribute('role','option');var a=E('a');a.href=x.u;a.tabIndex=-1;if(x.t){var im=E('img');im.src=x.t;im.alt='';im.width=44;im.height=44;a.appendChild(im)}else{a.appendChild(E('i'))}var d=E('span');d.appendChild(E('b','',x.n));d.appendChild(E('small','',x.d.replace(/ 5787| תשפ״ז/,'')+(x.p?' · '+x.p:'')));a.appendChild(d);l.appendChild(a);ul.appendChild(l)});
      ul.hidden=false;inp.setAttribute('aria-expanded','true')})}
  inp.addEventListener('focus',charge);inp.addEventListener('input',montre);
  inp.addEventListener('keydown',function(e){var n=cur.length;if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!n)return;e.preventDefault();act=(act+(e.key==='ArrowDown'?1:n-1)+(act<0&&e.key==='ArrowUp'?1:0))%n;[].forEach.call(ul.children,function(l,i){l.classList.toggle('on',i===act);l.setAttribute('aria-selected',i===act)});inp.setAttribute('aria-activedescendant','rc7-'+act)}else if(e.key==='Escape'){ul.hidden=true;inp.setAttribute('aria-expanded','false')}});
  f.addEventListener('submit',function(e){e.preventDefault();if(!inp.value.trim())return;charge().then(function(){montre();setTimeout(function(){var x=cur[Math.max(act,0)];if(x)location.href=x.u},60)})});
  document.addEventListener('click',function(e){if(!f.contains(e.target))ul.hidden=true});
})();
/* Roue : en haut par défaut (David, 23/11 19 h 39 : « Le B c'est mieux ») · ?proto=a la met en bas · ?proto=0 pour la retirer. Gardé le temps de la visite. */
(function(){
  var q=(location.search.match(/[?&]proto=([ab0])/)||[])[1],P;try{if(q)sessionStorage.setItem('proto7',q);P=sessionStorage.getItem('proto7')}catch(e){P=q}
  if(!P)P='b';if(P!=='a'&&P!=='b')return;var H=document.documentElement,L=H.lang,rtl=H.dir==='rtl';H.classList.add('pr7','pr7'+P);
  var mn=document.querySelector('.mnav'),br=document.querySelector('.brand');if(!mn)return;
  var T={fr:['Agenda','Rayons','Mon espace','Accueil','Pourquoi ce site'],en:['Agenda','Categories','My space','Home','Why this site'],he:['לוח וזמנים','כל הקטגוריות','האזור האישי','דף הבית','למה הוקם האתר?']}[L]||['Agenda','Rayons','Mon espace','Accueil'];
  var base=br?br.getAttribute('href'):'./',it=[[T[3],base]].concat([].map.call(mn.querySelectorAll('a'),function(a){return [a.textContent.trim(),a.getAttribute('href')]}),[[T[0],base+'agenda/'],[T[1],base+'rayons/'],[T[2],'https://hilloulot.dreamnovamcp.com/'],[T[4],'#pourquoi']]);
  var nav=document.createElement('nav');nav.className='roue7';nav.setAttribute('aria-label',br?br.textContent:'');var cyl=document.createElement('div');cyl.className='cyl7';nav.appendChild(cyl);var lens=document.createElement('i');lens.className='len7';lens.setAttribute('aria-hidden','true');nav.appendChild(lens);
  var ici=location.pathname.replace(/index\.html$/,''),N=it.length,A=360/N,cur=0,els=it.map(function(x,i){var a=document.createElement('a');a.href=x[1];a.textContent=x[0];a.draggable=false;try{if(x[1][0]!=='#'&&new URL(a.href).pathname===ici&&new URL(a.href).host===location.host){cur=i;a.setAttribute('aria-current','page')}}catch(e){}cyl.appendChild(a);return a});
  if(!cyl.querySelector('[aria-current]')){var fi=/\/t\/|\/\d\d_/.test(ici)?'tsadikim/':/\/torah\//.test(ici)?'torah/':'';if(fi)els.forEach(function(a,i){if(a.getAttribute('href').slice(-fi.length)===fi)cur=i})}  // une fiche de tsadik appartient à « Tsadikim »
  var tk=[];for(var k=0;k<N*6;k++){var t=document.createElement('s');t.setAttribute('aria-hidden','true');if(k%6===0)t.className='gr';cyl.appendChild(t);tk.push(t)}
  (P==='b'?document.querySelector('.hdr'):document.body).insertAdjacentElement(P==='b'?'afterend':'beforeend',nav);
  // Menu aimanté (David, 23/11 19 h 17) : l’arrêt sur un mot ouvre la page, le toucher l’ouvre tout de suite ; la sensation de la roue ne change pas (David, 19 h 18).
  var ARRET=550,SURVOL=650,ang=-cur*A,v=0,raf=0,dr=null,bouge=0,dern=cur,geste=false,tm=0,sv=0,svi=-1,rm=matchMedia('(prefers-reduced-motion: reduce)').matches,sens=rtl?-1:1;
  var jauge=document.createElement('b');jauge.className='jg7';lens.appendChild(jauge);
  function larg(){return nav.clientWidth}
  function ecart(i){return ((ang+i*A)%360+540)%360-180}
  function rendu(){var R=Math.max(196,Math.min(larg()*.54,400)),c=Math.PI/180;
    els.forEach(function(e,i){var a=ecart(i),x=Math.sin(a*c)*R*sens,z=Math.cos(a*c),k=Math.max(0,z);e.style.transform='translate(-50%,-50%) translateX('+x.toFixed(1)+'px) rotateY('+(a*.82*sens).toFixed(1)+'deg) scale('+(.62+.38*k).toFixed(3)+')';e.style.opacity=k<.12?0:(Math.pow(k,1.15)).toFixed(2);e.style.pointerEvents=k<.3?'none':'';e.classList.toggle('on',Math.abs(a)<A/2)});
    tk.forEach(function(t,i){var a=((ang+i*A/6)%360+540)%360-180,z=Math.cos(a*c);t.style.transform='translateX('+(Math.sin(a*c)*R*1.02*sens).toFixed(1)+'px)';t.style.opacity=z<.1?0:(z*z*.8).toFixed(2)});
    var n=((Math.round(-ang/A)%N)+N)%N;if(n!==dern){dern=n;if(dr&&navigator.vibrate)try{navigator.vibrate(7)}catch(e){}}}
  function pas(){raf=0;if(dr)return;var fini=false;if(Math.abs(v)>.06){ang+=v;v*=.945;if(Math.abs(v)<.9)v+=(Math.round(ang/A)*A-ang)*.018}else{var d=Math.round(ang/A)*A-ang;v=0;if(Math.abs(d)<.05){ang+=d;fini=true}else ang+=d*(rm?1:.16)}
    if(geste&&Math.abs(v)<.5&&Math.abs(Math.round(ang/A)*A-ang)<1.5){dern=((Math.round(-ang/A)%N)+N)%N;repos()}rendu();if(!fini)raf=requestAnimationFrame(pas)}
  function part(){if(!raf)raf=requestAnimationFrame(pas)}
  function va(i){var d=((-i*A-ang)%360+540)%360-180,f=ang+d,q=ang,t0=performance.now();v=0;cancelAnimationFrame(raf);(function g(t){var p=rm?1:Math.min(1,Math.max(0,(t-t0)/420)),e=1-Math.pow(1-p,3);ang=q+d*e;rendu();if(p<1)raf=requestAnimationFrame(g);else{ang=f;raf=0}})(t0)}
  function annule(){clearTimeout(tm);tm=0;lens.classList.remove('att')}
  function ouvre(i){annule();finSurvol();var a=els[i];if(a.getAttribute('aria-current')&&!location.hash)return;if(a.getAttribute('href')==='#pourquoi'){window.__pref7&&window.__pref7();va(cur);return}location.href=a.href}
  function prepare(i){var h=els[i].href;if(els[i].getAttribute('href')[0]==='#'||new URL(h).host!==location.host)return;var l=document.createElement('link');l.rel='prefetch';l.href=h;document.head.appendChild(l)}
  function repos(){if(!geste)return;geste=false;var i=dern;if(els[i].getAttribute('aria-current'))return;annule();prepare(i);void lens.offsetWidth;lens.classList.add('att');tm=setTimeout(function(){ouvre(i)},ARRET)}
  function finSurvol(){clearTimeout(sv);sv=0;if(svi>=0)els[svi].classList.remove('sur7');svi=-1;}
  nav.addEventListener('pointerdown',function(e){if(e.button)return;annule();finSurvol();dr={x:e.clientX,t:e.timeStamp,id:e.pointerId};bouge=0;v=0;cancelAnimationFrame(raf);raf=0});
  addEventListener('pointermove',function(e){
    if(!dr){if(e.pointerType==='mouse')survol(e);return}
    if(e.pointerId!==dr.id)return;var dx=e.clientX-dr.x,dt=Math.max(1,e.timeStamp-dr.t);if(!dx)return;bouge+=Math.abs(dx);if(bouge>5&&!nav.hasPointerCapture(e.pointerId))try{nav.setPointerCapture(e.pointerId)}catch(_){}var da=dx*sens*(A/Math.min(128,larg()*.3));ang+=da;v=v*.5+.5*(da*16/dt);dr.x=e.clientX;dr.t=e.timeStamp;rendu()},{passive:true});
  function survol(e){var r=nav.getBoundingClientRect();if(e.clientY<r.top-34||e.clientY>r.bottom+34){if(svi>=0)finSurvol();return}
    var best=-1,bd=74,cx,cy=r.top+r.height*.44,R=Math.max(196,Math.min(larg()*.54,400));els.forEach(function(a,i){var an=ecart(i);if(Math.cos(an*Math.PI/180)<.3)return;var x=r.left+r.width/2+Math.sin(an*Math.PI/180)*R*sens,d=Math.abs(e.clientX-x);if(d<bd){bd=d;best=i;cx=x}});
    if(best<0){finSurvol();return}if(best!==svi)finSurvol();
    if(svi!==best&&e.clientY>=r.top&&e.clientY<=r.bottom&&bd<52&&!els[best].getAttribute('aria-current')){svi=best;prepare(best);els[best].classList.add('sur7');sv=setTimeout(function(){ouvre(best)},SURVOL)}}
  document.documentElement.addEventListener('mouseleave',finSurvol);
  function fin(e){if(!dr||e.pointerId!==dr.id)return;if(e.timeStamp-dr.t>90)v=0;v=Math.max(-26,Math.min(26,v));dr=null;if(bouge>5)geste=true;part()}
  addEventListener('pointerup',fin);addEventListener('pointercancel',fin);
  nav.addEventListener('click',function(e){var a=e.target.closest('a');if(bouge>5){e.preventDefault();return}if(!a||!e.detail||e.metaKey||e.ctrlKey)return;e.preventDefault();var i=els.indexOf(a);geste=false;va(i);setTimeout(function(){ouvre(i)},a.classList.contains('on')||rm?0:230)},true);
  nav.addEventListener('wheel',function(e){var d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;e.preventDefault();annule();finSurvol();ang-=d*.12;v=0;geste=true;part()},{passive:false});
  nav.addEventListener('focusin',function(e){if(e.target.matches(':focus-visible')){annule();va(els.indexOf(e.target))}});
  nav.addEventListener('keydown',function(e){annule();var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();var n=(els.indexOf(document.activeElement)+d*sens+N)%N;els[n].focus({preventScroll:true});va(n)});
  document.addEventListener('visibilitychange',function(){if(document.hidden){annule();finSurvol()}});addEventListener('pageshow',function(e){if(e.persisted){annule();geste=false;va(cur)}});
  addEventListener('resize',rendu);rendu();
})();

// Bougies : rangée filmée dans les bandeaux, bougie à allumer sur chaque fiche (compteur gardé par hilloulot.dreamnovamcp.com), son au toucher seulement.
(function(){
var B='/hilloulot/img/bougie/',API='https://hilloulot.dreamnovamcp.com/bougie',L=document.documentElement.lang||'fr',RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var T={fr:{a:'Allumer une bougie',o:'Votre bougie est allumée',z:'Allumez la première bougie',n:function(n){return n===1?'1 personne a allumé une bougie':n.toLocaleString('fr')+' personnes ont allumé une bougie'},p:'Vous êtes la première personne à allumer une bougie ici',s:'Partager',c:'Lien copié',t:'J’allume une bougie 🕯️ pour la Hiloula '},
en:{a:'Light a candle',o:'Your candle is lit',z:'Light the first candle',n:function(n){return n===1?'1 person has lit a candle':n.toLocaleString('en')+' people have lit a candle'},p:'You are the first to light a candle here',s:'Share',c:'Link copied',t:'I’m lighting a candle 🕯️ for the Hilloula of '},
he:{a:'הדליקו נר',o:'הנר שלכם דולק',z:'עדיין לא הודלק כאן נר. היו הראשונים להדליק',n:function(n){return n===1?'אדם אחד הדליק נר':n===2?'שני אנשים הדליקו נר':n.toLocaleString('he')+' אנשים הדליקו נר'},p:'אתם הראשונים להדליק כאן נר',s:'שיתוף',c:'הקישור הועתק',t:'הדלקתי נר 🕯️ לכבוד הילולת '}}[L]||null;if(!T)return;
function g(k){try{return localStorage.getItem(k)}catch(e){return null}}function p(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function E(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
function vid(src,poster,c){var v=E('video',c);v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute('playsinline','');v.preload='none';v.poster=poster;v.src=src;v.setAttribute('aria-hidden','true');v.tabIndex=-1;return v}
var io='IntersectionObserver'in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var q=e.target.play();q&&q.catch(function(){})}else e.target.pause()})}):null;
function boucle(v){v.loop=true;if(io)io.observe(v);else v.autoplay=true}
// rangée filmée
document.querySelectorAll('.candles.hc,.candles.icdl').forEach(function(c){c.textContent='';c.classList.add('ra7');if(RM){var i=E('img');i.src=B+'rangee.webp';i.alt='';c.appendChild(i)}else{var v=vid(B+'rangee.mp4',B+'rangee.webp');c.appendChild(v);boucle(v)}});
// son : souffle d'allumage, et deux notes douces pour la première personne
var AC;function son(premier){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume();var t=AC.currentTime+.02,n=AC.sampleRate*.9|0,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1);
var s=AC.createBufferSource(),f=AC.createBiquadFilter(),a=AC.createGain();s.buffer=b;f.type='bandpass';f.Q.value=.8;f.frequency.setValueAtTime(260,t);f.frequency.exponentialRampToValueAtTime(1500,t+.16);f.frequency.exponentialRampToValueAtTime(380,t+.85);a.gain.setValueAtTime(.0001,t);a.gain.exponentialRampToValueAtTime(.16,t+.09);a.gain.exponentialRampToValueAtTime(.0001,t+.85);s.connect(f);f.connect(a);a.connect(AC.destination);s.start(t);
(premier?[523.25,659.25,783.99,1046.5]:[]).forEach(function(h,i){var o=AC.createOscillator(),k=AC.createGain(),u=t+.35+i*.15;o.type='sine';o.frequency.value=h;k.gain.setValueAtTime(.0001,u);k.gain.exponentialRampToValueAtTime(.07,u+.02);k.gain.exponentialRampToValueAtTime(.0001,u+1.5);o.connect(k);k.connect(AC.destination);o.start(u);o.stop(u+1.6)})}catch(e){}}
window.__son7=son;
function objet(allumee){var o=E('span','ob7');var i0=E('img','b0');i0.src=B+'bougie_0.webp';i0.alt='';var i1=E('img','b1');i1.src=B+'bougie_1.webp';i1.alt='';o.append(i0,i1);var va,vb;
 function flamme(){if(RM)return;if(!vb){vb=vid(B+'bougie_b.mp4',B+'bougie_1.webp','vb');o.appendChild(vb);boucle(vb)}}
 o.allume=function(anime){if(anime&&!RM){va=vid(B+'bougie_a.mp4',B+'bougie_0.webp','va');o.appendChild(va);flamme();o.classList.add('va7');va.onended=function(){o.classList.remove('va7');o.classList.add('on');va.remove()};va.onerror=va.onended;var q=va.play();q&&q.catch(function(){va.onended()})}else{o.classList.add('on');flamme()}};
 o.eteint=function(){o.classList.remove('on','va7');if(vb){vb.remove();vb=null}};if(allumee)o.allume();return o}
// grande bougie du jour (accueil, Aujourd'hui) : même objet, même geste
document.querySelectorAll('.bigcandle').forEach(function(b){var f=b.querySelector('.flame'),s=b.querySelector('.stick');if(!f)return;var o=objet(b.classList.contains('on'));f.replaceWith(o);s&&s.remove();b.classList.add('bc7');var der=b.classList.contains('on');
 new MutationObserver(function(){var on=b.classList.contains('on');if(on===der)return;der=on;if(on){o.allume(b.matches(':focus,:hover'));}else o.eteint()}).observe(b,{attributes:true,attributeFilter:['class']});b.addEventListener('click',function(){if(b.classList.contains('on'))son()})});
// bougie d'une fiche
function vis(){var v=g('vis7');if(!/^[0-9a-f]{32}$/.test(v||'')){v=Array.from(crypto.getRandomValues(new Uint8Array(16)),function(x){return('0'+x.toString(16)).slice(-2)}).join('');p('vis7',v)}return v}
document.querySelectorAll('.bo7').forEach(function(z){var s=z.dataset.s,k='bo7-'+s,on=g(k)==='1',bt=E('button','bt7');bt.type='button';bt.setAttribute('aria-pressed',on);var o=objet(on),lb=E('span','lb7',on?T.o:T.a);bt.append(o,lb);var n=E('p','nb7');n.setAttribute('aria-live','polite');n.textContent=' ';var sh=E('button','pa7',T.s);sh.type='button';sh.hidden=!on;z.append(bt,n,sh);var N=null;z.id='bougie';var d0=document.querySelector('.f7h .do,.fhero .do,.hero .do');if(d0&&!d0.querySelector('.lb0')){var l0=E('a','btn lb0',T.a);l0.href='#bougie';l0.addEventListener('click',function(e){e.preventDefault();z.scrollIntoView({behavior:RM?'auto':'smooth',block:'center'});bt.focus({preventScroll:true})});d0.appendChild(l0)}  // la bougie est après le texte : un bouton y mène depuis le haut
 function compte(x){N=x;n.textContent=x?T.n(x):T.z}
 function envoi(){return fetch(API,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({s:s,v:vis()})}).then(function(r){if(!r.ok)throw 0;return r.json()})}
 var dejaVu=false;function charge(){if(dejaVu)return;dejaVu=true;fetch(API+'?s='+encodeURIComponent(s)).then(function(r){return r.ok?r.json():null}).then(function(d){if(d&&N===null)compte(d.n)}).catch(function(){})}charge();
 bt.addEventListener('click',function(){if(on)return;on=true;bt.setAttribute('aria-pressed','true');lb.textContent=T.o;o.allume(true);son();p(k,'1');sh.hidden=false;
  envoi().then(function(d){compte(d.n);z.classList.add('mo7');if(d.premier)premier()}).catch(function(){if(N!==null)compte(N+1)})});
 function premier(){setTimeout(function(){son(true)},900);var c=E('div','co7');c.setAttribute('role','status');c.innerHTML='<svg viewBox="0 0 100 92" aria-hidden="true"><path pathLength="1" d="M50 86C22 66 8 50 8 31 8 17 18 8 30 8c9 0 16 5 20 13C54 13 61 8 70 8c12 0 22 9 22 23 0 19-14 35-42 55Z"/></svg>';c.appendChild(E('p','',T.p));for(var i=0;i<14&&!RM;i++){var e=E('i');e.style.cssText='--x:'+(Math.random()*240-120).toFixed(0)+'px;--y:'+(-60-Math.random()*150).toFixed(0)+'px;--d:'+(.9+Math.random()*.9).toFixed(2)+'s';c.appendChild(e)}z.appendChild(c);setTimeout(function(){c.classList.add('fi')},6500);setTimeout(function(){c.remove()},7600)}
 sh.addEventListener('click',function(){var d={title:z.dataset.n,text:T.t+(L==='fr'?z.dataset.n.replace(/^Le /,'du ').replace(/^Les /,'des ').replace(/^La /,'de la ').replace(/^(?!du |des |de la )/,/^[AEIOUÉÈÊÂÎÔ]/i.test(z.dataset.n)?'d’':'de '):z.dataset.n),url:location.origin+location.pathname+'?v='+(window.VER7||1)};if(navigator.share)navigator.share(d).catch(function(){});else if(navigator.clipboard)navigator.clipboard.writeText(d.text+' '+d.url).then(function(){sh.textContent=T.c;setTimeout(function(){sh.textContent=T.s},2200)})})});
// nom en feu (Mickaël, 23/11 22 h 54) : flammes filmées en image animée, jamais bloquée par le téléphone ; lettres en vrai texte par-dessus
function feu(el,arret){var i=E('img','feu7');i.alt='';i.decoding='async';i.setAttribute('aria-hidden','true');i.src=B+'feu_'+(window.NOM7||'tsadik')+(L==='he'?'_he':'')+(RM||arret?'_f':'')+'.webp';el.classList.add('fe7');el.appendChild(i);return i}
document.querySelectorAll('.hdr .brand .lg7').forEach(function(e){feu(e)});
// entrée : les bougies s'allument, des étincelles montent, le nom prend feu
(function(){var it=document.getElementById('intro'),n=it&&it.querySelector('.iname');if(!n)return;var t=n.textContent.trim();n.textContent='';var s=E('span','in7');s.appendChild(E('b','',t));s.appendChild(E('i','',t));n.appendChild(s);feu(s);it.classList.add('en7');
 for(var k=0;k<22;k++){var e=E('em','et7');e.style.cssText='left:'+(12+76*(k*.618%1)).toFixed(1)+'%;--x:'+((.5-(k*.618%1))*34).toFixed(0)+'vw;animation-delay:'+(1.5+k*.07).toFixed(2)+'s';it.appendChild(e)}})();
})();

// Accueil, à la place de « Quinze tsadikim, quinze films » (Mickaël, 24/11 07:17) : les hilloulot de ce soir, de demain, des jours suivants, et celles qui sont passées.
(function(){var box=document.querySelector('[data-suite7]');if(!box)return;var l=document.documentElement.lang,T={fr:{td:'Aujourd’hui',ts:'Ce soir et demain',ap:'Après-demain',h:'Hier',ah:'Avant-hier',a:'À venir',p:'Passées',v:'Voir la fiche',n:'Pas de hiloula sur le site ce jour-là',c:function(n){return n+(n>1?' tsadikim':' tsadik')}},en:{td:'Today',ts:'Tonight and tomorrow',ap:'In two days',h:'Yesterday',ah:'Two days ago',a:'Coming up',p:'Past',v:'See the page',n:'No hilloula on the site that day',c:function(n){return n+(n>1?' tzaddikim':' tzaddik')}},he:{td:'היום',ts:'הערב ומחר',ap:'מחרתיים',h:'אתמול',ah:'שלשום',a:'ההילולות הבאות',p:'ההילולות שעברו',v:'לדף הצדיק',n:'אין הילולה באתר ביום זה',c:function(n){return n>1?n+' צדיקים':'צדיק אחד'}}}[l];if(!T)return;
var J=864e5,iso=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem'}).format(new Date()),add=function(n){return new Date(Date.parse(iso+'T12:00:00Z')+n*J).toISOString().slice(0,10)},civ=function(k){return new Intl.DateTimeFormat(window.LOCALE||l,{timeZone:'UTC',weekday:'long',day:'numeric',month:'long'}).format(new Date(k+'T12:00:00Z'))};
function E(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
Promise.all(['days','hil'].map(function(f){return fetch('/'+l+'/'+f+'.json').then(function(r){return r.json()})})).then(function(R){var D=R[0],H={};R[1].forEach(function(x){H[x.u]=x});
 var nav=E('div','su7n'),ba=E('button','',T.a),bp=E('button','',T.p),bande=E('div','su7b'),liste=E('div','su7l'),sens=1;[ba,bp].forEach(function(b){b.type='button';nav.appendChild(b)});bande.setAttribute('role','group');liste.setAttribute('aria-live','polite');box.append(nav,bande,liste);
 function jours(){var o=[],n;for(n=sens>0?0:1;n<(sens>0?22:22);n++){var k=add(n*sens);if(D[k])o.push([n*sens,k])}return o}
 function nom(n,k){return n===0?T.td:n===1?T.ts:n===2?T.ap:n===-1?T.h:n===-2?T.ah:civ(k).split(/[ ,]/)[l==='he'?1:0]}
 function hil(k){return D[k].e.filter(function(e){return e.c==='hil'&&e.u})}
 function montre(k,b){bande.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});liste.textContent='';var L=hil(k);var t=E('p','su7t',D[k].h+' · '+civ(k));liste.appendChild(t);if(!L.length)liste.appendChild(E('p','su7v',T.n));
  L.forEach(function(e,i){var x=H[e.u]||{},a=E('a','su7c');a.href=e.u;a.style.setProperty('--i',i);var f=E('span','su7i');if(x.b){var im=E('img');im.src=x.b.replace(/(\/ph\/[^/]+)(?<!_s)\.webp$/,'$1_s.webp');im.alt='';im.loading='lazy';im.decoding='async';im.onerror=function(){this.remove()};f.appendChild(im)}a.appendChild(f);var d=E('span','su7d');d.appendChild(E('b','',e.t));if(l!=='he'&&x.h)d.appendChild(E('span','su7h',x.h)).lang='he';if(x.r)d.appendChild(E('span','su7r',x.r));if(e.pl)d.appendChild(E('small','',e.pl));d.appendChild(E('em','',T.v));a.appendChild(d);liste.appendChild(a)})}
 function dessine(){ba.setAttribute('aria-pressed',sens>0);bp.setAttribute('aria-pressed',sens<0);bande.textContent='';var P=null;jours().forEach(function(j,i){var n=hil(j[1]).length,b=E('button','su7j');b.type='button';b.append(E('small','',nom(j[0],j[1])),E('b','',D[j[1]].h.replace(/ (5\d{3}|תשפ״[א-ת])$/,'')));var fl=E('span','su7f');fl.setAttribute('aria-hidden','true');for(var q=0;q<Math.min(n,5);q++)fl.appendChild(E('i'));b.append(fl,E('span','su7k',n?T.c(n):'—'));b.onclick=function(){montre(j[1],b);b.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})};bande.appendChild(b);if(!P||(sens>0&&i===1))P=[j[1],b]});bande.scrollLeft=0;if(P)montre(P[0],P[1])}
 ba.onclick=function(){sens=1;dessine()};bp.onclick=function(){sens=-1;dessine()};dessine();box.hidden=false}).catch(function(){})})();
// bouton WhatsApp : libellé en haut de page, puis l'icône seule dès qu'on descend (il ne couvre pas le texte)
(function(){var w=document.querySelector('.wa7');if(!w)return;var fini=false;setTimeout(function(){fini=true;w.classList.add('petit')},7000);var f=function(){w.classList.toggle('petit',fini||scrollY>260)};addEventListener('scroll',f,{passive:true});f()})();

// Filtres du calendrier : chaque filtre agit sur tout (grandes lignes illustrées comprises), les jours et les mois vides disparaissent, le nombre est dit, et on voit le résultat tout de suite.
(function(){var cal=document.getElementById('cal');if(!cal)return;var g=document.querySelector('.chips');if(!g)return;var L=document.documentElement.lang,
T={fr:function(n){return n?n+(n>1?' dates':' date'):'Aucune date dans cette catégorie pour cette période.'},en:function(n){return n?n+(n>1?' dates':' date'):'No date in this category for this period.'},he:function(n){return n?(n===1?'תאריך אחד':n+' תאריכים'):'אין תאריכים בקטגוריה זו בתקופה זו.'}}[L];
var m=document.createElement('p');m.className='cf7';m.setAttribute('role','status');cal.before(m);
function applique(f,voir){var n=0;cal.querySelectorAll('.row').forEach(function(r){r.classList.toggle('hide',f!=='all'&&f!=='hil')});
 cal.querySelectorAll('.ev[data-c]').forEach(function(e){var h=f!=='all'&&e.dataset.c!==f;e.classList.toggle('hide',h);if(!h)n++});
 cal.querySelectorAll('.dl').forEach(function(d){d.classList.toggle('hide',!d.querySelector('.ev[data-c]:not(.hide)'))});
 cal.querySelectorAll('.dbd').forEach(function(d){if(f!=='all')d.open=true;d.classList.toggle('hide',!d.querySelector('.dl:not(.hide)'));var s=d.querySelector('summary');if(s){s.dataset.t=s.dataset.t||s.textContent;s.textContent=f==='all'?s.dataset.t:s.dataset.t.replace(/\d+/,d.querySelectorAll('.dl:not(.hide)').length)}});
 cal.querySelectorAll('.mblock').forEach(function(b){b.classList.toggle('hide',f!=='all'&&!b.querySelector('.row:not(.hide),.dl:not(.hide)'))});
 m.textContent=f==='all'?'':T(n);cal.querySelectorAll('.rv').forEach(function(x){x.classList.add('in')});window.ScrollTrigger&&ScrollTrigger.refresh();
 if(voir){var y=m.getBoundingClientRect().top+scrollY-(document.querySelector('.hdr')||{offsetHeight:70}).offsetHeight-(document.documentElement.classList.contains('pr7b')?90:14);scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})}}
g.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){applique(b.dataset.f,b.dataset.f!=='all')})});
var a=g.querySelector('[aria-pressed=true]');if(a&&a.dataset.f!=='all')applique(a.dataset.f);
})();

window.PREF7={"c":[{"he":"שֶׁכָּל יַהֲדוּתוֹ תָּלוּי בָּזֶה, כְּגוֹן לִנְסֹעַ לְצַדִּיק אֲמִתִּי","ref":{"fr":"Likoutey Moharan I, 66, 4","en":"Likutey Moharan I, 66:4","he":"ליקוטי מוהר\"ן א, סו, ד"},"u":"https://www.sefaria.org/Likutei_Moharan.66.4.6"},{"he":"כִּי אִיתָא בְּדִבְרֵי רַבֵּנוּ זַ\"ל עַל פָּסוּק אֵלֶּה מַסְעֵי בְּנֵי יִשְֹרָאֵל (סִימָן מ) שֶׁכָּל הַנְּסִיעוֹת הֵם בִּשְׁבִיל פְּגַם עֲבוֹדָה-זָרָה דְּהַיְנוּ קִלְקוּל הָאֱמוּנָה, בִּשְׁבִיל זֶה צְרִיכִין לִנְסֹעַ וּלְטַלְטֵל, וְעַל-יְדֵי הַנְּסִיעוֹת וְהַטִלְטוּלִים מְכַפְּרִים עַל פְּגַם עֲבוֹדָה-זָרָה פְּגַם הָאֱמוּנָה וְכוּ' עַיֵּן שָׁם","ref":{"fr":"Likoutey Halakhot, Érouvé Te’houmin 3, 1 · sur le Likoutey Moharan I, 40","en":"Likutey Halakhot, Eruvei Techumin 3:1 · on Likutey Moharan I, 40","he":"ליקוטי הלכות, עירובי תחומין ג, א · על ליקוטי מוהר\"ן א, מ"},"u":"https://www.sefaria.org/Likutei_Halakhot%2C_Orach_Chaim%2C_Laws_of_Joining_Domains_3%3A1%3A1"},{"he":"אֲבָל אַל יָשִׂים מֲגָמָתוֹ נֶגֶד הַמֵּתִים הַשּׁוֹכְנִים שָׁם, כִּי קָרוֹב הַדָּבָר שֶׁיִּהְיֶה בִּכְלָל וְדוֹרֵשׁ אֶל הַמֵּתִים. אַךְ יְבַקֵּשׁ מֵהַשֵּׁם, יִתְבָּרַךְ שְׁמוֹ, שֶׁיְרַחֵם עָלָיו בִּזְכוּת הַצַּדִּיקִים שׁוֹכְנֵי עָפָר","en":"But it should not be your intention to appeal to the dead who rest there, for that would be tantamount to \"Inquiring of the dead,\" (Deuteronomy 18:11), which is forbidden, but you should ask of Hashem, blessed is His name, to have mercy on you for the sake of the tzaddikim who rest in the dust.","cr":"Rabbi Avrohom Davis, Metsudah Publications, 1996 · CC-BY","ref":{"fr":"Kitsour Choul’han Aroukh 128, 13 · voir Michna Beroura 581, 27","en":"Kitzur Shulchan Aruch 128:13 · see Mishnah Berurah 581:27","he":"קיצור שולחן ערוך קכח, יג · עיין משנה ברורה תקפא, כז"},"u":"https://www.sefaria.org/Kitzur_Shulchan_Arukh.128.13"}],"t":{"fr":["Pourquoi ce site","Depuis toujours, Israël monte sur les tombes des justes. Le jour de leur hilloula, on vient prier, allumer une bougie, donner un peu de tsédaka. Ce site rassemble ces jours et ces lieux, pour que chacun trouve sa route.","[CITATION 1]","[CITATION 2]","Nous ne prions pas le tsadik. Nous prions Hachem, Lui seul, et nous Lui demandons d'avoir pitié de nous par le mérite du juste. C'est ce qu'enseigne la loi juive :","[CITATION 3]"],"en":["Why this site","For generations, the Jewish people have gone up to the graves of the righteous. On the day of their hillula, we come to pray, light a candle, and give a little tzedakah. This site gathers those days and places, so everyone can find the way.","[CITATION 1]","[CITATION 2]","We do not pray to the tzaddik. We pray to Hashem alone, and ask Him to have mercy on us in the merit of the righteous. As Jewish law teaches:","[CITATION 3]"],"he":["למה הוקם האתר הזה?","[CITATION 1]","[CITATION 2]","[CITATION 3]"]}};
// Préface « Pourquoi ce site » : à la première visite seulement, puis par le lien du pied de page et la roue. Citations recopiées par data/preface.py.
(function(){var D=window.PREF7,L=document.documentElement.lang;if(!D||!D.t[L])return;var A={fr:['Fermer','Entrer'],en:['Close','Enter'],he:['סגירה','כניסה']}[L],d=null;
function E(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
function ouvre(){if(d){d.showModal();return}d=E('dialog','pf7');d.setAttribute('aria-labelledby','pf7t');var x=E('button','pfx7','×');x.type='button';x.setAttribute('aria-label',A[0]);x.onclick=function(){d.close()};var b=E('div','pfb7');
 D.t[L].forEach(function(p,i){var m=p.match(/^\[CITATION (\d)\]$/);if(!m){b.appendChild(E(i?'p':'h2',i?'':'pft7',p)).id=i?'':'pf7t';return}var c=D.c[m[1]-1],q=E('blockquote','pfq7'),h=E('p','',c.he);h.lang='he';h.dir='rtl';q.appendChild(h);if(L==='en'&&c.en){q.appendChild(E('p','pfe7',c.en))}var r=E('cite'),a=E('a','',c.ref[L]);a.href=c.u;a.target='_blank';a.rel='noopener';r.appendChild(a);if(L==='en'&&c.cr)r.appendChild(E('small','',c.cr));q.appendChild(r);b.appendChild(q)});
 b.querySelectorAll('[id=""]').forEach(function(e){e.removeAttribute('id')});var ok=E('button','btn solid pfo7',A[1]);ok.type='button';ok.onclick=function(){d.close()};b.appendChild(ok);d.append(x,b);d.addEventListener('click',function(e){if(e.target===d)d.close()});document.body.appendChild(d);d.showModal();b.scrollTop=0;x.focus({preventScroll:true})}
window.__pref7=ouvre;document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-pf7],a[href$="#pourquoi"]');if(a){e.preventDefault();ouvre()}});
if(location.hash==='#pourquoi'){ouvre();return}var vu;try{vu=localStorage.getItem('pf7');localStorage.setItem('pf7','1')}catch(e){vu='1'}if(!vu&&!navigator.webdriver)setTimeout(function(){var it=document.getElementById('intro');if(it&&!it.classList.contains('out'))addEventListener('introdone',function(){setTimeout(ouvre,1500)},{once:true});else ouvre()},1600);
})();
/* Application installable depuis Chrome (23/11/2026, demande de David). */
(function(){
  var m=document.querySelector('link[rel=manifest]'),b=document.querySelector('[data-inst]');
  if('serviceWorker' in navigator&&m&&location.protocol==='https:'||location.hostname==='127.0.0.1'&&m&&'serviceWorker' in navigator){addEventListener('load',function(){navigator.serviceWorker.register(new URL('sw.js',m.href).href).catch(function(){})})}
  if(!b)return;var ev=null,installe=matchMedia('(display-mode: standalone)').matches||navigator.standalone;if(installe)return;
  addEventListener('beforeinstallprompt',function(e){e.preventDefault();ev=e;b.hidden=false});
  b.addEventListener('click',function(){if(!ev)return;ev.prompt();ev.userChoice.then(function(){b.hidden=true;ev=null})});
  addEventListener('appinstalled',function(){b.hidden=true});
})();
/* Agenda (« comme CALJ », tranche 1, 23/11/2026) : horaires et Chabbat par Hebcal (CC BY 4.0), fêtes par le calendrier du site. */
(function(){
  var R=document.querySelector('[data-ag7]');if(!R)return;var L=document.documentElement.lang,T=JSON.parse(R.dataset.ag7),loc={fr:'fr-FR',en:'en-GB',he:'he-IL'}[L];
  var $=function(s){return R.querySelector(s)},E=function(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
  var h=function(iso,tz){return new Intl.DateTimeFormat(loc,{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:tz}).format(new Date(iso))};
  var dj=function(iso,o){return new Intl.DateTimeFormat(loc,Object.assign({weekday:'long',day:'numeric',month:'long',timeZone:'UTC'},o||{})).format(new Date(iso.slice(0,10)+'T12:00:00Z'))};
  var get=function(u){return fetch(u).then(function(r){if(!r.ok)throw 0;return r.json()})},ville=$('select'),num=0;
  var err=function(b){b.textContent='';b.appendChild(E('p','agv',T.err))};
  try{var g=localStorage.getItem('ag7');if(g&&ville.querySelector('option[value="'+g+'"]'))ville.value=g}catch(e){}
  function charge(){var n=++num,id=ville.value,z=$('[data-b=zman]'),s=$('[data-b=shab]');
    get('https://www.hebcal.com/zmanim?cfg=json&geonameid='+id).then(function(d){if(n!==num)return;z.textContent='';var tz=d.location.tzid;z.appendChild(E('p','agd',dj(d.date)));var dl=E('dl','agl');T.z.forEach(function(k){var v=d.times[k[0]];if(!v)return;var r=E('div');if(Date.parse(v)<Date.now())r.className='pass';r.appendChild(E('dt','',k[1]));r.appendChild(E('dd','',h(v,tz)));dl.appendChild(r)});z.appendChild(dl);var p=[].find.call(dl.children,function(x){return !x.className});if(p)p.className='prox'}).catch(function(){if(n===num)err(z)});
    get('https://www.hebcal.com/shabbat?cfg=json&M=on&lg='+(L==='he'?'he':L)+'&geonameid='+id).then(function(d){if(n!==num)return;s.textContent='';var tz=d.location.tzid,dl=E('dl','agl');d.items.forEach(function(i){var a=i.category==='candles'?T.bougies:i.category==='havdalah'?T.sortie:null;if(!a)return;var r=E('div');r.appendChild(E('dt','',a+' · '+dj(i.date,{month:undefined,day:undefined})));r.appendChild(E('dd','',h(i.date,tz)));dl.appendChild(r)});var p=d.items.find(function(i){return i.category==='parashat'});if(p){var r=E('div'),b=E('dd','');b.textContent=L==='he'?p.hebrew.replace(/^פרשת /,''):p.title.replace(/^(Parachah|Parashat) /,'').normalize('NFD').replace(/[̱̣]/g,'').normalize('NFC');if(L!=='he'){var sh=E('span','',p.hebrew.replace(/^פרשת /,''));sh.lang='he';b.appendChild(sh)}r.appendChild(E('dt','',T.parasha));r.appendChild(b);dl.appendChild(r)}s.appendChild(dl)}).catch(function(){if(n===num)err(s)});}
  ville.addEventListener('change',function(){try{localStorage.setItem('ag7',ville.value)}catch(e){}charge()});charge();
  get(R.dataset.jours).then(function(D){var f=$('[data-b=fete]'),n=0,iso=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem'}).format(new Date()),ul=E('dl','agl'),vu={};f.textContent='';Object.keys(D).sort().forEach(function(k){if(k<iso||n>=14)return;(D[k].e||[]).forEach(function(e){if((e.c!=='fete'&&e.c!=='roch_hodech'&&e.c!=='jeune')||n>=14)return;var c=e.t.split(/\s*[(:—]\s*/)[0];if(vu[c]&&Date.parse(k)-vu[c]<12*864e5)return;vu[c]=Date.parse(k);n++;var r=E('div');r.appendChild(E('dt','',c));r.appendChild(E('dd','agf',dj(k)));ul.appendChild(r)})});f.appendChild(ul)}).catch(function(){err($('[data-b=fete]'))});
  var fc=$('[data-conv]');fc.addEventListener('submit',function(e){e.preventDefault();var o=fc.querySelector('output'),d=fc.querySelector('input').value;if(!d)return;get('https://www.hebcal.com/converter?cfg=json&g2h=1&strict=1&date='+d).then(function(j){o.textContent=j.hebrew.replace(/[֑-ׇ]/g,'')+(L==='he'?'':' · '+j.hd+' '+(T.m[j.hm]||j.hm)+' '+j.hy)}).catch(function(){o.textContent=T.err})});
})();
