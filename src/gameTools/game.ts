import { statsSection, wordSection, wordStats } from '../compose';
import { GameStats } from '../gameTools/StatsTracker/gameStats/gameStats';
import { WordStats } from '../gameTools/StatsTracker/wordStats/wordStats';
import { evaluateGuess, IGuessEvalResult } from '../utils/evaluateGuess/evaluateGuess';
import { maskWord } from '../utils/maskWord/maskWord';
import { replace } from '../utils/replace/replace';
import { Word } from '../word/word';

export class Game {
  public static words: Word[];
  public gameStats: GameStats;
  public wordStats: WordStats;
  public mysteryWord: string = maskWord(this.currentWord);

  private _currentWordIndex: number = 0;

  constructor() {
    this.gameStats = new GameStats(Game.words.length);
    this.wordStats = new WordStats(5);
  }

  get currentWord() {
    return Game.words[this._currentWordIndex].word;
  }

  public updateMysteryWord = (replacement: IGuessEvalResult) => {
    this.mysteryWord = replace(this.mysteryWord, replacement);
  }

  public updateCurrentWord = () => {
    this._currentWordIndex++;
  }

  public displayWord = () => {
    const maskedWord = maskWord(this.currentWord);
    wordSection.setWord(maskedWord);
  }

  public makeLetterGuess = (letterGuess: string) => {
    const guessResult = evaluateGuess({
      answer: this.currentWord,
      letterGuessed: letterGuess,
    });

    const isCorrect = !!guessResult.indexes.length;

    if (isCorrect) {
      this.updateMysteryWord(guessResult);
      wordSection.setWord(this.mysteryWord);
    } else {
      wordStats.decrementGuessesLeft();
      statsSection.printStats({ guessesLeft: this.wordStats.guessesLeft });
    }
  }
}
