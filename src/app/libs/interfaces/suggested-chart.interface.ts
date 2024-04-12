export interface SuggestedChart {
  data1: Coordinates[];
  data2: {
    group: string;
    value: number;
  }[];
}

export interface Coordinates {
  x: number;
  y: number;
}
