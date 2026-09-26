const CENTROID = "_centroid"
export const TREE = [
  {
    id: CENTROID,
    name: "远征系重心",
  },
  {
    id: "sun-1",
    name: "主星",
    parent: "sun-2",

    mass: 2.215e30,
    near: 1.85508e11,
    far: 2.00421e11,
    rotationPeriod: 1949184.2
  },
  {
    id: "sun-2",
    name: "序星",
    parent: "sun-1",

    mass: 3.318e29,
    near: 1.85508e11,
    far: 2.00421e11,
    rotationPeriod: 203009.3
  },
  {
    id: "pbr-7",
    name: "PBR-7",
    parent: "sun-2",

    mass: 4.416e23,
    near: 1.2283e10,
    far: 1.2986e10,
    rotationPeriod: 0
  },
  {
    id: "pbr-7-1",
    name: "PBR-7.1",
    parent: "pbr-7",

    mass: 4.865e19,
    near: 26391.812,
    far: 26399.433,
    rotationPeriod: 19314.9819
  },
  {
    id: "pbr-7-2",
    name: "PBR-7.2",
    parent: "pbr-7",

    mass: 2.113e19,
    near: 41871.732,
    far: 41909.023,
    rotationPeriod: 30819.3789
  },
  {
    id: "pbr-7-3",
    name: "PBR-7.3",
    parent: "pbr-7",

    mass: 5.037e18,
    near: 56354.167,
    far: 56391.761,
    rotationPeriod: 9522.7560
  },
  {
    id: "fe5",
    name: "Fe5",
    parent: "sun-2",
    
    mass: 7.589e24,
    near: 2.0214e10,
    far: 2.1019e10,
    rotationPeriod: 0
  },
  {
    id: "lunar-1", // To be fixed
    name: "耀月",
    parent: "fe5",

    mass: 5.104e22,
    near: 341277810,
     far: 348574107,
    rotationPeriod: 148332.4961
  },
  {
    id: "lunar-2", // To be fixed
    name: "潜月",
    parent: "fe5",

    mass: 3.0339e23,
    near: 656599042,
     far: 689143759,
    rotationPeriod: 206129.3621
  },
  {
    id: "electron",
    name: "系外电子",
    parent: CENTROID,

    mass: 6.451e24,
    near: 3.1762e12,
     far: 3.8631e12,
    rotationPeriod: 2217917.7512
  },
  {
    id: "electron-1",
    name: "电子-α",
    parent: "electron",

    mass: 3.0356e22,
    near: 551614936.0,
     far: 597949376.7,
    rotationPeriod: 1132289.1326
  },
  {
    id: "electron-2",
    name: "电子-β",
    parent: "electron",

    mass: 9.6855e21,
    near: 1097025864.5,
     far: 1126651905.8,
    rotationPeriod: 2160140.0737
  }
];

export const G = (6.674184e-11 + 6.674484e-11) / 2;

/**
 * @param {number} near 
 * @param {number} far 
 * @param {number} mass 
 */
export const period = (near, far, mass) => 2 * Math.PI * ((near + far) ** 3 / (8 * G * mass)) ** 0.5;

/**@type {Map<string, {children: string[];} & solarTreeFormat>} */
const treeMap = new Map();

class SkyObject {
  #rawData;

  /**
   * @param {string} id 
   */
  constructor(id) {
    const obj = treeMap.get(id);
    if(!obj) throw new Error(`Sky Object:${id} not found.`)
    this.#rawData = obj;
  }

  get children() {
    return this.#rawData.children
      .map(id => new SkyObject(id));
  }

  /**
   * @returns {SkyObject | null}
   */
  get parent() {
    const id = this.#rawData.parent;
    if(!id) return null;
    return new SkyObject(id);
  }

  get mass() {
    return this.#rawData.mass;
  }

  /**近拱点 */
  get near() {
    return this.#rawData.near;
  }

  /**远拱点 */
  get far() {
    return this.#rawData.far;
  }

  /**半长轴 */
  get long() {
    return (this.far + this.near) / 2;
  }

  /**半短轴 */
  get short() {
    return Math.sqrt(this.far * this.near);
  }

  get id() {
    return this.#rawData.id;
  }

  get name() {
    return this.#rawData.name;
  }

  get rotationPeriod() {
    if(this.isTidalLocked) return this.orbitalPeriod
    return this.#rawData.rotationPeriod;
  }

  get isTidalLocked() {
    return this.#rawData.rotationPeriod === 0;
  }

  get orbitalPeriod() {
    const parent = this.parent;
    if(!parent) return null;
    return period(this.near, this.far, parent.mass + this.mass);
  }

  get orbitalEccentricity() {
    return (this.far - this.near) / (this.far + this.near);
  }

  get hillRadius() {
    const parent = this.parent;
    if(!parent) return null;
    return this.near * Math.cbrt(this.mass / (3 * parent.mass));
  }
}

function buildMap() {
  for(const data of TREE) {
    const obj = Object.defineProperty(data, "children", {
      enumerable: true,
      value: [],
    });

    treeMap.set(obj.id, obj);
  }

  for(const [id, data] of treeMap) {
    if(!data.parent) continue;

    treeMap.get(data.parent).children.push(id);
  }


  const centroid = treeMap.get(CENTROID);

  centroid.mass = new SkyObject("sun-1").mass + new SkyObject("sun-2").mass;
}

buildMap();

/**
 * @param {string} id 
 */
export const getSkyObject = id => new SkyObject(id);

export default {
  G,
  period,
  getSkyObject
}