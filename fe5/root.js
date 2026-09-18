import { create, dirName, calStyleStatus, sleep } from "/fe5/modules/index.js";
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
  ? create("div", "document-title-div").get() 
  : null;


if(headingDiv) {
  const heading = create("h1")
    .appendTo(headingDiv);
    
  if(document.title === "") {
    heading.setText(dirName);
    document.title = dirName;
  } else {
    heading.setText(document.title);
  }

  document.body.insertAdjacentElement("afterbegin", headingDiv);
}

loadEaseBox();

try {
  await loadModules();
} catch(err) {
  console.error(err);
}



await Promise.race([calStyleStatus().then(console.log),
  new Promise((_, reject) => setTimeout(reject, 5000))]).catch(() => {
  console.warn("Some styles take too much time to load.");
});

document.body.classList.add("show");
