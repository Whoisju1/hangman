import { Word } from './word';

describe('Word class', () => {
  it('should return an object with a word property', () => {
    const createdWord = new Word({
      hint: 'The author of this program',
      word: 'Juan',
    });

    expect(createdWord).toHaveProperty('word');
  });
});
