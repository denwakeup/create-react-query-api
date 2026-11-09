export const SkipToken = Symbol.for('ReactQuerySkipToken');

export type TSkipToken = typeof SkipToken;

/**
 * Query key segment used while a query is skipped, so a skipped hook never
 * shares a cache entry with the base key or with a real set of params
 */
export const SKIPPED_QUERY_KEY_PART = 'ReactQuerySkipToken';
