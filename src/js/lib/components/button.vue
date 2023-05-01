<script setup lang="ts">

import { useSlots } from 'vue';
const emit = defineEmits<{
  (e: "click"): void;
}>();
const props = defineProps<{
  label?: string,
  width?: string
}>()
const slots = useSlots();
</script>

<template>
  <div className="button-wrapper" @click="emit('click')" :style="{
    width: props.width
  }">
    <div class="button-contents" v-if="label">
      {{ label }}
    </div>
    <div class="button-content" v-else>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-wrapper {
  box-sizing: border-box;
  margin: 6px 0px;
  padding: 4px 10px;
  border: 2.2px solid var(--color-btn-pill-border);
  background-color: transparent;
  border-radius: 20px;
  user-select: none;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 30ms var(--quint) 0ms,
    border-color 30ms var(--quint) 0ms,
    filter 130ms var(--quad) 0ms;
  filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.75));
}

.button-wrapper:hover {
  background-color: var(--color-btn-pill-border);
  color: var(--color-bg);
  filter: drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.75));
}

.button-wrapper:active {
  background-color: var(--color-btn-active);
  filter: drop-shadow(4px 6px 4px rgba(0, 0, 0, 0.75));
  border-color: var(--color-btn-active);
  color: var(--color-btn-pill-border);
  cursor: pointer;
}

.button-content {
  text-align: center;
}

.row-content {
  .button-wrapper:nth-child(1) {
    margin-right: 10px;
  }
}
</style>
