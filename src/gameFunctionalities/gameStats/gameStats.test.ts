import { GameStats } from './gameStats';

describe('GameStats', () => {
  const stats = new GameStats();
  describe('GameStats.guessesLeft', () => {
    it('it should be initialized to 5 when no parameter is passed in', () => {
      expect(stats.guessesLeft).toBe(5);
    });

    it('should be initialized to the number passed in as an argument when class is initialized', () => {
      const gameStats = new GameStats(20);
      expect(gameStats.guessesLeft).toBe(20);
    });
  });

  describe('WrongLettersGuessed', () => {
   describe('addToWrongLetterGuessed', () => {
    stats
    .addToWrongLettersGuessed('o')
    .addToWrongLettersGuessed('o');
    it('should not duplicate letters when added multiple times', () => {
       expect(stats.wrongLettersGuessed).toEqual(['o']);
     });

    it('should add nothing but single alphabet characters to the list', () => {
      stats.addToWrongLettersGuessed('&')
        .addToWrongLettersGuessed('Moon')
        .addToWrongLettersGuessed('9')
        .addToWrongLettersGuessed('$');
      expect(stats.wrongLettersGuessed).toEqual(['o']);
    });

    describe('isAlreadyGuesses method', () => {
      it('should return true if letter is already in the list of wrong letters guessed', () => {
        expect(stats.isAlreadyGuesses('o')).toBe(true);
      });

      it('should return false if the letter isn\'t already in the list', () => {
        expect(stats.isAlreadyGuesses('x')).toBe(false);
      });
    });
   });
  });
});
