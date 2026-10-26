/**
 * Global data
 */
const WEB_DATA = {
  title: "PBR's Web",
  favicon: "/favicon.ico",
  appleFavicon: "/apple-favicon.png",
  style: "/style.css"
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

    const res = await fetch(`/components/${this.id}.html`);

    if(!res.ok) {
      this.innerText = `${this.id} loaded failed.`;
      return;
    }
    
    this.innerHTML = await res.text();
  }
}

customElements.define("p-component", Component);