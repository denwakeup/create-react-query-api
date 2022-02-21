import { act, renderHook } from '@testing-library/react-hooks';
import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { SkipToken } from '../constants';
import { createQueryHook } from '../createQueryHook';
import { IQueryHookCommonOptions, IQueryHookParams } from '../types';

describe('useQuery hook creator', () => {
  const queryClient = new QueryClient();
  const wrapper: FC<{ params: number }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should work correctly', async () => {
    const useQuery = createQueryHook({
      getQueryKey: () => ['todo'],
      fetchQuery: () => ({ id: 1 }),
    });

    const { result, waitFor } = renderHook(() => useQuery(), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ id: 1 });
    expect(queryClient.getQueryData(['todo'])).toEqual({ id: 1 });
  });

  it('query with params should work correctly', async () => {
    const useQuery = createQueryHook({
      getQueryKey: (id?: number) => ['todo', id],
      fetchQuery: (id?: number) => ({ id }),
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

  it('skip token should work correctly', async () => {
    const wrapperWithToken: FC<
      IQueryHookCommonOptions<{ id: number }> & IQueryHookParams<number>
    > = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const mockedFetch = jest.fn().mockImplementation((id: number) => ({ id }));

    const useQuery = createQueryHook({
      getQueryKey: (id?: number) => ['todo', id],
      fetchQuery: mockedFetch,
    });

    const { result, waitFor, rerender } = renderHook(
      (props) => useQuery(props),
      {
        wrapper: wrapperWithToken,
        initialProps: {
          params: SkipToken,
        },
      }
    );

    await waitFor(() => result.current.isIdle);
    expect(mockedFetch).not.toBeCalled();

    rerender({ params: SkipToken, enabled: true });
    expect(mockedFetch).not.toBeCalled();

    await act(async () => {
      rerender({ params: 3 });
    });
    await waitFor(() => result.current.isSuccess);
    expect(mockedFetch).toHaveBeenCalledWith(3);
    expect(result.current.data).toEqual({ id: 3 });
  });
});
