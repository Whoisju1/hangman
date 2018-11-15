export const makeDashes = (word: string): string => (
  word.split('')
  .fill('_', 0, word.length)
  .join('')
);
