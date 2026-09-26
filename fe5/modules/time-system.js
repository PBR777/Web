import { fetchJson } from "./index.js";
import { period } from "./solar.js";

/**@typedef {Time | timestamp} TimeObject */

export const D_CONST = ((a, b) => a * b / (a + b))
  (period(2.4168e10 + 1.6134e11, 2.6111e10 + 1.7431e11, 2.215e30 + 3.318e29),
  period(2.0214e10, 2.1019e10, 3.318e29 + 7.589e24));

export const Y_CONST = D_CONST * 11;
export const H_CONST = D_CONST / 36;
export const HP_CONST = H_CONST / 100;

const STARTED_TIME = Math.round(1783434536027 - 31.956 * 365.256 * 24 * 60 * 60 * 1000);


const toFull = time => ({
  Y: time.Y ?? 0,
  D: time.D ?? 0,
  H: time.H ?? 0,
  Hp: time.Hp ?? 0,
  s: time.s ?? 0
});

const val = t => typeof t === "number" ? t : timeToSec(t);

/**
 * @param {TimeObject} time 
 */
export const simplify = time => secToTime(timeToSec(time));

export const secToTime = (() => {
  let secRemain = 0;

  const getVal = step => {
    const result = Math.floor(secRemain / step);
    secRemain -= result * step;
    return result;
  }

  /**
   * @param {number} sec
   */
  return sec => {
    secRemain = sec;

    const Y = getVal(Y_CONST);
    const D = getVal(D_CONST);
    const H = getVal(H_CONST);
    const Hp = getVal(HP_CONST);

    return { Y, D, H, Hp, s: secRemain };
  }
})();

/**
 * @param {TimeObject} time 
 * @returns {number}
 */
export const timeToSec = time => {
  const fullTime = toFull(time);

  const result = fullTime.Y * Y_CONST
    + fullTime.D * D_CONST
    + fullTime.H * H_CONST
    + fullTime.Hp * HP_CONST
    + fullTime.s;
  
  if(result < 0) {
    console.warn("Timestamp is smaller than 0.");
    return 0;
  }

  return result;
};

/**
 * @param {TimeObject | number} t
 * @param {"full" | "YDH" | "Hps" | undefined} format Default to "full".
 * @param {number | undefined} secDigit
 */
export function stringify(t, format, secDigit) {
  const time = typeof t === "number" 
    ? new Time(secToTime(t))
    : new Time(toFull(t))

  return time.toString(format, secDigit);
}

/**
 * Time and timestamp class. A time object can represent as a duration or a date.
 */
class Time {

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
    return (this.#H 
      + this.#Hp / 100
      + this.#s / H_CONST)
      / 36;
  }

  get isDaytime() {
    const p = this.daynightProcess;
    return p >= 0.25 && p < 0.75;
  }

  constructor(time) {
    this.#Y = time.Y;
    this.#D = time.D;
    this.#H = time.H;
    this.#Hp = time.Hp;
    this.#s = time.s;
  }

  /**@param {number | TimeObject} t */
  static construct(t) {
    if(typeof t === "number")
      return new Time(secToTime(t));
    
    return new Time(simplify(t));
  }

  toSecond() {
    return timeToSec(this);
  }

  toHp() {
    return this.toSecond() / HP_CONST;
  }

  toH() {
    return this.toSecond() / H_CONST;
  }

  toD() {
    return this.toSecond() / D_CONST;
  }

  toY() {
    return this.toSecond() / Y_CONST;
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

  /**@param {TimeObject | number} t */
  add(t) {
    return Time.construct(this + val(t));
  }

  /**@param {TimeObject | number} t */
  minus(t) {
    return Time.construct(this - val(t));
  }

  /**@param {number} factor */
  mul(factor) {
    return Time.construct(this * factor);
  }
}

export const createTime = Time.construct;

let clockOffset = 0;

export function now() {
  const sec = Date.now() - STARTED_TIME + clockOffset;

  return createTime(sec / 1000);
}

export async function calibrate()  {
  const startTime = Date.now();
  const json = await fetchJson("https://api.pbrsite.dev/time");
  const endTime = Date.now();

  const t = json.t;

  if(!t || typeof t !== "number")
    throw new Error("Invalid response from server.");
    
  clockOffset = t - Math.trunc(startTime + endTime) / 2;
}

export default {
  Y_CONST,
  D_CONST,
  H_CONST,
  HP_CONST,

  simplify,
  secToTime,
  timeToSec,
  stringify,
  createTime,
  now,
  calibrate
}