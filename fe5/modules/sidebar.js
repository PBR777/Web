import { loadStyle, create } from "./index.js"

const DURATION = 300;

let isSpaceEnough = false;
let isSidebarShowing = false;

const button = create("div")
  .addClass("sidebar-button")
  .addListener("click", () => sidebarControl(!isSidebarShowing));

const buttonArrow = create("div")
  .addClass("sidebar-button-arrow")
  .appendTo(button);

const div = create("div")
  .addClass("sidebar-div");

const homeDiv = create("div")
  .addClass("sidebar-title-div")
  .setText("Fe5: Our Home")
  .addListener("click", () => window.location.href = "/fe5/")
  .appendTo(div);

const icon = create("img")
  .addClass("sidebar-title-icon")
  .setAttribute("src", "/fe5/assets/solar/fe5-256x256.webp")
  .appendTo(homeDiv);

const anchorDiv = create("div")
  .addClass("sidebar-anchor-div")
  .appendTo(div);

const anchorTitle = create("div")
  .addClass("sidebar-anchor-title", "sidebar-anchor")
  .addListener("click", () => window.scrollTo(0, 0));

const overlay = create("div")
  .addClass("sidebar-overlay")
  .addListener("click", () => sidebarControl(false));

const updateTree = (() => {
  let timeoutId = null;

  function update() {
    anchorDiv.setHTML("");
    anchorTitle.setText(document.title);
    anchorDiv.append(anchorTitle);

    /**@type AnchorHeading[] */
    const allHeading = [...document.querySelectorAll(AnchorHeading.ELEMENT_ID)];
    
    const allAnchor = allHeading.map(element => {

      const anchor = element.anchor;

      anchor.classList.remove("sidebar-anchor-end");
      anchor.classList.add("sidebar-anchor-mid");

      return element.anchor;
    });

    anchorDiv.append(...allAnchor);

    const lastElement = anchorDiv.getChildren().at(-1);;

    if(lastElement && !lastElement.getClass().contains("sidebar-anchor-title")) {
      lastElement.removeClass("sidebar-anchor-mid");
      lastElement.addClass("sidebar-anchor-end");
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

  #rawId = "";

  #anchor = create("div")
    .addClass("sidebar-anchor")
    .addListener("click", this.onClick.bind(this))
    .get();

  get anchor() {
    return this.#anchor;
  }

  constructor() {
    super();

    this.setId(this.textContent);
    this.setContent(this.textContent)
    this.#anchor.classList.toggle("sidebar-anchor-h2", this.classList.contains("h2"));
  }

  /**@param {string} id  */
  setId(id) {
    const map = AnchorHeading.nameMap;

    const uid = (map.get(this.#rawId) ?? 0) - 1;
    if(uid > 0) {
      map.set(this.#rawId, uid);
    } else {
      map.delete(this.#rawId);
    }

    const safeId = CSS.escape(id);
    if(map.has(safeId)) {

      const uid = map.get(safeId) + 1;
      map.set(safeId, uid);

      this.id = safeId + "-" + uid;
    } else {

      map.set(safeId, 0);
      this.id = safeId;
    }

    this.#rawId = safeId;
  }

  /**
   * @param {string} content 
   */
  setContent(content) {
    this.textContent = content;
    this.#anchor.textContent = content
  }

  connectedCallback() {
    this.addEventListener("click", this.onClick);
    updateTree();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.onClick);
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
      overlay.setStyle("visibility", "visible");

      button.addClass("sidebar-showing");
      div.addClass("sidebar-showing");
      overlay.addClass("sidebar-overlay-showing");

    } else {

      button.removeClass("sidebar-showing");
      div.removeClass("sidebar-showing");
      overlay.removeClass("sidebar-overlay-showing");

      timeoutId = setTimeout(() => {
        overlay.setStyle("visibility", "hidden");
      }, DURATION);
    }
  }
})();

function onResize() {
  if(window.innerWidth > 1500) {
    if(isSpaceEnough) return;
    isSpaceEnough = true;

    sidebarControl(true);
    button.setStyle("visibility", "hidden");
    overlay.setStyle("visibility", "hidden");

  } else {
    if(!isSpaceEnough) return;
    isSpaceEnough = false;
    
    button.setStyle("visibility", null);
    overlay.setStyle("visibility", null);
  }
}

/**
 * 
 * @param {string} title 
 */
export function setTitle(title) {
  document.title = title;
  const titleHeading = document.querySelector("#document-title");
  if(titleHeading) titleHeading.innerText = title;
  updateTree();
}

loadStyle("sidebar").then(() => {
  window.addEventListener("resize", onResize);
  onResize();

  document.body.append(button.get(), div.get(), overlay.get());
});
