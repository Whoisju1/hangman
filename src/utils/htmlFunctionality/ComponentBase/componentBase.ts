export interface IComponent {
  fragment: DocumentFragment;
  removeClasses: (className: string) => void;
  addClass: (classNames: string | string[]) => void;
}

export abstract class ComponentBase implements IComponent {
  protected abstract _fragment: DocumentFragment;
  protected abstract _element: HTMLElement;

  get fragment() {
    return this._fragment;
  }

  public addClass(classNames: string | string[]) {
    if (Array.isArray(classNames)) {
      classNames.forEach((className) => this._element.classList.add(className));
      return this;
    } else {
      this._element.classList.add(classNames);
    }
  }

  public removeClasses(className: string) {
    this._element.classList.remove(className);
    return this;
  }

  public remove() {
    this._element.remove();
    return this;
  }
}
