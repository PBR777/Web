window.addEventListener("load", load);

function load() {
  const DIV = document.getElementById("demo");
  if(!DIV) return;

  

  function onDemoDivResize() {
    DIV.style.height = `${DIV.clientWidth * 0.75}px`
  }

  const BUTTON = document.createElement("button");
  BUTTON.innerHTML = "<p><b>–––→ 为什么我要使用Scratch ←–––</b></p>";
  BUTTON.style.padding = "15px 60px";

  BUTTON.onclick = ev => {

    window.addEventListener("resize", onDemoDivResize);
    onDemoDivResize();

    const IFRAME = document.createElement("iframe");
    IFRAME.src = "https://turbowarp.org/1218039929/embed?limitless&hqpen";
    IFRAME.setAttribute("frameborder", "0");
    IFRAME.innerText = "Well it looks like the iframe is failed to load or embed :("
    DIV.appendChild(IFRAME);

    BUTTON.remove();
  };

  DIV.appendChild(BUTTON);
}
