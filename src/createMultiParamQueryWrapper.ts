import type { UseQueryOptions, QueryKey, UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';

export type MultiParamQueryWrapper<ReturnType, ErrorType, ParamsType extends any[]> = {
  <SelectedType = ReturnType>(
    options?: UseQueryOptions<ReturnType, ErrorType, SelectedType>,
    ...params: ParamsType
  ): UseQueryResult<SelectedType, ErrorType>;
  getQueryKey: (params: ParamsType | undefined) => QueryKey;
};

export const createMultiParamQueryWrapper = <
  ErrorType = unknown,
  ParamsType extends any[] = any[],
  ReturnType = any
>(
  apiFunc: (...params: ParamsType) => Promise<ReturnType>,
  queryName: string
): MultiParamQueryWrapper<ReturnType, ErrorType, ParamsType> => {
  const getQueryKey = (params: ParamsType | undefined = undefined) =>
    params ? [queryName, ...params] : [queryName];

  const useQueryWrapper = <SelectedType = ReturnType>(
    options: UseQueryOptions<ReturnType, ErrorType, SelectedType> = {},
    ...params: ParamsType
  ) =>
    useQuery<ReturnType, ErrorType, SelectedType>(
      getQueryKey(params),
      async () => apiFunc(...params),
      options
    );

  useQueryWrapper.getQueryKey = getQueryKey;

  return useQueryWrapper;
};
