const menuButton=document.querySelector('#menu');const nav=document.querySelector('#nav');menuButton?.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(opened));menuButton.setAttribute('aria-label',opened?'Menü schließen':'Menü öffnen');});nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Menü öffnen');}));

/* TarifKlar: datensparsames, aggregiertes Affiliate-Klicktracking */
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  let target;
  try { target = new URL(link.href, location.href); } catch { return; }
  const partner = target.hostname === 'a.check24.net' ? 'check24'
    : target.hostname === 'a.partner-versicherung.de' ? 'tarifcheck' : '';
  if (!partner) return;
  const path = location.pathname.split('/').pop() || 'index.html';
  const page = path.replace(/\.html?$/i, '').replace(/[^a-z0-9-]/gi, '').slice(0, 60) || 'home';
  const category = ({'strom':'strom','gas':'gas','kfz':'kfz','kfz-wechsel-2026':'kfz',
    'motorrad':'motorrad','reisen':'reisen','c24bank':'c24bank'})[page];
  if (!category) return;
  const label = (link.getAttribute('aria-label') || link.textContent || 'partner-link')
    .trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').slice(0, 40) || 'partner-link';
  fetch('https://tarifklar-clicks.kibruder.workers.dev/api/click', {
    method: 'POST', mode: 'cors', keepalive: true,
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({page, category, partner, linkKey:label})
  }).catch(() => {});
}, true);
