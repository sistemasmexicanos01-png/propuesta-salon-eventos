(function () {
  var DEFAULT_NAME = 'Jard\u00edn de Eventos';
  var SMX_WA = '525611882182';
  var MSG = 'Hola, quiero informaci\u00f3n para un evento';
  var params = new URLSearchParams(window.location.search);

  // Acentos comunes que se pierden en la URL (?n=Jardin-de-Eventos -> Jardín de Eventos)
  var FIX = { 'Jardin': 'Jard\u00edn', 'jardin': 'jard\u00edn', 'Salon': 'Sal\u00f3n', 'salon': 'sal\u00f3n',
    'Recepcion': 'Recepci\u00f3n' };
  function clean(raw) {
    if (!raw) return '';
    var s = raw.replace(/[-_+]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
    return s.split(' ').map(function (w) { return FIX[w] || w; }).join(' ');
  }

  var name = clean(params.get('n')) || DEFAULT_NAME;

  // WhatsApp: ?w=10 dígitos (o 52 + 10 dígitos); si no, el de Sistemas Mexicanos
  var w = (params.get('w') || '').replace(/\D/g, '');
  if (w.length === 13 && w.indexOf('521') === 0) w = '52' + w.slice(3);
  if (w.length === 10) w = '52' + w;
  var phone = (w.length === 12 && w.indexOf('52') === 0) ? w : SMX_WA;
  var href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(MSG);

  document.querySelectorAll('.js-name').forEach(function (el) { el.textContent = name; });
  document.querySelectorAll('.wa-link').forEach(function (el) {
    el.href = href; el.target = '_blank'; el.rel = 'noopener';
  });
  document.title = name + ' \u00b7 Bodas, XV a\u00f1os y fiestas';

  // Opcionales: ?c=300 (capacidad) y ?z=Tlahuac-CDMX (zona)
  var c = (params.get('c') || '').replace(/\D/g, '');
  if (c) {
    document.getElementById('cap').textContent = 'Hasta ' + Number(c).toLocaleString('es-MX');
    document.getElementById('cap-sub').textContent = 'invitados';
  }
  var z = clean(params.get('z'));
  if (z) document.getElementById('zona').textContent = 'Zona: ' + z;

  var y = document.getElementById('foot-year');
  if (y) y.textContent = '\u00a9 ' + new Date().getFullYear() + ' ' + name;
})();
