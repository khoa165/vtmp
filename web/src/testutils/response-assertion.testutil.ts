import { expect } from 'chai';
import { Response } from 'supertest';

export const expectErrorsArray = ({
  res,
  statusCode,
  errorsCount,
}: {
  res: Response;
  statusCode: number;
  errorsCount: number;
}) => {
  expect(res.statusCode).to.equal(statusCode);
  expect(res.body).to.have.property('errors');
  expect(res.body.errors).to.be.an('array');
  expect(res.body.errors).to.have.lengthOf(errorsCount);
};
export const expectSuccessfulResponse = ({
  res,
  statusCode,
}: {
  res: Response;
  statusCode: number;
}) => {
  expect(res.statusCode).to.equal(statusCode);
  expect(res.body).to.have.property('data');
};
