import { nanoid } from "nanoid";

export interface BaseNode {
  type: string;
  id: string;
  tid: number; // THREE-id
}

export class PageNode implements BaseNode {
  type = "PAGE";
  id = nanoid();
  tid = 0;
}

export class LineNode implements BaseNode {
  type = "LINE";
  id = nanoid();
  tid = 0;

  color = "#dd2222";
  width = 0;
  x1 = 0;
  y1 = 0;
  x2 = 50;
  y2 = 50;
}

const randomInt = (low: number, high: number) => {
  return Math.floor(Math.random() * (high - low) + low);
};

export const createRandomLineNode = () => {
  const line = new LineNode();
  line.color = "#4f4";

  const left = -50;
  const right = 150;
  const bottom = -50;
  const top = 100;

  line.x1 = randomInt(left, right);
  line.y1 = randomInt(bottom, top);
  line.x2 = randomInt(left, right);
  line.y2 = randomInt(bottom, top);
  line.width = Math.random() * 2;
  line.color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
    Math.random() * 255
  )},${Math.floor(Math.random() * 255)})`;
  return line;
};
