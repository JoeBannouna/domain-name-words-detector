export type TreeNodeValueType = { word: string; deadEnd: null | boolean; startingIndex: number };

export type TreeNodeVisualization = {
  parent: string;
  data: { startingIndex: TreeNodeValueType['startingIndex']; deadEnd: TreeNodeValueType['deadEnd'] };
  children: TreeNodeVisualization[];
};

export type Branch = string[];

export type DomainPart = { [partName: string]: Branch[] };

export type Domain = DomainPart[];
