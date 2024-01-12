import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

/** @type {import('jest').Config} */
const config = {
  displayName: pkg.name,
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
  prettierPath: require.resolve('prettier-2'),
};

export default config;
