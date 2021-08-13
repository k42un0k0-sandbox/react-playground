import * as THREE from "three";
import { BasicView } from "../BasicView";
import gsap, { Cubic, Expo } from "gsap";
import MotionPathPlugin from "gsap/dist/MotionPathPlugin";
import { IconParticleList } from "./IconParticleList";
import { imageBinarization } from "./imageBinarization";
import { createLabelCanvas } from "./canvas";

gsap.registerPlugin(MotionPathPlugin);
export class IconView extends BasicView {
  protected _hue: number = 0.6;
  CANVAS_W: number = 250;
  CANVAS_H: number = 40;
  timeline: gsap.core.Timeline;
  existDotList: boolean[][];
  iconParticleList: IconParticleList;
  complete = false;
  constructor(containerElement: HTMLElement) {
    super(containerElement);
    this.camera.position.z = 5000;
    this.addLight();
    this.addBG();

    this.createLetter("HELLO");
  }
  private addBG() {
    const geometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);

    const material = new THREE.MeshPhysicalMaterial({});

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -100;
    this.scene.add(mesh);
  }

  private addLight() {
    const light = new THREE.SpotLight(0xcccccc, 1, 6000, 1.5);
    light.position.set(-2000, -2000, 2000);
    this.scene.add(light);
  }

  createLetter(letter: string) {
    this.timeline = gsap.timeline({
      onComplete: () => {
        this.complete = true;
      },
    });
    const ctx = createLabelCanvas(
      letter,
      40,
      this.CANVAS_W,
      this.CANVAS_H
    ).getContext("2d");

    // 透過領域を判定する
    var { existDotCount, existDotList } = imageBinarization(
      this.CANVAS_W,
      this.CANVAS_H,
      ctx.getImageData(0, 0, this.CANVAS_W, this.CANVAS_H).data
    );
    this.existDotList = existDotList;
    this.iconParticleList = new IconParticleList(
      this.CANVAS_H * this.CANVAS_W - existDotCount
    );
    // レターのモーションを作成する
    let cnt = 0;
    this.existDotList.forEach((item, i) => {
      item.forEach((value, j) => {
        // 透過していたらパスする
        if (value == true) return;
        // add particle to scene
        const word: THREE.Mesh = this.iconParticleList.get(cnt++);

        // TODO: hslよくわからん
        (word.material as THREE.MeshLambertMaterial).color.setHSL(
          this._hue + ((i * this.CANVAS_H) / existDotCount - 0.5) * 0.2,
          0.5,
          0.6 + 0.4 * Math.random()
        );
        this.scene.add(word);

        // calc delay
        const delay = Cubic.easeInOut(cnt / 1600) * 3.0 + 1.5 * Math.random();

        // animate visible
        word.visible = false;
        this.timeline.set(word, { visible: true }, delay);

        // animate position
        const toObj = {
          x: (i - this.CANVAS_W / 2) * 30,
          y: (this.CANVAS_H / 2 - j) * 30,
          z: 0,
        };

        const fromObj = {
          x: 2000 * (Math.random() - 0.5) - 500,
          y: 1000 * (Math.random() - 0.5),
          z: +10000,
        };
        word.position.set(fromObj.x, fromObj.y, fromObj.z);

        this.timeline.to(
          word.position,
          {
            duration: 7,
            motionPath: {
              path: [
                fromObj,
                {
                  x: (0 + toObj.x) / 2 + 300,
                  y: (fromObj.y + toObj.y) / 2 + 500 * Math.random(),
                  z: (fromObj.z + toObj.z) / 2,
                },
                toObj,
              ],
            },
            ease: Expo.easeInOut,
          },
          delay
        );

        // animate rotation
        const toRotationObj = {
          z: 0,
        };

        const fromRotationObj = {
          z: 10 * Math.PI * (Math.random() - 0.5),
        };

        word.rotation.z = fromRotationObj.z;

        this.timeline.to(
          word.rotation,
          {
            duration: 6,
            z: toRotationObj.z,
            ease: Cubic.easeInOut,
          },
          delay
        );
      });
    });
  }
}
