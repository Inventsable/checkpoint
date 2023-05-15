import { watch } from "vue";
import { defineStore } from "pinia";
const storage = window.localStorage;
import extPackage from "../../../package.json";

import path from "path";
import {
  readFile,
  writeFile,
  makeFolder,
  exists,
  deleteFile,
} from "../lib/utils/fs";
const name = "core";

export const useCore = defineStore(name, {
  state: () => ({
    version: {
      live: "0.0.0",
      real: extPackage.version,
    },
    name: extPackage.name,
    homepage: extPackage.homepage,
  }),
  getters: {
    isOutdated(state) {
      return (
        Number(state.version.live.replace(".", "")) >
        Number(state.version.real.replace(".", ""))
      );
    },
  },
  actions: {
    async init() {
      let temp = storage.getItem(name);
      if (!temp) storage.setItem(name, JSON.stringify(this.$state));
      watch(
        this.$state,
        (state) => storage.setItem(name, JSON.stringify(state)),
        { deep: true }
      );
      try {
        let data = await this.getLiveVersion();
        this.assignVersionData(JSON.parse(data));
      } catch (err) {
        if (temp) this.$state = JSON.parse(temp);
        console.error("Something went wrong in version assignment");
      }
    },
    assignVersionData(data: any) {
      const temp =
        data[
          extPackage.name.charAt(0).toUpperCase() + extPackage.name.slice(1)
        ];
      this.version.live = temp.version;
    },
    async getLiveVersion() {
      const data = await fetch(
        "https://raw.githubusercontent.com/Inventsable/version-manager/master/index.json"
      ).catch((err) => {
        console.error(err);
      });
      // @ts-ignore
      return data.text();
    },
  },
});
