(function () {
  'use strict';

  const PAGE_MAP = {
    'index.html': {
      de: '../de/index.html',
      en: '../en/index.html'
    },
    'expertise.html': {
      de: '../de/expertise.html',
      en: '../en/expertise.html'
    },
    'ai-infrastructure-check.html': {
      de: '../de/ai-infrastructure-check.html',
      en: '../en/ai-infrastructure-check.html'
    },
    'privacy.html': {
      de: '../de/privacy.html',
      en: '../en/privacy.html'
    }
  };

  const TRANSLATIONS = {
    de: {
      navLabel: 'Hauptnavigation',
      toggleLabel: 'Navigation öffnen',
      oppositeLang: 'en',
      languageLabel: 'English',
      languageFlag: '../images/gb.svg',
      languageAlt: 'English',
      links: [
        { key: 'home', label: 'Startseite', page: 'index.html' },
        { key: 'services', label: 'Mein Leistungspaket', page: 'index.html', hash: 'Leistungspaket' },
        { key: 'expertise', label: 'Fachwissen', page: 'expertise.html' },
        { key: 'ai-check', label: 'KI-Infrastruktur Check', page: 'ai-infrastructure-check.html' },
        { key: 'about', label: 'Über mich', external: 'https://www.linkedin.com/in/luitwin-mallmann-18b80510b/' },
        { key: 'contact', label: 'Kontakt', page: 'index.html', hash: 'contact' },
        { key: 'privacy', label: 'Datenschutz', page: 'privacy.html' }
      ]
    },
    en: {
      navLabel: 'Main navigation',
      toggleLabel: 'Toggle navigation menu',
      oppositeLang: 'de',
      languageLabel: 'Deutsch',
      languageFlag: '../images/de.svg',
      languageAlt: 'Deutsch',
      links: [
        { key: 'home', label: 'Home', page: 'index.html' },
        { key: 'services', label: 'Services', page: 'index.html', hash: 'Leistungspaket' },
        { key: 'expertise', label: 'Expertise', page: 'expertise.html' },
        { key: 'ai-check', label: 'AI Infrastructure Check', page: 'ai-infrastructure-check.html' },
        { key: 'about', label: 'About Me', external: 'https://www.linkedin.com/in/luitwin-mallmann-18b80510b/' },
        { key: 'contact', label: 'Contact', page: 'index.html', hash: 'contact' },
        { key: 'privacy', label: 'Privacy Policy', page: 'privacy.html' }
      ]
    }
  };

  function normalizePageName(value) {
    if (!value) return 'index.html';
    const clean = String(value).split('#')[0].split('?')[0];
    const parts = clean.split('/').filter(Boolean);
    return parts[parts.length - 1] || 'index.html';
  }

  function currentLanguage() {
    const lang = document.body && document.body.dataset.siteLanguage;
    return lang === 'en' ? 'en' : 'de';
  }

  function currentPage() {
    const fromData = document.body && document.body.dataset.currentPage;
    return normalizePageName(fromData || window.location.pathname);
  }

  function pageHref(lang, page, hash) {
    const target = PAGE_MAP[page] && PAGE_MAP[page][lang]
      ? PAGE_MAP[page][lang]
      : PAGE_MAP['index.html'][lang];
    return hash ? target + '#' + hash : target;
  }

  function sameDocument(link) {
    try {
      const url = new URL(link.href, window.location.href);
      return url.origin === window.location.origin &&
        url.pathname.replace(/\/+$/, '') === window.location.pathname.replace(/\/+$/, '');
    } catch (error) {
      return false;
    }
  }

  function buildHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const lang = currentLanguage();
    const page = currentPage();
    const labels = TRANSLATIONS[lang];
    const oppositeLang = labels.oppositeLang;
    const languageUrl = pageHref(oppositeLang, PAGE_MAP[page] ? page : 'index.html');


    header.classList.add('alt', 'ai-header');
    header.setAttribute('data-site-header', 'generated');
    header.innerHTML = '';

    const layer = document.createElement('div');
    layer.className = 'header-ai-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = '<span class="header-orb header-orb-a"></span><span class="header-orb header-orb-b"></span><span class="header-scanline"></span>';
    header.appendChild(layer);

    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.setAttribute('aria-label', labels.navLabel);

    const button = document.createElement('button');
    button.className = 'burger-menu-toggle';
    button.type = 'button';
    button.setAttribute('aria-controls', 'nav-menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', labels.toggleLabel);
    button.innerHTML = '<span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span>';
    nav.appendChild(button);

    const menu = document.createElement('ul');
    menu.id = 'nav-menu';

    labels.links.forEach(function (item) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = item.label;

      if (item.external) {
        a.href = item.external;
        a.target = '_blank';
        a.rel = 'noopener';
      } else {
        a.href = pageHref(lang, item.page, item.hash);
        a.setAttribute('data-page-link', item.page);
        if (item.hash) a.setAttribute('data-section-link', item.hash);
        if (!item.hash && item.page === page) a.setAttribute('aria-current', 'page');
      }

      li.appendChild(a);
      menu.appendChild(li);
    });

    nav.appendChild(menu);
    header.appendChild(nav);

    // Keep the language switch physically separated from the page navigation.
    // This prevents the language-switch hit area from overlapping the first nav item.
    const languageSwitch = document.createElement('a');
    languageSwitch.className = 'language-switch';
    languageSwitch.href = languageUrl;
    languageSwitch.setAttribute('data-language-switch', '');
    languageSwitch.setAttribute('aria-label', labels.languageLabel);
    languageSwitch.innerHTML = '<img alt="' + labels.languageAlt + '" class="flag-icon" src="' + labels.languageFlag + '" /><span>' + labels.languageLabel + '</span>';
    header.appendChild(languageSwitch);
  }

  function initNavigation() {
    if (document.documentElement.dataset.navigationInitialized === 'true') return;
    document.documentElement.dataset.navigationInitialized = 'true';
    buildHeader();

    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const burgerToggle = document.querySelector('.burger-menu-toggle');

    function closeMenu() {
      if (!navMenu || !burgerToggle) return;
      navMenu.classList.remove('open');
      burgerToggle.classList.remove('active');
      burgerToggle.setAttribute('aria-expanded', 'false');
    }

    function updateHeader() {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    }

    function scrollToTarget(targetId) {
      const target = document.getElementById(targetId);
      if (!target) return false;
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 18;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      try { history.pushState(null, '', '#' + targetId); } catch (error) { location.hash = targetId; }
      return true;
    }

    if (burgerToggle && navMenu && !burgerToggle.dataset.bound) {
      burgerToggle.dataset.bound = 'true';
      burgerToggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        navMenu.classList.toggle('open');
        burgerToggle.classList.toggle('active');
        burgerToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('open')));
      });
      document.addEventListener('click', function (event) {
        if (!navMenu.contains(event.target) && !burgerToggle.contains(event.target)) closeMenu();
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 900) closeMenu();
      }, { passive: true });
    }

    if (navMenu && !navMenu.dataset.bound) {
      navMenu.dataset.bound = 'true';
      navMenu.addEventListener('click', function (event) {
        const link = event.target.closest('a');
        if (!link) return;
        const url = new URL(link.href, window.location.href);
        if (sameDocument(link) && url.hash) {
          const targetId = url.hash.slice(1);
          if (targetId && scrollToTarget(targetId)) {
            event.preventDefault();
            closeMenu();
            return;
          }
        }
        closeMenu();
      });
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (location.hash) {
      const targetId = location.hash.slice(1);
      window.setTimeout(function () { scrollToTarget(targetId); }, 120);
    }
  }

  if (document.getElementById('header')) {
    initNavigation();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
