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

    if (languageSwitch) {
      if (languageUrl) {
        languageSwitch.setAttribute("href", languageUrl);
      }

      const currentLanguage = document.body.dataset.siteLanguage || (location.pathname.indexOf("/en/") !== -1 ? "en" : "de");
      const nextLanguage = currentLanguage === "en" ? "de" : "en";

      languageSwitch.addEventListener("click", function () {
        try {
          localStorage.setItem("siteLanguage", nextLanguage);
        } catch (error) {
          console.warn("Language preference could not be saved", error);
        }
      });
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

    const homePage = document.body.dataset.homePage || (currentPage && currentPage.indexOf("_ENG") !== -1 ? "index_ENG.html" : "index.html");

    document.querySelectorAll("#nav-menu a[data-section-link]").forEach(function (link) {
      const section = link.dataset.sectionLink;
      if (currentPage === homePage) {
        link.setAttribute("href", "#" + section);
        link.classList.add("scrolly");
      } else {
        link.setAttribute("href", homePage + "#" + section);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", includePartials);
  } else {
    includePartials();
  }
})();
