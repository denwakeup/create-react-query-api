import { UseQueryOptions, UseQueryResult } from 'react-query';

export type IQueryHookCommonOptions<R> = Omit<
  UseQueryOptions<R>,
  'queryKey' | 'queryFn'
>;

export type IQueryHook<R, P> = (
  options?: IQueryHookCommonOptions<R> & { params?: P }
) => UseQueryResult<R>;

export type IQueryHookWithParams<R, P> = (
  options: IQueryHookCommonOptions<R> & { params: P }
) => UseQueryResult<R>;

export type IQueryHookWithoutParams<R> = (
  options?: IQueryHookCommonOptions<R>
) => UseQueryResult<R>;
