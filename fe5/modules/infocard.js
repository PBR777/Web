import { create, loadStyle, PackedElement } from "./index.js";

export class Infocard extends PackedElement {
  #imgBox;

  /**
   * @param {HTMLElement} img 
   * @param {string | undefined} title 
   * @param {string | undefined} descriptions 
   */
  constructor(img, title = "信息", descriptions) {
    super("div")
      .addClass("infocard-div");

    img.classList.add("infocard-img");
    
    const profileTextbox = create("text-box")
      .addClass("infocard-textbox")
      .appendTo(this);
    
    const profileImgDiv = create("div")
      .addClass("infocard-img-div")
      .appendTo(profileTextbox);
    
    const profileInfoDiv = create("div")
      .addClass("infocard-info-div")
      .appendTo(profileTextbox);

    create("span")
      .addClass("infocard-title")
      .setHTML(title)
      .appendTo(profileInfoDiv);

    create("span")
      .addClass("infocard-span")
      .appendTo(profileInfoDiv);

    if(!descriptions)
      this.setInfo("加载中...");

    this.#imgBox = create("info-box")
      .addClass("infocard-img-box")
      .append(img)
      .appendTo(profileImgDiv);
  }

  /**
   * @param {string} info 
   */
  setInfo(info) {
    this
      .select(".infocard-span")
      .setHTML(info.replaceAll("\n", "<br>"));
  }
}

const {promise: stylePromise, resolve} = Promise.withResolvers();

/**
 * 
 * @param {HTMLElement} img 
 * @param {string} title 
 * @param {string} descriptions 
 */
export async function createCard(img, title, descriptions) {
  await stylePromise;
  return new Infocard(img, title, descriptions);
}

loadStyle("infocard").then(resolve);
