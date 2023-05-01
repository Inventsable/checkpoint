import { CEP_Config } from "vite-cep-plugin";
import { version } from "./package.json";

const config: CEP_Config = {
  version,
  id: "com.hardhat.cep",
  displayName: "Hardhat",
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [{ name: "ILST", version: "[0.0,99.9]" }],
  type: "Panel",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  width: 500,
  height: 550,

  panels: [
    {
      mainPath: "./main/index.html",
      name: "main",
      panelDisplayName: "Hardhat",
      autoVisible: true,
      width: 300,
      height: 500,
      minWidth: 40,
      minHeight: 100,
      maxWidth: 500,
      maxHeight: 800,
    },
    {
      mainPath: "./main/index.html",
      name: "settings",
      autoVisible: false,
      type: "ModalDialog",
      width: 800,
      height: 650,
      minHeight: 600,
      minWidth: 600,
      maxHeight: 1200,
      maxWidth: 1200,
      startOnEvents: [],
    },
  ],
  build: {
    jsxBin: "off",
    sourceMap: true,
  },
  zxp: {
    country: "US",
    province: "CA",
    org: "MyCompany",
    password: "mypassword",
    tsa: "http://timestamp.digicert.com/",
    sourceMap: false,
    jsxBin: "off",
  },
  installModules: ["showdown"],
  copyAssets: [],
  copyZipAssets: [],
};
export default config;
