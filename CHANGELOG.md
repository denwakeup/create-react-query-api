# Changelog

## Unreleased

### Fixed

- Falsy params (`0`, `''`, `false`, `null`) are no longer dropped from the
  query key. Previously `getPageQueryKey(0)` returned the base key, so such
  params shared one cache entry with each other and with "no params".
- The CommonJS entry is now `dist/index.umd.cjs`. The package is
  `type: module`, so the former `dist/index.umd.js` was loaded as an ES module
  and `require('create-react-query-api')` returned an empty object.
- A skipped query no longer reads data cached under the base key: it gets its
  own query key.
- `createQueryApi` types now match the runtime value when `disableUniqKeys:
  true` is passed in an options object that is not a literal.

### Changed

- `queryFn` receives the React Query function context as an optional second
  argument, so `signal` can be used for request cancellation.
- The default error type of the hooks is now `DefaultError` (`Error`), as in
  TanStack Query v5, instead of `unknown`.

## 2.0.0

### Breaking changes

- **`@tanstack/react-query` peer dependency is now `^5.25.0`** (was `^5.0.0`).
  The library relies on the native `skipToken` introduced in v5.25.0.
- **`SkipToken` is now the same value as `skipToken` from `@tanstack/react-query`**
  (previously a custom `Symbol.for('ReactQuerySkipToken')`). Both can be used
  interchangeably.
- **Skipped queries are disabled via `queryFn: skipToken`** instead of
  `enabled: false`, as recommended by TanStack Query v5. As a result:
  - `refetch()` on a query rendered with `params: SkipToken` no longer calls
    `queryFn` without params; it resolves with a `Missing queryFn` error.
  - `params` is no longer passed through to `useQuery` options.

### Migration

- Upgrade `@tanstack/react-query` to `5.25.0` or newer.
- If you called `refetch()` on a skipped query to fetch without params, render
  the hook without `params` (or with real params) instead.

### Internal

- Updated all dev dependencies (React 19, Jest 30, Vite 8, TypeScript 6,
  Yarn 4.18).
- Replaced ESLint and Prettier with Biome.
