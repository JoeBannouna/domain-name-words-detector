import path from 'path';
import Typo from 'typo-js';
const dictionary = new Typo('en_US', null, null, { dictionaryPath: path.join('dictionaries') });

const output = dictionary.check('cardio');

console.log(output);
