module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Collect coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js', // Exclude Electron main process
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Test patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module paths
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/out/'
  ],

  // Verbose output
  verbose: true,

  // Error handling
  errorOnDeprecated: true,

  // Timeouts
  testTimeout: 10000,

  // Transform
  transform: {
    '^.+\\.js$': 'babel-jest'
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'json'],

  // Clear mocks
  clearMocks: true,
  restoreMocks: true,

  // Threshold
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
