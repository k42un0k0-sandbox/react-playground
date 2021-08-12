import { IconView } from "../iconview/IconView";
import { TouchTexture } from "./TouchTexture";
import * as THREE from "three";
import { InteractiveControls } from "./InteractiveControls";

export class IconViewInteractive extends IconView {
  hitArea: THREE.Mesh;
  touchTexture: TouchTexture;
  interactive: InteractiveControls;
  constructor(container: HTMLElement) {
    super(container);
    this.touchTexture = new TouchTexture(
      this.CANVAS_W * 30,
      this.CANVAS_H * 30
    );
    this.initHitArea();
    this.interactive = new InteractiveControls(
      this.camera,
      this.renderer.domElement
    );
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0px";
    this.interactive.objects.push(this.hitArea);
    this.interactive.addListener(
      "interactive-move",
      this.onInteractiveMove.bind(this)
    );
    // this.interactive.resize(document.body.getBoundingClientRect());
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
    // material.visible = false;
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
  }
}
