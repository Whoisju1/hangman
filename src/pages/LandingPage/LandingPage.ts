import { ComponentBase } from '../../utils/htmlFunctionality/ComponentBase/componentBase';
import { createFragment, ICreateFragment } from '../../utils/htmlFunctionality/createFragment/createFragment';

export class LandingPage extends ComponentBase {
  protected _fragment = createFragment({})`
    <div class="container">
      <header class="header">
        <div class="header__logo">
          Hangman
        </div>
      </header>
      <h1 class="intro">
        Press <span class="intro--text">Enter</span> to start game!!!
      </h1>
    </div>
  `;

  protected _element = this._fragment.querySelector('*') as HTMLElement;

  constructor(public startGame: () => void) {
    super();
    const introText = super.fragment.querySelector('.intro--text') as HTMLElement;
    introText.addEventListener('click', this.startGame);
  }
}
