/* ===================================================================
   REVIVE TEETH Â· POST-QUIZ PAGE (v5.3) â€” BEHAVIOR
   Scroll reveals Â· arch selector (live price) Â· accordions Â·
   sticky buy bar Â· PDP gallery Â· personalization Â· quiz preselect.
   No green. No countdowns. No scarcity. One decision.
   =================================================================== */

/* ---------- PERSONALIZATION (optional ?name= or stored) ---------- */
// (function(){
//     function getName(){
//       try{
//         const p = new URLSearchParams(location.search).get("name");
//         if(p && p.trim()) return p.trim().replace(/[<>]/g,"").slice(0,40);
//         const s = localStorage.getItem("reviveFirstName");
//         if(s && s.trim()) return s.trim().slice(0,40);
//       }catch(e){}
//       return "";
//     }
//     const nm = getName();
//     if(nm){
//       const h = document.getElementById("qName");
//       if(h) h.textContent = nm + ", ";
//     }
//   })();

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

/* ---------- ARCH SELECTOR (buy box, $100 credit pricing) ---------- */
const CONFIGS = {
  upper: { label: "Upper Arch", real: 1297, price: 1197 },
  lower: { label: "Lower Arch", real: 1297, price: 1197 },
  both: { label: "Upper & Lower", real: 1994, price: 1894 },
};
let current = "both";
function fmt(n) {
  return "$" + n.toLocaleString("en-US");
}
function applyConfig(key) {
  if (!CONFIGS[key]) return;
  current = key;
  const c = CONFIGS[key];
  document.querySelectorAll(".arch-opt").forEach((o) => {
    const sel = o.dataset.key === key;
    o.classList.toggle("sel", sel);
    o.setAttribute("aria-checked", sel ? "true" : "false");
  });
  const now = document.getElementById("bpNow");
  const was = document.getElementById("bpWas");
  if (now) now.textContent = fmt(c.price);
  if (was) was.textContent = fmt(c.real);
  const sb = document.getElementById("sbInfoText");
  if (sb) sb.textContent = c.label + " Â· " + fmt(c.price);
}
document.querySelectorAll(".arch-opt").forEach((o) => {
  o.addEventListener("click", () => applyConfig(o.dataset.key));
  o.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      applyConfig(o.dataset.key);
    }
  });
});
applyConfig("both");

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

/* ---------- VIDEO PLAYERS (wires only when a real <video> is present) ---------- */
function wireVideo(videoId, overlayId) {
  const v = document.getElementById(videoId);
  const overlay = document.getElementById(overlayId);
  if (!v || !overlay) return;
  overlay.addEventListener("click", () => {
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  });
  v.addEventListener("click", () => {
    if (!v.paused) v.pause();
  });
  v.addEventListener("play", () => overlay.classList.add("hidden"));
  v.addEventListener("pause", () => overlay.classList.remove("hidden"));
  v.addEventListener("ended", () => {
    overlay.classList.remove("hidden");
    v.currentTime = 0;
  });
}
["joshua", "connie", "michelle", "lindsay", "turley"].forEach((n) => {
  wireVideo(n + "Video", n + "Overlay");
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

/* ---------- PDP GALLERY (buy box) ---------- */
(function () {
  const main = document.getElementById("galMain");
  const thumbs = Array.from(document.querySelectorAll(".thumb"));
  if (!main || !thumbs.length) return;
  thumbs.forEach((t) => {
    t.addEventListener("click", () => {
      thumbs.forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      const img = t.querySelector("img");
      const src = img ? img.getAttribute("src") : "";
      const alt = t.dataset.alt || "Revive Veneers";
      main.classList.add("fade");
      setTimeout(() => {
        main.innerHTML =
          '<img src="' + src + '" alt="Revive Veneers, ' + alt + '" />';
        main.classList.remove("fade");
      }, 170);
    });
  });
})();

/* ---------- ARCH PRESELECT FROM QUIZ PARAM (?arch=upper|lower|both) ---------- */
(function () {
  try {
    const a = new URLSearchParams(location.search).get("arch");
    if (a && CONFIGS[a]) applyConfig(a);
  } catch (e) {}
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
