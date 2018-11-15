export interface IGuessEvalResult {
  key: string;
  index: number;
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
 * @returns {Array<{ key: string, index: number}>} - An array of the letter pressed with its indexes in the target word
 */
export const evaluateGuess = ({ answer, letterGuessed }: IParams): IGuessEvalResult[] => (
  answer.split('')
    .reduce((arr: IGuessEvalResult[], letter, index) => {
      if (letterGuessed === letter) {
        const obj = {
          index,
          key: letterGuessed,
        };
        arr.push(obj);
      }
      return arr;
    }, [])
);
