import {
  IQueryHook,
  IQueryHookWithoutParams,
  IQueryHookWithParams,
} from './queryHook';

interface IQueryBaseApi<P = void> {
  getQueryKey: (params?: P) => readonly unknown[];
}

export interface IQueryApi<R, P> extends IQueryBaseApi<P> {
  useQuery: IQueryHook<R, P>;
  fetchQuery: (params?: P) => Promise<R>;
}

export interface IQueryApiWithParams<R, P> extends IQueryBaseApi<P> {
  useQuery: IQueryHookWithParams<R, P>;
  fetchQuery: (params: P) => Promise<R>;
}

export interface IQueryApiWithoutParams<R> extends IQueryBaseApi {
  useQuery: IQueryHookWithoutParams<R>;
  fetchQuery: () => Promise<R>;
}

export type IQueryApiUnion<R, P> =
  | IQueryApi<R, P>
  | IQueryApiWithParams<R, P>
  | IQueryApiWithoutParams<R>;
