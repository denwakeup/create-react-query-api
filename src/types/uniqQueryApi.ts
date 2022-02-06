import {
  IQueryApi,
  IQueryApiUnion,
  IQueryApiWithoutParams,
  IQueryApiWithParams,
} from './queryApi';
import { IUniqApiKeys } from './uniqApiKeys';

export type UniqMethodsBuilder<
  K extends string,
  Api extends IQueryApiUnion<any, any>
> = {
  [key in IUniqApiKeys<K>['useQuery']]: Api['useQuery'];
} & {
  [key in IUniqApiKeys<K>['getQueryKey']]: Api['getQueryKey'];
} & {
  [key in IUniqApiKeys<K>['fetchQuery']]: Api['fetchQuery'];
};

export type IUniqQueryApi<K extends string, R, P> = UniqMethodsBuilder<
  K,
  IQueryApi<R, P>
>;

export type IUniqQueryApiWithParams<
  K extends string,
  R,
  P
> = UniqMethodsBuilder<K, IQueryApiWithParams<R, P>>;

export type IUniqQueryApiWithoutParams<
  K extends string,
  R
> = UniqMethodsBuilder<K, IQueryApiWithoutParams<R>>;

export type IUniqQueryApiUnion<K extends string, R, P> =
  | IUniqQueryApi<K, R, P>
  | IUniqQueryApiWithParams<K, R, P>
  | IUniqQueryApiWithoutParams<K, R>;
