// Jest setup file
// This file runs before each test

// Mock Electron APIs for renderer tests
global.require = jest.fn();

// Mock IPC renderer
const mockIpcRenderer = {
  invoke: jest.fn(),
  send: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
};

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    readText: jest.fn(),
    writeText: jest.fn(),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock DOM methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock timers
jest.useFakeTimers();

// Set timeout for async tests
jest.setTimeout(10000);

// Global test helpers
global.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock require function for Electron modules
global.mockElectron = {
  ipcRenderer: mockIpcRenderer,
};

// Setup DOM environment
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable',
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
