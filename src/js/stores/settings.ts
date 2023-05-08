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

let isLightTheme = false;
deduceTheme();

function deduceTheme() {
  isLightTheme =
    JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo
      .panelBackgroundColor.color.red > 200;
}

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
      const folder = path
        .join(window.__adobe_cep__.getSystemPath("userData"), "Checkpoint")
        .replace(/^file\:\\/, "")
        .replace(/\\/gm, "/");
      const settingsFile = path
        .join(folder, "settings.json")
        .replace(/\\/gm, "/");
      if (exists(settingsFile)) return await deleteFile(settingsFile);
      else return false;
    },
    async saveSettings() {
      const folder = path
        .join(window.__adobe_cep__.getSystemPath("userData"), "Checkpoint")
        .replace(/^file\:\\/, "")
        .replace(/\\/gm, "/");
      return await writeFile(
        path.join(folder, "settings.json").replace(/\\/gm, "/"),
        JSON.stringify(this.$state, null, 4)
      );
    },
    async loadSettingsFromAppData() {
      let targFile = path
        .join(
          window.__adobe_cep__.getSystemPath("userData"),
          "Checkpoint",
          "settings.json"
        )
        .replace(/^file\:\\/, "")
        .replace(/\\/gm, "/");
      if (exists(targFile)) {
        let lastSettings = await readFile(targFile, false);
        this.$state = lastSettings;
      }
    },
    async verifyTempFolder() {
      let folder = path
        .join(window.__adobe_cep__.getSystemPath("userData"), "Checkpoint")
        .replace(/^file\:\\/, "")
        .replace(/\\/gm, "/");
      let settingsFile = path
        .join(folder, "settings.json")
        .replace(/\\/gm, "/");
      if (!exists(folder)) await makeFolder(folder);
      if (!exists(settingsFile)) await this.saveSettings();
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
      const rootFolder = path
        .join(window.__adobe_cep__.getSystemPath("userData"), "Checkpoint")
        .replace(/^file\:\\/, "")
        .replace(/\\/gm, "/");
      let targFile = path
        .join(
          window.__adobe_cep__.getSystemPath("userData"),
          "Checkpoint",
          "help.json"
        )
        .replace(/^file\:\\/, "")
        .replace(/\\/gm, "/");

      const pages = await this.getHelpPages();
      console.log(pages);
      try {
        let temp = JSON.parse(pages);
        console.log(temp);
      } catch (err) {
        console.log(pages);
        console.log(err);
      }
      if (exists(rootFolder) && pages) {
        return await writeFile(
          targFile,
          // @ts-ignore
          JSON.stringify(JSON.parse(pages), null, 4)
        );
      }
    },
  },
});
