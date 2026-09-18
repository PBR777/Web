const tree = [
  {
    id: "_centroid",
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
    id: "pbr-7.1",
    name: "PBR-7.1",
    parent: "pbr-7",

    mass: 4.865e19,
    near: 26391.812,
    far: 26399.433,
    rotationPeriod: 19314.9819
  },
  {
    id: "pbr-7.2",
    name: "PBR-7.2",
    parent: "pbr-7",

    mass: 2.113e19,
    near: 41871.732,
    far: 41909.023,
    rotationPeriod: 30819.3789
  },
  {
    id: "pbr-7.3",
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
    id: "luna-1", // To be fixed
    name: "耀月",
    parent: "fe5",

    mass: 5.104e22,
    near: 341277.810,
    far: 348574.107,
    rotationPeriod: 148332.4961
  },
  {
    id: "luna-2", // To be fixed
    name: "潜月",
    parent: "fe5",

    mass: 3.0339e23,
    near: 656599.042,
    far: 689143.759,
    rotationPeriod: 206129.3621
  },
  {
    id: "electron",
    name: "系外电子",
    parent: "_centroid",

    mass: 6.451e24,
    near: 3.1762e12,
    far: 3.8631e12,
    rotationPeriod: 2217917.7512
  },
  {
    id: "electron.1",
    name: "电子-α",
    parent: "electron",

    mass: 3.0356e22,
    near: 551614.9360,
    far: 597949.3767,
    rotationPeriod: 1132289.1326
  },
  {
    id: "electron.2",
    name: "电子-β",
    parent: "electron",

    mass: 9.6855e21,
    near: 1097025.8645,
    far: 1126651.9058,
    rotationPeriod: 2160140.0737
  }
]

/**@type Map<string, {children: string[];} & solarTreeFormat> */
export const treeMap = new Map();

function buildMap() {
  for(const data of tree) {
    const obj = {...data, children: []};
    delete obj.id;

    treeMap.set(data.id, obj);
  }

  for(const [id, data] of treeMap) {
    if(!data.parent) continue;

    treeMap.get(data.parent).children.push(id);
  }

  const centroid = treeMap.get("_centroid");

  centroid.mass = getObject("sun-1").mass + getObject("sun-2").mass;
}

/**
 * @param {string} id 
 */
export function getObject(id) {
  return treeMap.get(id);
}

buildMap();

export const G = (6.674184e-11 + 6.674484e-11) / 2;

/**
 * @param {number} near 
 * @param {number} far 
 * @param {number} mass 
 */
export const period = (near, far, mass) => 2 * Math.PI * ((near + far) ** 3 / (8 * G * mass)) ** 0.5;

/**
 * @param {string} id 
 */
export function getParentId(id) {
  return treeMap.get(id).parent;
}

/**
 * @param {string} id 
 */
export function getChildrenId(id) {  
  return treeMap.get(id).children;
}

export function calOrbitalPeriod(id) {
  const parent = getObject(getParentId(id));
  const self = getObject(id);
  return period(self.near, self.far, parent.mass + self.mass);
}
