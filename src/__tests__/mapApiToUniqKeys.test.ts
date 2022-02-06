import { mapApiToUniqKeys } from '../mapApiToUniqKeys';
import { buildUniqApiKeys } from '../buildUniqApiKeys';

describe('Api To Uniq Keys mapper', () => {
  const mockGetQueryKey = jest.fn();
  const mockUseQuery = jest.fn();
  const mockFetchQuery = jest.fn();

  it('should work correctly', () => {
    const uniqKeys = buildUniqApiKeys('todo');

    const mappedKeys = mapApiToUniqKeys(
      {
        getQueryKey: mockGetQueryKey,
        useQuery: mockUseQuery,
        fetchQuery: mockFetchQuery,
      },
      uniqKeys
    );

    expect(mappedKeys.fetchTodoQuery).toBe(mockFetchQuery);
    expect(mappedKeys.getTodoQueryKey).toBe(mockGetQueryKey);
    expect(mappedKeys.useTodoQuery).toBe(mockUseQuery);
  });
});
