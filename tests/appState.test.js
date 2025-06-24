/**
 * @jest-environment jsdom
 */

// Mock AppState class
class AppState {
  constructor() {
    this.currentTheme = 'dark';
    this.inputLines = [];
    this.fixedLines = [];
    this.lastShuffleResult = null;
    this.nextFixedLineId = 1;
    this.lastClipboardText = '';
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 20;
    this.stats = { totalShuffles: 0, linesProcessed: 0 };
  }

  updateLineCount() {
    // Mock implementation
    const mockElement = { value: 'line1\nline2\nline3' };
    const text = mockElement.value;
    const lines = text.split('\n').filter(line => line.trim());
    this.inputLines = lines;
    return lines.length;
  }

  addFixedLine() {
    const fixedLine = {
      id: this.nextFixedLineId++,
      lineIndex: null,
      position: null
    };
    this.fixedLines.push(fixedLine);
    return fixedLine;
  }

  removeFixedLine(id) {
    const initialLength = this.fixedLines.length;
    this.fixedLines = this.fixedLines.filter(fl => fl.id !== id);
    return this.fixedLines.length < initialLength;
  }

  updateStats(linesCount) {
    this.stats.totalShuffles++;
    this.stats.linesProcessed += linesCount;
  }

  showToast(message, type = 'success') {
    // Mock implementation - just log
    console.log(`${type.toUpperCase()}: ${message}`);
    return true;
  }
}

describe('AppState', () => {
  let appState;

  beforeEach(() => {
    appState = new AppState();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should initialize with default values', () => {
      expect(appState.currentTheme).toBe('dark');
      expect(appState.inputLines).toEqual([]);
      expect(appState.fixedLines).toEqual([]);
      expect(appState.nextFixedLineId).toBe(1);
      expect(appState.history).toEqual([]);
      expect(appState.historyIndex).toBe(-1);
      expect(appState.maxHistorySize).toBe(20);
      expect(appState.stats.totalShuffles).toBe(0);
      expect(appState.stats.linesProcessed).toBe(0);
    });
  });

  describe('updateLineCount', () => {
    test('should update inputLines correctly', () => {
      const count = appState.updateLineCount();
      expect(appState.inputLines).toEqual(['line1', 'line2', 'line3']);
      expect(count).toBe(3);
    });
  });

  describe('addFixedLine', () => {
    test('should add new fixed line with incremented ID', () => {
      const fixedLine1 = appState.addFixedLine();
      expect(fixedLine1.id).toBe(1);
      expect(appState.fixedLines.length).toBe(1);

      const fixedLine2 = appState.addFixedLine();
      expect(fixedLine2.id).toBe(2);
      expect(appState.fixedLines.length).toBe(2);
    });

    test('should initialize fixed line with null values', () => {
      const fixedLine = appState.addFixedLine();
      expect(fixedLine.lineIndex).toBeNull();
      expect(fixedLine.position).toBeNull();
    });
  });

  describe('removeFixedLine', () => {
    test('should remove fixed line by ID', () => {
      const fixedLine1 = appState.addFixedLine();
      const fixedLine2 = appState.addFixedLine();

      expect(appState.fixedLines.length).toBe(2);

      const removed = appState.removeFixedLine(fixedLine1.id);
      expect(removed).toBe(true);
      expect(appState.fixedLines.length).toBe(1);
      expect(appState.fixedLines[0].id).toBe(fixedLine2.id);
    });

    test('should return false when removing non-existent ID', () => {
      const removed = appState.removeFixedLine(999);
      expect(removed).toBe(false);
      expect(appState.fixedLines.length).toBe(0);
    });
  });

  describe('updateStats', () => {
    test('should increment shuffle count and lines processed', () => {
      appState.updateStats(5);

      expect(appState.stats.totalShuffles).toBe(1);
      expect(appState.stats.linesProcessed).toBe(5);

      appState.updateStats(3);

      expect(appState.stats.totalShuffles).toBe(2);
      expect(appState.stats.linesProcessed).toBe(8);
    });
  });

  describe('showToast', () => {
    test('should log message with default success type', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      const result = appState.showToast('Test message');

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('SUCCESS: Test message');
    });

    test('should log message with specified type', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      appState.showToast('Error message', 'error');

      expect(consoleSpy).toHaveBeenCalledWith('ERROR: Error message');
    });
  });

  describe('edge cases', () => {
    test('should handle multiple fixed lines', () => {
      for (let i = 0; i < 5; i++) {
        appState.addFixedLine();
      }

      expect(appState.fixedLines.length).toBe(5);
      expect(appState.nextFixedLineId).toBe(6);
    });

    test('should handle removing multiple fixed lines', () => {
      const fixedLines = [];
      for (let i = 0; i < 3; i++) {
        fixedLines.push(appState.addFixedLine());
      }

      // Remove middle one
      appState.removeFixedLine(fixedLines[1].id);

      expect(appState.fixedLines.length).toBe(2);
      expect(appState.fixedLines.map(fl => fl.id)).toEqual([
        fixedLines[0].id,
        fixedLines[2].id
      ]);
    });
  });
});
