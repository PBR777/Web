const ZONE_CODE_BIN = {
  E: "00",
  O: "01",
  P: "10",
  M: "11",

  "00": "E",
  "01": "O",
  "10": "P",
  "11": "M"
}

class Id extends HTMLElement {
  constructor() {
    super();
  }

  clickHandler() {
    window.location.href = `/fe5/bio/?id=${this.textContent}&redirect`;
  }

  connectedCallback() {
    this.addEventListener("click", this.clickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.clickHandler);
  } 
}

customElements.define("id-", Id);

/**
 * Convert an id to a full and correct id
 * @param {string} rawId
*/
export function parse(rawId) {
  const zoneCode = rawId.match(/[EOPM]/i);

  let index = zoneCode ? zoneCode.index : 0;
  const id = [...rawId.slice(index).matchAll(/\d/g)].join("");

  const result = {
    zoneCode: zoneCode ? zoneCode[0].toUpperCase() : null,
    id: id
  };

  result.fullId = (result.zoneCode ?? "") + result.id;
  return result;
}

/**
 * @param {string | idObj} id
*/
export function idToBinary(id) {
  let idObj;
  if(typeof id === "string") {
    idObj = parse(id);
  } else {
    idObj = id;
  }

  if(!idObj.zoneCode) throw new Error(`Require a full id, but zone code is missing in ${id.fullId}.`);

  const zoneCodeBin = ZONE_CODE_BIN[idObj.zoneCode];
  const idBin = parseInt(idObj.id === "" ? "0" : idObj.id)
    .toString(2);
  return idBin + zoneCodeBin;
}

/**
 * @param {string} bin 
 */
export function binaryToId(bin) {
  bin = bin.padStart(2, "0");

  const zoneCodeBin = bin.at(-2) + bin.at(-1);
  const idBin = bin.slice(0, bin.length - 2);
  return ZONE_CODE_BIN[zoneCodeBin] + parseInt(idBin, 2).toString();
}

/**
 * Parse all id string with "$" prefix into <id-></id->.
 * @param {string} html 
 */
export function parseHTML(html) {
  const texts = html.split("$");
  const first = texts.shift();

  return first + texts.map(line => {
    const index = line.match(/[^\dEOPM]/)?.index;

    const id = line.slice(0, index);
    const remainingLine = index ? line.slice(index) : "";
    if(id.length > 0)
      return `<id->${id}</id->${remainingLine}`;

    return "$" + line;
  }).join("");
}

export default {
  parse,
  parseHTML,
  idToBinary,
  binaryToId
};
