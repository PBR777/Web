import {create, sleep} from "/fe5/modules/index.js";

const easyband = create(document.querySelector("#ani3 easyband-demo"));
const mask = create(document.querySelector("#ani3 .mask"));
const leftkey = easyband.select(".demo-leftkey");
const rightkey = easyband.select(".demo-rightkey");

async function press(element, t = 100) {
  element.addClass("glow");
  await sleep(t);
  element.removeClass("glow");
}

async function animation() {
  easyband.addClass("off");
  mask.setStyle("maskSize", "0 0");

  await sleep(2000);

  press(leftkey, 300);
  press(rightkey, 300);
  await sleep(100);
  easyband.removeClass("off");
  mask.setStyle("maskSize", "");

  await sleep(2000);

  press(leftkey, 300);
  press(rightkey, 300);
  setTimeout(animation, 100);
}

animation();