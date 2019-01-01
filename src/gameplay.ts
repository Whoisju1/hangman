import { hintArea, wordSection, wordStats } from './compose';
import * as gameElements from './compose';
import { GameStats } from './gameTools/StatsTracker/gameStats/gameStats';
import { WordStats } from './gameTools/StatsTracker/wordStats/wordStats';
import { evaluateGuess, IGuessEvalResult } from './utils/evaluateGuess/evaluateGuess';
import { maskWord } from './utils/maskWord/maskWord';
import { replace } from './utils/replace/replace';
import { Word } from './word/word';

export class GamePlay {
  private _gameStats = new GameStats(this._words.length);
  private _wordStats = new WordStats();
  private _currentWordIndex: number = 0;
  private _hint = this._currentWord.hint;
  private _mysteryWord: string = maskWord(this._currentWord.word);
  constructor(private _words: Word[]) {}

  private get _currentWord() {
    return this._words[0];
  }

  get mysteryWord() {
    return this._mysteryWord;
  }

  get hint() {
    return this._hint;
  }

  public attemptGuess = (key: string) => {
    // attempt guess
    const isAlreadyGuessed: boolean = this._wordStats.isAlreadyGuesses(key);
    if (isAlreadyGuessed) {
      // TODO: Indicate that letter is already tried. Eg. Wiggle button
      return;
    }
    const guessEvaluation = evaluateGuess({
      answer: this._currentWord.word,
      letterGuessed: key,
    });

    const isGuessCorrect: boolean = !!guessEvaluation.indexes.length;

    if (isGuessCorrect) {
      this._updateMysteryWord(guessEvaluation);
    } else {
      this._wordStats.addToWrongLettersGuessed(key);
      this._wordStats.decrementGuessesLeft();
      gameElements.statsSection.printStats({
        guessesLeft: this._wordStats.guessesLeft,
      });
    }

    if (!this._wordStats.guessesLeft) {
      // TODO: display that user has lost in modal and add actions to be taken when modal is deactivated
      this._gameStats.incrementWrongAttemptsNumber();
      alert('you lost'); // TEMPORARY
    }
  }

  private _resetEntireGame = () => {
    // reset entire game
  }

  private _updateMysteryWord = (replacement: IGuessEvalResult) => {
    this._mysteryWord = replace(this._mysteryWord, replacement);
    gameElements.wordSection.setWord(this._mysteryWord);
  }

}
