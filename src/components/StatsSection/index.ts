import { GameStats } from '../../game/StatsTracker/gameStats/gameStats';
import { WordStats } from '../../game/StatsTracker/wordStats/wordStats';
import { ComponentBase } from '../../utils/htmlFunctionality/ComponentBase/componentBase';
import { createFragment } from '../../utils/htmlFunctionality/createFragment/createFragment';

export class StatsSection extends ComponentBase {
  protected _fragment = createFragment({
    wholeGameStats: this._stats,
    wordStats: this._wordStats,
  })`
    <div class="stats">
      <div class="stats__area stats__area--game-wide">
        <div class="stats__game-wide--wins">
          <span class="stats__heading">Wins:</span> ${({ wholeGameStats }) => wholeGameStats.numberOfWordsSolved}
        </div>
        <div class="stats__game-wide--losses">
          <span class="stats__heading">Losses:</span> ${({ wholeGameStats }) => wholeGameStats.failedAttemptsNumber}
        </div>
      </div>
      <div class="stats__area stats__area--word">
        <div class="stats__word--chances-left">
          <span class="stats__heading">Number of Chances Left:</span> ${({ wordStats }) => wordStats.guessesLeft}
        </div>
      </div>
    </div>
  `;
  protected _element = this._fragment.querySelector('*') as HTMLElement;

  constructor(private _stats: GameStats, private _wordStats: WordStats) {
    super();
  }
}
