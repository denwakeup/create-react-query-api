import { IQueryApi, IUniqQueryApi, IUniqApiKeys } from './types';

export const mapApiToUniqKeys = <K extends string, R, P>(
  api: IQueryApi<R, P>,
  uniqKeys: IUniqApiKeys<K>
) =>
  ({
    [uniqKeys.useQuery]: api.useQuery,
    [uniqKeys.fetchQuery]: api.fetchQuery,
    [uniqKeys.getQueryKey]: api.getQueryKey,
  } as IUniqQueryApi<K, R, P>);
