import path from 'path';
import Typo from 'typo-js';
const dictionary = new Typo('en_US', null, null, { dictionaryPath: path.join('dictionaries') });
const MIN_LENGTH = 2;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function helper(index, original, wordsStr = '{ "words": [], "total_characters": 0 }') {
    let wordList = JSON.parse(wordsStr);
    if (index >= original.length)
        return wordList;
    let currentOutput = wordList;
    for (let i = index + 1; i <= original.length; i++) {
        const segment = original.substring(index, i);
        // console.log(segment)
        if (dictionary.check(capitalizeFirstLetter(segment)) && segment.length > MIN_LENGTH) {
            wordList.words.push(segment);
            wordList.total_characters += segment.length;
            let wordsOutput = helper(i, original, JSON.stringify(wordList));
            wordList.words.pop();
            wordList.total_characters -= segment.length;
            if (wordsOutput.total_characters > currentOutput.total_characters) {
                currentOutput = wordsOutput;
            }
            else if (wordsOutput.total_characters == currentOutput.total_characters) {
                if (wordsOutput.words.length < currentOutput.words.length)
                    currentOutput = wordsOutput;
            }
        }
    }
    return currentOutput;
}
export function detectKeywords(input) {
    let output = { words: [], total_characters: 0 };
    for (let i = 0; i < input.length; i++) {
        let o = helper(i, input);
        if (o.total_characters > output.total_characters) {
            output = o;
        }
        else if (o.total_characters == output.total_characters) {
            if (o.words.length < output.words.length)
                output = o;
        }
    }
    return output;
}
export function detectKeywordsInDomains(domains) {
    const output = [];
    for (let i = 0; i < domains.length; i++) {
        let domain = domains[i];
        const domainName = domain.replace('www.', '').slice(0, domain.lastIndexOf('.'));
        // Split domain name at each dot (.) occurrence
        // Loop over once and find matching words
        const returnValue = domainName.split(/\.|\-/).flatMap(domainPart => detectKeywords(domainPart).words);
        output.push(returnValue);
    }
    return output;
}
