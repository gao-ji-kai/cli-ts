var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { exec } from "child_process";
import util from "util";
import { wrapLoading } from "../utils/loading.js";
const execPromisifed = util.promisify(exec); //因为exec本事一个回调方法 所以我们要将它转成一个promise方法  需要借助util库
//exec  一种回调的写法  是node中 执行命令的一个插件 因为我们要在node中执行git clone 命令
export const defaultConfig = {
    //用户通过命令行来配置
    organization: "heng-chu",
    accessToken: "933ee0c2e9e11f414c1909861965fb1d",
};
export function getOrganizationProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const { organization, accessToken } = defaultConfig;
        const res = yield axios.get(`https://gitee.com/api/v5/orgs/${organization}/repos`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data.map((item) => item.name);
    });
}
export function getProjectVersions(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { organization, accessToken } = defaultConfig;
        const res = yield axios.get(`https://gitee.com/api/v5/repos/${organization}/{repo}/tags`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data.map((item) => item.name);
    });
}
export function cloneAndCheckoutTag(tag, projectName, repo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { organization, accessToken } = defaultConfig;
        // 开始拼git命令   首先要告诉 克隆哪个分支
        const cmd = `git clone --branch ${tag} --depth 1 https://gitee.com/${organization}/${projectName}.git ${repo}`;
        return wrapLoading("download", () => __awaiter(this, void 0, void 0, function* () {
            return execPromisifed(cmd);
        }));
    });
}
