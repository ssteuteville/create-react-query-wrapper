import { createMutationWrapper } from './createMutationWrapper';
import { act, renderHook } from '@testing-library/react';
import { withQueryClient } from './testUtils';
import { createQueryWrapper } from './createQueryWrapper';
import { createSingleParamQueryWrapper } from './createSingleParamQueryWrapper';
import { createMultiParamQueryWrapper } from './createMultiParamQueryWrapper';

const mockInvalidate = jest.fn();

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: mockInvalidate,
  })),
}));

describe('createMutationWrapper', () => {
  const mockMutationFn = jest.fn();
  const mutationFn = mockMutationFn as (payload: { data: string }) => Promise<{ result: string }>;

  beforeEach(() => {
    mockMutationFn.mockReset();
    mockMutationFn.mockResolvedValue({ result: 'hai' });
    mockInvalidate.mockReset();
  });

  it('exists', () => {
    expect(createMutationWrapper).not.toBeUndefined();
  });

  it('returns the result of the queryFn', async () => {
    const hook = createMutationWrapper(mutationFn);

    const { result } = renderHook(() => hook(), {
      wrapper: withQueryClient,
    });

    await act(async () => {
      await result.current.mutateAsync(
        { data: '123' },
        {
          onSuccess: data => {
            expect(data.result).toBe('hai');
          },
        }
      );
    });

    expect(mockMutationFn).toHaveBeenCalledWith({ data: '123' });
  });

  describe('type inference', () => {
    it('takes the correct type of params', async () => {
      const hook = createMutationWrapper(mutationFn);

      const { result } = renderHook(() => hook(), {
        wrapper: withQueryClient,
      });

      // this will cause build to fail if the type inference isn't working
      await act(async () => {
        await result.current.mutateAsync(
          // @ts-expect-error
          { zzz: '123' },
          {
            onSuccess: data => {
              // @ts-expect-error
              return data.xxx;
            },
          }
        );
      });
    });
  });

  describe('invalidates queries', () => {
    const noParams = createQueryWrapper(async () => '', 'no-params');
    const oneParam = createSingleParamQueryWrapper(async (x: string) => x, 'one-params');
    const multiParam = createMultiParamQueryWrapper(async (x: string, y: string) => x, 'n-params');

    it.each([
      ['0 Params', noParams],
      ['1 Param', oneParam],
      ['N Params', multiParam],
    ])('invalidates %s query', async (name, query) => {
      const hook = createMutationWrapper(mutationFn, {
        invalidates: [query, query],
      });

      const { result } = renderHook(() => hook(), {
        wrapper: withQueryClient,
      });

      await act(async () => {
        await result.current.mutateAsync({ data: '123' });
      });

      expect(mockInvalidate).toHaveBeenCalledWith(query.getQueryKey());
      expect(mockInvalidate).toHaveBeenCalledTimes(2);
    });
  });
});
