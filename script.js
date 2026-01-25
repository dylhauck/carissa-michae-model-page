/* =========================================================
   script.js — cleaned + organized + commented
   (Behavior preserved — no feature changes)
   ========================================================= */

/* =========================================================
   Tabs (Portfolio categories)
   ========================================================= */
(() => {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  // If this page doesn't use tabs/panels, do nothing.
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
   (Plays when coming from the Enter page)
   ========================================================= */
(() => {
  const fromEnter = sessionStorage.getItem("fromEnter");
  if (!fromEnter) return;

  sessionStorage.removeItem("fromEnter");

  const wrap = document.querySelector(".page-wrap");
  if (!wrap) return;

  // Force a paint so the animation reliably triggers
  void wrap.offsetWidth;

  wrap.classList.add("enter-zoom");
})();

/* =========================================================
   Page-load zoom (About only)
   - Matches the subtle animation you see on other pages
   - Does NOT interfere with Enter → Home behavior
   ========================================================= */
(() => {
  // Only run on About page
  if (!document.body.classList.contains("about-page")) return;

  const wrap = document.querySelector(".page-wrap");
  if (!wrap) return;

  // If Enter→Home animation already ran, don't double-animate
  if (wrap.classList.contains("enter-zoom")) return;

  // Trigger the same animation class
  void wrap.offsetWidth; // force paint
  wrap.classList.add("enter-zoom");

  // Optional: remove after it finishes so it can re-trigger on next load
  setTimeout(() => wrap.classList.remove("enter-zoom"), 1300);
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
   - Works with tabs/panels (if present) OR a single grid page
   ========================================================= */
(() => {
  // Required lightbox elements
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) return;

  const btnPrev = lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox.querySelector(".lightbox-next");

  // Detect whether this page uses panels (tabs)
  const hasPanels = !!document.querySelector(".panel");

  const getActivePanel = () => document.querySelector(".panel.active");

  const getActiveImages = () => {
    // If tabs exist, stay inside the active panel
    if (hasPanels) {
      const panel = getActivePanel();
      return panel ? Array.from(panel.querySelectorAll(".grid img")) : [];
    }

    // No tabs/panels: use all images in the grid(s) on the page
    return Array.from(document.querySelectorAll(".grid img"));
  };

  let currentIndex = 0;

  function openAt(index) {
    const images = getActiveImages();
    if (!images.length) return;

    // Wrap index within available images
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

    // Clear src to reduce memory use on large images
    lightboxImg.src = "";
  }

  function prev() {
    openAt(currentIndex - 1);
  }

  function next() {
    openAt(currentIndex + 1);
  }

  /* =========================================================
     CLICK TO OPEN (FIXED)
     - Use closest(".grid img") so clicks still work even if
       the click lands on a wrapper/overlay/scroll container.
     ========================================================= */
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const img = target.closest(".grid img");
    if (!img) return;

    // Tabs page: only open images inside the active panel
    if (hasPanels) {
      const activePanel = getActivePanel();
      if (!activePanel || !activePanel.contains(img)) return;
    }

    const images = getActiveImages();
    const idx = images.indexOf(img);
    if (idx !== -1) openAt(idx);
  });

  // Cursor hint
  document.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const img = target.closest(".grid img");
    if (img) img.style.cursor = "zoom-in";
  });

  // Backdrop or X closes
  lightbox.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.getAttribute("data-close") === "true") close();
  });

  // Arrow buttons (guard in case markup changes)
  if (btnPrev) btnPrev.addEventListener("click", prev);
  if (btnNext) btnNext.addEventListener("click", next);

  // Keyboard support
  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();
