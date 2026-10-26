

new CSSStyleSheet().replace(`
  .writings-link {
    display: block;
    width: 100%;

    margin: 5px 0;
    padding: 5px 0 5px 5px;

    border-left: 3px solid #709bd4;
    font-size: 120%;

    transition: background-color 150ms;

    user-select: none;
    cursor: pointer;
  }

  .writings-link:hover {
    background-color: #c5f3ff
  }
`).then(css => {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, css]
})

/**
 * 
 * @param {string} category
 */
export async function load(category) {
  const res = await fetch(`/data/writings/${category}/index.json`);
  /**@type {string[]} */
  const json = await res.json();

  const fragment = document.createDocumentFragment();
  for(const name of json) {
    const elememt = document.createElement("a");
    const params = new URLSearchParams({
      c: category,
      n: name
    });

    elememt.classList.add("writings-link");
    elememt.innerText = name;
    elememt.href = "/writings/read/?" + params.toString();
    fragment.append(elememt);
  }

  return fragment;
}