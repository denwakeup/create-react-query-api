import {
  DefaultError,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { TSkipToken } from '../constants';

export type IQueryHookCommonOptions<R, E = DefaultError, D = R> = Omit<
  UseQueryOptions<R, E, D>,
  'queryKey' | 'queryFn'
>;

export type IQueryHookParams<P> = { params: P | TSkipToken };

export type IQueryHook<R, P> = <E = DefaultError, D = R>(
  options?: IQueryHookCommonOptions<R, E, D> & Partial<IQueryHookParams<P>>
) => UseQueryResult<D, E>;

export type IQueryHookWithParams<R, P> = <E = DefaultError, D = R>(
  options: IQueryHookCommonOptions<R, E, D> & IQueryHookParams<P>
) => UseQueryResult<D, E>;

export type IQueryHookWithoutParams<R> = <E = DefaultError, D = R>(
  options?: IQueryHookCommonOptions<R, E, D>
) => UseQueryResult<D, E>;
