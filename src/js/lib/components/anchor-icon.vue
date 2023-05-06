<script setup lang="ts">
import { useSettings } from '../../stores/settings';
const settings = useSettings();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20">
    <rect :style="{
      fill: 'var(--anchor-fill-color)',
      stroke: 'var(--anchor-stroke-color)',
      strokeWidth: '3px',
      transition: `fill 140ms var(--quart) 0ms,
    opacity 200ms var(--quint) 20ms`
    }" x="5" y="5" width="10" height="10" />
  </svg>
</template>

<style scoped>
svg {
  max-width: 30px;
  max-height: 30px;
  margin-top: -2px;
}
</style>