<script setup lang="ts">

import { onMounted, onBeforeMount } from "vue";
import Panel from '../lib/components/panel.vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useSettings } from "../stores/settings";

const settings = useSettings()

onBeforeMount(async () => {
  await settings.init();
})

</script>

<template>
  <div class="app">
    <Panel>
      <router-view />
    </Panel>
  </div>
</template>

<style>
:root {
  --color-base: #413F4F;
  --color-blue: #8083FF;
  --color-green: #00ECB7;
  --color-alert: #f5bd00;
  --size-icon: 16px;
  --quad: cubic-bezier(0.48, 0.04, 0.52, 0.96);
  --quart: cubic-bezier(0.76, 0, 0.24, 1);
  --quint: cubic-bezier(.86, 0, .16, 1);
  --drawer-width: 200px;
  --size-footer: 42px;
  --size-toolbar: 30px;
}
</style>