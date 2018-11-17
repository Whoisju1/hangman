import { isNumber } from 'util';

export interface IGuessEvalResult {
  key: string;
  indexes: number[];
}

interface IParams {
  answer: string;
  letterGuessed: string;
}
/**
 * This function verifies whether or not a letter is included in the word and where
 * @param {Object} guessAndAnswer - An object that bears the target word and the letter guessed
 * @param {string} guessAndAnswer.answer - The word that the user is trying to get
 * @param {string} guessAndAnswer.letterGuessed - The letter that the user guessed
 * @returns {Array<{ key: string, indexes: number[]}>} - An array of the letter pressed with its
 *                                                     indexes in the target word
 */
export const evaluateGuess = ({ answer, letterGuessed: key }: IParams): IGuessEvalResult => {
  const indexes: number[] = answer.split('')
    .reduce((previousIndex, letter, index) => {
      // if the letter id found in the word push its index into the indexes array
      // if the letter does not exist in the word the array will be empty
      if (letter === key) previousIndex.push(index);
      return previousIndex;
    }, ([] as number[]));

  const evaluationInfo: IGuessEvalResult = {
    indexes,
    key,
  };

  return evaluationInfo;
};
