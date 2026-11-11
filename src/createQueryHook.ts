import {
  DefaultError,
  QueryFunctionContext,
  QueryKey,
  skipToken,
  useQuery,
} from '@tanstack/react-query';

import { IQueryHookCommonOptions, IQueryHookParams } from './types';

interface IParams<R, P> {
  getQueryKey: (params?: P) => QueryKey;
  fetchQuery: (params?: P, context?: QueryFunctionContext) => Promise<R> | R;
}

/**
 * Query key segment used while a query is skipped, so a skipped hook never
 * shares a cache entry with the base key or with a real set of params
 */
const SKIPPED_QUERY_KEY_PART = 'ReactQuerySkipToken';

export const createQueryHook =
  <P, R>({ getQueryKey, fetchQuery }: IParams<R, P>) =>
  <E = DefaultError, D = R>(
    options?: IQueryHookCommonOptions<R, E, D> & Partial<IQueryHookParams<P>>
  ) => {
    const { params: rawParams, ...queryOptions } = options ?? {};
    const isSkipped = rawParams === skipToken;
    const params = isSkipped ? undefined : rawParams;

    return useQuery<R, E, D>({
      ...queryOptions,
      queryKey: isSkipped
        ? [...getQueryKey(), SKIPPED_QUERY_KEY_PART]
        : getQueryKey(params),
      queryFn: isSkipped ? skipToken : (context) => fetchQuery(params, context),
    });
  };
