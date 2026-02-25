/**
 * DilJourney API Service
 * Centralized API calls to backend
 * 
 * For Production: Update the API_BASE_URL to your production backend URL
 * Example: 'https://your-backend.onrender.com/api'
 */

// Dynamic API URL based on environment
// For production, replace with your live backend URL
const API_BASE_URL = (() => {
  // Check for window.APP_CONFIG (set by frontend in production)
  if (typeof window !== 'undefined' && window.APP_CONFIG && window.APP_CONFIG.apiUrl) {
    return window.APP_CONFIG.apiUrl + '/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api';
})();

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
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
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

  async saveVenue(venueId) {
    return this.request('/profile/save-venue', {
      method: 'POST',
      body: JSON.stringify({ venueId }),
    });
  }

  async removeSavedVenue(venueId) {
    return this.request('/profile/remove-venue', {
      method: 'POST',
      body: JSON.stringify({ venueId }),
    });
  }
}

// Export singleton instance
window.apiService = new ApiService();
