import { capitalize } from '../capitalize';

describe('Capitalize utils', () => {
  it('should work correctly', () => {
    expect(capitalize('todo')).toBe('Todo');
    expect(capitalize('Todo')).toBe('Todo');
    expect(capitalize('')).toBe('');
  });
});
