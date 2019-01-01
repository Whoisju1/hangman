import { GameContent } from './components/GameContent';
import { Header } from './components/Header/Header';
import { HintArea } from './components/HintArea';
import { LandingPage } from './components/LandingPage/LandingPage';
import { LetterButtons } from './components/LetterButtons';
import { MainContainer } from './components/MainContainer/';
import { StatsSection } from './components/StatsSection';
import { WordSection } from './components/WordSection';
import { GamePlay } from './gameplay';
import { GameStats } from './gameTools/StatsTracker/gameStats/gameStats';
import { WordStats } from './gameTools/StatsTracker/wordStats/wordStats';
import { Word } from './word/word';

const words = [
  { word: 'one', hint: 'hint one' },
  { word: 'two', hint: 'hint two' },
  { word: 'three', hint: 'hint three' },
].map(({ hint, word }) => new Word({ hint, word }));
type GameInit = (...any: any) => any | void;

type StartGame = (gameInit: GameInit) => (event: KeyboardEvent | MouseEvent) => void;

// initiate Game Stats
export const wordStats = new WordStats();
export const wholeGameStats = new GameStats(10);

export let gamePlay = new GamePlay(words);
// instantiate Game Components
export const statsSection = new StatsSection(wholeGameStats, wordStats);
export const gameContent = new GameContent(statsSection.fragment);
export const letterButtons = new LetterButtons(gamePlay.attemptGuess);
export const hintArea = new HintArea(gamePlay.hint);
export const wordSection = new WordSection(gamePlay.mysteryWord);
export const mainContainer = new MainContainer();
export const header = new Header();

// set content on certain containers
mainContainer.setContent(header.fragment);
gameContent.addContent(wordSection.fragment);
gameContent.addContent(hintArea.fragment);
gameContent.addContent(letterButtons.fragment);

export default (startGame: StartGame) => {
  const initiateGame = () => {
    landingPage.removeElement();
    mainContainer.addMultiContent(gameContent.fragment);
  };

  const landingPage: LandingPage = new LandingPage(startGame(initiateGame));
  mainContainer.addContent(landingPage.fragment);
  document.body.addEventListener('keyup', startGame(initiateGame));
  return  mainContainer.fragment;
};
