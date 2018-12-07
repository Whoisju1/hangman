import '@babel/runtime/regenerator';
import 'webpack-hot-middleware/client?reload=true';
import './index.html';
import './style/main.scss';

import { Header } from './Header/Header';
import { MainContainer } from './MainContainer/MainContainer';
import { LandingPage } from './pages/LandingPage/LandingPage';

const render = (elem: HTMLElement | DocumentFragment, container: HTMLElement) => {
  container.appendChild(elem);
};

const mainContainer = new MainContainer();
const header = new Header();
mainContainer.setContent(header.fragment);

type StartGame = (event: KeyboardEvent | MouseEvent) => void;

const startGame: StartGame = (e) => {
  const { ctrlKey, type } = e;
  let key = '';
  if (e instanceof KeyboardEvent) {
    key = e.key;
    if (key === 'Enter' && !ctrlKey) landingPage.removeElement();
  } else if (e instanceof MouseEvent) {
    landingPage.removeElement();
  }
};

const landingPage: LandingPage = new LandingPage(startGame);
mainContainer.addContent(landingPage.fragment);

document.body.addEventListener('keyup', startGame);

render(
  mainContainer.fragment,
  document.querySelector('#root') as HTMLElement,
);
