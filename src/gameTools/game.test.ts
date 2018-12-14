import { Game } from './game';

describe('Game', () => {
  const game = new Game();
  it('is defined', () => {
    expect(game).toBeDefined();
  });
});
