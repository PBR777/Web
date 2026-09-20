import { create, fetchJson, PackedElement } from "/fe5/modules/index.js";
import Time from "/fe5/modules/time-system.js";
import "/fe5/modules/tooltip.js"

export class Timeline extends PackedElement {
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

    const logsDiv = create("div")
      .addClass("log-div")
      .appendTo(this);

    logsDiv.setHTML(
    `<svg class="log-timeline">
      <defs>
        <linearGradient id="g1" 
          x1="0%" y1="0" 
          x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <line
        x1="50%" y1="20px" x2="50%" y2="calc(100% - 60px)"
        stroke="white" 
        stroke-width="4"/>
      <line
        x1="50.001%" y1="calc(100% - 60px)" x2="50%" y2="100%"
        stroke="url(#g1)" 
        stroke-width="4"/>
    </svg>`);

    function clickHandler(ev) {
      /**@type HTMLElement */
      const target = ev.target;
      const block = target.parentElement;

      const i = Number(block.getAttribute("data-index"));
      
      if(target.classList.contains("log-expand")) {

        const content = block.querySelector(".log-content") 
          ?? create("div")
          .addClass("log-content")
          .appendTo(block)
          .get();

        if(block.classList.toggle("log-block-expanded")) {
          if(!content.classList.contains("log-loaded")) {
            content.classList.add("log-loaded");

            const data = logsData[i];
            
            const html = `<span class="log-heading">记录者：${data.writer ?? "<id->777</id->"}</span><br>`
              + (typeof data.content === "string" 
              ? ("　　" + data.content)
              : data.content.map(line => "　　" + line).join("<br>"));
  
            content.innerHTML = html; 
          }
          
          content.style.overflow = "";
          // Add 10 px so that it can fits with padding.
          block.style.height = (block.scrollHeight + 10) + "px";
          content.style.overflow = "hidden";
          content.style.opacity = "100%";

        } else {
          block.style.height = "";
          content.style.opacity = "";
        }
      }
    }

    function lazyCb(ev) {
      /**@type HTMLElement */
      const target = ev.target;
      
      const i = Number(target.parentElement.getAttribute("data-index"));
      const time = Time.stringify(logsData[i].t, "full", 0);

      target.setAttribute("text", time);
    }

    const logBlockDiv = create("div")
      .addClass("log-block-div")
      .addListener("click", clickHandler)
      .appendTo(logsDiv);


    const blocks = logsData.map((data, i) => {
      const block = create("div")
        .addClass("log-block")
        .setAttribute("data-index", i)

      const time = Time.stringify(data.t, "YDH", 0);

      create("tool-tip")
        .addClass("log-timestamp-box", "hidden")
        .setText(time)
        .addListener("pointerenter", lazyCb, { once: true, capture: true })
        .appendTo(block);

      create("div")
        .addClass("log-timestamp-spot", "log-timestamp-spot-pulse")
        .appendTo(block);

      create("div")
        .addClass("log-timestamp-spot", "log-expand")
        .appendTo(block);

      create("h3")
        .addClass("log-title", "log-expand")
        .setHTML(data.title ?? "&lt;无标题&gt;")
        .appendTo(block);

      return block;
    });

    logBlockDiv.append(...blocks);
  }
}

export const buildTimeline = Timeline.construct;
