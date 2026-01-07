/* =========================================================
   script.js — cleaned + organized + commented
   (Behavior preserved — plus compatibility for single-grid portfolio)
   script.js — organized + commented (functional)
   - Tabs (if present)
   - Enter → Home zoom entrance (if used)
   - Footer year (if #year exists)
   - Scroll reveal (if matching elements exist)
   - Lightbox (works with tabs OR masonry/grid without tabs)
   ========================================================= */

/* =========================================================
   Tabs (Portfolio categories) — safe no-op if tabs not present
   Tabs (Portfolio categories) — runs ONLY if tabs/panels exist
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
   Enter → Home zoom entrance animation (if session flag exists)
   ========================================================= */
(() => {
  const fromEnter = sessionStorage.getItem("fromEnter");
  if (!fromEnter) return;

  sessionStorage.removeItem("fromEnter");

  const wrap = document.querySelector(".page-wrap");
  if (!wrap) return;

  void wrap.offsetWidth; // Force paint
  // Force a paint so the animation reliably triggers
  void wrap.offsetWidth;

  wrap.classList.add("enter-zoom");
})();

/* =========================================================
   Footer year
   Footer year (if the page has #year)
   ========================================================= */
(() => {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();

/* =========================================================
   Scroll reveal
   Scroll reveal (fade/slide in as elements enter viewport)
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
   Lightbox (enlarge images + blur background + arrows + X)
   - Works with tabbed panels OR a single grid (new layout)
   - Works with:
     1) Tabbed grids (keeps nav inside active tab)
     2) Non-tab pages using .grid
     3) Portfolio horizontal masonry using .masonry-x
   ========================================================= */
(() => {
  // Required lightbox elements (present on portfolio page)
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) return;

  const btnPrev = lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox.querySelector(".lightbox-next");

  // If tabs/panels exist, keep navigation within the ACTIVE panel.
  // Otherwise, fall back to ALL images on the page (single-grid portfolio).
  // If tabs exist, restrict navigation to active panel
  const getActivePanel = () => document.querySelector(".panel.active");

  // Get the currently valid image set for navigation
  const getActiveImages = () => {
    const panel = getActivePanel();
    if (panel) return Array.from(panel.querySelectorAll(".grid img"));

    // No tabs/panels: use all gallery images present
    return Array.from(document.querySelectorAll(".masonry-x img, .grid img"));
  };

  let currentIndex = 0;

  function openAt(index) {
    const images = getActiveImages();
    if (!images.length) return;

    // Wrap index within the current image set
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

  function prev() {
    openAt(currentIndex - 1);
  }

  function next() {
    openAt(currentIndex + 1);
  }

  // Click-to-open:
  // - If panels exist: only open from the active panel
  // - Otherwise: open from any grid image (single grid)
  // Click any gallery image (masonry or grid) to open
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.matches(".masonry-x img, .grid img")) {
      const images = getActiveImages();
      const idx = images.indexOf(target);
      if (idx !== -1) openAt(idx);
    }
  });

  // Cursor hint
  // Cursor hint for images
  document.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches(".grid img")) target.style.cursor = "zoom-in";

    if (target.matches(".masonry-x img, .grid img")) {
      target.style.cursor = "zoom-in";
    }
  });

  // Backdrop / X closes
  // Backdrop or X closes
  lightbox.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.getAttribute("data-close") === "true") close();
  });

  // Arrow buttons
  if (btnPrev) btnPrev.addEventListener("click", prev);
  if (btnNext) btnNext.addEventListener("click", next);

  // Keyboard support
  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
