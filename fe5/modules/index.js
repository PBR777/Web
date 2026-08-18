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

  /**@param {string} name */
  constructor(name) {
    this.#element = document.createElement(name);
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
    this.#element.innerText = text;
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
   * @param {string} name 
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
   * @param {string} type 
   * @param {(ev) => void} listener 
   * @param {boolean | AddEventListenerOptions?} options 
   * @returns 
   */
  addEventListener(type, listener, options) {
    this.#element.addEventListener(type, listener, options);
    return this;
  }

  build() {
    const result = this.#element;
    this.#element = null;
    return result;
  }

  /**@param {Node} node  */
  appendTo(node) {
    const result = this.build();
    return node.appendChild(result);
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
 * For debug
 * @param {number} ms 
 */
export function sleep(ms) {
  return new Promise(_ => setTimeout(_, ms));
}
