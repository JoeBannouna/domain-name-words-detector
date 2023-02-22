"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMostLikelyWordsInDomains = void 0;
const typo_js_1 = __importDefault(require("typo-js"));
const dictionary = new typo_js_1.default('en_US');
const TreeNode_1 = __importDefault(require("./TreeNode"));
let minimumWordLength = 3;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function scanDomain(domain, startingIndex) {
    const foundMatches = [];
    for (let i = startingIndex + 1; i < domain.length + 1; i++) {
        const segment = domain.slice(startingIndex, i);
        if (segment.length > minimumWordLength - 1) {
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
                    const child = new TreeNode_1.default(result, node.value.startingIndex + i + result.length, node);
                    node.addChild(child);
                });
                if (node.descendants.length === 0)
                    node.value.deadEnd = true;
                else
                    node.value.deadEnd = false;
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
function scanDomainPart(domainPart) {
    const initialNode = new TreeNode_1.default(domainPart, 0);
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
    return returnValue;
}
function getWordsFromDomains(domains) {
    return domains.map(domain => getWordsFromDomain(domain));
}
function returnMostLikelyBranchesForDomain(domain) {
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
function findMostLikelyWordsInDomains(domains, minimumWordLengthVar = 3) {
    minimumWordLength = minimumWordLengthVar;
    return getWordsFromDomains(domains).map((domain, index) => {
        const mostLikelyBranches = returnMostLikelyBranchesForDomain(domain);
        console.log(mostLikelyBranches);
        return { domain: domains[index], parts: mostLikelyBranches, summary: Array.from(new Set(mostLikelyBranches.flat().flat())) };
    });
}
exports.findMostLikelyWordsInDomains = findMostLikelyWordsInDomains;
