import { ComponentBase } from '../../utils/htmlFunctionality/ComponentBase/componentBase';
import { createFragment } from '../../utils/htmlFunctionality/createFragment/createFragment';

export class HintArea extends ComponentBase {
  protected _fragment = createFragment({ hint: this.hint })`
    <div class="hint">${({ hint = '' }) => hint}</div>
  `;
  protected _element = this._fragment.querySelector('*') as HTMLElement;

  constructor(public hint?: string) {
    super();
    // tslint:disable-next-line:no-unused-expression
    hint && this.setHint(hint);
  }

  public setHint = (hint: string) => this._element.innerText = hint;
}
