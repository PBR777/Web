import { loadStyle, create } from "./index.js"

const DURATION = 300;
const HAS_SIDEBAR = !document.head.querySelector("meta[name='no-sidebar']");

let isSidebarShowing = false;

const button = create("div", ".sidebar-button")
  .addListener("click", () => sidebarControl(!isSidebarShowing))
  .append(create("div", ".sidebar-button-arrow"));

const div = create("div", ".sidebar-div");

create("div", ".sidebar-title-div")
  .setText("Fe5: Our Home")
  .addListener("click", () => window.location.href = "/fe5/")
  .append(
    create("img", ".sidebar-title-icon")
      .setAttr("src", "/fe5/assets/solar/fe5-256x256.webp")
  ).appendTo(div);

const anchorDiv = create("div", ".sidebar-anchor-div")
  .addListener("click", ev => {

    const target = ev.target;

    if(target.classList.contains("sidebar-anchor")
    && target.hasAttribute("href"))
      location.href = target.getAttribute("href");
  }).appendTo(div);

const anchorTitle = create("div", ".sidebar-anchor-title.sidebar-anchor")
  .addListener("click", () => window.scrollTo(0, 0));

const overlay = create("div", ".sidebar-overlay")
  .addListener("click", () => sidebarControl(false));

const updateTree = (() => {
  let timeoutId = null;
  let isFirstLoad = true;

  function update() {
    timeoutId = null;

    anchorDiv.setHTML("");
    anchorTitle.setText(document.title);
    anchorDiv.append(anchorTitle);

    const map = new Map();
    const fragment = document.createDocumentFragment();

    for(const heading of document.querySelectorAll("h2, h3")) {

      heading.id = heading.textContent.replaceAll(/ /g, "-");
      heading.onclick = () => location.href = "#" + heading.id;

      const uid = map.get(heading.id) ?? 0;
      map.set(heading.id, uid + 1)

      if(uid !== 0) {
        heading.id += "-" + uid;
      }

      const quicklink = create("div", ".sidebar-anchor")
        .setHTML(heading.innerHTML)
        .setAttr("href", "#" + heading.id)
        .appendTo(fragment);

      if(heading.tagName === "H3") {
        quicklink.addClass("sidebar-anchor-h2");
      }

    }

    anchorDiv.append(fragment);

    if(isFirstLoad) {
      isFirstLoad = false;
      if(location.hash.trim() !== "") location.href = location.hash;
    }
  }

  return HAS_SIDEBAR ? () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(update, 100);
  } : () => {};
})();

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
  if(HAS_SIDEBAR) {
    document.body.append(button.raw, div.raw, overlay.raw);
  }
});
