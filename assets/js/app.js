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

        // method to test if user letter choice is present in word
        isIncluded(char) {
            return this.word.includes(char.toLowerCase().trim());
        }

        //method to test if word is correct
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