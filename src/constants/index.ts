import type { SkipToken as RQSkipToken } from '@tanstack/react-query';

/**
 * Pass it instead of params to disable the query.
 * It is the same token as `skipToken` from `@tanstack/react-query`,
 * so both can be used interchangeably.
 */
export { skipToken as SkipToken } from '@tanstack/react-query';

export type TSkipToken = RQSkipToken;
