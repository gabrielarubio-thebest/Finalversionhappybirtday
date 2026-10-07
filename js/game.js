/* =====================================================================
   🪅 BOSS BIRTHDAY SURVIVAL — GAME ENGINE
   You normally don't need to edit this file.
   Content → js/messages.js   Challenges → js/challenges.js
   Audio  → js/audio.js
   Tip for testing: add ?level=5 to the URL to jump to a level.
   ===================================================================== */
(() => {
  "use strict";

  const stage = document.getElementById("stage");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const t = (s) => esc(fill(s)); // fill placeholders + escape
  const sfx = (n) => Audio8.sfx(n);
  // wraps emoji so gradient-clipped headlines don't make them invisible
  const rich = (s) => t(s).replace(/(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu, '<span class="emo">$1</span>');
  function h(html) { const tp = document.createElement("template"); tp.innerHTML = html.trim(); return tp.content.firstElementChild; }
  function clicked(el, sound = true) {
    return new Promise((r) => el.addEventListener("click", (e) => { if (sound) sfx("click"); r(e); }, { once: true }));
  }
  function clear() { stopMovers(); stage.innerHTML = ""; }
  const unlocked = new Set();

  /* ---------------- HUD ---------------- */
  const progressEl = document.getElementById("progress");
  function renderProgress(cur) {
    progressEl.innerHTML = LEVELS.map((L, i) =>
      `<div class="seg ${L.type === "golden" ? "golden" : ""} ${i < cur ? "done" : ""} ${i === cur ? "current" : ""}" title="Level ${i + 1}"></div>`
    ).join("");
  }
  const musicBtn = document.getElementById("musicToggle");
  const sfxBtn = document.getElementById("sfxToggle");
  musicBtn.addEventListener("click", () => {
    const on = Audio8.toggleMusic();
    musicBtn.classList.toggle("off", !on); musicBtn.setAttribute("aria-pressed", on);
  });
  sfxBtn.addEventListener("click", () => {
    const on = Audio8.toggleSfx();
    sfxBtn.classList.toggle("off", !on); sfxBtn.setAttribute("aria-pressed", on);
    sfx("click");
  });

  /* ---------------- FX: confetti + emoji particles ---------------- */
  const cv = document.getElementById("confetti");
  const cx = cv.getContext("2d");
  const COLORS = ["#ff3d7f", "#ffb627", "#14c7b4", "#8a4dff", "#fff4e0", "#ffd34d"];
  let parts = [], eparts = [], fxRAF = null;
  function resize() {
    const d = window.devicePixelRatio || 1;
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener("resize", resize); resize();

  function confetti(x, y, n = 90, power = 13) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(power * 0.3, power);
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - power * 0.4, g: 0.28,
        w: rand(6, 12), h: rand(4, 7), r: rand(0, 6), vr: rand(-0.3, 0.3), c: pick(COLORS), life: rand(80, 150) });
    }
    runFx();
  }
  function rain(n = 200) {
    for (let i = 0; i < n; i++) {
      parts.push({ x: rand(0, innerWidth), y: rand(-innerHeight, -10), vx: rand(-1, 1), vy: rand(2, 5), g: 0.04,
        w: rand(6, 12), h: rand(4, 7), r: rand(0, 6), vr: rand(-0.2, 0.2), c: pick(COLORS), life: 500 });
    }
    runFx();
  }
  function emojiBurst(x, y, list, n = 20, power = 14) {
    for (let i = 0; i < n; i++) {
      const el = document.createElement("span");
      el.className = "particle"; el.textContent = pick(list);
      el.style.fontSize = rand(18, 40) + "px";
      document.body.append(el);
      const a = rand(0, Math.PI * 2), sp = rand(power * 0.3, power);
      eparts.push({ el, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - power * 0.5, r: 0, vr: rand(-12, 12), life: rand(60, 120) });
    }
    runFx();
  }
  function runFx() {
    if (fxRAF) return;
    const tick = () => {
      cx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter((p) => {
        p.vx *= 0.985; p.vy = p.vy * 0.985 + p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
        if (p.life <= 0 || p.y > innerHeight + 30) return false;
        cx.save(); cx.globalAlpha = Math.min(1, p.life / 30); cx.translate(p.x, p.y); cx.rotate(p.r);
        cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
        cx.restore();
        return true;
      });
      eparts = eparts.filter((p) => {
        p.vx *= 0.98; p.vy += 0.5; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
        if (p.life <= 0 || p.y > innerHeight + 60) { p.el.remove(); return false; }
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.r}deg)`;
        p.el.style.opacity = Math.min(1, p.life / 25);
        return true;
      });
      if (parts.length || eparts.length) fxRAF = requestAnimationFrame(tick);
      else { fxRAF = null; cx.clearRect(0, 0, innerWidth, innerHeight); }
    };
    fxRAF = requestAnimationFrame(tick);
  }
  function hitWord(x, y, text, color) {
    const el = document.createElement("div");
    el.className = "hitword"; el.textContent = text;
    el.style.left = x + "px"; el.style.top = y + "px";
    el.style.setProperty("--r", rand(-12, 12) + "deg");
    if (color) el.style.color = color;
    document.body.append(el);
    setTimeout(() => el.remove(), 850);
  }
  function shake(big = false) {
    const c = big ? "shake-big" : "shake";
    stage.classList.remove("shake", "shake-big"); void stage.offsetWidth; stage.classList.add(c);
    setTimeout(() => stage.classList.remove(c), big ? 700 : 500);
  }
  function flash() { const f = h(`<div class="flash"></div>`); document.body.append(f); setTimeout(() => f.remove(), 750); }

  /* ---------------- PIÑATA ART (pure SVG) ---------------- */
  const PAL = {
    classic: { body: "#ff3d7f", rings: ["#ffb627", "#14c7b4", "#8a4dff"], cones: ["#14c7b4", "#ffb627", "#8a4dff", "#ffb627", "#14c7b4"], tips: ["#ff3d7f", "#8a4dff", "#14c7b4", "#ff3d7f", "#ffb627"] },
    golden: { body: "#ffc928", rings: ["#fff1a8", "#e09a00", "#ffe066"], cones: ["#ffd84d", "#f2b705", "#ffe58a", "#f2b705", "#ffd84d"], tips: ["#fff6cc", "#ffffff", "#fff6cc", "#ffffff", "#fff6cc"] },
    egg: { body: "#ffb627", rings: ["#fff4e0", "#ff3d7f", "#14c7b4"], cones: ["#8a4dff", "#14c7b4", "#ff3d7f", "#14c7b4", "#8a4dff"], tips: ["#ffb627", "#fff4e0", "#ffb627", "#fff4e0", "#ffb627"] },
    intern: { body: "#14c7b4", rings: ["#ff3d7f", "#ffb627", "#8a4dff"], cones: ["#ff3d7f", "#8a4dff", "#ffb627", "#8a4dff", "#ff3d7f"], tips: ["#14c7b4", "#ffb627", "#ff3d7f", "#ffb627", "#14c7b4"] },
  };
  function pol(r, deg, c = [100, 104]) { const a = deg * Math.PI / 180; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; }
  function pinataSVG(variant = "classic", fake = false) {
    const p = PAL[variant] || PAL.classic, R = 56;
    const ink = "#1d0f36";
    let cones = "";
    [-90, -18, 54, 126, 198].forEach((a, i) => {
      const b1 = pol(R - 6, a - 22), b2 = pol(R - 6, a + 22), tip = pol(R + 44, a);
      const lerp = (u, v, k) => [u[0] + (v[0] - u[0]) * k, u[1] + (v[1] - u[1]) * k];
      const s1 = lerp(b1, tip, 0.42), s2 = lerp(b2, tip, 0.42);
      cones += `<polygon points="${b1} ${tip} ${b2}" fill="${p.cones[i]}" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
      cones += `<line x1="${s1[0]}" y1="${s1[1]}" x2="${s2[0]}" y2="${s2[1]}" stroke="${p.tips[i]}" stroke-width="6" stroke-linecap="round"/>`;
      if (a !== -90) [-28, 0, 28].forEach((o, k) => {
        const e = pol(14, a + o, tip);
        cones += `<line x1="${tip[0]}" y1="${tip[1]}" x2="${e[0]}" y2="${e[1]}" stroke="${p.tips[(i + k) % 5]}" stroke-width="4" stroke-linecap="round"/>`;
      });
    });
    const ring = (r, c) => `<circle cx="100" cy="104" r="${r}" fill="none" stroke="${c}" stroke-width="9" stroke-dasharray="3.5 2"/>`;
    let face;
    if (variant === "intern") {
      face = `<g><rect x="76" y="90" width="22" height="15" rx="5" fill="${ink}"/><rect x="102" y="90" width="22" height="15" rx="5" fill="${ink}"/>
        <line x1="97" y1="95" x2="103" y2="95" stroke="${ink}" stroke-width="3"/><line x1="80" y1="94" x2="88" y2="94" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <path d="M88 116 Q102 124 114 112" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
    } else if (fake) {
      face = `<circle cx="87" cy="99" r="5" fill="${ink}"/><circle cx="113" cy="99" r="5" fill="${ink}"/>
        <line x1="105" y1="86" x2="120" y2="83" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M88 117 Q104 121 115 110" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    } else {
      face = `<circle cx="87" cy="99" r="5.5" fill="${ink}"/><circle cx="113" cy="99" r="5.5" fill="${ink}"/>
        <circle cx="89" cy="97" r="1.8" fill="#fff"/><circle cx="115" cy="97" r="1.8" fill="#fff"/>
        <circle cx="78" cy="111" r="5" fill="#ff8fb1" opacity=".8"/><circle cx="122" cy="111" r="5" fill="#ff8fb1" opacity=".8"/>
        <path d="M89 113 Q100 124 111 113" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    let extra = "";
    if (variant === "egg") {
      const fried = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 -4 Q-16 -14 -4 -13 Q4 -18 12 -10 Q18 -2 12 6 Q8 14 -4 12 Q-16 10 -14 -4Z" fill="#fff"/><circle r="6" fill="#ffd21f"/></g>`;
      extra = fried(70, 70, 1.1) + fried(132, 128, 0.95) + fried(150, 60, 0.7) +
        `<path d="M60 140 q4 14 0 22 M124 150 q3 10 0 16" stroke="#ffd21f" stroke-width="5" stroke-linecap="round" fill="none"/>`;
    }
    if (variant === "golden") {
      const star = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="#fff"/>`;
      extra = star(40, 40, 1) + star(165, 70, 0.8) + star(150, 175, 0.9) + star(30, 160, 0.7);
    }
    const crack = `<path class="crack" d="M70 74 L82 88 L74 98 L88 110 L80 124 M128 80 L120 94 L132 102 L122 118" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<svg viewBox="0 0 200 205" aria-hidden="true"><g class="body">${cones}
      <circle cx="100" cy="104" r="${R}" fill="${p.body}" stroke="${ink}" stroke-width="3"/>
      ${ring(46, p.rings[0])}${ring(35, p.rings[1])}${ring(24.5, p.rings[2])}
      <circle cx="100" cy="104" r="${R}" fill="none" stroke="${ink}" stroke-width="3"/>
      ${face}${extra}${crack}</g></svg>`;
  }

  /* ---------------- PIÑATA OBJECT ---------------- */
  class Pinata {
    constructor(opts) {
      this.o = Object.assign({ hp: 5, size: 200, variant: "classic", rope: true, fake: false, parent: stage }, opts);
      this.hp = this.max = this.o.hp;
      this.size = this.o.size;
      this.height = (this.o.rope ? 60 : 0) + this.size * 1.025;
      this.dead = false;
      const v = this.o.variant;
      this.el = h(`<div class="pinata ${this.o.rope ? "" : "free"} ${v === "golden" ? "golden" : ""}" style="--size:${this.size}px" role="button" tabindex="0" aria-label="Piñata — click to hit">
        ${this.o.rope ? '<div class="rope"></div>' : ""}${pinataSVG(v, this.o.fake)}
        ${this.max > 1 ? '<div class="hp"><i style="width:100%"></i></div>' : ""}</div>`);
      this.el.addEventListener("pointerdown", (e) => { e.preventDefault(); this.hit(e.clientX, e.clientY); });
      this.el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const c = this.center(); this.hit(c.x, c.y); }
      });
      this.o.parent.append(this.el);
    }
    place(x, y) { this.x = x; this.y = y; this.apply(); }
    apply() { this.el.style.left = this.x + "px"; this.el.style.top = this.y + "px"; }
    center() { const r = this.el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.6 }; }
    say(text) {
      this.el.querySelector(".bubble-say")?.remove();
      const b = h(`<div class="bubble-say"></div>`); b.textContent = text;
      this.el.append(b); setTimeout(() => b.remove(), 1100);
    }
    hit(x, y) {
      if (this.dead) return;
      if (this.o.fake) {
        this.dead = true; sfx("fake");
        hitWord(x, y, pick(FAKE_WORDS), "#fff4e0");
        emojiBurst(x, y, ["💨", "🙃", "✨"], 8, 8);
        this.el.style.transition = "transform .3s, opacity .3s";
        this.el.style.transform = "scale(0) rotate(30deg)"; this.el.style.opacity = "0";
        setTimeout(() => this.el.remove(), 320);
        this.o.onFake?.(this);
        return;
      }
      this.hp--;
      sfx("hit");
      const bar = this.el.querySelector(".hp i");
      if (bar) bar.style.width = (this.hp / this.max) * 100 + "%";
      this.el.classList.remove("hit"); void this.el.offsetWidth; this.el.classList.add("hit");
      if (this.hp <= this.max / 2) this.el.classList.add("cracked");
      hitWord(x, y - 20, pick(HIT_WORDS), pick(["#ffb627", "#14c7b4", "#ff3d7f", "#fff4e0"]));
      emojiBurst(x, y, ["🍬", "🍭", "⭐", "🍫"], 4, 9);
      confetti(x, y, 14, 7);
      if (this.hp <= 0) return this.break();
      this.o.onHit?.(this);
    }
    break() {
      this.dead = true;
      const c = this.center();
      sfx("break"); shake();
      confetti(c.x, c.y, 150, 16);
      emojiBurst(c.x, c.y, this.o.variant === "egg" ? ["🥚", "🍳", "🍬", "🍭"] : this.o.variant === "golden" ? ["🎉", "🎂", "✨", "🏴", "🪅", "💛"] : ["🍬", "🍭", "🍫", "🎉", "⭐", "🧁"], 26, 16);
      this.el.style.transition = "transform .25s, opacity .25s";
      this.el.style.transform = "scale(1.4)"; this.el.style.opacity = "0";
      setTimeout(() => this.el.remove(), 260);
      this.o.onBreak?.(this);
    }
  }

  /* ---------------- MOVEMENT ---------------- */
  let movers = [], moverRAF = null;
  function startMovers() {
    cancelAnimationFrame(moverRAF);
    const tick = () => {
      const W = innerWidth, H = innerHeight;
      for (const m of movers) {
        const p = m.p;
        if (p.dead) continue;
        if (m.wander) { const a = rand(-0.06, 0.06), c = Math.cos(a), s = Math.sin(a); [m.vx, m.vy] = [m.vx * c - m.vy * s, m.vx * s + m.vy * c]; }
        p.x += m.vx; p.y += m.vy;
        const minY = 140, maxX = W - p.size - 8, maxY = H - p.height - 28;
        if (p.x < 8) { p.x = 8; m.vx = Math.abs(m.vx); }
        if (p.x > maxX) { p.x = maxX; m.vx = -Math.abs(m.vx); }
        if (p.y < minY) { p.y = minY; m.vy = Math.abs(m.vy); }
        if (p.y > maxY) { p.y = Math.max(minY, maxY); m.vy = -Math.abs(m.vy); }
        p.apply();
      }
      moverRAF = requestAnimationFrame(tick);
    };
    moverRAF = requestAnimationFrame(tick);
  }
  function stopMovers() { cancelAnimationFrame(moverRAF); movers = []; }
  function randomSpot(p) {
    return [rand(8, Math.max(9, innerWidth - p.size - 8)), rand(140, Math.max(141, innerHeight - p.height - 28))];
  }

  /* ---------------- SHARED UI BUILDING BLOCKS ---------------- */
  async function typeText(el, text, speed = 38) {
    el.classList.add("caret");
    for (const ch of text) { el.textContent += ch; await sleep(speed); }
    el.classList.remove("caret");
  }
  async function revealLines(container, lines) {
    for (const l of lines) {
      const p = h(`<p class="${l.cls || "mid"} reveal"></p>`);
      p.innerHTML = rich(l.text);
      container.append(p);
      if (l.sound) sfx(l.sound);
      await sleep(l.wait ?? 1000);
    }
  }
  function button(container, label, cls = "") {
    const wrap = h(`<div><button class="btn ${cls} pop">${t(label)}</button></div>`);
    container.append(wrap);
    const b = wrap.querySelector("button"); b.focus({ preventScroll: true });
    return clicked(b);
  }
  async function overlayCard(build, btnLabel, cls = "") {
    const ov = h(`<div class="overlay"><div class="card stack ${cls}"></div></div>`);
    document.body.append(ov);
    const card = ov.firstElementChild;
    await build(card);
    await button(card, btnLabel, "hot");
    ov.remove();
  }
  function levelClear(lines, btn = "Next level 🪅") {
    sfx("levelComplete");
    return overlayCard((card) => revealLines(card, lines), btn);
  }
  function levelHeader(i, title) {
    return `<p class="small reveal">Level ${i + 1} of ${LEVELS.length}</p><p class="big reveal" style="animation-delay:.1s">${t(title)}</p>`;
  }

  // A full-screen arena with one hanging piñata. Resolves when broken.
  function pinataArena({ title, sub = "", hp = 5, variant = "classic", taunts = null }) {
    return new Promise((resolve) => {
      clear();
      const arena = h(`<section class="arena"><div class="arena-title"><p class="big reveal">${t(title)}</p>
        ${sub ? `<p class="small reveal" style="animation-delay:.25s">${t(sub)}</p>` : ""}</div></section>`);
      stage.append(arena);
      sfx("whoosh");
      const size = Math.round(Math.min(230, innerWidth * 0.5));
      let n = 0;
      const p = new Pinata({
        parent: arena, hp, variant, size, rope: true,
        onHit: taunts ? (pp) => pp.say(taunts[n++ % taunts.length]) : null,
        onBreak: () => setTimeout(resolve, 1300),
      });
      p.place(innerWidth / 2 - size / 2, clamp(innerHeight * 0.55 - p.height / 2, 190, innerHeight - p.height - 20));
      p.el.classList.add("pop");
    });
  }

  function levelIntro(L, i) {
    return overlayCard(async (card) => {
      card.classList.add("level-intro");
      card.append(h(`<p class="num">Level ${i + 1} of ${LEVELS.length}</p>`));
      card.append(h(`<div class="icon pop">🪅</div>`));
      card.append(h(`<p class="ttl">${t(L.title)}</p>`));
      card.append(h(`<p class="txt">${t(L.flavor || "")}</p>`));
      if (L.fakes) card.append(h(`<p class="bonus">Tip: real piñatas don't smirk. 😏</p>`));
      sfx("notification");
    }, "Bring it on 🪅");
  }

  function challengeCard(idx, line) {
    const c = EDINBURGH_CHALLENGES[idx];
    if (!c) return Promise.resolve();
    unlocked.add(idx);
    setTimeout(() => sfx("challenge"), 150);
    confetti(innerWidth / 2, innerHeight / 2, 120, 15);
    return overlayCard(async (card) => {
      card.append(h(`<p class="small">${t(line)}</p>`));
      card.append(h(`<p class="lbl">🪅 This piñata contained… EDINBURGH CHALLENGE #${idx + 1}</p>`));
      card.append(h(`<div class="icon pop">${c.icon}</div>`));
      card.append(h(`<p class="ttl">${t(c.title)}</p>`));
      card.append(h(`<p class="txt">${t(c.text)}</p>`));
      if (c.bonus) card.append(h(`<p class="bonus">${t(c.bonus)}</p>`));
    }, "Challenge accepted 🏴", "challenge");
  }

  function lyricsModal() {
    const body = SONG.sections.map((s) =>
      `<h4>${t(s.label)}</h4>${s.lines.map((l) => `<p>${t(l)}</p>`).join("")}`).join("");
    const ov = h(`<div class="overlay"><div class="card lyrics" style="text-align:left">
      <p class="lbl">🎵 The official birthday anthem</p><p class="ttl">${t(SONG.title)}</p>
      <p class="small">${t(SONG.credit)}</p>${body}
      <div style="text-align:center"><button class="btn hot">Close</button></div></div></div>`);
    document.body.append(ov);
    ov.querySelector("button").addEventListener("click", () => { sfx("click"); ov.remove(); });
    ov.addEventListener("click", (e) => { if (e.target === ov) ov.remove(); });
  }
  function showNowPlaying() {
    if (document.querySelector(".now-playing")) return;
    const b = h(`<button class="now-playing">🎵 Now playing: ${t(SONG.title)}</button>`);
    b.addEventListener("click", lyricsModal);
    document.body.append(b);
  }

  /* =================================================================
     SCENES
     ================================================================= */
  async function titleScreen() {
    clear();
    const s = h(`<section class="scene stack title-card">
      <div class="title-pinata">${pinataSVG("classic")}</div>
      <span class="tag">A game ${t(PERSON.teamName)} spent way too much time on</span>
      <h1 class="mega pinata-type">${t(OPENING.title)}</h1>
      <p class="mid">${t(OPENING.subtitle)}</p>
      <p class="small">Starring ${t(PERSON.name)}, ${t(PERSON.role)}. Sound on, please. 🔊</p></section>`);
    stage.append(s);
    await button(s, OPENING.bootButton);
    Audio8.init();
  }

  async function opening() {
    clear();
    const s = h(`<section class="scene">
      <div class="desktop"><div class="bar"><i></i><i></i><i></i><b>${t(PERSON.name)}'s laptop</b></div>
      <div class="body"><div class="stack"><div class="clock"></div><p class="mid" id="normal"></p></div></div></div></section>`);
    stage.append(s);
    await typeText(s.querySelector(".clock"), OPENING.clock, 90);
    await sleep(300);
    await typeText(s.querySelector("#normal"), fill(OPENING.normalDay), 45);
    await sleep(1200);

    sfx("call");
    const toast = h(`<div class="toast" role="button" tabindex="0"><div class="t1">${t(OPENING.notifTitle)}</div>
      <div class="t2">${t(OPENING.notifText)}</div><div class="t3">${t(PERSON.chatAppName)} • now • click to join</div></div>`);
    document.body.append(toast);
    toast.focus({ preventScroll: true });
    const ring = setInterval(() => sfx("call"), 2400);
    await new Promise((r) => {
      toast.addEventListener("click", r, { once: true });
      toast.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") r(); });
    });
    clearInterval(ring); sfx("click"); toast.remove();

    clear();
    const r = h(`<section class="scene stack"></section>`);
    stage.append(r);
    for (const line of OPENING.reveal) {
      const p = h(`<p class="${line.big ? "mega pinata-type" : "big"} reveal"></p>`);
      p.innerHTML = rich(line.text);
      r.append(p);
      if (line.big) { shake(); sfx("hit"); } else sfx("click");
      await sleep(line.pause);
      if (line.text === "WAIT." || line.text === "...") { await sleep(200); p.remove(); }
    }
    await button(r, OPENING.startButton, "hot");
    Audio8.startMusic();
    showNowPlaying();
    confetti(innerWidth / 2, innerHeight / 2, 120, 15);
  }

  /* ---------- LEVEL 1: THE IGNORED REQUEST ---------- */
  async function levelIgnored(L, i) {
    const S = STORY.ignored;
    clear();
    const s = h(`<section class="scene wide stack">${levelHeader(i, S.title)}
      <div class="chat"><aside class="side"><h4>Team members</h4>
        ${S.teammates.map((m, k) => `<div class="member"><b>${t(m.name)}</b><span data-k="${k}">${t(m.statuses[0])}</span></div>`).join("")}
      </aside><div class="main"><div class="head">${t(S.channel)}</div><div class="log"></div>
      <div class="compose"><div class="field"></div><button>Send</button></div></div></div></section>`);
    stage.append(s);
    const log = s.querySelector(".log"), field = s.querySelector(".field"), send = s.querySelector(".compose button");
    const statuses = [...s.querySelectorAll(".member span")];

    for (let m = 0; m < S.messages.length; m++) {
      field.textContent = fill(S.messages[m]);
      send.disabled = false; send.focus({ preventScroll: true });
      await clicked(send, false);
      send.disabled = true; field.textContent = "";
      const b = h(`<div class="bubble me"></div>`); b.textContent = fill(S.messages[m]);
      log.append(b); sfx("message"); log.scrollTop = 1e6;
      await sleep(700);
      // someone starts typing... then stops
      const who = S.teammates[m % S.teammates.length].name;
      const ty = h(`<div class="typing">${t(who)} is typing…</div>`);
      log.append(ty); log.scrollTop = 1e6;
      await sleep(1300); ty.remove();
      // everyone suddenly becomes busy
      statuses.forEach((el, k) => {
        el.textContent = fill(S.teammates[k].statuses[Math.min(m + 1, S.teammates[k].statuses.length - 1)]);
        el.classList.remove("changed"); void el.offsetWidth; el.classList.add("changed");
      });
      sfx("notification");
      await sleep(600);
    }
    const seen = h(`<div class="seen">${t(S.seenBy)}</div>`); log.append(seen); log.scrollTop = 1e6;
    await sleep(1600);

    clear();
    const pov = h(`<section class="scene stack"></section>`); stage.append(pov);
    await revealLines(pov, [
      { text: S.povTitle, cls: "mega pinata-type", wait: 700 },
      { text: S.povText, cls: "big", wait: 1300 },
      { text: S.povText2, cls: "mid", wait: 1800 },
    ]);
    await pinataArena({ title: S.pinataText, hp: L.hp, sub: "Click the piñata. Nobody else is going to." });
    await levelClear([
      { text: S.win1, cls: "big", wait: 1100 },
      { text: S.win2, cls: "mid", wait: 1100 },
      { text: S.win3, cls: "big", wait: 700 },
    ]);
  }

  /* ---------- LEVEL 2: THE MICROWAVE INCIDENT ---------- */
  async function levelMicrowave(L, i) {
    const S = STORY.microwave;
    clear();
    const s = h(`<section class="scene stack">${levelHeader(i, S.title)}
      <p class="clock" style="font-size:clamp(40px,8vw,72px)">${t(S.clock)}</p>
      <p class="mid">${t(S.setup1)}</p><p class="small">${t(S.setup2)}</p>
      <div class="microwave"><div class="window"><span class="egg">🥚</span></div>
        <div class="panel"><div class="display">0:00</div><div class="keys">${"<i></i>".repeat(9)}</div></div>
        <span class="smoke">💨</span></div></section>`);
    stage.append(s);
    const mw = s.querySelector(".microwave"), disp = s.querySelector(".display"), egg = s.querySelector(".egg");
    await button(s, S.startButton, "hot");
    s.querySelector(".btn").parentElement.remove();
    mw.classList.add("on"); sfx("hum");
    for (let sec = 5; sec >= 0; sec--) {
      disp.textContent = `0:0${sec}`;
      if (sec === 2) mw.classList.add("danger");
      if (sec > 0) { sfx("beep"); await sleep(650); }
    }
    // BOOM
    flash(); shake(true); sfx("explosion");
    mw.classList.remove("on", "danger"); mw.classList.add("boom");
    egg.textContent = ""; disp.textContent = "ERR";
    const r = mw.getBoundingClientRect();
    emojiBurst(r.left + r.width * 0.35, r.top + r.height / 2, ["🥚", "🍳", "💥", "🟡", "⚪", "🫠"], 60, 28);
    confetti(r.left + r.width * 0.35, r.top + r.height / 2, 80, 20);
    const boomTxt = h(`<p class="mega pinata-type pop"><span class="emo">💥</span> BOOM</p>`);
    s.insertBefore(boomTxt, mw);
    await sleep(2400);

    clear();
    const rep = h(`<section class="scene stack"><div class="incident"><h3>${t(S.report.title)}</h3>
      ${S.report.rows.map((row, k) => `<div class="row" style="animation-delay:${0.4 + k * 0.6}s"><b>${t(row[0])}</b><span>${t(row[1])}</span></div>`).join("")}
      <div class="stamp">${t(S.report.stamp)}</div></div></section>`);
    stage.append(rep);
    sfx("notification");
    await sleep(2300); sfx("hit");
    await sleep(900);
    await revealLines(rep, [{ text: S.evidence, cls: "mid", wait: 600 }]);
    await button(rep, "Destroy the evidence 🧹", "hot");
    await pinataArena({ title: S.pinataText, hp: L.hp, variant: "egg", sub: "Still slightly warm." });
    await levelClear([
      { text: S.win1, cls: "big", wait: 1000 },
      { text: S.win2, cls: "mid", wait: 600 },
    ]);
  }

  /* ---------- LEVEL 3: THE EDINBURGH KNIFE INCIDENT ---------- */
  async function levelKnife(L, i) {
    const S = STORY.edinburgh;
    clear();
    const s = h(`<section class="scene stack">${levelHeader(i, S.title)}
      <div class="shop"><div class="awning"></div><div class="inner">
        <h2>${t(S.shopTitle)}</h2><span class="obj">${t(S.objective)}</span>
        <div class="shelf">${S.items.map((it, k) => `<button class="item" data-k="${k}"><span class="e">${it.emoji}</span><span class="n">${t(it.name)}</span><span class="p">${t(it.price)}</span></button>`).join("")}</div>
        <p class="msg" aria-live="polite"></p></div></div></section>`);
    stage.append(s);
    const msg = s.querySelector(".msg");
    await new Promise((resolve) => {
      s.querySelectorAll(".item").forEach((btn) => btn.addEventListener("click", () => {
        const it = S.items[btn.dataset.k];
        if (it.target) { sfx("beep"); msg.textContent = "Added to basket. Proceeding to checkout…"; btn.style.borderColor = "#14c7b4"; resolve(); return; }
        sfx("wrong"); msg.textContent = fill(it.decoy);
        btn.classList.remove("nope"); void btn.offsetWidth; btn.classList.add("nope");
      }));
    });
    await sleep(1300);

    clear(); sfx("alarm"); shake();
    const v = h(`<section class="scene"><div class="verify stack">
      <p class="big alert-flash">${t(S.alertTitle)}</p><p class="mid">${t(S.alertText)}</p>
      <div class="scanbox">🪪</div><div class="vtext stack"></div></div></section>`);
    stage.append(v);
    const vbox = v.querySelector(".verify"), vt = v.querySelector(".vtext"), scan = v.querySelector(".scanbox");
    await button(vt, S.idButton);
    vt.innerHTML = "";
    scan.textContent = "🙂";
    await revealLines(vt, [{ text: S.scanning, cls: "small", wait: 2200 }]);
    vt.innerHTML = "";
    await revealLines(vt, [{ text: S.wait, cls: "big", wait: 1400 }]);
    scan.textContent = "🧒"; sfx("wrong"); shake();
    await revealLines(vt, [
      { text: S.verdict, cls: "mega pinata-type", wait: 1500 },
      { text: S.declined, cls: "small", wait: 1000 },
    ]);
    await button(vbox, "Excuse me?! 😤", "hot");
    await pinataArena({ title: S.pinataText, hp: L.hp, sub: "No ID required for this one." });
    await levelClear([
      { text: S.win1, cls: "big", wait: 900 },
      { text: S.win2, cls: "mid", wait: 600 },
    ]);
  }

  /* ---------- LEVEL 4: THE LAST COOKIE ---------- */
  let cookieId = 0;
  function cookieSVG(id) {
    const ink = "#1d0f36";
    const chips = [[38, 36], [74, 30], [86, 62], [40, 78], [64, 88], [30, 56], [92, 84]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="5" fill="#4a2a14" transform="rotate(${(x * 7) % 60} ${x} ${y})"/>`).join("");
    return `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><mask id="bm${id}"><rect width="120" height="120" fill="#fff"/><g class="bites"></g></mask></defs>
      <g mask="url(#bm${id})"><circle cx="60" cy="60" r="54" fill="#d9944a" stroke="${ink}" stroke-width="3"/>
      <circle cx="60" cy="60" r="44" fill="#e8ae66" opacity=".55"/>${chips}
      <circle cx="50" cy="56" r="5" fill="${ink}"/><circle cx="72" cy="56" r="5" fill="${ink}"/>
      <circle cx="51.5" cy="54.5" r="1.6" fill="#fff"/><circle cx="73.5" cy="54.5" r="1.6" fill="#fff"/>
      <ellipse class="mouth" cx="61" cy="70" rx="5" ry="6" fill="${ink}"/></g></svg>`;
  }
  function addBite(svg) {
    const g = svg.querySelector(".bites");
    const a = rand(0, Math.PI * 2);
    const [x, y] = [60 + 56 * Math.cos(a), 60 + 56 * Math.sin(a)];
    const perp = a + Math.PI / 2;
    [-1, 0, 1].forEach((k) => {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", x + Math.cos(perp) * k * 13 - Math.cos(a) * (k ? 2 : 6));
      c.setAttribute("cy", y + Math.sin(perp) * k * 13 - Math.sin(a) * (k ? 2 : 6));
      c.setAttribute("r", k ? 11 : 14); c.setAttribute("fill", "#000");
      g.append(c);
    });
  }

  async function levelCookie(L, i) {
    const S = STORY.cookie;
    const total = L.bites || 6;
    clear();
    const s = h(`<section class="scene stack">${levelHeader(i, S.title)}
      <p class="clock" style="font-size:clamp(40px,8vw,72px)">${t(S.clock)}</p>
      <p class="mid">${t(S.setup1)}</p><p class="small">${t(S.setup2)}</p>
      <div class="cookie-hero">${cookieSVG("hero")}</div></section>`);
    stage.append(s);
    await button(s, S.eatButton, "hot");
    s.querySelector(".btn").parentElement.remove();
    s.querySelector(".cookie-hero").classList.add("run");
    sfx("whoosh");
    await sleep(500);
    await revealLines(s, [{ text: S.escape, cls: "big", wait: 1500 }]);

    clear();
    const arena = h(`<section class="arena"><div class="arena-title">
      <p class="big reveal">${t(S.gameTitle)}</p><p class="small reveal" style="animation-delay:.2s">${t(S.gameSub)}</p>
      <div class="bites-left">${"<span>🍪</span>".repeat(total)}</div></div></section>`);
    stage.append(arena);
    const size = Math.round(clamp(innerWidth * 0.22, 95, 140));
    const id = ++cookieId;
    const el = h(`<div class="cookie pop" role="button" tabindex="0" aria-label="Cookie — click to take a bite" style="--size:${size}px">${cookieSVG(id)}</div>`);
    arena.append(el);
    const svg = el.querySelector("svg");
    const scale = clamp(innerWidth / 1000, 0.6, 1);
    const c = { x: innerWidth / 2 - size / 2, y: innerHeight / 2, vx: 0, vy: 0, spin: 0 };
    let bites = 0, lastFlee = 0, done = false, raf;
    const base = () => (2.2 + bites * 0.8) * scale;
    const ang = rand(0, Math.PI * 2); c.vx = Math.cos(ang) * base(); c.vy = Math.sin(ang) * base();
    const place = () => { el.style.left = c.x + "px"; el.style.top = c.y + "px"; svg.style.transform = `rotate(${c.spin}deg)`; };
    const tick = () => {
      const a = rand(-0.08, 0.08), co = Math.cos(a), si = Math.sin(a);
      [c.vx, c.vy] = [c.vx * co - c.vy * si, c.vx * si + c.vy * co];
      const mag = Math.hypot(c.vx, c.vy) || 1, target = base();
      const k = (mag + (target - mag) * 0.04) / mag; c.vx *= k; c.vy *= k;
      c.x += c.vx; c.y += c.vy; c.spin += c.vx * 1.5;
      const minY = 170, maxX = innerWidth - size - 8, maxY = innerHeight - size - 24;
      if (c.x < 8) { c.x = 8; c.vx = Math.abs(c.vx); }
      if (c.x > maxX) { c.x = maxX; c.vx = -Math.abs(c.vx); }
      if (c.y < minY) { c.y = minY; c.vy = Math.abs(c.vy); }
      if (c.y > maxY) { c.y = Math.max(minY, maxY); c.vy = -Math.abs(c.vy); }
      place();
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const say = (txt) => {
      el.querySelector(".bubble-say")?.remove();
      const b = h(`<div class="bubble-say"></div>`); b.textContent = txt;
      el.append(b); setTimeout(() => b.remove(), 1000);
    };
    // the cookie tries to run away from the cursor (desktop)
    arena.addEventListener("pointermove", (e) => {
      if (done || e.pointerType !== "mouse") return;
      const now = performance.now();
      const dx = c.x + size / 2 - e.clientX, dy = c.y + size / 2 - e.clientY, d = Math.hypot(dx, dy);
      if (d < size * 0.85 && now - lastFlee > 700 && Math.random() < 0.5) {
        lastFlee = now;
        c.vx = (dx / d) * base() * 2.6; c.vy = (dy / d) * base() * 2.6;
      }
    });
    arena.addEventListener("pointerdown", (e) => {
      if (done || el.contains(e.target)) return;
      if (Math.random() < 0.35) { sfx("wrong"); hitWord(e.clientX, e.clientY, pick(S.missWords), "#b9a8d9"); }
    });
    await new Promise((resolve) => {
      const bite = (x, y) => {
        if (done) return;
        bites++;
        sfx("crunch");
        addBite(svg);
        hitWord(x, y - 20, pick(S.chompWords), "#ffb627");
        emojiBurst(x, y, ["🟤", "🍪", "✨"], 7, 9);
        arena.querySelectorAll(".bites-left span")[bites - 1]?.classList.add("gone");
        if (bites >= total) {
          done = true; cancelAnimationFrame(raf);
          sfx("break"); shake();
          confetti(x, y, 140, 15); emojiBurst(x, y, ["🍪", "😋", "🎉", "🟤"], 22, 15);
          el.style.transition = "transform .25s, opacity .25s"; el.style.transform = "scale(1.4)"; el.style.opacity = "0";
          setTimeout(resolve, 1300);
          return;
        }
        say(S.taunts[(bites - 1) % S.taunts.length]);
        // escape jump after each bite
        setTimeout(() => {
          if (done) return;
          el.classList.add("jump");
          c.x = rand(8, Math.max(9, innerWidth - size - 8)); c.y = rand(170, Math.max(171, innerHeight - size - 24));
          const a2 = rand(0, Math.PI * 2); c.vx = Math.cos(a2) * base(); c.vy = Math.sin(a2) * base();
          sfx("whoosh");
          setTimeout(() => el.classList.remove("jump"), 300);
        }, 250);
      };
      el.addEventListener("pointerdown", (e) => { e.preventDefault(); bite(e.clientX, e.clientY); });
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const r = el.getBoundingClientRect(); bite(r.left + r.width / 2, r.top + r.height / 2); }
      });
    });
    await levelClear([
      { text: S.win1, cls: "big", wait: 1100 },
      { text: S.win2, cls: "big pinata-type", wait: 600, sound: "challenge" },
    ]);
  }

  /* ---------- ARENA LEVELS (Wanderer, Speed Demon, Twins, Trickster, Chaos, Final Boss) ---------- */
  async function arenaLevel(L, i) {
    await levelIntro(L, i);
    clear();
    const arena = h(`<section class="arena"><div class="arena-title">
      <p class="big reveal" ${L.teleport ? 'style="color:#ff4b3e"' : ""}>${t(L.title)}</p>
      <p class="small reveal" style="animation-delay:.2s">Piñatas left: <b class="left">${L.count}</b></p></div></section>`);
    stage.append(arena);
    if (L.teleport) { shake(true); sfx("alarm"); }
    const scale = clamp(innerWidth / 1000, 0.6, 1);
    const base = L.teleport ? 140 : L.count >= 4 ? 120 : L.count === 2 ? 150 : 170;
    const size = Math.round(base * clamp(innerWidth / 900, 0.62, 1));
    const speed = (L.speed || 0) * scale;
    let remaining = L.count;
    const all = [];
    await new Promise((resolve) => {
      const spawn = (fake) => {
        const p = new Pinata({
          parent: arena, hp: L.hp, size, rope: false, fake,
          onHit: L.teleport ? (pp) => {
            pp.el.classList.add("dodge");
            pp.place(...randomSpot(pp));
            setTimeout(() => pp.el.classList.remove("dodge"), 260);
            sfx("whoosh");
          } : null,
          onBreak: () => {
            remaining--;
            arena.querySelector(".left").textContent = remaining;
            if (remaining <= 0) {
              all.filter((x) => !x.dead && x.o.fake).forEach((x) => x.hit(x.center().x, x.center().y));
              setTimeout(resolve, 1200);
            }
          },
        });
        p.place(...randomSpot(p));
        p.el.classList.add("pop");
        const a = rand(0, Math.PI * 2);
        if (speed > 0) movers.push({ p, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, wander: L.id === "wanderer" || !!fake });
        all.push(p);
      };
      for (let k = 0; k < L.count; k++) spawn(false);
      for (let k = 0; k < (L.fakes || 0); k++) spawn(true);
      startMovers();
    });
    stopMovers();
    await challengeCard(L.challenge, pick(CLEAR_LINES));
  }

  /* ---------- HIDDEN PIÑATA ---------- */
  async function hiddenLevel(L, i) {
    await levelIntro(L, i);
    clear();
    const room = h(`<section class="room"><div class="window-view"></div><div class="desk"></div>
      <div class="laptop">📬 47 unread messages<br>(0 of them are replies)</div>
      <div class="arena-title" style="position:absolute;left:0;right:0;top:70px;text-align:center;pointer-events:none">
        <p class="big reveal">${t(L.title)}</p><p class="small reveal">It's tiny. It's here. Somewhere.</p></div></section>`);
    stage.append(room);
    const spots = [[10, 52], [22, 53], [68, 52], [78, 51], [88, 53], [36, 55], [8, 82], [24, 74], [46, 86], [62, 78], [80, 84], [92, 70], [40, 30], [84, 32], [62, 26], [18, 88]]
      .sort(() => Math.random() - 0.5);
    const objs = Object.keys(HIDDEN_MISS).filter((k) => k !== "default");
    objs.forEach((emo, k) => {
      const [x, y] = spots[k];
      const o = h(`<span class="obj" role="button" tabindex="-1" style="left:${x}%;top:${y}%">${emo}</span>`);
      o.addEventListener("pointerdown", (e) => {
        sfx("wrong"); hitWord(e.clientX, e.clientY - 20, HIDDEN_MISS[emo] || HIDDEN_MISS.default, "#fff4e0");
        o.animate([{ transform: "rotate(0)" }, { transform: "rotate(-15deg)" }, { transform: "rotate(10deg)" }, { transform: "rotate(0)" }], 400);
      });
      room.append(o);
    });
    const [tx, ty] = spots[objs.length];
    const tiny = h(`<div class="tiny" role="button" tabindex="0" aria-label="Tiny piñata" style="left:calc(${tx}% + 18px);top:calc(${ty}% + 10px)">${pinataSVG("classic")}</div>`);
    room.append(tiny);
    room.addEventListener("pointerdown", (e) => {
      if (e.target === room) { sfx("click"); hitWord(e.clientX, e.clientY, HIDDEN_MISS.default, "#b9a8d9"); }
    });
    const hintTimer = setTimeout(() => {
      const hb = h(`<button class="btn ghost" style="position:absolute;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%)">Hint, please 🙏</button>`);
      hb.addEventListener("click", () => {
        sfx("click");
        tiny.animate([{ transform: "scale(1)" }, { transform: "scale(3)", filter: "drop-shadow(0 0 12px #ffd34d)" }, { transform: "scale(1)" }], { duration: 700, iterations: 3 });
      });
      room.append(hb);
    }, 12000);
    await new Promise((resolve) => {
      const found = () => {
        clearTimeout(hintTimer);
        const r = tiny.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
        sfx("break"); shake();
        confetti(x, y, 140, 15); emojiBurst(x, y, ["🍬", "🎉", "👀", "🍭"], 22, 14);
        hitWord(x, y - 30, "FOUND IT! 👀", "#ffd34d");
        tiny.remove();
        setTimeout(resolve, 1300);
      };
      tiny.addEventListener("pointerdown", (e) => { e.stopPropagation(); found(); }, { once: true });
      tiny.addEventListener("keydown", (e) => { if (e.key === "Enter") found(); });
    });
    await challengeCard(L.challenge, "Found it. Your attention to detail is terrifying.");
  }

  /* ---------- THE GOLDEN PIÑATA ---------- */
  async function goldenLevel() {
    clear();
    document.body.classList.add("golden-mode");
    Audio8.setIntensity(0);
    const s = h(`<section class="scene stack"></section>`);
    stage.append(s);
    await revealLines(s, [{ text: FINALE.goldenIntro, cls: "big gold-text", wait: 1800, sound: "challenge" }]);
    s.innerHTML = "";
    await revealLines(s, [{ text: FINALE.survived, cls: "big", wait: 900 }]);
    const ul = h(`<ul class="survived-list"></ul>`); s.append(ul);
    for (const item of FINALE.list) {
      const li = h(`<li class="reveal"></li>`); li.textContent = fill(item); ul.append(li);
      sfx("hit"); await sleep(1000);
    }
    await sleep(800);
    clear();
    Audio8.setIntensity(1);
    await new Promise((resolve) => {
      const arena = h(`<section class="arena"><div class="arena-title"><p class="mega gold-text reveal">${t(FINALE.oneHit)}</p></div></section>`);
      stage.append(arena);
      sfx("challenge");
      const size = Math.round(Math.min(260, innerWidth * 0.55));
      const p = new Pinata({ parent: arena, hp: 1, size, variant: "golden", rope: true, onBreak: resolve });
      p.place(innerWidth / 2 - size / 2, clamp(innerHeight * 0.56 - p.height / 2, 190, innerHeight - p.height - 20));
      p.el.classList.add("pop");
    });
    // massive celebration
    flash(); shake(true);
    Audio8.setIntensity(2);
    sfx("victory");
    rain(320);
    const W = innerWidth, H = innerHeight;
    for (let k = 0; k < 6; k++) {
      setTimeout(() => {
        confetti(rand(W * 0.1, W * 0.9), rand(H * 0.2, H * 0.6), 120, 18);
        emojiBurst(rand(W * 0.2, W * 0.8), H * 0.5, ["🎉", "🎂", "🪅", "✨", "🏴", "❤️", "🥳"], 14, 18);
      }, k * 380);
    }
    await sleep(1800);
  }

  async function finale() {
    clear();
    document.body.classList.remove("golden-mode");
    document.querySelector(".rays").style.opacity = ".6";
    renderProgress(LEVELS.length);
    const f = h(`<section class="finale"><div class="inner stack"></div></section>`);
    stage.append(f);
    const inner = f.firstElementChild;
    await revealLines(inner, [
      { text: FINALE.complete, cls: "mega pinata-type", wait: 1300 },
      { text: FINALE.birthday, cls: "big", wait: 1300 },
      { text: FINALE.edinburgh, cls: "mid gold-text", wait: 1100 },
    ]);
    sfx("challenge");
    const ids = EDINBURGH_CHALLENGES.map((_, k) => k);
    const missions = h(`<div style="margin-top:44px">
      <p class="big">${t(FINALE.missionsTitle)}</p><p class="small" style="max-width:60ch;margin:10px auto 0">${t(FINALE.missionsSub)}</p>
      <div class="missions">${ids.map((k, n) => {
        const c = EDINBURGH_CHALLENGES[k];
        return `<article class="mission" style="--tilt:${rand(-1.6, 1.6).toFixed(2)}deg;animation-delay:${n * 0.12}s">
          <span class="n">#${k + 1}</span><div class="i">${c.icon}</div>${c.from ? `<span class="from">Challenge from ${esc(c.from)}</span>` : ""}<h4>${t(c.title)}</h4><p>${t(c.text)}</p>
          ${c.bonus ? `<p class="b">${t(c.bonus)}</p>` : ""}
          <label class="check"><input type="checkbox"> Mission done</label></article>`;
      }).join("")}</div></div>`);
    inner.append(missions);
    missions.querySelectorAll(".check input").forEach((cb) => cb.addEventListener("change", (e) => {
      const card = cb.closest(".mission");
      card.classList.toggle("done", cb.checked);
      if (cb.checked) { const r = card.getBoundingClientRect(); sfx("levelComplete"); confetti(r.left + r.width / 2, r.top + 30, 70, 11); }
    }));
    if (typeof TEAM_MESSAGES !== "undefined" && TEAM_MESSAGES.length) {
      const colors = ["#ff3d7f", "#ffb627", "#14c7b4", "#8a4dff"];
      const msgs = h(`<div style="margin-top:56px"><p class="big">${t(FINALE.messagesTitle)}</p>
        <p class="small" style="margin-top:10px">${t(FINALE.messagesSub)}</p>
        <div class="team-msgs">${TEAM_MESSAGES.map((m, n) => `
          <article class="note" style="--accent:${colors[n % colors.length]};--tilt:${rand(-1.2, 1.2).toFixed(2)}deg">
            <header><span class="av">${esc([...m.from][0] || "?")}</span><b>${esc(m.from)}</b></header>
            <p>${esc(fill(m.text))}</p></article>`).join("")}</div></div>`);
      inner.append(msgs);
      const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }), { root: f, threshold: 0.15 });
      msgs.querySelectorAll(".note").forEach((n) => io.observe(n));
    }
    const actions = h(`<div style="margin-top:36px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button class="btn hot" id="lyr">${t(FINALE.lyricsButton)}</button><button class="btn ghost" id="again">${t(FINALE.replay)}</button></div>`);
    inner.append(actions);
    inner.append(h(`<p class="small" style="margin-top:28px">With love (and slightly delayed replies), ${t(PERSON.teamName)} 🪅</p>`));
    actions.querySelector("#lyr").addEventListener("click", () => { sfx("click"); lyricsModal(); });
    actions.querySelector("#again").addEventListener("click", () => { sfx("click"); location.href = location.pathname; });
    f.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button, input, label")) return;
      confetti(e.clientX, e.clientY, 40, 10);
    });
  }

  /* =================================================================
     MAIN LOOP
     ================================================================= */
  const STORY_RUNNERS = { ignored: levelIgnored, microwave: levelMicrowave, edinburgh: levelKnife, cookie: levelCookie };

  async function run() {
    renderProgress(-1);
    const jump = parseInt(new URLSearchParams(location.search).get("level"), 10);
    await titleScreen();
    let start = 0;
    if (jump >= 1 && jump <= LEVELS.length) {
      start = jump - 1;
      Audio8.startMusic(); showNowPlaying();
    } else {
      await opening();
    }
    for (let i = start; i < LEVELS.length; i++) {
      const L = LEVELS[i];
      renderProgress(i);
      if (L.type === "story") await STORY_RUNNERS[L.story](L, i);
      else if (L.type === "arena") await arenaLevel(L, i);
      else if (L.type === "hidden") await hiddenLevel(L, i);
      else if (L.type === "golden") await goldenLevel(L, i);
    }
    await finale();
  }
  run();
})();
