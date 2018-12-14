import { ComponentBase } from '../ComponentBase/componentBase';
import { createFragment } from '../createFragment/createFragment';

type Content = HTMLElement | DocumentFragment | Node;

export abstract class ContainerBase extends ComponentBase {
  protected _fragment = createFragment({ containerClass: this._containerName })`
    <div class="container container--${(data) => data.containerClass}">
      <!--Content Goes Here -->
    </div>
  `;

  protected _element = this._fragment.querySelector('.container') as HTMLElement;
    constructor(private _containerName: string, content?: Content | Content[]) {
      super();
      if (content) {
        Array.isArray(content)
        ? this.addMultiContent(...content)
        : this.setContent(content);
      }
    }

  public setContent = (content?: Content | string | Content[]) => {
    if (!content) return;
    if (typeof content === 'string') {
      this._element.innerHTML = content;
    } else if (Array.isArray(content)) {
      this.emptyContainer();
      this.addMultiContent(...content);
    } else {
      this.emptyContainer();
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
