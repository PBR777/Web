/**@typedef {Time | {Y?: number; D?: number; H?: number; Hp?: number; s?: number;}} time */
/**@typedef {number | time} t */

const toFull = time => ({
  Y: time.Y ?? 0,
  D: time.D ?? 0,
  H: time.H ?? 0,
  Hp: time.Hp ?? 0,
  s: time.s ?? 0
});

const val = t => typeof t === "number" ? t : timeToSec(t);

const simplify = time => secToTime(timeToSec(time));

const secToTime = (() => {
  let secRemain = 0;

  const getVal = step => {
    const result = Math.floor(secRemain / step);
    secRemain -= result * step;
    return result;
  }

  return sec => {
    secRemain = sec;

    const Y = getVal(Time.Y_CONST);
    const D = getVal(Time.D_CONST);
    const H = getVal(Time.H_CONST);
    const Hp = getVal(Time.HP_CONST);

    return { Y, D, H, Hp, s: secRemain };
  }
})();

const timeToSec = time => {
  const fullTime =  toFull(time);

  const result = fullTime.Y * Time.Y_CONST
    + fullTime.D * Time.D_CONST
    + fullTime.H * Time.H_CONST
    + fullTime.Hp * Time.HP_CONST
    + fullTime.s;
  
  if(result < 0) {
    console.warn("Timestamp is smaller than 0.");
    return 0;
  }

  return result;
};

/**
 * Time and timestamp class. A time object can represent as a duration or a date.
 */
class Time {
  static D_CONST = (() => {
    const G = (6.674184e-11 + 6.674484e-11) / 2;

    const period = (short, long, mass) => 2 * Math.PI * ((long + short) ** 3 / (8 * G * mass)) ** 0.5;

    return ((a, b) => a * b / (a + b))
    (period(2.4168e10 + 1.6134e11, 2.6111e10 + 1.7431e11, 2.215e30 + 3.318e29),
    period(2.0214e10, 2.1019e10, 3.318e29 + 7.589e24));
  })();

  static Y_CONST = Time.D_CONST * 11;
  static H_CONST = Time.D_CONST / 36;
  static HP_CONST = Time.H_CONST / 100;

  static #STARTED_TIME = Math.round(1783434536027 - 31.956 * 365.256 * 24 * 60 * 60 * 1000);

  /**@type number*/
  #Y;
  /**@type number*/
  #D;
  /**@type number*/
  #H;
  /**@type number*/
  #Hp;
  /**@type number*/
  #s;

  get Y() { return this.#Y; }
  get D() { return this.#D; }
  get H() { return this.#H; }
  get Hp() { return this.#Hp; }
  get s() { return this.#s; }
  get daynightProcess() {
    return (this.H 
      + this.#Hp / 100
      + this.#s / Time.H_CONST)
      / 36;
  }

  get isDaytime() {
    const p = this.daynightProcess;
    return p >= 0.25 && p < 0.75;
  }


  /**
   * DO NOT CALL THIS CONSTRUCTOR, USE Time.create() INSTANT.
  */
  constructor(time) {
    this.#Y = time.Y;
    this.#D = time.D;
    this.#H = time.H;
    this.#Hp = time.Hp;
    this.#s = time.s;
  }

  /**@param {t} t */
  static create(t) {
    if(typeof t === "number") {
      return new Time(secToTime(t))
    }

    return new Time(toFull(t));
  }

  /**
   * @param {time} time
   * @param {"full" | "YDH" | "Hps"} format
   * @param {number | undefined} secDigit
   */
  static stringify(time, format, secDigit) {
    return new Time(toFull(time)).toString(format, secDigit);
  }

  toSecond() {
    return timeToSec(this);
  }

  toHp() {
    return this.toSecond() / Time.HP_CONST;
  }

  toH() {
    return this.toSecond() / Time.H_CONST;
  }

  toD() {
    return this.toSecond() / Time.D_CONST;
  }

  toY() {
    return this.toSecond() / Time.Y_CONST;
  }

  /**
   * @param {"full" | "YDH" | "Hps"} format
   */
  toString(format = "full", secDigit = 3) {
    switch(format) {
      case "YDH":
      return `${this.#Y}-${this.#D.toString().padStart(2, "0")
        }-${this.#H.toString().padStart(2, "0")
        }`;

      case "Hps":
      return `${this.#Hp.toString().padStart(2, "0")
      }:${this.#s.toFixed(secDigit)}`;

      default:
      return `${this.#Y}-${this.#D.toString().padStart(2, "0")
        }-${this.#H.toString().padStart(2, "0")
        } ${this.#Hp.toString().padStart(2, "0")
        }:${this.#s.toFixed(secDigit)}`;
    }
    
  }

  toObject() {
    return {
      Y: this.#Y,
      D: this.#D,
      H: this.#H,
      Hp: this.#Hp,
      s: this.#s
    };
  }

  valueOf() {
    return this.toSecond();
  }

  /**@param {t} t */
  add(t) {
    return Time.create(this + val(t));
  }

  /**@param {t} t */
  minus(t) {
    return Time.create(this - val(t));
  }

  /**@param {number} t */
  scale(t) {
    return Time.create(this * t);
  }

  // ---------------- Clock ----------------

  static #offset = 0;

  static now() {
    const sec = Date.now() - Time.#STARTED_TIME + Time.#offset;

    return Time.create(sec / 1000);
  }

  static async calibrate()  {
    const startTime = Date.now();
    const res = await fetch("/api/time");
    const endTime = Date.now();

    if(!res.ok) 
      throw new Error(res.statusText);

    const t = (await res.json()).t;

    if(!t || typeof t !== "number")
      throw new Error("Invalid response from server.");
      
    Time.#offset = t - Math.trunc(startTime + endTime) / 2;
  }
}

export default Time;