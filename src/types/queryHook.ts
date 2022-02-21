import { UseQueryOptions, UseQueryResult } from 'react-query';

import { TSkipToken } from '../constants';

export type IQueryHookCommonOptions<R> = Omit<
  UseQueryOptions<R>,
  'queryKey' | 'queryFn'
>;

export type IQueryHookParams<P> = { params: P | TSkipToken };

export type IQueryHook<R, P> = (
  options?: IQueryHookCommonOptions<R> & Partial<IQueryHookParams<P>>
) => UseQueryResult<R>;

export type IQueryHookWithParams<R, P> = (
  options: IQueryHookCommonOptions<R> & IQueryHookParams<P>
) => UseQueryResult<R>;

export type IQueryHookWithoutParams<R> = (
  options?: IQueryHookCommonOptions<R>
) => UseQueryResult<R>;
