document.getElementById('year').textContent = new Date().getFullYear();

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

navToggle.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  const siblings = el.parentElement.querySelectorAll('.reveal');
  const index = Array.from(siblings).indexOf(el);
  el.dataset.delay = index * 80;
  revealObserver.observe(el);
});

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-item__fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 120);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(group => {
  skillObserver.observe(group);
});

const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');

if (carousel) {
  const cards = carousel.querySelectorAll('.carousel-card');
  let current = 0;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Projeto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function checkOverflow() {
    const isOverflowing = carousel.scrollWidth > carousel.clientWidth + 4;
    carousel.classList.toggle('carousel--overflow', isOverflowing);
    const controls = document.querySelector('.carousel-controls');
    if (controls) controls.style.visibility = isOverflowing ? 'visible' : 'hidden';
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, cards.length - 1));
    cards[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === cards.length - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  let scrollTimer;
  carousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const cardWidth = cards[0].offsetWidth + 24;
      const offset = carousel.scrollLeft + carousel.clientWidth / 2;
      const idx = Math.min(Math.round((offset - cardWidth / 2) / cardWidth), cards.length - 1);
      if (idx !== current) {
        current = Math.max(0, idx);
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === cards.length - 1;
      }
    }, 80);
  }, { passive: true });

  checkOverflow();
  const ro = new ResizeObserver(checkOverflow);
  ro.observe(carousel);
}
