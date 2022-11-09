import type { QueryKey } from '@tanstack/react-query';

export type Primitive = bigint | boolean | number | undefined | string | symbol;

export interface QueryGetter {
  getQueryKey: () => QueryKey;
}
