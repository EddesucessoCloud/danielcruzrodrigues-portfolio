/* nav.js — vanilla port of the HTML5UP "Dimension" article-overlay navigation.
   Replaces the jQuery-based assets/js/main.js (BUILD-04). Faithfully reproduces
   the same body classes (is-preload / is-article-visible / is-switching),
   article.active toggling, show/hide timing (delay=325ms), hashchange routing,
   close button, click-outside and Escape-to-close — so the existing main.css
   transitions keep working unchanged.

   Original: Dimension by HTML5 UP (html5up.net | @ajlkn), CCA 3.0. */

const DELAY = 325;

const show = (el) => { if (el) el.style.display = ""; };
const hide = (el) => { if (el) el.style.display = "none"; };

export function initNav() {
  const body = document.body;
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");
  const main = document.getElementById("main");
  if (!main) return;

  const articles = Array.from(main.querySelectorAll(":scope > article"));
  let locked = false;

  function _show(id, initial) {
    const article = articles.find((a) => a.id === id);
    if (!article) return;

    // Already locked or initial render: speed through without delays.
    if (locked || initial === true) {
      body.classList.add("is-switching", "is-article-visible");
      articles.forEach((a) => a.classList.remove("active"));
      hide(header);
      hide(footer);
      show(main);
      show(article);
      article.classList.add("active");
      locked = false;
      setTimeout(() => body.classList.remove("is-switching"), initial ? 1000 : 0);
      return;
    }

    locked = true;

    if (body.classList.contains("is-article-visible")) {
      // Swap from a currently-visible article.
      const current = articles.find((a) => a.classList.contains("active"));
      if (current) current.classList.remove("active");
      setTimeout(() => {
        hide(current);
        show(article);
        setTimeout(() => {
          article.classList.add("active");
          window.scrollTo(0, 0);
          setTimeout(() => { locked = false; }, DELAY);
        }, 25);
      }, DELAY);
    } else {
      // Open from the landing (header) state.
      body.classList.add("is-article-visible");
      setTimeout(() => {
        hide(header);
        hide(footer);
        show(main);
        show(article);
        setTimeout(() => {
          article.classList.add("active");
          window.scrollTo(0, 0);
          setTimeout(() => { locked = false; }, DELAY);
        }, 25);
      }, DELAY);
    }
  }

  function _hide(addState) {
    const article = articles.find((a) => a.classList.contains("active"));
    if (!body.classList.contains("is-article-visible")) return;

    if (addState === true) history.pushState(null, "", "#");

    if (locked) {
      body.classList.add("is-switching");
      if (article) { article.classList.remove("active"); hide(article); }
      hide(main);
      show(footer);
      show(header);
      body.classList.remove("is-article-visible", "is-switching");
      locked = false;
      window.scrollTo(0, 0);
      return;
    }

    locked = true;
    if (article) article.classList.remove("active");
    setTimeout(() => {
      if (article) hide(article);
      hide(main);
      show(footer);
      show(header);
      setTimeout(() => {
        body.classList.remove("is-article-visible");
        window.scrollTo(0, 0);
        setTimeout(() => { locked = false; }, DELAY);
      }, 25);
    }, DELAY);
  }

  // Per-article: append Close button + stop inside clicks from bubbling to body.
  articles.forEach((article) => {
    const close = document.createElement("div");
    close.className = "close";
    close.textContent = "Close";
    close.addEventListener("click", () => { location.hash = ""; });
    article.appendChild(close);
    article.addEventListener("click", (e) => e.stopPropagation());
  });

  // Click anywhere outside an article hides it.
  body.addEventListener("click", () => {
    if (body.classList.contains("is-article-visible")) _hide(true);
  });

  // Escape closes the open article.
  window.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && body.classList.contains("is-article-visible")) _hide(true);
  });

  // Hash routing.
  window.addEventListener("hashchange", (e) => {
    if (location.hash === "" || location.hash === "#") {
      e.preventDefault();
      _hide();
    } else if (articles.some((a) => `#${a.id}` === location.hash)) {
      e.preventDefault();
      _show(location.hash.substring(1));
    }
  });

  // Prevent scroll jump on hashchange.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  // Initialize: hide main + articles.
  hide(main);
  articles.forEach(hide);

  // Deep-link: open the article named in the URL hash on load.
  if (location.hash !== "" && location.hash !== "#") {
    _show(location.hash.substring(1), true);
  }
}
