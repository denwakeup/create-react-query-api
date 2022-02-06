export interface IUniqApiKeys<K extends string> {
  useQuery: `use${Capitalize<K>}Query`;
  getQueryKey: `get${Capitalize<K>}QueryKey`;
  fetchQuery: `fetch${Capitalize<K>}Query`;
}
