import { create, dirName } from "/fe5/modules/index.js";
import "/fe5/modules/background.js";
import "/fe5/modules/id.js";
import "/fe5/modules/text-obfucation.js";


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

export const headingDiv = !document.querySelector("meta[name='no-title']") 
  ? create("div", "document-title-div").build() 
  : null;


if(headingDiv) {
  const heading = create("h1")
    .appendTo(headingDiv);
    
  if(document.title === "") {
    heading.innerText = dirName;
    document.title = dirName;
  } else {
    heading.innerText = document.title;
  }

  document.body.insertAdjacentElement("afterbegin", headingDiv);
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

document.body.classList.add("show");
