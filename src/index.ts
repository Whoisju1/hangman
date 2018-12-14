import '@babel/runtime/regenerator';
import 'webpack-hot-middleware/client?reload=true';
import './index.html';
import './style/main.scss';

import { GameContent } from './components/GameContent';
import { Header } from './components/Header/Header';
import { HintArea } from './components/HintArea';
import { LandingPage } from './components/LandingPage/LandingPage';
import { LetterButtons } from './components/LetterButtons';
import { MainContainer } from './components/MainContainer/';
import { StatsSection } from './components/StatsSection';
import { WordSection } from './components/WordSection';
import { GameStats } from './gameTools/StatsTracker/gameStats/gameStats';
import { WordStats } from './gameTools/StatsTracker/wordStats/wordStats';

// initiate stats
const wordStats = new WordStats();
const wholeGameStats = new GameStats(10);

const statsSection = new StatsSection(wholeGameStats, wordStats);
const gameContent = new GameContent(statsSection.fragment);
const letterButtons = new LetterButtons();
const hintArea = new HintArea('This is the best you ever seen! :)');
const wordSection = new WordSection('Fantastic');
gameContent.addContent(letterButtons.fragment);
gameContent.addContent(wordSection.fragment);
gameContent.addContent(hintArea.fragment);
const render = (elem: HTMLElement | DocumentFragment, container: HTMLElement) => {
  container.appendChild(elem);
};

const mainContainer = new MainContainer();
const header = new Header();
mainContainer.setContent(header.fragment);

type StartGame = (event: KeyboardEvent | MouseEvent) => void;

const startGame: StartGame = (e) => {
  const { ctrlKey } = e;
  let key = '';
  if (e instanceof KeyboardEvent) {
    key = e.key;
    if (key === 'Enter' && !ctrlKey) {
      initiateGame();
    }
  } else if (e instanceof MouseEvent) {
    initiateGame();
  }
};

const initiateGame = () => {
  landingPage.removeElement();
  mainContainer.addMultiContent(gameContent.fragment, );
};

const landingPage: LandingPage = new LandingPage(startGame);
mainContainer.addContent(landingPage.fragment);

document.body.addEventListener('keyup', startGame);

render(
  mainContainer.fragment,
  document.querySelector('#root') as HTMLElement,
);
