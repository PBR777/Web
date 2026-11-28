import { create, dirName, calStyleStatus } from "/fe5/modules/index.js";
import { setTitle } from "/fe5/modules/sidebar.js";
import "/fe5/modules/background.js";

create("link", "#favicon").for(element => {
  element.rel = "icon";
  element.sizes = "16x16";
  element.href = "/fe5/assets/zone/M.png";
}).appendTo(document.head);

create("link", "#apple-favicon").for(element => {
  element.rel = "apple-touch-icon";
  element.sizes = "180x180";
  element.href = "/apple-favicon.png";
}).appendTo(document.head);

export const headingDiv = create("div", "#document-title-div");

if(!document.querySelector("meta[name='no-title']")) {
  create("h1", "#document-title").for(raw => {
    if(document.title.trim() === "") {
      raw.innerText = dirName;
      setTitle(dirName);
    } else {
      raw.innerText = document.title;
      setTitle(document.title);
    }
  }).appendTo(headingDiv);
}

document.body.insertAdjacentElement("afterbegin", headingDiv.raw);

await Promise.race([
  calStyleStatus().then(console.log),
  new Promise((_, reject) => setTimeout(reject, 5000))
]).catch(() => {
  console.warn("Some styles take too much time to load.");
});

document.body.classList.add("show");
