/* MC Crépi — vanilla-JS runtime.
   Reproduces the behaviours the Design Components preview engine provided,
   so the exported pages work as plain static HTML. Every effect below is a
   direct port of the logic in the original .dc.html files:
     - style-hover / style-focus attributes  (host emulated inline :hover/:focus)
     - header compaction on scroll
     - mobile menu toggle
     - hero parallax + scroll reveals + animated counters   (home)
     - draggable before/after slider                        (home, réalisations)
     - filterable gallery                                   (réalisations)
     - quote form submit -> success state                   (contact)
   Each block no-ops when its target elements aren't on the page, so one file
   serves all four pages. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- style-hover / style-focus emulation ---------------------------- */
  function bindInteractiveStyles() {
    document.querySelectorAll("[style-hover],[style-focus]").forEach(function (el) {
      var base = el.getAttribute("style") || "";
      var hover = el.getAttribute("style-hover");
      var focus = el.getAttribute("style-focus");
      var apply = function (extra) { el.setAttribute("style", extra ? base + ";" + extra : base); };
      if (hover) {
        el.addEventListener("mouseenter", function () { apply(hover); });
        el.addEventListener("mouseleave", function () { apply(null); });
      }
      if (focus) {
        el.addEventListener("focus", function () { apply(focus); });
        el.addEventListener("blur", function () { apply(null); });
      }
    });
  }

  /* ---- header: compact + white on scroll ------------------------------ */
  function setupHeader() {
    var header = document.getElementById("mc-header");
    if (!header) return;
    var ticking = false, wasOn;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var on = window.scrollY > 40;
        if (on !== wasOn) {
          wasOn = on;
          header.style.background = on ? "rgba(255,255,255,0.93)" : "transparent";
          header.style.backdropFilter = on ? "blur(14px)" : "none";
          header.style.webkitBackdropFilter = on ? "blur(14px)" : "none";
          header.style.boxShadow = on ? "0 1px 0 rgba(17,17,17,0.09)" : "none";
          header.style.paddingTop = on ? "12px" : "26px";
          header.style.paddingBottom = on ? "12px" : "26px";
        }
        parallax();
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- mobile menu ---------------------------------------------------- */
  function setupMenu() {
    var menu = document.getElementById("mc-menu");
    document.querySelectorAll('[data-mc="toggle-menu"]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!menu) return;
        menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
      });
    });
    document.querySelectorAll('[data-mc="close-menu"]').forEach(function (a) {
      a.addEventListener("click", function () { if (menu) menu.style.display = "none"; });
    });
  }

  /* ---- hero parallax (home) ------------------------------------------- */
  function parallax() {
    if (reduced) return;
    var img = document.getElementById("mc-hero-img");
    var chip = document.getElementById("mc-hero-chip");
    var txt = document.getElementById("mc-hero-text");
    if (!img && !txt && !chip) return;
    var y = window.scrollY;
    if (y >= window.innerHeight * 1.2) return;
    if (img) img.style.transform = "translate3d(0," + (y * 0.32) + "px,0) scale(1.12)";
    if (chip) chip.style.transform = "translate3d(0," + (y * -0.12) + "px,0)";
    if (txt) { txt.style.transform = "translate3d(0," + (y * 0.14) + "px,0)"; txt.style.opacity = String(Math.max(0, 1 - y / 650)); }
  }

  /* ---- scroll reveals ------------------------------------------------- */
  function setupReveals() {
    if (reduced) return;
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var d = parseInt(el.getAttribute("data-reveal") || "0", 10);
        setTimeout(function () { el.style.opacity = "1"; el.style.transform = "none"; }, d);
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.style.opacity = "0";
        el.style.transform = "translateY(34px)";
        el.style.transition = "opacity 0.9s cubic-bezier(0.2,0.6,0.2,1), transform 0.9s cubic-bezier(0.2,0.6,0.2,1)";
        io.observe(el);
      }
    });
  }

  /* ---- animated counters (home) --------------------------------------- */
  function setupCounters() {
    var band = document.getElementById("mc-stats");
    if (!band) return;
    var nums = Array.prototype.slice.call(band.querySelectorAll("[data-count]"));
    var counted = false;
    function run() {
      if (counted) return;
      counted = true;
      var t0 = performance.now();
      var dur = reduced ? 1 : 1700;
      function step(t) {
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        nums.forEach(function (el) {
          var target = parseFloat(el.getAttribute("data-count"));
          el.textContent = Math.round(target * e).toLocaleString("fr-FR") + (el.getAttribute("data-suffix") || "");
        });
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(band);
  }

  /* ---- before / after slider ------------------------------------------ */
  function setupSlider() {
    var box = document.getElementById("mc-ba");
    if (!box) return;
    var top = document.getElementById("mc-ba-before");
    var handle = document.getElementById("mc-ba-handle");
    var dragging = false;
    function set(clientX) {
      var r = box.getBoundingClientRect();
      var p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(4, Math.min(96, p));
      top.style.clipPath = "inset(0 " + (100 - p) + "% 0 0)";
      handle.style.left = p + "%";
    }
    box.addEventListener("pointerdown", function (e) {
      dragging = true;
      try { box.setPointerCapture(e.pointerId); } catch (err) {}
      set(e.clientX); e.preventDefault();
    });
    box.addEventListener("pointermove", function (e) { if (dragging) set(e.clientX); });
    function up() { dragging = false; }
    box.addEventListener("pointerup", up);
    box.addEventListener("pointercancel", up);
  }

  /* ---- gallery filter (réalisations) ---------------------------------- */
  function setupGallery() {
    var btns = Array.prototype.slice.call(document.querySelectorAll(".mc-filter"));
    if (!btns.length) return;
    var items = Array.prototype.slice.call(document.querySelectorAll(".mc-item"));
    var empty = document.getElementById("mc-empty");
    var ACTIVE = "background:var(--accent,#F28C28);color:#111;border:1px solid var(--accent,#F28C28);";
    var INACTIVE = "background:transparent;color:#3A3A3A;border:1px solid #DCD9D2;";
    function apply(filter) {
      var shown = 0;
      items.forEach(function (it) {
        var ok = (filter === "all" || it.getAttribute("data-cat") === filter);
        it.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      btns.forEach(function (b) {
        var base = b.getAttribute("data-base") || "";
        b.setAttribute("style", base + (b.getAttribute("data-filter") === filter ? ACTIVE : INACTIVE));
      });
      if (empty) empty.style.display = shown === 0 ? "block" : "none";
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { apply(b.getAttribute("data-filter")); });
    });
    apply("all");
  }

  /* ---- quote form (contact) ------------------------------------------- */
  function setupForm() {
    var form = document.querySelector('[data-mc="form-submit"]');
    if (!form) return;
    form.addEventListener("submit", function () {
      // Let the POST to FormSubmit proceed (opens in a new tab), then swap to the
      // confirmation state — matching the prototype's behaviour.
      var open = document.getElementById("mc-form-open");
      var sent = document.getElementById("mc-form-sent");
      if (open) open.style.display = "none";
      if (sent) sent.style.display = "block";
    });
  }

  function init() {
    bindInteractiveStyles();
    setupHeader();
    setupMenu();
    setupReveals();
    setupCounters();
    setupSlider();
    setupGallery();
    setupForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
