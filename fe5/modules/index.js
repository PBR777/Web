export const dirName = location.href.split("/").at(-2);

/**
 * @template {keyof HTMLElementTagNameMap} T
 */
export class PackedElement {
  /**@type {HTMLElementTagNameMap[T]} */
  #raw;

  /**
   * @overload
   * @param {T} name
   * @returns {PackedElement<T>}
   * 
   * @overload
   * @param {HTMLElementTagNameMap[T]} element
   * @returns {PackedElement<T>}
   * 
   * @overload
   * @param {PackedElement<T>} element
   * @returns {PackedElement<T>}
   */
  constructor(element) {
    if(typeof element === "string") {
      this.#raw = document.createElement(element);
    } else {
      this.#raw = (element instanceof PackedElement) ? element.#raw : element;
    }
  }

  /**@param {string[]} name */
  addClass(...name) {
    this.#raw.classList.add(...name);
    return this;
  }

  /**@param {string[]} name */
  removeClass(...name) {
    this.#raw.classList.remove(...name);
    return this;
  }

  /**@param {string} text */
  setText(text) {
    this.#raw.innerText = text;
    return this;
  }

  /**@param {string} html */
  setHTML(html) {
    this.#raw.innerHTML = html;
    return this;
  }

  /**
   * @overload 
   * @param {keyof CSSStyleDeclaration} name 
   * @param {string | null} value 
   * @returns {this}
   * @overload Directly override all style.
   * @param {string} css
   * @returns {this}
   */
  setStyle(name, value) {
    if(value === undefined)
      this.#raw.style.cssText = name;
    else
      this.#raw.style[name] = value;

    return this;
  }

  /**
   * @param {string} name 
   * @param {string} value 
   */
  setAttr(name, value) {
    this.#raw.setAttribute(name, value);
    return this;
  }

  /**
   * @param {keyof HTMLElementEventMap} type 
   * @param {(this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener 
   * @param {boolean | AddEventListenerOptions  | undefined} options 
   */
  addListener(type, listener, options) {
    this.#raw.addEventListener(type, listener, options);
    return this;
  }

  /**
   * @param {keyof HTMLElementEventMap} type 
   * @param {(this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener 
   * @param {boolean | EventListenerOptions | undefined} options 
   */
  removeListener(type, listener, options) {
    this.#raw.removeEventListener(type, listener, options);
    return this;
  }

  /**
   * @param {keyof HTMLElementTagNameMap} selector 
   */
  select(selector) {
    const result = this.#raw.querySelector(selector);
    return result ? new PackedElement(result) : null;
  }

  /**
   * @param {keyof HTMLElementTagNameMap} selector 
   */
  selectAll(selector) {
    return [...this.#raw.querySelectorAll(selector)]
      .map(element => new PackedElement(element));
  }

  /**@param {(string | HTMLElement | PackedElement)[]} nodes */
  append(...nodes) {
    this.#raw.append(...nodes.map(node =>
      node instanceof PackedElement ? node.#raw : node));
    return this;
  }

  /**
   * @param {HTMLElement | PackedElement} node
   */
  appendTo(node) {
    node.append(this.#raw);
    return this;
  }

  get raw() {
    return this.#raw;
  }

  getChildren() {
    return [...this.#raw.children]
      .map(element => new PackedElement(element));
  }

  getClass() {
    return this.#raw.classList;
  }

  /**
   * 
   * @param {string} name 
   */
  hasClass(name) {
    return this.#raw.classList.contains(name);
  }

  remove() {
    this.#raw.remove();
    return this;
  }

  get childrenCount() {
    return this.#raw.children.length;
  }

  /**
   * @param {(element: HTMLElementTagNameMap[T]) => void} cb
   */
  for(cb) {
    cb(this.#raw);
    return this;
  }
}

/**
 * @template {keyof HTMLElementTagNameMap} T
 * 
 * @overload
 * @param {T} name
 * @param {string} initRule
 * @returns {PackedElement<T>}
 * 
 * @overload
 * @param {HTMLElementTagNameMap[T]} element
 * @param {string} initRule
 * @returns {PackedElement<T>}
 * 
 * @overload
 * @param {PackedElement<T>} element
 * @param {string} initRule
 * @returns {PackedElement<T>}
 */
export function create(element, initRule) {
  const packed = new PackedElement(element);

  if(!initRule) return packed;

  const rules = initRule.split(/(?<!\\)\./g);
  const first = rules.shift()
  
  if(first[0] === "#") {
    packed.raw.id = first.slice(1);
  }
  if(rules.length > 0)
    packed.addClass(...rules)

  return packed;
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
    const data = await fetchText(`/fe5/assets/styles/${url}.css`);
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
          .setStyle(`
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
      .setAttr("loading", isLazy ? "lazy" : "eager")
      .setAttr("src", url)
      .appendTo(div);
  }).finally(() => controller.abort());

  return {
    image: div,
    promise: promise
  }
}
