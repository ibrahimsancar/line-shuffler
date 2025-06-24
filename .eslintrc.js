module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Code Quality
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'error',
    
    // Best Practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // Style
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    
    // Modern JavaScript
    'prefer-template': 'error',
    'prefer-destructuring': ['error', {
      'array': true,
      'object': true
    }],
    'object-shorthand': 'error',
    
    // Electron specific
    'no-process-exit': 'off', // Electron main process needs this
  },
  overrides: [
    {
      // Main process files
      files: ['src/main.js'],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        'no-console': 'off', // Allow console in main process
      }
    },
    {
      // Renderer process files
      files: ['src/renderer/**/*.js'],
      env: {
        browser: true,
        node: false,
      },
      globals: {
        'require': 'readonly',
        'module': 'readonly',
        'exports': 'readonly',
      }
    }
  ]
}; 