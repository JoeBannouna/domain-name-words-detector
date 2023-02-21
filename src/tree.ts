import Typo from 'typo-js';
const dictionary = new Typo('en_US');

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type TreeNodeValueType = { word: string; deadEnd: null | boolean; startingIndex: number };

type TreeNodeVisualization = {
  parent: string;
  data: { startingIndex: TreeNodeValueType['startingIndex']; deadEnd: TreeNodeValueType['deadEnd'] };
  children: TreeNodeVisualization[];
};

class TreeNode {
  visualisation: any;
  value: TreeNodeValueType;
  descendants: typeof this[];
  parent: TreeNode | null;

  constructor(value: TreeNodeValueType['word'], startingIndex: number, parent: TreeNode | null = null) {
    this.value = { word: value, deadEnd: null, startingIndex: startingIndex };
    this.descendants = [];
    this.parent = parent;
  }

  addChild(value: typeof this) {
    this.descendants.push(value);
  }

  /** Fire a function in this node and all its children */
  descendantsFunction(func: (node: TreeNode) => void) {
    func(this);
    this.descendants.forEach(child => {
      child.descendantsFunction(func);
    });
  }

  /** Fires a function only at the children with no more descendants */
  fireAFunctionInExternalNodes(func: (node: TreeNode) => void) {
    if (this.descendants.length === 0) {
      func(this);
    } else {
      this.descendants.forEach(child => {
        child.fireAFunctionInExternalNodes(func);
      });
    }
  }

  getAllExternalLeaves(): TreeNode[] {
    if (this.descendants.length === 0) {
      return [this];
    } else {
      return this.descendants.flatMap(child => {
        return child.getAllExternalLeaves();
      });
    }
  }

  /** Visualizes the data tree in JSON format */
  visualize(): TreeNodeVisualization {
    this.visualisation = {};
    this.visualisation['parent'] = this.value.word;

    const { startingIndex, deadEnd } = this.value;
    this.visualisation['data'] = { startingIndex, deadEnd };

    this.visualisation['children'] = this.descendants.map(node => node.visualize());
    return this.visualisation;
  }

  /** UNUSED */
  visualizeAsArray(): any {
    this.visualisation = {};
    this.visualisation[this.value.word] = this.descendants.map(node => node.visualizeAsArray());
    return this.visualisation;
  }

  /** UNUSED */
  visualizeAsObject(): any {
    this.visualisation = {};
    this.descendants.forEach(node => {
      this.visualisation[node.value.word] = node.visualizeAsObject();
    });

    return this.visualisation;
  }

  getAllLeavesWithoutDeadEnds() {
    return this.getAllExternalLeaves().filter(node => node.value.deadEnd !== true);
  }

  /** Returns each branch in the tree under this node as an array starting with the parent node */
  getAllBranchesAsArrays() {
    function returnParent(node: TreeNode) {
      return node.parent;
    }

    return this.getAllExternalLeaves().map(leave => {
      const branchArr: TreeNode[] = [];

      let node: TreeNode | null = leave;
      while (node !== null) {
        branchArr.push(node);
        node = returnParent(node);
      }

      return branchArr.reverse();
    });
  }

  getAllValuesInTree(): TreeNode['value']['word'][] {
    if (this.descendants.length === 0) {
      return [this.value.word];
    } else {
      return [
        this.value.word,
        ...this.descendants.flatMap(child => {
          return child.getAllValuesInTree();
        }),
      ];
    }
  }
}

function scanDomain(domain: string, startingIndex: number) {
  const foundMatches: string[] = [];

  for (let i = startingIndex + 1; i < domain.length + 1; i++) {
    const segment = domain.slice(startingIndex, i);
    if (segment.length > 2) {
      if (dictionary.check(capitalizeFirstLetter(segment))) foundMatches.push(segment);
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
      } while (node.value.deadEnd === true && node.value.startingIndex + i <= domainPart.length - 3);
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

  console.log(returnValue);

  return returnValue;
}

function getWordsFromDomains(domains: string[]) {
  return domains.map(domain => getWordsFromDomain(domain));
}

type Branch = string[];

type DomainPart = { [partName: string]: Branch[] };

type Domain = DomainPart[];

const domains: Domain[] = getWordsFromDomains([
  'registeryourcar.com',
  'amazing-innovations.registeryourcar.com',
  'space-nebula.net',
  '50ml.net',
  'mau-perfume.com',
  'crownfights.net',
  'internetdrama.com',
]);

console.log(JSON.stringify(domains, null, 4));

function returnMostLikelyBranchesForDomain(domain: Domain) {
  return domain.map(domainPartObj => {
    const domainPartName = Object.keys(domainPartObj)[0];
    const branches = domainPartObj[domainPartName];

    // Get branches with the largest total characters for a domain
    const branchesSortedFromLongestToShortestTotalCharacters = branches
      .sort(branch => {
        return branch.join('').length;
      })
      .reverse();

    const branchesWithTheLongestTotalCharacters = branchesSortedFromLongestToShortestTotalCharacters.filter(branch => {
      return branch.join('').length === branchesSortedFromLongestToShortestTotalCharacters[0].join('').length;
    });

    // Filter the output branches to get the ones with the least total words (arrays with least items/branches with the least words)
    const branchesSortedFromLeastToLargestAmountOfWords = branchesWithTheLongestTotalCharacters.sort(branch => {
      return branch.length;
    });

    const branchesWithLeastAmountOfWords = branchesSortedFromLeastToLargestAmountOfWords.filter(branch => {
      return branch.length === branchesSortedFromLeastToLargestAmountOfWords[0].length;
    });

    return branchesWithLeastAmountOfWords;
  });
}

domains.forEach(domain => {
  console.log(returnMostLikelyBranchesForDomain(domain));
});
