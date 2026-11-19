import { create, dirName, calStyleStatus } from "/fe5/modules/index.js";
import { setTitle } from "/fe5/modules/sidebar.js"
import "/fe5/modules/background.js";

create("link", "#favicon")
  .for(element => {
    element.rel = "apple-touch-icon";
    element.sizes = "180x180";
    element.href = "/apple-favicon.png";
  })
  .appendTo(document.head);

export const headingDiv = create("div", "#document-title-div");

if(!document.querySelector("meta[name='no-title']")) {
  const heading = create("h1", "#document-title")
    .appendTo(headingDiv);
  
  if(document.title === "") {
    heading.setText(dirName);
    setTitle(dirName);
  } else {
    heading.setText(document.title);
    setTitle(document.title);
  }
}

document.body.insertAdjacentElement("afterbegin", headingDiv.get());

Promise.race([
  calStyleStatus().then(console.log),
  new Promise((_, reject) => setTimeout(reject, 5000))
]).catch(() => {
  console.warn("Some styles take too much time to load.");
}).then(() => {
  document.body.classList.add("show");
});
