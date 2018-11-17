export class GameStats {
  private _numberOfWordsSolved: number = 0;
  private _numberOfWords: number = 0;
  private _wordsSolved: Set<string> = new Set();
  private _wrongGuessesAttempts: number = 0;

  constructor(numberOfWords: number) {
    this._numberOfWords = numberOfWords;
  }

  get progress() {
    return `${this._numberOfWordsSolved}/${this._numberOfWords}`;
  }

  get wordsSolved(): string[] {
    return Array.from(this._wordsSolved.values());
  }

  get numberOfWordsSolved(): number {
    return this._numberOfWordsSolved;
  }

  get failedAttemptsNumber() {
    return this._wrongGuessesAttempts;
  }

  public incrementSolvedWordsNumber() {
    this._numberOfWordsSolved++;
  }

  public incrementWrongAttemptsNumber() {
    this._wrongGuessesAttempts++;
  }

  public addSolvedWord(word: string) {
    this._wordsSolved.add(word);
  }

  public resetGameStats() {
    this._numberOfWords = 0;
    this._numberOfWordsSolved = 0;
    this._wrongGuessesAttempts = 0;
    this._wordsSolved.clear();
  }
}
