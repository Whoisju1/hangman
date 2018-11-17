import { IGuessEvalResult } from '../evaluateGuess/evaluateGuess';
type Replace = (word: string, replacement: IGuessEvalResult) => string;

/**
 * @example
 * // returns "__s__s"
 * replace("______", {  key: "s", indexes: [2, 5]});
 * @param {string} word - A string of dashes which may also contain
 * other letters if the word is partially solved
 * @param {{ key: string, indexes: Number[]}} replacement - A single character with an array of indexes
 *                      be placed in the string
 * @returns {string} a string with dashes replaced with a character at specified indexes
 * @description This function replaces dashes with a provided alphabetic character at the
 * specified indexes. Indexes of value -1 are removed from the indexes array so have no impact on the resultant string
 */

export const replace: Replace = (word, { key, indexes }) => {
  const resultStr = indexes
    .filter((index) => index !== -1) // remove indexes with the value of -1
    .reduce((previous, letterIndex) => {
        return (
          previous.substring(0, letterIndex)
          + key
          + previous.substring(letterIndex + 1, previous.length)
        );
    }, word);

  // return altered string as output
  return resultStr;
};
