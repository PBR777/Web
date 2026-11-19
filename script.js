const appleIcon = document.createElement("link");
appleIcon.rel = "apple-touch-icon";
appleIcon.sizes = "180x180";
appleIcon.href = "/apple-favicon.png";
document.head.append(appleIcon);

const div = document.createElement("div");
div.id = "upper_banner";

div.append(
  ...[
    {name: "主页", path: "/"},
    {name: "项目", path: "/projects/"},
    {name: "作文:有感而发", path: "/writings/sudden-idea/"},
    {name: "作文:外部作品", path: "/writings/outer-project/"},
    {name: "作文:硬性要求", path: "/writings/forced-project/"},
    {name: ""}
  ].map(link => {
    const a = document.createElement("a");
    a.innerText = link.name;
    if(link.path) a.href = link.path;
    return a;
  })
);

if(!document.querySelector("h1")) {
  const title = document.createElement("h1");
  title.innerText = document.title;
  document.body.insertAdjacentElement("afterbegin", title);
}

document.body.insertAdjacentElement("afterbegin", div);
document.body.classList.add("show");
