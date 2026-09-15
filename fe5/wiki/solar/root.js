import { headingDiv } from "/fe5/root.js";
import { create, dirName, fetchJson } from "/fe5/modules/index.js";
import { createCard } from "/fe5/modules/infocard.js";
import { getObject, calOrbitalPeriod } from "/fe5/modules/solar.js";
import "/fe5/modules/solar.js";

const img = create("img")
  .setAttribute("src", `/fe5/assets/solar/${dirName}-800x800.webp`)
  .build();

const div = createCard(img, "天体数据");

headingDiv.append(div.build());

try {
  /**@type solarDataFormat */
  const data = getObject(dirName);

  const info = [];

  const getData = (num, unit) => (num !== undefined && !Number.isNaN(num)) 
    ? `<info-text>${num + unit}</info-text>` 
    : "未知";

  info.push("质量：" + getData(data.mass, "kg"));
  info.push("近日点（父级）：" + getData(data.near, "m"));
  info.push("远日点（父级）：" + getData(data.far, "m"));

  const orbitalPeriod = calOrbitalPeriod("fe5");
  if(data.rotationPeriod === 0) {
    info.push("自转周期：" + getData(orbitalPeriod, "s"));
    info.push("公转周期：" + getData(orbitalPeriod, "s"));
  } else {
    info.push("自转周期：" + getData(data.rotationPeriod, "s"));
    info.push("公转周期：" + getData(orbitalPeriod, "s"));
  }
  


  div.setInfo(info.join("\n"));

} catch(err) {
  console.error(err);
  
}

console.log();
 