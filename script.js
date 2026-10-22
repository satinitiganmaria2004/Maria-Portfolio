// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  })
);

// Header shadow after scrolling
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Highlight the nav link of the section in view
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id)
      );
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => observer.observe(s));

// Back to top
document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
// Settings panel
const root = document.documentElement;
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const reduceMotion = document.getElementById('reduceMotion');
const defaults = { theme: 'pink', size: '100', reduce: false };

let settings = { ...defaults };
try {
  settings = { ...defaults, ...JSON.parse(localStorage.getItem('portfolioSettings') || '{}') };
} catch (e) {}

function applySettings() {
  root.setAttribute('data-theme', settings.theme);
  root.style.fontSize = settings.size + '%';
  root.classList.toggle('reduce-motion', settings.reduce);
  reduceMotion.checked = settings.reduce;
  document.querySelectorAll('[data-theme].opt').forEach(b =>
    b.classList.toggle('active', b.dataset.theme === settings.theme));
  document.querySelectorAll('[data-size].opt').forEach(b =>
    b.classList.toggle('active', b.dataset.size === settings.size));
  try { localStorage.setItem('portfolioSettings', JSON.stringify(settings)); } catch (e) {}
}

function togglePanel(show) {
  settingsPanel.hidden = !show;
  settingsBtn.setAttribute('aria-expanded', show);
}

settingsBtn.addEventListener('click', () => togglePanel(settingsPanel.hidden));
document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePanel(false); });
document.addEventListener('click', e => {
  if (!settingsPanel.hidden && !settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
    togglePanel(false);
  }
});

document.querySelectorAll('[data-theme].opt').forEach(b =>
  b.addEventListener('click', () => { settings.theme = b.dataset.theme; applySettings(); }));
document.querySelectorAll('[data-size].opt').forEach(b =>
  b.addEventListener('click', () => { settings.size = b.dataset.size; applySettings(); }));
reduceMotion.addEventListener('change', () => { settings.reduce = reduceMotion.checked; applySettings(); });
document.getElementById('resetSettings').addEventListener('click', () => {
  settings = { ...defaults };
  applySettings();
});

applySettings();