/* GUIDE-AI — main.js */

/* --- Navbar scroll shadow ----------------------------------- */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* --- Mobile menu toggle ------------------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  // Mobile dropdown items
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.closest('.has-dropdown').classList.toggle('open');
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --- Active nav link ---------------------------------------- */
(function highlightNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* --- Animated counters -------------------------------------- */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix  || '';
  const prefix   = el.dataset.prefix  || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
  const duration = 1800;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* --- Animate on scroll -------------------------------------- */
const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.aos').forEach(el => aosObserver.observe(el));

/* --- Smooth anchor scroll with offset ----------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--navbar-height') || '68', 10);
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* --- Simple cookie notice ----------------------------------- */
(function cookieBanner() {
  if (localStorage.getItem('cookieConsent')) return;

  const banner = document.createElement('div');
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.style.cssText = [
    'position:fixed', 'bottom:1rem', 'left:1rem', 'right:1rem', 'max-width:600px',
    'margin:0 auto', 'background:#0F2547', 'color:rgba(255,255,255,.88)',
    'padding:1.25rem 1.5rem', 'border-radius:0.75rem',
    'box-shadow:0 8px 32px rgba(0,0,0,.3)', 'z-index:9000',
    'display:flex', 'align-items:center', 'gap:1rem', 'flex-wrap:wrap',
    'font-size:.875rem', 'line-height:1.5'
  ].join(';');

  banner.innerHTML = `
    <span style="flex:1;min-width:200px">
      This site uses only essential cookies. See our
      <a href="privacy.html#cookies" style="color:#33AADE">Cookie Policy</a>.
    </span>
    <button id="cookie-accept" style="
      background:#0095DA;color:#fff;border:none;padding:.5rem 1.25rem;
      border-radius:.5rem;cursor:pointer;font-weight:600;font-size:.875rem;
      white-space:nowrap;flex-shrink:0
    ">Accept</button>
    <button id="cookie-reject" style="
      background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.25);
      padding:.5rem 1rem;border-radius:.5rem;cursor:pointer;font-size:.875rem;
      white-space:nowrap;flex-shrink:0
    ">Reject</button>
  `;

  document.body.appendChild(banner);

  ['cookie-accept', 'cookie-reject'].forEach(id => {
    banner.querySelector('#' + id).addEventListener('click', () => {
      localStorage.setItem('cookieConsent', id === 'cookie-accept' ? 'accepted' : 'rejected');
      banner.remove();
    });
  });
})();
