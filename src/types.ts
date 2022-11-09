import type { QueryKey } from 'react-query';

export type Primitive = bigint | boolean | number | undefined | string | symbol;

export type QueryGetter = {
  getQueryKey: () => QueryKey;
};
