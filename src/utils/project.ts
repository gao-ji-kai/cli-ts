import axios from "axios";
import { exec } from "child_process";
import util from "util";
import { wrapLoading } from "../utils/loading.js";
import { rm } from "fs/promises";
import { defaultConfig } from "../constants.js";
const execPromisifed = util.promisify(exec); //因为exec本事一个回调方法 所以我们要将它转成一个promise方法  需要借助util库

//exec  一种回调的写法  是node中 执行命令的一个插件 因为我们要在node中执行git clone 命令

const { organization, accessToken } = defaultConfig;

export async function getOrganizationProjects() {
  const res = await axios.get(
    `https://gitee.com/api/v5/orgs/${organization}/repos`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log(res, "2222");

  return res.data.map((item) => item.name);
}

export async function getProjectVersions(repo) {
  const res = await axios.get(
    `https://gitee.com/api/v5/repos/${organization}/${repo}/tags`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data.map((item) => item.name);
}

export async function cloneAndCheckoutTag(tag, projectName, repo) {
  // 开始拼git命令   首先要告诉 克隆哪个分支
  const cmd = `git clone --branch ${tag} --depth 1 https://gitee.com/${organization}/${projectName}.git ${repo}`;
  return wrapLoading("download", async () => {
    await execPromisifed(cmd);
    return rm(`${repo}/.git`, { recursive: true });
  });
}
