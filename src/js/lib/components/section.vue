<script setup lang="ts">
import { useSlots } from 'vue'
useSlots();

const props = defineProps<{
  label?: string;
  size?: string;
}>()

</script>

<template>
  <section class="section-wrapper">
    <div class="section-pseudo"></div>
    <label class="section-label" v-if="label" :style="{
      fontSize: size || '16px'
    }">{{ label }}</label>
    <div class="section-content">
      <slot />
    </div>
  </section>
</template>

<style>
.section-wrapper {
  position: relative;
}

.section-pseudo {
  box-sizing: border-box;
  border: 2px solid var(--color-btn-disabled);
  position: absolute;
  width: 100%;
  height: calc(100% - 12px);
  top: 12px;
  left: -4px;
  right: 3px;
  bottom: 0px;
  border-radius: .5ch;
  transform-origin: center;
  pointer-events: none;
  z-index: 0;
}

.section-pseudo:after {
  clip-path: polygon(0%, 0%, 50%, 50%, 100%, 100%)
}

.section-label {
  user-select: none;
  background-color: var(--color-bg);
  opacity: .8;
}

.section-content {
  padding: 6px 0px 4px 10px;
  box-sizing: border-box;
  width: calc(100% - 12px);
}

.section-wrapper:not(:last-child) {
  margin-bottom: 12px;
}

.section-wrapper *:not(:first-child) {
  /* padding-top: 4px; */
}
</style>