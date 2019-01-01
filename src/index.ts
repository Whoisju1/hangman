import '@babel/runtime/regenerator';
import 'webpack-hot-middleware/client?reload=true';
import './index.html';
import './style/main.scss';

import startGameFn from './compose';

const render = (elem: HTMLElement | DocumentFragment, container: HTMLElement) => {
  container.appendChild(elem);
};

type GameInit = (...any: any) => any | void;

type StartGame = (gameInit: GameInit) => (event: KeyboardEvent | MouseEvent) => void;

const gameInit: StartGame = (getItStarted) => {
  return (e) => {
    const { ctrlKey } = e;
    let key = '';
    if (e instanceof KeyboardEvent) {
      key = e.key;
      if (key === 'Enter' && !ctrlKey) {
        getItStarted();
      }
    } else if (e instanceof MouseEvent) {
      getItStarted();
    }
  };
};

render(
  startGameFn(gameInit),
  document.querySelector('#root') as HTMLElement,
);
