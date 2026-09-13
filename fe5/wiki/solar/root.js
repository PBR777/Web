import { headingDiv } from "/fe5/root.js";
import { create, dirName, fetchJson } from "/fe5/modules/index.js";
import { createCard } from "/fe5/modules/infocard.js";

const img = create("img")
  .setAttribute("src", `/fe5/assets/solar/${dirName}-800x800.webp`)
  .build();

const div = createCard(img, "天体数据");

headingDiv.append(div.build());

/**@type solarTreeFormat */
const tree = await fetchJson("/fe5/data/solar/tree.json");

try {
  /**@type solarDataFormat */
  const data = await fetchJson(`/fe5/data/solar/${dirName}.json`);

} catch(err) {
  console.error(err);
  
}
