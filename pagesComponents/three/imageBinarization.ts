export function imageBinarization(
  width: number,
  height: number,
  pixcelColors: Uint8ClampedArray
) {
  const existDotList: boolean[][] = [];
  let existDotCount = 0;
  for (let i = 0; i < width; i++) {
    existDotList[i] = [];
    for (let j = 0; j < height; j++) {
      // 透過しているか判定
      const flag = pixcelColors[(i + j * width) * 4 + 3] === 0;
      existDotList[i][j] = flag;

      if (flag === true) {
        existDotCount++;
      }
    }
  }
  return { existDotCount, existDotList };
}
