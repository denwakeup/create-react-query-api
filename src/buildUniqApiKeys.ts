import { IUniqApiKeys } from './types';
import { capitalize } from './utils/capitalize';

export const buildUniqApiKeys = <K extends string>(
  name: K
): IUniqApiKeys<K> => {
  const capitalizedName = capitalize(name);

  return {
    useQuery: `use${capitalizedName}Query`,
    getQueryKey: `get${capitalizedName}QueryKey`,
    fetchQuery: `fetch${capitalizedName}Query`,
  };
};
