import { loadStyle, create } from "./index.js";

const tooltip = create("div", "#tooltip");

let frameId = null;

/**
 * @param {PointerEvent} ev 
 */
function mouseEventHandler(ev) {
  const target = ev.target;
  if(!(target instanceof Element)) return;

  const text = target.getAttribute("text");
  if(!text) return;

  switch(ev.type) {
    case "pointerover":
    tooltip.setHTML(text).addClass("show");
    break;

    case "pointerout":
    tooltip.removeClass("show");
    break;

    case "pointermove":
    if(frameId) break;

    frameId = requestAnimationFrame(() => {
      tooltip.setStyle("left", ev.clientX + "px")
        .setStyle("top", ev.clientY + "px");

      frameId = null;
    });
  }
}

document.addEventListener("pointerover", mouseEventHandler);
document.addEventListener("pointerout", mouseEventHandler);
document.addEventListener("pointermove", mouseEventHandler);

loadStyle("tooltip").then(() => {
  tooltip.appendTo(document.body);
});

export {};
