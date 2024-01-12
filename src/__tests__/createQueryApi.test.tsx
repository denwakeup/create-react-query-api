import { act, renderHook, waitFor } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createQueryApi } from '../createQueryApi';

describe('QueryApi', () => {
  let queryClient: QueryClient;
  let wrapper: FC<PropsWithChildren>;

  const mockFetch = jest.fn();
  const mockQueryKeyFn = (keys: readonly unknown[]) => ['list', ...keys];

  beforeEach(() => {
    queryClient = new QueryClient();

    wrapper = function customWrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };

    mockFetch.mockImplementation(async (id: number) => ({
      id,
    }));
  });

  describe('Query key getter', () => {
    it('should work correctly', () => {
      const { getTodoQueryKey } = createQueryApi<
        'todo',
        { id: number },
        number
      >({
        queryKey: 'todo',
        queryFn: mockFetch,
        queryKeyFn: mockQueryKeyFn,
      });

      expect(getTodoQueryKey()).toEqual(['list', 'todo']);
      expect(getTodoQueryKey(2)).toEqual(['list', 'todo', 2]);
    });
  });

  describe('Query fetcher', () => {
    it('should work correctly', async () => {
      const { fetchTodoQuery } = createQueryApi<'todo', { id: number }, number>(
        {
          queryKey: 'todo',
          queryFn: mockFetch,
          queryKeyFn: mockQueryKeyFn,
        }
      );

      const data = await fetchTodoQuery(1);
      expect(mockFetch).toBeCalled();
      expect(data).toEqual({ id: 1 });

      await fetchTodoQuery(2);
      expect(mockFetch).toHaveBeenLastCalledWith(2);
      expect(mockFetch).toBeCalledTimes(2);
    });
  });

  describe('QueryApi hook', () => {
    it('fetch data should work correctly', async () => {
      const { useTodoQuery, getTodoQueryKey } = createQueryApi<
        'todo',
        { id: number },
        number
      >({
        queryKey: 'todo',
        queryFn: mockFetch,
        queryKeyFn: mockQueryKeyFn,
      });

      const { result, rerender } = renderHook((props) => useTodoQuery(props), {
        wrapper,
        initialProps: {
          params: 2,
        },
      });

      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toEqual({ id: 2 });
      expect(queryClient.getQueryData(getTodoQueryKey(2))).toEqual({ id: 2 });

      rerender({ params: 3 });
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toEqual({ id: 3 });
      expect(queryClient.getQueryData(getTodoQueryKey(3))).toEqual({ id: 3 });
    });

    it('invalidate query should work correctly', async () => {
      const { useTodoQuery, getTodoQueryKey } = createQueryApi<
        'todo',
        { id: number },
        number
      >({
        queryKey: 'todo',
        queryFn: mockFetch,
        queryKeyFn: mockQueryKeyFn,
      });

      const { result } = renderHook((props) => useTodoQuery(props), {
        wrapper,
        initialProps: {
          params: 2,
        },
      });

      await waitFor(() => result.current.isSuccess);
      expect(result.current.data).toEqual({ id: 2 });

      await act(async () => {
        await queryClient.invalidateQueries({ queryKey: getTodoQueryKey(2) });
      });

      expect(result.current.data).toEqual({ id: 2 });
      expect(mockFetch).toBeCalledTimes(2);
    });
  });

  describe('Common api methods keys', () => {
    it('should work correctly', () => {
      const result = createQueryApi<'todo', { id: number }, number>({
        queryKey: 'todo',
        queryFn: mockFetch,
        queryKeyFn: mockQueryKeyFn,
        disableUniqKeys: true,
      });

      expect(result.fetchQuery).toBeDefined();
      expect(result.getQueryKey).toBeDefined();
      expect(result.useQuery).toBeDefined();
    });
  });
});
