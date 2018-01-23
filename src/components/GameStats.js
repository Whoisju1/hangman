class GameStats {
  constructor(wins, guessesLeft) {
    this.wins = wins;
    this.guessesLeft = guessesLeft;
    this.decrementGuesses = this.decrementGuesses.bind(this);
    this.resetWins = this.resetWins.bind(this);
    this.incrementWins = this.incrementWins.bind(this);
    this.resetGuesses = this.resetGuesses.bind(this);
  }

  resetWins(num = 0) {
    this.wins = num;
  }

  resetGuesses(num = 5) {
    this.guessesLeft = num;
  }

  incrementWins(num = 1) {
    this.wins = this.wins + num;
    return this;
  }

  decrementGuesses(num = 1) {
    this.guessesLeft = this.guessesLeft - num;
    return this;
  }

  resetAllStats() {
    this.resetGuesses();
    this.resetWins();
  }
}

export default GameStats;
