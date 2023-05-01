import { createRouter, createWebHistory } from "vue-router";
import Panel from "../layouts/PanelLayout.vue";
import Modal from "../layouts/SettingsLayout.vue";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue";
import Help from "../views/Help.vue";
import Styles from "../views/Styles.vue";
import HelpPage from "../layouts/HelpLayout.vue";
import SettingsMain from "../views/Settings/Main.vue";
import SettingsToken from "../views/Settings/Tokens.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/main/index.html",
      name: "app",
      component: Panel,
      children: [
        {
          name: "home",
          path: "/main/index.html",
          component: Home,
        },
      ],
    },
    {
      path: "/settings",
      name: "settings",
      component: Modal,
      children: [
        {
          name: "config",
          path: "/settings/config",
          component: Settings,
          children: [
            {
              path: "/settings/config/main",
              component: SettingsMain,
            },
            {
              path: "/settings/config/tokens",
              component: SettingsToken,
            },
          ],
        },
        {
          name: "styles",
          path: "/settings/styles",
          component: Styles,
        },
        {
          name: "help",
          path: "/settings/help",
          component: Help,
          children: [
            {
              path: "/settings/help/:uuid",
              component: HelpPage,
            },
          ],
        },
      ],
    },
  ],
});

export default router;
