import {
  QueryClient,
  QueryClientProvider,
  skipToken,
} from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { FC, PropsWithChildren } from 'react';

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

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

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

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: 2 });
    expect(queryClient.getQueryData(['todo', 2])).toEqual({ id: 2 });

    rerender({ params: 3 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
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

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));
    expect(mockedFetch).not.toHaveBeenCalled();

    rerender({ params: SkipToken, enabled: true });
    expect(mockedFetch).not.toHaveBeenCalled();

    await act(async () => {
      rerender({ params: 3 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedFetch).toHaveBeenCalledWith(3, expect.anything());
    expect(result.current.data).toEqual({ id: 3 });
  });

  it('skipped query should not read data cached by the base key', () => {
    const client = new QueryClient();
    const clientWrapper: FC<PropsWithChildren> = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const getQueryKey = (id?: number) =>
      id === undefined ? ['todo'] : ['todo', id];

    client.setQueryData(getQueryKey(), [{ id: 1 }]);

    const useQuery = createQueryHook({
      getQueryKey,
      fetchQuery: (id?: number) => ({ id }),
    });

    const { result } = renderHook(() => useQuery({ params: SkipToken }), {
      wrapper: clientWrapper,
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.status).toBe('pending');
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('should pass the query function context to the fetcher', async () => {
    const client = new QueryClient();
    const clientWrapper: FC<PropsWithChildren> = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const mockedFetch = jest.fn().mockImplementation((id: number) => ({ id }));

    const useQuery = createQueryHook({
      getQueryKey: (id?: number) => ['todo', id],
      fetchQuery: mockedFetch,
    });

    const { result } = renderHook(() => useQuery({ params: 5 }), {
      wrapper: clientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedFetch).toHaveBeenCalledWith(
      5,
      expect.objectContaining({
        queryKey: ['todo', 5],
        signal: expect.any(AbortSignal),
      })
    );
  });

  it('should accept skipToken from @tanstack/react-query', async () => {
    expect(SkipToken).toBe(skipToken);

    const mockedFetch = jest.fn();
    const useQuery = createQueryHook({
      getQueryKey: (id?: number) => ['skipped', id],
      fetchQuery: mockedFetch,
    });

    const { result } = renderHook(() => useQuery({ params: skipToken }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.fetchStatus).toBe('idle'));
    expect(result.current.isPending).toBe(true);
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it('refetch should not call fetchQuery when query is skipped', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const noRetryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const noRetryWrapper: FC<PropsWithChildren> = ({ children }) => (
      <QueryClientProvider client={noRetryClient}>
        {children}
      </QueryClientProvider>
    );
    const mockedFetch = jest.fn();
    const useQuery = createQueryHook({
      getQueryKey: (id?: number) => ['skipped-refetch', id],
      fetchQuery: mockedFetch,
    });

    try {
      const { result } = renderHook(() => useQuery({ params: SkipToken }), {
        wrapper: noRetryWrapper,
      });

      const refetchResult = await act(() => result.current.refetch());

      expect(mockedFetch).not.toHaveBeenCalled();
      expect(refetchResult.error).toBeInstanceOf(Error);
    } finally {
      consoleError.mockRestore();
    }
  });
});
