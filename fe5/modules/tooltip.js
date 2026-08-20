import { loadStyle, create } from "/fe5/modules/index.js";

const tooltip = create("div", "tooltip")
  .appendTo(document.body);

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
    tooltip.classList.remove("show");
    isTooltipShowing = false;
  }

  showTooltip() {
    tooltip.innerHTML = this.text;
    tooltip.classList.add("show");
    isTooltipShowing = true;
  }

  updateTooltip(ev) {
    if(!isTooltipShowing) this.showTooltip();
    if(frameId) return;

    frameId = requestAnimationFrame(() => {
      tooltip.style.left = ev.clientX + "px";
      tooltip.style.top = ev.clientY + "px";

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

await loadStyle("tooltip");

export {};