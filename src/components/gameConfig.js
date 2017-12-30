const gameConfig = (words, methods) => {
  const [makeElem, makeDashes, guesses, replace, inc] = methods;

  const mobileInputChoices = ['a', 'b', 'c', 'd', 'e', 'f', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

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

  const displayHeadHint = makeElem();

  displayHeadHint
    .addClass('game__hint-head')
    .addClass('display__heading')
    .addClass('display__heading--hint')
    .appendTo(game)
    .text('Hint');

  const displayContentHint = makeElem()
    .addClass('display__content')
    .addClass('display__content--hint')
    .html(`<p class="game-text hint-text">${words[0].hint}</p>`)
    .appendTo(game);

  const { body } = global.document;

  // set initial values for game

  let input = [];

  // this sets the count to zero
  // the inc function returns zero when it is passed no arguments
  // otherwise it takes a number as an argument and turns that number incremented by 1
  // inc(5) is 5 + 1, which returns 6.

  let count = inc();

  let { word } = words[count];

  let wins = 0;

  let chances = 5;

  let guessedLetters = [];

  let puzzleWord = makeDashes(word);

  // ############ SETTING INITIAL DOM ELEMENTS ###############
  const winsDiv = makeElem()
    .addClass('game__score--wins')
    .html(`wins: <span class="game__score--tally">${wins}</span>`)
    .appendTo(displayHeadScore);
  const chancesDiv = makeElem()
    .addClass('game__score--chances')
    .html(`chances: <span class="game__score--tally">${chances}</span>`)
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

  const softReset = () => {
    guessedLetters = [];
    count = inc(count);
    word = words[count].word;
    puzzleWord = makeDashes(word);
    input = [];
    chances = 5;
    wordProgressDiv.text(`Word so far: ${puzzleWord}`);
    // print hint to screen
    displayContentHint.html(`<p class="game-text hint-text">${words[count].hint}</p>`)
      .addClass('display__content');

    wrongGuessesDiv.empty();
  };

  // RESTARTS GAME -- STARTS FROM THE BEGINNING
  const hardReset = () => {
    guessedLetters = [];
    canIncScores = true;
    count = inc();
    word = words[count].word;
    puzzleWord = makeDashes(word);
    input = [];
    chances = 5;
    wins = 0;
    wordProgressDiv.html(puzzleWord);
    // print hint to screen
    displayContentHint.html(`<p class="game-text hint-text">${words[count].hint}</p>`);
    wrongGuessesDiv.empty();
  };

  // THE FUNCTION THAT RUNS UPON USER GUESS
  const onGuess = (e) => {
    const isAlphabet = str => /^[a-zA-Z()]$/.test(str);

    // capture key stroke
    let { key = e.target.innerText } = e;
    const { ctrlKey = false } = e;

    // if key is a letter turn it to lower case and reassign it to back to key
    if (isAlphabet(key)) key = key.toLowerCase();

    // only precede if CTRL isn't pressed along with alphabet key
    if (ctrlKey) return;

    //
    const userGuess = guesses(word, key);

    // this function tests the key entered to find out if it is an alphabetical character
    const alphabetTestPast = isAlphabet(key);

    // spread array and push them into the input array
    if (acknowledgeGuesses) input.push(...userGuess);

    puzzleWord = replace(puzzleWord, input);


    // ############## USER GUESSED WRONG #############
    if (
      !words[count].isIncluded(key) &&
      canIncScores === true &&
      chances >= 1 &&
      alphabetTestPast &&
      !guessedLetters.includes(key)
    ) {
      chances--;
      guessedLetters.push(key);
      makeElem()
        .addClass('wrong-letter')
        .text(key)
        .appendTo(wrongGuessesDiv);

      wrongGuessesDiv
        .addClass('wiggle-animation');

      setTimeout(() => {
        wrongGuessesDiv
          .removeClass('wiggle-animation');
      }, 1000);
    }

    // ########## USER EXHAUSTS ALL HIS GUESSES ##############
    if (!chances) {
      acknowledgeGuesses = false;
      // alert('You lost!');
      // count = inc();
      modalMessage.html(`<span class="modal__heading--loss">You lose!</span> 
            <br> 
            The word was <span class="modal__notable--loss">"${words[count].word}"</span>
            <br>
            Press <span class="modal__notable--loss">"Enter"</span> to start over.`);
      modalBackdrop.show();
      if (key === 'Enter') {
        count = inc();
        wins = inc();
        modalBackdrop.hide();
        wrongGuessesDiv.empty();
        acknowledgeGuesses = true;
        const { word: currentWord } = words[count];
        puzzleWord = makeDashes(currentWord);
        input = [];
        chances = 5;
        wordProgressDiv.html(puzzleWord);
        // print hint to screen
        displayContentHint.html(`<p class="game-text hint-text">${words[count].hint}</p>`);
        winsDiv.html(`wins: <span class="game__score--tally">${wins}</span>`);
      }
    }

    // print hint to screen
    displayContentHint.html(`<p class="game-text hint-text">${words[count].hint}</p>`);

    // ################ USER GOT ALL THE LETTERS ###############
    if (words[count].isMatched(puzzleWord)) {
      if (canIncScores) wins++;
      canIncScores = false;
      winsDiv.html(`wins: <span class="game__score--tally">${wins}</span>`);
      wordProgressDiv.text(`Word so far: ${puzzleWord}`);
      // print hint to screen
      displayContentHint.html(`<p class="game-text hint-text">${words[count].hint}</p>`);
      // modalWordDisplay.text(puzzleWord);
      modalMessage.html(`<h2 class="modal__heading--win">Congratulations!</h2> 
                
                <p class="modal__notable">You're correct. The word's <span class="modal__notable--win">"${puzzleWord}"</span>
                Press <span class="modal__notable--win">"Enter"</span> to attempt the next word.</p>`);
      modalBackdrop.show();

      //  player completed every word -----TODO-----
      if (wins === words.length) {
        modalMessage.html(`
                    <h1 class="modal__heading--win">Congratulations</h1>
                    <p class="modal--message">You've found all the words. Press Enter to over</p>
                 `);
      }

      // move to next word when the user presses enter
      if (key === 'Enter') {
        canIncScores = true;
        // ###### USER GOT ALL THE WORDS ########
        if (words[count] !== words[words.length - 1]) {
          //  to next word and reset negative record regarding eat individual word
          softReset();
          modalBackdrop.hide();
        } else {
          // the game resets when all the words have been solved
          hardReset();
          modalBackdrop.hide();
        }
      }
    }

    chancesDiv.html(`chances: <span class="game__score--tally">${chances}</span>`);
    winsDiv.html(`wins: <span class="game__score--tally">${wins}</span>`);
    wordProgressDiv.text(puzzleWord);
  };

  // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  //   // some code..
  // } else {
  //   // COMMENCE GAME WHEN USER PRESSES THE ENTER KEY
  // }


  mobileInputChoices.forEach((letter) => {
    const letterDiv = makeElem('a');
    letterDiv
      .onclick = onGuess;

    letterDiv
      .addClass('mobile-input__letter')
      .html(letter)
      .appendTo(mobileInput);
  });

  body.onkeyup = onGuess;
};

export default gameConfig;
