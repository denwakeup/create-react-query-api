import { renderHook, waitFor } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { buildApiMethods } from '../buildApiMethods';

describe('Api Methods builder', () => {
  const mockQueryKeyBuilder = (keys: readonly unknown[]) => ['list', ...keys];
  const mockFetch = jest.fn();

  it('getQueryKey should work correctly', () => {
    const apiMethods = buildApiMethods({
      queryKey: 'todo',
      queryKeyBuilder: mockQueryKeyBuilder,
      fetchQuery: mockFetch,
    });

    expect(apiMethods.getQueryKey()).toEqual(['list', 'todo']);
    expect(apiMethods.getQueryKey({ id: 2 })).toEqual([
      'list',
      'todo',
      { id: 2 },
    ]);
  });

  it('fetchQuery should work correctly', async () => {
    mockFetch.mockResolvedValue({ id: 2 });

    const apiMethods = buildApiMethods({
      queryKey: 'todo',
      queryKeyBuilder: mockQueryKeyBuilder,
      fetchQuery: mockFetch,
    });

    expect(await apiMethods.fetchQuery(2)).toEqual({ id: 2 });
    expect(mockFetch).toHaveBeenCalledWith(2);
  });

  it('useQuery should work correctly', async () => {
    const queryClient = new QueryClient();
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    mockFetch.mockResolvedValue({ id: 3 });

    const apiMethods = buildApiMethods({
      queryKey: 'todo',
      queryKeyBuilder: mockQueryKeyBuilder,
      fetchQuery: mockFetch,
    });

    const { result } = renderHook((props) => apiMethods.useQuery(props), {
      wrapper,
      initialProps: {
        params: 3,
      },
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ id: 3 });
    expect(mockFetch).toHaveBeenCalledWith(3);
    expect(queryClient.getQueryData(apiMethods.getQueryKey(3))).toEqual({
      id: 3,
    });
  });
});
