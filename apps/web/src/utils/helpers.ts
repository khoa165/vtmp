export const filterUndefinedAttributes = (data: object) =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
