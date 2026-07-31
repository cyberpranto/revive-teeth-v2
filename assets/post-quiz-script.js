/* ===================================================================
   REVIVE TEETH Â· POST-QUIZ PAGE (v5.3) â€” BEHAVIOR
   Scroll reveals Â· arch selector (live price) Â· accordions Â·
   sticky buy bar Â· PDP gallery Â· personalization Â· quiz preselect.
   No green. No countdowns. No scarcity. One decision.
   =================================================================== */






/* ---------- SCROLL REVEAL (IntersectionObserver + stagger) ---------- */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      if (child.classList.contains("reveal"))
        child.dataset.delay = (i * 60).toString();
    });
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || "0", 10);
          el.style.transitionDelay = delay + "ms";
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  items.forEach((el) => io.observe(el));
})();



/* ---------- SMOOTH SCROLL TO BUY BOX ---------- */
function scrollToBuy() {
  const el = document.getElementById("order");
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 58;
  window.scrollTo({ top: y, behavior: "smooth" });
}
document
  .querySelectorAll(".scroll-buy")
  .forEach((b) => b.addEventListener("click", scrollToBuy));

/* ---------- CLAIM CTA (stub + feedback) ---------- */
/* SHOPIFY DEV NOTE: push selected variant (current = "upper"|"lower"|"both")
     and auto-apply the $100 quiz discount (non-stackable) before checkout. */
document.querySelectorAll(".claim-cta").forEach((btn) => {
  btn.addEventListener("click", () => {
    const orig = btn.dataset.orig || btn.innerHTML;
    btn.dataset.orig = orig;
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-11"/></svg> Added, credit applied';
    clearTimeout(btn._t);
    btn._t = setTimeout(() => {
      btn.innerHTML = orig;
    }, 1800);
  });
});

/* ---------- FAQ ACCORDION ---------- */
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  if (!q) return;
  q.addEventListener("click", () => {
    const open = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((x) => {
      x.classList.remove("open");
      const xq = x.querySelector(".faq-q");
      if (xq) xq.setAttribute("aria-expanded", "false");
    });
    if (!open) {
      item.classList.add("open");
      q.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- STICKY BUY BAR (after hero, hide over closer/footer) ---------- */
(function () {
  const sticky = document.getElementById("stickyBar");
  const hero = document.getElementById("hero");
  const footer = document.getElementById("footer");
  if (!sticky || !hero || !footer) return;
  function onScroll() {
    const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
    const footerTop = footer.getBoundingClientRect().top + window.scrollY;
    const y = window.scrollY;
    const vpBottom = y + window.innerHeight;
    const past = y > heroBottom - 60;
    const beforeFooter = vpBottom < footerTop + 40;
    if (past && beforeFooter) {
      sticky.classList.add("show");
      document.body.classList.add("pad-sticky");
    } else {
      sticky.classList.remove("show");
      document.body.classList.remove("pad-sticky");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();



/* ---------- BUY-BOX ACCORDIONS ---------- */
document.querySelectorAll("#drops .drop").forEach(function (d) {
  const q = d.querySelector(".drop-q");
  if (!q) return;
  q.addEventListener("click", function () {
    const open = d.classList.toggle("open");
    q.setAttribute("aria-expanded", open ? "true" : "false");
  });
});

/* ---------- PROTOCOL ACCORDION (7 checkpoints) ---------- */
document.querySelectorAll("#protoAcc .pacc").forEach(function (p) {
  const q = p.querySelector(".pacc-q");
  if (!q) return;
  q.addEventListener("click", function () {
    const open = p.classList.toggle("open");
    q.setAttribute("aria-expanded", open ? "true" : "false");
  });
});
