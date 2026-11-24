// Tiny 8-bit sound effects made on the fly with the Web Audio API (no sound files).
// Muting is remembered in this browser. Any button with class "sfx-toggle" turns sound on/off.
window.SFX = (function () {
  var ctx = null;
  var muted = false;
  try { muted = localStorage.getItem('niki-mute') === '1'; } catch (e) {}

  function audio() {
    if (!ctx) {
      var A = window.AudioContext || window.webkitAudioContext;
      if (!A) return null;
      ctx = new A();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, o) {
    o = o || {};
    if (muted) return;
    var c = audio(); if (!c) return;
    var t = c.currentTime + (o.delay || 0);
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(freq, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(freq * o.slide, t + dur);
    g.gain.setValueAtTime(o.vol || 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t); osc.stop(t + dur + 0.03);
  }

  function seq(notes, step, o) {
    notes.forEach(function (f, i) {
      if (!f) return;
      var opts = Object.assign({}, o || {}, { delay: i * step });
      tone(f, step * 0.9, opts);
    });
  }

  function refreshToggles() {
    document.querySelectorAll('.sfx-toggle').forEach(function (b) {
      b.setAttribute('aria-pressed', String(!muted));
      b.setAttribute('aria-label', muted ? 'Sound is off, turn on' : 'Sound is on, turn off');
      b.title = muted ? 'sound off' : 'sound on';
      var use = b.querySelector('use');
      if (use) use.setAttribute('href', muted ? '#i-mute' : '#i-sound');
      var label = b.querySelector('.sfx-label');
      if (label) label.textContent = muted ? 'SOUND OFF' : 'SOUND ON';
    });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.sfx-toggle');
    if (!b) return;
    muted = !muted;
    try { localStorage.setItem('niki-mute', muted ? '1' : '0'); } catch (err) {}
    refreshToggles();
    if (!muted) tone(880, 0.08, { type: 'triangle' });
  });
  document.addEventListener('DOMContentLoaded', refreshToggles);

  return {
    move:   function () { tone(660, 0.05, { vol: 0.035 }); },
    select: function () { seq([523, 659, 784, 1047], 0.07); },
    back:   function () { seq([523, 392], 0.07); },
    coin:   function () { tone(988, 0.08); tone(1319, 0.35, { delay: 0.08 }); },
    error:  function () { tone(140, 0.2, { type: 'sawtooth', vol: 0.04 }); },
    meow:   function () { tone(620, 0.18, { type: 'sine', slide: 1.7, vol: 0.09 }); tone(1050, 0.25, { type: 'sine', slide: 0.6, vol: 0.08, delay: 0.17 }); },
    pop:    function () { tone(700, 0.07, { type: 'triangle', slide: 2.2, vol: 0.07 }); },
    zap:    function () { tone(90, 0.25, { type: 'sawtooth', slide: 0.5, vol: 0.05 }); },
    jingle: function () { seq([659, 784, 1319, 1047, 1175, 1568], 0.09); },
    melody: function () { seq([523, 0, 659, 0, 784, 659, 523, 0, 392, 440, 494, 523], 0.12, { type: 'triangle', vol: 0.07 }); },
    open:   function () { seq([392, 523, 659], 0.05, { type: 'triangle', vol: 0.06 }); },
    close:  function () { seq([659, 523, 392], 0.05, { type: 'triangle', vol: 0.06 }); },
    click:  function () { tone(1200, 0.025, { vol: 0.03 }); },
    isMuted: function () { return muted; }
  };
})();
