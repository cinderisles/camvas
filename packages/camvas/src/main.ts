import './style.css';
import wasm from '../wasm/Cargo.toml';
import { Camera } from './entity/Camera';

const canvas = document.querySelector('canvas');
const context = canvas?.getContext('2d');
let requestId: number | undefined = undefined;
let zero: number | undefined = undefined;
let prev: number | undefined = undefined;

const record = (
  context: CanvasRenderingContext2D,
  camera: Camera,
  w: any,
  timeStamp: number,
  count: number,
) => {
  if (zero && timeStamp) {
    if (context && camera.width > 0 && camera.height > 0) {
      const image = context.getImageData(
        camera.x,
        camera.y,
        camera.width,
        camera.height,
      );
      w.encode_png(image.width, image.height, image.data);
      count++;

      const elapsed = timeStamp - zero;

      console.log('stats', elapsed + 'ms, ', count + ' frames, ');

      if (count % 10 === 0) {
        const frameTime = prev ? timeStamp - prev : 1;
        const fps = Math.floor(1000 / frameTime);
        console.log('took ' + frameTime + 'ms', fps + ' FPS');
      }

      prev = timeStamp;

      requestId = requestAnimationFrame((t) =>
        record(context, camera, w, t, count),
      );
    }
  }
};

if (canvas && context) {
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let camera: Camera | null = null;
  let isRecording: boolean = false;

  // Function to handle mouse down event
  const handleMouseDown = (event: MouseEvent) => {
    isDrawing = true;
    startX = event.clientX - canvas.offsetLeft;
    startY = event.clientY - canvas.offsetTop;

    if (camera) {
      camera.x = startX;
      camera.y = startY;
    }
  };

  // Function to handle mouse move event
  const handleMouseMove = (event: MouseEvent) => {
    if (!isDrawing) return;

    let currentX = event.clientX - canvas.offsetLeft;
    let currentY = event.clientY - canvas.offsetTop;

    let width = currentX - startX;
    let height = currentY - startY;

    if (camera) {
      camera.width = width;
      camera.height = height;
    } else {
      camera = new Camera({
        x: startX,
        y: startY,
        width,
        height,
      });
    }

    draw();
  };

  // Function to handle mouse up event
  function handleMouseUp() {
    isDrawing = false;
    if (camera) {
      console.log('Area:', camera.area());
      console.log('Perimeter:', camera.perimeter());
      console.log('Coordinates:', camera.coordinates());
    }
    startX = 0;
    startY = 0;
  }

  // Function to draw the camera on the canvas
  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (camera) {
      camera.draw(context);
    }
  };

  // Event listeners
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);

  const resizeObserver = new ResizeObserver((entries) => {
    canvas.width = entries[0].borderBoxSize[0].inlineSize;
    canvas.height = entries[0].borderBoxSize[0].blockSize;
  });

  resizeObserver.observe(document.body);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyR') {
      isRecording = !isRecording;
      if (
        isRecording &&
        context &&
        camera &&
        camera.width > 0 &&
        camera.height > 0
      ) {
        console.log('recording');

        wasm().then((w) => {
          let count: number = 0;
          requestId = requestAnimationFrame((t) => {
            zero = t;
            record(context, camera!, w, t, count);
          });
        });
      } else {
        console.log('stopped recording');
        if (requestId) {
          cancelAnimationFrame(requestId);
        }
      }
    }
  });
}
6;
