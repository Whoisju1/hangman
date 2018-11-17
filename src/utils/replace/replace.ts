import { IGuessEvalResult } from '../evaluateGuess/evaluateGuess';
type Replace = (word: string, replacement: IGuessEvalResult) => string;

/**
 * This function is used to replace characters with the guesses of the user
 * @param word - this is a string with dashes, and will have other characters if partially solved/
 * @param replacement - This is a the letter that is the placement with the indexes where it should
 *                      be placed in the string
 * @returns - a string with the letter for the given indexes
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
