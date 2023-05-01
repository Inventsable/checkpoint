import { createRouter, createWebHistory } from "vue-router";
import Panel from "../layouts/PanelLayout.vue";
import Modal from "../layouts/SettingsLayout.vue";
import Home from "../views/Home.vue";
import Help from "../views/Help.vue";
import Welcome from "../views/Welcome.vue";
import HelpPage from "../layouts/HelpLayout.vue";

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
          name: "main",
          path: "/settings/main",
          component: Welcome,
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
