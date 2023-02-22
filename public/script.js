function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function getCsvResults(results) {
  let fileContent = 'Domain,Words';

  function newRow(rowArr) {
    fileContent += '\r\n' + rowArr.join(',');
  }

  results.forEach(result => {
    newRow([result.domain, result.summary.map(word => capitalizeFirstLetter(word)).join(' ')]);
  });

  return fileContent;
}

function returnAllPossibleOptions(domainParts) {
  return domainParts
    .map(domainPartsPossibleBranches => {
      // console.log(
      return domainPartsPossibleBranches
        .map(domainPartWords => {
          return domainPartWords.map(word => capitalizeFirstLetter(word)).join(' ');
        })
        .join(' ');
    })
    .join(' ');
}

function submitDomains() {
  const resultsDiv = document.getElementById('results');
  const downloadButtonContainer = document.getElementById('download-button-container');
  const textarea = document.getElementById('textarea');

  const reqBody = textarea.value.split('\n');

  fetch('http://10.0.0.8:8000', { body: JSON.stringify(reqBody), method: 'POST', headers: { 'Content-Type': 'application/json' } })
    .then(res => res.json())
    .then(results => {
      resultsDiv.innerHTML = results
        .map(result => {
          console.log(JSON.stringify(result.parts, null, 4));
          console.log(returnAllPossibleOptions(result.parts));
          return `<div class="flex">
              <div class="p-2 border-r border-b border-gray-500 w-full">${result.domain}</div>
              <div class="p-2 border-r border-b border-gray-500 w-full">${result.summary.map(word => capitalizeFirstLetter(word)).join(' ')}</div>
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
