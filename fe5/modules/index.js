export const dirName = location.href.split("/").at(-2);

export class PackedElement {
  /**@type HTMLElement */
  #element;

  /**@param {string | HTMLElement | PackedElement} element */
  constructor(element) {
    if(typeof element === "string") {
      this.#element = document.createElement(element);
    } else {
      this.#element = (element instanceof PackedElement) ? element.#element : element;
    }
  }

  /**@param {string[]} name */
  addClass(...name) {
    this.#element.classList.add(...name);
    return this;
  }

  /**@param {string[]} name */
  removeClass(...name) {
    this.#element.classList.remove(...name);
    return this;
  }

  /**@param {string} id */
  setId(id) {
    this.#element.id = id;
    return this;
  }

  /**@param {string} text */
  setText(text) {
    this.#element.textContent = text;
    return this;
  }

  /**@param {string} html */
  setHTML(html) {
    this.#element.innerHTML = html;
    return this;
  }

  /**
   * @param {keyof CSSStyleDeclaration} name 
   * @param {string | undefined} value 
   */
  setStyle(name, value) {
    this.#element.style[name] = value;
    return this;
  }

  /**@param {string} style */
  overrideStyle(style) {
    this.#element.style.cssText = style;
    return this;
  }

  /**
   * @param {string} name 
   * @param {string} value 
   */
  setAttribute(name, value) {
    this.#element.setAttribute(name, value);
    return this;
  }

  /**
   * @param {keyof HTMLElementEventMap} type 
   * @param {(this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener 
   * @param {boolean | AddEventListenerOptions  | undefined} options 
   */
  addListener(type, listener, options) {
    this.#element.addEventListener(type, listener, options);
    return this;
  }

  /**
   * @param {keyof HTMLElementEventMap} type 
   * @param {(this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener 
   * @param {boolean | EventListenerOptions | undefined} options 
   */
  removeListener(type, listener, options) {
    this.#element.removeEventListener(type, listener, options);
    return this;
  }

  /**
   * @param {keyof HTMLElementTagNameMap} selector 
   */
  select(selector) {
    const result = this.#element.querySelector(selector);
    return result ? new PackedElement(result) : null;
  }

  /**
   * @param {keyof HTMLElementTagNameMap} selector 
   */
  selectAll(selector) {
    return [...this.#element.querySelectorAll(selector)]
      .map(element => new PackedElement(element));
  }

  /**@param {(string | HTMLElement | PackedElement)[]} nodes */
  append(...nodes) {
    this.#element.append(...nodes.map(node =>
      node instanceof PackedElement ? node.#element : node));
    return this;
  }

  /**
   * @param {HTMLElement | PackedElement} node
   */
  appendTo(node) {
    node.append(this.#element);
    return this;
  }

  get() {
    return this.#element;
  }

  getChildren() {
    return [...this.#element.children]
      .map(element => new PackedElement(element));
  }

  getClass() {
    return this.#element.classList;
  }

  /**
   * 
   * @param {string} name 
   */
  hasClass(name) {
    return this.#element.classList.contains(name);
  }
}

/**
 * @param {string} name 
 * @param {string?} id 
 */
export function create(name, id) {
  if(id) return new PackedElement(name)
    .setId(id);

  return new PackedElement(name);
}

const stylePromiseSet = [];
let startLoadingTime;

/**
 * @param {string} url  
 */
export async function loadStyle(url) {
  if(!startLoadingTime) startLoadingTime = Date.now();

  const {promise, resolve} = Promise.withResolvers();
  stylePromiseSet.push(promise);
  
  try {
    const data = await fetchText(`/fe5/assets/${url}.css`);
    const css = new CSSStyleSheet();
    css.replaceSync(data);

    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

    resolve(true);
  } catch(err) {

    resolve(false);
    throw err;
  } 
}

export async function calStyleStatus() {
  const status = await Promise.all(stylePromiseSet);

  const result = status.reduce((result, success) => {
    if(success) result.success++;
    else result.failure++;
    return result;
  }, {
    success: 0,
    failure: 0
  });

  result.total = status.length;
  result.timeUsed = Date.now() - startLoadingTime;
  return result;
}

/**
 * @async
 * @param {number} ms 
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param {string} url 
 * @param {RequestInit | undefined} init
 */
export async function strictFetch(url, init) {
  const res = await fetch(url, init);
  if(!res.ok) throw new Error(`${res.status} ${res.statusText} ${url}`);
  return res;
}

/**
 * @param {string} url 
 * @param {RequestInit | undefined} init 
 */
export async function fetchText(url, init) {
  return (await strictFetch(url, init)).text();
}

/**
 * @param {string} url 
 * @param {RequestInit | undefined} init 
 */
export async function fetchJson(url, init) {
  return (await strictFetch(url, init)).json();
}

/**
 * @param {string} url 
 * @param {boolean} isLazy 
 */
export function loadImage(url, isLazy = false) {

  const div = create("div");
  const controller = new AbortController();

  const promise = new Promise((resolve, reject) => {

    const defaultSetting = { once: true, signal: controller.signal };

    create("img")
      .setStyle("width", "100%")
      .addListener("load", resolve, defaultSetting)
      .addListener("error", ev => {
        
        div.setText("图片加载失败 :(")
          .addClass("img-load-failed")
          .overrideStyle(`
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            text-align: center;
            font-size: 130%;
            font-family: 'Courier New';

            user-select: none;`);
        
        reject(ev);

      }, defaultSetting)
      .setAttribute("loading", isLazy ? "lazy" : "eager")
      .setAttribute("src", url)
      .appendTo(div);
  }).finally(() => controller.abort());

  return {
    image: div,
    promise: promise
  }
}