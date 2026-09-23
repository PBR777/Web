import { loadStyle, create } from "./index.js";

const tooltip = create("div", "tooltip");

let isTooltipShowing = false;
let frameId = null;

const observer = new IntersectionObserver(entries => {
  for(const entry of entries) {
    entry.target.toggle(entry.isIntersecting);
  }
});

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

  showTooltip(ev) {
    tooltip
      .setHTML(this.text)
      .addClass("show");

    isTooltipShowing = true;
    this.updateTooltip(ev);
  }

  updateTooltip(ev) {
    if(!isTooltipShowing) this.showTooltip();
    if(frameId) return;

    frameId = requestAnimationFrame(() => {
      tooltip
        .setStyle("left", ev.clientX + "px")
        .setStyle("top", ev.clientY + "px");

      frameId = null;
    });
  }

  constructor() {
    super();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.#text = newValue;
  }

  toggle(enable) {
    if(enable) {
      this.addEventListener("pointerenter", this.showTooltip);
      this.addEventListener("pointerleave", this.hideTooltip);
      this.addEventListener("pointermove", this.updateTooltip);
    } else {
      this.removeEventListener("pointerenter", this.showTooltip);
      this.removeEventListener("pointerleave", this.hideTooltip);
      this.removeEventListener("pointermove", this.updateTooltip);
    }
  }

  connectedCallback() {
    observer.observe(this);
  }

  disconnectedCallback() {
    observer.unobserve(this);
    this.toggle(false);
  }
}

customElements.define("tool-tip", Tooltip);

loadStyle("tooltip").then(() => {
  tooltip.appendTo(document.body);
});

export {};