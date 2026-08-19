/* ══════════════════════════════════════════════════════
   AISER — main.js
   TODO: reemplazar WHATSAPP_NUMBER con el número real de Aiser
   (formato internacional sin signos, ej. 5255XXXXXXXX) antes de publicar.
══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '52XXXXXXXXXX'; // ← PENDIENTE: número real de Aiser
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initNavbar();
    initMobileMenu();
    initMarquee();
    initReveal();
    initCounters();
    initHeroCanvas();
    initContactForm();
    initFloatingWhatsapp();
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* Loader */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('is-hidden');
      }, 350);
    });
  }

  /* Navbar background on scroll */
  function initNavbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu */
  function initMobileMenu() {
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mob-menu');
    if (!btn || !menu) return;

    function close() {
      btn.classList.remove('is-open');
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      var isOpen = menu.classList.toggle('is-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    }
    btn.addEventListener('click', toggle);
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  /* Marquee content: logos de las marcas que instala Aiser */
  function initMarquee() {
    var el = document.getElementById('marquee');
    if (!el) return;
    var brands = [
      { name: 'Freyven', file: 'freyven.png' },
      { name: 'McQuay', file: 'mcquay.png' },
      { name: 'York', file: 'york.svg' },
      { name: 'Carrier', file: 'carrier.svg' },
      { name: 'Trane', file: 'trane.svg' },
      { name: 'Intensity', file: 'intensity.svg' },
      { name: 'LG', file: 'lg.svg' }
    ];
    var group = brands.map(function (b) {
      return '<span><img src="img/brands/' + b.file + '" alt="' + b.name + '" loading="lazy"></span>';
    }).join('');
    // Se duplica el bloque para lograr un loop continuo sin cortes.
    el.innerHTML = group + group;
  }

  /* Scroll reveal */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* Animated counters */
  function initCounters() {
    var nums = document.querySelectorAll('.stat-num[data-count]');
    if (!nums.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) {
        el.textContent = formatNumber(target) + suffix;
        return;
      }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatNumber(Math.round(target * eased)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function formatNumber(n) {
      return n.toLocaleString('es-MX');
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(animate);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { observer.observe(el); });
  }

  /* Hero canvas: partículas flotantes tipo aire frío */
  function initHeroCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function makeParticles() {
      var count = Math.min(46, Math.floor((w * h) / 26000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2.2,
          vy: 0.15 + Math.random() * 0.35,
          vx: (Math.random() - 0.5) * 0.25,
          o: 0.15 + Math.random() * 0.35
        });
      }
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#8fdcff';
      particles.forEach(function (p) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -10) p.y = h + 10;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }

    resize();
    makeParticles();
    tick();
    window.addEventListener('resize', function () {
      resize();
      makeParticles();
    });
  }

  /* Contact form → WhatsApp */
  function initContactForm() {
    var form = document.getElementById('wa-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('f-name') || {}).value || '';
      var interest = (document.getElementById('f-interest') || {}).value || '';
      var msg = (document.getElementById('f-msg') || {}).value || '';

      var text = 'Hola, soy ' + name + '. Me interesa: ' + interest + '. ' + msg;
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* Floating WhatsApp button href */
  function initFloatingWhatsapp() {
    var btn = document.querySelector('.wa-btn');
    if (!btn) return;
    var text = 'Hola, visité su sitio web y me gustaría más información.';
    btn.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text));
  }
})();
