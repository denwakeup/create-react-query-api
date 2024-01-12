import { act, renderHook, waitFor } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SkipToken, TSkipToken } from '../constants';
import { createQueryHook } from '../createQueryHook';

describe('useQuery hook creator', () => {
  const queryClient = new QueryClient();
  const wrapper: FC<PropsWithChildren> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should work correctly', async () => {
    const useQuery = createQueryHook({
      getQueryKey: () => ['todo'],
      fetchQuery: () => ({ id: 1 }),
    });

    const { result } = renderHook(() => useQuery(), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ id: 1 });
    expect(queryClient.getQueryData(['todo'])).toEqual({ id: 1 });
  });

  it('query with params should work correctly', async () => {
    const useQuery = createQueryHook({
      getQueryKey: (id?: number) => ['todo', id],
      fetchQuery: (id?: number) => ({ id }),
    });

    const { result, rerender } = renderHook((props) => useQuery(props), {
      wrapper,
      initialProps: {
        params: 2,
      },
    });

    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({ id: 2 });
    expect(queryClient.getQueryData(['todo', 2])).toEqual({ id: 2 });

    rerender({ params: 3 });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({ id: 3 });
    expect(queryClient.getQueryData(['todo', 2])).toEqual({ id: 2 });
    expect(queryClient.getQueryData(['todo', 3])).toEqual({ id: 3 });
  });

  it('skip token should work correctly', async () => {
    const wrapperWithToken: FC<PropsWithChildren> = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const mockedFetch = jest.fn().mockImplementation((id: number) => ({ id }));

    const useQuery = createQueryHook({
      getQueryKey: (id?: number) => ['todo', id],
      fetchQuery: mockedFetch,
    });

    const initialParams: {
      params: TSkipToken | number;
      enabled?: boolean;
    } = {
      params: SkipToken,
    };

    const { result, rerender } = renderHook((props) => useQuery(props), {
      wrapper: wrapperWithToken,
      initialProps: initialParams,
    });

    await waitFor(() => result.current.fetchStatus === 'idle');
    expect(mockedFetch).not.toHaveBeenCalled();

    rerender({ params: SkipToken, enabled: true });
    expect(mockedFetch).not.toHaveBeenCalled();

    await act(async () => {
      rerender({ params: 3 });
    });
    await waitFor(() => result.current.isSuccess);
    expect(mockedFetch).toHaveBeenCalledWith(3);
    expect(result.current.data).toEqual({ id: 3 });
  });
});
