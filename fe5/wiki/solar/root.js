import { headingDiv } from "/fe5/root.js";
import { create, dirName, fetchJson, period } from "/fe5/modules/index.js";
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

  const info = [];

  const getData = (num, unit) => (num !== undefined && !Number.isNaN(num)) 
    ? `<info-text>${num + unit}</info-text>` 
    : "未知";

  info.push("质量：" + getData(data.mass, "kg"));
  info.push("近日点（父级）：" + getData(data.short, "m"));
  info.push("远日点（父级）：" + getData(data.long, "m"));
  info.push("自转周期：" + getData(data.rotationPeriod, "s"));


  div.setInfo(info.join("\n"));

} catch(err) {
  console.error(err);
  
}
