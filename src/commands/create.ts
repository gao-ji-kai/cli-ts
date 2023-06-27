import path from "path";
import { existsSync, rmSync } from "fs";
import inquirer from "inquirer";
import { wrapLoading } from "../utils/loading.js";
import {
  cloneAndCheckoutTag,
  getOrganizationProjects,
  getProjectVersions,
} from "../utils/project.js";

export default async function (name, option) {
  const cwd = process.cwd(); //nodeApi  获取当前项目的工作目录
  const targetDir = path.join(cwd, name);
  console.log(targetDir);
  if (existsSync(targetDir)) {
    if (option.force) {
      rmSync(targetDir, { recursive: true }); //递归删除目录内容
    } else {
      // 询问用户是否要删除
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list", // checkbox  conform list
          message: "目录已存在，是否覆盖？",
          choices: [
            { name: "overwrite", value: "overwrite" },
            { name: "cancel", value: false },
          ],
        },
      ]);
      if (!action) {
        return console.log("用户取消创建");
      }
      if (action === "overwrite") {
        await wrapLoading("remove", () => {
          rmSync(targetDir, { recursive: true }); //递归删除目录内容
        });
      }
    }
  }
  // 拉取项目仓库  拉取对应项目
  let projects = await getOrganizationProjects();
  // 询问用户是否要删除
  let { projectName } = await inquirer.prompt([
    {
      name: "projectName",
      type: "list", // checkbox  conform list
      message: "请选择项目列表？",
      choices: projects,
    },
  ]);
  let { tags } = await getProjectVersions(projectName);
  let { tag } = await inquirer.prompt([
    {
      name: "tag",
      type: "list", // checkbox  conform list
      message: "请选择对应的版本？",
      choices: tags,
    },
  ]);
  // 获取到项目了  下载到本地

  // 方案一  找zip包的下载地址  但是码云 gitee给屏蔽掉了  因为需要滑块儿认证
  // 方案二  git clone  使用 download-git-repo 都支持

  //上面可以写用户的选择
  await cloneAndCheckoutTag(tag, projectName, name);
}
