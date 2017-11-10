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


const words = HANGMAN.wordFactory(['one', 'compliment', 'deliberate', 'confidence', 'dynamic', 'javascript']);
const {makeElem} = HANGMAN;

// console.log('index of', 'Juan'.indexOf('n'));

HANGMAN.arrayIterator(words, (word) => {
    
});

HANGMAN.makeElem().text("This is it").appendTo(document.body).addClass("nice").removeClass('nice');
