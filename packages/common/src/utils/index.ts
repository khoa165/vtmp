import { capitalize } from 'remeda';

export const formatEnumName = (name: string) => {
  return name
    .toLowerCase()
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');
};
