(async () => {
  const heading =  document.querySelector("h1");
  if(!heading) return;

  const cd = document.createElement("p");
  heading.append(cd);

  for(let sec = 5; sec > 0; sec--) {
    cd.innerText = `将在${sec}秒后重定向`;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  cd.innerText = `重定向中……`;
  window.location.href = "/";
})();
