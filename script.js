'use strict';

const progressBar = document.querySelector('.scroll-progress span');
const revealItems = document.querySelectorAll('.reveal');
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const resumeToggle = document.querySelector('.resume-toggle');
const resumeLinks = document.querySelector('#resume-links');

resumeToggle?.addEventListener('click', () => {
  const isExpanded = resumeToggle.getAttribute('aria-expanded') === 'true';
  resumeToggle.setAttribute('aria-expanded', String(!isExpanded));
  resumeLinks.hidden = isExpanded;
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    history.replaceState(null, '', link.hash);
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    target.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
  });
});

revealItems.forEach((item) => {
  if (item.dataset.delay) item.style.setProperty('--delay', `${item.dataset.delay}ms`);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

revealItems.forEach((item) => revealObserver.observe(item));

let scrollTicking = false;
function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollProgress);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollProgress();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const sectionId = entry.target.id;
    navLinks.forEach((link) => {
      if (link.hash === `#${sectionId}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));
