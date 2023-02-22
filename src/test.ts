const testArray = [
  [
    ['can', 'you', 'hear', 'the', 'silence'],
    ['can', 'you', 'heart', 'he', 'silence'],
  ],
  [
    ['part2', 'bruh', 'no', 'yes', 'cool'],
    ['part3', 'this', 'actually', 'works', 'wow'],
    ['part3', 'this', 'actually', 'works', 'wow'],
    ['part4', 'this', 'actually', 'works', 'wow'],
  ],
  [['static', 'sent', 'ence', 'lol', 'cool']],
  [['static2', 'sent', 'ence', 'lol', 'cool']],
];

function getPossibleCombinations(arr: string[][][]) {
  const possibleCombinations: number[][] = [];
  const val = arr.map(() => 0);
  const max = arr.map(possibleBranches => possibleBranches.length - 1);

  let maxIndex = 0;
  let currentIndex = 0;

  function recordVal() {
    possibleCombinations.push([...val]);
  }

  function reset(mIndex: number) {
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

console.log(getPossibleCombinations(testArray));
