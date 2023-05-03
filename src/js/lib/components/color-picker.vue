<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { evalTS, evalES } from '../utils/bolt';
const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  label: {
    type: String,
    default: 'Default label'
  },
  size: {
    type: Number,
    default: 14
  }
})
const value = ref({
  red: 255,
  green: 238,
  blue: 0
})
async function openColorPicker() {
  console.log("Open color picker:")
  let result = evalES(``)
  console.log(result);
}

</script>

<template>
  <div class="color-picker-wrapper">
    <div class="color-picker-container" :style="{
      backgroundColor: `rgba(${value.red}, ${value.green}, ${value.blue}, 1)`,
      width: `${props.size}px`,
      height: `${props.size}px`
    }" @click="openColorPicker" />
  </div>
</template>

<style>
.color-picker-wrapper {
  padding: 3px;
  width: fit-content;
  margin: auto;
}

.color-picker-container {
  box-sizing: border-box;
  border: 1px solid var(--color-default);
  border-radius: 2px;
  cursor: pointer;
}
</style>