import { QueryKey, skipToken, useQuery } from '@tanstack/react-query';

import { IQueryHookCommonOptions, IQueryHookParams } from './types';

interface IParams<R, P> {
  getQueryKey: (params?: P) => QueryKey;
  fetchQuery: (params?: P) => Promise<R> | R;
}

export const createQueryHook =
  <P, R>({ getQueryKey, fetchQuery }: IParams<R, P>) =>
  <E = unknown, D = R>(
    options?: IQueryHookCommonOptions<R, E, D> & Partial<IQueryHookParams<P>>
  ) => {
    const { params: rawParams, ...queryOptions } = options ?? {};
    const isSkipped = rawParams === skipToken;
    const params = isSkipped ? undefined : rawParams;

    return useQuery<R, E, D>({
      ...queryOptions,
      queryKey: getQueryKey(params),
      queryFn: isSkipped ? skipToken : () => fetchQuery(params),
    });
  };
