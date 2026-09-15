export const dirName = location.href.split("/").at(-2);

export class PackedElement {
  #element;

  /**@param {string | HTMLElement} name */
  constructor(name) {
    if(typeof name === "string") {
      this.#element = document.createElement(name);
    } else {
      this.#element = name;
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

  /**@param {(string | HTMLElement | PackedElement)[]} nodes */
  append(...nodes) {
    this.#element.append(...nodes.map(node => {
      if(node instanceof PackedElement) 
        return node.#element;
      return node;
    }));
    return this;
  }

  /**
   * @param {keyof CSSStyleDeclaration} name 
   * @param {string?} value 
   */
  setStyle(name, value) {
    if(!value) {
      this.#element.style = name;
    } else {
      this.#element.style[name] = value;
    }
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
   * @param {boolean | AddEventListenerOptions?} options 
   */
  addListener(type, listener, options) {
    this.#element.addEventListener(type, listener, options);
    return this;
  }

  /**
   * @param {keyof HTMLElementEventMap} type 
   * @param {(this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any} listener 
   * @param {boolean | AddEventListenerOptions?} options 
   */
  removeListener(type, listener, options) {
    this.#element.removeEventListener(type, listener, options);
    return this;
  }

  /**
   * @param {keyof HTMLElementTagNameMap} selector 
   */
  select(selector) {
    const results = Array
      .from(this.#element.querySelectorAll(selector))
      .map(element => new PackedElement(element));
    
    if(results.length === 0) return null;
    if(results.length === 1) return results[0];
    return results;
  }

  /**
   * @param {HTMLElement | PackedElement} node
   */
  appendTo(node) {
    node.append(this.#element);
    return this.#element;
  }

  build() {
    return this.#element;
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

/**
 * @param {CSSStyleSheet} css  
 */
export function addStyle(css) {
  document.adoptedStyleSheets = document.adoptedStyleSheets.concat(css);
}

/**
 * @param {number} ms 
 */
export async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param {string} url 
 * @param {RequestInit?} init 
 */
export async function strictFetch(url, init) {
  const res = await fetch(url, init);
  if(!res.ok) throw new Error(`${res.status} ${res.statusText} ${url}`);
  return res;
}

/**
 * @param {string} url 
 * @param {RequestInit?} init 
 */
export async function fetchText(url, init) {
  return (await strictFetch(url, init)).text();
}

/**
 * @param {string} url 
 * @param {RequestInit?} init 
 */
export async function fetchJson(url, init) {
  return (await strictFetch(url, init)).json();
}

/**
 * @param  {(() => any)[]} callbacks 
 * @returns {any[]}
 */
export function parallel(...callbacks) { 
  return Promise.all(callbacks.map(async callback => await callback()));
}