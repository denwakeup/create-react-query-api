import { createQueryKeyBuilder } from '../createQueryKeyBuilder';

describe('Query Key Builder creator', () => {
  it('should work correctly', () => {
    const builder = createQueryKeyBuilder({
      queryKey: 'todo',
      queryKeyBuilder: undefined,
    });

    expect(builder()).toEqual(['todo']);
    expect(builder(1)).toEqual(['todo', 1]);
    expect(builder({ id: 2 })).toEqual(['todo', { id: 2 }]);
  });

  it('should keep falsy params in the key', () => {
    const builder = createQueryKeyBuilder({
      queryKey: 'todo',
      queryKeyBuilder: undefined,
    });

    expect(builder(0)).toEqual(['todo', 0]);
    expect(builder('')).toEqual(['todo', '']);
    expect(builder(false)).toEqual(['todo', false]);
    expect(builder(null)).toEqual(['todo', null]);
    expect(builder(undefined)).toEqual(['todo']);
  });

  it('should work correctly with queryKeyFn', () => {
    const builder = createQueryKeyBuilder({
      queryKey: 'todo',
      queryKeyBuilder: (keys) => ['todoList', ...keys],
    });

    expect(builder()).toEqual(['todoList', 'todo']);
    expect(builder(1)).toEqual(['todoList', 'todo', 1]);
    expect(builder({ id: 2 })).toEqual(['todoList', 'todo', { id: 2 }]);
  });
});
