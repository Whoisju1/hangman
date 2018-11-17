/**
 * @class
 * @param {{ word: string, hint: string}} wordObject
 * @param {string} wordObject.word - The word to be found
 * @param {string} wordObject.hint - This is a clue to what what needs to be solved
 */
export class Word {
  public static wordQuantity = 0;

  private _word: string;
  private _hint: string;
  constructor({ word, hint }: { word: string, hint: string }) {
    this._hint = hint;
    this._word = word;
    // increment wordQuantity by one on each word creation
    Word.wordQuantity ++;
  }

  get word(): string {
    return this._word;
  }

  get hint(): string {
    return this._hint;
  }
}
