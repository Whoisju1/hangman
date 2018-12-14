import { ContainerBase } from '../../utils/htmlFunctionality/ContainerBase';

type Content = HTMLElement | DocumentFragment | Node;

export class GameContent extends ContainerBase {
  constructor(content?: Content) {
    super('game-content');
    if (content) {
      this.setContent(content);
    }
  }
}
