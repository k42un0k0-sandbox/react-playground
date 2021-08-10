import * as THREE from "three";
import { changeUvs } from "./changeUvs";
import { createCanvas } from "./createCanvas";

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
    const canvas = this.createCanvas();
    const texture = new THREE.CanvasTexture(canvas);
    this.createParticles(size, texture);
  }
  get(i: number) {
    return this._particleList[i];
  }

  pop() {
    return this._particleList.pop();
  }

  private createCanvas() {
    const SIZE = 256;
    const canvas = createCanvas(
      SIZE * this._matrixLength,
      SIZE * this._matrixLength
    );
    const context = canvas.getContext("2d");

    // ------------------------------
    // パーティクルのテクスチャアトラスを生成
    // ------------------------------
    const len = this._matrixLength * this._matrixLength;
    for (let i = 0; i < len; i++) {
      const char = String.fromCharCode(this.getRandomIcon());

      const x = SIZE * (i % this._matrixLength) + SIZE / 2;
      const y = SIZE * Math.floor(i / this._matrixLength) + SIZE / 2;

      context.fillStyle = "white";
      context.font = "200px FontAwesome";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(char, x, y);
    }
    return canvas;
  }

  private getRandomIcon(): number {
    return this.ICON_LIST[Math.floor(this.ICON_LIST.length * Math.random())];
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
