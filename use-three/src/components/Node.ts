export interface BaseNode {
  type: string;
  color: string;
}

export class LineNode implements BaseNode {
  type = "LINE";
  color = "#6e2";
  x1 = 0;
  y1 = 0;
  x2 = 50;
  y2 = 50;
}
