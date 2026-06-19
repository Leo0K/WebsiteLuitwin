
(function () {
  window.addEventListener("load", function () {
    document.body.classList.remove("is-preload");
  });

  window.openCalendly = function () {
    const modal = document.getElementById("calendlyModal");
    if (modal) modal.style.display = "block";
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      document.body.appendChild(script);
    }
  };

  window.closeCalendly = function () {
    const modal = document.getElementById("calendlyModal");
    if (modal) modal.style.display = "none";
  };

  window.addEventListener("click", function (event) {
    const modal = document.getElementById("calendlyModal");
    if (modal && event.target === modal) window.closeCalendly();
  });

  document.addEventListener("DOMContentLoaded", function () {
    const burgerToggle = document.querySelector(".burger-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const header = document.getElementById("header");

    if (burgerToggle && navMenu) {
      burgerToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        navMenu.classList.toggle("open");
        burgerToggle.classList.toggle("active");
        burgerToggle.setAttribute("aria-expanded", String(navMenu.classList.contains("open")));
      });

      navMenu.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          navMenu.classList.remove("open");
          burgerToggle.classList.remove("active");
          burgerToggle.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("click", function (e) {
        if (!navMenu.contains(e.target) && !burgerToggle.contains(e.target)) {
          navMenu.classList.remove("open");
          burgerToggle.classList.remove("active");
          burgerToggle.setAttribute("aria-expanded", "false");
        }
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          navMenu.classList.remove("open");
          burgerToggle.classList.remove("active");
          burgerToggle.setAttribute("aria-expanded", "false");
        }
      }, { passive: true });
    }

    function updateHeader() {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    document.querySelectorAll("#banner, .projects-heading, .project-card, .features li, #contact").forEach(function (el) {
      el.classList.add("reveal-lite");
    });

    const revealItems = document.querySelectorAll(".reveal, .reveal-lite");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealItems.forEach(function (el, index) {
        el.style.transitionDelay = Math.min(index * 35, 220) + "ms";
        observer.observe(el);
      });
    } else {
      revealItems.forEach(function (el) { el.classList.add("is-visible"); });
    }

    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach(function (card) {
      card.addEventListener("click", function () {
        const isOpen = card.classList.contains("is-open");
        projectCards.forEach(function (otherCard) {
          otherCard.classList.remove("is-open");
          otherCard.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          card.classList.add("is-open");
          card.setAttribute("aria-expanded", "true");
        }
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });
    });
  });
})();

(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const glow = document.querySelector(".mouse-soft-glow") || document.querySelector(".mouse-glow");
  const canvas = document.getElementById("siteAiCanvas") || document.getElementById("ai-background");

  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  if (glow && !reducedMotion) {
    window.addEventListener("pointermove", function (event) {
      targetX = event.clientX;
      targetY = event.clientY;
    }, { passive: true });

    function moveGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      glow.style.transform = "translate3d(" + glowX + "px," + glowY + "px,0) translate3d(-50%,-50%,0)";
      requestAnimationFrame(moveGlow);
    }
    moveGlow();
  }

  if (!canvas || reducedMotion) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let width = 0;
  let height = 0;
  let dpr = 1;
  let points = [];
  let raf = null;
  let lastPaint = 0;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const baseCount = Math.floor((width * height) / 22000);
    const count = Math.min(96, Math.max(52, baseCount));
    points = Array.from({ length: count }, function (_, i) {
      const layer = i % 3;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (0.14 + layer * 0.035),
        vy: (Math.random() - 0.5) * (0.14 + layer * 0.035),
        r: Math.random() * 1.7 + 0.9,
        hue: layer === 0 ? "94,234,212" : layer === 1 ? "96,165,250" : "168,85,247"
      };
    });
  }

  function drawNeuralPaths() {
    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      for (let j = i + 1; j < points.length; j += 1) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 146) {
          const alpha = 0.26 * (1 - dist / 146);
          ctx.strokeStyle = "rgba(" + p.hue + "," + alpha + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 190) {
        ctx.strokeStyle = "rgba(255,255,255," + (0.18 * (1 - md / 190)) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }
  }

  function drawNodes() {
    points.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -30) p.x = width + 30;
      if (p.x > width + 30) p.x = -30;
      if (p.y < -30) p.y = height + 30;
      if (p.y > height + 30) p.y = -30;

      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 170) {
        p.x += dx / Math.max(dist, 1) * 0.08;
        p.y += dy / Math.max(dist, 1) * 0.08;
      }

      ctx.beginPath();
      ctx.fillStyle = "rgba(" + p.hue + ",0.9)";
      ctx.shadowColor = "rgba(" + p.hue + ",0.78)";
      ctx.shadowBlur = 10;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function drawCircuitSweeps(time) {
    const y1 = height * 0.18 + Math.sin(time * 0.00035) * height * 0.08;
    const y2 = height * 0.72 + Math.cos(time * 0.00028) * height * 0.08;
    const xOffset = (time * 0.018) % 220;
    ctx.lineWidth = 1;
    for (let i = -220; i < width + 220; i += 220) {
      ctx.strokeStyle = "rgba(94,234,212,0.12)";
      ctx.beginPath();
      ctx.moveTo(i + xOffset, y1);
      ctx.bezierCurveTo(i + 70 + xOffset, y1 - 80, i + 130 + xOffset, y1 + 80, i + 220 + xOffset, y1);
      ctx.stroke();

      ctx.strokeStyle = "rgba(96,165,250,0.105)";
      ctx.beginPath();
      ctx.moveTo(i - xOffset, y2);
      ctx.bezierCurveTo(i + 70 - xOffset, y2 + 80, i + 130 - xOffset, y2 - 80, i + 220 - xOffset, y2);
      ctx.stroke();
    }
  }

  function draw(time) {
    if (time - lastPaint < 30) {
      raf = requestAnimationFrame(draw);
      return;
    }
    lastPaint = time;
    ctx.clearRect(0, 0, width, height);
    drawCircuitSweeps(time);
    drawNeuralPaths();
    drawNodes();
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("pointermove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }, { passive: true });

  resizeCanvas();
  raf = requestAnimationFrame(draw);
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("pagehide", function () {
    if (raf) cancelAnimationFrame(raf);
  });
})();



// Final robust menu behavior for all pages, including shared header partials
(function () {
  let menuInitialized = false;

  function initSharedHeaderMenu() {
    const header = document.getElementById("header");
    const burgerToggle = document.querySelector(".burger-menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (!burgerToggle || !navMenu || menuInitialized) {
      return;
    }

    menuInitialized = true;

    function closeMenu() {
      navMenu.classList.remove("open");
      burgerToggle.classList.remove("active");
      burgerToggle.setAttribute("aria-expanded", "false");
    }

    function toggleMenu(event) {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = navMenu.classList.toggle("open");
      burgerToggle.classList.toggle("active", isOpen);
      burgerToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    burgerToggle.addEventListener("click", toggleMenu);

    navMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("click", function (event) {
      if (!navMenu.contains(event.target) && !burgerToggle.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1220) {
        closeMenu();
      }
    }, { passive: true });

    function updateHeader() {
      if (header) {
        header.classList.toggle("is-scrolled", window.scrollY > 18);
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSharedHeaderMenu);
  } else {
    initSharedHeaderMenu();
  }

  document.addEventListener("partials:loaded", initSharedHeaderMenu);
})();
