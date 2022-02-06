const { name: packageName } = require('./package.json');

module.exports = {
  name: packageName,
  displayName: packageName,
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  testMatch: ['<rootDir>/src/**/__tests__/*.{ts,tsx}'],
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
