// Utility function for throttling
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Image lazy loading with smooth fade-in and skeleton handling
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.mood-card img');
  
  // Function to handle image load completion
  const handleImageLoad = (img) => {
    img.classList.add('loaded');
    // Hide the skeleton when image loads
    const wrapper = img.closest('.mood-card-img-wrapper');
    if (wrapper) {
      const skeleton = wrapper.querySelector('.mood-card-img-skeleton');
      if (skeleton) {
        skeleton.classList.add('hidden');
      }
    }
  };
  
  images.forEach(img => {
    // If image is already loaded (from cache)
    if (img.complete && img.naturalWidth !== 0) {
      handleImageLoad(img);
    } else {
      // Wait for image to load
      img.addEventListener('load', () => handleImageLoad(img));
      // Handle error case - hide skeleton anyway
      img.addEventListener('error', () => handleImageLoad(img));
    }
  });
  
  // IntersectionObserver for images - preload before they come into viewport
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // If data-src is set, use it (for progressive loading)
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          // Remove lazy attribute after first observation
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px', // Start loading 100px before visible
      threshold: 0
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
});

// Optimized IntersectionObserver with rootMargin for better lazy loading
const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { 
      if (e.isIntersecting) { 
        e.target.classList.add('visible'); 
        obs.unobserve(e.target); 
      } 
    });
  }, { 
    threshold: 0.12,
    rootMargin: '0px 0px 50px 0px' // Start loading 50px before element is visible
  });
  reveals.forEach(r => obs.observe(r));
}

// Mobile Menu Toggle - Consolidated
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function setupMobileMenu() {
  if (hamburger && mobileMenu && mobileClose) {
    const toggleMenu = (isOpen) => {
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.classList.toggle('open', isOpen);
    };
    hamburger.addEventListener('click', () => toggleMenu(true));
    mobileClose.addEventListener('click', () => toggleMenu(false));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  }
}

setupMobileMenu();

// Mood pill selection - Only on index page
document.querySelectorAll('.mood-pill').forEach(pill => {
  pill.addEventListener('click', function() {
    document.querySelectorAll('.mood-pill').forEach(p => p.style.outline = '');
    const activeColor = getComputedStyle(this).color;
    this.style.outline = `2px solid ${activeColor}`;
    this.style.outlineOffset = '3px';
  });
});

// Nav scroll behavior
let lastScroll = 0;
const nav = document.querySelector('nav');
let navHidden = false;

if (nav) {
  // Throttled scroll handler - only runs every 100ms max
  const handleScroll = throttle(() => {
    const current = window.scrollY;
    if (current > lastScroll && current > 80 && !navHidden) {
      nav.style.transform = 'translateY(-100%)';
      navHidden = true;
    } else if (current <= lastScroll && navHidden) {
      nav.style.transform = 'translateY(0)';
      navHidden = false;
    }
    lastScroll = current <= 0 ? 0 : current;
  }, 100);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  nav.style.transition = 'transform 0.35s ease';
}

// Account page form switching - Consolidated to auth.js
// This section is now handled by js/auth.js for better code organization

// Contact Form Logic with EmailJS - Only on contact page
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const statusDiv = document.getElementById('contact-form-status');
  
  // Check if emailjs is loaded
  if (typeof emailjs !== 'undefined') {
    emailjs.init('XK5pYs1BHTtUTzA5R');

    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      statusDiv.innerHTML = '';
      statusDiv.className = '';

      const serviceID = 'service_2t5by0a';
      const templateID = 'template_qyro8xz';

      emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
          submitBtn.innerHTML = 'Message Sent!';
          statusDiv.innerHTML = 'Thank you! Your message has been sent successfully.';
          statusDiv.className = 'success';
          contactForm.reset();
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            statusDiv.innerHTML = '';
          }, 5000);
        }, (err) => {
          submitBtn.innerHTML = 'Send Failed';
          statusDiv.innerHTML = 'Sorry, something went wrong. Please try again.';
          statusDiv.className = 'error';
          console.error('EmailJS send failed:', err);
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            statusDiv.innerHTML = '';
          }, 5000);
        });
    });
  } else {
    console.warn('EmailJS not loaded - contact form will not work');
  }
}

// Export utility functions for use in other scripts
window.dilJourneyUtils = {
  throttle,
  setupMobileMenu
};
