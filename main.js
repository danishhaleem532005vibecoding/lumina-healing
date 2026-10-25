/**
 * Lumina Healing - Main JavaScript
 * Hypnotherapy & Holistic Healing - Founded by Ellen Hanley
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initTestimonialsCarousel();
  initFaqAccordion();
  initContactForm();
  initScrollReveal();
  initDynamicYear();
  initPrivacyModal();
});

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-nav-item, .drawer-cta a');

  if (!menuToggle || !drawer || !backdrop) return;

  const openDrawer = () => {
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    backdrop.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. SMOOTH SCROLL WITH HEADER OFFSET
   ========================================================================== */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"]):not([href="#0"])');
  const header = document.querySelector('.site-header');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#modal-') || targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 5;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   4. TESTIMONIALS CAROUSEL
   ========================================================================== */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');
  const dotsContainer = document.getElementById('testimonialDots');
  const slides = document.querySelectorAll('.testimonial-card-slide');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getVisibleCount = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const getMaxIndex = () => {
    const visible = getVisibleCount();
    return Math.max(0, slides.length - visible);
  };

  const createDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === currentIndex ? 'is-active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  };

  const goToSlide = (index) => {
    const maxIdx = getMaxIndex();
    if (index < 0) {
      currentIndex = maxIdx;
    } else if (index > maxIdx) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const visible = getVisibleCount();
    const slideWidthPercentage = 100 / visible;
    track.style.transform = `translateX(-${currentIndex * slideWidthPercentage}%)`;
    updateDots();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoplay();
    });
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resetAutoplay();
  }, { passive: true });

  const handleSwipe = () => {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  };

  // Autoplay with Hover / Focus Pause
  const startAutoplay = () => {
    if (isReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  const carouselWrap = document.querySelector('.testimonials-carousel-wrapper');
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', stopAutoplay);
    carouselWrap.addEventListener('mouseleave', startAutoplay);
    carouselWrap.addEventListener('focusin', stopAutoplay);
    carouselWrap.addEventListener('focusout', startAutoplay);
  }

  // Window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      createDots();
      goToSlide(Math.min(currentIndex, getMaxIndex()));
    }, 150);
  });

  createDots();
  startAutoplay();
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    if (!button || !panel) return;

    button.addEventListener('click', () => {
      const isCurrentlyOpen = item.classList.contains('is-open');

      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('is-open');
        const otherBtn = otherItem.querySelector('.faq-question-btn');
        const otherPanel = otherItem.querySelector('.faq-answer-panel');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherPanel) otherPanel.style.maxHeight = null;
      });

      // If clicked one wasn't open, open it
      if (!isCurrentlyOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   6. CONTACT & APPOINTMENT ENQUIRY FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('appointmentForm');
  const whatsappSubmitBtn = document.getElementById('submitWhatsAppBtn');
  const directSubmitBtn = document.getElementById('submitDirectBtn');
  const successBanner = document.getElementById('formSuccessBanner');

  if (!form) return;

  const validate = () => {
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const messageInput = document.getElementById('clientMessage');

    let isValid = true;

    // Name validation
    if (!nameInput.value.trim()) {
      showError('nameError', 'Please enter your name.');
      isValid = false;
    } else {
      hideError('nameError');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError('emailError', 'Please enter a valid email address.');
      isValid = false;
    } else {
      hideError('emailError');
    }

    // Message validation
    if (!messageInput.value.trim()) {
      showError('messageError', 'Please write a brief message or question.');
      isValid = false;
    } else {
      hideError('messageError');
    }

    return isValid;
  };

  const showError = (id, msg) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = msg;
      el.classList.add('is-visible');
    }
  };

  const hideError = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('is-visible');
    }
  };

  // Submit via WhatsApp
  if (whatsappSubmitBtn) {
    whatsappSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validate()) return;

      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const service = document.getElementById('clientService').value;
      const message = document.getElementById('clientMessage').value.trim();

      const text = `Hello Ellen,\n\nI would like to enquire about Lumina Healing.\n\nName: ${name}\nEmail: ${email}\nArea of Interest: ${service}\nMessage: ${message}`;
      
      const whatsappUrl = `https://wa.me/353873662435?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      if (successBanner) {
        successBanner.textContent = 'Opening WhatsApp with your enquiry details. Thank you, Ellen will be in touch shortly!';
        successBanner.classList.add('is-active');
      }
    });
  }

  // Submit Direct Form
  if (directSubmitBtn) {
    directSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!validate()) return;

      if (successBanner) {
        successBanner.textContent = 'Thank you for your enquiry. We have received your message and Ellen Hanley will respond to you soon!';
        successBanner.classList.add('is-active');
        form.reset();
      }
    });
  }
}

/* ==========================================================================
   7. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (isReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
function initDynamicYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   9. PRIVACY POLICY MODAL
   ========================================================================== */
function initPrivacyModal() {
  const openBtn = document.getElementById('openPrivacyModal');
  const closeBtn = document.getElementById('closePrivacyModal');
  const overlay = document.getElementById('privacyModal');

  if (!openBtn || !closeBtn || !overlay) return;

  const openModal = () => {
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    openBtn.focus();
  };

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) {
      closeModal();
    }
  });
}
