import { ErrorInfo } from 'react';

export const logError = (error: Error, info: ErrorInfo) => {
  // Can be used to connect to external logging API
  console.error('Error: ', error);
  console.error('Error Info ', info);
};
