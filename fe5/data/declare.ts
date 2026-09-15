type bioFormat = {
  /** 别名/称呼*/
  altname?: string;

  /** 生日，一个时间戳对象，可以省略百分时（Hp）和秒（s）*/
  birthday?: {
    Y: number;
    D: number;
    H: number;

    Hp?: number;
    s?: number;
  };

  /** 性别，0对应女孩，1对应男孩，null对应无性别（通常是机器人），不可能出现“0.5”之类的……*/
  sex?: 0 | 1 | null;

  /** 个性签名（口头禅）*/
  words?: string;
};


type mapDataFormat = {
  name: string;

  href?: string;

  pos: [number, number] | [number, number][]
}[];

type solarTreeFormat = {
  id: string;
  name: string;
  parent?: string;

  mass: number; // In kg
  //计算半长轴：long / 2 = (near + far) / 2
  near: number; // In m, 近日点
  far: number; // In m, 远日电

  rotationPeriod: number; // In sec, 0 if it is locked by parent.

  starInfo?: {
    temperature: number; // In K
  }
};