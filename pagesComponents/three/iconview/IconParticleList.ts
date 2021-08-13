import * as THREE from "three";
import { changeUvs } from "./changeUvs";
import { createFontAwesomeCanvas } from "./canvas";

export class IconParticleList {
  _matrixLength = 8;
  _particleList: THREE.Mesh[] = [];
  protected _hue: number = 0.6;
  ICON_LIST = [
    61570, // facebook SQUARE
    61594, // facebook
    61575, // fa-thumbs-o-up
    61796, // fa-thumbs-up
    61444, // fa-heart
    61488, // camera
    61755, // html5
  ];
  constructor(size: number) {
    const texture = new THREE.CanvasTexture(
      createFontAwesomeCanvas(this._matrixLength)
    );
    this.createParticles(size, texture);
  }
  get(i: number) {
    return this._particleList[i];
  }

  pop() {
    return this._particleList.pop();
  }

  protected createParticles(size: number, sharedTexture: THREE.Texture) {
    // ------------------------------
    // パーティクルの作成
    // ------------------------------
    const ux = 1 / this._matrixLength;
    const uy = 1 / this._matrixLength;

    this._particleList = [];
    for (let i = 0; i < size; i++) {
      const ox = Math.floor(this._matrixLength * Math.random());
      const oy = Math.floor(this._matrixLength * Math.random());

      const geometry = new THREE.PlaneGeometry(40, 40, 1, 1);
      changeUvs(geometry, ux, uy, ox, oy);

      const material = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        map: sharedTexture,
        transparent: true,
        side: THREE.DoubleSide,
      });

      material.blending = THREE.AdditiveBlending;

      const word = new THREE.Mesh(geometry, material);

      this._particleList.push(word);
    }
  }
}
