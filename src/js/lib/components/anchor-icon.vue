<script setup lang="ts">
import { useSettings } from '../../stores/settings';
const settings = useSettings();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20">
    <rect id="anchor" :style="{
      fill: settings.anchor.style.filled ? 'var(--anchor-stroke-color)' : 'transparent',
      stroke: 'var(--anchor-stroke-color)',
      strokeWidth: '3px'
      // strokeWidth: settings.anchor.style.width * (settings.options.scaleFactor / 100)
    }" x="5" y="5" width="10" height="10" />
  </svg>
</template>

<style scoped>
svg {
  max-width: 30px;
  margin-top: -2px;
}
</style>