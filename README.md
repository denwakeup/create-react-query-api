# Create React Query api

Simple [**React Query**](https://react-query.tanstack.com) wrapper to create API with query key bound

## Install

```bash
// yarn
yarn add create-react-query-api

// npm
npm i --save create-react-query-api
```

## How to use

```tsx
// useTodoQuery under the hood calls useQuery with a queryKey=['todo', id]
const { useTodoQuery } = createQueryApi({
  queryKey: 'todo',
  queryFn: (id: string) =>
    fetch(`/api/todo/${id}`).then((response): Promise<Todo> => response.json()),
});

export const TodoPage: FC = () => {
  // queryKey=['todo', '1']
  const { data, isLoading } = useTodoQuery({ params: '1' });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>{data?.title}</h1>
    </div>
  );
};
```

### Using a key with another React Query api

```ts
const { getTodoQueryKey } = createQueryApi({
  queryKey: 'todo',
  queryFn: (id: string) =>
    fetch(`/api/todo/${id}`).then((response): Promise<Todo> => response.json()),
});

queryClient.invalidateQueries(getTodoQueryKey()); // queryKey=['todo']
queryClient.invalidateQueries(getTodoQueryKey('1')); // queryKey=['todo', '1']
```

### Using a key hierarchy

```ts
const { getAllTodoQueryKey } = createQueryApi({
  queryKey: 'allTodo',
  queryFn: () =>
    fetch(`/api/todo`).then((response): Promise<Todo[]> => response.json()),
});

const { getTodoQueryKey } = createQueryApi({
  queryKey: 'todo',
  queryKeyFn: (keys) => [...getAllTodoQueryKey(), ...keys],
  queryFn: (id: string) =>
    fetch(`/api/todo/${id}`).then((response): Promise<Todo> => response.json()),
});

getTodoQueryKey(); // ['allTodo', 'todo']
getTodoQueryKey('2'); // ['allTodo', 'todo', '2']
```

### Conditional query with TypeScript

```ts
import { SkipToken } from 'create-react-query-api';

const { fetchTodoQuery } = createQueryApi({
  queryKey: 'todo',
  queryFn: (id: string) =>
    fetch(`/api/todo/${id}`).then((response): Promise<Todo> => response.json()),
});

// ...
// If you pass the skip token instead of parameters it will automatically disable the query ({ enabled: false })
const { data, isLoading } = useTodoQuery({
  params: id ?? SkipToken,
});
```

### Reuse fetch handler

```ts
const { fetchTodoQuery } = createQueryApi({
  queryKey: 'todo',
  queryFn: (id: string) =>
    fetch(`/api/todo/${id}`).then((response): Promise<Todo> => response.json()),
});

// ...
// It's just a wrapper over the function you passed to queryFn
await fetchTodoQuery('1');
```

### Disable unique api method names

By default `createQueryApi` creates method names using the passed `queryKey`

```ts
const { useTodoQuery, getTodoQueryKey, fetchTodoQuery } = createQueryApi({
  queryKey: 'todo',
  // ...
});

const { useUserQuery, getUserQueryKey, fetchUserQuery } = createQueryApi({
  queryKey: 'user',
  // ...
});

// You can disable this behavior by passing disableUniqKeys=false
const { useQuery, fetchQuery, getQueryKey } = createQueryApi({
  queryKey: 'todo',
  disableUniqKeys: true,
  // ...
});
```
