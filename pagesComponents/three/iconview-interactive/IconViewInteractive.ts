import { IconView } from "../iconview/IconView";
import { TouchTexture } from "./TouchTexture";
import * as THREE from "three";
import { InteractiveControls } from "./InteractiveControls";

export class IconViewInteractive extends IconView {
  hitArea: THREE.Mesh;
  touchTexture: TouchTexture;
  interactive: InteractiveControls;
  angles: number[] = [];
  complete: boolean = false;
  constructor(container: HTMLElement) {
    super(container);
    this.touchTexture = new TouchTexture(this.CANVAS_W, this.CANVAS_H);
    this.initHitArea();
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0px";
    this.initInteractive();

    this.existDotList.forEach((item, i) => {
      item.forEach((value, j) => {
        this.angles.push(Math.random() * 2 * Math.PI);
      });
    });
  }
  private initInteractive() {
    this.interactive = new InteractiveControls(
      this.camera,
      this.renderer.domElement
    );

    this.interactive.objects.push(this.hitArea);
    this.interactive.addListener(
      "interactive-move",
      this.onInteractiveMove.bind(this)
    );
    this.interactive.resize();
  }

  initHitArea() {
    const geometry = new THREE.PlaneGeometry(
      this.CANVAS_W * 30,
      this.CANVAS_H * 30,
      1,
      1
    );
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      depthTest: false,
    });
    material.visible = false;
    this.hitArea = new THREE.Mesh(geometry, material);
    this.hitArea.position.z = 10;
    this.scene.add(this.hitArea);
  }
  onInteractiveMove(e) {
    const uv = e.intersectionData.uv;
    this.touchTexture.addTouch(uv);
  }
  onTick() {
    this.touchTexture.update();
    if (this.complete) this.drawByTouchTexture();
  }

  private drawByTouchTexture() {
    const pixcelColors = this.touchTexture.ctx.getImageData(
      0,
      0,
      this.CANVAS_W,
      this.CANVAS_H
    ).data;
    let cnt = 0;
    this.existDotList.forEach((item, i) => {
      item.forEach((value, j) => {
        if (value == true) return;
        const index = i + j * this.CANVAS_W;
        const flag =
          pixcelColors[index * 4] +
          pixcelColors[index * 4 + 1] +
          pixcelColors[index * 4 + 2] +
          (255 - pixcelColors[index * 4 + 3]);
        const force = (flag / (255 * 4)) * 500;
        const mesh = this.iconParticleList.get(cnt++);
        const z = force;
        const x = force * Math.cos(this.angles[index] || 0);
        const y = force * Math.sin(this.angles[index] || 0);
        const toObj = {
          x: (i - this.CANVAS_W / 2) * 30,
          y: (this.CANVAS_H / 2 - j) * 30,
          z: 0,
        };
        mesh.position.set(toObj.x + x, toObj.y + y, toObj.z + z);
      });
    });
  }
}
