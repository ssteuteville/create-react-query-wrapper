import type { MutationKey, UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryGetter } from './types';

interface CreateMutationWrapperOptions {
  mutationKey?: MutationKey;
  invalidates?: QueryGetter[];
}

export const createMutationWrapper = <ErrorType = unknown, ParamType = any, ResultType = any>(
  mutationFn: (param: ParamType) => Promise<ResultType>,
  wrapperOptions: CreateMutationWrapperOptions = {}
) => {
  const useMutationWrapper = (options: UseMutationOptions<ResultType, ErrorType, ParamType> = {}) => {
    const queryClient = useQueryClient();
    return useMutation<ResultType, ErrorType, ParamType>({
      ...options,
      mutationKey: wrapperOptions.mutationKey,
      mutationFn,
      async onSuccess(data, variables, context) {
        await options.onSuccess?.(data, variables, context);

        if (wrapperOptions.invalidates != null) {
          await Promise.all(
            wrapperOptions.invalidates.map(
              async getter => await queryClient.invalidateQueries(getter.getQueryKey())
            )
          );
        }
      },
    });
  };

  useMutationWrapper.mutationKey = wrapperOptions.mutationKey;

  return useMutationWrapper;
};
