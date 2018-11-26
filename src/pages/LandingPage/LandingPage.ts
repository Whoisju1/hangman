import { createFragment } from '../../utils/htmlFunctionality/createFragment/createFragment';

export const LandingPage = createFragment({})`
  <header class="header">
    <div class="header__logo">
        Hangman
    </div>
  </header>
  <h1 class="intro">
    Press <span class="intro--text">Enter</span> to start game!!!
  </h1>
`;

const introText: HTMLElement = LandingPage.querySelector('.intro--text') as HTMLElement;

introText.addEventListener('click', (e) => alert('Start Game!!!'));
