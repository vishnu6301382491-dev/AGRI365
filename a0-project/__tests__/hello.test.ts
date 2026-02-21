export {}; // Make this file an external module

declare global {
  // Add a type declaration for console on globalThis
  // eslint-disable-next-line no-var
  var console: any;
}

function it(description: string, fn: () => void) {
  try {
    fn();
    // Use globalThis.console to avoid "Cannot find name 'console'" if 'dom' lib is not included
    globalThis.console.log(`✓ ${description}`);
  } catch (error) {
    globalThis.console.error(`✗ ${description}`);
    globalThis.console.error(error);
  }
}

function describe(description: string, fn: () => void) {
  globalThis.console.log(description);
  fn();
}

describe('Hello World Test', () => {
  it('should return true for a simple assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should fail for incorrect assertion', () => {
    try {
      expect(2 + 2).toBe(5);
    } catch (e) {
      expectString((e as Error).message).toBe('Expected 4 to be 5');
    }
  });

  it('should handle negative numbers', () => {
    expect(-1 + -1).toBe(-2);
  });

  it('should handle zero', () => {
    expect(0 + 0).toBe(0);
  });

  it('should handle large numbers', () => {
    expect(1000000 + 1000000).toBe(2000000);
  });

  it('should handle floating point addition', () => {
    expect(0.1 + 0.2).toBe(0.30000000000000004);
  });

  it('should handle subtraction', () => {
    expect(5 - 3).toBe(2);
  });

  it('should handle multiplication', () => {
    expect(3 * 4).toBe(12);
  });

  it('should handle division', () => {
    expect(10 / 2).toBe(5);
  });

  it('should handle negative result', () => {
    expect(3 - 5).toBe(-2);
  });

  it('should throw error for incorrect multiplication', () => {
    try {
      expect(2 * 2).toBe(5);
    } catch (e) {
      expectString((e as Error).message).toBe('Expected 4 to be 5');
    }
  });

  it('should handle division by zero', () => {
    expect(1 / 0).toBe(Infinity);
  });

  it('should handle zero divided by any number', () => {
    expect(0 / 5).toBe(0);
  });
});

function expect(received: number) {
  return {
    toBe(expected: number) {
      if (!Object.is(received, expected)) {
        throw new Error(`Expected ${received} to be ${expected}`);
      }
    }
  };
}

function expectString(received: string) {
  return {
    toBe(expected: string) {
      if (received !== expected) {
        throw new Error(`Expected "${received}" to be "${expected}"`);
      }
    }
  };
}