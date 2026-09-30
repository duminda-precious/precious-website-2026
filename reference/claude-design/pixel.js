// Port of src/motion/pixelWords.ts + pixelText.ts (M13) + buttonGlitch.ts (M12).
(function () {
  const IN = [36, 28, 21, 15, 10, 6, 3], GLITCH = [3, 7, 14, 20, 12, 6, 3];
  const FRAME_IN = 70, FRAME_GLITCH = 55, STAGGER = 70, G_MIN = 2200, G_RANGE = 2400, DOUBLE = 0.3;

  function wrapWords(el) {
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [], out = [];
    let n; while ((n = tw.nextNode())) if (n.nodeValue.trim()) nodes.push(n);
    nodes.forEach((t) => {
      const frag = document.createDocumentFragment();
      t.nodeValue.split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (/^\s+$/.test(w)) return frag.append(document.createTextNode(w));
        const sp = document.createElement('span');
        sp.style.position = 'relative'; sp.style.display = 'inline-block';
        sp.textContent = w; frag.append(sp); out.push(sp);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return out;
  }
  function baseline(el) {
    const i = document.createElement('i');
    i.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    el.append(i); const y = i.offsetTop; i.remove(); return y;
  }
  function runner() {
    const DPR = Math.min(2, devicePixelRatio || 1), timers = new Set(), active = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
    const clear = (el) => { el.style.color = ''; el._c && el._c.remove(); el._c = null; el._busy = false; active.delete(el); };
    const draw = (el, block) => {
      const cs = el._cs, fs = parseFloat(cs.fontSize), pad = Math.ceil(fs * 0.35);
      const W = el.offsetWidth + pad * 2, H = el.offsetHeight + pad * 2;
      let c = el._c;
      if (!c) { c = document.createElement('canvas'); c.setAttribute('aria-hidden', 'true'); c.style.position = 'absolute'; c.style.pointerEvents = 'none'; el.append(c); el._c = c; }
      c.style.left = -pad + 'px'; c.style.top = -pad + 'px'; c.style.width = W + 'px'; c.style.height = H + 'px';
      const b = Math.max(1, block), sw = Math.ceil(W / b), sh = Math.ceil(H / b);
      const s = el._s || (el._s = document.createElement('canvas')); s.width = sw; s.height = sh;
      const x = s.getContext('2d', { willReadFrequently: true });
      x.save(); x.scale(1 / b, 1 / b);
      x.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      try { if ('letterSpacing' in x) x.letterSpacing = cs.letterSpacing; } catch (e) {}
      x.fillStyle = (el._tints && el._tints[el._fi]) || getComputedStyle(el.parentElement || el).color;
      x.textBaseline = 'alphabetic'; x.fillText(el._txt, pad, pad + el._base); x.restore();
      if (b >= 3) { const d = x.getImageData(0, 0, sw, sh), a = d.data; for (let i = 3; i < a.length; i += 4) a[i] = a[i] > 80 ? 255 : 0; x.putImageData(d, 0, 0); }
      c.width = Math.ceil(W * DPR); c.height = Math.ceil(H * DPR);
      const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      g.drawImage(s, 0, 0, sw, sh, 0, 0, sw * b * DPR, sh * b * DPR);
      c.style.transform = b >= 8 && Math.random() < 0.45 ? `translateX(${(Math.random() < 0.5 ? -1 : 1) * Math.round(b / 2)}px)` : '';
    };
    return {
      run(el, seq, frameMs, delay = 0, tints = null) {
        if (el._busy) return; el._busy = true; active.add(el); el._tints = tints;
        el._cs = getComputedStyle(el);
        const raw = el.textContent || '', tt = el._cs.textTransform;
        el._txt = tt === 'uppercase' ? raw.toUpperCase() : tt === 'lowercase' ? raw.toLowerCase() : raw;
        el._base = baseline(el);
        later(() => {
          let i = 0; el.style.color = 'transparent'; el.style.visibility = '';
          const tick = () => { if (i >= seq.length) { el._tints = null; return clear(el); } el._fi = i; draw(el, seq[i++]); later(tick, frameMs); };
          tick();
        }, delay);
      },
      // Scroll-scrubbed: draw one word at a given block size (<=1 → crisp text).
      frame(el, block) {
        if (block <= 1.2) { if (el._c) clear(el); return; }
        if (!el._cs) { el._cs = getComputedStyle(el); el._txt = el.textContent || ''; el._base = baseline(el); }
        el.style.color = 'transparent'; draw(el, Math.round(block));
      },
      stop() { timers.forEach(clearTimeout); timers.clear(); [...active].forEach(clear); },
    };
  }

  // Button hover: pixel bloom from the entry point + cursor-radiating light noise + landing butterfly (Button Motion 5a)
  function btnFx(root) {
    const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches, offs = [];
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
    const GR = ['#f4f1ee', '#f6ccaf', '#90c1c5', '#66bfd6'], BF = [['X...X','XX.XX','.XXX.','X...X'], ['.X.X.','.XXX.','.XXX.','.X.X.']];
    // Soft wash: mint (top-left), sky (top-right), pink (bottom) glows on cool white
    const mkWash = (w, h) => { const k = document.createElement('canvas'); k.width = w; k.height = h; const c = k.getContext('2d'); c.fillStyle = '#eef3f6'; c.fillRect(0, 0, w, h);
      const R = Math.max(w, h) * 1.1; [[0, 0, '#d6f1de'], [w, 0, '#9ccfe4'], [w / 2, h * 1.2, '#f6c6d2']].forEach(([cx, cy, col]) => { const g = c.createRadialGradient(cx, cy, 0, cx, cy, R * 0.75); g.addColorStop(0, col); g.addColorStop(1, 'rgba(238,243,246,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }); return k; };
    root.querySelectorAll('[data-grad]').forEach((b) => {
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      b.style.isolation = 'isolate'; b.style.overflow = 'hidden';
      const c = document.createElement('canvas'); c.setAttribute('aria-hidden', '');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;image-rendering:pixelated'; b.prepend(c);
      const S = 6; let cells = [], x, W, H, loopT, stepT, mx = 0, my = 0, wash; const t0 = performance.now();
      const fit = () => { W = b.offsetWidth; H = b.offsetHeight; c.width = W; c.height = H; x = c.getContext('2d'); cells = [];
        for (let r = 0; r < Math.ceil(H / S); r++) for (let q = 0; q < Math.ceil(W / S); q++) cells.push({ q, r, on: 0, j: Math.random(), w: 0, wt: 0 }); };
      const draw = () => { x.clearRect(0, 0, W, H); if (!wash || wash.width !== W || wash.height !== H) wash = mkWash(W, H); const g = x.createPattern(wash, 'no-repeat');
        for (const e of cells) { if (e.on <= 0) continue; x.globalAlpha = e.on; x.fillStyle = g; x.fillRect(e.q * S, e.r * S, S, S);
          if (e.w > 0.01) { x.globalAlpha = e.w * e.on; x.fillStyle = '#ffffff'; x.fillRect(e.q * S, e.r * S, S, S); } } x.globalAlpha = 1; };
      const shimmer = () => { if (RM()) return; loopT = setInterval(() => { const t = (performance.now() - t0) / 1000;
        cells.forEach((e) => { const d = Math.hypot(e.q * S + S / 2 - mx, e.r * S + S / 2 - my), fall = Math.max(0, 1 - d / 75), ring = Math.pow(Math.max(0, Math.sin(d / 5 - t * 5)), 3);
          e.wt = (fall * ring * 0.85 + (d < S ? 0.35 : 0)) * (0.6 + e.j * 0.4); e.w += (e.wt - e.w) * 0.2; }); draw(); }, 40); };
      const run = (px, py, dir) => { clearTimeout(stepT); clearInterval(loopT); const D = Math.hypot(W, H);
        cells.forEach((e) => (e.d = Math.hypot(e.q * S - px, e.r * S - py) / D + e.j * 0.25)); let s = 0; const N = 10, F = 0.4;
        const tick = () => { s++; const th = (s / N) * (1.25 + F);
          cells.forEach((e) => { const k = Math.min(1, Math.max(0, (th - e.d) / F)), v = k * k * (3 - 2 * k); e.on = dir > 0 ? v : 1 - v; }); draw();
          if (s < N) stepT = setTimeout(tick, 40); else if (dir > 0) shimmer(); else { cells.forEach((e) => (e.on = 0)); draw(); } }; tick(); };
      const pt = (e) => { const r = b.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      // butterfly
      const lbl = b.querySelector('[data-pixel-label]') || b.firstChild, NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), path = document.createElementNS(NS, 'path');
      svg.setAttribute('viewBox', '0 0 5 4'); svg.setAttribute('aria-hidden', ''); svg.style.cssText = 'fill:#141c22;flex:none;width:0;height:12px;opacity:0;margin-right:0;overflow:visible';
      svg.append(path); const fly = !b.hasAttribute('data-grad-nofly'); if (fly) b.insertBefore(svg, lbl);
      const set = (k) => { let d = ''; BF[k].forEach((row, y) => [...row].forEach((ch, xx) => { if (ch === 'X') d += 'M' + xx + ' ' + y + 'h1v1h-1z'; })); path.setAttribute('d', d); }; set(0);
      let flap, f = 0;
      const enter = (e) => { fit(); [mx, my] = e && e.clientX != null ? pt(e) : [W / 2, H / 2];
        if (fly) { svg.style.transition = 'width 320ms cubic-bezier(0.16,1,0.3,1),margin 320ms cubic-bezier(0.16,1,0.3,1),opacity 200ms'; svg.style.width = '15px'; svg.style.marginRight = '10px'; svg.style.opacity = '1'; }
        if (RM()) { cells.forEach((k) => (k.on = 1)); draw(); return; }
        svg.animate([{ transform: 'translateY(-14px)', opacity: 0 }, { transform: 'translateY(2px)', opacity: 1, offset: 0.7 }, { transform: 'none' }], { duration: 385, easing: 'steps(7,end)' });
        if (fly) { clearInterval(flap); flap = setInterval(() => { f = 1 - f; set(f); }, 125); } run(mx, my, 1); };
      const leave = (e) => { clearInterval(flap);
        if (!RM()) { const an = svg.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-6px)', opacity: 1, offset: 0.4 }, { transform: 'translateY(-18px)', opacity: 0 }], { duration: 275, easing: 'steps(5,end)', fill: 'forwards' }); an.onfinish = () => { an.cancel(); set(0); }; }
        svg.style.transition = 'width 240ms cubic-bezier(0.3,0,1,1) 120ms,margin 240ms cubic-bezier(0.3,0,1,1) 120ms,opacity 120ms'; svg.style.width = '0'; svg.style.marginRight = '0'; svg.style.opacity = '0';
        if (!x) return; if (RM()) { cells.forEach((k) => (k.on = 0)); draw(); return; }
        cells.forEach((k) => { k.w = 0; k.wt = 0; }); const [px, py] = e && e.clientX != null ? pt(e) : [W / 2, H / 2]; run(px, py, -1); };
      on(b, 'pointermove', (e) => { [mx, my] = pt(e); });
      on(b, 'pointerenter', enter); on(b, 'pointerleave', leave); on(b, 'focus', enter); on(b, 'blur', leave);
      on(b, 'pointerdown', () => b.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.97)' }], { duration: 120, easing: 'cubic-bezier(0.2,0,0,1)', fill: 'forwards' }));
      on(b, 'pointerup', () => b.animate([{ transform: 'scale(0.97)' }, { transform: 'scale(1.01)', offset: 0.6 }, { transform: 'scale(1)' }], { duration: 240, easing: 'cubic-bezier(0.2,0,0,1)', fill: 'forwards' }));
      offs.push(() => { clearInterval(loopT); clearTimeout(stepT); clearInterval(flap); c.remove(); svg.remove(); });
    });
    return () => offs.forEach((f) => f());
  }

  function init(root) {
    const bfx = btnFx(root);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return bfx;
    const r = runner(), cleanups = [];
    let stopped = false, idleTimer = 0;
    const headings = [...root.querySelectorAll('[data-pixel-text]')];
    const words = new Map(), resolved = new Set(), inView = new Set();
    const io = new IntersectionObserver((es) => es.forEach(({ target: h, isIntersecting }) => {
      if (!isIntersecting) return inView.delete(h);
      inView.add(h); if (resolved.has(h)) return; resolved.add(h);
      words.get(h).forEach((w, i) => r.run(w, IN, FRAME_IN, i * STAGGER));
    }), { threshold: 0.4 });
    const idle = () => { idleTimer = setTimeout(() => {
      if (!document.hidden) {
        const pool = [...inView].filter((h) => resolved.has(h)).flatMap((h) => words.get(h));
        const n = Math.random() < DOUBLE ? 2 : 1;
        for (let k = 0; k < n && pool.length; k++) r.run(pool[Math.floor(Math.random() * pool.length)], GLITCH, FRAME_GLITCH, k * 140);
      }
      idle();
    }, G_MIN + Math.random() * G_RANGE); };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      if (stopped) return;
      headings.forEach((h) => { const ws = wrapWords(h); ws.forEach((w) => (w.style.visibility = 'hidden')); words.set(h, ws); io.observe(h); });
      new Set(root.querySelectorAll('[data-button],button')).forEach((btn) => {
        if (btn.closest('[data-no-glitch]')) return;
        const label = btn.querySelector('[data-pixel-label]') || (btn.textContent.trim() ? btn : null); if (!label) return;
        const ws = wrapWords(label), glitch = (e) => { if (!e.pointerType || e.pointerType === 'mouse') ws.forEach((w) => r.run(w, GLITCH, FRAME_GLITCH)); };
        btn.addEventListener('pointerenter', glitch); btn.addEventListener('pointerleave', glitch);
        cleanups.push(() => { btn.removeEventListener('pointerenter', glitch); btn.removeEventListener('pointerleave', glitch); });
      });
      // Section CTAs: idle glitch on their labels while in view, to draw the eye
      const ctas=[...root.querySelectorAll('[data-cta] [data-pixel-label]')].map((l)=>({l,ws:[...l.children]}));
      const vis=new Set();const cio=new IntersectionObserver((es)=>es.forEach((e)=>e.isIntersecting?vis.add(e.target):vis.delete(e.target)),{threshold:0.6});
      ctas.forEach((c)=>cio.observe(c.l));cleanups.push(()=>cio.disconnect());
      let ct=0;const ctaIdle=()=>{ct=setTimeout(()=>{if(!document.hidden){const pool=ctas.filter((c)=>vis.has(c.l));if(pool.length){const c=pool[Math.floor(Math.random()*pool.length)];c.ws.forEach((w,i)=>r.run(w,GLITCH,FRAME_GLITCH,i*40));}}ctaIdle();},G_MIN+Math.random()*G_RANGE);};
      ctaIdle();cleanups.push(()=>clearTimeout(ct));
      idle();
    });
    return () => { bfx(); stopped = true; io.disconnect(); clearTimeout(idleTimer); r.stop(); cleanups.forEach((f) => f()); };
  }
  window.PxEngine = { init, runner, wrapWords, IN, GLITCH };
})();
