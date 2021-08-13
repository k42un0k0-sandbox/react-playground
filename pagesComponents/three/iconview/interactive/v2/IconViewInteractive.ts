import * as THREE from "three";
import { BasicView } from "../../../BasicView";
import vert from "./vert.glsl";
import frag from "./frag.glsl";
import { createFontAwesomeCanvas, createLabelCanvas } from "../../canvas";
import { imageBinarization } from "../../imageBinarization";
import { TouchTexture } from "../TouchTexture";
import { InteractiveControls } from "../InteractiveControls";

export class IconViewInteractive extends BasicView {
  canvas_width = 250;
  canvas_height = 40;
  icon_matrix = 8;
  hitArea: THREE.Mesh;
  touchTexture: TouchTexture;
  interactive: InteractiveControls;
  constructor(container: HTMLElement) {
    super(container);
    this.camera.position.z = 500;
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0px";
    this.touchTexture = new TouchTexture(this.canvas_width, this.canvas_height);
    this.initHitArea();
    this.initInteractive();
    this.initPoints();
  }
  private initPoints() {
    const geometry = new THREE.BufferGeometry();
    const vertices_base = [];
    const indices_base = [];
    const angles_base = [];
    const icons_base = [];
    const labelCanvas = createLabelCanvas(
      "HELLO",
      40,
      this.canvas_width,
      this.canvas_height
    );
    const { existDotList } = imageBinarization(
      this.canvas_width,
      this.canvas_height,
      labelCanvas
        .getContext("2d")
        .getImageData(0, 0, this.canvas_width, this.canvas_height).data
    );
    existDotList.forEach((item, i) => {
      item.forEach((value, j) => {
        if (value) return;
        vertices_base.push(
          i * 3 - existDotList.length * 1.5,
          -j * 3 + item.length * 1.5,
          0
        );

        icons_base.push(
          Math.floor(Math.random() * this.icon_matrix) / this.icon_matrix,
          Math.floor(Math.random() * this.icon_matrix) / this.icon_matrix,
          1 / 8
        );
        angles_base.push(Math.random() * 2 * Math.PI);
      });
    });

    const vertices = new Float32Array(vertices_base);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const indices = new Float32Array(indices_base);
    geometry.setAttribute("indice", new THREE.BufferAttribute(indices, 2));
    const icons = new Float32Array(icons_base);
    geometry.setAttribute("icon", new THREE.BufferAttribute(icons, 3));
    const angles = new Float32Array(angles_base);
    geometry.setAttribute("angle", new THREE.BufferAttribute(angles, 1));

    const tex = new THREE.CanvasTexture(
      createFontAwesomeCanvas(this.icon_matrix)
    );
    tex.flipY = false;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        size: {
          value: 30.0,
        },
        tex: {
          value: tex,
        },
        touch: {
          value: this.touchTexture.texture,
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

  initHitArea() {
    const geometry = new THREE.PlaneGeometry(
      this.canvas_width * 3,
      this.canvas_height * 3,
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
  onInteractiveMove(e) {
    console.log("aaa");
    const uv = e.intersectionData.uv;
    this.touchTexture.addTouch(uv);
  }
  onTick() {
    this.touchTexture.update();
  }
}
