<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { evalES } from '../utils/utils';
import type { ColorValue, rgbColor, cmykColor } from '../../../shared/shared';
const props = defineProps({
  modelValue: {
    type: Object as () => ColorValue,
    default: {
      red: 50,
      green: 50,
      blue: 50
    } as rgbColor,
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

const emit = defineEmits<{
  (e: 'update:modelValue', value: ColorValue): void
  (e: 'update', value: ColorValue): void
}>()

const value = computed({
  get(): ColorValue {
    return props.modelValue || { red: 50, green: 50, blue: 50 };
  },
  set(val: ColorValue): void {
    emit("update:modelValue", val);
  }
})

const simulatedColor = computed<rgbColor>(() => {
  if (Object.keys(value.value).includes("cyan"))
    return convertCMYKToRGB(value.value as cmykColor) as rgbColor
  else return value.value as rgbColor
})

function convertCMYKToRGB(cmyk: cmykColor) : rgbColor {
  const { cyan, magenta, yellow, black } = cmyk as cmykColor;
  const red = Math.round(255 * (1 - cyan / 100) * (1 - black / 100));
  const green = Math.round(255 * (1 - magenta / 100) * (1 - black / 100));
  const blue = Math.round(255 * (1 - yellow / 100) * (1 - black / 100));
  return { red, green, blue } as rgbColor
}

async function openColorPicker() {
  const result = JSON.parse(await evalES(`getColorFromPicker('${JSON.stringify(value.value)}')`)) as ColorValue
  delete result.typename;
  const isSame = JSON.stringify(result) == JSON.stringify(value.value);
  if (isSame)
    return null;
  value.value = result;
}

</script>

<template>
  <div class="color-picker-wrapper">
    <div class="color-picker-container" :style="{
      backgroundColor: `rgba(${simulatedColor.red}, ${simulatedColor.green}, ${simulatedColor.blue}, 1)`,
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