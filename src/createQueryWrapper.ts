import type { QueryKey, UseQueryOptions, UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';

export type QueryWrapper<ReturnType, ErrorType> = {
  <SelectedType = ReturnType>(options?: UseQueryOptions<ReturnType, ErrorType, SelectedType>): UseQueryResult<
    SelectedType,
    ErrorType
  >;
  getQueryKey: () => QueryKey;
};

export const createQueryWrapper = <ErrorType = unknown, ReturnType = any>(
  queryFn: () => Promise<ReturnType>,
  queryName: string
): QueryWrapper<ReturnType, ErrorType> => {
  const getQueryKey = (): QueryKey => [queryName];

  const useQueryWrapper = <SelectedType = ReturnType>(
    options: UseQueryOptions<ReturnType, ErrorType, SelectedType> = {}
  ) => useQuery<ReturnType, ErrorType, SelectedType>(getQueryKey(), async () => queryFn(), options);

  useQueryWrapper.getQueryKey = getQueryKey;

  return useQueryWrapper;
};
