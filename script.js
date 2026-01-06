/* =========================================================
   script.js — cleaned + organized + commented
   (Behavior preserved — plus compatibility for single-grid portfolio)
   ========================================================= */

/* =========================================================
   Tabs (Portfolio categories) — safe no-op if tabs not present
   ========================================================= */
(() => {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Update tab states
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Show the selected panel
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

  void wrap.offsetWidth; // Force paint
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
   Portfolio horizontal gallery arrows (masonry-x)
   - Works only if markup exists
   ========================================================= */
(() => {
  const scroller = document.querySelector(".grid.masonry-x");
  const arrows = document.querySelectorAll(".gallery-arrow");
  if (!scroller || !arrows.length) return;

  function scrollByAmount(dir) {
    // Scroll roughly one column width + gap
    const col = scroller.querySelector("img");
    const colWidth = col ? col.getBoundingClientRect().width : 260;
    scroller.scrollBy({ left: dir * (colWidth + 16), behavior: "smooth" });
  }

  arrows.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = Number(btn.getAttribute("data-dir")) || 1;
      scrollByAmount(dir);
    });
  });
})();

/* =========================================================
   Lightbox (enlarge images + blur background + arrows + X)
   - Works with tabbed panels OR a single grid (new layout)
   ========================================================= */
(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) return;

  const btnPrev = lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox.querySelector(".lightbox-next");

  // If tabs/panels exist, keep navigation within the ACTIVE panel.
  // Otherwise, fall back to ALL images on the page (single-grid portfolio).
  const getActivePanel = () => document.querySelector(".panel.active");

  const getActiveImages = () => {
    const panel = getActivePanel();
    if (panel) return Array.from(panel.querySelectorAll(".grid img"));
    return Array.from(document.querySelectorAll(".grid img"));
  };

  let currentIndex = 0;

  function openAt(index) {
    const images = getActiveImages();
    if (!images.length) return;

    currentIndex = (index + images.length) % images.length;

    const img = images[currentIndex];
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "Enlarged photo";

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImg.src = "";
  }

  function prev() { openAt(currentIndex - 1); }
  function next() { openAt(currentIndex + 1); }

  // Click-to-open:
  // - If panels exist: only open from the active panel
  // - Otherwise: open from any grid image (single grid)
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const panel = getActivePanel();

    if (panel) {
      if (!target.matches(".panel.active .grid img")) return;
      const images = getActiveImages();
      const idx = images.indexOf(target);
      if (idx !== -1) openAt(idx);
      return;
    }

    if (target.matches(".grid img")) {
      const images = getActiveImages();
      const idx = images.indexOf(target);
      if (idx !== -1) openAt(idx);
    }
  });

  // Cursor hint
  document.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches(".grid img")) target.style.cursor = "zoom-in";
  });

  // Backdrop / X closes
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