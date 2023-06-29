export const defaultConfig = {
  //用户通过命令行来配置
    organization: "gaoter",
    accessToken: "27d396c213afdcdfdad40fa790bda01b",
  
};

export const configPath = `${
  process.env[process.platform === "darwin" ? "HOME" : "USERPROFILE"] //判断是什么环境 mac或window
}/.hcrc`;
