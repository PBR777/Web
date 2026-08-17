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


const subheading = create("h1", "profile-subheading")
  .setHTML(writer && writer !== id ? `由<id->${writer}</id->撰写` : "自我撰写")
  .build();

const profileImg = create("img", "profile-img")
  .addEventListener("error", () => {
    const textList = ALT_TEXT[id[0]];
    const seed = parseInt(id.slice(1)); 

    const altText = create("span", "profile-alt")
      .setText(textList[Math.abs((seed * 258015 | 0) - 152) % textList.length] + "\n图片不存在")
      .build();

    profileImgBox.append(altText);
    profileImg.remove();

  }, {once: true}).build();

profileImg.src = `/fe5/assets/bio/${id}/profile.png`;

const profileImgBox = create("info-box", "profile-img-box")
  .append(profileImg)
  .build();

const profileImgDiv = create("div", "profile-img-div")
  .append(profileImgBox)
  .build();

const profileInfoDiv = create("div", "profile-info-div").build();

const profileDiv = create("text-box", "profile-div")
  .append(profileImgDiv, profileInfoDiv)
  .build()

const div = create("div")
  .append(subheading, profileDiv)
  .build();

(async () => {
  const bioRes= await fetch("./data.json");
  if(!bioRes.ok) throw new Error(bioRes.status + " " + bioRes.statusText);

  const {altname, birthday, sex, words} = await bioRes.json();

  const createSpan = text => create("span")
    .addClass("bio-span")
    .setHTML(text)
    .build();

  const spans = [];

  const push = text => {
    spans.push(createSpan(text));
  };

  const title = createSpan("基础信息");
  title.id = "profile-title"
  spans.push(title);

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

  profileInfoDiv.append(...spans);

})().catch(err => {
  console.error(err);
  
  const span = create("span", "profile-error")
    .setText("基础信息加载失败 :(\n" + err)
    .build();

  profileInfoDiv.innerHTML = "";
  profileInfoDiv.append(span);
});

document.body.insertAdjacentElement("afterbegin", div);

export default {};
