/* =========================================================
   script.js — current site behavior + portfolio rail controls
   ========================================================= */

/* =========================================================
   Tabs (Portfolio categories)
   ========================================================= */
(() => {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const target = tab.dataset.target;
      panels.forEach((p) => p.classList.remove("active"));

      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
    });
  });
})();

/* =========================================================
   Enter → Home zoom entrance animation
   ========================================================= */
(() => {
  const fromEnter = sessionStorage.getItem("fromEnter");
  if (!fromEnter) return;

  sessionStorage.removeItem("fromEnter");

  const wrap = document.querySelector(".page-wrap");
  if (!wrap) return;

  void wrap.offsetWidth;
  wrap.classList.add("enter-zoom");
})();

/* =========================================================
   Footer year
   ========================================================= */
(() => {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();

/* =========================================================
   Scroll reveal
   ========================================================= */
(() => {
  const items = document.querySelectorAll(".section, .hero, .card, .contact-card");
  if (!items.length) return;

  items.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
})();

/* =========================================================
   Portfolio rail arrow controls (only if present)
   - Scrolls by ~2 tiles for a clean “editorial” feel
   ========================================================= */
(() => {
  const rail = document.querySelector(".portfolio-rail");
  const grid = document.getElementById("portfolioGrid") || document.querySelector(".portfolio-rail .grid");
  if (!rail || !grid) return;

  const leftBtn = rail.querySelector(".portfolio-arrow-left");
  const rightBtn = rail.querySelector(".portfolio-arrow-right");
  if (!leftBtn || !rightBtn) return;

  function getStep() {
    const first = grid.querySelector("img");
    if (!first) return Math.round(grid.clientWidth * 0.8);

    const styles = window.getComputedStyle(grid);
    const gap = parseFloat(styles.columnGap || styles.gap || "16") || 16;

    const tileW = first.getBoundingClientRect().width || 260;
    return Math.round(tileW * 2 + gap * 2); // “2 tiles” feels good
  }

  function scrollByDir(dir) {
    grid.scrollBy({ left: getStep() * dir, behavior: "smooth" });
  }

  leftBtn.addEventListener("click", () => scrollByDir(-1));
  rightBtn.addEventListener("click", () => scrollByDir(1));
})();

/* =========================================================
   Lightbox (enlarge images + blur background + arrows + X)
   - Works with tabs/panels OR a single grid page
   - Fix: prevents browser drag ghost that caused the “bar” issue
   ========================================================= */
(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) return;

  const btnPrev = lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox.querySelector(".lightbox-next");

  const hasPanels = !!document.querySelector(".panel");
  const getActivePanel = () => document.querySelector(".panel.active");

  const getActiveImages = () => {
    if (hasPanels) {
      const panel = getActivePanel();
      return panel ? Array.from(panel.querySelectorAll(".grid img")) : [];
    }
    return Array.from(document.querySelectorAll(".grid img"));
  };

  let currentIndex = 0;

  function openAt(index) {
    const images = getActiveImages();
    if (!images.length) return;

    currentIndex = (index + images.length) % images.length;

    const img = images[currentIndex];
    const src = img.currentSrc || img.src;
    if (!src) return;

    // Prevent any weird “thin bar” rendering during load
    lightboxImg.style.opacity = "0";
    lightboxImg.src = src;
    lightboxImg.alt = img.alt || "Enlarged photo";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  lightboxImg.addEventListener("load", () => {
    lightboxImg.style.opacity = "1";
  });

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImg.src = "";
  }

  function prev() { openAt(currentIndex - 1); }
  function next() { openAt(currentIndex + 1); }

  /* ---- Critical fix: stop browser drag ghost ---- */
  document.addEventListener("dragstart", (e) => {
    const t = e.target;
    if (t instanceof Element && t.matches(".grid img, #lightboxImg")) {
      e.preventDefault();
    }
  });

  /* Click to open */
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (hasPanels) {
      if (!target.matches(".panel.active .grid img")) return;
    } else {
      if (!target.matches(".grid img")) return;
    }

    const images = getActiveImages();
    const idx = images.indexOf(target);
    if (idx !== -1) openAt(idx);
  });

  /* Cursor hint */
  document.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches(".grid img")) target.style.cursor = "zoom-in";
  });

  /* Backdrop or X closes */
  lightbox.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.getAttribute("data-close") === "true") close();
  });

  if (btnPrev) btnPrev.addEventListener("click", prev);
  if (btnNext) btnNext.addEventListener("click", next);

  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();