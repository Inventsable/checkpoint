<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useHelp } from "../stores/help";
import { useSettings } from '../stores/settings';
import Button from '../lib/components/button.vue'
import Tabs from '../lib/components/tabs.vue'
import {
  csi,
} from "../lib/utils/utils";
import "../index.scss";
import { onMounted } from 'vue';

const help = useHelp(), router = useRouter(), settings = useSettings();

const routes = [
  {
    path: "/settings/main",
    name: "main",
    label: "Welcome",
  },
  {
    name: "help",
    label: "Help",
    callback: function () {
      router.push({
        path: `/settings/help/${help.pages[0].uuid}`
      })
    }
  },
]
const saveAndClose = (): void => {
  settings.saveSettings();
  // dispatch(core.events.settings.saved);
  closeExtension();
}
const closeExtension = (): void => {
  // dispatch(core.events.settings.closed);
  csi.closeExtension();
}
</script>

<template>
  <div class="settings-view">
    <div class="settings-toolbar">
      <Tabs :routes="routes" :disabled="false" />
    </div>
    <div class="settings-content">
      <router-view />
    </div>
    <div class="settings-footer">
      <div class="settings-footer-btns">
        <Button label="Cancel" width="64px" @click="closeExtension" />
        <Button label="OK" width="48px" @click="saveAndClose" />
      </div>
    </div>
  </div>
</template>
  

<style>
.settings-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
}

.settings-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  /* border: 2px solid red; */
  height: var(--size-toolbar);
  background-color: var(--color-header);
}

.settings-content {
  box-sizing: border-box;
  position: relative;
  margin-top: var(--size-toolbar);
  margin-bottom: var(--size-footer);
  height: calc(100vh - var(--size-footer) - var(--size-toolbar));
  overflow-y: auto;
  overflow-x: hidden;
}

.settings-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: var(--size-footer);
  display: flex;
  justify-content: flex-end;
}

.settings-footer-btns {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0px 12px;
  box-sizing: border-box;
  width: 150px;
}
</style>