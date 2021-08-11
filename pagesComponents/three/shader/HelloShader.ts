import { BasicView } from "../BasicView";
import * as THREE from "three";

export class HelloShader extends BasicView {
  constructor(container: HTMLElement) {
    super(container);

    const geometry = new THREE.SphereGeometry(100, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader: `
              void main() {
                vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
                vec4 mvPosition =  viewMatrix * worldPosition;
                gl_Position = projectionMatrix * mvPosition;
              }
              `,
      fragmentShader: `
              void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
              }
              `,
    });
    this.debug();
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    this.startRendering();
  }
}
