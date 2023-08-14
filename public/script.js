function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function getCsvResults(results) {
  let fileContent = 'Domain,Words,Multi-possibilities,Characters skipped';

  function newRow(rowArr) {
    fileContent += '\r\n' + rowArr.map(row => `"${row}"`).join(',');
  }

  results.forEach(result => {
    const possibleCombinations = getPossibleCombinations(result.parts);

    const domainName = result.domain.slice(0, result.domain.lastIndexOf('.'));
    const domainNameChars = domainName.match(/[a-z]/gi) ?? [];

    const firstResult = possibleCombinations?.[0].map(words => words.map(word => capitalizeFirstLetter(word)).join(' ')).join(' ') ?? '';
    const firstResultChars = firstResult.match(/[a-z]/gi) ?? [];

    const charactersSkipped = firstResultChars.length < domainNameChars.length;

    possibleCombinations.forEach(possibleCombination => {
      newRow([
        result.domain,
        possibleCombination.map(words => words.map(word => capitalizeFirstLetter(word)).join(' ')).join(' '),
        possibleCombinations.length > 1 ? 'flag' : '',
        charactersSkipped ? 'not full' : '',
      ]);
    });
  });

  return fileContent;
}

function getPossibleCombinations(arr) {
  const possibleCombinations = [];
  const val = arr.map(() => 0);
  const max = arr.map(possibleBranches => possibleBranches.length - 1);

  let maxIndex = 0;
  let currentIndex = 0;

  function recordVal() {
    possibleCombinations.push([...val]);
  }

  function reset(mIndex) {
    for (let index = 0; index < mIndex; index++) {
      val[index] = 0;
    }
  }

  function add() {
    if (val[currentIndex] < max[currentIndex]) {
      val[currentIndex] += 1;
      recordVal();
    } else if (val[currentIndex + 1] < max[currentIndex + 1]) {
      val[currentIndex + 1] += 1;
      reset(currentIndex + 1);
      currentIndex = 0;
      recordVal();
    } else {
      currentIndex += 1;
    }
  }

  recordVal();

  while (currentIndex < val.length) {
    add();
  }

  return possibleCombinations.map(combination => combination.map((branch, index) => arr[index][branch]));
}

function submitDomains() {
  const resultsDiv = document.getElementById('results');
  const downloadButtonContainer = document.getElementById('download-button-container');
  const textarea = document.getElementById('textarea');

  const reqBody = textarea.value.split('\n').filter(domain => domain.trim() !== '');

  fetch(`http://${new URL(window.location).hostname}:8000`, { body: JSON.stringify(reqBody), method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then(res => res.json())
    .then(results => {
      resultsDiv.innerHTML = results
        .map(result => {
          const possibleCombinations = getPossibleCombinations(result.parts);
          const possibleCombinationsHTML = `<ul class="list-disc pl-6">
            ${possibleCombinations
              .map(possibleCombination => {
                return `<li>${possibleCombination.map(words => words.map(word => capitalizeFirstLetter(word)).join(' ')).join(' ')}</li>`;
              })
              .join(' ')}
            </ul>`;

          const domainName = result.domain.slice(0, result.domain.lastIndexOf('.'));
          const domainNameChars = domainName.match(/[a-z]/gi) ?? [];

          const firstResult = possibleCombinations?.[0].map(words => words.map(word => capitalizeFirstLetter(word)).join(' ')).join(' ') ?? '';
          const firstResultChars = firstResult.match(/[a-z]/gi) ?? [];

          const charactersSkipped = firstResultChars.length < domainNameChars.length;

          return `<div class="flex">
              <div class="p-2 border-r border-b border-gray-500 w-full">${result.domain}</div>
              <div class="p-2 border-r border-b border-gray-500 w-full${possibleCombinations.length > 1 ? ' bg-red-200' : ''}${
            charactersSkipped ? ' bg-yellow-200' : ''
          }">${possibleCombinationsHTML}</div>
          </div>`;
        })
        .join('');

      const csvResults = getCsvResults(results);

      downloadButtonContainer.innerHTML = `<a class="block my-2 mx-auto p-2 rounded text-white bg-blue-500 text-center" download="download.csv" href="${
        'data:text/plain;base64,' + btoa(csvResults)
      }">Download Excel</a>`;
    })
    .catch(err => {
      console.log(err);
      resultsDiv.innerHTML = 'Failed';
    });
}
