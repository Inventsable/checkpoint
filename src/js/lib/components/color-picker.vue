<script setup lang="ts">
import { computed } from 'vue'
import { evalES } from '../utils/utils';
import type { ColorValue, rgbColor, cmykColor, ColorPackage } from '../../../shared/shared';

import { getVerbosePackage, convertCMYKToRGB } from '../utils/app';

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
    default: 20
  },
  disabled: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String,
    default: ""
  },
  fill: {
    type: Boolean,
    default: true
  },
  overrideAlerts: {
    type: Boolean,
    default: false
  },
  showDisabledColor: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ColorValue): void
  (e: 'update', value: ColorValue): void
  (e: 'updateVerbose', value: ColorPackage): void
}>()

const value = computed({
  get(): ColorValue {
    return props.modelValue || { red: 50, green: 50, blue: 50 };
  },
  set(val: ColorValue): void {
    emit('update:modelValue', val);
    emit('updateVerbose', getVerbosePackage(val, colorModel.value))
  }
})

const colorModel = computed<string>(() => {
  if (Object.keys(value.value).includes('cyan'))
    return 'CMYK'
  else if (Object.keys(value.value).includes('hue'))
    return 'HSB'
  else if (Object.keys(value.value).includes('red'))
    return 'RGB'
  else return 'UNKNOWN'
})

const simulatedColor = computed<rgbColor>(() => {
  if (colorModel.value == 'CMYK')
    return convertCMYKToRGB(value.value as cmykColor) as rgbColor
  else return value.value as rgbColor
})

const cannotDisplay = computed<boolean>(() => {
  return colorModel.value == 'CMYK'
})

const contextualTooltip = computed<string>(() => {
  if (props.disabled) return 'Color picker is disabled when BG is not checked';
  if (colorModel.value == 'CMYK')`Cannot display ${colorModel.value} but will assign correctly when run`
  return props.tooltip
})

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
  <div class="color-picker-wrapper" :class="{ disabled }" :title="contextualTooltip" :style="{
    maxHeight: `${props.size}px`,
    maxWidth: `${props.size}px`
  }">
    <svg xmlns="http://www.w3.org/2000/svg" class="color-picker-content" :width="props.size" :height="props.size"
      :viewBox="`0 0 24 24`" @click="openColorPicker">
      <path class="color-picker-stroke-indicator" d="M4,4V20H20V4ZM16,16H8V8h8Z" :style="{
        fill: props.disabled && !props.showDisabledColor ? `transparent` : `rgb(${simulatedColor.red}, ${simulatedColor.green}, ${simulatedColor.blue})`,
      }" />
      <rect class="color-picker-fill-indicator" x="7" y="7" width="10" height="10" :style="{
        fill: props.disabled && !props.showDisabledColor ? `transparent` : `rgb(${simulatedColor.red}, ${simulatedColor.green}, ${simulatedColor.blue})`,
        opacity: props.fill ? 1 : 0
      }" />
      <path class="color-picker-slash" d="M21.93,3.48,3.48,21.93a2,2,0,0,1-1.41-1.41L20.52,2.07A2,2,0,0,1,21.93,3.48Z"
        :style="{
          fill: 'red',
          opacity: props.disabled ? 1 : 0
        }" />
      <path class="color-picker-border"
        d="M21.93,3.48a2,2,0,0,0-1.41-1.41A1.77,1.77,0,0,0,20,2H4A2,2,0,0,0,2,4V20a1.77,1.77,0,0,0,.07.52,2,2,0,0,0,1.41,1.41A1.77,1.77,0,0,0,4,22H20a2,2,0,0,0,2-2V4A1.77,1.77,0,0,0,21.93,3.48ZM20,20H4V4H20Z" />
      <g class="alert" :style="{
        opacity: (cannotDisplay && !props.overrideAlerts) ? .75 : 0
      }">
        <path style="fill: #f5bd00"
          d="M3.94,21.5a1.39,1.39,0,0,1-1.22-.71,1.42,1.42,0,0,1,0-1.41L10.78,5.46a1.41,1.41,0,0,1,2.44,0l8.06,13.92a1.42,1.42,0,0,1-1.22,2.12Z" />
        <path style="fill: black"
          d="M12,5.26a.88.88,0,0,1,.79.46l8.06,13.91A.92.92,0,0,1,20.06,21H3.94a.92.92,0,0,1-.79-1.37L11.21,5.72A.88.88,0,0,1,12,5.26m0-1a1.92,1.92,0,0,0-1.66,1l-8,13.92A1.91,1.91,0,0,0,3.94,22H20.06a1.91,1.91,0,0,0,1.65-2.87l-8-13.92a1.92,1.92,0,0,0-1.66-1Z" />
        <path style="fill: black" d="M13.08,16.58v2.17H10.92V16.58ZM10.92,9v5.41h2.16V9Z" />
      </g>
    </svg>
  </div>
</template>

<style>
.color-picker-border {
  fill: black;
}

.color-picker-fill,
.color-picker-fill-indicator,
.color-picker-stroke-indicator {
  transition: fill 140ms var(--quart) 0ms,
    opacity 200ms var(--quint) 20ms
}

.color-picker-alert,
.color-picker-slash {
  transition: opacity 200ms var(--quint) 20ms;
}

.color-picker-wrapper {
  box-sizing: border-box;
  width: fit-content;
  overflow: hidden;
  position: relative;
  padding: 0px !important;
  margin: 0px !important;
}

.color-picker-wrapper:not(.disabled) svg {
  cursor: pointer;
}

.color-picker-wrapper.disabled {
  cursor: not-allowed;
}

.color-picker-wrapper.disabled svg {
  pointer-events: none;
}
</style>