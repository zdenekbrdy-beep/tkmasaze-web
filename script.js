// TK MASÁŽE - script.js

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// Counter animation
const counters = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// Ceník tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab)?.classList.add('active');

    // re-trigger reveal for newly visible items
    document.getElementById('tab-' + tab)?.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  });
});

// Recenze carousel
const track = document.getElementById('recenzeTrack');
const cards = track?.querySelectorAll('.recenze-card');
const dotsContainer = document.getElementById('recenzeDots');
let current = 0;
let autoTimer;

if (cards?.length) {
  cards[0].classList.add('active');

  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'recenze-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const goTo = (n) => {
    cards[current].classList.remove('active');
    current = (n + cards.length) % cards.length;
    cards[current].classList.add('active');
    dotsContainer.querySelectorAll('.recenze-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  };

  document.getElementById('recenzePrev')?.addEventListener('click', () => {
    goTo(current - 1);
    resetAuto();
  });
  document.getElementById('recenzeNext')?.addEventListener('click', () => {
    goTo(current + 1);
    resetAuto();
  });

  const startAuto = () => {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  };
  const resetAuto = () => {
    clearInterval(autoTimer);
    startAuto();
  };

  startAuto();

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
  }, { passive: true });
}

// Smooth anchor scroll with navbar offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});
