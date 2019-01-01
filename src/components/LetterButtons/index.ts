import { ContainerBase } from '../../utils/htmlFunctionality/ContainerBase';
import { Button } from '../Button';

export class LetterButtons extends ContainerBase {
  constructor(onPress: (key: string) => void) {
    const letters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'];

    const buttons: DocumentFragment[] = letters.map((letter) => {
      const btn = new Button(letter, onPress);
      return btn.fragment;
    });
    super('buttons', buttons);
  }
}
