import { makeDashes } from './makeDashes';
/**
 * This takes a word and return a string of dashes of the same length
 * @param {string} word - This is the word to be solved
 * @return {string} This is a string of nothing but dashes proportionate to the length of the input string
 */
describe('makeDashes', () => {
  it('should return a string of dashes', () => {
    expect(makeDashes('one')).toBe('___');
  });

  it('should return a string that has equal length of the input string', () => {
    const arg = 'desk';
    expect(makeDashes(arg).length).toBe('desk'.length);
  });
});
