import { Word } from './word';

describe('Word class', () => {
  const param = {
    hint: 'Plural for person.',
    word: 'people',
  };
  const createdWord = new Word(param);
  describe('Word Class initialization', () => {
    it('should return an object with a word property with the same value of the input\'s word property', () => {
      expect(createdWord.word).toBe(param.word);
    });

    it('should have a hint property with the same value of the hint property of the input', () => {
      expect(createdWord.hint).toBe(param.hint);
    });
    // tslint:disable-next-line:no-unused-expression
    new Word({
      hint: 'Nice word',
      word: 'nice',
    });

    it('should have a static property called `wordQuantity` that increments upon every initialization', () => {
      expect(Word.wordQuantity).toBe(2);
    });
  });
});
