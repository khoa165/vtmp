export const add = (a: number, b: number) => a + b;

export const formatEnumName = (name: string) => {
  return name
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
