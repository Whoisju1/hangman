// import styles
import gameConfig from './components/gameConfig';
import './style/main.scss';

const HANGMAN = {};

// -------------------------NAMESPACE -------------------------
((namespace) => {
  // -----------------------WORD CLASS------------------------
  // used to make words for game
  class Word {
    constructor(word, hint) {
      this.word = word.toLowerCase();
      this.hint = hint;
      this.isMatched = this.isMatched.bind(this);
      this.isIncluded = this.isIncluded.bind(this);
    }

    // method to test if user letter choice is present in word
    isIncluded(char) {
      return this.word.includes(char.toLowerCase().trim());
    }

    // method to test if word is correct
    isMatched(letters) {
      return this.word === letters.toLowerCase().trim();
    }
  }

  // ----------------------WORD FACTORY------------------------
  // make single word or an array of words and make it a property of HANGMAN
  // it takes an a single string, multiple stings, or an array of stings as an argument
  namespace.wordFactory = (...word) => {
    // if argument is an array make it an array by destructuring it
    if (Array.isArray(...word)) [word] = word;
    // iterate through an array of strings and return an array of objects
    if (word.length) return word.map(item => new Word(...item));

    // if argument is a single string destructure the array and output a string
    const [singleWord] = word;
    // make a single object
    return new Word(singleWord);
  };

  // ------------------ARRAY ITERATOR ----------------------------------

  // loop through array of words and execute callback function using recursive function
  const arrayIterator = (wordList, cb) => {
    const [a, ...b] = wordList;
    cb(a);
    if (wordList.length === 1) return;
    arrayIterator(b, cb);
  };

  namespace.arrayIterator = arrayIterator;

  // This method takes in a string and outputs a string of underscores
  // proportionate to the number of characters contained in the string
  const makeDashes = (answer) => {
    const dashed = [];
    (function looper(answer) {
      const [a, ...b] = [...answer];

      dashed.push('_');
      if (answer.length === 1) return;
      looper(b);
    }(answer));
    return dashed.join('');
  };

  namespace.makeDashes = makeDashes;

  // this is a method used for DOM manipulation
  // the names of the functions within it borrow from jQuery
  const makeElem = (elemName = 'div') => {
    const elem = global.document.createElement((elemName));

    // insert element into another element
    elem.appendTo = (parent) => {
      parent.appendChild(elem);
      return elem;
    };

    // add text to element
    elem.text = (text) => {
      elem.textContent = text;
      return elem;
    };

    // add HTML to element
    elem.html = (html) => {
      elem.innerHTML = html;
      return elem;
    };

    // empty the element of all it's content
    elem.empty = () => {
      elem.innerHTML = '';
      return elem;
    };

    // hide the element
    elem.hide = () => {
      elem.style.visibility = 'hidden';
      return elem;
    };

    // show element
    elem.show = () => {
      elem.style.visibility = 'visible';
      return elem;
    };

    // add CSS class to element
    elem.addClass = (className) => {
      elem.classList.add(className);
      return elem;
    };

    // remove CSS class from element
    elem.removeClass = (className) => {
      elem.classList.remove(className);
      return elem;
    };

    return elem;
  };

  namespace.makeElem = makeElem;

  // this takes in two arguments, the answer and the user's guess
  // if the letter guess is present in the answer it outputs an array of objects with the
  // letter as a string and the index at which the letter is present in the answer string
  const guesses = (answer, letterGuessed) => (
    // spread the characters in the string and place them in an array
    // then iterate through them using the reduce function which returns a array that contains
    // all the letter guessed and the the index at which it is matched in the answers string
    [...answer].reduce((arr, letter, index) => {
      if (letterGuessed === letter) {
        const obj = {
          key: letterGuessed,
          index,
        };
        arr.push(obj);
      }
      return arr;
    }, [])
  );

  namespace.guesses = guesses;

  // replaces characters in a string where with provided replacement character
  // and index where it should be placed
  // it receives two arguments, a string and an array of objects containing
  // a character the user guessed and it's index in the answer
  // all characters provided are contained in the answer
  const replace = (word, input) => {
    const resultStr = input.reduce((previous, guess) => {
      // insert each letter according to it's provided index
      if (guess.index !== -1) {
        return (
          previous.substring(0, guess.index) +
          guess.key +
          previous.substring(guess.index + 1, previous.length)
        );
      }
    }, word);

    // return altered string as output
    return resultStr;
  };

  namespace.replace = replace;

  // takes in a number increments it by one and returns the incremented number
  const inc = (num = -1) => num + 1;

  namespace.inc = inc;
})(HANGMAN);

const gameWords = HANGMAN.wordFactory([
  ['boxer', 'It could be a man or a dog.'],
  ['compliment', 'Say something to make me smile.'],
  ['basketball', 'Nothing but net.'],
  ['hibernate', 'I can bare the cold.'],
]);
const {
  makeElem, makeDashes, guesses, replace, inc,
} = HANGMAN;
const methodsArr = [makeElem, makeDashes, guesses, replace, inc];

// =================== EVENT HANDLER FOR STARTING GAME=======================
const handleKeypress = (e) => {
  const { key, target } = e;

  const intro = global.document.querySelector('.intro');

  if (key === 'Enter') {
    gameConfig(gameWords, methodsArr);
    intro.parentElement.removeChild(intro);

    // remove listener so that this function is only run once...
    // when the user initially comes to the site
    target.removeEventListener('keypress', handleKeypress);
    target.removeEventListener('click', handleKeypress);
  }
};

function handleClick(e) {
  const { target } = e;

  const intro = global.document.querySelector('.intro');

  intro.parentElement.removeChild(intro);
  gameConfig(gameWords, methodsArr);

  target.removeEventListener('click', handleClick);
  global.document.body.removeEventListener('keypress', handleKeypress);
}

global.document.body.addEventListener('keypress', handleKeypress);
const introText = global.document.querySelector('.intro--text');
introText.onclick = handleClick;
