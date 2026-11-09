import {
  DefaultError,
  QueryFunctionContext,
  QueryKey,
  useQuery,
} from '@tanstack/react-query';

import { SKIPPED_QUERY_KEY_PART, SkipToken } from './constants';
import { IQueryHookCommonOptions, IQueryHookParams } from './types';

interface IParams<R, P> {
  getQueryKey: (params?: P) => QueryKey;
  fetchQuery: (params?: P, context?: QueryFunctionContext) => Promise<R> | R;
}

export const createQueryHook =
  <P, R>({ getQueryKey, fetchQuery }: IParams<R, P>) =>
  <E = DefaultError, D = R>(
    options?: IQueryHookCommonOptions<R, E, D> & Partial<IQueryHookParams<P>>
  ) => {
    const { params: rawParams, ...queryOptions } = options ?? {};
    const isSkipped = rawParams === SkipToken;
    const params = isSkipped ? undefined : (rawParams as P | undefined);

    return useQuery<R, E, D>({
      ...(queryOptions as IQueryHookCommonOptions<R, E, D>),
      queryKey: isSkipped
        ? [...getQueryKey(), SKIPPED_QUERY_KEY_PART]
        : getQueryKey(params),
      queryFn: (context) => fetchQuery(params, context),
      enabled: isSkipped ? false : queryOptions.enabled,
    });
  };
