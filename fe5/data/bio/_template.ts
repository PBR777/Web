/**
 * 一个标准的bio.json。里面的属性可以省略，代表“未知”。
 */
type bioFromat = {
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

const example: bioFromat = {
  altname: "000",
  birthday: {
    D: 0,
    H: 0,
    Y: 0
  },
  sex: null,
  words: "---"
};