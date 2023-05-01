import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import path from "path";
import { readFile, writeFile, makeFolder, exists } from "../lib/utils/fs";
const name = "settings";
const storage = window.localStorage;
const override = false;

export const useSettings = defineStore(name, {
  state: () => ({
    anchor: {
      style: {
        width: 4,
        size: 20,
        color: "#ff0000",
      },
      label: "_anchor",
    },
    handle: {
      size: 25,
      label: "_handle",
    },
    stick: {
      label: "_stick",
    },
    outline: {
      width: 5,
      color: "#231f20",
    },
    options: {
      userLayerLabelColor: false,
      anchorIsFilled: false,
      overrideComplex: false,
      forceOpacity: true,
      renameGenericPaths: true,
      generateIds: false,
      groupRelated: true,
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
      // const core = useCore();
      // if (core.isPopup) return await this.alternateInit();
      this.verifyTempFolder();
      let temp = storage.getItem(name);
      if (!override && temp) this.$state = JSON.parse(temp);
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
    async saveSettings() {
      const folder = path.join(
        window.__adobe_cep__.getSystemPath("userData"),
        "hardhat"
      );
      return await writeFile(
        path.join(folder, "settings.json"),
        JSON.stringify(this.$state)
      );
    },
    async loadSettingsFromAppData() {
      let targFile = path.join(
        window.__adobe_cep__.getSystemPath("userData"),
        "hardhat",
        "settings.json"
      );
      let lastSettings = await readFile(targFile, false);
      this.$state = lastSettings;
    },
    async verifyTempFolder() {
      let folder = path.join(
        window.__adobe_cep__.getSystemPath("userData"),
        "hardhat"
      );
      if (!exists(folder)) await makeFolder(folder);
      if (!exists(path.join(folder, "settings.json")))
        await this.saveSettings();
    },
  },
});
