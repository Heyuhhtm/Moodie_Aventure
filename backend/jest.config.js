process.env.NODE_ENV = 'test';

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!**/tests/**',
    '!**/seed.js'
  ],
  testTimeout: 30000,
};
