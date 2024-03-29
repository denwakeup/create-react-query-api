import { QueryKey, useQuery } from '@tanstack/react-query';

import { SkipToken } from './constants';
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
    const params = options?.params === SkipToken ? undefined : options?.params;

    return useQuery({
      ...options,
      queryKey: getQueryKey(params),
      queryFn: () => fetchQuery(params),
      enabled: options?.params === SkipToken ? false : options?.enabled,
    });
  };
