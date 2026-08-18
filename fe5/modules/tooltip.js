import { loadStyle, create } from "/fe5/modules/index.js";

const tooltip = create("div", "tooltip")
  .appendTo(document.body);

let isTooltipShowing = false;
let frameId;

document.addEventListener("pointermove", ev => {
  if(frameId || !isTooltipShowing) return;

  requestAnimationFrame(() => {
    tooltip.style.left = ev.clientX + "px";
    tooltip.style.top = ev.clientY + "px";

    frameId = null;
  });
})

class Tooltip extends HTMLElement {
  static observedAttributes = ["text"];

  #text = "";

  get text() {
    return this.#text;
  }

  set text(val) {
    this.setAttribute("text", val);
  }
  
  showTooltip() {
    tooltip.innerHTML = this.#text;
    tooltip.classList.add("show");
    isTooltipShowing = true;
  }

  hideTooltip() {
    tooltip.classList.remove("show");
    isTooltipShowing = false;
  }

  constructor() {
    super();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.#text = newValue;
  }

  connectedCallback() {
    this.addEventListener("mouseenter", this.showTooltip);
    this.addEventListener("mouseleave", this.hideTooltip);
  }

  disconnectedCallback() {
    this.removeEventListener("mouseenter", this.showTooltip);
    this.removeEventListener("mouseleave", this.hideTooltip);
  }
}

customElements.define("tool-tip", Tooltip);

await loadStyle("tooltip");

export {};