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

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual({ id: 2 });
      expect(queryClient.getQueryData(getTodoQueryKey(2))).toEqual({ id: 2 });

      rerender({ params: 3 });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
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

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
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

  describe('Falsy params', () => {
    it('should not share cache between different falsy params', async () => {
      const fetchPage = jest.fn(
        async (page: number | string) => `${typeof page}:${page}`
      );
      const { usePageQuery, getPageQueryKey } = createQueryApi({
        queryKey: 'page',
        queryFn: fetchPage,
      });

      const first = renderHook(() => usePageQuery({ params: 0 }), { wrapper });
      await waitFor(() => expect(first.result.current.isSuccess).toBe(true));

      const second = renderHook(() => usePageQuery({ params: '' }), {
        wrapper,
      });
      await waitFor(() => expect(second.result.current.isSuccess).toBe(true));

      expect(first.result.current.data).toBe('number:0');
      expect(second.result.current.data).toBe('string:');
      expect(fetchPage).toBeCalledTimes(2);
      expect(queryClient.getQueryData(getPageQueryKey())).toBeUndefined();
    });
  });

  describe('Types', () => {
    it('should match runtime keys for a non-literal options object', () => {
      const options = {
        queryKey: 'todo' as const,
        queryFn: async () => 1,
        disableUniqKeys: true as const,
      };

      const api = createQueryApi(options);

      expect(Object.keys(api).sort()).toEqual([
        'fetchQuery',
        'getQueryKey',
        'useQuery',
      ]);
      // @ts-expect-error uniq keys are disabled
      expect(api.useTodoQuery).toBeUndefined();
    });

    it('should allow to use the query function context', async () => {
      const { useTodoQuery } = createQueryApi({
        queryKey: 'todo',
        queryFn: async (id: number, { signal }) => ({
          id,
          aborted: signal.aborted,
        }),
      });

      const { result } = renderHook(() => useTodoQuery({ params: 1 }), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual({ id: 1, aborted: false });
      // Default error type is the react-query default one
      const { error }: { error: Error | null } = result.current;
      expect(error).toBeNull();
    });
  });
});
