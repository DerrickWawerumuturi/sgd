# iscope

Create a scope that can be accessed from nested function calls

## Creating simple scope

```js
import iscope from 'iscope';
const funcA = () => {
  const value = iscope();
  return value + 1;
};

const funcB = () => {
  const value = iscope();
  return value + 2;
};
const initialValue = 1;
iscope(initialValue, () => {
  const a = funcA();
  const b = funcB();
  console.log(a); // 2
  console.log(b); // 3
});
```

## Easy to write unit testing

```js
import iscope from 'iscope';

const getTodoById = (id) => {
  const todos = iscope();
  return todos.find((x) => x.id === id);
};

test('found', () => {
  const result = iscope([{id: 1}, {id: 2}], () => getTodoById(1));
  expect(result).toEqual({id: 1});
});

test('not found', () => {
  const result = iscope([], () => getTodoById(1));
  expect(result).toBeUndefined();
});
```

## Multiple scopes

```js
import iscope from 'iscope';

const valueA = iscope(() => 1);
const valueB = iscope(() => 2);
const sum = () => valueA() + valueB();

test('A + B = 3', () => {
  const result = sum();
  expect(result).toBe(3);
});

test('A + B = 6', () => {
  const result = iscope(
    [
      [valueA, 2],
      [valueB, 4],
    ],
    sum,
  );
  expect(result).toBe(6);
});
```

## Dependency injection

```js
import iscope from 'iscope';
import express from 'express';

const useHttpContext = iscope(() => null);

const useHttpRequest = () => {
  const httpContext = useHttpContext();
  return httpContext.request;
};

const useHttpResponse = () => {
  const httpContext = useHttpContext();
  return httpContext.response;
};

const useRequestQuery = () => {
  const httpRequest = useHttpRequest();
  return httpRequest.query;
};

const useTextResult = (result) => {
  const response = useHttpResponse();
  response.send(result);
};

const sayHi = () => {
  const {name} = useRequestQuery();
  useTextResult(`Hi ${name}!!!`);
};

const app = express();
app.get('hi', (request, response) => {
  useHttpContext({request, response}, sayHi);
});
```
