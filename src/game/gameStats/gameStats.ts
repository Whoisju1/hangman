export class GameStats {
  /**
   * @description Wrong letters guessed by the user. It initiates as an empty set
   * set was used because it is easy to manage and stores no duplicates
   */
  private _wrongLettersGuessed: Set<string> = new Set();

  /**
   * Creates an instance of game stats.
   * @param [_guessesLeft = 5] - This is the number of guesses user has before he loses
   */
  constructor(private _guessesLeft: number = 5) {}

  /**
   * @description Gets guesses left. This is the number of guesses the user has left until they loose
   */
  get guessesLeft() {
    return this._guessesLeft;
  }

  /**
   * @description Gets wrong letters guessed collection
   * @returns {string[]}
   */
  get wrongLettersGuessed(): string[] {
    return Array.from(this._wrongLettersGuessed.values());
  }

  /**
   * @description Adds letter to `_wrongLettersGuessed` collection. Only single alphabets are stored
   * @param {string} letter - The letter that is being added
   * @returns the object for chaining object purposes
   */
  public addToWrongLettersGuessed(letter: string): GameStats {
    const isSingleLetter: boolean = /^([a-z]|[A-Z])$/.test(letter);
    if (isSingleLetter) {
      this._wrongLettersGuessed.add(letter);
    }
    return this;
  }

  /**
   * clearAlreadyGuessed
   * @description This method empties the wrongLetterGuessed collection
   */
  public clearAlreadyGuessed(): GameStats {
    this._wrongLettersGuessed.clear();
    return this;
  }

  /**
   * @description Determines whether the passed in letter is already been guessed by the user
   * @param {string} letter - The letter that is being checked
   * @returns true if letter is present in collection and false if it is not
   */
  public isAlreadyGuesses(letter: string): boolean {
    return this._wrongLettersGuessed.has(letter);
  }
}
