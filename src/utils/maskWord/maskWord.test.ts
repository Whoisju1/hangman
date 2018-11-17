import { maskWord } from './maskWord';
describe('maskWord', () => {
  it('should return a string of dashes', () => {
    expect(maskWord('one')).toBe('___');
  });

  it('should return a string that has equal length of the input string', () => {
    const arg = 'desk';
    expect(maskWord(arg).length).toBe('desk'.length);
  });
});
