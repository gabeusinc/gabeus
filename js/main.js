/* Gabe US — site behaviors */

/* Mobile nav toggle is inlined on the button. Rest of site behaviors below. */

/* Brand logo animations — stamp on load, spin on hover.
   Classes are added/removed so only one animation runs at a time
   (prevents load animation from replaying after a hover). */
(function initBrandAnim() {
  const brands = document.querySelectorAll('.nav__brand');
  if (!brands.length) return;

  brands.forEach(brand => {
    const mark = brand.querySelector('.nav__brand-mark');
    if (!mark) return;

    /* Stamp-in on load */
    mark.classList.add('popping');

    /* Remove the driving class once the animation has played so subsequent
       class toggles (hover) don't re-trigger old animations. */
    mark.addEventListener('animationend', (e) => {
      if (e.animationName === 'brand-pop') {
        mark.classList.remove('popping');
      } else if (e.animationName === 'brand-spin') {
        mark.classList.remove('spinning');
      }
    });

    /* Spin on hover — but wait until the stamp has finished */
    brand.addEventListener('mouseenter', () => {
      if (mark.classList.contains('popping') ||
          mark.classList.contains('spinning')) return;
      mark.classList.add('spinning');
    });
  });
})();

/* Scattered gummies — mouse parallax with spring physics
   Each element with data-sx/data-sy drifts by a unique vector. Because we
   integrate velocity with friction (spring model), the shapes carry momentum:
   when the cursor stops near an edge, they continue a little before easing
   to rest. Direction-inversion on some elements keeps the scatter dispersed. */
(function initGummyParallax() {
  const scene = document.querySelector('[data-parallax-scene]');
  if (!scene) return;

  const targets = Array.from(scene.querySelectorAll('[data-sx]'));
  if (!targets.length) return;

  let sceneRect = scene.getBoundingClientRect();
  const updateRect = () => { sceneRect = scene.getBoundingClientRect(); };
  window.addEventListener('resize', updateRect);
  window.addEventListener('scroll', updateRect, { passive: true });

  /* Spring state */
  let tx = 0, ty = 0;       // target position (px)
  let cx = 0, cy = 0;       // current position (px)
  let vx = 0, vy = 0;       // velocity (px / frame)
  const STIFFNESS = 0.04;   // spring constant — lower = softer/longer drift
  const DAMPING   = 0.90;   // velocity retention — closer to 1 = more momentum
  const AMPLITUDE = 90;     // max drift distance in px at scene edges

  let rafId = null;
  let mouseInside = false;

  const render = () => {
    /* Spring integration: acceleration toward target, damped */
    const ax = (tx - cx) * STIFFNESS;
    const ay = (ty - cy) * STIFFNESS;
    vx = (vx + ax) * DAMPING;
    vy = (vy + ay) * DAMPING;
    cx += vx;
    cy += vy;

    for (const el of targets) {
      const sx = parseFloat(el.dataset.sx) || 0;
      const sy = parseFloat(el.dataset.sy) || 0;
      const rot = parseFloat(el.dataset.rot) || 0;
      const rotSpeed = parseFloat(el.dataset.rotSpeed) || 0;
      el.style.transform =
        `translate3d(${cx * sx}px, ${cy * sy}px, 0) rotate(${rot + cx * rotSpeed}deg)`;
    }

    /* Keep animating while there is any meaningful motion */
    const stillMoving =
      Math.abs(vx) > 0.015 || Math.abs(vy) > 0.015 ||
      Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1;
    if (stillMoving) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  };

  const kick = () => {
    if (rafId == null) rafId = requestAnimationFrame(render);
  };

  scene.addEventListener('mousemove', (e) => {
    mouseInside = true;
    /* Map cursor position to -1..+1 around scene center */
    const nx = (e.clientX - sceneRect.left) / sceneRect.width  - 0.5;
    const ny = (e.clientY - sceneRect.top)  / sceneRect.height - 0.5;
    tx = nx * 2 * AMPLITUDE;   // clamp is implicit (nx is already bounded)
    ty = ny * 2 * AMPLITUDE;
    kick();
  });

  scene.addEventListener('mouseleave', () => {
    mouseInside = false;
    tx = 0;
    ty = 0;
    kick();
  });

  /* Device tilt support for touch devices */
  if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    window.addEventListener('deviceorientation', (e) => {
      if (mouseInside) return;
      const gamma = (e.gamma || 0) / 45;
      const beta = ((e.beta || 0) - 45) / 45;
      tx = Math.max(-1, Math.min(1, gamma)) * AMPLITUDE * 0.6;
      ty = Math.max(-1, Math.min(1, beta)) * AMPLITUDE * 0.6;
      kick();
    });
  }
})();
