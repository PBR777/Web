type solarDataFormat = {
  mass: number; // In kg
  long: number; // In m
  short: number; // In m

  rotationPeriod: number; // In sec

  starInfo: {
    temperature: number; // In K
  };
};

type solarTreeFormat = Record<string, {
  name: string;
  parent: string;
  children: string[];
}>;