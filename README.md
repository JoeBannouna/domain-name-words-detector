# domain-name-words-detector

## Description

### Extremely Fast (and Accurate) Keyword Detection tool for Domain Names. 

Using AI for keyword detection can be a tedious and slow process, it is also relatively computationally expensive. This too offers an alternative solution to training and modelling an AI model for such a task. Using a few algorithmic techniques, it is able to separate thousands of domain names per second into distinct words that appear in the domain as such:
* `"registeryourcar.com"` => `register your car`
* `"cutecatvideos.net"`   => `cute cat videos`

### <u>3500%</u> Speed Increase compared to Alternatives
Compared to AI models that perform word tokenization to achieve a similar result, but only process 20-30 words per second. This tool provides a **3500% speed increase**. With a tested accuracy of approximately 98%.

### Benchmark Data

Through more optimization techniques, an extra **40% gain** in speed was obtained by leveraging recursion.

* `Speed`: the time it takes to separate joint words of the entire list of given domains and return the output
* `Word Accuracy`: The ratio of the number of words guessed correctly out of the total number of words in all the given domains
* `Domain Accuracy` (More Strict): The ratio of the number of domains whose words were guessed with perfect accuracy

| Domains No. | Speed | Word Accuracy | Domain Accuracy |
|-------------|-------|---------------|-----------------|
| 1000        | 1.6s  | 98.63%        | 96.7%           |
| 10,000      | 14.1s | 98.61%        | 97.07%          |
| 100,000     | 2.1m  | 98.63%        | 97.12%          |


### Easy to use UI

The web app UI for small scale tasks (only a couple of thousand domains) is a nice addition to easily and quickly convert a relatively small list of domains into separated words and download an Excel file with the results!

[domain-name-detector-web-app.webm](https://github.com/JoeBannouna/domain-name-words-detector/assets/60569029/e0b94174-d8d1-4a51-9640-0f0b12451563)

## Installation and Simple Usage

* Download the code, extract and open the folder.
* Open a terminal and go to the folder.
* Run this once when you first install:
```bash
npm install
```
* Now to start the website whenever you need to, run:
```bash
node dist/index.js
```

* Open the url:
```bash
http://localhost:8080
```

* Done!
