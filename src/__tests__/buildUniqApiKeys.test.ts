import { buildUniqApiKeys } from '../buildUniqApiKeys';

describe('Uniq Api Keys builder', () => {
  it('should work correctly', () => {
    expect(buildUniqApiKeys('')).toMatchInlineSnapshot(`
      {
        "fetchQuery": "fetchQuery",
        "getQueryKey": "getQueryKey",
        "useQuery": "useQuery",
      }
    `);

    expect(buildUniqApiKeys('todo')).toMatchInlineSnapshot(`
      {
        "fetchQuery": "fetchTodoQuery",
        "getQueryKey": "getTodoQueryKey",
        "useQuery": "useTodoQuery",
      }
    `);

    expect(buildUniqApiKeys('Todo')).toMatchInlineSnapshot(`
      {
        "fetchQuery": "fetchTodoQuery",
        "getQueryKey": "getTodoQueryKey",
        "useQuery": "useTodoQuery",
      }
    `);

    expect(buildUniqApiKeys('films')).toMatchInlineSnapshot(`
      {
        "fetchQuery": "fetchFilmsQuery",
        "getQueryKey": "getFilmsQueryKey",
        "useQuery": "useFilmsQuery",
      }
    `);
  });
});
