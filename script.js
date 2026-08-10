(function () {
  "use strict";

  const WHATSAPP_NUMBER = "";
  const whatsappBase = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}`
    : "https://wa.me/";

  document.body.classList.add("loading");

  const loader = document.getElementById("loader");
  const loaderStarted = performance.now();
  let loaderFinished = false;

  function finishLoader() {
    if (loaderFinished) return;
    loaderFinished = true;
    const minDuration = 2600;
    const elapsed = performance.now() - loaderStarted;
    window.setTimeout(() => {
      loader?.classList.add("is-hidden");
      document.body.classList.remove("loading");
      revealVisible();
    }, Math.max(0, minDuration - elapsed));
  }

  if (document.readyState === "complete") {
    finishLoader();
  } else {
    window.addEventListener("load", finishLoader, { once: true });
  }

  window.setTimeout(finishLoader, 3200);

  const nav = document.getElementById("nav");
  const ham = document.getElementById("ham");
  const mob = document.getElementById("mob");

  function setNavState() {
    nav?.classList.toggle("scrolled", window.scrollY > 24);
  }

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  ham?.addEventListener("click", () => {
    const isOpen = mob?.classList.toggle("open");
    ham.setAttribute("aria-expanded", String(Boolean(isOpen)));
    nav?.classList.toggle("menu-open", Boolean(isOpen));
  });

  document.querySelectorAll(".mob-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mob?.classList.remove("open");
      nav?.classList.remove("menu-open");
      ham?.setAttribute("aria-expanded", "false");
    });
  });

  const words = [
    "cocinas integrales",
    "closets y vestidores",
    "muebles para oficina",
    "cortinas y persianas",
    "acabados de madera"
  ];
  const twText = document.getElementById("twText");
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!twText) return;

    const current = words[wordIndex];
    twText.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
      setTimeout(typeLoop, 72);
      return;
    }

    if (!deleting && charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1350);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(typeLoop, 36);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeLoop, 240);
  }

  typeLoop();

  const revealItems = Array.from(document.querySelectorAll(".rev"));
  const counterItems = Array.from(document.querySelectorAll("[data-count]"));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));

  function revealVisible() {
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) item.classList.add("show");
    });
  }

  function animateCounter(el) {
    if (el.dataset.done === "true") return;
    el.dataset.done = "true";

    const target = Number(el.dataset.count || 0);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });

  counterItems.forEach((item) => countObserver.observe(item));

  const parallaxEls = Array.from(document.querySelectorAll(".parallax-bg"));
  let ticking = false;

  function updateParallax() {
    parallaxEls.forEach((el) => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const offset = Math.max(-36, Math.min(36, rect.top * -0.035));
      el.style.setProperty("--parallax-y", `${offset}px`);
    });
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax();

  function createParticles(canvasId, color) {
    const canvas = document.getElementById(canvasId);
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(28, Math.min(72, Math.floor(width / 18)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + .7,
        vx: (Math.random() - .5) * .28,
        vy: (Math.random() - .5) * .28,
        a: Math.random() * .42 + .18
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.a})`;
        ctx.fill();

        for (let i = index + 1; i < particles.length; i += 1) {
          const q = particles[i];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 118) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${color}, ${(.11 * (1 - dist / 118)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      if (!reduced) requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
  }

  createParticles("pcanvas", "217, 203, 174");
  createParticles("pcanvasProcess", "217, 203, 174");
  createParticles("pcanvasGaleria", "217, 203, 174");

  const form = document.getElementById("cForm");
  const note = document.getElementById("formNote");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const lines = [
      "Hola, me interesa solicitar una cotización para ROGAR COCINAS, CLOSETS Y PERSIANAS.",
      `Nombre: ${data.get("nombre") || ""}`,
      `Teléfono: ${data.get("telefono") || ""}`,
      `Proyecto: ${data.get("tipo") || ""}`,
      `Detalle: ${data.get("mensaje") || ""}`
    ];

    const message = lines.join("\n");
    const url = `${whatsappBase}?text=${encodeURIComponent(message)}`;

    if (note) {
      note.textContent = WHATSAPP_NUMBER
        ? "Abriendo WhatsApp con tu mensaje listo."
        : "Abriendo WhatsApp con el mensaje listo. Falta configurar el numero del negocio.";
    }

    window.open(url, "_blank", "noopener,noreferrer");
  });
})();
