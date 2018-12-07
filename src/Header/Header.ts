import { ComponentBase } from '../utils/htmlFunctionality/ComponentBase/componentBase';
import { createFragment } from '../utils/htmlFunctionality/createFragment/createFragment';

export class Header extends ComponentBase {
  protected _fragment = createFragment({})`
    <header class="header">
      <div class="header__logo">
        Hangman
      </div>
    </header>
  `;

  protected _element = this._fragment.querySelector('.header') as HTMLElement;
}
