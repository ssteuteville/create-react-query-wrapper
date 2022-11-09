import type { UseQueryOptions, QueryKey, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

export interface MultiParamQueryWrapper<ReturnType, ErrorType, ParamsType extends any[]> {
  <SelectedType = ReturnType>(
    options?: UseQueryOptions<ReturnType, ErrorType, SelectedType>,
    ...params: ParamsType
  ): UseQueryResult<SelectedType, ErrorType>;
  getQueryKey: (params?: ParamsType | undefined) => QueryKey;
}

export const createMultiParamQueryWrapper = <
  ErrorType = unknown,
  ParamsType extends any[] = any[],
  ReturnType = any
>(
  queryFn: (...params: ParamsType) => Promise<ReturnType>,
  queryName: string
): MultiParamQueryWrapper<ReturnType, ErrorType, ParamsType> => {
  const getQueryKey = (params: ParamsType | undefined = undefined) =>
    params != null ? [queryName, ...params] : [queryName];

  const useQueryWrapper = <SelectedType = ReturnType>(
    options: UseQueryOptions<ReturnType, ErrorType, SelectedType> = {},
    ...params: ParamsType
  ) =>
    useQuery<ReturnType, ErrorType, SelectedType>(
      getQueryKey(params),
      async () => await queryFn(...params),
      options
    );

  useQueryWrapper.getQueryKey = getQueryKey;

  return useQueryWrapper;
};
