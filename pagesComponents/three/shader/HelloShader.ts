import { BasicView } from "../BasicView";
import * as THREE from "three";
import vert from "./hello-vert.glsl";
import frag from "./hello-frag.glsl";

export class HelloShader extends BasicView {
  constructor(container: HTMLElement) {
    super(container);

    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
    });
    this.debug();
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    this.startRendering();
  }
}
