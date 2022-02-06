import { QueryKey, useQuery, UseQueryOptions } from 'react-query';

interface IParams<R, P> {
  getQueryKey: (params?: P) => QueryKey;
  fetchQuery: (params?: P) => Promise<R> | R;
}

export const createUseApiHook =
  <P, R>({ getQueryKey, fetchQuery }: IParams<R, P>) =>
  (options?: UseQueryOptions<R> & { params?: P }) =>
    useQuery({
      ...options,
      queryKey: getQueryKey(options?.params),
      queryFn: () => fetchQuery(options?.params),
    });
