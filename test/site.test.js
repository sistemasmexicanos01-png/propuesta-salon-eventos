const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const site = path.join(__dirname, '..', 'site');
const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(site, 'script.js'), 'utf8');

test('título, viewport e idioma', () => {
  assert.match(html, /<title>Jardín de Eventos[^<]*<\/title>/);
  assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /lang="es-MX"/);
});
test('secciones pedidas', () => {
  for (const s of ['Bodas', 'XV años', 'Bautizos', 'Cumpleaños', 'empresariales', 'Galería', 'Paquetes', 'Ubicación', 'Qué incluye', 'Página demo hecha por']) assert.ok(html.includes(s), s);
  assert.ok(!/\$\s?\d/.test(html), 'sin precios');
});
test('assets locales existen', () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map(m => m[1]);
  const srcset = [...html.matchAll(/srcset="([^"]+)"/g)].flatMap(m => m[1].split(',').map(x => x.trim().split(' ')[0]));
  for (const r of [...refs, ...srcset]) assert.ok(fs.existsSync(path.join(site, r)), r);
  assert.ok(!/unsplash|googleapis/.test(html), 'sin assets remotos');
});
test('sin placeholders rotos', () => { assert.ok(!/TODO|lorem|undefined|\{\{/.test(html)); });

function run(search) {
  const els = {};
  const mk = () => ({ textContent: '', href: '', target: '', rel: '' });
  const nameEls = [mk(), mk()], waEls = [mk(), mk(), mk()];
  const document = { title: '', querySelectorAll: s => s === '.js-name' ? nameEls : waEls,
    getElementById: id => (els[id] = els[id] || mk()) };
  new Function('window', 'document', 'URLSearchParams', js)({ location: { search } }, document, URLSearchParams);
  return { name: nameEls[0].textContent, wa: waEls[0].href, title: document.title };
}
test('?n y ?w', () => {
  const a = run('?n=Jardin-de-Eventos-El-Cielito&w=5579094806');
  assert.equal(a.name, 'Jardín de Eventos El Cielito');
  assert.equal(a.wa, 'https://wa.me/525579094806?text=Hola%2C%20quiero%20informaci%C3%B3n%20para%20un%20evento');
  const b = run('');
  assert.equal(b.name, 'Jardín de Eventos');
  assert.ok(b.wa.startsWith('https://wa.me/525611882182?text='));
  assert.ok(run('?w=123').wa.startsWith('https://wa.me/525611882182'));
  assert.ok(run('?w=525579094806').wa.startsWith('https://wa.me/525579094806'));
});
