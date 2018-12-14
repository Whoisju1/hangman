import { ComponentBase } from '../../utils/htmlFunctionality/ComponentBase/componentBase';
import { createFragment } from '../../utils/htmlFunctionality/createFragment/createFragment';

type Content = HTMLElement | DocumentFragment | Node;

interface IData {
  title: {
    main: string,
    sub?: string,
  };
}

type DisplayEvent = (container: HTMLElement) => void;

export class Modal extends ComponentBase {

  set onShow(func: DisplayEvent) {
    this._onShow = func;
  }

  set onHide(func: DisplayEvent) {
    this._onHide = func;
  }
  protected _fragment = createFragment({ ...this.data })`
  <div class="modal__backdrop">
    <div class="modal">
      <div class="modal__title">
        <h2 class="modal__title--main">${({ title }) => title.main}</h2>
        ${({ title }) => title.sub ? `<h3 class="modal__title--sub">${title.sub}</h3>` : ''}
      </div>
      <div class="modal__content"></div>
    </div>
  </div>
  `;
  protected _element = this._fragment.querySelector('*') as HTMLElement;

  private _onShow: DisplayEvent | undefined;
  private _onHide: DisplayEvent | undefined;

  constructor(public data: IData, content: Content) {
    super();
    (this._fragment.querySelector('.modal__content') as HTMLElement).appendChild(content);
  }

  public setContent = (content: Content | string) => {
    const contentContainer = this._element.querySelector('.modal__content') as HTMLElement;
    if (typeof content === 'string') {
      contentContainer.innerHTML = content;
    } else {
      contentContainer.appendChild(content);
    }
  }

  public setTitle = (title: string) => {
    (this._element.querySelector('.modal__title') as HTMLElement)
    .innerText = title;
  }

  public show = () => {
    if (this._onShow) {
      this._onShow(this._element);
    }
    this.remove();
  }

  public hide = () => {
    if (this._onHide) {
      this._onHide(this._element);
    }
    document.body.appendChild(this._fragment);
  }
}
