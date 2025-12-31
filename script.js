// Tabs
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    // update tabs
    tabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    // update panels
    const target = tab.dataset.target;
    panels.forEach(p => p.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// If we came from the Enter page, play the zoom-out entrance animation
(function () {
  const fromEnter = sessionStorage.getItem("fromEnter");
  if (!fromEnter) return;

  sessionStorage.removeItem("fromEnter");

  const wrap = document.querySelector(".page-wrap");
  if (!wrap) return;

  // Force a paint so the animation reliably triggers
  void wrap.offsetWidth;

  wrap.classList.add("enter-zoom");
})();

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll reveal
(() => {
  const items = document.querySelectorAll(".section, .hero, .card, .contact-card");
  items.forEach(el => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();

// Lightbox (enlarge + blur + arrows)
(function () {
  const gridImages = Array.from(document.querySelectorAll(".grid img"));
  if (!gridImages.length) return;

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) return;

  const btnPrev = lightbox.querySelector(".lightbox-prev");
  const btnNext = lightbox.querySelector(".lightbox-next");

  let currentIndex = 0;

  function openAt(index) {
    currentIndex = (index + gridImages.length) % gridImages.length;

    const img = gridImages[currentIndex];
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

    // Optional: clear src to stop memory usage on very large images
    lightboxImg.src = "";
  }

  function prev() { openAt(currentIndex - 1); }
  function next() { openAt(currentIndex + 1); }

  // Click any grid image to open
  gridImages.forEach((img, idx) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openAt(idx));
  });

  // Backdrop or X closes
  lightbox.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.getAttribute("data-close") === "true") close();
  });

  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);

  // Keyboard support
  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();
