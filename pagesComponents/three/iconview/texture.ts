import { createCanvas } from "./canvas";
import * as THREE from "three";

const defaultIconList = [
  61570, // facebook SQUARE
  61594, // facebook
  61575, // fa-thumbs-o-up
  61796, // fa-thumbs-up
  61444, // fa-heart
  61488, // camera
  61755, // html5
];
export function createFontAwesomeCanvas(
  matrixLength: number,
  iconList: number[] = defaultIconList
): HTMLCanvasElement {
  // 変数定義
  const SIZE = 800;
  const canvas = createCanvas(SIZE * matrixLength, SIZE * matrixLength);
  const context = canvas.getContext("2d");
  const len = matrixLength * matrixLength;

  // 処理
  for (let i = 0; i < len; i++) {
    pushIcon(i);
  }
  return canvas;

  function pushIcon(i: number) {
    const char = String.fromCharCode(getRandomIcon());

    const x = SIZE * (i % matrixLength) + SIZE / 2;
    const y = SIZE * Math.floor(i / matrixLength) + SIZE / 2;

    context.fillStyle = "white";
    context.font = "20px FontAwesome";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(char, x, y);
  }

  function getRandomIcon(): number {
    return iconList[Math.floor(iconList.length * Math.random())];
  }
}
export function createLabelCanvas(
  label: string,
  fontSize: number,
  w: number,
  h: number
): HTMLCanvasElement {
  // レターオブジェクトを生成します。
  const canvas = createCanvas(w, h);
  const context = canvas.getContext("2d");
  const offsetY = 4;
  const offsetW = w / 2;
  context.fillStyle = "white";
  context.font = fontSize + "px serif";
  context.textAlign = "center";
  context.textBaseline = "top";

  context.fillText(label, offsetW, offsetY);

  return canvas;
}
