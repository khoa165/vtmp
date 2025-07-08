import { hasAtLeast, last } from 'remeda';

export const splitFirstAndLastName = (name: string) => {
  const firstAndLastName = name.split(' ');
  if (!hasAtLeast(firstAndLastName, 2)) {
    throw Error('Name must have at least two words');
  }
  const firstName = firstAndLastName.slice(0, -1).join(' ');
  const lastName = last(firstAndLastName);
  return { firstName, lastName };
};
