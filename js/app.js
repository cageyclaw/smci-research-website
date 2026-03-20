/* ============================================
   SMCI Research — app.js
   Main application logic
   ============================================ */

// ---- NAV TOGGLE (mobile) ----
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // Active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// ---- SCROLL ANIMATIONS ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card, .timeline-item, .competitor-card, .fin-stat, .projection-scenario').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    observer.observe(el);
  });
}

// ---- NEWS FILTER ----
function initNewsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const newsItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      newsItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ---- TABS ----
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
}

// ---- SCROLL TO SECTION ----
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ---- FORMAT CURRENCY ----
function formatCurrency(val, decimals = 2) {
  if (val === null || val === undefined) return '—';
  return '$' + Number(val).toFixed(decimals);
}

// ---- FORMAT LARGE NUMBER ----
function formatLargeNumber(val, suffix = '') {
  if (val === null || val === undefined) return '—';
  const v = Number(val);
  if (v >= 1000) {
    return (v / 1000).toFixed(1) + 'K' + suffix;
  }
  return v.toString() + suffix;
}

// ---- FORMAT BILLION ----
function formatBillion(val) {
  if (val === null || val === undefined) return '—';
  return '$' + Number(val).toFixed(1) + 'B';
}

// ---- FORMAT PERCENT ----
function formatPercent(val) {
  if (val === null || val === undefined) return '—';
  return Number(val).toFixed(1) + '%';
}

// ---- DYNAMIC DATA IMPORT ----
const SMCI_DATA = {
  stock: null,
  news: null,
  financials: null,
  analyst: null,
  company: null,
  competitors: null
};

async function loadAllData() {
  const sources = [
    { key: 'stock', path: 'data/stock.json' },
    { key: 'news', path: 'data/news.json' },
    { key: 'financials', path: 'data/financials.json' },
    { key: 'analyst', path: 'data/analyst.json' },
    { key: 'company', path: 'data/company.json' },
    { key: 'competitors', path: 'data/competitors.json' }
  ];

  for (const src of sources) {
    try {
      const res = await fetch(src.path);
      if (res.ok) {
        SMCI_DATA[src.key] = await res.json();
      }
    } catch (e) {
      console.warn(`Could not load ${src.path}:`, e);
    }
  }
}

// ---- EXPORTS ----
window.SMCI_DATA = SMCI_DATA;
window.loadAllData = loadAllData;
window.initScrollAnimations = initScrollAnimations;
window.initNewsFilter = initNewsFilter;
window.initTabs = initTabs;
window.scrollToSection = scrollToSection;
window.formatCurrency = formatCurrency;
window.formatLargeNumber = formatLargeNumber;
window.formatBillion = formatBillion;
window.formatPercent = formatPercent;
