declare module "curtainsjs" {
  export class Curtains {
    constructor(options: { container: string; pixelRatio: number });
  }
  export class Plane {
    uniforms: any;
    constructor(curtains: Curtains, elm: HTMLElement, params: any);
    onRender(cb: () => void);
  }
}
