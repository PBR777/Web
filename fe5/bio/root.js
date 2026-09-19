import { headingDiv } from "/fe5/root.js";
import { create, dirName, fetchJson, loadImage } from "/fe5/modules/index.js";
import { createCard } from "/fe5/modules/infocard.js";

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

const textList = ALT_TEXT[dirName[0]];
const seed = Number(dirName.slice(1));

const writer = document.head
  .querySelector("meta[name='writer']")
  ?.content

const img = await loadImage(`/fe5/assets/bio/${dirName}/profile.png`);
if(!img.success) {
  img.image.setHTML(
    textList[Math.abs((seed * 258015 | 0) - 152) % textList.length]
    + "<br>图片不存在"
  );
}

const subheading = create("h1", "profile-subheading")
  .setHTML(writer && writer !== dirName ? `由<id->${writer}</id->撰写` : "自我撰写")
  .get();

const div = await createCard(img.image.get(), "基础信息");



headingDiv.append(subheading, div.get());

try {
  const bio = await fetchJson(`./data.json`);

  const info = [];

  info.push("别名：" + (bio.altname ?? "无/未知（Trustable）"));

  if(bio.birthday) {
    const Time = (await import("/fe5/modules/time-system.js")).default;

    info.push("出生日期：" + Time.stringify(bio.birthday, bio.birthday.Hp ? "full" : "YDH", 0));
  } else {
    info.push("出生日期：未知");
  }

  let sexText;
  switch(bio.sex) {
    case 0:
    sexText = "女";
    break;

    case 1:
    sexText = "男";
    break;

    case null:
    sexText = "无";
    break;

    default:
    sexText = "未知";
  }
  info.push("性别：" + sexText);

  info.push("个性签名：" + (bio.words ?? "无"));

  div.setInfo(info.join("\n"));
} catch(err) {
  div.setInfo("加载失败:(\n" + err)
}

export default {};
