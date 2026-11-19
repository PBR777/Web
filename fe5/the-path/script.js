import { create } from "/fe5/modules/index.js";

const bg = create("canvas", "#bg")
  .appendTo(document.body);

const ctx = bg.raw.getContext("2d");
const view = document.querySelector("#main");

let ctrlLock = false;

function firstAni(cb) {
  const ani = view.animate([
    { 
      easing: "ease",
      translate: "0 -600px",
      opacity: 0
    },
    {
      translate: "0 0",
      opacity: 1
    }
  ], { duration: 1500 });

  ani.pause();
  ani.addEventListener("finish", cb);

  document.addEventListener("click", ev => {
    ani.play();
    ev.stopPropagation();
  }, {
    capture: true,
    once: true
  });
}

if(localStorage.getItem("thePathAni") !== "no"
|| new URLSearchParams(location.search).has("ani")) {

  ctrlLock = true;

  firstAni(() => {
    ctrlLock = false;
    localStorage.setItem("thePathAni", "no");
  });

}

document.body.style.visibility = "visible";


function tick() {}
