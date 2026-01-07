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
   - Keeps navigation within the CURRENT tab only
   - Centers correctly on mobile (CSS handles layout)
   ========================================================= */
(() => {
  // Required lightbox elements
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) return;

  const btnPrev = lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox.querySelector(".lightbox-next");

  // Helper: get currently active panel (tab content)
  const getActivePanel = () => document.querySelector(".panel.active");

  // Helper: get only images in the active panel (prevents skipping to other tabs)
  const getActiveImages = () => {
    const panel = getActivePanel();
    return panel ? Array.from(panel.querySelectorAll(".grid img")) : [];
  };

  let currentIndex = 0;

  function openAt(index) {
    const images = getActiveImages();
    if (!images.length) return;

    // Wrap index within current tab only
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

  // Delegate clicks: open image only within the active panel
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // If the click is on a grid image inside the active panel, open it
    if (target.matches(".panel.active .grid img")) {
      const images = getActiveImages();
      const idx = images.indexOf(target);
      if (idx !== -1) openAt(idx);
    }
  });

  // Add cursor hint on images (works even after tab switches)
  document.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.matches(".grid img")) {
      target.style.cursor = "zoom-in";
    }
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
