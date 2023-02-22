import { TreeNodeValueType, TreeNodeVisualization } from "./types";

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

export default TreeNode;