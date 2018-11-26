import '@babel/runtime/regenerator';
import 'webpack-hot-middleware/client?reload=true';
import './index.html';
import './style/main.scss';

import { LandingPage } from './pages/LandingPage/LandingPage';

const render = (elem: HTMLElement | DocumentFragment, container: HTMLElement) => {
  container.appendChild(elem);
};

render(
  LandingPage,
  document.querySelector('#root') as HTMLElement,
);
