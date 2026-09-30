import { create, dirName } from "/fe5/modules/index.js";
import { loadMap } from "/fe5/modules/map.js";
import { headingDiv } from "/fe5/root.js";

const mapBox = create("info-box", "location-box");

const map = loadMap(dirName)
  .appendTo(mapBox);

headingDiv.append(mapBox);