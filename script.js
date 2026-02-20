const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
if (hamburger && mobileMenu && mobileClose) {
  const toggleMenu = (isOpen) => {
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
  };
  hamburger.addEventListener('click', () => toggleMenu(true));
  mobileClose.addEventListener('click', () => toggleMenu(false));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
}

document.querySelectorAll('.mood-pill').forEach(pill => {
  pill.addEventListener('click', function() {
    document.querySelectorAll('.mood-pill').forEach(p => p.style.outline = '');
    const activeColor = getComputedStyle(this).color;
    this.style.outline = `2px solid ${activeColor}`;
    this.style.outlineOffset = '3px';
  });
});

let lastScroll = 0;
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 80) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    lastScroll = current <= 0 ? 0 : current;
  });
  nav.style.transition = 'transform 0.35s ease';
}

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotForm = document.getElementById('forgot-form');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const showForgotBtn = document.getElementById('show-forgot');
const showLoginFromForgotBtn = document.getElementById('show-login-from-forgot');
const backBtn = document.getElementById('form-back-btn');

const password = document.getElementById('signup-password');
const confirmPassword = document.getElementById('signup-confirm-password');
const passwordError = document.getElementById('password-error');

if (loginForm && signupForm && forgotForm && showSignupBtn && showLoginBtn && showForgotBtn && showLoginFromForgotBtn && backBtn) {
  const forms = [loginForm, signupForm, forgotForm];

  const switchForm = (formToShow) => {
    forms.forEach(form => {
      form.style.display = (form === formToShow) ? 'block' : 'none';
    });
  };

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('form') === 'login') {
    switchForm(loginForm);
  } else {
    switchForm(signupForm);
  }

  showLoginBtn.addEventListener('click', (e) => { e.preventDefault(); switchForm(loginForm); });
  showLoginFromForgotBtn.addEventListener('click', (e) => { e.preventDefault(); switchForm(loginForm); });
  showSignupBtn.addEventListener('click', (e) => { e.preventDefault(); switchForm(signupForm); });
  showForgotBtn.addEventListener('click', (e) => { e.preventDefault(); switchForm(forgotForm); });

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginForm.style.display === 'block') {
      switchForm(signupForm);
    } else if (forgotForm.style.display === 'block') {
      switchForm(loginForm);
    } else if (signupForm.style.display === 'block') {
      window.location.href = 'index.html';
    }
  });

  if (password && confirmPassword && passwordError) {
    const validatePassword = () => {
      if (password.value !== confirmPassword.value && confirmPassword.value.length > 0) {
        passwordError.style.display = 'block';
        confirmPassword.setCustomValidity("Passwords Don't Match");
      } else {
        passwordError.style.display = 'none';
        confirmPassword.setCustomValidity('');
      }
    };

    password.addEventListener('change', validatePassword);
    confirmPassword.addEventListener('keyup', validatePassword);

    signupForm.querySelector('form').addEventListener('submit', validatePassword);
  }
}

// Contact Form Logic with EmailJS
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const statusDiv = document.getElementById('contact-form-status');
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
}
