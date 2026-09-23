import { create, dirName, calStyleStatus } from "/fe5/modules/index.js";
import "/fe5/modules/background.js";
import "/fe5/modules/id.js";
import "/fe5/modules/text-obfucation.js";
import { setTitle } from "/fe5/modules/sidebar.js"

function loadEaseBox() {
  const observeTarget = document.querySelectorAll(".observed-element");
  let targetCount = observeTarget.length;

  if(targetCount > 0) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {

        const element = entry.target;
        if(entry.isIntersecting) {
          element.classList.add("observed-element-visible");
          observer.unobserve(element);

          if(--targetCount === 0) return observer.disconnect();
        }
      }
    }, {
      threshold: 0.5
    });

    observeTarget.forEach(observer.observe.bind(observer));
  }
}

export const headingDiv = create("div", "document-title-div");

if(!document.querySelector("meta[name='no-title']")) {
  const heading = create("h1", "document-title")
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

loadEaseBox();

Promise.race([
  calStyleStatus().then(console.log),
  new Promise((_, reject) => setTimeout(reject, 5000))
]).catch(() => {
  console.warn("Some styles take too much time to load.");
}).then(() => {
  document.body.classList.add("show");
});
