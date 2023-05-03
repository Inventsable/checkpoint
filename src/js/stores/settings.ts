/**
 * - Need UI scale factor, all numeric inputs should be calculated against it
 * - Should have an "Ignore background" checkbox to prevent outlining rects with artboard dimensions
 * - Need to figure out how to retrieve checkbox values from Lottie
 * - Animation "right" is a bit too fast, hardly can tell it's animated
 * - Create basic demo site with Lottie outlines of Pear and Mango, credit original artist
 */

import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
// import path from "path";
// import { readFile, writeFile, makeFolder, exists } from "../lib/utils/fs";
const name = "settings";
const storage = window.localStorage;
const override = false;

export const useSettings = defineStore(name, {
  state: () => ({
    anchor: {
      style: {
        width: 4,
        size: 10,
        color: "#ff0000",
        filled: false,
      },
      label: "_anchor",
    },
    handle: {
      style: {
        size: 10,
        label: "_handle",
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
        color: "#231f20",
      },
    },
    options: {
      userLayerLabelColor: false,
      overrideComplex: false,
      forceOpacity: true,
      renameGenericPaths: true,
      generateIds: false,
      groupRelated: true,
      scaleFactor: 100,
    },
  }),
  getters: {
    // conversionSchema(state) {
    //   return {
    //     template: state.converter.template,
    //     title: state.converter.title,
    //   };
    // }
  },
  actions: {
    async init() {
      // this.verifyTempFolder();
      let temp = storage.getItem(name);
      if (!override && temp) this.$state = JSON.parse(temp);
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
