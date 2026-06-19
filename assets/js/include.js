(function () {
  async function includePartials() {
    const includeElements = Array.from(document.querySelectorAll("[data-include]"));

    await Promise.all(includeElements.map(async function (element) {
      const file = element.getAttribute("data-include");

      if (!file) {
        return;
      }

      try {
        const response = await fetch(file, { cache: "no-cache" });

        if (!response.ok) {
          throw new Error("Unable to load " + file);
        }

        element.innerHTML = await response.text();
        element.removeAttribute("data-include");
        element.setAttribute("data-included", file);
      } catch (error) {
        console.error(error);
      }
    }));

    configureHeader();
    document.dispatchEvent(new CustomEvent("partials:loaded"));
  }

  function configureHeader() {
    const currentPage = document.body.dataset.currentPage || "";
    const languageUrl = document.body.dataset.languageUrl || "";
    const languageSwitch = document.querySelector("[data-language-switch]");

    if (languageSwitch && languageUrl) {
      languageSwitch.setAttribute("href", languageUrl);
    }

    document.querySelectorAll("#nav-menu a[aria-current]").forEach(function (link) {
      link.removeAttribute("aria-current");
    });

    if (currentPage) {
      const activeLink = document.querySelector('#nav-menu a[data-page-link="' + currentPage + '"]');

      if (activeLink) {
        activeLink.setAttribute("aria-current", "page");
      }
    }

    if (currentPage === "index.html") {
      document.querySelectorAll("#nav-menu a[data-section-link]").forEach(function (link) {
        const section = link.dataset.sectionLink;
        link.setAttribute("href", "#" + section);
        link.classList.add("scrolly");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", includePartials);
  } else {
    includePartials();
  }
})();
