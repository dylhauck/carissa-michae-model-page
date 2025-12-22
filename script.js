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
