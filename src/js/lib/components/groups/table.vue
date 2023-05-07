<script setup lang="ts">
import { onMounted, ref, computed, watch, Ref } from "vue";
import { ColorValue, rgbColor, cmykColor, ColorPackage } from "../../../../shared/shared";
import {
  setCSS, convertCMYKToRGB
} from "../../utils/app";
import { useSettings } from '../../../stores/settings'
import Checkbox from '../checkbox.vue'
import InputScroll from '../input-scroll.vue'
import AnchorIcon from '../anchor-icon.vue'
import StickIcon from '../stick-icon.vue'
import OutlineIcon from '../outline-icon.vue'
import HandleIcon from '../handle-icon.vue'
import ColorPicker from '../color-picker.vue'

const settings = useSettings()

// Used for giving context menus to lefthand icons on mouse hover:
const typeHovers = ref({
  handle: false,
  stick: false,
  anchor: false,
  outline: false
}), typeSelected = computed<string>(() => {
  const hasSelection = Object.values(typeHovers.value).findIndex(i => i);
  if (hasSelection >= 0)
    return Object.entries(typeHovers.value)[hasSelection][0]
  else return "Type"
});

// Required Pinia states:
const anchorWidth = computed<number>({
  get: () => settings.anchor.style.width,
  set: (val) => settings.anchor.style.width = val
}),
  anchorSize = computed<number>({
    get: () => settings.anchor.style.size,
    set: (val) => settings.anchor.style.size = val
  }),
  handleWidth = computed<number>({
    get: () => settings.handle.style.width,
    set: (val) => settings.handle.style.width = val
  }),
  handleSize = computed<number>({
    get: () => settings.handle.style.size,
    set: (val) => settings.handle.style.size = val
  }),
  stickWidth = computed<number>({
    get: () => settings.stick.style.width,
    set: (val) => settings.stick.style.width = val
  }),
  outlineWidth = computed<number>({
    get: () => settings.outline.style.width,
    set: (val) => settings.outline.style.width = val
  }),
  outlineColor = computed<ColorValue>({
    get: () => settings.outline.style.color,
    set: (val) => settings.outline.style.color = val
  }),
  anchorColor = computed<ColorValue>({
    get: () => settings.anchor.style.color,
    set: (val: ColorValue) => settings.anchor.style.color = val
  }),
  handleColor = computed<ColorValue>({
    get: () => settings.handle.style.color,
    set: (val) => settings.handle.style.color = val
  }),
  isHandleFilled = computed<boolean>({
    get: (): boolean => settings.handle.style.filled,
    set: (val: boolean) => settings.handle.style.filled = val
  }),
  isAnchorFilled = computed<boolean>({
    get: (): boolean => settings.anchor.style.filled,
    set: (val: boolean) => settings.anchor.style.filled = val
  });

// Used to sync fill states and color between all components regardless of color model
const watchAndSetCSSToggleFillColor = (watchedValue: Ref, CSSPath: string, colorValue: Ref): void => {
  watch(watchedValue, (value) => {
    if (value) {
      const isCMYK = (Object.keys(colorValue.value).includes("cyan"))
      let temp = (!isCMYK ? colorValue.value : convertCMYKToRGB(colorValue.value as cmykColor)) as rgbColor;
      setCSS(CSSPath, `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
    } else setCSS(CSSPath, `transparent`)
  })
  if (watchedValue.value) {
    const isCMYK = (Object.keys(colorValue.value).includes("cyan"))
    let temp = (!isCMYK ? colorValue.value : convertCMYKToRGB(colorValue.value as cmykColor)) as rgbColor;
    setCSS(CSSPath, `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  } else setCSS(CSSPath, `transparent`)
}
watchAndSetCSSToggleFillColor(isHandleFilled, '--handle-fill-color', handleColor)
watchAndSetCSSToggleFillColor(isAnchorFilled, '--anchor-fill-color', anchorColor)

// 
interface CSSVar {
  path: string,
  value: Ref,
  options?: {
    path: string;
    enabled: Ref
  }
}
const CSSVars = [
  {
    path: "--anchor-stroke-color",
    value: anchorColor,
    options: {
      path: "--anchor-fill-color",
      enabled: isAnchorFilled
    }
  },
  {
    path: "--handle-stroke-color",
    value: handleColor,
    options: {
      path: "--handle-fill-color",
      enabled: isHandleFilled
    }
  },
  {
    path: "--outline-stroke-color",
    value: outlineColor
  },
]

// Used to sync stroke colors between all components regardless of color model
const watchStrokeColor = (cssVar: CSSVar): void => {
  watch(cssVar.value, (value: ColorValue) => {
    const isCMYK = (Object.keys(cssVar.value.value).includes("cyan"))
    let temp = (!isCMYK ? value : convertCMYKToRGB(value as cmykColor)) as rgbColor;
    setCSS(cssVar.path, `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
    if (cssVar.options?.enabled)
      setCSS(cssVar.options.path, `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }, { deep: true })
  const isCMYK = (Object.keys(cssVar.value.value).includes("cyan"))
  let temp = (!isCMYK ? cssVar.value.value : convertCMYKToRGB(cssVar.value.value as cmykColor)) as rgbColor;
  setCSS(cssVar.path, `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
}
CSSVars.forEach((cssVar: CSSVar): void => watchStrokeColor(cssVar))

function printVerboseData(data: ColorPackage) {
  console.log(data)
}
</script>

<template>
  <div class="table-wrapper">
    <div class="table-header">
      <div class="table-row-wrapper">
        <span class="slim-anno">Type</span>
        <span class="wide-anno" style="max-width: 35px">{{ typeSelected }}</span>
        <span>Size</span>
        <span>Width</span>
        <span>Color</span>
        <span>Filled</span>
      </div>
    </div>
    <div class="table-row">
      <div class="row-indicator" title="Handle">
        <HandleIcon /> <!-- Only used in Slim breakpoints to avoid flexbox grouping with siblings -->
      </div>
      <div class="table-row-wrapper">
        <HandleIcon @mouseenter="typeHovers.handle = true" @mouseleave="typeHovers.handle = false" />
        <InputScroll :min="1" :max="100" v-model="handleSize" suffix="px" tooltip="Size of handle width/height in px" />
        <InputScroll :min="0" :max="100" v-model="handleWidth" suffix="px" tooltip="Size of handle stroke in px" />
        <ColorPicker v-model="handleColor" :title="`Handle stroke ${isHandleFilled ? 'and fill ' : ''}color`"
          :fill="isHandleFilled" @updateVerbose="printVerboseData" />
        <Checkbox v-model="isHandleFilled" title="Add fill to handle" />
      </div>
    </div>
    <div class="table-row">
      <div class="row-indicator" title="Stick">
        <StickIcon /> <!-- Only used in Slim breakpoints to avoid flexbox grouping with siblings -->
      </div>
      <div class="table-row-wrapper">
        <StickIcon @mouseenter="typeHovers.stick = true" @mouseleave="typeHovers.stick = false" />
        <div class="placeholder" />
        <InputScroll :min="0" :max="100" v-model="stickWidth" suffix="px" tooltip="Size of stick stroke in px" />
        <ColorPicker v-model="handleColor" :disabled="true" class="fake-color" override-alerts
          title="This stroke inherits handle color above" :fill="false" show-disabled-color />
        <div class="placeholder" />
      </div>
    </div>
    <div class="table-row">
      <div class="row-indicator" title="Anchor">
        <AnchorIcon /> <!-- Only used in Slim breakpoints to avoid flexbox grouping with siblings -->
      </div>

      <div class="table-row-wrapper">
        <AnchorIcon @mouseenter="typeHovers.anchor = true" @mouseleave="typeHovers.anchor = false" />
        <InputScroll :min="1" :max="100" v-model="anchorSize" suffix="px" tooltip="Size of anchor width/height in px" />
        <InputScroll :min="0" :max="100" v-model="anchorWidth" suffix="px" tooltip="Size of anchor stroke in px" />
        <ColorPicker v-model="anchorColor" :title="`Anchor stroke ${isAnchorFilled ? 'and fill ' : ''}color`"
          :fill="isAnchorFilled" />
        <Checkbox v-model="isAnchorFilled" title="Add fill to anchor" />
      </div>
    </div>
    <div class="table-row">
      <div class="row-indicator" title="Outline">
        <OutlineIcon /> <!-- Only used in Slim breakpoints to avoid flexbox grouping with siblings -->
      </div>
      <div class="table-row-wrapper">
        <OutlineIcon @mouseenter="typeHovers.outline = true" @mouseleave="typeHovers.outline = false" />
        <div class="placeholder" />
        <InputScroll :min="0" :max="100" v-model="outlineWidth" suffix="px" tooltip="Size of outline stroke in px" />
        <ColorPicker v-model="outlineColor" title="Outline stroke color" :fill="false" />
        <div class="placeholder" />
      </div>
    </div>
  </div>
</template>

<style>
.slim-anno {
  display: none;
}

.row-indicator {
  display: none;
}

.table-wrapper {
  box-sizing: border-box;
  margin-top: 6px;
  padding: 3px 6px;
  background-color: var(--color-header);
  max-width: 300px;
  margin: auto;
  border-radius: 0px 0px 3px 3px;
  transition: border-radius 300ms var(--quint) 300ms;
}

.table-header {
  padding: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: .25ch;
  font-size: 9px;
}

.table-header span {
  user-select: none;
  padding-left: 0px;
  padding-right: 0px;
}

.placeholder {
  width: 100%;
  height: 100%;
}

.table-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.table-row-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;
  grid-gap: 2px;
  width: 100%;
}

.table-row-wrapper>* {
  /* padding: 0px 10px; */
  text-align: center;
}

/* .table-row-wrapper div:not(:first-child) {
  border-left: 1px solid red;
} */

.input-scroll-wrapper label:not(.suffix):not(.prefix) {
  padding-right: 2px;
}

.table-row .checkbox-input-wrapper {
  margin-bottom: 3px;
}
</style>