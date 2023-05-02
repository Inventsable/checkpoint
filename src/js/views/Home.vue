<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { fs, os, path, child_process } from "../lib/utils/node";
import { csi, evalES, evalFile, openLinkInBrowser } from "../lib/utils/utils";
import { useSettings } from '../stores/settings';
import Button from '../lib/components/button.vue'

const settings = useSettings()
function openPopup() {
  csi.requestOpenExtension("com.hardhat.cep.settings", "")
}
function forcePopup() {
  openPopup()
  // setTimeout(() => {
  //   openPopup();
  // }, 100);
}

function refresh() {
  location.reload()
}
</script>

<template>
  <div class="home-content">
    <div class="preview">

    </div>

    <Button @click="forcePopup" label="OPEN POPUP" />
    <Button @click="refresh" label="REFRESH" />

  </div>
</template>

<style>
.preview {
  width: 100%;
  height: 160px;
  max-height: 240px;
  border: 2px solid red;
}

/* Slim */
@media screen and (max-width: 160px) {
  .current-key-container {
    padding: 0px;
    width: 100%;
  }

  .home-content {
    grid-template-rows: 1fr 3fr;
  }
}

/* Toolbar */
@media screen and (max-width: 90px) {
  .current-key-container {
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>