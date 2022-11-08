import type { QueryKey, UseQueryOptions } from 'react-query';
import { useQuery } from 'react-query';
import type { Primitive } from './types';

export const createQueryWrapper = <
  ErrorType = unknown,
  ParamsType extends Record<string, Primitive> | Primitive = Record<string, Primitive>,
  ReturnType = any
>(
  apiFunc: (params: ParamsType) => Promise<ReturnType>,
  queryName: string
) => {
  const getQueryKey = (params: ParamsType | undefined = undefined): QueryKey =>
    params
      ? [queryName, ...(typeof params === 'object' ? Object.values<Primitive>(params) : [params])]
      : [queryName];

  const useLeyebraryQuery = <SelectedType = ReturnType>(
    params: ParamsType,
    options: UseQueryOptions<ReturnType, ErrorType, SelectedType> = {}
  ) =>
    useQuery<ReturnType, ErrorType, SelectedType>(getQueryKey(params), async () => apiFunc(params), options);

  useLeyebraryQuery.getQueryKey = getQueryKey;

  return useLeyebraryQuery;
};
