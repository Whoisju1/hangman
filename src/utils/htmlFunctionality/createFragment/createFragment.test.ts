import { createFragment } from './createFragment';

describe('createFragment', () => {
  const testString = 'testString';
  const elementClass = 'basic-implementation';

  const basicImplementation = createFragment({})`
    <div class=${elementClass}>${testString}</div>
  `;
  const foundElement = basicImplementation.querySelector(`.${elementClass}`);

  it('should create an html fragment', () => {
    expect(foundElement).not.toBe(null);
  });

  it('should contain the interpolated text', () => {
    expect((foundElement as Element).textContent).toBe(testString);
  });
});
