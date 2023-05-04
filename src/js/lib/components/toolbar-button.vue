<script setup lang="ts">

import { useSlots } from 'vue';
const emit = defineEmits<{
  (e: "click"): void;
  (e: "mouseenter"): void;
  (e: "mouseout"): void;
}>();
const props = defineProps<{
  icon?: string,
  iconSize?: string,
  width?: string | Number,
  disabled?: Boolean,
  tooltip?: string
}>()
const slots = useSlots();
</script>

<template>
  <div :title="props.tooltip" class="toolbar-button-wrapper" :class="{ disabled: disabled }" @click="emit('click')"
    @mouseenter="emit('mouseenter')" @mouseleave="emit('mouseout')">
    <div class="toolbar-button-contents" v-if="icon">
      <mdicon :name="icon || 'alert'" class="toolbar-icon" :size="iconSize || '16px'" />
    </div>
    <div class="toolbar-button-content" v-else>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin: 0px 0px;
  padding: 0px;
  border: 2px solid transparent;
  background-color: transparent;
  border-radius: 2px;
  user-select: none;
  height: fit-content;
  cursor: pointer;
  transition: background-color 30ms var(--quint) 0ms,
    border-color 30ms var(--quint) 0ms,
    filter 130ms var(--quad) 0ms;
  filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.75));
}

.toolbar-button-wrapper.disabled {
  pointer-events: none;
  color: var(--color-btn-disabled-text)
}

.toolbar-button-wrapper:hover {
  background-color: var(--color-btn-pill-border);
  color: var(--color-bg);
  filter: drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.75));
}

.toolbar-button-wrapper:active {
  background-color: var(--color-selection);
  filter: drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.75));
  border-color: var(--color-selection);
  color: var(--color-btn-pill-border);
  cursor: pointer;
}

.toolbar-button-content {
  text-align: center;
  cursor: pointer;
}

// .row-content {
//   .toolbar-button-wrapper:nth-child(1) {
//     margin-right: 10px;
//   }
// }

// @media screen and (max-width: 52px) {
//   .toolbar-button-wrapper {
//     width: 100%;
//     display: flex;
//     justify-content: center;
//   }

// }
</style>
