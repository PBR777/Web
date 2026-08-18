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
 * @param {string | object} id
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

export default {
  parse,
  idToBinary,
  binaryToId
};
