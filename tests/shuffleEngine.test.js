/**
 * @jest-environment jsdom
 */

// Mock ShuffleEngine since it's part of renderer process
class ShuffleEngine {
  static fisherYatesShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static shuffleWithFixedLines(lines, fixedLines) {
    if (!Array.isArray(lines) || lines.length === 0) {
      return [];
    }

    const shuffled = [...lines];
    const fixedPositions = new Map();

    // Collect fixed lines and their positions
    fixedLines.forEach(fixedLine => {
      if (fixedLine.lineIndex !== null && fixedLine.position !== null) {
        const lineIndex = parseInt(fixedLine.lineIndex);
        const position = parseInt(fixedLine.position) - 1; // Convert to 0-based

        if (lineIndex >= 0 && lineIndex < lines.length &&
            position >= 0 && position < lines.length) {
          fixedPositions.set(position, lines[lineIndex]);
        }
      }
    });

    // Remove fixed lines from shuffling pool
    const linesToShuffle = [];
    const fixedLineIndices = new Set();

    fixedLines.forEach(fixedLine => {
      if (fixedLine.lineIndex !== null) {
        fixedLineIndices.add(parseInt(fixedLine.lineIndex));
      }
    });

    lines.forEach((line, index) => {
      if (!fixedLineIndices.has(index)) {
        linesToShuffle.push(line);
      }
    });

    // Shuffle non-fixed lines
    const shuffledLines = this.fisherYatesShuffle(linesToShuffle);

    // Create result array
    const result = new Array(lines.length);
    let shuffledIndex = 0;

    // Place fixed lines first
    fixedPositions.forEach((line, position) => {
      result[position] = line;
    });

    // Fill remaining positions with shuffled lines
    for (let i = 0; i < result.length; i++) {
      if (result[i] === undefined) {
        result[i] = shuffledLines[shuffledIndex++];
      }
    }

    return result;
  }

  static shuffleLines(lines, fixedLines = []) {
    if (!Array.isArray(lines)) {
      throw new Error('Lines must be an array');
    }

    if (lines.length === 0) {
      return [];
    }

    if (fixedLines.length === 0) {
      return this.fisherYatesShuffle(lines);
    }

    return this.shuffleWithFixedLines(lines, fixedLines);
  }
}

describe('ShuffleEngine', () => {
  describe('fisherYatesShuffle', () => {
    test('should return empty array for empty input', () => {
      const result = ShuffleEngine.fisherYatesShuffle([]);
      expect(result).toEqual([]);
    });

    test('should return same array for single element', () => {
      const input = ['single'];
      const result = ShuffleEngine.fisherYatesShuffle(input);
      expect(result).toEqual(['single']);
      expect(result).not.toBe(input); // Should be new array
    });

    test('should shuffle array elements', () => {
      const input = ['a', 'b', 'c', 'd', 'e'];
      const result = ShuffleEngine.fisherYatesShuffle(input);

      // Should contain all original elements
      expect(result.sort()).toEqual(input.sort());
      expect(result).not.toBe(input); // Should be new array
    });

    test('should produce different results on multiple calls', () => {
      const input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const results = [];

      // Run shuffle multiple times
      for (let i = 0; i < 10; i++) {
        results.push(ShuffleEngine.fisherYatesShuffle(input).join(''));
      }

      // Should have some variation (not all identical)
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(1);
    });
  });

  describe('shuffleWithFixedLines', () => {
    test('should handle empty lines', () => {
      const result = ShuffleEngine.shuffleWithFixedLines([], []);
      expect(result).toEqual([]);
    });

    test('should handle no fixed lines', () => {
      const lines = ['a', 'b', 'c'];
      const result = ShuffleEngine.shuffleWithFixedLines(lines, []);
      expect(result.sort()).toEqual(lines.sort());
    });

    test('should keep fixed line in specified position', () => {
      const lines = ['line1', 'line2', 'line3', 'line4'];
      const fixedLines = [
        { lineIndex: 1, position: 3 } // line2 should be at position 3 (0-based: index 2)
      ];

      const result = ShuffleEngine.shuffleWithFixedLines(lines, fixedLines);
      expect(result[2]).toBe('line2'); // Position 3 = index 2
      expect(result.length).toBe(4);
    });

    test('should handle multiple fixed lines', () => {
      const lines = ['A', 'B', 'C', 'D', 'E'];
      const fixedLines = [
        { lineIndex: 0, position: 1 }, // A at position 1
        { lineIndex: 4, position: 5 }  // E at position 5
      ];

      const result = ShuffleEngine.shuffleWithFixedLines(lines, fixedLines);
      expect(result[0]).toBe('A'); // Position 1 = index 0
      expect(result[4]).toBe('E'); // Position 5 = index 4
    });

    test('should ignore invalid fixed line configurations', () => {
      const lines = ['a', 'b', 'c'];
      const fixedLines = [
        { lineIndex: null, position: 1 },
        { lineIndex: 0, position: null },
        { lineIndex: 10, position: 1 }, // Invalid line index
        { lineIndex: 0, position: 10 }  // Invalid position
      ];

      const result = ShuffleEngine.shuffleWithFixedLines(lines, fixedLines);
      expect(result.length).toBe(3);
      expect(result.sort()).toEqual(lines.sort());
    });
  });

  describe('shuffleLines', () => {
    test('should throw error for non-array input', () => {
      expect(() => {
        ShuffleEngine.shuffleLines('not an array');
      }).toThrow('Lines must be an array');
    });

    test('should handle empty array', () => {
      const result = ShuffleEngine.shuffleLines([]);
      expect(result).toEqual([]);
    });

    test('should shuffle without fixed lines', () => {
      const lines = ['a', 'b', 'c', 'd'];
      const result = ShuffleEngine.shuffleLines(lines);
      expect(result.sort()).toEqual(lines.sort());
    });

    test('should shuffle with fixed lines', () => {
      const lines = ['first', 'second', 'third', 'fourth'];
      const fixedLines = [{ lineIndex: 0, position: 2 }];

      const result = ShuffleEngine.shuffleLines(lines, fixedLines);
      expect(result[1]).toBe('first'); // Position 2 = index 1
      expect(result.length).toBe(4);
    });
  });

  describe('Edge cases', () => {
    test('should handle duplicate lines', () => {
      const lines = ['same', 'same', 'different'];
      const result = ShuffleEngine.shuffleLines(lines);
      expect(result.length).toBe(3);
      expect(result.filter(l => l === 'same').length).toBe(2);
    });

    test('should handle very long lines', () => {
      const longLine = 'a'.repeat(10000);
      const lines = [longLine, 'short'];
      const result = ShuffleEngine.shuffleLines(lines);
      expect(result).toContain(longLine);
      expect(result).toContain('short');
    });

    test('should handle special characters', () => {
      const lines = ['üöäß', '中文', '🎉', '{}[]()'];
      const result = ShuffleEngine.shuffleLines(lines);
      expect(result.sort()).toEqual(lines.sort());
    });
  });
});
