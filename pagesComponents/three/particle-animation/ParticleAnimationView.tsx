import { BasicView } from "../BasicView";
import * as THREE from "three";
import vert from "./vert.glsl";
import frag from "./frag.glsl";
import { IUniform } from "three";

// https://blog.tsumikiinc.com/article/20160225_threejs-points.html
export class ParticleAnimationView extends BasicView {
  timer: IUniform = { value: 1.0 };
  constructor(container: HTMLElement) {
    super(container);

    const geometry = new THREE.BufferGeometry();
    const vertices_base = [];
    const colors_base = [];
    for (let i = 0; i < 300000; i++) {
      const x = Math.floor(Math.random() * 1000 - 500);
      const y = Math.floor(Math.random() * 1000 - 500);
      const z = Math.floor(Math.random() * 1000 - 500);
      vertices_base.push(x, y, z);
      const h = (i % 360) / 360;
      const s = 0.2 + Math.random() * 0.2;
      const v = 0.8 + Math.random() * 0.2;
      colors_base.push(h, s, v);
    }

    const vertices = new Float32Array(vertices_base);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const colors = new Float32Array(colors_base);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const createTexture = function () {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let grad = null;
      let texture = null;

      canvas.width = 128;
      canvas.height = 128;
      grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0.0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.1, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(0.2, "rgba(255, 255, 255, 0.2)");
      grad.addColorStop(1.0, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.arc(64, 64, 64, 0, Math.PI / 180, true);
      ctx.fill();

      texture = new THREE.Texture(canvas);
      texture.minFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
      return texture;
    };
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: this.timer,
        size: {
          value: 32.0,
        },
        tex: {
          value: createTexture(),
        },
      },
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
  }
  onTick() {
    this.timer.value++;
  }
}
