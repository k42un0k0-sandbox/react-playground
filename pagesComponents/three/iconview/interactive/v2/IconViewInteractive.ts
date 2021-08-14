import * as THREE from "three";
import { BasicView } from "../../../BasicView";
import vert from "./vert.glsl";
import vert_copy from "./vert_copy.glsl";
import frag from "./frag.glsl";
import frag_copy from "./frag_copy.glsl";
import { createFontAwesomeCanvas, createLabelCanvas } from "../../canvas";
import { imageBinarization } from "../../imageBinarization";
import { TouchTexture } from "../TouchTexture";
import { InteractiveControls } from "../InteractiveControls";
import { Cubic } from "gsap";
export class IconViewInteractive extends BasicView {
  canvas_width = 250;
  canvas_height = 40;
  icon_matrix = 8;
  hitArea: THREE.Mesh;
  touchTexture: TouchTexture;
  interactive: InteractiveControls;
  startAt: number=0;
  timer:THREE.IUniform={value: 0}
  duration=7000
  complate=false;
  points:THREE.Points;
  material:THREE.ShaderMaterial;
  constructor(container: HTMLElement) {
    super(container);
    this.camera.position.z = 500;
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0px";
    this.touchTexture = new TouchTexture(this.canvas_width, this.canvas_height);
    this.touchTexture.texture.flipY = false;
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
    const rotates_base = [];
    const fromPositions_base = [];
    const relayPositions_base = [];
    const delays_base = [];
    const labelCanvas = createLabelCanvas(
      "K42UN0K0",
      40,
      this.canvas_width,
      this.canvas_height
    );
    const { existDotList,existDotCount } = imageBinarization(
      this.canvas_width,
      this.canvas_height,
      labelCanvas
        .getContext("2d")
        .getImageData(0, 0, this.canvas_width, this.canvas_height).data
    );
    let cnt = 0;
    existDotList.forEach((item, i) => {
      item.forEach((value, j) => {
        if (value) return;
        const toObj = {
          x:i * 3 - existDotList.length * 1.5,
          y:-j * 3 + item.length * 1.5,
          z:0
        }
        vertices_base.push(
          toObj.x,toObj.y,toObj.z
        );
        delays_base.push((Cubic.easeInOut(cnt++ / existDotCount) / 4 + Math.random() / 4));
        indices_base.push(i / existDotList.length, j / item.length);
        icons_base.push(
          Math.floor(Math.random() * this.icon_matrix) / this.icon_matrix,
          Math.floor(Math.random() * this.icon_matrix) / this.icon_matrix,
          1 / 8
        );
        const fromObj = {
          x: 200 * (Math.random() - 0.5) - 50,
          y: 100 * (Math.random() - 0.5),
          z: 500,
        }
        fromPositions_base.push(
           fromObj.x,fromObj.y,fromObj.z
        );
        rotates_base.push(
           10 * Math.PI * (Math.random() - 0.5),
        );
        relayPositions_base.push(
           (0 + toObj.x) / 2 + 30,
           (fromObj.y + toObj.y) / 2 + 50 * Math.random(),
           (fromObj.z + toObj.z) / 2,
        );
        angles_base.push(Math.random() * 2 * Math.PI);
      });
    });
    this.startAt=Date.now()

    const vertices = new Float32Array(vertices_base);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const indices = new Float32Array(indices_base);
    geometry.setAttribute("indice", new THREE.BufferAttribute(indices, 2));
    const icons = new Float32Array(icons_base);
    geometry.setAttribute("icon", new THREE.BufferAttribute(icons, 3));
    const angles = new Float32Array(angles_base);
    geometry.setAttribute("angle", new THREE.BufferAttribute(angles, 1));
    const rotates = new Float32Array(rotates_base);
    geometry.setAttribute("rotate", new THREE.BufferAttribute(rotates, 1));
    const fromPositions = new Float32Array(fromPositions_base);
    geometry.setAttribute("fromPosition", new THREE.BufferAttribute(fromPositions, 3));
    const relayPositions = new Float32Array(relayPositions_base);
    geometry.setAttribute("relayPosition", new THREE.BufferAttribute(relayPositions, 3));
    const delays = new Float32Array(delays_base);
    geometry.setAttribute("delay", new THREE.BufferAttribute(delays, 1));

    const tex = new THREE.CanvasTexture(
      createFontAwesomeCanvas(this.icon_matrix)
    );
    tex.flipY = false;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        size: {
          value: 64.0,
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
    const material_copy = new THREE.ShaderMaterial({
      uniforms: {
        size: {
          value: 64.0,
        },
        tex: {
          value: tex,
        },
        time:this.timer,
      },
      vertexShader: vert_copy,
      fragmentShader: frag_copy,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material_copy);
    this.points = points
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
    material.visible = false;
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
    this.timer.value = (Date.now()-this.startAt) / this.duration;
    if(this.complate==false && this.timer.value >=1.5){
      this.complate=true
      this.points.material = this.material
    }
    this.touchTexture.update();
  }
}
