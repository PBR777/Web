import { loadImage, fetchJson, dirName, create } from "/fe5/modules/index.js";
import "/fe5/root.js";

/**
 * @param {galleryFormat} json 
 */
function parseJson(json) {
  const fragment = create("div")
    .addListener("click", ev => {
      const target = ev.target;
      if(target.classList.contains("gallery-img")) {
        window.location.href = target.src;
      }
    });

  for(const data of json) {
    const box = create("info-box")
      .addClass("gallery-box")
      .appendTo(fragment);
    const imgUrl = data.url ?? `/fe5/assets/gallery/${dirName}/${data.name}`;

    const img = loadImage(imgUrl, true);
    img.image
      .appendTo(box)
      .select("img")
      .addClass("gallery-img");
    img.promise.catch(() => {
      img.image
        .setStyle("width", "300px")
        .setStyle("height", "200px");
    });

    if(data.description) {
      create("span")
        .addClass("gallery-description")
        .setHTML(data.description)
        .appendTo(box);
    }
  }

  return fragment;
}

const json = await fetchJson(`/fe5/data/gallery/${dirName}.json`);
parseJson(json).appendTo(document.body);
