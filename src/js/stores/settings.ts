import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { ColorValue, DocumentDiagonostic, Config } from "../../shared/shared";
import { getVerbosePackage } from "../lib/utils/app";
// import path from "path";
// import { readFile, writeFile, makeFolder, exists } from "../lib/utils/fs";
const name = "settings";
const storage = window.localStorage;
const override = false;

export const useSettings = defineStore(name, {
  state: () =>
    ({
      anchor: {
        style: {
          width: 4,
          size: 10,
          color: {
            red: 255,
            green: 238,
            blue: 0,
          } as ColorValue,
          filled: true,
        },
        label: "_anchor",
      },
      handle: {
        style: {
          size: 10,
          label: "_handle",
          color: {
            red: 255,
            green: 238,
            blue: 0,
          } as ColorValue,
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
          color: {
            red: 255,
            green: 255,
            blue: 255,
          } as ColorValue,
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
        ignoreBackgrounds: true,
        warnForComplexArt: true,
        mergeClippingMasks: true,
        createAsCopy: true,
        copySuffix: " Outlines",
        ignoreCMYKColorAlerts: false,
        displayBG: {
          include: false,
          color: {
            red: 50,
            green: 50,
            blue: 50,
          } as ColorValue,
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
      // this.verifyTempFolder();
      let temp = storage.getItem(name);
      if (!override && temp) this.$state = JSON.parse(temp) as Config;
      else if (!temp) storage.setItem(name, JSON.stringify(this.$state));
      watch(
        this.$state,
        async (state) => {
          storage.setItem(name, JSON.stringify(state));
          // await this.saveSettings();
        },
        { deep: true }
      );
    },
    // async saveSettings() {
    //   const folder = path.join(
    //     window.__adobe_cep__.getSystemPath("userData"),
    //     "hardhat"
    //   );
    //   return await writeFile(
    //     path.join(folder, "settings.json"),
    //     JSON.stringify(this.$state)
    //   );
    // },
    // async loadSettingsFromAppData() {
    //   let targFile = path.join(
    //     window.__adobe_cep__.getSystemPath("userData"),
    //     "hardhat",
    //     "settings.json"
    //   );
    //   let lastSettings = await readFile(targFile, false);
    //   this.$state = lastSettings;
    // },
    // async verifyTempFolder() {
    //   let folder = path.join(
    //     window.__adobe_cep__.getSystemPath("userData"),
    //     "hardhat"
    //   );
    //   if (!exists(folder)) await makeFolder(folder);
    //   if (!exists(path.join(folder, "settings.json")))
    //     await this.saveSettings();
    // },
  },
});
