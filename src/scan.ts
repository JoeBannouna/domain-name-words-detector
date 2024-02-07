import path from 'path';

import Typo from 'typo-js';
const dictionary = new Typo('en_US', null, null, { dictionaryPath: path.join('dictionaries') });

import { Domain } from './types';

import TreeNode from './TreeNode.js';

let minimumWordLength = 3;

const shorterThanTwoCharsWords = ['in', 'my', 'on', 'of', 'by', 'at', 'as', 'up', 'a', 'i', 'an', 'do', 'it', 'go', 'me', 'ai'];

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function scanDomain(domain: string, startingIndex: number) {
  const foundMatches: string[] = [];

  for (let i = startingIndex + 1; i < domain.length + 1; i++) {
    const segment = domain.slice(startingIndex, i);
    if (segment.length > minimumWordLength - 1) {
      if (dictionary.check(capitalizeFirstLetter(segment))) foundMatches.push(segment);
    } else if (segment.length <= 2) {
      if (shorterThanTwoCharsWords.includes(segment)) foundMatches.push(segment);
    }
  }

  return foundMatches;
}

function scanNextLayerOfNodes(initialNode: TreeNode, domainPart: string) {
  initialNode.fireAFunctionInExternalNodes(node => {
    if (node.value.deadEnd === null) {
      let i = 0;

      do {
        scanDomain(domainPart, node.value.startingIndex + i).forEach(result => {
          const child = new TreeNode(result, node.value.startingIndex + i + result.length, node);
          node.addChild(child);
        });

        if (node.descendants.length === 0) node.value.deadEnd = true;
        else node.value.deadEnd = false;

        i += 1;
      } while (node.value.deadEnd === true && node.value.startingIndex + i <= domainPart.length - minimumWordLength);
    }
    // FALSE means it has descendants and they must be scanned in that case
    if (node.value.deadEnd === false) {
    }
    // TRUE means that it is a dead end with no descendants
    else {
    }
  });
}

function scanDomainPart(domainPart: string) {
  const initialNode = new TreeNode(domainPart, 0);

  while (initialNode.getAllLeavesWithoutDeadEnds().length > 0) {
    scanNextLayerOfNodes(initialNode, domainPart);
  }

  let title: string = 'NOVALUE';

  const branchesArray = initialNode.getAllBranchesAsArrays().map((branch: TreeNode[]) => {
    const wordsBranch = branch.map(node => node.value.word);
    title = wordsBranch.shift() ?? 'NOVALUE';

    return wordsBranch;
  });

  return { [title]: branchesArray };
}

function getWordsFromDomain(domain: string) {
  // Remove domain extension (.com / .net / .org)

  const domainName = domain.replace('www.', '').slice(0, domain.lastIndexOf('.'));

  // Split domain name at each dot (.) occurrence
  // Loop over once and find matching words
  const returnValue = domainName.split(/\.|\-/).map(domainPart => scanDomainPart(domainPart));

  return returnValue;
}

function getWordsFromDomains(domains: string[]) {
  return domains.map(domain => getWordsFromDomain(domain));
}

function returnMostLikelyBranchesForDomain(domain: Domain) {
  return domain.map(domainPartObj => {
    const domainPartName = Object.keys(domainPartObj)[0];
    const branches = domainPartObj[domainPartName];

    // Get branches with the largest total characters for a domain
    const branchesSortedFromLongestToShortestTotalCharacters = branches.sort((branch1, branch2) => {
      return branch2.join('').length - branch1.join('').length;
    });

    const branchesWithTheLongestTotalCharacters = branchesSortedFromLongestToShortestTotalCharacters.filter(branch => {
      return branch.join('').length === branchesSortedFromLongestToShortestTotalCharacters[0].join('').length;
    });

    // Filter the output branches to get the ones with the least total words (arrays with least items/branches with the least words)
    const branchesSortedFromLeastToLargestAmountOfWords = branchesWithTheLongestTotalCharacters.sort((branch1, branch2) => {
      return branch1.length - branch2.length;
    });

    const branchesWithLeastAmountOfWords = branchesSortedFromLeastToLargestAmountOfWords.filter(branch => {
      return branch.length === branchesSortedFromLeastToLargestAmountOfWords[0].length;
    });

    return branchesWithLeastAmountOfWords;
  });
}

export function findMostLikelyWordsInDomains(domains: string[], minimumWordLengthVar: number = 3) {
  minimumWordLength = minimumWordLengthVar;

  return getWordsFromDomains(domains).map((domain, index) => {
    const mostLikelyBranches = returnMostLikelyBranchesForDomain(domain);
    return { domain: domains[index], parts: mostLikelyBranches, summary: Array.from(new Set(mostLikelyBranches.flat().flat())) };
  });
}
