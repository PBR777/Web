import { create, fetchText } from "/fe5/modules/index.js";

/**
 * const obj = getToolObject("name");
 * positionYouWantToInject.append(obj.tool);
 * 
 * 当工具组件已经注入且**已经出现**在文档里面时，调用obj.execute启动工具，这确保了工具内部的script（像document.querySelector）不会出错。
 */

async function getToolObject(toolName) {
  
  const toolDiv = create("info-box")
    .addClass("tool-div")
    .get();

  const heading = create("ah-")
    .addClass("h2")
    .get();

  const div = create("div")
    .append(heading, toolDiv)
    .get();

  try {
  
    if(!toolName || toolName === "") throw new Error("Missing name");

    if(!/^[a-zA-Z0-9_-]*$/g.test(toolName)) throw new Error("Parameter unsafe, stop loading");

    toolDiv.innerHTML = await fetchText(`/fe5/tools/${toolName}.html`);

  } catch(err) {
    console.error(err);
    toolDiv.innerHTML = `tool:${toolName}加载失败 <br> ${err}`;
  }

  const name = toolDiv.querySelector("meta[name='tool-name']")?.content ?? null;
  heading.innerText = name;

  return {
    tool: div,
    name: name,
    execute: function () {
      toolDiv.querySelectorAll(".to-be-executed").forEach(script => {    
        
        const newScript = create("script")
          .setHTML(script.innerText)
          .get();

        newScript.type = script.type;
        script.remove();
        toolDiv.append(newScript);        
      });
    }
  };
}

export default getToolObject;