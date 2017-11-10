"use strict";

const HANGMAN = {};

// -------------------------NAMESPACE -------------------------
(namespace => {

    // -----------------------WORD CLASS------------------------
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

    const makeDashes = (answer, guess) => {
        let dashed = [];
        (function looper (answer) {
            let [a, ...b] = [...answer];

            dashed.push("_");
            if (answer.length === 1) return;
            looper (b);
        })(answer);
        // if (dashed.join().includes(" ")) return dashed.join('');
        return dashed.join('');
    };

    HANGMAN.makeDashes = makeDashes;

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
    
})(HANGMAN);


const gameWords = HANGMAN.wordFactory(['one', 'compliment', 'deliberate', 'confidence', 'dynamic', 'javascript']);
const {makeElem, makeDashes} = HANGMAN;


// this takes in two arguments, the answer and the user's guess
// if the letter guess is present in the answer it outputs an array of objects with the 
// letter as a string and the index at which the letter is present in the answer string
let guesses = (answer, letterGuessed) =>{
    return (
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

// replaces characters in a string where with provided replacement character and index where it should be placed
// it receives two arguments, a string and an array of objects containing a character the user guessed and it's index in the answer
// all characters provided are contained in the answer
let replace = (word, input) => {
    let resultStr = input.reduce((previous, guess) => {
        // insert each letter according to it's provided index
        if(guess.index !== -1) return previous.substring(0, guess.index) + guess.key + previous.substring(guess.index + 1, previous.length);
    }, word);

    // return altered string as output
    return resultStr;
};


let game = makeElem()
    .addClass("nice")
    .appendTo(document.body);
    

let playGame = (words) => {
    const body = document.body;

    let input = [];

    let inc = (num = -1) => num+1;

    let count = inc();
    
    let {word}= words[count];

    let winsDiv = makeElem().text('wins').appendTo(body);
    let lossesDiv = makeElem().text('losses').appendTo(body);

    let wins = 0;
    let losses = 0;
    
    let puzzleWord = HANGMAN.makeDashes(word);
    
    body.onkeyup = (e) => {
        let {key} = e;
        let userGuess = guesses(word, key);

        if (!userGuess) {
            losses--;
            lossesDiv.text(`Losses: ${losses}`);
        }
        
        input.push(...userGuess);
        
        puzzleWord = replace(puzzleWord, input);


        if (words[count].isMatched(puzzleWord)) {
            wins++;
            winsDiv.text(`wins: ${wins}`);
            game
            .text(`Word so far: ${puzzleWord}`);
            
            if (key === "Enter") {
                if (words[count] !== words[words.length-1]) {
                    count = inc(count);
                    word = words[count].word;
                    puzzleWord = HANGMAN.makeDashes(word);
                    input = [];        
                    game
                    .text(`Word so far: ${puzzleWord}`);   
                } else {
                    alert('Congratulations you have found all the words');
                    count = inc();
                    word = words[count].word;
                    puzzleWord = HANGMAN.makeDashes(word);
                    input = [];        
                    game
                    .text(`Word so far: ${puzzleWord}`); 
                }
                 
            }
        }
    
        game
            .text(`Word so far: ${puzzleWord}`);
    
    };
};

playGame(gameWords);