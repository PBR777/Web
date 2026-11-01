import { loadStyle, create } from "./index.js";

const canvasDiv = create("div", "#background-div");

const canvas = create("canvas", "#background")
  .appendTo(canvasDiv)
  .get();

/**@type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const STAR_SIZE = 512;

const starPNG = create("canvas").get();
starPNG.width = STAR_SIZE;
starPNG.height = STAR_SIZE;

const starImg = new Image();
const {promise: starImgLoadPromise, resolve, reject} = Promise.withResolvers();
starImg.src = "/fe5/assets/bg-star.svg";
starImg.addEventListener("load", resolve);
starImg.addEventListener("error", reject);
starImgLoadPromise
  .then(() => starPNG.getContext("2d").drawImage(starImg, 0, 0, STAR_SIZE, STAR_SIZE))
  .catch(err => console.error(err));

// LCG
let seed = Math.random() * 65536 | 0;
const random = () => {
  seed = seed * 1664525 + 1013904223 | 0;
  return seed / 4294967296 + 0.5;
};

const stars = [];

let resized = true;

const observer = new ResizeObserver(() => resized = true);
observer.observe(canvas);

let starSizeFactor = 0;

function tick(t) {
  if(resized) {
    resized = false;
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    starSizeFactor = Math.min(canvas.width, canvas.height);
  }

  const scrollOffset = window.scrollY / canvas.height * 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(let i = 0; i < stars.length; i += 4) {
    const starSize = starSizeFactor / stars[i + 2];

    ctx.globalAlpha = (Math.sin(t * stars[i + 3]) * 0.5 + 0.5) * 0.3 + 0.7;

    const x = stars[i] * canvas.width - starSize * 0.5;
    const y = ((stars[i + 1] - scrollOffset / stars[i + 2]) % 1 + 1) % 1 * canvas.height - starSize * 0.5;

    ctx.drawImage(starPNG, x, y, starSize, starSize);
  }
  
  requestAnimationFrame(tick);
}

async function initCanvas(initialSeed = seed, starCount = 256) {
  if(!ctx) return false;

  await starImgLoadPromise;

  seed = initialSeed;
  for(let i = starCount; i > 0; i--) {
    stars.push(random(), random(), random() * 96 + 40, (random() + 0.3) * 0.003);
  }
  
  tick();
  return true;
}

loadStyle("background").then(() => {

  const url = window.location.href;
  let urlHash = 0;
  for(let i = url.length - 1; i >= 0; i--) {
    urlHash = urlHash + url.charCodeAt(i) * i | 0;
  }

  const isSupported = initCanvas((urlHash * -2156926 | 0) + 137697);
  if(!isSupported) throw new Error("Canvas is not supported in this browser.");
});

canvasDiv.appendTo(document.body);

export {};
