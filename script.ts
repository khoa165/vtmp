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

// Custom rule of lowercase function name
const UpperCaseVariable = 'UPPERCASE';
console.log('UpperCaseVariable', UpperCaseVariable);

const upperCaseFunction = () => {
  console.log('this is a function with uppercase');
};

upperCaseFunction();
upperCaseFunction();
upperCaseFunction();
upperCaseFunction();
upperCaseFunction();
upperCaseFunction();
upperCaseFunction();
upperCaseFunction();
upperCaseFunction();
