window.addEventListener("load", load);

function load() {

  const HEADING =  document.getElementById("heading");
  if(!HEADING) return;

  const COUNT_DOWN = document.createElement("p");

  HEADING.appendChild(COUNT_DOWN);

  countDown(COUNT_DOWN);
}

async function countDown(element) {

  for(let cd = 5; cd > 0; cd--) {

    element.innerText = `将在${cd}秒后重定向`;

    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  element.innerText = `重定向中……`;

  window.location.href = "/";
}