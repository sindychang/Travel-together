// 旅遊行程規劃 — 離線快取
const CACHE='travel-app-v2';
const ASSETS=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{}))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  // 只快取同網域檔案；Firebase / 各種 API 一律走網路
  if(u.origin!==location.origin){ return; }
  e.respondWith(
    caches.match(e.request).then(cached=>cached || fetch(e.request).then(res=>{
      const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res;
    }).catch(()=>cached))
  );
});
