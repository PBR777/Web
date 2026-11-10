const div = document.createElement("div");
div.id = "upper_banner";

div.append(
  ...[
    {name: "主页", path: "/"},
    {name: "项目", path: "/projects/"},
    {name: "作文:有感而发", path: "/writings/sudden-idea/"},
    {name: "作文:外部作品", path: "/writings/outer-project/"},
    {name: "作文:硬性要求", path: "/writings/forced-project/"}
  ].map(link => {
    const a = document.createElement("a");
    a.innerText = link.name;
    a.href = link.path;
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
