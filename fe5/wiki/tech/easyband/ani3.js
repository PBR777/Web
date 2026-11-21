const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const easyband = document.querySelector("#ani3 easyband-demo");
const mask = document.querySelector("#ani3 .mask");
const leftkey = easyband.querySelector(".demo-leftkey");
const rightkey = easyband.querySelector(".demo-rightkey");

async function press(element, t = 100) {
  element.classList.add("glow");
  await sleep(t);
  element.classList.remove("glow");
}

async function animation() {
  easyband.classList.add("off");
  mask.style.maskSize = "0 0";

  await sleep(2000);
  press(leftkey, 300);
  press(rightkey, 300);

  await sleep(100);
  easyband.classList.remove("off");
  mask.style.maskSize = null;

  await sleep(2000);
  press(leftkey, 300);
  press(rightkey, 300);

  setTimeout(animation, 100);
}

animation();
