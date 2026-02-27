/**
 * DilJourney API Service
 * Centralized API calls to backend
 * 
 * For Production: Update the API_BASE_URL to your production backend URL
 * Example: 'https://your-backend.onrender.com/api'
 */

// Base URL is derived from config.js or defaults to localhost for development.
const API_BASE_URL = (window.APP_CONFIG?.apiUrl || 'http://localhost:5000') + '/api';
const IS_DEVELOPMENT = !window.APP_CONFIG?.apiUrl;

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Get auth headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Set token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Generic request handler
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    if (IS_DEVELOPMENT) {
      console.log('=== API REQUEST ===');
      console.log('URL:', url);
      console.log('Method:', options.method || 'GET');
      console.log('Body:', options.body);
    }
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };
    if (IS_DEVELOPMENT) {
      console.log('Headers:', config.headers);
    }

    try {
      if (IS_DEVELOPMENT) console.log('Sending request...');
      const response = await fetch(url, config);
      const data = await response.json();

      if (IS_DEVELOPMENT) {
        console.log('Response status:', response.status);
        console.log('Response data:', data);
      }

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
          localStorage.removeItem('user');
          if (window.showToast) window.showToast('Session expired. Please log in again.', 'error');
        }
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      // Only log detailed errors in development
      if (IS_DEVELOPMENT) console.error('API Error:', error);

      // Don't show toast for initial 401 on restricted pages if not user-initiated
      if (window.showToast && !error.message.includes('No token')) {
        window.showToast(error.message || 'Network Error', 'error');
      }
      throw error;
    }
  }

  // ─── Auth API ─────────────────────────────────────
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.removeToken();
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ─── Venues API ───────────────────────────────────
  async getVenues(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/venues${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getVenueById(id) {
    return this.request(`/venues/${id}`);
  }

  async getVenuesByMood(mood) {
    return this.request(`/venues/mood/${mood}`);
  }

  async getCities() {
    return this.request('/venues/cities');
  }

  // ─── Reviews API ──────────────────────────────────
  async getVenueReviews(venueId) {
    return this.request(`/reviews/venue/${venueId}`);
  }

  async createReview(venueId, reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ venueId, ...reviewData }),
    });
  }

  // ─── Profile API ──────────────────────────────────
  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getSavedVenues() {
    return this.request('/profile/saved-venues');
  }

  async getMyReviews() {
    return this.request('/profile/my-reviews');
  }

  async saveVenue(venueId) {
    return this.request('/profile/save-venue', {
      method: 'POST',
      body: JSON.stringify({ venueId }),
    });
  }

  async unsaveVenue(venueId) {
    return this.request(`/profile/saved-venues/${venueId}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
window.apiService = new ApiService();
