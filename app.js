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
  if(it){ if(red||ss('intro')){it.remove()} else { sky(it.querySelector('canvas')); ss('intro','1');
      var close=function(){if(it.classList.contains('out'))return;it.classList.add('out');dispatchEvent(new Event('introdone'));setTimeout(function(){it.remove()},1100)}; it.addEventListener('click',close); setTimeout(close,3400);} }
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
    var li=function(e){var b='<span class="evc">'+esc(L[e.c]||e.c)+'</span>'+(e.u?'<a href="'+e.u+'">'+esc(e.t)+'</a>':'<span class="evt">'+esc(e.t)+'</span>')+(e.pl?'<em>'+esc(e.pl)+'</em>':'')+(e.v?'':'<small class="tv">'+esc(TV)+'</small>')+(e.pc?'<small class="pcn">'+esc(e.pc)+'</small>':'');return '<li class="ev c-'+e.c+(e.i?' wi':'')+'" data-c="'+e.c+'">'+(e.i?'<img class="evth" src="/hilloulot/img/th/'+e.i+'.webp" alt="" width="44" height="55" loading="lazy" decoding="async"><div>'+b+'</div>':b)+'</li>'};
    var civ=function(d,o){return new Intl.DateTimeFormat(loc,Object.assign({timeZone:'UTC'},o||{weekday:'long',day:'numeric',month:'long',year:'numeric'})).format(new Date(d+'T12:00:00Z'))};
    fetch('/hilloulot/'+lang+'/days.json').then(function(r){return r.json()}).then(function(D){
      var day=D[iso]; if(!day)return;
      var h=document.querySelector('#thd,[data-today-hd]'); if(h&&day.h)h.textContent=day.h;
      var c=document.querySelector('#tciv,[data-today-civ]'); if(c)c.textContent=civ(iso);
      var ev=day.e; if(list.hasAttribute('data-today-list'))ev=ev.slice(0,5);
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
    else{location.href='mailto:'+to+'?subject='+encodeURIComponent('Hilloulot — '+r)+'&body='+encodeURIComponent(em+' · '+r);ok()}});
})();

/* v7 reperes */
/* v7 : repères du calendrier en haut de l'accueil (Shabbat, Roch Hodech, prochaine fête) — demande de Mickaël, 06/11/2026.
   Dates : /fr/days.json (calendrier vérifié du site, jours civils) ; noms : days.json de la langue de la page. */
(function(){
  var box=document.querySelector('[data-rep7]'); if(!box||!window.fetch)return;
  var lang=document.documentElement.lang, l=lang, loc=window.LOCALE||l;
  var S={
    fr:{sh:'Shabbat',tonight:'Ce soir',today:'Aujourd’hui',fri:'Vendredi {d} au soir',rh:'Roch Hodech',one:'1 jour',two:'2 jours',eve:'dès {d} soir',eve0:'dès ce soir',fete:'Prochaine fête',inN:'dans {n} jours',tom:'demain',and:' et '},
    en:{sh:'Shabbat',tonight:'Tonight',today:'Today',fri:'Friday {d}, evening',rh:'Rosh Chodesh',one:'1 day',two:'2 days',eve:'from {d} evening',eve0:'from this evening',fete:'Next festival',inN:'in {n} days',tom:'tomorrow',and:' and '},
    he:{sh:'שבת',tonight:'הערב',today:'היום',fri:'יום שישי בערב, {d}',rh:'ראש חודש',one:'ראש חודש בן יום אחד',two:'ראש חודש בן יומיים',eve:'מתחיל ב{d} בערב',eve0:'מתחיל הערב',fete:'החג הבא',inN:'בעוד {n} ימים',tom:'מחר',and:' ו'}
  }[l]||null; if(!S)return;
  var t=function(k,v){return S[k].replace(/\{(\w)\}/g,function(_,x){return v[x]})};
  var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
  var iso=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jerusalem'}).format(new Date());
  var add=function(k,n){return new Date(Date.parse(k+'T12:00:00Z')+n*864e5).toISOString().slice(0,10)};
  var fmt=function(k,o){return new Intl.DateTimeFormat(loc,Object.assign({timeZone:'UTC'},o)).format(new Date(k+'T12:00:00Z'))};
  var wd=function(k){return fmt(k,{weekday:'long'})}, dm=function(k){return fmt(k,{weekday:'long',day:'numeric',month:'long'})};
  var veille=function(k){var v=add(k,-1);return v===iso?S.eve0:t('eve',{d:wd(v)})};
  var dans=function(n){return n===1?S.tom:n===2&&l==='he'?'בעוד יומיים':t('inN',{n:n})};
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
      var when=iso>=a?S.today+' · '+(a===b?S.one:S.two):(a===b?S.one:S.two)+' · '+veille(a);
      out+=card(S.rh,nm.replace(/^(Roch Hodech|Rosh Chodesh|ראש חודש)\s*/,''),[days,when],iso>=a?'r7on':'')}
    // prochaine fête (date du premier jour, elle commence la veille au soir)
    // une « veille de » n'est pas la fête : on prend le premier vrai jour
    for(i=0;i<400;i++){k=add(iso,i);var f0=ev(F,k,'fete');if(f0&&!/^Veille/.test(f0.t))break}
    if(i<400){var e=ev(L,k,'fete')||f0, n=e.t.split(/\s*[(:—]\s*/)[0];
      out+=card(S.fete,n,i===0?[S.today,dm(k)]:[dm(k),veille(k)+' · '+dans(i)],i===0?'r7on':'')}
    box.innerHTML=out; box.hidden=false;
  }).catch(function(){});
})();
