import { IQueryKeyBuilder } from './types';

interface IParams {
  queryKey: string;
  queryKeyBuilder: IQueryKeyBuilder | undefined;
}

export const createQueryKeyBuilder =
  <P = unknown>({ queryKey, queryKeyBuilder }: IParams) =>
  (params?: P): readonly unknown[] => {
    const keyWithParams =
      params !== undefined ? [queryKey, params] : [queryKey];

    return queryKeyBuilder ? queryKeyBuilder(keyWithParams) : keyWithParams;
  };
