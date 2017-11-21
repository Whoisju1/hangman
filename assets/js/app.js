"use strict";

const HANGMAN = {};

// -------------------------NAMESPACE -------------------------
(namespace => {

    // -----------------------WORD CLASS------------------------
    // used to make words for game
    class Word {
        constructor(word) {
            this.word = word.toLowerCase();

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
        if (word.length > 1) return word.map(item => new Word(item));

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

    HANGMAN.arrayIterator = arrayIterator;

    // This method takes in a string and outputs a string of underscores
    // proportionate to the number of characters contained in the string
    const makeDashes = (answer) => {
        let dashed = [];
        (function looper (answer) {
            let [a, ...b] = [...answer];

            dashed.push("?");
            if (answer.length === 1) return;
            looper (b);
        })(answer);
        return dashed.join('');
    };

    HANGMAN.makeDashes = makeDashes;

    // this is a method used for DOM manipulation
    // the names of the functions within it borrow from jQuery
    const makeElem = (elemName) => {
        let elem = document.createElement(elemName = 'div');

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
            elem.innerHTML = "";
            return elem;
        };
    
        // hide the element
        elem.hide = () => {
            elem.style.visibility = "hidden";
            return elem;
        };
    
        // show element
        elem.show = () => {
            elem.style.visibility = "visible";
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

    HANGMAN.makeElem = makeElem;

    // this takes in two arguments, the answer and the user's guess
    // if the letter guess is present in the answer it outputs an array of objects with the 
    // letter as a string and the index at which the letter is present in the answer string
    let guesses = (answer, letterGuessed) =>{
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
            if(guess.index !== -1) return previous.substring(0, guess.index) + guess.key + previous.substring(guess.index + 1, previous.length);
        }, word);

        // return altered string as output
        return resultStr;
    };

    HANGMAN.replace = replace;

    // takes in a number increments it by one and returns the incremented number 
    const inc = (num = -1) => num+1;

    HANGMAN.inc = inc;
    
})(HANGMAN);


const gameWords = HANGMAN.wordFactory(['one', 'compliment', 'deliberate', 'confidence', 'dynamic', 'javascript']);
const {makeElem, makeDashes, guesses, replace, inc} = HANGMAN;
const methodsArr = [makeElem, makeDashes, guesses, replace, inc];

const gameConfig = (words, methods) => {

    const [makeElem, makeDashes, guesses, replace, inc] = methods;

    // create and place elements into DOM
    const game = makeElem().addClass("game").appendTo(document.body);
    const scoreDiv = makeElem().addClass("game__score").appendTo(game);
    const gameWordDiv = makeElem().addClass(".game__word").appendTo(game);
    const wrgGuessesDiv = makeElem().addClass('.game__wrong-guesses').appendTo(game);

    const body = document.body;
    
    // set initial values for game

    let input = [];

    // this sets the count to zero
    // the inc function returns zero when it is passed no arguments 
    // otherwise it takes a number as an argument and turns that number incremented by 1
    // inc(5) is 5 + 1, which returns 6.

    let count = inc();
    
    let {word}= words[count];

    let wins = 0;
    
    let chances = 5;

    let guessedLetters = [];

    let puzzleWord = makeDashes(word);

    // ############ SETTING INITIAL DOM ELEMENTS ###############
    let winsDiv = makeElem().addClass('game__score--wins').html(`wins: <span class="game__score--tally">${wins}</span>`).appendTo(scoreDiv);
    let chancesDiv = makeElem().addClass('game__score--chances').html(`chances: <span class="game__score--tally">${chances}</span>`).appendTo(scoreDiv);
    let wrongGuessesDiv = makeElem().addClass('wrong-guesses').appendTo(wrgGuessesDiv);
    let wordProgressDiv = makeElem()
        .addClass("game__word-progress")
        .text(puzzleWord)
        .appendTo(gameWordDiv);
    
    // let victory = false; // ~~~~~~~~ NO USE YET ~~~~~~~~~

    let canIncScores = true;
    let acknowledgeGuesses = true;

    const softReset = () => {
        guessedLetters = [];
        count = inc(count);
        word = words[count].word;
        puzzleWord = makeDashes(word);
        input = [];        
        chances = 5;
        wordProgressDiv
        .text(`Word so far: ${puzzleWord}`); 
        wrongGuessesDiv.empty();  
    };

    // RESTARTS GAME -- STARTS FROM THE BEGINNING
    const hardReset = () => {
        alert('Congratulations you have found all the words'); // TODO: this will be replaced
        guessedLetters = [];
        canIncScores = true;
        count = inc();
        word = words[count].word;
        puzzleWord = makeDashes(word);
        input = [];  
        chances = 5;      
        wins = 0;
        wordProgressDiv
        .text(puzzleWord); 
        wrongGuessesDiv.empty();
    };

    // COMMENCE GAME WHEN USER PRESSES THE ENTER KEY
    body.onkeyup = (e) => {
        const isAlphabet = str => /^[a-zA-Z()]$/.test(str);
          
        // capture key stroke
        let {key} = e;

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
        if (!words[count].isIncluded(key) && canIncScores === true && chances >= 1 && alphabetTestPast && !guessedLetters.includes(key)) {
            chances--;
            guessedLetters.push(key);
            makeElem().addClass('wrong-letter').text(key).appendTo(wrongGuessesDiv);
        }

        // ########## USER EXHAUSTS ALL HIS GUESSES ##############
        if(!chances) {
            acknowledgeGuesses = false;
            // alert('You lost!');
            // count = inc();
            if (key === "Enter") {
                count = inc();
                wrongGuessesDiv.empty();
                acknowledgeGuesses = true;
                word = words[count].word;
                puzzleWord = makeDashes(word);
                input = [];  
                chances = 5;      
                wordProgressDiv
                .text(puzzleWord); 
            }
        } 

        //  player completed every word -----TODO-----
        // if (wins === words.length) {
        //     alert('VICTORY!!!!!');
        // }
        
        // ################ USER GOT ALL THE LETTERS ###############
        if (words[count].isMatched(puzzleWord)) {
            if (canIncScores) wins++;
            canIncScores = false;
            winsDiv.html(`wins: <span class="game__score--tally">${wins}</span>`);
            wordProgressDiv
            .text(`Word so far: ${puzzleWord}`);

            // move to next word when the user presses enter
            if (key === "Enter") {
                canIncScores = true;

                // ###### USER GOT ALL THE WORDS ########
                if (words[count] !== words[words.length-1]) {
                    //  to next word and reset negative record regarding eat individual word
                    softReset();
                } else {
                    // the game resets when all the words have been solved
                   hardReset();
                }
            }
        }
        
        chancesDiv.html(`chances: <span class="game__score--tally">${chances}</span>`);
        wordProgressDiv
            .text(puzzleWord);
    
    };
};

// =================== EVENT HANDLER FOR STARTING GAME=======================
const handleKeypress = (e) => {
    const {key, target} = e;

    const intro = document.querySelector('.intro')
    
    if (key === 'Enter') {
        gameConfig(gameWords, methodsArr);
        intro.classList.add('intro--remove');
    }
    
    // remove listener so that this function is only run once, when the user initially comes to the site
    target.removeEventListener('keypress', handleKeypress);

};

document.body.addEventListener("keypress", handleKeypress);


