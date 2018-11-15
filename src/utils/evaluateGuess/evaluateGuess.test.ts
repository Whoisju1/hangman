import { evaluateGuess } from './evaluateGuess';

describe('evalGuess function', () => {
  it('should return an array of objects that contain' +
  ' the letter and it\'s index where it is found in the answer', () => {
    const expected = [
      {
        index: 0,
        key: 'e',
      },
      {
        index: 7,
        key: 'e',
      },
    ];

    expect(evaluateGuess({ answer: 'evaluate', letterGuessed: 'e' })).toEqual(expected);
  });

  it('should return an empty array if the guessed letter does not match.', () => {
    expect(evaluateGuess({ answer: 'answer', letterGuessed: 'z' })).toEqual([]);
  });
});
