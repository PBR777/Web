import { create, fetchText } from "/fe5/modules/index.js";

/**
 * const obj = getToolObject("name");
 * positionYouWantToInject.append(obj.tool);
 * 
 * 当工具组件已经注入且**已经出现**在文档里面时，调用obj.execute启动工具，这确保了工具内部的script（像document.querySelector）不会出错。
 */

async function getToolObject(toolName) {

  const div = create("div")
    .setStyle("display", "flex")
    .setStyle("flexDirection", "column")
    .setStyle("alignItems", "center");

  const heading = create("ah-")
    .addClass("h2")
    .appendTo(div);
  
  const toolDiv = create("info-box")
    .addClass("tool-div")
    .appendTo(div);

  try {
  
    if(!toolName || toolName === "") throw new Error("Missing name");

    if(!/^[a-zA-Z0-9_-]*$/g.test(toolName)) throw new Error("Parameter unsafe, stop loading");

    toolDiv.setHTML(await fetchText(`/fe5/tools/${toolName}.html`));

  } catch(err) {
    console.error(err);
    toolDiv.setHTML(`tool:${toolName}加载失败 <br> ${err}`);
  }

  const name = toolDiv.select("meta[name='tool-name']");
  heading.setText(name ? name.get().content : null);

  return {
    tool: div.get(),
    name: name,
    execute: () => {

      const scripts = toolDiv.selectAll(".to-be-executed")
        .map(scrpit => scrpit.get())
        .map(script => {
          script.remove();
          return create("script")
            .setHTML(script.innerText)
            .setAttribute("type", script.type)
            .get();   
      });

      toolDiv.append(...scripts);
    }
  };
}

export default getToolObject;
