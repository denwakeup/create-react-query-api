import { createQueryKeyBuilder } from './createQueryKeyBuilder';
import { createUseApiHook } from './createUseApiHook';
import { IQueryApi, IQueryKeyBuilder } from './types';

interface IParams<R, P> {
  queryKey: string;
  fetchQuery: (params?: P) => Promise<R>;
  queryKeyBuilder: IQueryKeyBuilder | undefined;
}

export const buildApiMethods = <R, P>({
  queryKey,
  fetchQuery,
  queryKeyBuilder,
}: IParams<R, P>): IQueryApi<R, P> => {
  const getQueryKey = createQueryKeyBuilder<P>({ queryKey, queryKeyBuilder });

  const useQuery = createUseApiHook({
    fetchQuery,
    getQueryKey,
  });

  return {
    getQueryKey,
    fetchQuery,
    useQuery,
  };
};
