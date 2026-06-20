(function () {
  function initNavigation() {
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
        const href = link.getAttribute('href') || '';
        const url = new URL(link.href, window.location.href);
        const isSamePage = url.origin === window.location.origin && url.pathname === window.location.pathname;
        if (href.startsWith('#') || (isSamePage && url.hash)) {
          const targetId = (url.hash || href).replace('#', '');
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
