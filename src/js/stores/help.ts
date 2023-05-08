import { watch } from "vue";
import { defineStore } from "pinia";
const storage = window.localStorage;
import path from "path";
import {
  readFile,
  writeFile,
  makeFolder,
  exists,
  deleteFile,
} from "../lib/utils/fs";
const name = "help";

interface Page {
  index: number;
  title: string;
  content: string;
  uuid: string;
}
type Pages = Page[];
interface HelpDate {
  short: string;
  long: string;
  time: string;
}
interface HelpDocs {
  pages: Pages;
  timestamp: number;
  date: HelpDate;
  name: string;
}

export const useHelp = defineStore(name, {
  state: () => ({
    pages: [] as Pages,
    timestamp: null,
    date: {} as HelpDate,
    target: {
      name: "key-minion",
      prefix:
        "https://raw.githubusercontent.com/Inventsable/minion-pages/master/results/",
      suffix: ".json",
    },
    activeIndex: 0,
  }),
  getters: {
    URL(state) {
      return `${state.target.prefix}${state.target.name}${state.target.suffix}`;
    },
    routes(state) {
      return state.pages.map((page) => {
        return {
          path: `/settings/help/${page.uuid}`,
          name: page.title,
          label: page.title,
          disabled: false,
        };
      });
    },
    firstUUID(state) {
      return state.pages[0].uuid || null;
    },
    hasHelp(state) {
      return state.pages.length;
    },
    tabs(state) {
      if (this.hasHelp)
        return [
          {
            path: "/settings/config",
            name: "config",
            label: "Settings",
          },
          {
            path: "/settings/styles",
            name: "styles",
            label: "Styles",
          },
          {
            name: "help",
            label: "Help",
            path: `/help/${state.pages[0].uuid}`,
          },
        ];
      else
        return [
          {
            path: "/settings/config",
            name: "config",
            label: "Settings",
          },
          {
            path: "/settings/styles",
            name: "styles",
            label: "Styles",
          },
          {
            name: "help",
            label: "Help",
            path: `/settings/help/`,
          },
        ];
    },
  },
  actions: {
    async init() {
      let temp = storage.getItem(name);
      // if (!override && temp) this.$state = JSON.parse(temp);
      if (!temp) storage.setItem(name, JSON.stringify(this.$state));
      this.activeIndex = 0;
      watch(
        this.$state,
        (state) => storage.setItem(name, JSON.stringify(state)),
        { deep: true }
      );
      try {
        let data = await this.loadHelpPages();
        console.log(data);
        this.assignHelpData(data as HelpDocs);
      } catch (err) {
        if (temp) this.$state = JSON.parse(temp);
        console.error("Something went wrong in help assignment");
      }
    },
    getPageByUUID(uuid: string): Page {
      // @ts-ignore
      return this.pages.find((page) => page.uuid == uuid);
    },
    assignHelpData(data: HelpDocs) {
      if (this.target.name != data.name) {
        console.error(
          `Mismatch on help docs, ${this.target.name} !== ${data.name}`
        );
        return null;
      }
      this.pages = data.pages;
      // @ts-ignore
      this.timestamp = data.timestamp;
      this.date = data.date;
    },
    async loadHelpPages() {
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
      if (exists(rootFolder) && exists(targFile)) {
        return await readFile(targFile, false);
      } else {
        console.log("HELP PAGES COULD NOT BE LOADED...");
      }
    },
  },
});
