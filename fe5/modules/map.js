import {} from "/fe5/modules/tooltip.js"
import { loadStyle, create } from "/fe5/modules/index.js";

class Map {
  static MAP_ROOT= "/fe5/data/map/";

  #map;
  #ok;

  /**
   * @param {HTMLDivElement} div
   * @param {boolean} success
   */
  constructor(div, success) {
    this.#map = div;
    this.#ok = success;
  }

  getMap() {
    return this.#map;
  }

  /**@param {Node} node  */
  appendTo(node) {
    node.appendChild(this.#map);
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
      .addClass("map-div")
      .build();

    const mapImg = create("img")
      .addClass("map")
      .build();

    mapImg.src = Map.MAP_ROOT + mapImgName + ".webp";

    const mapImgPromise = new Promise((resolve, reject) => {
      mapImg.addEventListener("load", resolve, {once: true});
      mapImg.addEventListener("error", reject, {once: true});
    }).catch(() => { throw new Error("Map .webp load failed."); });

    const mapDataPromise = fetch(Map.MAP_ROOT + mapDataName + ".json");

    try {

      const [res] = await Promise.all([mapDataPromise, mapImgPromise])
        .catch(err => { throw err; });

      if(!res.ok) throw new Error(res.status + " " + res.statusText);
      /**@type mapDataFormat */
      const mapData = await res.json();

      const createSpot = (x, y, name, href) => {
        const xPct = `${x * 50 + 50}%`;
        const yPct = `${y * 50 + 50}%`;

        const spot = create("tool-tip")
          .addClass("map-spot", "map-spot-main", "hidden")
          .setStyle("left", xPct)
          .setStyle("top", yPct)
          .appendTo(mapDiv);
        
        spot.text = name;

        if(href)
          spot.addEventListener("click", () => location.href = href);

        create("div")
          .addClass("map-spot", "map-spot-pulse")
          .setStyle("left", xPct)
          .setStyle("top", yPct)
          .appendTo(mapDiv);
      };

      mapData.forEach(data => {
        if(Array.isArray(data.pos[0])) {

          data.pos.forEach(spot => {
            createSpot(spot[0], spot[1], data.name, data.href);
          });
        } else {
          createSpot(data.pos[0], data.pos[1], data.name, data.href);
        }
      });

    } catch(err) {
      console.error(err);
      
      create("span")
        .addClass("map-fail")
        .setText("看上去地图加载失败了 :(")
        .appendTo(mapDiv);

      return new Map(mapDiv, false);
    }

    mapDiv.append(mapImg);
    return new Map(mapDiv, true);
  }
}

await loadStyle("map");

export const load = Map.load;
