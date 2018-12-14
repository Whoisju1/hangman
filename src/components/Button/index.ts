import { ComponentBase } from '../../utils/htmlFunctionality/ComponentBase/componentBase';
import { createFragment } from '../../utils/htmlFunctionality/createFragment/createFragment';

export class Button extends ComponentBase {
  protected _fragment = createFragment({ letter: this._letter })`
    <button class="button button__letter">
      <svg class="button__letter--svg">
        <circle class="button__letter--outline" cx="50%" cy="50%" r="40%"></circle>
        <text
          class="button__letter--key"
          x="50%"
          y="53%"
          >
          ${({ letter }) => letter.toUpperCase()}
        </text>
      </svg>
    </button>
  `;

  protected _element = this._fragment.querySelector('*') as HTMLElement;

  constructor(private _letter: string, private _onPress: (letter: string) => void) {
    super();
    this._element.addEventListener('click', this._handlePress);
  }

  private _handlePress = (e: MouseEvent) => {
    // tslint:disable-next-line:no-console
    console.log(this._letter);
  }
}
