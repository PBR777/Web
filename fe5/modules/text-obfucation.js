import { loadStyle } from "./index.js";

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

loadStyle("text-obfucation").then(() => {
  setInterval(() => {
    visibleObfucatedText.forEach(element => {
      
      const str = Array
        .from({ length: element.textContent.length }, () => 
          String.fromCharCode((Math.random() * 94 | 0) + 33))
        .join("");

      element.textContent = str;
    });
  }, 40);
}).catch(err => {
  console.error(err);
  document.body.querySelectorAll("obf-text").forEach(text => {
    text.textContent = "?".repeat(text.textContent.length);
  })
});

export {};
