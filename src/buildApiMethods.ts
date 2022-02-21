import { createQueryKeyBuilder } from './createQueryKeyBuilder';
import { createQueryHook } from './createQueryHook';
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

  const useQuery = createQueryHook({
    fetchQuery,
    getQueryKey,
  });

  return {
    getQueryKey,
    fetchQuery,
    useQuery,
  };
};
