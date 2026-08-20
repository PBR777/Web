import { loadStyle, create } from "/fe5/modules/index.js";

const canvas = create("canvas", "background").build();

const ctx = canvas.getContext("2d");
if(!ctx) throw new Error("Canvas is not supported in this browser.");

const canvasDiv = create("div")
  .setId("background-div")
  .append(canvas)
  .appendTo(document.body);

// Load star svg
const starPNG = create("canvas").build();
const pngCtx = starPNG.getContext("2d");

const starSize = 512;
starPNG.width = starSize;
starPNG.height = starSize;

const starImg = new Image();
starImg.src = "/fe5/assets/bg-star.svg";

await new Promise((resolve, reject) => {

  starImg.addEventListener("load", resolve);
  starImg.addEventListener("error", reject);

}).catch(() => {
  throw new Error("Star svg load failed.");
});

pngCtx.drawImage(starImg, 0, 0, starSize, starSize);

// Listen reize event
let starSizeFactor = 0;
const observer = new ResizeObserver(
    (function resizeListener() {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      starSizeFactor = Math.min(canvas.width, canvas.height);

      return resizeListener;
    })());

observer.observe(canvas);

// LCG
let seed = Math.random() * 65536 | 0;
const random = () => {
  seed = seed * 1664525 + 1013904223 | 0;
  return seed / 4294967296 + 0.5;
};

const stars = [];

let initLock = false;

function initCanvas(initialSeed = seed, starCount = 256) {
  if(initLock) throw new Error("Background has been initialized.");

  seed = initialSeed;

  for(let i = starCount; i > 0; i--) {
    stars.push([random(), random(), random() * 48 + 20, (random() + 0.3) * 0.001]);
  }

  const tick = t => {
    const scrollOffset = window.scrollY / canvas.height * 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(const star of stars) {
      const starSize = starSizeFactor / star[2];

      ctx.globalAlpha = Math.sin(t * star[3]) * 0.5 + 0.5;

      const x = star[0] * canvas.width - starSize * 0.5;
      const y = ((star[1] - scrollOffset / star[2]) % 1 + 1) % 1 * canvas.height - starSize * 0.5;

      ctx.drawImage(starPNG, x, y, starSize, starSize);
    }
   
    requestAnimationFrame(tick);
  };

  initLock = true;

  tick();
}

const url = window.location.href;
let urlHash = 0;
for(let i = url.length; i >= 0; i--) {
  urlHash = urlHash + url.charCodeAt(i) * i | 0;
}
initCanvas((urlHash * -2156926 | 0) + 137697);

await loadStyle("background");

export {};