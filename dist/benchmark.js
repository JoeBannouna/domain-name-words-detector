import fs from 'fs';
import path from 'path';
import { detectKeywordsInDomains } from './detector.js';
const DOMAINS_NUM = 1000;
const input = fs.readFileSync(path.join('input', `question${DOMAINS_NUM}.txt`), { encoding: 'utf8' });
const domains = input.split('\n');
domains.pop(); // remove empty last line
const ans = detectKeywordsInDomains(domains);
const MODE = 'DOMAIN ACCURACY';
// @ts-ignore
if (MODE == 'TIME')
    console.log(performance.now());
else {
    const answerOutput = fs.readFileSync(path.join('input', `answer${DOMAINS_NUM}.json`), { encoding: 'utf8' });
    const correctAns = JSON.parse(answerOutput);
    // @ts-ignore
    if (MODE == 'WORD ACCURACY') {
        // detect WORDS accuracy
        let correctDomainsRatio = 0;
        ans.forEach((domain, i) => {
            let ratio = 0;
            domain.forEach(word => {
                if (correctAns[i].includes(word))
                    ratio++;
            });
            ratio = ratio / (domain.length == 0 ? 1 : domain.length);
            correctDomainsRatio += ratio;
        });
        correctDomainsRatio /= ans.length;
        console.log(correctDomainsRatio);
    }
    // @ts-ignore
    if (MODE == 'DOMAIN ACCURACY') {
        // detect DOMAINS accuracy
        let correctDomainsRatio = 0;
        ans.forEach((domain, i) => {
            let ratio = 1;
            domain.forEach(word => {
                if (!correctAns[i].includes(word))
                    ratio = 0;
            });
            correctDomainsRatio += ratio;
        });
        correctDomainsRatio /= ans.length;
        console.log(correctDomainsRatio);
    }
}
