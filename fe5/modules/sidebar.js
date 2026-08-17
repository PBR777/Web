import { loadStyle, create } from "/fe5/modules/index.js"

let isSpaceEnough = false;
let isSidebarShowing = false;

const buttonArrow = create("div")
  .addClass("sidebar-button-arrow")
  .build();

const button = create("div")
  .addClass("sidebar-button")
  .addEventListener("click", () => sidebarControl(!isSidebarShowing))
  .append(buttonArrow)
  .build();

const icon = create("img")
  .addClass("sidebar-title-icon")
  .build();
icon.src = "/fe5/assets/fe5-1017x1017.webp";

const homeDiv = create("div")
  .addClass("sidebar-title-div")
  .addEventListener("click", () => window.location.href = "/fe5/")
  .append("Fe5: Our Home", icon)
  .build();

const anchorDiv = create("div")
  .addClass("sidebar-anchor-div")
  .build();

const div = create("div")
  .addClass("sidebar-div")
  .append(homeDiv, anchorDiv)
  .build();

const anchorTitle = create("div")
  .addClass("sidebar-anchor-title", "sidebar-anchor")
  .addEventListener("click", () => window.scrollTo(0, 0))
  .build();

const overlay = create("div")
  .addClass("sidebar-overlay")
  .addEventListener("click", () => sidebarControl(false))
  .build();

const updateTree = (() => {
  let timeoutId = null;

  function update() {
    anchorDiv.innerHTML = "";
    anchorTitle.innerText = document.title;
    anchorDiv.append(anchorTitle);

    const allHeading = document.querySelectorAll(AnchorHeading.ELEMENT_ID);
    
    const allAnchor = [...allHeading].map(element => {

      const anchor = element.anchor;

      anchor.classList.remove("sidebar-anchor-end");
      anchor.classList.add("sidebar-anchor-mid");

      return element.anchor;
    });

    anchorDiv.append(...allAnchor);

    const lastElement = anchorDiv.children[anchorDiv.children.length - 1];

    if(lastElement && !lastElement.classList.contains("sidebar-anchor-title")) {
      lastElement.classList.remove("sidebar-anchor-mid");
      lastElement.classList.add("sidebar-anchor-end");
    }

    timeoutId = null;
  }

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(update, 100);
  }
})();

class AnchorHeading extends HTMLElement {
  static ELEMENT_ID = "ah-";
  static nameMap = new Map();

  onClick() {
    window.location.href = "#" + this.id;
  }


  anchor = (() => {
    const anchorButton = create("div")
      .addClass("sidebar-anchor")
      .addEventListener("click", this.onClick.bind(this))
      .build();

    return anchorButton;
  })();

  constructor() {
    super();

    this.addEventListener("click", this.onClick);
  }

  connectedCallback() {
    const name = this.textContent;

    if(this.id === "") {
      
      if(AnchorHeading.nameMap.has(name)) {
        
        const nameUid = AnchorHeading.nameMap.get(name) + 1;
        AnchorHeading.nameMap.set(name, nameUid);

        this.id = CSS.escape(name) + "-" + nameUid;
      } else {

        AnchorHeading.nameMap.set(name, 0);
        this.id = CSS.escape(name);

      }
    }

    this.anchor.innerText = name;
    if(this.classList.contains("h2")) {
      this.anchor.classList.add("sidebar-anchor-h2");
    } else {
      this.anchor.classList.remove("sidebar-anchor-h2");
    }

    updateTree();
  }

  disconnectedCallback() {
    updateTree();
  }
}

customElements.define(AnchorHeading.ELEMENT_ID, AnchorHeading);

const sidebarControl = (() => {
  let timeoutId;

  return isShowing => {
    isSidebarShowing = isShowing;

    if(isShowing) {
      clearTimeout(timeoutId);
      overlay.style.visibility = "visible";

      button.classList.add("sidebar-showing");
      div.classList.add("sidebar-showing");
      overlay.classList.add("sidebar-overlay-showing");

    } else {

      button.classList.remove("sidebar-showing");
      div.classList.remove("sidebar-showing");
      overlay.classList.remove("sidebar-overlay-showing");

      timeoutId = setTimeout(() => {
        overlay.style.visibility = "hidden";
      }, 500);
    }
  }
})();

function onResize() {
  if(window.innerWidth > 1500) {
    if(isSpaceEnough) return;
    isSpaceEnough = true;

    sidebarControl(true);
    button.style.visibility = "hidden";
    overlay.style.visibility = "hidden";

  } else {
    if(!isSpaceEnough) return;
    isSpaceEnough = false;
    
    button.style.visibility = null;
    overlay.style.visibility = null;
  }
}

function setTitle(title) {
  document.title = title;
  const titleHeading = document.querySelector("#document-title")
  if(titleHeading) titleHeading.innerText = title;
  updateTree();
}

window.addEventListener("resize", onResize);
onResize();

await loadStyle("sidebar");

document.body.append(button, div, overlay);

export default setTitle;
