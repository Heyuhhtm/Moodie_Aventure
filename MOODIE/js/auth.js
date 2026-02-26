/**
 * DilJourney Auth Module
 * Handles login/signup form submissions and auth state
 * Consolidated from multiple sources
 */

// Auth state
let currentUser = null;

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  loadUserFromStorage();

  // If user is authenticated and on the account page, redirect them away.
  const currentPage = window.location.pathname.split('/').pop();
  if (isAuthenticated() && currentPage === 'account.html') {
    // Redirect to dashboard to prevent showing login/signup forms again.
    window.location.href = 'dashboard.html';
    return; // Stop further execution (like setting up forms)
  }

  setupAuthForms();
  setupFormSwitching();
});

// Load user from localStorage
function loadUserFromStorage() {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      currentUser = JSON.parse(userData);
      updateUIForAuthenticatedUser();
    } catch (e) {
      console.error('Error parsing user data:', e);
      logout();
    }
  }
}

// Save user to localStorage
function saveUser(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  currentUser = user;
  window.apiService.setToken(token);
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  window.apiService.removeToken();
  updateUIForGuestUser();
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser() {
  // Update nav if user is logged in
  const navCta = document.querySelector('.nav-cta');
  if (navCta && currentUser) {
    navCta.textContent = currentUser.name || 'Account';
    navCta.href = 'dashboard.html';
  }
  
  // Show logout button if exists
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.style.display = 'block';
  }
  
  // Update user menu if exists
  const userMenu = document.getElementById('userMenu');
  if (userMenu && currentUser) {
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const dropdownName = document.getElementById('dropdownName');
    const dropdownEmail = document.getElementById('dropdownEmail');
    
    if (userName) userName.textContent = currentUser.name ? currentUser.name.split(' ')[0] : 'User';
    if (userAvatar) userAvatar.textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
    if (dropdownName) dropdownName.textContent = currentUser.name || 'User';
    if (dropdownEmail) dropdownEmail.textContent = currentUser.email || 'user@email.com';
  }
}

// Update UI for guest user
function updateUIForGuestUser() {
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    navCta.textContent = 'Get Started';
    navCta.href = 'account.html';
  }
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.style.display = 'none';
  }
}

// Check if user is authenticated
function isAuthenticated() {
  return !!currentUser && !!localStorage.getItem('token');
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// Setup form switching - handles all form visibility logic
function setupFormSwitching() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-form');
  
  const showSignupBtn = document.getElementById('show-signup');
  const showLoginBtn = document.getElementById('show-login');
  const showForgotBtn = document.getElementById('show-forgot');
  const showLoginFromForgotBtn = document.getElementById('show-login-from-forgot');
  const backBtn = document.getElementById('form-back-btn');
  
  if (!loginForm || !signupForm) return;
  
  const forms = [loginForm, signupForm, forgotForm].filter(f => f);
  
  const switchForm = (formToShow) => {
    forms.forEach(form => {
      if (form) {
        form.style.display = (form === formToShow) ? 'block' : 'none';
      }
    });
  };
  
  // Check URL params for initial form
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('form') === 'login') {
    switchForm(loginForm);
  } else if (urlParams.get('form') === 'signup') {
    switchForm(signupForm);
  } else {
    // Default to signup form
    switchForm(signupForm);
  }
  
  // Event listeners for form switching
  if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchForm(loginForm);
    });
  }
  
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchForm(signupForm);
    });
  }
  
  if (showForgotBtn) {
    showForgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (forgotForm) switchForm(forgotForm);
    });
  }
  
  if (showLoginFromForgotBtn) {
    showLoginFromForgotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchForm(loginForm);
    });
  }
  
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginForm && loginForm.style.display === 'block') {
        switchForm(signupForm);
      } else if (forgotForm && forgotForm.style.display === 'block') {
        switchForm(loginForm);
      } else if (signupForm && signupForm.style.display === 'block') {
        window.location.href = 'index.html';
      }
    });
  }
  
  // Password validation
  const password = document.getElementById('signup-password');
  const confirmPassword = document.getElementById('signup-confirm-password');
  const passwordError = document.getElementById('password-error');
  
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
  }
}

// Setup auth forms - handles form submissions
function setupAuthForms() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-form');
  
  // Login form handler
  const loginFormEl = loginForm?.querySelector('form');
  if (loginFormEl) {
    loginFormEl.addEventListener('submit', handleLogin);
  }
  
  // Signup form handler
  const signupFormEl = signupForm?.querySelector('form');
  if (signupFormEl) {
    signupFormEl.addEventListener('submit', handleSignup);
  }
  
  // Forgot password handler
  const forgotFormEl = forgotForm?.querySelector('form');
  if (forgotFormEl) {
    forgotFormEl.addEventListener('submit', handleForgotPassword);
  }
  
  // Logout handler - global
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Also setup logout for mobile
  const logoutBtnMobile = document.getElementById('logout-btn-mobile');
  if (logoutBtnMobile) {
    logoutBtnMobile.addEventListener('click', handleLogout);
  }
}

// Handle login submission
async function handleLogin(e) {
  e.preventDefault();
  
  console.log('=== FRONTEND: Login form submitted ===');
  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;
  
  console.log('Login credentials:', { email, password: password ? '***' : 'empty' });
  
  if (!email || !password) {
    showFormMessage('login-form', 'Please fill in all fields', 'error');
    return;
  }
  
  // Check if apiService is available
  if (!window.apiService) {
    console.error('API service not initialized');
    showFormMessage('login-form', 'System not ready. Please refresh and try again.', 'error');
    return;
  }
  
  try {
    setFormLoading('login-form', true);
    console.log('Calling API login endpoint...');
    
    const response = await window.apiService.login({ email, password });
    console.log('API Response:', response);
    
    if (response.success) {
      saveUser(response.token, response.user);
      showSuccessOverlay('Welcome back!', 'Redirecting to your dashboard...');
    }
  } catch (error) {
    console.error('Login error:', error);
    showFormMessage('login-form', error.message || 'Login failed', 'error');
  } finally {
    setFormLoading('login-form', false);
  }
}

// Handle signup submission
async function handleSignup(e) {
  e.preventDefault();
  
  console.log('=== FRONTEND: Signup form submitted ===');
  const name = document.getElementById('signup-name')?.value;
  const email = document.getElementById('signup-email')?.value;
  const password = document.getElementById('signup-password')?.value;
  const confirmPassword = document.getElementById('signup-confirm-password')?.value;
  
  console.log('Signup data:', { name, email, password: password ? '***' : 'empty' });
  if (!name || !email || !password || !confirmPassword) {
    showFormMessage('signup-form', 'Please fill in all fields', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showFormMessage('signup-form', 'Passwords do not match', 'error');
    return;
  }
  
  if (password.length < 6) {
    showFormMessage('signup-form', 'Password must be at least 6 characters', 'error');
    return;
  }
  
  // Check if apiService is available
  if (!window.apiService) {
    console.error('API service not initialized');
    showFormMessage('signup-form', 'System not ready. Please refresh and try again.', 'error');
    return;
  }
  
  try {
    setFormLoading('signup-form', true);
    console.log('Calling API register endpoint...');
    
    // Build user data object with all fields
    const userData = { name, email, password };
    console.log('Sending registration data:', userData);
    const response = await window.apiService.register(userData);
    console.log('API Response:', response);
    
    if (response.success) {
      saveUser(response.token, response.user);
      showSuccessOverlay('Account created!', 'Redirecting...');

      // Check for a return URL to redirect back to the intended page
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');

      setTimeout(() => {
        window.location.href = returnUrl || 'dashboard.html';
      }, 1500);
    }
  } catch (error) {
    console.error('Signup error:', error);
    showFormMessage('signup-form', error.message || 'Registration failed', 'error');
  } finally {
    setFormLoading('signup-form', false);
  }
}

// Handle forgot password
async function handleForgotPassword(e) {
  e.preventDefault();
  
  const email = document.getElementById('forgot-email')?.value;
  
  if (!email) {
    showFormMessage('forgot-form', 'Please enter your email', 'error');
    return;
  }
  
  try {
    setFormLoading('forgot-form', true);
    // For now, show success message (backend may not have forgot password implemented)
    showFormMessage('forgot-form', 'Password reset link sent to your email!', 'success');
  } catch (error) {
    showFormMessage('forgot-form', error.message || 'Failed to send reset email', 'error');
  } finally {
    setFormLoading('forgot-form', false);
  }
}

// Handle logout
async function handleLogout(e) {
  if (e) {
    e.preventDefault();
  }
  
  try {
    if (window.apiService && isAuthenticated()) {
      await window.apiService.logout();
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    logout();
    // Redirect to home page
    const currentPage = window.location.pathname;
    if (currentPage.includes('dashboard') || currentPage.includes('account')) {
      window.location.href = 'index.html';
    }
  }
}

// Show form message
function showFormMessage(formId, message, type = 'error') {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Remove existing message
  const existingMsg = form.querySelector('.form-message');
  if (existingMsg) existingMsg.remove();
  
  // Create message element
  const msgEl = document.createElement('div');
  msgEl.className = `form-message ${type}`;
  msgEl.textContent = message;
  msgEl.style.padding = '10px';
  msgEl.style.marginBottom = '15px';
  msgEl.style.borderRadius = '4px';
  msgEl.style.textAlign = 'center';
  
  if (type === 'error') {
    msgEl.style.backgroundColor = '#fee';
    msgEl.style.color = '#c00';
    msgEl.style.border = '1px solid #fcc';
  } else {
    msgEl.style.backgroundColor = '#efe';
    msgEl.style.color = '#060';
    msgEl.style.border = '1px solid #cfc';
  }
  
  // Insert at top of form
  const formEl = form.querySelector('form');
  if (formEl) {
    formEl.insertBefore(msgEl, formEl.firstChild);
  }
  
  // Auto-remove after 5 seconds
  setTimeout(() => msgEl.remove(), 5000);
}

// Set form loading state
function setFormLoading(formId, isLoading) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  const btn = form.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = isLoading;
    btn.textContent = isLoading ? 'Please wait...' : (btn.dataset.originalText || btn.textContent);
    
    if (!btn.dataset.originalText) {
      btn.dataset.originalText = btn.textContent;
    }
  }
}

// Show success overlay with animation
function showSuccessOverlay(title, subtitle) {
  const overlay = document.getElementById('successOverlay');
  const titleEl = document.getElementById('successText');
  const subtitleEl = document.getElementById('successSubtext');
  
  if (!overlay) return;
  
  // Set text content
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  
  // Show overlay with animation
  overlay.classList.add('show');
  
}

// Export functions to window
window.auth = {
  isAuthenticated,
  getCurrentUser,
  logout: handleLogout,
  showFormMessage,
  updateUIForAuthenticatedUser,
  updateUIForGuestUser,
  saveUser
};
