var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import { existsSync, rmSync } from "fs";
import inquirer from "inquirer";
import { wrapLoading } from "../utils/loading.js";
export default function (name, option) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(name, option, "cwd1112");
        const cwd = process.cwd(); //nodeApi  获取当前项目的工作目录
        const targetDir = path.join(cwd, name);
        console.log(targetDir);
        if (!existsSync(targetDir)) {
            if (option.force) {
                rmSync(targetDir, { recursive: true }); //递归删除目录内容
            }
            else {
                // 询问用户是否要删除
                let { action } = yield inquirer.prompt([
                    {
                        name: "action",
                        type: "list",
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
                    yield wrapLoading("remove", () => {
                        rmSync(targetDir, { recursive: true }); //递归删除目录内容
                    });
                }
            }
        }
    });
}
