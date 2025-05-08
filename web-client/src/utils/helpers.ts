export const titleCase = (word: string): string => {
  if (!word) {
    return '';
  }
  const wordLowerCase = word.toLowerCase();
  return wordLowerCase.charAt(0).toUpperCase() + wordLowerCase.slice(1);
};
