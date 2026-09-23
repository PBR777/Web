import "./tooltip.js"
import { loadStyle, create, fetchJson, PackedElement, loadImage } from "./index.js";

class Map extends PackedElement {
  static STATUS = loadStyle("map");
  static MAP_ROOT= "/fe5/data/map/";

  #ok = false;

  /**
   * @param {string} mapImgName 
   * @param {string} mapDataName 
   */
  constructor(mapImgName, mapDataName = mapImgName) {
    super("div")
      .addClass("map-div")
      .addListener("click", ev => {
        const target = ev.target;
        if(target.classList.contains("map-spot-main")) {
          window.location.href = target.getAttribute("data-href");
        }
      });

    const mapImg = loadImage(`/fe5/assets/maps/${mapImgName}.webp`);
    mapImg.image
      .addClass("map-img")
      .appendTo(this)

    /**@type Promise<mapDataFormat> */
    const mapDataPromise = fetchJson(`/fe5/data/maps/${mapDataName}.json`);

    Promise.all([mapDataPromise, Map.STATUS, mapImg.promise])
      .then(([mapData]) => mapData.forEach(data => {
        if(Array.isArray(data.pos[0])) {
          data.pos.forEach(spot => this.#createSpot(spot[0], spot[1], data.name, data.href));
        } else {
          this.#createSpot(data.pos[0], data.pos[1], data.name, data.href);
        }
      }))
      .then(() => this.#ok = true)
      .catch(err => {
        console.error(err);

        mapImg.image
          .addClass("map-fail")
          .setText("看上去地图加载失败了 :(");
      });
  }

  get ok() {
    return this.#ok;
  }

  #createSpot(x, y, name, href) {
    const xPct = `${x * 50 + 50}%`;
    const yPct = `${y * 50 + 50}%`;

    const spot = create("tool-tip")
      .addClass("map-spot", "map-spot-main", "hidden")
      .setAttribute("text", name)
      .setStyle("left", xPct)
      .setStyle("top", yPct)
      .appendTo(this);
  
    if(href) {
      spot.setAttribute("data-href", href);
    } else {
      spot.addClass("map-spot-nohref")
    }

    create("div")
      .addClass("map-spot", "map-spot-pulse")
      .setStyle("left", xPct)
      .setStyle("top", yPct)
      .appendTo(this);
  }
}

/**
 * @param {string} mapImgName 
 * @param {string} mapDataName 
 */
export const loadMap = (mapImgName, mapDataName) => new Map(mapImgName, mapDataName);
