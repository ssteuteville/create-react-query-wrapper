import type { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { Primitive } from './types';

export interface SingleParamQueryWrapper<
  ReturnType,
  ErrorType,
  ParamsType extends Record<string, Primitive> | Primitive
> {
  <SelectedType = ReturnType>(
    param: ParamsType,
    options?: UseQueryOptions<ReturnType, ErrorType, SelectedType>
  ): UseQueryResult<SelectedType, ErrorType>;
  getQueryKey: (param?: ParamsType | undefined) => QueryKey;
}

export const createSingleParamQueryWrapper = <
  ErrorType = unknown,
  ParamsType extends Record<string, Primitive> | Primitive = Record<string, Primitive>,
  ReturnType = any
>(
  queryFn: (params: ParamsType) => Promise<ReturnType>,
  queryName: string
): SingleParamQueryWrapper<ReturnType, ErrorType, ParamsType> => {
  const getQueryKey = (params: ParamsType | undefined = undefined): QueryKey =>
    params != null
      ? [queryName, ...(typeof params === 'object' ? Object.values<Primitive>(params) : [params])]
      : [queryName];

  const useQueryWrapper = <SelectedType = ReturnType>(
    param: ParamsType,
    options: UseQueryOptions<ReturnType, ErrorType, SelectedType> = {}
  ) =>
    useQuery<ReturnType, ErrorType, SelectedType>(
      getQueryKey(param),
      async () => await queryFn(param),
      options
    );

  useQueryWrapper.getQueryKey = getQueryKey;

  return useQueryWrapper;
};
