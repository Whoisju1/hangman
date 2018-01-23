import GameStats from './GameStats';

const gameConfig = (words, methods) => {
  const [makeElem, makeDashes, guesses, replace, inc] = methods;

  const stats = new GameStats(0, 5);

  // create and place elements into DOM when game initially starts
  const game = makeElem()
    .addClass('game')
    .appendTo(global.document.body);

  const displayHeadScore = makeElem()
    .addClass('display__heading')
    .addClass('display__heading--score')
    .appendTo(game);

  const displayContentWord = makeElem()
    .addClass('display__content')
    .addClass('display__content--word')
    .appendTo(game);

  const wrongGuessesDiv = makeElem()
    .addClass('wrong-guesses')
    .appendTo(game);

  // display hint heading
  makeElem()
    .addClass('game__hint-head')
    .addClass('display__heading')
    .addClass('display__heading--hint')
    .text('Hint')
    .appendTo(game);

  const displayContentHint = makeElem()
    .addClass('display__content')
    .addClass('display__content--hint')
    .html(`<p class="game-text hint-text">${words[0].hint}</p>`)
    .appendTo(game);

  const { body } = global.document;

  // set initial values for game

  let input = [];

  const userGuesses = new Set();

  // this sets the count to zero
  // the inc function returns zero when it is passed no arguments
  // otherwise it takes a number as an argument and turns that number incremented by 1
  // inc(5) is 5 + 1, which returns 6.

  let count = inc();

  let { word } = words[count];

  let puzzleWord = makeDashes(word);

  // ############ SETTING INITIAL DOM ELEMENTS ###############
  const winsDiv = makeElem()
    .addClass('game__score--wins')
    .html(`wins: <span class="game__score--tally">${stats.wins}</span>`)
    .appendTo(displayHeadScore);
  const chancesDiv = makeElem()
    .addClass('game__score--chances')
    .html(`chances: <span class="game__score--tally">${stats.guessesLeft}</span>`)
    .appendTo(displayHeadScore);

  const wordProgressDiv = makeElem()
    .addClass('game-text')
    .addClass('display__content--text')
    .html(puzzleWord)
    .appendTo(displayContentWord);

  const modalBackdrop = makeElem()
    .addClass('modal__backdrop')
    .hide()
    .appendTo(body);
  const modal = makeElem()
    .addClass('modal')
    .appendTo(modalBackdrop);

  const modalMessage = makeElem()
    .addClass('modal--message')
    .appendTo(modal);

  const mobileInput = makeElem()
    .addClass('mobile-input');

  mobileInput.appendTo(game);

  let canIncScores = true;
  let acknowledgeGuesses = true;

  // GAME IS PROGRESSES OR RESTARTS BASED ON THE ARGUMENTS PASSED
  const resetWord = (callback = () => {}) => {
    const startOver = words[count] === words[words.length - 1];

    return (
      () => {
        if (startOver) {
          count = 0;
          stats.resetWins();
        } else {
          count = inc(count);
        }
        word = words[count].word;
        puzzleWord = makeDashes(word);
        canIncScores = true;
        stats.resetGuesses();
        input = [];
        userGuesses.clear();
        wordProgressDiv.text(puzzleWord);
        // print hint to screen
        displayContentHint.html(`<p class="game-text hint-text">${words[count].hint}</p>`)
          .addClass('display__content');
        winsDiv.html(`wins: <span class="game__score--tally">${stats.wins}</span>`);
        chancesDiv.html(`chances: <span class="game__score--tally">${stats.guessesLeft}</span>`);
        // empty the wrong guesses div
        wrongGuessesDiv.empty();

        callback();
      }
    );
  };

  // THE FUNCTION THAT RUNS UPON USER GUESS
  const onGuess = (e) => {
    // this function tests the user input to find out if it is an alphabetical character
    const isAlphabet = str => /^[a-zA-Z()]$/.test(str);
    const userInput = ((event, alphabetTest) => {
      // capture key stroke
      const { key = event.target.innerText } = event;

      // if use input is a letter make it lower case and return it
      return (alphabetTest(key)) ? key.toLowerCase() : key;
    })(e, isAlphabet);

    const { ctrlKey = false } = e;

    // only precede if CTRL isn't pressed along with alphabet key
    if (ctrlKey) return;

    //
    const userGuess = guesses(word, userInput);

    const letterElements = Array.from(document.querySelectorAll('.mobile-input__letter'));

    const isGuessWrong = (() => (
      !words[count].isIncluded(userInput) &&
      canIncScores &&
      stats.guessesLeft >= 1 &&
      isAlphabet(userInput) &&
      !userGuesses.has(userInput)
    ))();

    const isGuessCorrect = (() => (
      words[count].isIncluded(userInput) &&
      canIncScores &&
      stats.guessesLeft >= 1 &&
      isAlphabet(userInput) &&
      !userGuesses.has(userInput)
    ))();

    // if letter is not found highlight letter in red
    letterElements.forEach(el => el.highLight(isGuessWrong, (element) => {
      // console.log('element -- wrong: ', element.length);
      if (userInput === element.textContent) {
        element.style.color = '#e74c3c';
        element.style.border = '.5px solid #e74c3c';
        element.addClass('wiggle-animation');
      }
    }));
    
    // if letter is found highlight letter in green
    letterElements.forEach(el => el.highLight(isGuessCorrect, (element) => {
      // console.log('element -- right: ', element);
      if (userInput === element.textContent) {
        element.style.color = '#2ecc71';
        element.style.border = '.5px solid #2ecc71';
      }
    }));

    const elemLength = letterElements.filter(elem => (elem.textContent)).length;

    // spread array and push them into the input array
    if (acknowledgeGuesses) input.push(...userGuess);

    puzzleWord = replace(puzzleWord, input);

    // ############## USER GUESSED WRONG #############
    if (isGuessWrong) {
      stats.decrementGuesses();
      userGuesses.add(userInput);
    }

    const reset = resetWord(() => {
      modalBackdrop.hide();
      letterElements.forEach(el => el.highLight(true, (element) => {
        element.style.color = 'transparent';
        element.style.border = 'none';
        element.removeClass('wiggle-animation');
      }));
    });

    modal.onclick = reset;

    // ########## USER EXHAUSTS ALL HIS GUESSES ##############
    if (!stats.guessesLeft) {
      acknowledgeGuesses = false;

      modalMessage.html(`<span class="modal__heading--loss">You lose!</span> 
            <br> 
            The word was <span class="modal__notable--loss">"${words[count].word}"</span>
            <br>
            Press <span class="modal__notable--loss">"Enter"</span> to start over.`);
      modalBackdrop.show();

      // if enter id pressed move on to the next word
      if (userInput === 'Enter') reset();

      modal.onclick = reset;
    }

    // print hint to screen
    displayContentHint.html(`<p class="game-text hint-text">${words[count].hint}</p>`);

    // ################ USER GOT ALL THE LETTERS ###############
    if (words[count].isMatched(puzzleWord)) {
      if (canIncScores) stats.incrementWins();
      canIncScores = false;
      winsDiv.html(`wins: <span class="game__score--tally">${stats.wins}</span>`);
      wordProgressDiv.text(`Word so far: ${puzzleWord}`);
      // print hint to screen
      displayContentHint.html(`<p class="game-text hint-text">${words[count].hint}</p>`);
      // modalWordDisplay.text(puzzleWord);
      modalMessage.html(`<h2 class="modal__heading--win">Congratulations!</h2> 
                <p class="modal__notable">You're correct. The word's <span class="modal__notable--win">"${puzzleWord}"</span>
                Press <span class="modal__notable--win">"Enter"</span> to attempt the next word.</p>`);
      modalBackdrop.show();

      //  player completed every word -----TODO-----
      if (stats.wins === words.length) {
        modalMessage.html(`
                    <h1 class="modal__heading--win">Congratulations</h1>
                    <p class="modal--message">You've found all the words. Press Enter to over</p>
                 `);
      }

      // move to next word when the user presses enter
      if (userInput === 'Enter') reset();
    }

    chancesDiv.html(`chances: <span class="game__score--tally">${stats.guessesLeft}</span>`);
    winsDiv.html(`wins: <span class="game__score--tally">${stats.wins}</span>`);
    wordProgressDiv.text(puzzleWord);
  };

  (() => {
    const mobileInputChoices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    mobileInputChoices.forEach((letter) => {
      const letterDiv = makeElem('a');
      letterDiv
        .onclick = onGuess;

      letterDiv.highLight = function highlight(condition, callback) {
        if (condition) callback(this);
      };

      letterDiv
        .addClass('mobile-input__letter')
        .html(letter)
        .appendTo(mobileInput);
    });
  })();


  body.onkeyup = onGuess;
};

export default gameConfig;
