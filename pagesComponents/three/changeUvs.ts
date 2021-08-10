import * as THREE from "three";

/**
 * ジオメトリ内のUVを変更します。
 * @param geometry    {THREE.PlaneGeometry}
 * @param unitx    {number}
 * @param unity    {number}
 * @param offsetx    {number}
 * @param offsety    {number}
 */
export function changeUvs(
  geometry: THREE.PlaneGeometry,
  unitx: number,
  unity: number,
  offsetx: number,
  offsety: number
): void {
  const uvAttr = geometry.getAttribute("uv");
  if (!("isBufferAttribute" in uvAttr)) return;
  for (let i = 0; i < uvAttr.count; i++) {
    const x = (uvAttr.getX(i) + offsetx) * unitx;
    const y = (uvAttr.getY(i) + offsety) * unity;
    uvAttr.setXY(i, x, y);
  }

  // const faceVertexUvs = geometry.faceVertexUvs[0];
  // faceVertexUvs.forEach((uvs: any, i: number) => {
  //   uvs.forEach((uv: any, j: number) => {
  //     uv.x = (uv.x + offsetx) * unitx;
  //     uv.y = (uv.y + offsety) * unity;
  //   });
  // });
}
