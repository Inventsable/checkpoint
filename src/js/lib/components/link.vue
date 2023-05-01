<script setup lang="ts">
import { useSlots } from 'vue'
import { openLinkInBrowser } from '../utils/utils';

const slots = useSlots();
const props = defineProps<{
  url: string;
  size: string;
}>()

const openLink = () => {
  openLinkInBrowser(props.url);
}

</script>

<template>
  <a class="link-text" @click="openLink">
    <slot />
  </a>
</template>

<style>
.link-text {
  cursor: pointer;
  color: red;
}
</style>