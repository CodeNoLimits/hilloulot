/* Application installable : pages d'abord en ligne, dernière version gardée hors ligne ; images et styles gardés. V change à chaque publication. */
var V='hil-332146cc',B=new URL('./',self.location).pathname;
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll([B+'fr/',B+'fr/hil.json',B+'app.js?v=332146cc',B+'style.css?v=332146cc',B+'img/app/icon-192.png'])}).catch(function(){}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x.indexOf('hil-')===0&&x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||u.pathname.indexOf(B)!==0||/\.(mp4|mp3|webm)$/.test(u.pathname)||r.headers.get('range'))return;
  var garde=function(x){if(x&&x.ok&&x.type==='basic'){var k=x.clone();caches.open(V).then(function(c){c.put(r,k)})}return x};
  if(r.mode==='navigate'||/\.json$/.test(u.pathname)){e.respondWith(fetch(r).then(garde).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(x){return x||caches.match(B+'fr/')})}));return}
  e.respondWith(caches.match(r).then(function(x){return x||fetch(r).then(garde)}))});
