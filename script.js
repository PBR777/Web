/**
 * Global data
 */
const WEB_DATA = {
  title: "PBR's Web",
  favicon: "/favicon.ico",
  appleFavicon: "/apple-favicon.png"
}

document.title = WEB_DATA.title

const FAVICON = document.createElement("link");
FAVICON.rel  = "icon";
FAVICON.href = WEB_DATA.favicon;

const APPLE_FAVICON = document.createElement("link");
APPLE_FAVICON.rel  = "apple-touch-icon";
APPLE_FAVICON.href = WEB_DATA.appleFavicon;

document.head.append(FAVICON, APPLE_FAVICON);

(async () => {
  const res = await fetch(`/components/upper_banner.html`);
  const div = document.createElement("div");
  div.id = "upper_banner";
  div.innerHTML = await res.text();
  document.body.insertAdjacentElement("afterbegin", div);

  document.body.classList.add("show");
})();
