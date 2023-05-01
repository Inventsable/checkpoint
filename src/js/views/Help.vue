<script setup lang="ts">

import Drawer from '../lib/components/drawer.vue'
import { useRouter } from 'vue-router'
import { useHelp } from '../stores/help';
const help = useHelp();
const router = useRouter();
console.log(help.routes)
</script>

<template>
  <div class="help-wrapper">
    <Drawer :pages="help.routes" />
    <router-view />
  </div>
</template>

<style>
:root {
  --menu-width: 200px;
}

.help-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  height: 100%;
  width: 100%;
}

.page-content {
  box-sizing: border-box;
  height: 100%;
  width: calc(100% - var(--menu-width));
}
</style>