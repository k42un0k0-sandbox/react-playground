import { useEffect, useRef, useState } from "react";

export default function Puzzle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    imageRef.current = new Image();
    imageRef.current.src = "/mush.png";
    imageRef.current.onload = () => {
      setInitialized(true);
    };
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!initialized) return;
    if (canvas == null || ctx == null) return;
    const scene = new Scene(ctx, canvas);
    const pannel = new Pannel(ctx);
    pannel.size = { width: 1000, height: 1000 };
    const n = 4;
    const imageWidth = imageRef.current.width / n;
    const imageHeight = imageRef.current.height / n;
    for (let i = 0; i < n ** 2; i++) {
      pannel.append(
        new Piece(
          ctx,
          scene,
          imageRef.current,
          i % n,
          Math.floor(i / 4),
          imageWidth,
          imageHeight
        )
      );
    }
    scene.append(pannel);
    scene.start();
    console.log(pannel);
  }, [initialized]);
  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid black" }}
      width={"1000"}
      height={"1000"}
    />
  );
}

/**
 * ポジション
 */
type Position = {
  /** 右上角の横軸 */
  x: number;
  /** 右上角の縦軸 */
  y: number;
};
type Size = { width: number; height: number };

abstract class Entity {
  position: Position = { x: 0, y: 0 };
  size: Size = { width: 0, height: 0 };
  constructor(protected _ctx: CanvasRenderingContext2D) {}
  abstract draw(parentPos: Position, parentSize: Size): void;
  on<T extends keyof HTMLElementEventMap>(
    type: T,
    e: HTMLElementEventMap[T],
    parentPos: Position
  ) {}
  mayHit(e: MouseEvent, parentPos: Position) {
    const pos = { x: e.clientX, y: e.clientY };
    return (
      parentPos.x + this.position.x < pos.x &&
      pos.x < parentPos.x + this.position.x + this.size.width &&
      parentPos.y + this.position.y < pos.y &&
      pos.y < parentPos.y + this.position.y + this.size.height
    );
  }
}

class Container extends Entity {
  protected entities: Entity[] = [];
  computedPos(parentPos: Position): Position {
    return {
      x: parentPos.x + this.position.x,
      y: parentPos.y + this.position.y,
    };
  }

  draw(parentPos: Position, parentSize: Size) {
    this.entities.forEach((entity) => {
      entity.draw(this.computedPos(parentPos), this.size);
    });
  }

  append(e: Entity) {
    this.entities.push(e);
  }

  /**
   * 前面のentitiesから走査する
   * @description
   * 後ろから走査するため `cb`に渡される`i`は`エンティティの長さ - 1`から始まる
   * @param cb
   */
  scanEntitiesFromTop(
    cb: (entity: Entity, /** entityのインデックス */ i?: number) => boolean
  ) {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      if (cb(this.entities[i], i)) {
        break;
      }
    }
  }

  on<T extends keyof HTMLElementEventMap>(
    type: T,
    e: HTMLElementEventMap[T],
    parentPos: Position
  ) {
    if (e instanceof MouseEvent) {
      this.scanEntitiesFromTop((entity) => {
        if (entity.mayHit(e, this.computedPos(parentPos))) {
          entity.on(type, e, this.computedPos(parentPos));
          return true;
        }
      });
    }
  }
}

class Scene extends Container {
  constructor(ctx: CanvasRenderingContext2D, _canvas: HTMLCanvasElement);
  constructor(
    ctx: CanvasRenderingContext2D,
    _canvas: HTMLCanvasElement,
    width: number,
    height: number
  );
  constructor(
    ctx: CanvasRenderingContext2D,
    private _canvas: HTMLCanvasElement,
    width: number = 0,
    height: number = 0
  ) {
    super(ctx);
    this.size = { width, height };
    this._canvas.addEventListener("mouseup", (e) =>
      this.on("mouseup", e, {
        x: this.position.x + this._canvas.getBoundingClientRect().left,
        y: this.position.y + this._canvas.getBoundingClientRect().top,
      })
    );
    this._canvas.addEventListener("mousemove", (e) =>
      this.on("mousemove", e, {
        x: this.position.x + this._canvas.getBoundingClientRect().left,
        y: this.position.y + this._canvas.getBoundingClientRect().top,
      })
    );
    this._canvas.addEventListener("mousedown", (e) =>
      this.on("mousedown", e, {
        x: this.position.x + this._canvas.getBoundingClientRect().left,
        y: this.position.y + this._canvas.getBoundingClientRect().top,
      })
    );
  }
  getMousePos(e: MouseEvent) {
    var rect = this._canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
  draw() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    super.draw(
      {
        x: this.position.x,
        y: this.position.y,
      },
      { width: this.size.width, height: this.size.height }
    );

    requestAnimationFrame(this.draw.bind(this));
  }
  start() {
    this.draw();
  }
}
class Pannel extends Container {
  private moveEntityToTop(i: number) {
    const entity = this.entities[i];
    this.entities.splice(i, 1);
    this.entities.push(entity);
  }
  on<T extends keyof HTMLElementEventMap>(
    type: T,
    event: HTMLElementEventMap[T],
    parentPos: Position
  ) {
    super.on(type, event, parentPos);
    const tuple: [keyof HTMLElementEventMap, HTMLElementEventMap[T]] = [
      type,
      event,
    ];
    if (onGuard("mousedown", tuple)) {
      const [t, e] = tuple;
      this.scanEntitiesFromTop((entity, i) => {
        if (entity.mayHit(e, this.computedPos(parentPos))) {
          this.moveEntityToTop(i);
          return true;
        }
      });
      return;
    }
  }
}

class Piece extends Entity {
  isMoving?: { x: number; y: number };

  constructor(
    ctx: CanvasRenderingContext2D,
    private _scene: Scene,
    private _image: HTMLImageElement,
    private _ix: number,
    private _iy: number,
    width: number = 0,
    height: number = 0
  ) {
    super(ctx);
    this.position = { x: _ix * width, y: _iy * height };
    this.size = { width, height };
  }
  draw(parentPos: Position): void {
    this._ctx.save();
    this._ctx.globalCompositeOperation = "multiply";
    this._ctx.drawImage(
      this._image,
      this._ix * this.size.width,
      this._iy * this.size.height,
      this.size.width,
      this.size.height,
      parentPos.x + this.position.x,
      parentPos.y + this.position.y,
      this.size.width,
      this.size.height
    );
    this._ctx.restore();
  }
  on<T extends keyof HTMLElementEventMap>(
    ...tuple: [type: T, event: HTMLElementEventMap[T]]
  ) {
    if (onGuard("mousedown", tuple)) {
      const [_, event] = tuple;
      this.isMoving = this._scene.getMousePos(event);
      return;
    }
    if (onGuard("mousemove", tuple) && !!this.isMoving) {
      const [_, event] = tuple;
      const pos = this._scene.getMousePos(event);
      this.position = {
        x: this.position.x + (pos.x - this.isMoving.x),
        y: this.position.y + (pos.y - this.isMoving.y),
      };
      this.isMoving = pos;
    }
    if (onGuard("mouseup", tuple) && !!this.isMoving) {
      const [_, event] = tuple;
      const pos = this._scene.getMousePos(event);
      this.position = {
        x: this.position.x + (pos.x - this.isMoving.x),
        y: this.position.y + (pos.y - this.isMoving.y),
      };
      this.isMoving = null;
    }
  }
}

function onGuard<T extends keyof HTMLElementEventMap>(
  typeActual: T,
  tuple: [
    type: keyof HTMLElementEventMap,
    e: HTMLElementEventMap[keyof HTMLElementEventMap]
  ]
): tuple is [type: T, e: HTMLElementEventMap[T]] {
  return typeActual === tuple[0];
}
