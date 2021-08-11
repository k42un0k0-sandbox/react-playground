import * as THREE from "three";
import { OrbitControls } from "./OrbitControlls";

export class BasicView {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  controls?: OrbitControls;
  raf: number = 0;
  containerElement: HTMLElement;
  constructor(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    // camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      200000
    );
    this.camera.position.z = -1000;

    // renderer
    const needAntialias = window.devicePixelRatio === 1.0;
    this.renderer = new THREE.WebGLRenderer({ antialias: needAntialias });
    this.renderer.setClearColor(0x0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", this.handleResize.bind(this));
    this.containerElement.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();
  }

  debug() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * レンダリングを開始します。
   */
  public startRendering(): void {
    this.update();
  }
  public stopRendering(): void {
    cancelAnimationFrame(this.raf);
    this.containerElement.removeChild(this.renderer.domElement);
  }

  /**
   * レンダリングを即座に実行します。
   */
  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 毎フレーム実行される関数です。
   */
  public onTick(): void {
    // to overlide
  }

  /**
   * ウインドウリサイズ時のイベントハンドラーです。
   * @param event
   */
  protected handleResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * requestAnimationFrame で呼び出されるメソッドです。
   * @private
   */
  protected update(): void {
    this.raf = requestAnimationFrame(this.update.bind(this));

    this.controls?.update();
    this.onTick();
    this.render();
  }
}
