import { create } from "/fe5/modules/index.js";

const bg = create("canvas", "#bg")
  .appendTo(document.body);

const ctx = bg.get().getContext("2d");

const view = document.querySelector("#main");

const ani = view.animate([
  { translate: "0 -500px", easing: "ease" },
  { translate: "0 0" }
], { duration: 2000 });



function tick() {}
