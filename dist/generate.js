import fs from 'fs';
import path from 'path';
import { generate } from 'random-words';
const DOMAINS_NUM = 10;
fs.writeFileSync(path.join('input', `answer${DOMAINS_NUM}.json`), "[");
fs.writeFileSync(path.join('input', `question${DOMAINS_NUM}.txt`), "");
const suffixes = ['com', 'net', 'org', 'xyz', 'io', 'ai'];
for (let i = 0; i < DOMAINS_NUM; i++) {
    if (i % 100000 == 0)
        console.log(i);
    let rand = Math.ceil(Math.random() * 7);
    let suffixIndex = Math.round(Math.random() * 5);
    let domain = generate(rand);
    if (typeof domain == 'string')
        domain = [domain];
    fs.appendFileSync(path.join('input', `answer${DOMAINS_NUM}.json`), (i == 0 ? "" : ",") + JSON.stringify(domain));
    fs.appendFileSync(path.join('input', `question${DOMAINS_NUM}.txt`), (domain.join('') + '.' + suffixes[suffixIndex] + '\n'));
}
fs.appendFileSync(path.join('input', `answer${DOMAINS_NUM}.json`), "]");
