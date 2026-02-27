/**
 * DilJourney Configuration
 * Update this file for production deployment
 */

window.APP_CONFIG = {
  // Automatically determine if we're on localhost or a deployed environment
  apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://diljourney-backend.onrender.com'
};
