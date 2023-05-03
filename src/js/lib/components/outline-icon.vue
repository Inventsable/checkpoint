<script setup lang="ts">
import { useSettings } from '../../stores/settings';
const settings = useSettings();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20">
    <line id="outline" :style="{
      stroke: 'var(--outline-stroke-color)',
      strokeWidth: '3px'
      // strokeWidth: settings.anchor.style.width * (settings.options.scaleFactor / 100)
    }" y1="3" x1="10" y2="17" x2="10" />
  </svg>
</template>

<style scoped>
svg {
  max-width: 30px;
  margin-top: -2px;
}
</style>