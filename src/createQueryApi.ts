import { QueryFunctionContext } from '@tanstack/react-query';

import { buildApiMethods } from './buildApiMethods';
import { buildUniqApiKeys } from './buildUniqApiKeys';
import { mapApiToUniqKeys } from './mapApiToUniqKeys';
import {
  IQueryApi,
  IQueryApiUnion,
  IQueryApiWithoutParams,
  IQueryApiWithParams,
  IQueryKeyBuilder,
  IUniqQueryApi,
  IUniqQueryApiUnion,
  IUniqQueryApiWithoutParams,
  IUniqQueryApiWithParams,
} from './types';

interface IBaseParams<K extends string> {
  queryKey: K;
  queryKeyFn?: IQueryKeyBuilder;
}

interface IUniqKeysParams {
  disableUniqKeys?: false;
}

interface ICommonKeysParams {
  disableUniqKeys: true;
}

// The context is optional everywhere: the same function is returned as
// `fetchQuery` and can be called directly, without React Query
type TQueryFnWithoutParams<R> = (
  queryParams: void,
  context?: QueryFunctionContext
) => Promise<R>;

type TQueryFnWithOptionalParams<R, P> = (
  queryParams?: P,
  context?: QueryFunctionContext
) => Promise<R>;

type TQueryFnWithParams<R, P> = (
  queryParams: P,
  context?: QueryFunctionContext
) => Promise<R>;

// Overloads with `disableUniqKeys: true` go first: otherwise an options object
// that is not a fresh literal would match the "uniq keys" overload and the
// returned type would not correspond to the runtime value
export function createQueryApi<K extends string, R>(
  params: { queryFn: TQueryFnWithoutParams<R> } & IBaseParams<K> &
    ICommonKeysParams
): IQueryApiWithoutParams<R>;
export function createQueryApi<K extends string, R>(
  params: { queryFn: TQueryFnWithoutParams<R> } & IBaseParams<K> &
    IUniqKeysParams
): IUniqQueryApiWithoutParams<K, R>;

export function createQueryApi<K extends string, R, P>(
  params: { queryFn: TQueryFnWithOptionalParams<R, P> } & IBaseParams<K> &
    ICommonKeysParams
): IQueryApi<R, P>;
export function createQueryApi<K extends string, R, P>(
  params: { queryFn: TQueryFnWithOptionalParams<R, P> } & IBaseParams<K> &
    IUniqKeysParams
): IUniqQueryApi<K, R, P>;

export function createQueryApi<K extends string, R, P>(
  params: { queryFn: TQueryFnWithParams<R, P> } & IBaseParams<K> &
    ICommonKeysParams
): IQueryApiWithParams<R, P>;
export function createQueryApi<K extends string, R, P>(
  params: { queryFn: TQueryFnWithParams<R, P> } & IBaseParams<K> &
    IUniqKeysParams
): IUniqQueryApiWithParams<K, R, P>;

export function createQueryApi<K extends string, R, P = void>({
  queryKey,
  queryKeyFn,
  queryFn,
  disableUniqKeys,
}: {
  queryKey: K;
  queryFn:
    | TQueryFnWithoutParams<R>
    | TQueryFnWithOptionalParams<R, P>
    | TQueryFnWithParams<R, P>;
  disableUniqKeys?: boolean;
  queryKeyFn?: IQueryKeyBuilder;
}): IQueryApiUnion<R, P> | IUniqQueryApiUnion<K, R, P> {
  const apiMethods = buildApiMethods({
    queryKey,
    queryKeyBuilder: queryKeyFn,
    fetchQuery: queryFn as TQueryFnWithOptionalParams<R, P>,
  });

  if (disableUniqKeys) {
    return apiMethods;
  }

  return mapApiToUniqKeys(apiMethods, buildUniqApiKeys(queryKey));
}
