/**
 * BlackGrid Security Labs — Production Client JavaScript
 * Pure Vanilla JavaScript — zero third-party dependencies
 * Supports VS Code Live Server and modern browser environments
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroCarousel();
  initModals();
  initCourseSearch();
  initFooterYear();
  initPopularCourseSlider();
});

/**
 * 1. Header & Navigation Controller
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  // Sticky header scroll elevation
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking nav links in mobile drawer
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });

    // Mobile submenu accordion
    const mobileCoursesBtn = document.querySelector('.mobile-courses-toggle');
    const mobileSubmenu = document.querySelector('.mobile-submenu');
    if (mobileCoursesBtn && mobileSubmenu) {
      mobileCoursesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mobileSubmenu.classList.toggle('is-open');
      });
    }
  }

  // Close menus on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        mobileDrawer.classList.remove('is-open');
        if (mobileToggle) mobileToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      }
      closeAllModals();
    }
  });
}

/**
 * 2. Homepage Hero Carousel Controller (7 Slides, 6-second rotation)
 */
function initHeroCarousel() {
  const carousel = document.querySelector('.hero-slider-section');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-arrow.prev');
  const nextBtn = carousel.querySelector('.carousel-arrow.next');

  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  const autoPlayInterval = 2000;
  let timer = null;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + totalSlides) % totalSlides;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(nextSlide, autoPlayInterval);
  }

  function stopAutoPlay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoPlay();
    });
  });

  // Pause on mouse hover for desktop reading convenience
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Mobile Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      startAutoPlay();
    }
  }, { passive: true });

  // Start rotation
  startAutoPlay();
}

/**
 * 3. Modal Dialogs & WhatsApp Pre-fill Dispatcher
 */
function initModals() {
  // Workshop Interest Buttons
  const workshopBtns = document.querySelectorAll('[data-open-workshop-modal]');
  const workshopModal = document.getElementById('workshop-modal');
  const workshopForm = document.getElementById('workshop-form');

  workshopBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (workshopModal) {
        openModal(workshopModal);
      } else {
        // Fallback directly to WhatsApp
        const msg = encodeURIComponent('Hello BlackGrid Security Labs, I am interested in registering for the Ethical Hacking Hands-on Workshop. Please share the schedule and registration details.');
        window.open(`https://wa.me/919345832928?text=${msg}`, '_blank', 'noopener,noreferrer');
      }
    });
  });

  if (workshopForm) {
    workshopForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('ws-name')?.value.trim() || 'Learner';
      const mode = document.getElementById('ws-mode')?.value || 'Online';
      const phone = document.getElementById('ws-phone')?.value.trim() || '';
      const notes = document.getElementById('ws-notes')?.value.trim() || '';

      let message = `Hello BlackGrid Security Labs,\n\nI want to register my interest for the Ethical Hacking Hands-on Workshop.\n*Name:* ${name}\n*Preferred Mode:* ${mode}`;
      if (phone) message += `\n*Phone:* ${phone}`;
      if (notes) message += `\n*Question/Notes:* ${notes}`;

      const waUrl = `https://wa.me/919345832928?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      closeAllModals();
    });
  }

  // Course Enquiry buttons with custom prefilled messages
  document.querySelectorAll('[data-enquire-course]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseTitle = btn.getAttribute('data-enquire-course') || 'BlackGrid Training Course';
      const message = `Hello BlackGrid Security Labs team,\n\nI would like to enquire about the "${courseTitle}" course. Please share the syllabus, schedule, and enrollment details.`;
      const waUrl = `https://wa.me/919345832928?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  });

  // Blog Reader Modal
  const blogModal = document.getElementById('blog-modal');
  document.querySelectorAll('[data-open-blog]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const blogId = btn.getAttribute('data-open-blog');
      openBlogArticle(blogId);
    });
  });

  // Close modal buttons & background click
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        closeAllModals();
      }
    });
  });
}

function openModal(modalEl) {
  modalEl.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('is-active'));
  document.body.style.overflow = '';
}

/**
 * 4. Blog Article Data & Interactive Reader
 */
const blogArticles = {
  'cybersecurity-start': {
    title: 'How to Start Learning Cybersecurity in 2026',
    category: 'Cybersecurity',
    date: 'April 2026',
    readTime: '6 min read',
    content: `
      <p class="mb-4">Breaking into cybersecurity requires a structured balance between networking fundamentals, systems administration, and hands-on offensive/defensive lab practice.</p>
      <h4 class="text-lg font-bold text-slate-900 mt-6 mb-2">1. Master the Networking Foundations</h4>
      <p class="mb-4">Before defending or breaking systems, you must understand how data moves. Master the TCP/IP stack, DNS resolution, ARP, subnets, and packet flow using Wireshark.</p>
      <h4 class="text-lg font-bold text-slate-900 mt-6 mb-2">2. Linux and Command Line Fluency</h4>
      <p class="mb-4">Over 80% of security tools operate natively on Linux. Build muscle memory in bash, file permissions, process monitoring, and package management on Ubuntu and Kali Linux.</p>
      <h4 class="text-lg font-bold text-slate-900 mt-6 mb-2">3. Ethical Labs and Threat Hunting</h4>
      <p class="mb-4">Set up a local hypervisor environment. Practice attacking vulnerable machines and analyzing SIEM logs (Splunk or Wazuh) to understand detection engineering.</p>
    `
  },
  'fullstack-project': {
    title: 'Build Your First Full-Stack Project from Scratch',
    category: 'Software Development',
    date: 'March 2026',
    readTime: '8 min read',
    content: `
      <p class="mb-4">Modern software engineering emphasizes modularity, secure RESTful APIs, and responsive, component-driven client architecture.</p>
      <h4 class="text-lg font-bold text-slate-900 mt-6 mb-2">Architecture Planning</h4>
      <p class="mb-4">Define your entity relationships, database schema, and endpoint routing before writing single lines of code. Use Postman or OpenAPI specifications to lock in your contract.</p>
      <h4 class="text-lg font-bold text-slate-900 mt-6 mb-2">Version Control & CI/CD</h4>
      <p class="mb-4">Commit early and often with conventional commit messages. Set up automated GitHub Actions to lint, test, and package your code on every pull request.</p>
    `
  },
  'ai-roadmap': {
    title: 'AI and Data Analytics Career Roadmap',
    category: 'Artificial Intelligence',
    date: 'March 2026',
    readTime: '7 min read',
    content: `
      <p class="mb-4">From exploratory data analysis in Pandas to deploying machine learning models and Generative AI pipelines, here is the verified learning roadmap.</p>
      <h4 class="text-lg font-bold text-slate-900 mt-6 mb-2">Core Data Fluency</h4>
      <p class="mb-4">Master SQL queries, Python data structures, statistical analysis, and business intelligence dashboards in Tableau or PowerBI.</p>
      <h4 class="text-lg font-bold text-slate-900 mt-6 mb-2">Applied AI & Automation</h4>
      <p class="mb-4">Learn prompt engineering, retrieval-augmented generation (RAG), and model fine-tuning with strict ethical and data privacy guardrails.</p>
    `
  }
};

function openBlogArticle(blogId) {
  const article = blogArticles[blogId];
  if (!article) return;

  const modal = document.getElementById('blog-modal');
  if (!modal) return;

  const titleEl = document.getElementById('blog-modal-title');
  const metaEl = document.getElementById('blog-modal-meta');
  const bodyEl = document.getElementById('blog-modal-body');

  if (titleEl) titleEl.textContent = article.title;
  if (metaEl) metaEl.textContent = `${article.category} · ${article.date} · ${article.readTime}`;
  if (bodyEl) bodyEl.innerHTML = article.content;

  openModal(modal);
}

/**
 * 5. Live Course Search and Filter for Course Catalog (2-Column Grid)
 */
function initCourseSearch() {
  const searchInput = document.getElementById('course-search-input');
  const courseCards = document.querySelectorAll('.course-card-detailed');
  const filterTabs = document.querySelectorAll('.filter-tab-btn');

  if (!courseCards.length && !filterTabs.length) return;

  function runFilter() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeTab = document.querySelector('.filter-tab-btn.active');
    const selectedCategory = activeTab ? activeTab.getAttribute('data-filter') : 'all';

    let matchCount = 0;

    courseCards.forEach(card => {
      const cardText = card.textContent.toLowerCase();
      const cardCategory = card.getAttribute('data-category') || '';

      const matchesCat = (selectedCategory === 'all' || cardCategory === selectedCategory);
      const matchesQuery = (!query || cardText.includes(query));

      if (matchesCat && matchesQuery) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const emptyNotice = document.getElementById('courses-empty-notice');
    if (emptyNotice) {
      emptyNotice.style.display = matchCount === 0 ? 'block' : 'none';
    }

    const counterNotice = document.getElementById('category-count-badge');
    if (counterNotice) {
      counterNotice.textContent = `${matchCount} courses available`;
    }
  }

  function activateCategory(catKey) {
    if (!catKey) return;
    const cleanKey = catKey.toLowerCase().replace(/[^a-z]/g, '');
    let targetTab = null;

    filterTabs.forEach(tab => {
      const filterVal = tab.getAttribute('data-filter') || '';
      if (filterVal === cleanKey || filterVal.includes(cleanKey) || cleanKey.includes(filterVal)) {
        targetTab = tab;
      }
    });

    if (targetTab) {
      filterTabs.forEach(t => t.classList.remove('active'));
      targetTab.classList.add('active');
      runFilter();
      const catalogSection = document.getElementById('catalog-cards-section');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', runFilter);
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter');
      if (history.replaceState) {
        const url = new URL(window.location);
        url.searchParams.set('category', cat);
        history.replaceState(null, '', url);
      }
      runFilter();
    });
  });

  // Check URL query parameters or hash on load
  const urlParams = new URLSearchParams(window.location.search);
  const paramCat = urlParams.get('category');
  const hashCat = window.location.hash ? window.location.hash.substring(1) : '';

  if (paramCat) {
    activateCategory(paramCat);
  } else if (hashCat) {
    activateCategory(hashCat);
  } else {
    runFilter();
  }
}

/**
 * 6. Dynamic Year in Footer
 */
function initFooterYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}


/**
 * Responsive five-card course carousel:
 * 5 desktop / 4 laptop / 2 tablet / 1 mobile.
 * Advances one card every two seconds and supports arrows + touch swipe.
 */
function initPopularCourseSlider() {
  const root = document.querySelector('[data-carousel="courses"]');
  if (!root) return;
  const viewport = root.querySelector('.course-slider-viewport');
  const track = root.querySelector('.course-slider-track');
  const cards = Array.from(track ? track.children : []);
  const prev = root.querySelector('.slider-arrow.prev');
  const next = root.querySelector('.slider-arrow.next');
  if (!viewport || !track || cards.length < 2) return;

  let index = 0;
  let timer = null;
  let startX = 0;
  let endX = 0;
  const originalCount = Math.floor(cards.length / 2);
  const gap = () => parseFloat(getComputedStyle(track).gap || 18);
  const perView = () => window.matchMedia('(max-width:560px)').matches ? 1 :
    window.matchMedia('(max-width:820px)').matches ? 2 :
    window.matchMedia('(max-width:1100px)').matches ? 4 : 5;
  const step = () => {
    const card = track.querySelector('.slider-course-card');
    return card ? card.getBoundingClientRect().width + gap() : 0;
  };
  function render() {
    track.style.transform = `translate3d(${-index * step()}px,0,0)`;
  }
  function advance() {
    index += 1;
    if (index >= originalCount) {
      // Seamlessly reset after the duplicated set is reached.
      render();
      window.setTimeout(() => {
        track.style.transition = 'none';
        index = 0;
        render();
        requestAnimationFrame(() => requestAnimationFrame(() => {
          track.style.transition = '';
        }));
      }, 660);
    } else render();
  }
  function back() {
    if (index <= 0) {
      track.style.transition = 'none';
      index = originalCount;
      render();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        track.style.transition = '';
        index = originalCount - 1;
        render();
      }));
    } else {
      index -= 1;
      render();
    }
  }
  function stop() { if (timer) window.clearInterval(timer); timer = null; }
  function start() { stop(); timer = window.setInterval(advance, 2000); }

  if (next) next.addEventListener('click', () => { advance(); start(); });
  if (prev) prev.addEventListener('click', () => { back(); start(); });
  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);
  viewport.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; stop(); }, {passive:true});
  viewport.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    const delta = startX - endX;
    if (Math.abs(delta) > 35) delta > 0 ? advance() : back();
    start();
  }, {passive:true});
  window.addEventListener('resize', render, {passive:true});
  render();
  start();
}
