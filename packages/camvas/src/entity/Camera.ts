export interface CameraConstructor {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Camera {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(params: CameraConstructor) {
    this.x = params.x;
    this.y = params.y;
    this.width = params.width;
    this.height = params.height;
  }

  draw(context: CanvasRenderingContext2D) {
    context.strokeStyle = 'red';
    context.strokeRect(this.x, this.y, this.width, this.height);
  }

  area(): number {
    return Math.abs(this.width * this.height);
  }

  perimeter(): number {
    return 2 * (Math.abs(this.width) + Math.abs(this.height));
  }

  coordinates(): [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ] {
    return [
      [this.x, this.y],
      [this.x + Math.abs(this.width), this.y],
      [this.x, this.y + Math.abs(this.height)],
      [this.x + Math.abs(this.width), this.y + Math.abs(this.height)],
    ];
  }
}
