export const defaultConfig = {
  //用户通过命令行来配置
  organization: "heng-chu",
  accessToken: "933ee0c2e9e11f414c1909861965fb1d",
};


export const configPath = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}`;