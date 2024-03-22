import './style.css';
import wasm from '../wasm/Cargo.toml';
import { Camera } from './entity/Camera';
import { zip, type AsyncZippableFile } from 'fflate';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';

const canvas = document.querySelector('canvas');
const context = canvas?.getContext('2d');
let requestId: number | undefined = undefined;
let zero: number | undefined = undefined;
let prev: number | undefined = undefined;

let images: ImageData[] = [];

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
        camera.x + camera.lineWidth,
        camera.y + camera.lineWidth,
        camera.width - 2 * camera.lineWidth,
        camera.height - 2 * camera.lineWidth,
      );
      w.encode_png(image.width, image.height, image.data);
      count++;

      images.push(image);

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

  let rotationAngle = 0;
  const rotationSpeed = 0.02;

  const handleMouseDown = (event: MouseEvent) => {
    isDrawing = true;
    startX = event.clientX - canvas.offsetLeft;
    startY = event.clientY - canvas.offsetTop;

    if (camera) {
      camera.x = startX;
      camera.y = startY;
    }
  };

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
  };

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

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(rotationAngle);
    context.fillStyle = 'blue';
    context.fillRect(-50, -25, 100, 50);
    context.setTransform(1, 0, 0, 1, 0, 0);
    rotationAngle += rotationSpeed;

    if (camera) {
      camera.draw(context);
    }

    requestAnimationFrame(draw);
  };

  draw();

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);

  const resizeObserver = new ResizeObserver((entries) => {
    canvas.width = entries[0].borderBoxSize[0].inlineSize;
    canvas.height = entries[0].borderBoxSize[0].blockSize;
  });

  resizeObserver.observe(document.body);

  window.addEventListener('keydown', async (e) => {
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

        const w = await wasm();
        let count: number = 0;
        requestId = requestAnimationFrame((t) => {
          zero = t;
          record(context, camera!, w, t, count);
        });
      } else {
        console.log('stopped recording');
        if (requestId) {
          cancelAnimationFrame(requestId);
        }

        const temp = document.createElement('canvas');
        const tempctx = temp.getContext('2d');

        const ffmpeg = new FFmpeg();

        ffmpeg.on('log', ({ message }) => {
          console.log(message);
        });

        await ffmpeg.load({
          coreURL,
          wasmURL,
        });
        console.log('ffmpeg loaded');

        await Promise.all(
          images.map((img, index) => {
            tempctx?.clearRect(0, 0, temp.width, temp.height);
            temp.width = img.width;
            temp.height = img.height;
            tempctx?.putImageData(img, 0, 0);

            return new Promise((resolve, reject) => {
              temp.toBlob((b) => {
                if (b) {
                  resolve(
                    b.arrayBuffer().then((a) => {
                      ffmpeg.writeFile(`${index}-frame.png`, new Uint8Array(a));
                    }),
                  );
                } else {
                  reject();
                }
              });
            });
          }),
        );
        console.log('wrote files');

        await ffmpeg.exec([
          '-r',
          '144',
          '-i',
          '%01d-frame.png',
          '-c:v',
          'libvpx',
          '-pix_fmt',
          'yuv420p',
          'video.webm',
        ]);
        console.log('created video.webm');

        const v = await ffmpeg.readFile('video.webm');

        const link = document.createElement('a');
        link.href = URL.createObjectURL(
          new Blob([v], {
            type: 'video/webm',
          }),
        );
        link.download = 'video.webm';
        document.body.appendChild(link);
        link.click();

        let saveAsZip = false;

        if (saveAsZip) {
          const entries = await Promise.all(
            images.map((img, index) => {
              tempctx?.clearRect(0, 0, temp.width, temp.height);
              temp.width = img.width;
              temp.height = img.height;
              tempctx?.putImageData(img, 0, 0);

              return new Promise<[PropertyKey, AsyncZippableFile]>(
                (resolve, reject) => {
                  temp.toBlob((b) => {
                    if (b) {
                      resolve(
                        b.arrayBuffer().then((a) => {
                          const tee: [PropertyKey, AsyncZippableFile] = [
                            `${index}-frame.png`,
                            [
                              new Uint8Array(a),
                              {
                                level: 0,
                              },
                            ],
                          ];

                          return tee;
                        }),
                      );
                    } else {
                      reject();
                    }
                  });
                },
              );
            }),
          );

          zip(Object.fromEntries(entries), (err, data) => {
            if (err) {
              console.error(err);
              return;
            }

            const link = document.createElement('a');
            link.href = URL.createObjectURL(
              new Blob([data], {
                type: 'application/zip',
              }),
            );
            link.download = 'thing.zip';
            document.body.appendChild(link);
            link.click();
          });
        }

        images = [];
      }
    }
  });
}
