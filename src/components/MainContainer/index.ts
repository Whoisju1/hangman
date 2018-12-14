import { ContainerBase } from '../../utils/htmlFunctionality/ContainerBase';

type Content = HTMLElement | DocumentFragment | Node;

export class MainContainer extends ContainerBase {
  constructor(content?: Content) {
    super('main');
    if (content) {
      this.setContent(content);
    }
  }
}
