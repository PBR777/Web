import {} from "/fe5/modules/background.js";
import {} from "/fe5/modules/id.js";
import {} from '/fe5/modules/text-obfucation.js';
import { create } from "/fe5/modules/index.js";


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

function loadModules() {
  const modules = [];

  if(!document.head.querySelector("meta[name='no-sidebar']"))
    modules.push("/fe5/modules/sidebar.js");

  return Promise.all(modules.map(url => import(url)));
}

if(!document.querySelector("meta[name='no-title']") &&
  document.title !== "") {

  const title = create("h1", "document-title")
    .setText(document.title)
    .build();

  document.body.insertAdjacentElement("afterbegin", title);
}

document.querySelectorAll(".info-img").forEach(img => {
  if(img.alt === "")
    img.alt = "图片加载失败 :(";
});

loadEaseBox();

try {
  await loadModules();
} catch(err) {
  console.error(err);
}

function finish() {
  document.body.classList.add("show");
}

finish();

export default finish;
