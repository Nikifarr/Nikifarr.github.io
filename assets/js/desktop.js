// Niki's Arcade: the retro desktop on the inside pages.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var sfx = window.SFX || {};
  var play = function (n) { if (sfx[n]) sfx[n](); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = function (k, v, session) {
    try { var s = session ? sessionStorage : localStorage; if (v === undefined) return s.getItem(k); s.setItem(k, v); } catch (e) { return null; }
  };

  // ---------- clock ----------
  var clock = $('#clock');
  function tick() {
    var d = new Date(), h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0');
    clock.textContent = ((h % 12) || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  if (clock) { tick(); setInterval(tick, 15000); }

  // ---------- secret unlocked in the arcade? ----------
  if (store('niki-secret') === '1') $$('.secret-only').forEach(function (el) { el.hidden = false; });

  // ---------- start menu ----------
  var start = $('#start'), menu = $('#start-menu');
  function setMenu(open) {
    menu.hidden = !open; start.setAttribute('aria-expanded', String(open));
    if (open) { play('click'); var first = $('a', menu); if (first) first.focus(); }
  }
  start.addEventListener('click', function (e) { e.stopPropagation(); setMenu(menu.hidden); });
  document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); start.focus(); } });

  // ---------- windows ----------
  var win = $('#main-win'), desk = $('.desktop'), ms = $('#messenger');
  var taskMain = $('.task[data-task="main-win"]'), taskMs = $('.task[data-task="messenger"]');
  var wide = window.matchMedia('(min-width: 1261px)');

  function syncMsTask() {
    var visible = wide.matches ? !ms.classList.contains('closed') : ms.classList.contains('open');
    taskMs.classList.toggle('active', visible);
    if (wide.matches) ms.style.display = ms.classList.contains('closed') ? 'none' : '';
    else ms.style.display = '';
  }
  wide.addEventListener ? wide.addEventListener('change', syncMsTask) : wide.addListener(syncMsTask);

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var act = b.dataset.act;
    if (act === 'min') minimize();
    else if (act === 'max') { desk.classList.toggle('maxed'); play('click'); }
    else if (act === 'hide-messenger') { if (wide.matches) ms.classList.add('closed'); else ms.classList.remove('open'); play('close'); syncMsTask(); }
    else if (act === 'back') { play('click'); if (history.length > 1 && document.referrer.indexOf(location.host) !== -1) history.back(); else location.href = window.ARCADE_URL || '/'; }
    else if (act === 'random') {
      var list = (window.NOTE_URLS || []).filter(function (u) { return u !== location.pathname; });
      if (list.length) { play('select'); location.href = list[Math.floor(Math.random() * list.length)]; } else play('error');
    }
  });

  function minimize() {
    play('close');
    if (reduced) { win.hidden = true; taskMain.classList.remove('active'); return; }
    win.classList.add('minimizing');
    setTimeout(function () { win.hidden = true; win.classList.remove('minimizing'); taskMain.classList.remove('active'); }, 340);
  }
  taskMain.addEventListener('click', function () {
    if (win.hidden) { win.hidden = false; win.classList.add('restoring'); play('open'); setTimeout(function () { win.classList.remove('restoring'); }, 400); taskMain.classList.add('active'); }
    else minimize();
  });
  taskMs.addEventListener('click', function () {
    if (wide.matches) ms.classList.toggle('closed'); else ms.classList.toggle('open');
    play(taskMs.classList.contains('active') ? 'close' : 'open'); syncMsTask();
  });
  syncMsTask();

  // ---------- back to the arcade (zooms out on the other side) ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.to-arcade'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    store('arcade-return', '1', true);
    play('close');
    if (reduced) { location.href = a.href; return; }
    document.body.classList.add('leaving');
    setTimeout(function () { location.href = a.href; }, 430);
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('leaving'); });

  // ---------- search + filter on file lists ----------
  var q = $('#q'), rows = $$('.file'), chips = $$('.fchip'), empty = $('#empty');
  if (q && rows.length) {
    var params = new URLSearchParams(location.search), section = params.get('section') || '';
    if (params.get('q')) q.value = params.get('q');
    var apply = function () {
      var term = q.value.trim().toLowerCase(), shown = 0;
      rows.forEach(function (r) {
        var ok = (!section || r.dataset.section === section) && (!term || r.dataset.search.indexOf(term) !== -1);
        r.hidden = !ok; if (ok) shown++;
      });
      chips.forEach(function (c) { c.classList.toggle('active', c.dataset.section === section); });
      if (empty) empty.hidden = shown !== 0;
    };
    q.addEventListener('input', apply);
    chips.forEach(function (c) { c.addEventListener('click', function () { section = c.dataset.section; play('click'); apply(); }); });
    apply();
  }

  // ---------- album lightbox ----------
  var lb = $('#lightbox');
  if (lb && lb.showModal) {
    $$('.zoomable').forEach(function (b) {
      b.addEventListener('click', function () {
        $('img', lb).src = b.dataset.full; $('img', lb).alt = b.dataset.caption;
        $('.lb-cap', lb).textContent = b.dataset.caption; lb.showModal(); play('open');
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

})();
