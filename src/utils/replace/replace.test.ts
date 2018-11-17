import { replace } from './replace';
describe('replace', () => {
  const word = '______';
  const replacement = {
    indexes: [2, 5],
    key: 's',
  };

  it('should replace the dashes when given the keys and indexes of where the replacements should be done', () => {
    expect(replace(word, replacement)).toBe('__s__s');
  });

  it('should return a string of equal length with the word (first) parameter', () => {
    expect(replace(word, replacement).length).toBe(word.length);
  });

  it('should not replace the dash with a letter if the value of the index is -1', () => {
    expect(replace(word, { key: 'h', indexes: [-1, -1]}));
  });
});
