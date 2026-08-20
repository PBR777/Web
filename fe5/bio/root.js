import {} from "/fe5/root.js";
import setTitle from "/fe5/modules/sidebar.js";
import { create } from "/fe5/modules/index.js";

const DIRECTORY = "bio";

const urlPart = location.href.split("/");
const dirIndex = urlPart.indexOf(DIRECTORY);

if(dirIndex === -1) 
  throw new Error(`Cannot be called outside ${DIRECTORY} directory.`);

if(dirIndex + 1 >= urlPart.length)
  throw new Error("Invalid url.");

const id = urlPart[dirIndex + 1];

// 750你别再加这些无意义的……表情了，这很难维护的（︶^︶）
const ALT_TEXT = {
  E: [
    "(￣、￣)",
    "(●__●)",
    "(x_x)"
  ],
  O: [
    "( ˘ ^ ˘ )",
    "(* ￣︿￣)",
    "(￣﹏￣；)"
  ],
  P: [
    "（￣︶￣）↗",
    "(～￣▽￣)～",
    "(☆▽☆)"
  ],
  M: [
    "(^///^)",
    "＞︿＜~",
    "(>_<。)＼"
  ]
};



const writer = document.head
  .querySelector("meta[name='writer']")
  ?.content

const div = create("div", "profile-div")
  .build();

const subheading = create("h1", "profile-subheading")
  .setHTML(writer && writer !== id ? `由<id->${writer}</id->撰写` : "自我撰写")
  .appendTo(div);

const profileTextbox = create("text-box", "profile-textbox")
  .appendTo(div);

const profileImgDiv = create("div", "profile-img-div")
  .appendTo(profileTextbox);

const profileInfoDiv = create("div", "profile-info-div")
  .appendTo(profileTextbox);

const profileImgBox = create("info-box", "profile-img-box")
  .appendTo(profileImgDiv);

const profileImg = create("img", "profile-img")
  .addListener("error", imgErrorHandler, {once: true})
  .appendTo(profileImgBox);

profileImg.src = `/fe5/assets/bio/${id}/profile.png`;


function imgErrorHandler() {

  profileImg.remove();

  const textList = ALT_TEXT[id[0]];
  const seed = parseInt(id.slice(1)); 

  create("span", "profile-alt")
    .setText(textList[Math.abs((seed * 258015 | 0) - 152) % textList.length] + "\n图片不存在")
    .appendTo(profileImgBox);
}

(async () => {
  const createSpan = html => create("span")
    .addClass("bio-span")
    .setHTML(html)
    .build();

  const title = createSpan("基础信息加载中...");
  title.id = "profile-title";
  profileInfoDiv.append(title);

  const bioRes= await fetch("./data.json");
  if(!bioRes.ok) throw new Error(bioRes.status + " " + bioRes.statusText);

  const {altname, birthday, sex, words} = await bioRes.json();

  const spans = [];
  const push = text => {
    spans.push(createSpan(text));
  };

  push("别名：" + (altname ?? "无/未知（Trustable）"));

  if(birthday) {
    const Time = (await import("/fe5/modules/time-system.js")).default;

    if(Time) {
      push("出生日期：" + Time.stringify(birthday, birthday.Hp ? "full" : "YDH", 0));
    }
  } else {
    push("出生日期：未知");
  }

  let sexText;
  if(sex === 0) sexText = "女";
  else if(sex === 1) sexText = "男";
  else if(sex === null) sexText = "无";
  else sexText = "未知";
  push("性别：" + sexText);

  push("个性签名：" + (words ?? "无"));

  title.innerText = "基础信息";

  profileInfoDiv.append(...spans);

})().catch(err => {
  console.error(err);
  
  profileInfoDiv.innerHTML = "";

  create("span", "profile-error")
    .setText("基础信息加载失败 :(\n" + err)
    .appendTo(profileInfoDiv);

  
});

setTitle(id);

document.querySelector("#document-title-div").append(div);

export default {};
