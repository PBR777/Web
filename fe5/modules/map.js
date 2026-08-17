import { loadStyle, create } from "/fe5/modules/index.js";

const MAP_ROOT = "/fe5/data/map/";

async function getMap(mapImgName, mapDataName = mapImgName) {
  if(typeof mapImgName !== "string")
    throw new Error("Cannot initalize with invalid image source.");

  const map = create("img")
    .addClass("map")
    .build();

  const tooltipBox = create("div")
    .addClass("map-tooltip")
    .build();

  const mapDiv = create("info-box").build();
  mapDiv.style.width = "100%";

  map.src = MAP_ROOT + mapImgName + ".webp";

  function onLoadFailed(err) {
    throw err;
  }

  try {
  
    await new Promise((resolve, reject) => {
      map.addEventListener("load", resolve);

      map.addEventListener("error", reject);
    }).catch(onLoadFailed);

    const mapSpotsRes = await fetch(MAP_ROOT + mapDataName + ".json");
    if(!mapSpotsRes.ok) onLoadFailed(new Error("Map .json fetch failed"));

    const mapSpotsData = await mapSpotsRes.json().catch(onLoadFailed);

    if(!Array.isArray(mapSpotsData)) onLoadFailed(new Error("Invalid Map .json"));

    let isTooltipShowing = false;

    function showTooltip(msg, x, y) {
      tooltipBox.innerHTML = msg;

      tooltipBox.style.left = x;
      tooltipBox.style.top = y;
      tooltipBox.style.zIndex = "";

      tooltipBox.classList.add("map-tooltip-show");

      isTooltipShowing = true;
    }

    function hideTooltip() {
      tooltipBox.classList.remove("map-tooltip-show");

      isTooltipShowing = false;

      setTimeout(() => {
        if(isTooltipShowing) return;

        tooltipBox.style.zIndex = "-1";
      }, 200);
    }

    hideTooltip();

    function createSpot(x, y, name, href) {
      if(typeof x !== "number"
         || typeof y !== "number"
      ) onLoadFailed("Invalid Map .json");

      const xPct = `${x * 50 + 50}%`;
      const yPct = `${y * 50 + 50}%`;

      const spot = create("div")
        .addClass("map-spot", "map-spot-main")
        .setStyle("left", xPct)
        .setStyle("top", yPct)
        .addEventListener("mouseenter", () =>
          showTooltip(name, xPct, yPct))
        .addEventListener("mouseleave", hideTooltip)
        .build();

      const spotPulse = create("div")
        .addClass("map-spot", "map-spot-pulse")
        .setStyle("left", xPct)
        .setStyle("top", yPct)
        .build();

      if(href) {
        spot.addEventListener("click", () => window.location.href = href);
      }

      mapDiv.append(spot, spotPulse);
    }

    mapSpotsData.forEach(spotData => {
      if(typeof spotData !== "object") onLoadFailed("Invalid Map .json");

      if(typeof spotData.name !== "string"
         || typeof spotData.href !== "string"
         || !Array.isArray(spotData.pos)
      ) onLoadFailed("Invalid Map .json");

      const name = spotData.name;
      const href = "/fe5/" + spotData.href;

      if(!Array.isArray(spotData.pos[0])) {
        createSpot(spotData.pos[0], spotData.pos[1], name, href);
        return;
      }

      spotData.pos.forEach(pos => {
        if(!Array.isArray(pos)) onLoadFailed("Invalid Map .json");
        createSpot(pos[0], pos[1], name, href);
      })
    });
  } catch(err) {
    console.error(err);
    
    const failedDiv = create("p")
      .addClass("map-fail")
      .setText("看上去地图加载失败了 :(")
      .build();
       
    mapDiv.append(failedDiv);

    return {
      div: mapDiv,
      ok: false
    };
  }

  mapDiv.append(map, tooltipBox);

  return {
    div: mapDiv,
    ok: true
  };
}

await loadStyle("map");

export default getMap;
