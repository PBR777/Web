import { loadStyle, create } from "./index.js";

const tooltip = create("div", "tooltip");

let isTooltipShowing = false;
let frameId = null;

class Tooltip extends HTMLElement {
  static observedAttributes = ["text"];

  #text = "";

  get text() {
    return this.#text;
  }

  set text(val) {
    this.setAttribute("text", val);
  }

  hideTooltip() {
    tooltip.removeClass("show");
    isTooltipShowing = false;
  }

  showTooltip() {
    tooltip
      .setHTML(this.text)
      .addClass("show");

    isTooltipShowing = true;
  }

  updateTooltip(ev) {
    if(!isTooltipShowing) this.showTooltip();
    if(frameId) return;

    frameId = requestAnimationFrame(() => {
      tooltip
        .setStyle("left", ev.clientX + "px")
        .setStyle("top", ev.clientY + "px")

      frameId = null;
    });
  }

  constructor() {
    super();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.#text = newValue;
  }

  connectedCallback() {
    this.addEventListener("pointerenter", this.showTooltip);
    this.addEventListener("pointerleave", this.hideTooltip);
    this.addEventListener("pointermove", this.updateTooltip);
  }

  disconnectedCallback() {
    this.removeEventListener("pointerenter", this.showTooltip);
    this.removeEventListener("pointerleave", this.hideTooltip);
    this.removeEventListener("pointermove", this.updateTooltip);
  }
}

customElements.define("tool-tip", Tooltip);

loadStyle("tooltip").then(() => {
  tooltip.appendTo(document.body);
});

export {};