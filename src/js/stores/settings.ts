import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { ColorValue, DocumentDiagonostic, Config } from "../../shared/shared";
import { getVerbosePackage } from "../lib/utils/app";
import path from "path";
import {
  readFile,
  writeFile,
  makeFolder,
  exists,
  deleteFile,
} from "../lib/utils/fs";
const name = "settings";
const storage = window.localStorage;
const override = false;
import { useHelp } from "./help";

const deduceTheme = () => {
  isLightTheme =
    JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo
      .panelBackgroundColor.color.red > 200;
};
const getFilePath = (filepath: string): string => {
  return filepath.replace(/^file\:\\/, "").replace(/\\/gm, "/");
};
const APPDATA_FOLDER = getFilePath(
  path.join(window.__adobe_cep__.getSystemPath("userData"), "Checkpoint")
);
const SETTINGS_FILE = getFilePath(path.join(APPDATA_FOLDER, "settings.json"));
const HELP_FILE = getFilePath(path.join(APPDATA_FOLDER, "help.json"));
const CHANGELOG_FILE = getFilePath(path.join(APPDATA_FOLDER, "changelog.json"));

let isLightTheme = false;
deduceTheme();

export const useSettings = defineStore(name, {
  state: () =>
    ({
      anchor: {
        style: {
          width: 4,
          size: 10,
          color: (isLightTheme
            ? {
                red: 130,
                green: 0,
                blue: 255,
              }
            : {
                red: 255,
                green: 238,
                blue: 0,
              }) as ColorValue,
          filled: true,
        },
        label: "_anchor",
      },
      handle: {
        style: {
          size: 10,
          label: "_handle",
          color: (isLightTheme
            ? {
                red: 130,
                green: 0,
                blue: 255,
              }
            : {
                red: 255,
                green: 238,
                blue: 0,
              }) as ColorValue,
          width: 2,
          filled: true,
        },
        label: "_handle",
      },
      stick: {
        style: {
          width: 2,
        },
        label: "_stick",
      },
      outline: {
        style: {
          width: 2,
          color: (isLightTheme
            ? {
                red: 35,
                green: 31,
                blue: 32,
              }
            : {
                red: 255,
                green: 255,
                blue: 255,
              }) as ColorValue,
        },
      },
      options: {
        useLayerLabelColor: false,
        overrideComplex: false,
        forceOpacity: true,
        renameGenericPaths: true,
        generateIds: false,
        groupRelated: true,
        scaleFactor: 100,
        ignoreBackgrounds: false,
        ignoreHidden: true,
        ignoreLocked: true,
        warnForComplexArt: true,
        mergeClippingMasks: true,
        createAsCopy: false,
        copySuffix: " Outlines",
        ignoreCMYKColorAlerts: false,
        displayBG: {
          include: false,
          color: (isLightTheme
            ? {
                red: 155,
                green: 155,
                blue: 155,
              }
            : {
                red: 50,
                green: 50,
                blue: 50,
              }) as ColorValue,
        },
        chunks: {
          size: 50,
          enabled: false,
          maxAnchors: 1000,
        },
        suffixes: {
          handle: "_handle",
          anchor: "_anchor",
          stick: "_stick",
          outline: "_outline",
          parent: "_nodes",
        },
      },
    } as Config),
  getters: {
    scriptPackage(state) {
      // @ts-ignore
      const p = JSON.parse(JSON.stringify(this.$state));
      p.anchor.style.color = getVerbosePackage(p.anchor.style.color);
      p.handle.style.color = getVerbosePackage(p.handle.style.color);
      p.outline.style.color = getVerbosePackage(p.outline.style.color);
      return p;
    },
  },
  actions: {
    async init() {
      console.log("SETTINGS INIT");
      await this.verifyTempFolder();
      await this.loadSettingsFromAppData();
      let temp = storage.getItem(name);
      if (!override && temp) this.$state = JSON.parse(temp) as Config;
      else if (!temp) storage.setItem(name, JSON.stringify(this.$state));
      watch(
        this.$state,
        async (state) => {
          storage.setItem(name, JSON.stringify(state));
          await this.saveSettings();
        },
        { deep: true }
      );
    },
    softReset() {
      deduceTheme();
      this.deleteSettings();
      this.$reset();
    },
    async deleteSettings() {
      if (exists(SETTINGS_FILE)) return await deleteFile(SETTINGS_FILE);
      else return false;
    },
    async saveSettings() {
      return await writeFile(
        SETTINGS_FILE,
        JSON.stringify(this.$state, null, 4)
      );
    },
    async loadSettingsFromAppData() {
      if (exists(SETTINGS_FILE)) {
        let lastSettings = await readFile(SETTINGS_FILE, false);
        this.$state = lastSettings;
      }
    },
    async verifyTempFolder() {
      if (!exists(APPDATA_FOLDER)) await makeFolder(APPDATA_FOLDER);
      if (!exists(SETTINGS_FILE)) await this.saveSettings();
    },
    async getHelpPages() {
      const help = useHelp();
      const data = await fetch(help.URL).catch((err) => {
        console.error(err);
      });
      // @ts-ignore
      return data.text();
    },
    async preloadHelpPages() {
      const pages = await this.getHelpPages();
      try {
        let temp = JSON.parse(pages);
      } catch (err) {
        console.log(pages);
        console.log(err);
      }
      if (exists(APPDATA_FOLDER) && pages) {
        return await writeFile(
          HELP_FILE,
          // @ts-ignore
          JSON.stringify(JSON.parse(pages), null, 4)
        );
      }
    },
    async getChangelogPages() {
      const data = await fetch("XXX").catch((err) => {
        console.error(err);
      });
      // @ts-ignore
      return data.text();
    },
    async preloadChangelogPages() {
      const pages = await this.getChangelogPages();
      try {
        let temp = JSON.parse(pages);
      } catch (err) {
        console.log(pages);
        console.log(err);
      }
      if (exists(APPDATA_FOLDER) && pages) {
        return await writeFile(
          CHANGELOG_FILE,
          // @ts-ignore
          JSON.stringify(JSON.parse(pages), null, 4)
        );
      }
    },
  },
});
