// Niki's Arcade: the cabinet on the homepage.
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var sfx = window.SFX || {};
  var play = function (name) { if (sfx[name]) sfx[name](); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };

  var screen = $('#screen'), zoomer = $('#zoomer'), stage = $('#stage');
  var state = 'attract', idx = 0, credits = parseInt(store.get('arcade-credits', true) || '0', 10);
  var palettes = ['green', 'amber', 'pink', 'cyan'];
  var palette = store.get('arcade-palette') || 'green';
  screen.dataset.palette = palette;

  // ---------- fit the cabinet to the window ----------
  function fit() {
    var portrait = window.innerWidth / window.innerHeight < 0.85;
    stage.classList.toggle('portrait', portrait);
    var w = stage.offsetWidth, h = stage.offsetHeight;
    var s = Math.min(window.innerWidth * 0.97 / w, window.innerHeight * (portrait ? 0.96 : 0.94) / h, 1.35);
    stage.style.setProperty('--s', s.toFixed(3));
  }
  window.addEventListener('resize', fit); fit();

  // ---------- menu ----------
  function items() { return $$('.menu-item').filter(function (li) { return !li.hidden; }); }
  if (store.get('niki-secret') === '1') $('.secret-item').hidden = false;

  function render() {
    items().forEach(function (li, i) {
      var on = i === idx;
      li.classList.toggle('active', on);
      li.setAttribute('aria-selected', on);
      if (on && li.scrollIntoView) li.scrollIntoView({ block: 'nearest' });
    });
  }
  function move(d) {
    if (state === 'attract') { insertCoin(); return; }
    if (state !== 'menu') return;
    var n = items().length;
    idx = (idx + d + n) % n; play('move'); render();
  }
  function setState(s) {
    state = s; screen.dataset.state = s;
    screen.classList.remove('power-on'); void screen.offsetWidth; screen.classList.add('power-on');
  }
  function updateCredits() {
    $$('.credits').forEach(function (c) { c.textContent = 'CREDIT ' + String(Math.min(credits, 99)).padStart(2, '0'); });
    store.set('arcade-credits', String(credits), true);
  }
  function toast(msg, ms) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, ms || 1800);
  }

  function insertCoin(slot) {
    var coin = $('#coin');
    coin.className = 'coin'; void coin.offsetWidth;
    coin.className = 'coin drop';
    play('coin'); credits++; updateCredits();
    if (state === 'attract') setTimeout(function () { setState('menu'); render(); }, 380);
    else toast('+1 CREDIT');
  }

  function select() {
    if (state === 'attract') { insertCoin(); return; }
    if (state !== 'menu') return;
    var li = items()[idx]; if (!li) return;
    play('select');
    store.set('arcade-idx', String(idx), true);
    $('#load-n').textContent = String(li.dataset.n || '??').padStart(2, '0');
    $('#load-name').textContent = li.dataset.name;
    setState('loading');
    setTimeout(function () { $('#load-fill').style.width = '100%'; }, 60);
    setTimeout(function () { zoomInto(li.dataset.url); }, reduced ? 200 : 750);
  }

  function back() {
    if (state === 'menu') { play('back'); setState('attract'); }
  }

  // ---------- the dive into the screen ----------
  function screenTransform() {
    var r = screen.getBoundingClientRect(), z = zoomer.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var k = Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.15;
    return { origin: (cx - z.left) + 'px ' + (cy - z.top) + 'px',
             transform: 'translate(' + (window.innerWidth / 2 - cx) + 'px,' + (window.innerHeight / 2 - cy) + 'px) scale(' + k + ')' };
  }
  function pageFlash(on) {
    var f = $('.page-flash');
    if (!f) { f = document.createElement('div'); f.className = 'page-flash'; document.body.appendChild(f); void f.offsetWidth; }
    f.classList.toggle('on', on);
    return f;
  }
  function zoomInto(url) {
    store.set('arcade-enter', '1', true);
    if (reduced) { location.href = url; return; }
    var t = screenTransform();
    zoomer.style.transformOrigin = t.origin;
    zoomer.classList.add('zooming');
    zoomer.style.transform = t.transform;
    setTimeout(function () { pageFlash(true); }, 700);
    setTimeout(function () { location.href = url; }, 950);
  }
  // Coming back from a page: start zoomed in, then pull out.
  function zoomOutOnReturn() {
    if (store.get('arcade-return', true) !== '1') return false;
    store.set('arcade-return', '0', true);
    idx = Math.min(parseInt(store.get('arcade-idx', true) || '0', 10), items().length - 1);
    setState('menu'); render();
    if (reduced) return true;
    var t = screenTransform();
    zoomer.style.transformOrigin = t.origin;
    zoomer.style.transform = t.transform;
    var f = pageFlash(true);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      zoomer.classList.add('zooming');
      zoomer.style.transform = 'none';
      f.classList.remove('on');
      play('close');
      setTimeout(function () { zoomer.classList.remove('zooming'); zoomer.style.transform = ''; }, 1000);
    }); });
    return true;
  }
  // If the browser restores this page from its back/forward cache, reset the zoom.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    zoomer.classList.remove('zooming'); zoomer.style.transform = '';
    pageFlash(false); setState('menu'); render();
  });

  // ---------- konami code ----------
  var code = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'], pos = 0;
  function konami(input) {
    pos = input === code[pos] ? pos + 1 : (input === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0;
      store.set('niki-secret', '1');
      $('.secret-item').hidden = false;
      play('jingle');
      screen.classList.remove('rainbow'); void screen.offsetWidth; screen.classList.add('rainbow');
      if (state === 'attract') { setState('menu'); }
      idx = items().length - 1; render();
      toast('CHEAT ACTIVATED! SECRET STAGE', 3000);
      return true;
    }
    return false;
  }

  // ---------- inputs ----------
  function press(btn) { if (!btn) return; btn.classList.add('pressed'); setTimeout(function () { btn.classList.remove('pressed'); }, 120); }
  var stick = $('#joy-stick');
  function nudgeStick(dx, dy) {
    stick.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + dx * 0.6 + 'deg)';
    setTimeout(function () { stick.style.transform = ''; }, 140);
  }

  document.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('.skip-nav')) return;
    var k = e.key;
    if (k === 'ArrowUp' || k === 'w') { konami('up'); move(-1); nudgeStick(0, -14); e.preventDefault(); }
    else if (k === 'ArrowDown' || k === 's') { konami('down'); move(1); nudgeStick(0, 14); e.preventDefault(); }
    else if (k === 'ArrowLeft') { konami('left'); nudgeStick(-14, 0); e.preventDefault(); }
    else if (k === 'ArrowRight') { konami('right'); nudgeStick(14, 0); e.preventDefault(); }
    else if (k === 'Enter' || k === ' ') {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return; // let focused buttons/links click normally
      press($('#btn-a')); select(); e.preventDefault();
    }
    else if (k === 'Escape' || k === 'Backspace') { press($('#btn-b')); back(); }
    else if (k === 'a' || k === 'A') { press($('#btn-a')); if (!konami('a')) select(); }
    else if (k === 'b' || k === 'B') { press($('#btn-b')); if (!konami('b')) back(); }
    else if (k === 'c' || k === 'C') { press($('#btn-c')); cyclePalette(); }
  });

  $('#btn-a').addEventListener('click', function () { if (!konami('a')) select(); });
  $('#btn-b').addEventListener('click', function () { if (!konami('b')) { back(); if (state === 'attract') play('click'); } });
  $('#btn-c').addEventListener('click', cyclePalette);
  $('#start-btn').addEventListener('click', function () { state === 'attract' ? insertCoin() : select(); });
  $('#coin-slot').addEventListener('click', function () { insertCoin(); });
  $('.joy-arrow.up').addEventListener('click', function () { konami('up'); move(-1); nudgeStick(0, -14); });
  $('.joy-arrow.down').addEventListener('click', function () { konami('down'); move(1); nudgeStick(0, 14); });

  function cyclePalette() {
    palette = palettes[(palettes.indexOf(palette) + 1) % palettes.length];
    screen.dataset.palette = palette; store.set('arcade-palette', palette);
    play('pop'); toast('SCREEN: ' + palette.toUpperCase(), 1000);
  }

  // screen: click attract to insert coin; hover/click menu items
  screen.addEventListener('click', function (e) {
    var li = e.target.closest('.menu-item');
    if (state === 'attract') { insertCoin(); return; }
    if (li && state === 'menu') { idx = items().indexOf(li); render(); select(); }
  });
  $('#menu').addEventListener('mousemove', function (e) {
    var li = e.target.closest('.menu-item'); if (!li || state !== 'menu') return;
    var i = items().indexOf(li); if (i !== idx) { idx = i; play('move'); render(); }
  });

  // joystick: drag it!
  var joy = $('#joystick'), drag = null, fired = null;
  joy.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, y: e.clientY }; fired = null;
    stick.classList.add('dragging'); joy.setPointerCapture(e.pointerId); e.preventDefault();
  });
  joy.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var s = parseFloat(getComputedStyle(stage).getPropertyValue('--s')) || 1;
    var dx = (e.clientX - drag.x) / s, dy = (e.clientY - drag.y) / s;
    var len = Math.hypot(dx, dy), max = 26;
    if (len > max) { dx = dx / len * max; dy = dy / len * max; }
    stick.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + dx * 0.6 + 'deg)';
    var dir = null;
    if (dy < -16 && Math.abs(dy) > Math.abs(dx)) dir = 'up';
    else if (dy > 16 && Math.abs(dy) > Math.abs(dx)) dir = 'down';
    else if (dx < -16) dir = 'left';
    else if (dx > 16) dir = 'right';
    if (dir && dir !== fired) {
      fired = dir; konami(dir);
      if (dir === 'up') move(-1); else if (dir === 'down') move(1); else play('click');
    }
    if (!dir) fired = null;
  });
  function release() { if (!drag) return; drag = null; stick.classList.remove('dragging'); stick.style.transform = ''; }
  joy.addEventListener('pointerup', release);
  joy.addEventListener('pointercancel', release);

  // ---------- little easter eggs ----------
  var catLines = ['meow!', 'insert coin pls', 'ctrl+s!!', 'prrrr…', 'pick a stage!', 'have u playtested today?', 'nya~', 'try the konami code ;)', 'i live here now'];
  var cat = $('.top-cat'), catClicks = 0, catTimer;
  cat.addEventListener('click', function () {
    catClicks++;
    cat.querySelector('.bubble').textContent = catLines[Math.floor(Math.random() * catLines.length)];
    cat.classList.add('talking', 'hop'); setTimeout(function () { cat.classList.remove('hop'); }, 160);
    play('meow'); hearts(cat, 3);
    if (catClicks % 5 === 0) { cat.classList.remove('spin'); void cat.offsetWidth; cat.classList.add('spin'); }
    clearTimeout(catTimer); catTimer = setTimeout(function () { cat.classList.remove('talking'); }, 2400);
  });
  function hearts(el, n) {
    for (var i = 0; i < n; i++) {
      var h = document.createElement('span'); h.className = 'heart-fx'; h.textContent = '♥';
      h.style.left = (20 + Math.random() * 50) + 'px'; h.style.top = (Math.random() * 20) + 'px';
      h.style.animationDelay = (i * 0.12) + 's';
      el.appendChild(h); setTimeout(function (x) { x.remove(); }, 1400, h);
    }
  }

  // tapping the logo makes the old CRT lose signal for a moment
  $('#logo').addEventListener('click', function () {
    screen.classList.remove('glitch'); void screen.offsetWidth; screen.classList.add('glitch'); play('zap');
    setTimeout(function () { screen.classList.remove('glitch'); }, 750);
  });

  var lucky = $('#lucky');
  lucky.addEventListener('click', function () {
    lucky.classList.add('excited'); setTimeout(function () { lucky.classList.remove('excited'); }, 1200);
    credits++; updateCredits(); play('coin');
    if (state === 'attract') toast('LUCKY! FREE CREDIT ♥'); else toast('LUCKY! +1 CREDIT');
  });

  $$('.speaker').forEach(function (sp) { sp.addEventListener('click', function () { play('melody'); toast('♪ NOW PLAYING: NIKI THEME ♪', 1800); }); });

  $$('.sticker').forEach(function (st) {
    st.addEventListener('click', function () { st.classList.remove('wiggle'); void st.offsetWidth; st.classList.add('wiggle'); play('pop'); });
  });
  // ---------- start ----------
  updateCredits();
  if (!zoomOutOnReturn()) {
    if (credits > 0) { setState('menu'); idx = Math.min(parseInt(store.get('arcade-idx', true) || '0', 10), items().length - 1); render(); }
    else setState('attract');
  }
})();
