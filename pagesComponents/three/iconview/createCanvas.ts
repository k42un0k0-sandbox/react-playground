export function createCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", w + "px");
  canvas.setAttribute("height", h + "px");
  return canvas;
}
