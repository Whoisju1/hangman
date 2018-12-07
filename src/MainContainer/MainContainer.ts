import { ComponentBase } from '../utils/htmlFunctionality/ComponentBase/componentBase';
import { createFragment } from '../utils/htmlFunctionality/createFragment/createFragment';

type Content = HTMLElement | DocumentFragment | Node;

export class MainContainer extends ComponentBase {
  protected _fragment = createFragment({})`
    <div class="container">
      <!--Content Goes Here -->
    </div>
  `;

  protected _element = this._fragment.querySelector('.container') as HTMLElement;

  constructor(content?: Content) {
    super();
    if (content) {
      this.setContent(content);
    }
  }

  public setContent = (content?: Content | string) => {
    if (!content) return;
    if (typeof content === 'string') {
      this._element.innerHTML = content;
    } else {
      this._element.innerHTML = '';
      this._element.appendChild(content);
    }
  }

  public addContent = (content: Content) => {
    this._element.appendChild(content);
  }

  public emptyContainer = () => {
    this._element.innerHTML = '';
  }

  public addMultiContent = (...content: Content[]) =>
    content.forEach((el) => this._element.appendChild(el))
}
