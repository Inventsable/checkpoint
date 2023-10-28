import buttonVue from "./js/lib/components/button.vue";

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    buttonVue: typeof buttonVue;
  }
}
