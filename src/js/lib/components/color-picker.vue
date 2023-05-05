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
  },
  disabled: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String,
    default: ""
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

const colorModel = computed<string>(() => {
  if (Object.keys(value.value).includes("cyan"))
    return 'CMYK'
  else if (Object.keys(value.value).includes("hue"))
    return 'HSL'
  else if (Object.keys(value.value).includes("red"))
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
  return props.disabled ? "Color picker is disabled when BG is not checked" : cannotDisplay.value ? `Cannot display ${colorModel.value} accurately in UI but will assign correctly` : props.tooltip
})

function convertCMYKToRGB(cmyk: cmykColor): rgbColor {
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
  console.log(value.value)
}

</script>

<template>
  <div class="color-picker-wrapper" :class="{ disabled }" :title="contextualTooltip" :style="{
      maxWidth: `calc(${props.size}px + .3em)`,
      maxHeight: `calc(${props.size}px + .3em)`,
    }">
    <div class="color-picker-container" :style="{
        backgroundColor: `rgba(${simulatedColor.red}, ${simulatedColor.green}, ${simulatedColor.blue}, 1)`,
        width: `${props.size}px`,
        height: `${props.size}px`,
      }" @click="openColorPicker" />
    <svg xmlns="http://www.w3.org/2000/svg" class="color-picker-slash" :width="props.size" :height="props.size"
      :viewBox="`0 0 ${props.size} ${props.size}`" :style="{
          opacity: 0.2
        }">
      <line :style="{
          stroke: 'var(--color-default)',
          strokeWidth: '.15em',
          left: props.size / 2
        }" x1="0" :y1="props.size" :x2="props.size" y2="0" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="`0 0 24 24`" class="alert" v-if="cannotDisplay" :style="{
        bottom: -1,
        right: 0,
        margin: 0,
        padding: 0,
        width: `${props.size}`,
        height: `${props.size}`,
      }">
      <polygon points="23.5 22 1.5 22 12.5 3 23.5 22" :style="{
          fill: `var(--color-alert)`,
          stroke: `black`
        }" />
      <path :style="{
          fill: `black`
        }" d="M13,16.5v2H11v-2Zm-2-7v5h2v-5Z" transform="translate(0.5 0.5)" />
    </svg>
  </div>
</template>

<style>
.color-picker-wrapper>svg {
  pointer-events: none;
}

.color-picker-wrapper {
  box-sizing: border-box;
  width: fit-content;
  margin: auto;
  margin-bottom: 0px;
  margin-top: 0px;
  overflow: hidden;
  position: relative;
  padding: 0px !important;
}

.color-picker-slash {
  position: absolute;
  top: 0;
}

.color-picker-wrapper:not(.disabled)>.color-picker-slash {
  display: none;
}

.color-picker-wrapper.disabled {
  opacity: 0.7
}

.color-picker-container {
  box-sizing: border-box;
  border: .15em solid var(--color-default);
  border-radius: 2px;
  cursor: pointer;
}

.color-picker-wrapper.disabled>.color-picker-container {
  pointer-events: none;
  background: var(--color-bg) !important;
}

.color-picker-wrapper>.alert {
  position: absolute;
  opacity: 0.75
}
</style>