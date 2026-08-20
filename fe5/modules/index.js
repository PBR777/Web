/**
 * Load specified .css file in /fe5/assets/
 * @param {string} name  
 */
export function loadStyle(name) {

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = `/fe5/assets/${name}.css`;
  document.head.append(style);

  return new Promise(resolve => {
    style.addEventListener("load", resolve, { once: true });
    style.addEventListener("error", resolve, { once: true });
  });
}

class PackedElement {
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

  /**@param {(string | Node)[]} nodes */
  append(...nodes) {
    this.#element.append(...nodes);
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
  setAttr(name, value) {
    this.#element.setAttribute(name, value);
    return this;
  }

  /**
   * @param {keyof HTMLElementEventMap} type 
   * @param {(ev) => any} listener 
   * @param {boolean | AddEventListenerOptions?} options 
   */
  addListener(type, listener, options) {
    this.#element.addEventListener(type, listener, options);
    return this;
  }

  /**
   * @param {keyof HTMLElementEventMap} type 
   * @param {(ev) => any} listener 
   * @param {boolean | AddEventListenerOptions?} options 
   */
  removeListener(type, listener, options) {
    this.#element.removeEventListener(type, listener, options);
    return this;
  }

  /**@param {string} selector  */
  select(selector) {
    const results = Array
      .from(this.#element.querySelectorAll(selector))
      .map(element => new PackedElement(element));
    
    if(results.length === 1) return results[0];
    return results;
  }

  /**@param {Node} node  */
  appendTo(node) {
    return node.appendChild(this.#element);
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
  if(id) return new PackedElement(name).setId(id);

  return new PackedElement(name);
}

/**
 * @param {number} ms 
 */
export function sleep(ms) {
  return new Promise(_ => setTimeout(_, ms));
}
