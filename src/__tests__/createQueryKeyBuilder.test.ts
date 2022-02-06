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
