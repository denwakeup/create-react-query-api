import { renderHook } from '@testing-library/react-hooks';
import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { createUseApiHook } from '../createUseApiHook';

describe('useQuery hook creator', () => {
  const queryClient = new QueryClient();
  const wrapper: FC<{ params: number }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should work correctly', async () => {
    const useQuery = createUseApiHook({
      getQueryKey: () => ['todo'],
      fetchQuery: () => ({ id: 1 }),
    });

    const { result, waitFor } = renderHook(() => useQuery(), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ id: 1 });
    expect(queryClient.getQueryData(['todo'])).toEqual({ id: 1 });
  });

  it('query with params should work correctly', async () => {
    const useQuery = createUseApiHook({
      getQueryKey: (id: number) => ['todo', id],
      fetchQuery: (id: number) => ({ id }),
    });

    const { result, waitFor, rerender } = renderHook(
      (props) => useQuery(props),
      {
        wrapper,
        initialProps: {
          params: 2,
        },
      }
    );

    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({ id: 2 });
    expect(queryClient.getQueryData(['todo', 2])).toEqual({ id: 2 });

    rerender({ params: 3 });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({ id: 3 });
    expect(queryClient.getQueryData(['todo', 2])).toEqual({ id: 2 });
    expect(queryClient.getQueryData(['todo', 3])).toEqual({ id: 3 });
  });
});
