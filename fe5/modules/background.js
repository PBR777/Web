import { loadStyle, create } from "./index.js";

const STAR_SIZE = 256;

const {promise: starImgLoadPromise, resolve, reject} = Promise.withResolvers();

const starPNG = create("canvas").for(star => {
  star.width = star.height = STAR_SIZE;
  const starImg = new Image();

  starImgLoadPromise.then(() => {
    star.getContext("2d")
      .drawImage(starImg, 0, 0, STAR_SIZE, STAR_SIZE);
  });

  starImg.onload = resolve;
  starImg.onerror = reject;
  starImg.src = "/fe5/assets/bg-star.svg";
}).raw;

async function initCanvas(seed, starCount = 256) {
  const canvasDiv = create("div", "#background-div");

  const canvas = create("canvas", "#background")
    .appendTo(canvasDiv)
    .raw;

  const ctx = canvas.getContext("2d");

  if(!ctx) return console.error("Canvas is not supported in this browser.");

  try {
    await starImgLoadPromise;
  } catch {
    return console.error("star.svg load failed.");
  }

  seed ??= (Math.random() - 0.5) * 65536 | 0;
  const random = () => {
    seed = seed * 1664525 + 1013904223 | 0;
    return seed / 4294967296 + 0.5;
  };

  const stars = new Float16Array(starCount * 4);
  for(let i = 0; i < stars.length; ) {
    stars[i++] = random();
    stars[i++] = random();
    stars[i++] = random() * 96 + 40;
    stars[i++] = random() * 0.003 + 0.0009;
  }

  let resized = true;

  new ResizeObserver(() => resized = true)
    .observe(canvas);

  canvasDiv.appendTo(document.body);

  let starSizeFactor = 0;
  const tick = t => {
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

  tick(0);
}

loadStyle("background").then(() => {

  const url = location.pathname;
  let urlHash = 0;
  for(let i = url.length - 1; i >= 0; i--) {
    urlHash = urlHash + url.charCodeAt(i) * i | 0;
  }

  initCanvas(urlHash * -2156926 + 137697 | 0);
});

export {};
