import { create, fetchJson, PackedElement } from "/fe5/modules/index.js";
import Time from "/fe5/modules/time-system.js";
import "/fe5/modules/tooltip.js"

export class Timeline extends PackedElement {
  #logs;

  static async construct(logsUrl) {
    const data = await fetchJson(`/fe5/data/logs/${logsUrl}.json`);

    return new Timeline(data);
  }

  /**
   * @param {logsFormat} logsData 
   */
  constructor(logsData) {
    super(create("div")
      .addClass("log-main-div"));

    this.#logs = logsData;

    const logsDiv = create("div")
      .addClass("log-div")
      .appendTo(this);

    logsDiv.setHTML(`<svg class="log-timeline">
      <line
        x1="50%" y1="15px" x2="50%" y2="calc(100% - 15px)" 
        stroke="white" 
        stroke-width="4"
        stroke-linecap="round"
        />
    </svg>`);

    const logBlockDiv = create("div")
      .addClass("log-block-div")
      .appendTo(logsDiv);

    function lazyCb(ev) {
      const target = ev.target;
      const i = Number(target.getAttribute("data-index"));
      const time = Time.stringify(logsData[i].t, "full", 0);

      target.setAttribute("text", time);
    }

    const blocks = logsData.map((data, i) => {
      const block = create("div")
        .addClass("log-block")
        .setHTML(typeof data.content === "string" ? data.content : data.content.join("<br>"))

      const time = Time.stringify(data.t, "YDH", 0);

      create("tool-tip")
        .addClass("log-timestamp-box", "hidden")
        .setText(time)
        .setAttribute("data-index", i)
        .addListener("pointerenter", lazyCb, { once: true, capture: true })
        .appendTo(block);

      create("div")
        .addClass("log-timestamp-spot", "log-timestamp-spot-pulse")
        .appendTo(block);

      create("div")
        .addClass("log-timestamp-spot")
        .appendTo(block);

      

      return block;
    });

    logBlockDiv.append(...blocks);
  }

  
}

export const buildTimeline = Timeline.construct;
