import { buildApiMethods } from './buildApiMethods';
import { mapApiToUniqKeys } from './mapApiToUniqKeys';
import {
  IQueryApi,
  IUniqQueryApiWithParams,
  IUniqQueryApi,
  IUniqQueryApiWithoutParams,
  IQueryApiWithoutParams,
  IQueryApiWithParams,
  IUniqQueryApiUnion,
  IQueryApiUnion,
} from './types';
import { buildUniqApiKeys } from './buildUniqApiKeys';
import { IQueryKeyBuilder } from './types/queryKeyBuilder';

interface IBaseParams<K extends string> {
  queryKey: K;
  queryKeyFn?: IQueryKeyBuilder;
}

export function createQueryApi<K extends string, R>(
  params: {
    queryFn: (queryParams: void) => Promise<R>;
  } & IBaseParams<K>
): IUniqQueryApiWithoutParams<K, R>;
export function createQueryApi<K extends string, R>(
  params: {
    queryFn: (queryParams: void) => Promise<R>;
    disableUniqKeys: true;
  } & IBaseParams<K>
): IQueryApiWithoutParams<R>;

export function createQueryApi<K extends string, R, P>(
  params: {
    queryFn: (queryParams?: P) => Promise<R>;
  } & IBaseParams<K>
): IUniqQueryApi<K, R, P>;
export function createQueryApi<K extends string, R, P>(
  params: {
    queryFn: (queryParams?: P) => Promise<R>;
    disableUniqKeys: true;
  } & IBaseParams<K>
): IQueryApi<R, P>;

export function createQueryApi<K extends string, R, P>(
  params: {
    queryFn: (queryParams: P) => Promise<R>;
  } & IBaseParams<K>
): IUniqQueryApiWithParams<K, R, P>;
export function createQueryApi<K extends string, R, P>(
  params: {
    queryFn: (queryParams: P) => Promise<R>;
    disableUniqKeys: true;
  } & IBaseParams<K>
): IQueryApiWithParams<R, P>;

export function createQueryApi<K extends string, R, P = void>({
  queryKey,
  queryKeyFn,
  queryFn,
  disableUniqKeys,
}: {
  queryKey: K;
  queryFn: (params?: P) => Promise<R>;
  disableUniqKeys?: boolean;
  queryKeyFn?: IQueryKeyBuilder;
}): IQueryApiUnion<R, P> | IUniqQueryApiUnion<K, R, P> {
  const apiMethods = buildApiMethods({
    queryKey,
    queryKeyBuilder: queryKeyFn,
    fetchQuery: queryFn,
  });

  if (disableUniqKeys) {
    return apiMethods;
  }

  return mapApiToUniqKeys(apiMethods, buildUniqApiKeys(queryKey));
}
