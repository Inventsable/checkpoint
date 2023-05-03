import { createApp } from "vue";
import App from "./main.vue";
import { initBolt } from "../lib/utils/bolt";
import { createPinia } from "pinia";

import mdiVue from "mdi-vue/v3";
import * as mdijs from "@mdi/js";

// @ts-ignore
import VuePan from "../lib/utils/Vue-Pan-master";
// @ts-ignore
import router from "../router";

initBolt();

const pinia = createPinia();
const myApp = createApp(App);
myApp.use(router);
myApp.use(pinia);
myApp.use(mdiVue, {
  icons: mdijs,
});
myApp.directive("pan", VuePan);
myApp.mount("#root");
