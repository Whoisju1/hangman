import { GameStats } from './gameStats';

describe('GameStats', () => {
  const gameStats = new GameStats(10);

  describe('progress getter', () => {
    it('should be initialized with value of 0', () => {
      expect(gameStats.progress).toBe('0/10');
    });

    it('should increment to one when incrementWrongAttemptsNumber method is called', () => {
      gameStats.incrementSolvedWordsNumber();
      gameStats.incrementSolvedWordsNumber();
      expect(gameStats.progress).toBe('2/10');
    });
  });

  describe('failedAttemptsNumber Getter', () => {
    it('should be initiated with a value of 0', () => {
      expect(gameStats.failedAttemptsNumber).toBe(0);
    });

    it('should increment by one when `incrementWrongAttemptsNumber` is called', () => {
      gameStats.incrementWrongAttemptsNumber();
      expect(gameStats.failedAttemptsNumber).toBe(1);
    });
  });

  describe('numberOfWordsSolved Getter', () => {
    const stats = new GameStats(10);
    it('should be initialized to 0', () => {
      expect(stats.numberOfWordsSolved).toBe(0);
    });

    it('should increment by one when incrementSolvedNumbers method is called', () => {
      stats.incrementSolvedWordsNumber();
      stats.incrementSolvedWordsNumber();
      expect(stats.numberOfWordsSolved).toBe(2);
    });
  });

  describe('wordsSolved Getter', () => {
    it('should be initiated to an empty array', () => {
      expect(gameStats.wordsSolved).toEqual([]);
    });

    it('should have one word added to it when addSolvedWord method is called', () => {
      gameStats.addSolvedWord('Pokemon');
      expect(gameStats.wordsSolved).toEqual(['Pokemon']);
    });

    it('should have two words added to it when addSolvedWord method is called again', () => {
      gameStats.addSolvedWord('Number');
      expect(gameStats.wordsSolved).toEqual(['Pokemon', 'Number']);
    });
  });

  describe('resetGameStats method', () => {
    it('should reset all the stats for the game', () => {
      gameStats.resetGameStats();
      expect(gameStats.failedAttemptsNumber).toBe(0);
      expect(gameStats.numberOfWordsSolved).toBe(0);
      expect(gameStats.progress).toBe('0/0');
      expect(gameStats.wordsSolved).toEqual([]);
    });
  });

});
