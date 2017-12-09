'use strict';
//import styles
import './style/main.scss';

const HANGMAN = {};

// -------------------------NAMESPACE -------------------------
(namespace => {
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

		//method to test if word is correct
		isMatched(letters) {
			return this.word === letters.toLowerCase().trim() ? true : false;
		}
	}

	// ----------------------WORD FACTORY------------------------
	// make single word or an array of words and make it a property of HANGMAN
	// it takes an a single string, multiple stings, or an array of stings as an argument
	HANGMAN.wordFactory = (...word) => {
		// if argument is an array make it an array by destructuring it
		if (Array.isArray(...word)) [word] = word;
		// iterate through an array of strings and return an array of objects
		if (word.length > 1) return word.map(item => new Word(...item));

		// if argument is a single string destructure the array and output a string
		const [singleWord] = word;
		console.log(word);
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

	HANGMAN.arrayIterator = arrayIterator;

	// This method takes in a string and outputs a string of underscores
	// proportionate to the number of characters contained in the string
	const makeDashes = answer => {
		let dashed = [];
		(function looper(answer) {
			let [a, ...b] = [...answer];

			dashed.push('_');
			if (answer.length === 1) return;
			looper(b);
		})(answer);
		return dashed.join('');
	};

	HANGMAN.makeDashes = makeDashes;

	// this is a method used for DOM manipulation
	// the names of the functions within it borrow from jQuery
	const makeElem = elemName => {
		let elem = document.createElement((elemName = 'div'));

		// insert element into another element
		elem.appendTo = parent => {
			parent.appendChild(elem);
			return elem;
		};

		// add text to element
		elem.text = text => {
			elem.textContent = text;
			return elem;
		};

		// add HTML to element
		elem.html = html => {
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
		elem.addClass = className => {
			elem.classList.add(className);
			return elem;
		};

		// remove CSS class from element
		elem.removeClass = className => {
			elem.classList.remove(className);
			return elem;
		};

		return elem;
	};

	HANGMAN.makeElem = makeElem;

	// this takes in two arguments, the answer and the user's guess
	// if the letter guess is present in the answer it outputs an array of objects with the
	// letter as a string and the index at which the letter is present in the answer string
	let guesses = (answer, letterGuessed) => {
		return (
			// spread the characters in the string and place them in an array
			// then iterate through them using the reduce function which returns a array that contains
			// all the letter guessed and the the index at which it is matched in the answers string
			[...answer].reduce((arr, letter, index) => {
				if (letterGuessed === letter) {
					let obj = {
						key: letterGuessed,
						index: index
					};
					arr.push(obj);
				}
				return arr;
			}, [])
		);
	};

	HANGMAN.guesses = guesses;

	// replaces characters in a string where with provided replacement character and index where it should be placed
	// it receives two arguments, a string and an array of objects containing a character the user guessed and it's index in the answer
	// all characters provided are contained in the answer
	const replace = (word, input) => {
		let resultStr = input.reduce((previous, guess) => {
			// insert each letter according to it's provided index
			if (guess.index !== -1)
				return (
					previous.substring(0, guess.index) +
					guess.key +
					previous.substring(guess.index + 1, previous.length)
				);
		}, word);

		// return altered string as output
		return resultStr;
	};

	HANGMAN.replace = replace;

	// takes in a number increments it by one and returns the incremented number
	const inc = (num = -1) => num + 1;

	HANGMAN.inc = inc;
})(HANGMAN);

const gameWords = HANGMAN.wordFactory(
		[
			['boxer', "It could be a man or a dog."],
			['compliment', "Say something to make me smile."],
			['basketball', 'Nothing but net.'],
			['hibernate', 'I can bare the cold.'],
		]
	);
const { makeElem, makeDashes, guesses, replace, inc } = HANGMAN;
const methodsArr = [makeElem, makeDashes, guesses, replace, inc];

const gameConfig = (words, methods) => {

    const wrapQuestMark = (word) => {
        const wordArr = [...word].map((letter) => {
            if (letter === '_') return `<span class="game__word--progress--unsolved">${letter}</span>`;
            return letter;
        });
        return wordArr.join('');
    };
    
	const [makeElem, makeDashes, guesses, replace, inc] = methods;

	// create and place elements into DOM when game inintally starts
	const game = makeElem()
		.addClass('game')
		.appendTo(document.body);

	const displayHead__score = makeElem()
		.addClass('display__heading')
		.addClass('display__heading--score')
		.appendTo(game);

	const displayContent__word = makeElem()
		.addClass('display__content')
		.addClass('display__content--word')
		.appendTo(game);

	const wrgGuessesDiv = makeElem()
		.addClass('game__wrong-guesses')
		.appendTo(game);
		
	const displayHead__hint = makeElem()
		.addClass('game__hint-head')
		.addClass('display__heading')
		.addClass('display__heading--hint')
		.appendTo(game)
		.text('Hint');
		
	const displayContent__hint = makeElem()
		.addClass('display__content')
		.addClass('display__content--hint')
		.html(`
			<p class="game__word-hint--text">${words[0].hint}</p>
		`)
		.appendTo(game); 

	const body = document.body;

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
	let winsDiv = makeElem()
		.addClass('game__score--wins')
		.html(`wins: <span class="game__score--tally">${wins}</span>`)
		.appendTo(displayHead__score);
	let chancesDiv = makeElem()
		.addClass('game__score--chances')
		.html(`chances: <span class="game__score--tally">${chances}</span>`)
		.appendTo(displayHead__score);
	let wrongGuessesDiv = makeElem()
		.addClass('wrong-guesses')
		.appendTo(wrgGuessesDiv);
	let wordProgressDiv = makeElem()
		// .addClass('game__word--progress')
		.html(wrapQuestMark(puzzleWord))
		.appendTo(displayContent__word);

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
		displayContent__hint.html(`<p class="game__word-hint--text">${words[count].hint}</p>`)
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
		wordProgressDiv.html(wrapQuestMark(puzzleWord));
		// print hint to screen
		displayContent__hint.html(`
			<p class="game__word-hint--text">${words[count].hint}</p>
		`);
        wrongGuessesDiv.empty();
	};

	// COMMENCE GAME WHEN USER PRESSES THE ENTER KEY
	body.onkeyup = e => {
		const isAlphabet = str => /^[a-zA-Z()]$/.test(str);

		// capture key stroke
		let { key } = e;

		// if key is a letter turn it to lower case and reassign it to back to key
		if (isAlphabet(key)) key = key.toLowerCase();

		//
		let userGuess = guesses(word, key);

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
				word = words[count].word;
				puzzleWord = makeDashes(word);
				input = [];
				chances = 5;
				wordProgressDiv.html(wrapQuestMark(puzzleWord));
				// print hint to screen
				displayContent__hint.html(`
					<p class="game__word-hint--text">${words[count].hint}</p>
				`);
				winsDiv.html(`wins: <span class="game__score--tally">${wins}</span>`);
			}
		}

		// print hint to screen
		displayContent__hint.html(`
			<p class="game__word-hint--text">${words[count].hint}</p>
		`);
		
		// ################ USER GOT ALL THE LETTERS ###############
		if (words[count].isMatched(puzzleWord)) {
			if (canIncScores) wins++;
			canIncScores = false;
			winsDiv.html(`wins: <span class="game__score--tally">${wins}</span>`);
			wordProgressDiv.text(`Word so far: ${puzzleWord}`);
			// print hint to screen
			displayContent__hint.html(`
				<p class="game__word-hint--text">${words[count].hint}</p>
			`);
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
		wordProgressDiv.html(wrapQuestMark(puzzleWord));
	};
};

// =================== EVENT HANDLER FOR STARTING GAME=======================
const handleKeypress = e => {
	const { key, target } = e;

	const intro = document.querySelector('.intro');

	if (key === 'Enter') {
		gameConfig(gameWords, methodsArr);
		intro.classList.add('intro--remove');

		// remove listener so that this function is only run once, when the user initially comes to the site
		target.removeEventListener('keypress', handleKeypress);
		target.removeEventListener('click', handleKeypress);
	}
};

function handleClick (e) {
	const {target} = e;

	const intro = document.querySelector('.intro');
	
	intro.classList.add('intro--remove');
	gameConfig(gameWords, methodsArr);

	target.removeEventListener('click', handleClick);
	document.body.removeEventListener('keypress', handleKeypress);
}

document.body.addEventListener('keypress', handleKeypress);
const introText = document.querySelector('.intro--text');
introText.onclick = handleClick;
