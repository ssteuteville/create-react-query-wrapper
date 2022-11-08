# Create React Query Wrapper

## What is this?

I have some opinions!

1. I don't like to call `useQuery`/`useMutation` all willy-nilly wherever I want
2. I do like having a consistent way to manage and build my query keys
3. I do like strong inferred types
4. I do like to create wrappers around my queries/mutations based on those other opinions
5. react-query is amazing

This library aims to get rid of a ton of boilerplate code and create an opinionated way to manage react-query queries!
These utilities won't work for every use case, but they should work for most of them!

## Example Wrapper - the old way
```ts
const fetchTodos = async (userId: string): Promise<Todo[]> => fetch(`/user/${userId}/todos`);

const useTodos = <TSelected = Todo[]>(userId: string, options: UseQueryOptions<Todo[], unknown, TSelected> = {}) => {
    return useQuery<Todo[], unknown, TSelected>(['todos', userId], () => fetchTodos(userId));
}

// some other code
queryClient.invalidateQueries(['todos', userId]); // notice the duplicated code and magic string
// OR to invalidate all of them
queryClient.invalidateQueries(['todos']);
```

Now, this a simple example with simple query key generation and parameters. The types are a little tricky to understand already though!

## The same example - the new way
```ts
const fetchTodos = async (userId: string): Promise<Todo[]> => fetch(`/user/${userId}/todos`);

const useTodos = createQueryWrapper(fetchTodos, 'todos');

// some other code
queryClient.invalidateQueries(useTodos.getQueryKey(userId)); // now query keys are more managable!
// OR to invalidate all of them
queryClient.invalidateQueries(useTodos.getQueryKey());
```

The hook returned here is completely type safe and supports all of the react-query options!

## Available wrappers
Documentation will come soon, use the source code for now!

- createQueryWrapper
- createSingleParamQueryWrapper
- createMultiParamQueryWrapper

# Roadmap
- createMutationWrapper(s)
- documentation
- unit tests
- infinite query support