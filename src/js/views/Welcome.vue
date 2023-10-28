<script setup lang="ts">
import Drawer from '../lib/components/drawer.vue'
import discordIcon from '../lib/components/discord-icon.vue';
</script>

<template>
  <div class="settings-wrapper">
    <discordIcon></discordIcon>
  </div>
</template>

<style>
.settings-page-content {
  padding: 0px 16px;
  position: absolute;
  box-sizing: border-box;
  left: var(--drawer-width);
  height: 100%;
  top: 0px;
  width: calc(100% - var(--drawer-width));
  overflow-y: auto;
}
</style>