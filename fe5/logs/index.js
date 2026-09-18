import { create, fetchJson, PackedElement } from "/fe5/modules/index.js";

export class Timeline extends PackedElement {
  #logs;

  static async construct(logsUrl) {
    const data = await fetchJson(`/fe5/data/logs/${logsUrl}.json`);

    const div = create("div")
      .addClass("log-div")
      .build();

    return new Timeline(div, data);
  }

  /**
   * @param {logsFormat} logsData 
   */
  constructor(element, logsData) {
    super(element);
    this.#logs = logsData;

    const svg = create("svg")
      .addClass("log-timeline")
      .appendTo(this);

    const lineSvg = create("line")
      .build()

    lineSvg.setAttribute("x1", "0")
    lineSvg.setAttribute("y1", "0")
    lineSvg.setAttribute("x2", "30")
    lineSvg.setAttribute("y2", "30")
    lineSvg.setAttribute("stroke", "white")

    svg.append(lineSvg)


    for(const log of logsData) {}
  }

  
}

export const buildTimeline = Timeline.construct;
