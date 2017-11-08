const HANGMAN = {};

(namespace => {
    HANGMAN.removeElem = (...elemNames) => {
        for (let key of elemNames) {
            key.style.display = 'none';
        }
    };

    //create word constructor
    class Word {
        constructor(word) {
            this.word = word.toLowerCase();

            this.isMatched = this.isMatched.bind(this);
            this.isIncluded = this.isIncluded.bind(this);
        }

        isIncluded(char) {
            return this.word.includes(char.toLowerCase().trim());
        }

        isMatched(letters) {
            return this.word === letters.toLowerCase().trim() ? true : false;
        }
    }

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
    
})(HANGMAN);

let names = HANGMAN.wordFactory(['Juan', 'Bonnie', 'Their Kids', 'a big dog']);
console.log('names: ', names);

let names2 = HANGMAN.wordFactory('Juan', 'Bonnie', 'Their Kids', 'a big dog');

let singleName = HANGMAN.wordFactory('just one');


console.log('names2: ', names2);

console.log('sinlge name: ', singleName);