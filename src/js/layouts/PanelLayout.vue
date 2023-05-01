<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSettings } from "../stores/settings";
import "../index.scss";

const settings = useSettings();

function refresh() {
  location.reload()
}

</script>

<template>
  <div class="panel-content">
    <router-view />
  </div>
</template>

<style>
.panel-content {
  box-sizing: border-box;
  margin: calc(var(--size-icon) + 6px) 6px 6px 6px;
  height: calc(100vh - var(--size-icon) + 6px)
}


/* Slim */
@media screen and (max-width: 160px) {
  .panel-content {
    overflow-y: hidden;
    height: calc(100vh - 72px);
    margin: 70px 0px 0px 0px;
  }

  .panel,
  .panel-content,
  .home-content {
    overflow-x: hidden;
  }
}

/* Toolbar */
@media screen and (max-width: 90px) {
  .panel-content {
    margin: 70px 0px 0px 0px;
    height: calc(100vh - 72px);
  }
}
</style>