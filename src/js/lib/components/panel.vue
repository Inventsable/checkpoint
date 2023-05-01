<script setup lang="ts">
import { initializeTheme } from "../utils/theme-manager";
import { onMounted, useSlots } from "vue";
import {
  csi,
  evalES,
  evalFile,
} from "../utils/utils";
import { fs, os, path } from "../cep/node";
import "../../index.scss";
const props = defineProps<{
  debug?: Boolean
}>()
onMounted(() => {
  if (window.cep) {
    initializeTheme();
    const extRoot = csi.getSystemPath("extension");
    const jsxSrc = `${extRoot}/jsx/index.js`;
    const jsxBinSrc = `${extRoot}/jsx/index.jsxbin`;
    if (fs.existsSync(jsxSrc)) {
      evalFile(jsxSrc);
    } else if (fs.existsSync(jsxBinSrc)) {
      evalFile(jsxBinSrc);
    }
  }
});
const slots = useSlots();
</script>

<template>
  <div className="panel">
    <slot />
  </div>
</template>

<style scoped>
.panel {
  height: 100vh;
  overflow-y: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 30px;
  font-size: 12px;
}
</style>
