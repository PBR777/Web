import { addStyle } from "./index.js";

import css from "/fe5/assets/text-obfucation.css" with { type: "css" };
addStyle(css);

const visibleObfucatedText = new Set();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      visibleObfucatedText.add(entry.target);
    } else {
      visibleObfucatedText.delete(entry.target);
    }
  });
});

class ObfucatedText extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    observer.observe(this);
  }

  disconnectedCallback() {
    observer.unobserve(this);
    visibleObfucatedText.delete(this);
  }
}

customElements.define("obf-text", ObfucatedText);

setInterval(() => {
  visibleObfucatedText.forEach(element => {
    
    const str = Array
      .from({ length: element.textContent.length }, () => 
        String.fromCharCode((Math.random() * 94 | 0) + 33))
      .join("");

    element.textContent = str;
  });
}, 40);

export {};
