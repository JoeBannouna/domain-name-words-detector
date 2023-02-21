"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typo_js_1 = __importDefault(require("typo-js"));
const dictionary = new typo_js_1.default('en_US');
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
class TreeNode {
    constructor(value, startingIndex, parent = null) {
        this.value = { word: value, deadEnd: null, startingIndex: startingIndex };
        this.descendants = [];
        this.parent = parent;
    }
    addChild(value) {
        this.descendants.push(value);
    }
    /** Fire a function in this node and all its children */
    descendantsFunction(func) {
        func(this);
        this.descendants.forEach(child => {
            child.descendantsFunction(func);
        });
    }
    /** Fires a function only at the children with no more descendants */
    fireAFunctionInExternalNodes(func) {
        if (this.descendants.length === 0) {
            func(this);
        }
        else {
            this.descendants.forEach(child => {
                child.fireAFunctionInExternalNodes(func);
            });
        }
    }
    getAllExternalLeaves() {
        if (this.descendants.length === 0) {
            return [this];
        }
        else {
            return this.descendants.flatMap(child => {
                return child.getAllExternalLeaves();
            });
        }
    }
    /** Visualizes the data tree in JSON format */
    visualize() {
        this.visualisation = {};
        this.visualisation['parent'] = this.value.word;
        const { startingIndex, deadEnd } = this.value;
        this.visualisation['data'] = { startingIndex, deadEnd };
        this.visualisation['children'] = this.descendants.map(node => node.visualize());
        return this.visualisation;
    }
    /** UNUSED */
    visualizeAsArray() {
        this.visualisation = {};
        this.visualisation[this.value.word] = this.descendants.map(node => node.visualizeAsArray());
        return this.visualisation;
    }
    /** UNUSED */
    visualizeAsObject() {
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
        function returnParent(node) {
            return node.parent;
        }
        return this.getAllExternalLeaves().map(leave => {
            const branchArr = [];
            let node = leave;
            while (node !== null) {
                branchArr.push(node);
                node = returnParent(node);
            }
            return branchArr.reverse();
        });
    }
    getAllValuesInTree() {
        if (this.descendants.length === 0) {
            return [this.value.word];
        }
        else {
            return [
                this.value.word,
                ...this.descendants.flatMap(child => {
                    return child.getAllValuesInTree();
                }),
            ];
        }
    }
}
function scanDomain(domain, startingIndex) {
    const foundMatches = [];
    for (let i = startingIndex + 1; i < domain.length + 1; i++) {
        const segment = domain.slice(startingIndex, i);
        if (segment.length > 2) {
            if (dictionary.check(capitalizeFirstLetter(segment)))
                foundMatches.push(segment);
        }
    }
    return foundMatches;
}
function scanNextLayerOfNodes(initialNode, domainPart) {
    initialNode.fireAFunctionInExternalNodes(node => {
        if (node.value.deadEnd === null) {
            let i = 0;
            do {
                scanDomain(domainPart, node.value.startingIndex + i).forEach(result => {
                    const child = new TreeNode(result, node.value.startingIndex + i + result.length, node);
                    node.addChild(child);
                });
                if (node.descendants.length === 0)
                    node.value.deadEnd = true;
                else
                    node.value.deadEnd = false;
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
function scanDomainPart(domainPart) {
    const initialNode = new TreeNode(domainPart, 0);
    while (initialNode.getAllLeavesWithoutDeadEnds().length > 0) {
        scanNextLayerOfNodes(initialNode, domainPart);
    }
    let title = 'NOVALUE';
    const branchesArray = initialNode.getAllBranchesAsArrays().map((branch) => {
        var _a;
        const wordsBranch = branch.map(node => node.value.word);
        title = (_a = wordsBranch.shift()) !== null && _a !== void 0 ? _a : 'NOVALUE';
        return wordsBranch;
    });
    return { [title]: branchesArray };
}
function getWordsFromDomain(domain) {
    // Remove domain extension (.com / .net / .org)
    const domainName = domain.replace('www.', '').slice(0, domain.lastIndexOf('.'));
    // Split domain name at each dot (.) occurrence
    // Loop over once and find matching words
    const returnValue = domainName.split(/\.|\-/).map(domainPart => scanDomainPart(domainPart));
    console.log(returnValue);
    return returnValue;
}
function getWordsFromDomains(domains) {
    return domains.map(domain => getWordsFromDomain(domain));
}
const domains = getWordsFromDomains([
    'registeryourcar.com',
    'amazing-innovations.registeryourcar.com',
    'space-nebula.net',
    '50ml.net',
    'mau-perfume.com',
    'crownfights.net',
    'internetdrama.com',
]);
console.log(JSON.stringify(domains, null, 4));
function returnMostLikelyBranchesForDomain(domain) {
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
