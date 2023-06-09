import { getMenberInfo } from "./restapi";

export async function isMember() {
  // 判断是否是会员
  const ismember = await getMenberInfo();
  if (ismember.length > 0) {
    localStorage.setItem("ismember", "true");
    console.log("ismember", ismember);
    return true;
  }
  localStorage.setItem("ismember", "false");
  return false;
}
