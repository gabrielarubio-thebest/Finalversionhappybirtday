/* =====================================================================
   🔊 AUDIO ENGINE
   ---------------------------------------------------------------------
   Everything here is generated live with the Web Audio API, so the game
   needs NO audio files and uses NO copyrighted sounds.

   Want real recordings instead? Put files in /assets/audio/ and fill in
   the paths below. Any entry left as null uses the built-in synth.
   ===================================================================== */
const AUDIO_FILES = {
  song: null,            // e.g. "assets/audio/birthday-anthem.mp3"
  sfx: {
    call: null,          // incoming work call
    notification: null,
    message: null,
    click: null,
    hit: null,           // piñata hit
    break: null,         // piñata break
    explosion: null,
    levelComplete: null,
    challenge: null,     // challenge unlocked
    victory: null,       // final victory
  },
};

const Audio8 = (() => {
  let ctx = null, master, musicBus, sfxBus;
  let musicOn = true, sfxOn = true;
  let playing = false, intensity = 1, step = 0, nextTime = 0, timer = null;
  let songEl = null;
  const fileCache = {};

  const BPM = 126;
  const STEP = 60 / BPM / 4; // 16th note

  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.32; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.6; sfxBus.connect(master);
  }

  const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

  function tone({ f, t = ctx.currentTime, d = 0.2, type = "square", v = 0.3, bus = sfxBus, slideTo = null, cutoff = 4000, attack = 0.005 }) {
    const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + d);
    fl.type = "lowpass"; fl.frequency.value = cutoff;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(fl); fl.connect(g); g.connect(bus);
    o.start(t); o.stop(t + d + 0.05);
  }

  let noiseBuf = null;
  function noise({ t = ctx.currentTime, d = 0.2, v = 0.3, bus = sfxBus, type = "highpass", freq = 1000, sweepTo = null }) {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    s.buffer = noiseBuf;
    fl.type = type; fl.frequency.setValueAtTime(freq, t);
    if (sweepTo) fl.frequency.exponentialRampToValueAtTime(sweepTo, t + d);
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(fl); fl.connect(g); g.connect(bus);
    s.start(t); s.stop(t + d + 0.05);
  }

  /* ---------------- SOUND EFFECTS (all original) ---------------- */
  const SFX = {
    click() { tone({ f: 880, d: 0.06, type: "triangle", v: 0.25 }); },
    message() {
      const t = ctx.currentTime;
      tone({ f: 660, t, d: 0.09, type: "sine", v: 0.35 });
      tone({ f: 990, t: t + 0.07, d: 0.12, type: "sine", v: 0.3 });
    },
    notification() {
      const t = ctx.currentTime;
      [784, 1047, 1319].forEach((f, i) => tone({ f, t: t + i * 0.08, d: 0.18, type: "triangle", v: 0.3 }));
    },
    call() { // original two-tone "ring" pattern, played twice
      const t = ctx.currentTime;
      for (let r = 0; r < 2; r++) {
        const s = t + r * 0.9;
        [[587, 0], [740, 0.16], [587, 0.32], [880, 0.48]].forEach(([f, o]) =>
          tone({ f, t: s + o, d: 0.15, type: "sine", v: 0.32 }));
      }
    },
    hit() {
      const t = ctx.currentTime;
      tone({ f: 180, t, d: 0.14, type: "sine", v: 0.6, slideTo: 60 });
      noise({ t, d: 0.08, v: 0.35, type: "bandpass", freq: 1800 });
      tone({ f: 900 + Math.random() * 600, t: t + 0.02, d: 0.08, type: "square", v: 0.06 });
    },
    break() {
      const t = ctx.currentTime;
      noise({ t, d: 0.5, v: 0.5, type: "lowpass", freq: 6000, sweepTo: 300 });
      tone({ f: 120, t, d: 0.35, type: "sine", v: 0.6, slideTo: 40 });
      [1047, 1319, 1568, 2093].forEach((f, i) => tone({ f, t: t + 0.12 + i * 0.06, d: 0.25, type: "triangle", v: 0.18 }));
    },
    explosion() {
      const t = ctx.currentTime;
      noise({ t, d: 1.6, v: 0.9, type: "lowpass", freq: 3000, sweepTo: 80 });
      tone({ f: 90, t, d: 1.2, type: "sine", v: 0.9, slideTo: 25 });
      tone({ f: 60, t: t + 0.05, d: 0.8, type: "sawtooth", v: 0.25, slideTo: 30, cutoff: 400 });
    },
    crunch() {
      const t = ctx.currentTime;
      for (let i = 0; i < 4; i++) noise({ t: t + i * 0.045, d: 0.05, v: 0.4, type: "bandpass", freq: 2500 + Math.random() * 2500 });
      tone({ f: 140, t, d: 0.1, type: "sine", v: 0.4, slideTo: 70 });
    },
    hum() { tone({ f: 110, d: 2.6, type: "sawtooth", v: 0.08, cutoff: 300, attack: 0.2 }); },
    beep() { tone({ f: 1760, d: 0.12, type: "square", v: 0.12 }); },
    alarm() {
      const t = ctx.currentTime;
      for (let i = 0; i < 4; i++) tone({ f: 700, t: t + i * 0.3, d: 0.25, type: "square", v: 0.12, slideTo: 1100, cutoff: 2500 });
    },
    wrong() { tone({ f: 300, d: 0.25, type: "square", v: 0.15, slideTo: 150, cutoff: 1200 }); },
    fake() {
      const t = ctx.currentTime;
      tone({ f: 523, t, d: 0.12, type: "triangle", v: 0.25 });
      tone({ f: 392, t: t + 0.12, d: 0.12, type: "triangle", v: 0.25 });
      tone({ f: 262, t: t + 0.24, d: 0.25, type: "triangle", v: 0.25 });
    },
    whoosh() { noise({ d: 0.35, v: 0.25, type: "bandpass", freq: 400, sweepTo: 3000 }); },
    levelComplete() {
      const t = ctx.currentTime;
      [523, 659, 784, 1047].forEach((f, i) => tone({ f, t: t + i * 0.09, d: 0.3, type: "square", v: 0.14, cutoff: 3000 }));
      tone({ f: 1319, t: t + 0.4, d: 0.5, type: "triangle", v: 0.2 });
    },
    challenge() {
      const t = ctx.currentTime;
      for (let i = 0; i < 8; i++) tone({ f: 1200 + i * 180, t: t + i * 0.045, d: 0.2, type: "sine", v: 0.15 });
      tone({ f: 784, t: t + 0.4, d: 0.6, type: "triangle", v: 0.25 });
      tone({ f: 1175, t: t + 0.4, d: 0.6, type: "triangle", v: 0.18 });
    },
    victory() {
      const t = ctx.currentTime;
      const seq = [[523, 0], [523, 0.12], [523, 0.24], [659, 0.36], [784, 0.6], [659, 0.84], [784, 0.96], [1047, 1.2]];
      seq.forEach(([f, o]) => {
        tone({ f, t: t + o, d: o === 1.2 ? 1.2 : 0.2, type: "square", v: 0.16, cutoff: 3500 });
        tone({ f: f / 2, t: t + o, d: o === 1.2 ? 1.2 : 0.2, type: "triangle", v: 0.2 });
      });
    },
  };

  function playFile(path, vol = 0.8) {
    if (!fileCache[path]) fileCache[path] = new Audio(path);
    const a = fileCache[path].cloneNode();
    a.volume = vol; a.play().catch(() => {});
  }

  function sfx(name) {
    if (!sfxOn) return;
    init(); if (!ctx) return;
    const file = AUDIO_FILES.sfx[name];
    if (file) return playFile(file);
    if (SFX[name]) SFX[name]();
  }

  /* ---------------- THE ORIGINAL BIRTHDAY ANTHEM ----------------
     Key of C major, 126 BPM. Progression: C – G – Am – F (x2 phrases).
     Melody table = one note per 8th note, null = rest. All original. */
  const ROOTS = [48, 43, 45, 41]; // C, G, A, F (bass)
  const CHORDS = [[60, 64, 67], [59, 62, 67], [57, 60, 64], [57, 60, 65]];
  const MELODY_A = [
    76, 76, 79, 76, 72, 74, 76, null,
    74, 74, 79, 74, 71, 72, 74, null,
    72, 72, 76, 72, 69, 71, 72, 76,
    77, 76, 74, 72, 74, null, 72, null,
  ];
  const MELODY_B = [
    79, 79, 81, 79, 76, null, 72, null,
    83, 83, 84, 86, 83, null, 79, null,
    84, 83, 81, 79, 81, null, 76, null,
    77, 79, 81, 84, 83, null, 79, null,
  ];

  function scheduleStep(s, t) {
    const bar = Math.floor(s / 16) % 4;
    const sixteenth = s % 16;
    const phrase = Math.floor(s / 64) % 2;
    const hot = intensity >= 2;
    const b = musicBus;

    // drums
    if (sixteenth % 4 === 0) tone({ f: 150, t, d: 0.22, type: "sine", v: 0.9, slideTo: 40, bus: b });
    if (sixteenth === 4 || sixteenth === 12) noise({ t, d: 0.16, v: 0.35, type: "bandpass", freq: 1800, bus: b });
    if (sixteenth % 2 === 0 || hot) noise({ t, d: sixteenth % 4 === 2 ? 0.09 : 0.04, v: hot ? 0.16 : 0.1, type: "highpass", freq: 7000, bus: b });

    // bass (bouncy octave pattern)
    const root = ROOTS[bar];
    if ([0, 3, 6, 8, 10, 14].includes(sixteenth)) {
      const n = (sixteenth === 6 || sixteenth === 14) ? root + 12 : root;
      tone({ f: midi(n - 12 + 12), t, d: STEP * 1.6, type: "sawtooth", v: 0.28, cutoff: 700, bus: b });
    }

    // offbeat chord stabs
    if (sixteenth % 4 === 2) CHORDS[bar].forEach((n) =>
      tone({ f: midi(n), t, d: STEP * 1.4, type: "square", v: 0.05, cutoff: hot ? 3200 : 1800, bus: b }));

    // melody (8th notes)
    if (sixteenth % 2 === 0) {
      const mel = phrase === 0 ? MELODY_A : MELODY_B;
      const n = mel[bar * 8 + sixteenth / 2];
      if (n) {
        tone({ f: midi(n), t, d: STEP * 1.8, type: "square", v: 0.11, cutoff: 2600, bus: b });
        tone({ f: midi(n) * 1.004, t, d: STEP * 1.8, type: "triangle", v: 0.08, bus: b });
        if (hot) tone({ f: midi(n + 12), t, d: STEP * 1.2, type: "triangle", v: 0.05, bus: b });
      }
    }

    // climax sparkle arpeggio
    if (hot) {
      const c = CHORDS[bar];
      tone({ f: midi(c[sixteenth % 3] + 24), t, d: STEP * 0.9, type: "sine", v: 0.05, bus: b });
    }
  }

  function scheduler() {
    while (nextTime < ctx.currentTime + 0.12) {
      scheduleStep(step, nextTime);
      nextTime += STEP; step++;
    }
  }

  function startMusic() {
    init(); if (!ctx || playing) return;
    playing = true;
    if (AUDIO_FILES.song) {
      songEl = songEl || new Audio(AUDIO_FILES.song);
      songEl.loop = true; songEl.volume = musicOn ? 0.6 : 0;
      songEl.play().catch(() => {});
      return;
    }
    step = 0; nextTime = ctx.currentTime + 0.05;
    timer = setInterval(scheduler, 25);
  }

  function setIntensity(level) {
    intensity = level;
    if (!ctx) return;
    const target = level >= 2 ? 0.42 : level === 0 ? 0.12 : 0.32;
    musicBus.gain.setTargetAtTime(musicOn ? target : 0, ctx.currentTime, 0.3);
    if (songEl) songEl.volume = musicOn ? (level >= 2 ? 0.9 : level === 0 ? 0.25 : 0.6) : 0;
  }

  function toggleMusic() {
    musicOn = !musicOn;
    init();
    setIntensity(intensity);
    return musicOn;
  }
  function toggleSfx() { sfxOn = !sfxOn; return sfxOn; }

  return { init, sfx, startMusic, setIntensity, toggleMusic, toggleSfx,
           get musicOn() { return musicOn; }, get sfxOn() { return sfxOn; } };
})();
