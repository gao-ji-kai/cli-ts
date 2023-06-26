import path from "path";
import { existsSync, rmSync } from "fs";
import inquirer from "inquirer";
import { wrapLoading } from "../utils/loading.js";

export default async function (name, option) {
  console.log(name, option, "cwd1112");
  const cwd = process.cwd(); //nodeApi  获取当前项目的工作目录
  const targetDir = path.join(cwd, name);
  console.log(targetDir);
  if (!existsSync(targetDir)) {
    if (option.force) {
      rmSync(targetDir, { recursive: true }); //递归删除目录内容
    } else {
      // 询问用户是否要删除
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list", // checkbox  conform list
          message: `目录已存在，是否覆盖？`,
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
}
