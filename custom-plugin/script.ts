const foo = 'bar';
console.log('foo', foo);

interface MyData {
  name: string;
}

interface MyResponse {
  message: string;
  status: number;
}

const post = <ReqBody, Response>(body: ReqBody): Response => {
  console.log();
  const res: Response = {
    message: `data from body: ${body}`,
    status: 200,
  } as Response;

  return res;
};

post<MyData, MyResponse>({ name: 'test generics' });

const UpperCaseFunction = () => {
  console.log('this is a function with uppercase');
};

UpperCaseFunction();
