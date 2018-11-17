export class GameStats {
  private _wrongLettersGuessed: Set<string> = new Set();

  constructor(private _guessesLeft: number = 5) {}

  get guessesLeft() {
    return this._guessesLeft;
  }

  get wrongLettersGuessed(): string[] {
    return Array.from(this._wrongLettersGuessed.values());
  }

  public addToWrongLettersGuessed(letter: string) {
    const isSingleLetter: boolean = /^([a-z]|[A-Z])$/.test(letter);
    if (isSingleLetter) {
      this._wrongLettersGuessed.add(letter);
    }
    return this;
  }

  public isAlreadyGuesses(letter: string) {
    return this._wrongLettersGuessed.has(letter);
  }
}
