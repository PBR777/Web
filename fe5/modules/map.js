import "./tooltip.js"
import { loadStyle, create, fetchJson, PackedElement } from "./index.js";

class Map extends PackedElement {
  static STATUS = loadStyle("map");
  static MAP_ROOT= "/fe5/data/map/";

  #ok;

  constructor(element) {
    super(element);
  }

  getMap() {
    return this.get();
  }

  get ok() {
    return this.#ok;
  }

  /**
   * @param {string} mapImgName 
   * @param {string} mapDataName 
   */
  static async load(mapImgName, mapDataName = mapImgName) {
    const mapDiv = create("info-box")
      .addClass("map-div");

    const mapImg = create("img")
      .addClass("map")
      .appendTo(mapDiv);

    const map = new Map(mapDiv);

    let status = true;
    try {
      await Map.STATUS;

      mapImg.setAttribute("src", Map.MAP_ROOT + mapImgName + ".webp");

      const mapImgPromise = new Promise((resolve, reject) => mapImg
        .addListener("load", resolve, {once: true})
        .addListener("error", reject, {once: true})
      );

      const mapDataPromise = fetchJson(Map.MAP_ROOT + mapDataName + ".json");

      /**@type mapDataFormat */
      const [ mapData ] = await Promise.all([mapDataPromise, mapImgPromise]);

      const createSpot = (x, y, name, href) => {
        const xPct = `${x * 50 + 50}%`;
        const yPct = `${y * 50 + 50}%`;

        const spot = create("tool-tip")
          .addClass("map-spot", "map-spot-main", "hidden")
          .setAttribute("text", name)
          .setStyle("left", xPct)
          .setStyle("top", yPct)
          .appendTo(mapDiv);
      

        if(href)
          spot.addListener("click", () => location.href = href);

        create("div")
          .addClass("map-spot", "map-spot-pulse")
          .setStyle("left", xPct)
          .setStyle("top", yPct)
          .appendTo(mapDiv);
      };

      for(const data of mapData) {
        if(Array.isArray(data.pos[0])) {
          data.pos.forEach(spot =>
            createSpot(spot[0], spot[1], data.name, data.href));
        } else {
          createSpot(data.pos[0], data.pos[1], data.name, data.href);
        }
      }


    } catch(err) {
      console.error(err);

      mapImg.remove();
      
      create("span")
        .addClass("map-fail")
        .setText("看上去地图加载失败了 :(")
        .appendTo(mapDiv);

      status = false;
    }

    return map;
  }
}

export const loadMap = Map.load;
