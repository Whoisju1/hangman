import { ContainerBase } from '../../utils/htmlFunctionality/ContainerBase';
import { createFragment } from '../../utils/htmlFunctionality/createFragment/createFragment';

export class WordSection extends ContainerBase {
  protected name = 'wordSection';
  private _characterElements: DocumentFragment[] = [];

  constructor(public word?: string) {
    super('wordSection');
    // tslint:disable-next-line:no-unused-expression
    word && this.setWord(word);
  }

  public makeCharacterElements = (word: string) => {
    this._characterElements = word
      .split('')
      .map((letter) => {
        return createFragment({ letter })`
        <div class="${() => this.name}__letter ${() => this.name}">
          ${(data) => data.letter.toLocaleUpperCase()}
        </div>`;
      });
  }

  public setWord = (word?: string) => {
    if (word) this.makeCharacterElements(word);
    this.emptyContainer();
    this.addMultiContent(...this._characterElements);
  }
}
