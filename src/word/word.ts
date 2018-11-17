 export class Word {
  /**
   * @type {Number}
   * @description increments by one every time a word is created.
   *              It holds the number of words that has been created thus far
   */
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
