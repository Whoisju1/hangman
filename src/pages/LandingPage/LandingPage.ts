import { ComponentBase } from '../../utils/htmlFunctionality/ComponentBase/componentBase';
import { createFragment, ICreateFragment } from '../../utils/htmlFunctionality/createFragment/createFragment';

export class LandingPage extends ComponentBase {
  protected _fragment = createFragment({})`
      <h1 class="intro">
        Press <span class="intro--text">Enter</span> to start game!!!
      </h1>
  `;

  protected _element = this._fragment.querySelector('*') as HTMLElement;

  constructor(public startGame: (e: MouseEvent | KeyboardEvent) => void) {
    super();
    const introText = super.fragment.querySelector('.intro--text') as HTMLElement;
    introText.addEventListener('click', this.startGame);
    introText.addEventListener('keyup', this.startGame);
  }

  public removeElement = () => {
    try {
      const player = (this._element.animate as any)(
        [
          {
            opacity: 1,
            transform: 'scale(1)',
          },
          {
            opacity: 0,
            transform: 'scale(1.1)',
          },
        ],
        {
          duration: 600,
          easing: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          fill: 'forwards',
        }
      );

      player.addEventListener('finish', () => {
        this._element.remove();
      });
    } catch (e) {
      this._element.remove();
    }
  }
}
