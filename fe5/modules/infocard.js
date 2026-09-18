import { create, loadStyle, PackedElement } from "./index.js";

export class Infocard extends PackedElement {
  #imgAlt = "图片加载失败 :("

  #imgBox;

  /**
   * @param {HTMLDivElement} img 
   * @param {string?} title 
   * @param {string?} descriptions 
   */
  constructor(img, title = "信息", descriptions) {
    super("div");
    this.addClass("infocard-div")

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
      .addListener("error", () => {
        this.#imgBox.setHTML("");

        create("div")
          .addClass("infocard-img-err")
          .setHTML(this.#imgAlt)
          .appendTo(this.#imgBox);

      }, { once: true, capture: true })
      .append(img)
      .appendTo(profileImgDiv);

  }

  /**
   * @param {string} text 
   */
  setImgAlt(text) {
    this.#imgAlt = text.replaceAll("\n", "<br>");
  }

  /**
   * @param {string} info 
   */
  setInfo(info) {
    this.select(".infocard-span").setHTML(info.replaceAll("\n", "<br>"));
  }  
}

/**
 * 
 * @param {HTMLDivElement} img 
 * @param {string} title 
 * @param {string} descriptions 
 */
export function createCard(img, title, descriptions) {
  return new Infocard(img, title, descriptions);
}

loadStyle("infocard");
