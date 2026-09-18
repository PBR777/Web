type bioFormat = {
  /** 别名/称呼*/
  altname?: string;

  /** 生日，一个时间戳对象，可以省略百分时（Hp）和秒（s）*/
  birthday?: roundTimestamp;

  /** 性别，0对应女，1对应男，null对应无性（通常是机器人），不可能出现“0.5”之类的*/
  sex?: 0 | 1 | null;

  /** 个性签名（口头禅）*/
  words?: string;
};


type mapDataFormat = {
  /**地点名称。 */
  name: string;

  /**地点超链接，即点击时跳转的链接。 */
  href?: string;

  /**地点坐标，可以为单点（一维数组）和多个点位（二维数组） */
  pos: [number, number] | [number, number][]
}[];


type solarTreeFormat = {
  /**天体ID */
  id: string;

  /**天体名称 */
  name: string;
  /**父级天体ID，即正在环绕的天体。 */
  parent?: string;

  /**单位千克（kg） */
  mass: number;

  /**单位米（m），近日点。计算半长轴：long / 2 = (near + far)。*/
  near: number;
  /**单位米（m），远日点。计算半长轴：long / 2 = (near + far)。*/
  far: number;

  /**自转周期，为0时代表该天体已被潮汐锁定。 */
  rotationPeriod: number;

  starInfo?: {
    temperature: number; // In K
  }
};


type timestamp = {
  Y?: number;
  D?: number;
  H?: number;
  Hp?: number;
  s?: number;
};

type roundTimestamp = {
  Y: number;
  D: number;
  H: number;
} & timestamp;

type fullTimestamp = {
  Hp: number;
  s: number;
} & roundTimestamp

type logsFormat = {
  /**时间 */
  t: fullTimestamp | number,

  /**编写者 */
  writer?: string,

  /**内容，可以为HTML。*/
  content: string | string[]
}[];
type zoneCode = "E" | "O" | "P" | "M";

type idObj = {
  zoneCode: zoneCode;

  id: number;
}
