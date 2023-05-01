import { createApp } from "vue";
import App from "./main.vue";
import { initBolt } from "../lib/utils/bolt";
import { createPinia } from "pinia";
// @ts-ignore
import router from "../router";

initBolt();

const pinia = createPinia();
const myApp = createApp(App);
myApp.use(router);
myApp.use(pinia);
myApp.mount("#root");
