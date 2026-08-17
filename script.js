window.addEventListener("load", load);

/**
 * Global data
 */
const WEB_DATA = {
  title: "PBR's Web",
  favicon: "/favicon.ico",
  appleFavicon: "/apple-favicon.png",
  style: "/style.css"
}

function load() {
  const FLASHING_TITLE = document.getElementById("heading");
  if(!FLASHING_TITLE) return;

  (function tick() {
    const VALUE = 16 + Math.sin(Date.now() / 150) * 3;

    FLASHING_TITLE.style.textShadow = `${FLASHING_TITLE.style.color} 0px 0px ${VALUE}px`;

    requestAnimationFrame(tick);
  })();
}

document.title = WEB_DATA.title

const FAVICON = document.createElement("link");
FAVICON.rel  = "icon";
FAVICON.href = WEB_DATA.favicon;

const APPLE_FAVICON = document.createElement("link");
APPLE_FAVICON.rel  = "apple-touch-icon";
APPLE_FAVICON.href = WEB_DATA.appleFavicon;

const STYLE = document.createElement("link");
STYLE.rel  = "stylesheet";
STYLE.href = WEB_DATA.style;

document.head.append(FAVICON);
document.head.append(APPLE_FAVICON);
document.head.append(STYLE);

class Component extends HTMLElement {
  async connectedCallback() {
    if(!this.id) throw new Error("ID is missing.");

    const RES = await fetch(`/components/${this.id}.html`);

    if(!RES.ok) {
      this.innerText = `${this.id} loaded failed.`;
      return;
    }

    const COMPONENT = await RES.text();

    this.innerHTML = `<div id=${this.id}>${COMPONENT}</div>`;

    this.id = "";
  }
}

customElements.define("p-component", Component);