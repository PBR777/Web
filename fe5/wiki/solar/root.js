import { dirName, loadImage } from "/fe5/modules/index.js";
import { headingDiv } from "/fe5/root.js";
import { createCard } from "/fe5/modules/infocard.js";
import { getSkyObject } from "/fe5/modules/solar.js";
import { setTitle } from "/fe5/modules/sidebar.js";

const img = loadImage(`/fe5/assets/solar/${dirName}-800x800.webp`);

const div = (await createCard(img.image.get(), "天体数据"))
  .appendTo(headingDiv);

try {
  const data = getSkyObject(dirName);

  setTitle(data.name);

  const info = [];

  const getData = (num, unit = "") => (num != undefined && !Number.isNaN(num)) 
    ? `<info-text>${num + unit}</info-text>` 
    : "未知";

  info.push(  "质量：" + getData(data.mass, "kg"));
  info.push("近拱点：" + getData(data.near, "m"));
  info.push("远拱点：" + getData(data. far, "m"));
  info.push("希尔球半径：" + getData(data.hillRadius, "m"));

  info.push("");

  info.push("轨道半短轴：" + getData(data.short, "m"));
  info.push("轨道半长轴：" + getData(data. long, "m"));
  info.push("轨道离心率：" + getData(data.orbitalEccentricity));

  info.push("");

  info.push("自转周期：" + getData(data.rotationPeriod, "s"));
  info.push("公转周期：" + getData(data.orbitalPeriod, "s"));

  info.push("");

  const createLink = obj => {
    return `<a class="inline" href="/fe5/wiki/solar/${obj.id}/">${obj.name}</a>`
  }

  info.push("父级天体：" + (data.parent ? createLink(data.parent) : "无"));

  const childLinks = data.children.length === 0 
    ? "无"
    : data.children
      .map(id => createLink(id))
      .join(", ");
  
  info.push("子天体：" + childLinks);
  
  div.setInfo(info.join("\n"));

} catch(err) {
  console.error(err);

  div.setInfo("加载失败 :( <br>" + err);
}
