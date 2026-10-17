// FIEL Segurança Privada — service worker (rede primeiro; cache só para abrir sem internet)
const CACHE = 'fiel-v1.5.0';
const BASE = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if(r.method !== 'GET' || u.origin !== location.origin) return; // Supabase e CDNs sempre direto da rede
  e.respondWith(fetch(r).then(resp => { if(resp.ok){ const c = resp.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return resp; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('./index.html'))));
});
