import { buildUniqApiKeys } from '../buildUniqApiKeys';

describe('Uniq Api Keys builder', () => {
  it('should work correctly', () => {
    expect(buildUniqApiKeys('')).toMatchInlineSnapshot(`
      Object {
        "fetchQuery": "fetchQuery",
        "getQueryKey": "getQueryKey",
        "useQuery": "useQuery",
      }
    `);

    expect(buildUniqApiKeys('todo')).toMatchInlineSnapshot(`
      Object {
        "fetchQuery": "fetchTodoQuery",
        "getQueryKey": "getTodoQueryKey",
        "useQuery": "useTodoQuery",
      }
    `);

    expect(buildUniqApiKeys('Todo')).toMatchInlineSnapshot(`
      Object {
        "fetchQuery": "fetchTodoQuery",
        "getQueryKey": "getTodoQueryKey",
        "useQuery": "useTodoQuery",
      }
    `);

    expect(buildUniqApiKeys('films')).toMatchInlineSnapshot(`
      Object {
        "fetchQuery": "fetchFilmsQuery",
        "getQueryKey": "getFilmsQueryKey",
        "useQuery": "useFilmsQuery",
      }
    `);
  });
});
