/* ===========================================================
   Interacções — António Maurício
   =========================================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- ano ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- menu mobile ---------- */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

if (burger && menu) {
  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- revelar no scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");

if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -70px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}

/* ---------- luz que segue o rato ---------- */
if (finePointer && !reduceMotion) {
  document.body.classList.add("has-pointer");
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 3;
  let cx = mx, cy = my;

  window.addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  const follow = () => {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    document.documentElement.style.setProperty("--mx", cx + "px");
    document.documentElement.style.setProperty("--my", cy + "px");
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);
}

/* ---------- parallax do poster ---------- */
const posterStage = document.querySelector(".art__stage");
const posterLayers = Array.from(document.querySelectorAll(".art__layer"));

/* ---------- barra de progresso + parallax ---------- */
const bar = document.getElementById("progressBar");
let ticking = false;

function frame() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (bar) {
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.width = (p * 100).toFixed(2) + "%";
  }

  if (!reduceMotion && posterStage) {
    const r = posterStage.getBoundingClientRect();
    const progress = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
    posterStage.style.transform = `translate3d(0, ${(progress * 34).toFixed(2)}px, 0)`;

    posterLayers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.depth || "0");
      layer.style.transform = `translate3d(0, ${(progress * 22 * depth).toFixed(2)}px, 0)`;
    });
  }
  ticking = false;
}

function requestFrame() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(frame);
}

window.addEventListener("scroll", requestFrame, { passive: true });
window.addEventListener("resize", requestFrame);
requestFrame();

/* ---------- inclinação do poster ---------- */
const artFrame = document.querySelector(".art__frame");
if (artFrame && finePointer && !reduceMotion) {
  const zone = artFrame.closest(".art");
  zone.addEventListener("pointermove", (e) => {
    const r = zone.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    artFrame.style.transform =
      `rotate(${1.3 + x * 2.4}deg) translate(${x * -7}px, ${y * -7}px)`;
  });
  zone.addEventListener("pointerleave", () => {
    artFrame.style.transform = "";
  });
}

/* ---------- hora em Luanda ---------- */
const clock = document.getElementById("clock");
if (clock) {
  const fmt = new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Africa/Luanda",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 20000);
}
