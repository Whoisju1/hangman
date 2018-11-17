/**
 * @example
 * // returns "____"
 * makeDashes("game");
 * @param {string} targetWord - this is the word to be solved
 * @returns {string} a string of equal length containing nothing but underscores to represent the word to be solved
 * @description This function takes in a word that is to be solved by the user and turns it into a string
 *              of underscores
 */
export const maskWord = (targetWord: string): string => targetWord
  .split('') // split the word into an array of single characters
  .fill('_', 0, targetWord.length) // make an array filled with underscores of equal length with the target word
  .join(''); // join the array items and make into a single string again
