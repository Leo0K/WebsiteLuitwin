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

  function initRevealsAndCards() {
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
      if (card.dataset.projectReady === "true") return;
      card.dataset.projectReady = "true";
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRevealsAndCards);
  } else {
    initRevealsAndCards();
  }
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
    const count = Math.min(96, Math.max(52, Math.floor((width * height) / 22000)));
    points = Array.from({ length: count }, function (_, i) {
      const layer = i % 3;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (0.14 + layer * 0.035),
        vy: (Math.random() - 0.5) * (0.14 + layer * 0.035),
        r: Math.random() * 1.7 + 0.9,
        layer: layer,
        hue: layer === 0 ? "94,234,212" : layer === 1 ? "96,165,250" : "168,85,247"
      };
    });
  }

  function isLightTheme() {
    const bodyTheme = document.body && document.body.dataset ? document.body.dataset.theme : "";
    const htmlTheme = document.documentElement && document.documentElement.dataset ? document.documentElement.dataset.theme : "";
    return bodyTheme === "light" || htmlTheme === "light";
  }

  function pointColor(point) {
    if (!isLightTheme()) return point.hue;
    return point.layer === 0 ? "15,118,110" : point.layer === 1 ? "37,99,235" : "109,40,217";
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
          ctx.strokeStyle = "rgba(" + pointColor(p) + "," + ((isLightTheme() ? 0.34 : 0.26) * (1 - dist / 146)) + ")";
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
        ctx.strokeStyle = isLightTheme() ? "rgba(15,23,42," + (0.16 * (1 - md / 190)) + ")" : "rgba(255,255,255," + (0.18 * (1 - md / 190)) + ")";
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
      ctx.fillStyle = "rgba(" + pointColor(p) + "," + (isLightTheme() ? "0.78" : "0.9") + ")";
      ctx.shadowColor = "rgba(" + pointColor(p) + "," + (isLightTheme() ? "0.34" : "0.78") + ")";
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
      ctx.strokeStyle = isLightTheme() ? "rgba(15,118,110,0.18)" : "rgba(94,234,212,0.12)";
      ctx.beginPath();
      ctx.moveTo(i + xOffset, y1);
      ctx.bezierCurveTo(i + 70 + xOffset, y1 - 80, i + 130 + xOffset, y1 + 80, i + 220 + xOffset, y1);
      ctx.stroke();
      ctx.strokeStyle = isLightTheme() ? "rgba(37,99,235,0.16)" : "rgba(96,165,250,0.105)";
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

(function () {
  function initAiHeaderHover() {
    const header = document.getElementById("header");
    if (!header || header.dataset.aiHoverReady === "true") return;
    header.dataset.aiHoverReady = "true";
    header.addEventListener("pointermove", function (event) {
      const rect = header.getBoundingClientRect();
      header.style.setProperty("--header-mx", (event.clientX - rect.left) + "px");
      header.style.setProperty("--header-my", (event.clientY - rect.top) + "px");
    }, { passive: true });
    header.querySelectorAll("a, button").forEach(function (item) {
      item.addEventListener("pointermove", function (event) {
        const rect = item.getBoundingClientRect();
        item.style.setProperty("--item-mx", (event.clientX - rect.left) + "px");
        item.style.setProperty("--item-my", (event.clientY - rect.top) + "px");
      }, { passive: true });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAiHeaderHover);
  } else {
    initAiHeaderHover();
  }
  document.addEventListener("partials:loaded", initAiHeaderHover);
})();

(function () {
  function updateAutomaticDates() {
    document.querySelectorAll('[data-auto-date="month-year"]').forEach(function (element) {
      const lang = (document.documentElement.lang || "de").toLowerCase();
      const locale = lang.indexOf("en") === 0 ? "en-US" : "de-DE";
      const value = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date());
      element.textContent = value.charAt(0).toUpperCase() + value.slice(1);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateAutomaticDates);
  } else {
    updateAutomaticDates();
  }
})();


/* Portfolio UX extensions: scroll progress, project modal, contact form and footer. */
(function () {
  'use strict';

  const LANG = (document.body && document.body.dataset.siteLanguage) === 'en' ? 'en' : 'de';
  const COPY = {
    de: {
      detail: 'Details ansehen',
      close: 'Schließen',
      problem: 'Ausgangslage',
      approach: 'Vorgehen',
      outcome: 'Nutzen',
      projectIntro: 'Projektüberblick',
      contactTitle: 'Direkt anfragen',
      name: 'Name',
      email: 'E-Mail',
      company: 'Unternehmen',
      type: 'Projektart',
      message: 'Nachricht',
      typeOptions: ['KI / Data Science', 'Business Intelligence', 'Forecasting', 'Workshop / Training', 'Sonstiges'],
      send: 'Nachricht vorbereiten',
      calendly: 'Termin buchen',
      required: 'Bitte füllen Sie Name, E-Mail und Nachricht aus.',
      emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      prepared: 'Ihr E-Mail-Programm wurde mit einer vorbereiteten Nachricht geöffnet.',
      subject: 'Anfrage über luitwin-mallmann.de',
      footerClaim: 'Data Science, Business Intelligence und Aviation Analytics aus Frankfurt am Main.',
      top: 'Nach oben',
      privacy: 'Datenschutz',
      language: 'English',
      problemText: 'Ein datengetriebener Anwendungsfall musste verständlich, belastbar und in den Alltag übertragbar gemacht werden.',
      outcomeText: 'Mehr Transparenz, bessere Entscheidungen und eine klarere Grundlage für nächste Umsetzungsschritte.'
    },
    en: {
      detail: 'View details',
      close: 'Close',
      problem: 'Challenge',
      approach: 'Approach',
      outcome: 'Outcome',
      projectIntro: 'Project overview',
      contactTitle: 'Send a request',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      type: 'Project type',
      message: 'Message',
      typeOptions: ['AI / Data Science', 'Business Intelligence', 'Forecasting', 'Workshop / Training', 'Other'],
      send: 'Prepare message',
      calendly: 'Book a call',
      required: 'Please fill in name, email and message.',
      emailInvalid: 'Please enter a valid email address.',
      prepared: 'Your email app was opened with a prepared message.',
      subject: 'Request via luitwin-mallmann.de',
      footerClaim: 'Data Science, Business Intelligence and Aviation Analytics from Frankfurt am Main.',
      top: 'Back to top',
      privacy: 'Privacy Policy',
      language: 'Deutsch',
      problemText: 'A data-driven use case needed to become understandable, reliable and usable in daily operations.',
      outcomeText: 'More transparency, better decisions and a clearer basis for the next implementation steps.'
    }
  }[LANG];

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function createScrollProgress() {
    if (document.querySelector('.scroll-progress')) return;
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<span></span>';
    document.body.prepend(progress);
    const bar = progress.querySelector('span');
    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, scrollTop / max)) + ')';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  function enhanceProjectCards() {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!cards.length) return;

    let modal = document.getElementById('projectDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'projectDetailModal';
      modal.className = 'project-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = '' +
        '<div class="project-modal__backdrop" data-close-project></div>' +
        '<article class="project-modal__panel" tabindex="-1">' +
          '<button type="button" class="project-modal__close" data-close-project aria-label="' + COPY.close + '">×</button>' +
          '<div class="project-modal__media"></div>' +
          '<div class="project-modal__body"></div>' +
        '</article>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function (event) {
        if (event.target.closest('[data-close-project]')) closeProjectModal();
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeProjectModal();
      });
    }

    function openProjectModal(card) {
      const title = (card.querySelector('h3') || {}).textContent || '';
      const chip = (card.querySelector('.project-chip') || {}).textContent || '';
      const subtitle = (card.querySelector('.project-subtitle') || {}).textContent || '';
      const details = (card.querySelector('.project-details') || {}).textContent || '';
      const img = card.querySelector('.project-media img');
      const media = modal.querySelector('.project-modal__media');
      const body = modal.querySelector('.project-modal__body');

      media.innerHTML = img ? '<img src="' + img.getAttribute('src') + '" alt="' + (img.getAttribute('alt') || title).replace(/"/g, '&quot;') + '">' : '';
      body.innerHTML = '' +
        '<span class="project-modal__eyebrow">' + chip + '</span>' +
        '<h2>' + title + '</h2>' +
        (subtitle ? '<p class="project-modal__subtitle">' + subtitle + '</p>' : '') +
        '<div class="project-modal__section"><strong>' + COPY.projectIntro + '</strong><p>' + details + '</p></div>' +
        '<div class="project-modal__grid">' +
          '<div><strong>' + COPY.problem + '</strong><p>' + COPY.problemText + '</p></div>' +
          '<div><strong>' + COPY.approach + '</strong><p>' + details + '</p></div>' +
          '<div><strong>' + COPY.outcome + '</strong><p>' + COPY.outcomeText + '</p></div>' +
        '</div>';
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      const panel = modal.querySelector('.project-modal__panel');
      window.setTimeout(function () { panel.focus(); }, 30);
    }

    function closeProjectModal() {
      const modal = document.getElementById('projectDetailModal');
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }

    cards.forEach(function (card) {
      if (card.querySelector('.project-detail-button')) return;
      const content = card.querySelector('.project-content') || card;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'project-detail-button';
      button.textContent = COPY.detail;
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        openProjectModal(card);
      });
      content.appendChild(button);
    });
  }

  function enhanceContactSections() {
    const sections = Array.from(document.querySelectorAll('#contact'));
    sections.forEach(function (section, index) {
      if (section.querySelector('.contact-form')) return;
      const card = section.querySelector('.contact-card') || section.querySelector('.inner');
      if (!card) return;
      const form = document.createElement('form');
      form.className = 'contact-form';
      form.noValidate = true;
      form.innerHTML = '' +
        '<h3>' + COPY.contactTitle + '</h3>' +
        '<div class="form-grid">' +
          '<label><span>' + COPY.name + '</span><input name="name" type="text" autocomplete="name" required></label>' +
          '<label><span>' + COPY.email + '</span><input name="email" type="email" autocomplete="email" required></label>' +
          '<label><span>' + COPY.company + '</span><input name="company" type="text" autocomplete="organization"></label>' +
          '<label><span>' + COPY.type + '</span><select name="type">' + COPY.typeOptions.map(function (item) { return '<option>' + item + '</option>'; }).join('') + '</select></label>' +
        '</div>' +
        '<label class="form-message"><span>' + COPY.message + '</span><textarea name="message" rows="4" required></textarea></label>' +
        '<p class="form-feedback" aria-live="polite"></p>' +
        '<div class="form-actions">' +
          '<button type="submit" class="button primary">' + COPY.send + '</button>' +
          '<a class="button" href="https://calendly.com/luitwin/30min" target="_blank" rel="noopener">' + COPY.calendly + '</a>' +
        '</div>';
      card.appendChild(form);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const fd = new FormData(form);
        const name = String(fd.get('name') || '').trim();
        const email = String(fd.get('email') || '').trim();
        const company = String(fd.get('company') || '').trim();
        const type = String(fd.get('type') || '').trim();
        const message = String(fd.get('message') || '').trim();
        const feedback = form.querySelector('.form-feedback');
        feedback.classList.remove('is-error', 'is-success');
        if (!name || !email || !message) {
          feedback.textContent = COPY.required;
          feedback.classList.add('is-error');
          return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          feedback.textContent = COPY.emailInvalid;
          feedback.classList.add('is-error');
          return;
        }
        const body = [
          COPY.name + ': ' + name,
          COPY.email + ': ' + email,
          COPY.company + ': ' + (company || '-'),
          COPY.type + ': ' + type,
          '',
          message
        ].join('\n');
        feedback.textContent = COPY.prepared;
        feedback.classList.add('is-success');
        window.location.href = 'mailto:contact@luitwin-mallmann.de?subject=' + encodeURIComponent(COPY.subject) + '&body=' + encodeURIComponent(body);
      });
    });
  }

  function enhanceFooter() {
    const footer = document.getElementById('footer');
    if (!footer || footer.dataset.enhanced === 'true') return;
    footer.dataset.enhanced = 'true';
    const privacyHref = LANG === 'en' ? '../en/privacy.html' : '../de/privacy.html';
    const langHref = LANG === 'en' ? '../de/index.html' : '../en/index.html';
    footer.innerHTML = '' +
      '<div class="footer-enhanced">' +
        '<div class="footer-brand"><strong>Luitwin Mallmann</strong><p>' + COPY.footerClaim + '</p></div>' +
        '<nav class="footer-links" aria-label="Footer">' +
          '<a href="https://www.linkedin.com/in/luitwin-mallmann-18b80510b/" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a href="https://github.com/luttilimburg" target="_blank" rel="noopener">GitHub</a>' +
          '<a href="mailto:contact@luitwin-mallmann.de">Email</a>' +
          '<a href="https://calendly.com/luitwin/30min" target="_blank" rel="noopener">Calendly</a>' +
          '<a href="' + privacyHref + '">' + COPY.privacy + '</a>' +
          '<a href="' + langHref + '">' + COPY.language + '</a>' +
          '<a href="#page-wrapper">' + COPY.top + '</a>' +
        '</nav>' +
        '<div class="footer-copy">© ' + new Date().getFullYear() + ' Luitwin Mallmann</div>' +
      '</div>';
  }

  ready(function () {
    createScrollProgress();
    enhanceProjectCards();
    enhanceContactSections();
    enhanceFooter();
  });
})();
