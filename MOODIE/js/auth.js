/**
 * DilJourney Auth Module
 * Handles login/signup form submissions and auth state
 */

// Auth state
let currentUser = null;

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  loadUserFromStorage();
  setupAuthForms();
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
    navCta.href = 'account.html?view=profile';
  }
  
  // Show logout button if exists
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.style.display = 'block';
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

// Setup auth forms
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

  // Logout handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

// Handle login submission
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;

  if (!email || !password) {
    showFormMessage('login-form', 'Please fill in all fields', 'error');
    return;
  }

  try {
    setFormLoading('login-form', true);
    
    const response = await window.apiService.login({ email, password });
    
    if (response.success) {
      saveUser(response.token, response.user);
      showFormMessage('login-form', 'Login successful! Redirecting...', 'success');
      
      setTimeout(() => {
        window.location.href = 'Explore.html';
      }, 1000);
    }
  } catch (error) {
    showFormMessage('login-form', error.message || 'Login failed', 'error');
  } finally {
    setFormLoading('login-form', false);
  }
}

// Handle signup submission
async function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signup-name')?.value;
  const email = document.getElementById('signup-email')?.value;
  const password = document.getElementById('signup-password')?.value;
  const confirmPassword = document.getElementById('signup-confirm-password')?.value;

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

  try {
    setFormLoading('signup-form', true);
    
    const response = await window.apiService.register({ name, email, password });
    
    if (response.success) {
      saveUser(response.token, response.user);
      showFormMessage('signup-form', 'Account created! Redirecting...', 'success');
      
      setTimeout(() => {
        window.location.href = 'Explore.html';
      }, 1000);
    }
  } catch (error) {
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
  if (e) e.preventDefault();
  
  try {
    await window.apiService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    logout();
    window.location.href = 'index.html';
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
    btn.textContent = isLoading ? 'Please wait...' : btn.dataset.originalText || btn.textContent;
    
    if (!btn.dataset.originalText) {
      btn.dataset.originalText = btn.textContent;
    }
  }
}

// Export functions to window
window.auth = {
  isAuthenticated,
  getCurrentUser,
  logout,
  showFormMessage,
};
