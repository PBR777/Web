/**
 * @param {string} category
 */
export async function load(category) {
  const res = await fetch(`/data/writings/${category}.json`);
  /**@type {string[]} */
  const json = await res.json();

  const fragment = document.createDocumentFragment();

  const newestDiv = document.createElement("div");
  newestDiv.id = "newest-div";
  fragment.append(newestDiv);

  const newestTitle = document.createElement("h3");
  newestTitle.innerText = "最新作文";
  newestTitle.id = "newest-title";
  newestDiv.append(newestTitle);

  newestDiv.append(...json.slice(-3).reverse().map(name => {
    const link = createLink(category, name);
    link.classList.add("writings-newest-links");
    return link;
  }));

  newestDiv.append(". . .");

  fragment.append("以下作文按创作时间排序：");

  fragment.append(...json.map(name => createLink(category, name)));

  return fragment;
}

function createLink(category, name) {
  const elememt = document.createElement("a");
  const params = new URLSearchParams({
    c: category,
    n: name
  });

  elememt.classList.add("writings-link");
  elememt.innerText = name;
  elememt.href = "/writings/read/?" + params.toString();
  
  return elememt;
}