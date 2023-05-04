<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { fs, os, path, child_process } from "../lib/utils/node";
import { csi, evalES, evalFile, openLinkInBrowser } from "../lib/utils/utils";
import { useSettings } from '../stores/settings';

import Button from '../lib/components/button.vue'
import Preview from '../lib/components/preview.vue'
import Checkbox from '../lib/components/checkbox.vue'
import InputScroll from '../lib/components/input-scroll.vue'
import AnchorIcon from '../lib/components/anchor-icon.vue'
import StickIcon from '../lib/components/stick-icon.vue'
import OutlineIcon from '../lib/components/outline-icon.vue'
import ToolbarButton from '../lib/components/toolbar-button.vue'
import HandleIcon from '../lib/components/handle-icon.vue'
import ColorPicker from '../lib/components/color-picker.vue'
import { ColorValue, rgbColor, cmykColor } from "../../shared/shared";

const settings = useSettings()

const isAnchorFilled = ref(settings.anchor.style.filled);
watch(isAnchorFilled, (value) => {
  settings.anchor.style.filled = value;
})
const isHandleFilled = ref(settings.handle.style.filled);
watch(isHandleFilled, (value) => {
  settings.handle.style.filled = value;
})

const includeDisplayBG = ref(settings.options.displayBG.include);

const setCSS = (prop: string, data: string): void => {
  console.log(prop, data)
  document.documentElement.style.setProperty(
    prop, data
  );
}

const typeHovers = ref({
  handle: false,
  stick: false,
  anchor: false,
  outline: false
})

const typeSelected = computed<string>(() => {
  const hasSelection = Object.values(typeHovers.value).findIndex(i => i);
  console.log(hasSelection)
  if (hasSelection >= 0)
    return Object.entries(typeHovers.value)[hasSelection][0]
  else return "Type"
});

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
    set: (val) => settings.anchor.style.color = val
  }),
  handleColor = computed<ColorValue>({
    get: () => settings.handle.style.color,
    set: (val) => settings.handle.style.color = val
  }),
  displayBGColor = computed<ColorValue>({
    get: () => settings.options.displayBG.color,
    set: (val) => settings.options.displayBG.color = val
  }), displayScaleFactor = computed<number>({
    get: () => settings.options.scaleFactor,
    set: (val) => settings.options.scaleFactor = val
  })

function convertCMYKToRGB(cmyk: cmykColor): rgbColor {
  const { cyan, magenta, yellow, black } = cmyk as cmykColor;
  const red = Math.round(255 * (1 - cyan / 100) * (1 - black / 100));
  const green = Math.round(255 * (1 - magenta / 100) * (1 - black / 100));
  const blue = Math.round(255 * (1 - yellow / 100) * (1 - black / 100));
  return { red, green, blue } as rgbColor;
}

const CSSVars = [
  {
    path: "--anchor-stroke-color",
    value: anchorColor
  },
  {
    path: "--handle-stroke-color",
    value: handleColor
  },
  {
    path: "--outline-stroke-color",
    value: outlineColor
  },
]

CSSVars.forEach(cssVar => {
  watch(cssVar.value, (value: ColorValue) => {
    let temp = value;
    if (Object.keys(value).includes("cyan")) {
      // @ts-ignore
      temp = convertCMYKToRGB(value) as rgbColor;
    }
    // @ts-ignore
    setCSS(cssVar.path, `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }, { deep: true })
  // @ts-ignore
  setCSS(cssVar.path, `rgba(${cssVar.value.value.red}, ${cssVar.value.value.green}, ${cssVar.value.value.blue}, 1)`)
})

watch(displayBGColor, (value) => {
  if (settings.options.displayBG.include) {
    let temp = value;
    if (Object.keys(value).includes("cyan")) {
      // @ts-ignore
      temp = convertCMYKToRGB(value) as rgbColor;
    }
    // @ts-ignore
    setCSS('--display-bg', `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }

}, { deep: true })

watch(includeDisplayBG, (value) => {
  settings.options.displayBG.include = value;
  if (!value)
    setCSS('--display-bg', `transparent`)
  else {
    let temp = settings.options.displayBG.color;
    if (Object.keys(settings.options.displayBG.color).includes("cyan")) {
      // @ts-ignore
      temp = convertCMYKToRGB(settings.options.displayBG.color) as rgbColor;
    }
    // @ts-ignore
    setCSS('--display-bg', `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }
})
function loadDisplayBG() {
  const value = settings.options.displayBG.include;
  console.log(value);
  if (!value)
    setCSS('--display-bg', `transparent`)
  else {
    let temp = settings.options.displayBG.color;
    if (Object.keys(settings.options.displayBG.color).includes("cyan")) {
      // @ts-ignore
      temp = convertCMYKToRGB(settings.options.displayBG.color) as rgbColor;
    }
    // @ts-ignore
    setCSS('--display-bg', `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }
}

function forcePopup() {
  function openPopup() {
    csi.requestOpenExtension("com.hardhat.cep.settings", "")
  }
  openPopup()
  setTimeout(() => {
    openPopup();
  }, 1000);
}

function refresh() {
  setTimeout(() => {
    location.reload()
  }, 200);
}

onMounted(() => {
  loadDisplayBG();
})
</script>

<template>
  <div class="home-content">
    <div class="toolbar">
      <div class="toolbar-head">
        <InputScroll :min="1" :max="200" label="scale" v-model="displayScaleFactor" suffix="%"
          tooltip="Factor to adjust preview in large artwork" />
        <ColorPicker v-model="displayBGColor" />
        <Checkbox label="bg" v-model="includeDisplayBG" @update="val => includeDisplayBG = val" />

      </div>
      <div class="toolbar-tail">
        <ToolbarButton tooltip="Open Help Window" icon="help" icon-size="16px" @click="forcePopup" />
        <ToolbarButton tooltip="Refresh Extension" icon="refresh" icon-size="16px" @click="refresh" />
      </div>
    </div>
    <div class="preview">
      <Preview />
    </div>
    <div class="settings-bar">

      <div class="toolbar-header">
        <div class="toolbar-container">
          <span class="slim-anno">Type</span>
          <span class="wide-anno" style="max-width: 35px">{{ typeSelected }}</span>
          <span>Size</span>
          <span>Width</span>
          <span>Color</span>
          <span>Filled</span>
        </div>
      </div>

      <div class="toolbar-row">

        <div class="toolbar-indicator">
          <HandleIcon />
        </div>
        <div class="toolbar-container">
          <HandleIcon @mouseenter="typeHovers.handle = true" @mouseleave="typeHovers.handle = false" />
          <InputScroll :min="1" :max="100" v-model="handleSize" suffix="px" tooltip="Size of handle stroke in pixels" />

          <InputScroll :min="0" :max="100" v-model="handleWidth" suffix="px" tooltip="Size of handle stroke in pixels" />
          <ColorPicker v-model="handleColor" />
          <Checkbox v-model="isHandleFilled" @update="val => isHandleFilled = val" />
        </div>
      </div>
      <div class="toolbar-row">
        <div class="toolbar-indicator">
          <StickIcon />
        </div>
        <div class="toolbar-container">
          <StickIcon @mouseenter="typeHovers.stick = true" @mouseleave="typeHovers.stick = false" />
          <div class="placeholder"></div>
          <InputScroll :min="0" :max="100" v-model="stickWidth" suffix="px" tooltip="Size of handle stroke in pixels" />
          <div class="placeholder"></div>
          <div class="placeholder"></div>
        </div>
      </div>
      <div class="toolbar-row">
        <div class="toolbar-indicator">
          <AnchorIcon />
        </div>

        <div class="toolbar-container">
          <AnchorIcon @mouseenter="typeHovers.anchor = true" @mouseleave="typeHovers.anchor = false" />
          <InputScroll :min="1" :max="100" v-model="anchorSize" suffix="px" tooltip="Size of anchor stroke in pixels" />

          <InputScroll :min="0" :max="100" v-model="anchorWidth" suffix="px" tooltip="Size of anchor stroke in pixels" />
          <ColorPicker v-model="anchorColor" />
          <Checkbox v-model="isAnchorFilled" @update="val => isAnchorFilled = val" />
        </div>
      </div>
      <div class="toolbar-row">
        <div class="toolbar-indicator">

          <OutlineIcon />
        </div>

        <div class="toolbar-container">
          <OutlineIcon @mouseenter="typeHovers.outline = true" @mouseleave="typeHovers.outline = false" />
          <div class="placeholder"></div>
          <InputScroll :min="0" :max="100" v-model="outlineWidth" suffix="px" tooltip="Size of handle stroke in pixels" />
          <ColorPicker v-model="outlineColor" />
          <div class="placeholder"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --display-bg: transparent;
  --anchor-stroke-color: #FFEE00;
  --handle-stroke-color: #FFEE00;
  --stick-stroke-color: #FFEE00;
  --outline-stroke-color: #ffffffcc;
}

.home-content {}


.slim-anno {
  display: none;
}

.toolbar-indicator {
  display: none;
}

.toolbar {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  padding: 3px 12px;
  max-width: 300px;
  margin: auto;
}

.toolbar-tail {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}

.toolbar-head {
  display: flex;
  justify-content: center;
  align-items: first baseline;
  flex-wrap: nowrap;
}

.toolbar-head>* {
  padding: 0px 6px;
}

.toolbar-head>.color-picker-wrapper {
  margin-top: 3px;
}

.preview {
  overflow: hidden;
  box-sizing: border-box;
  margin-bottom: 10px;
  margin-top: 8px;
  /* border: 2px solid red; */
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  max-width: 300px;
  margin: auto;
  margin-top: 4px;
  background-color: var(--color-header);
  border-radius: 6px 6px 0px 0px;
  transition: border-radius 120ms var(--quint) 20ms;
  padding-top: 8px;
}

.lottie-container {
  /* border-radius: 30px; */
}

.preview-header {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border: 2px solid blue;
}

.preview-header-tail {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  border: 2px solid red;
}

.settings-bar {
  box-sizing: border-box;
  margin-top: 6px;
  padding: 3px 6px;
  background-color: var(--color-header);
  max-width: 300px;
  margin: auto;
  border-radius: 0px 0px 3px 3px;
  transition: border-radius 300ms var(--quint) 300ms;
}

.toolbar-header {
  padding: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: .25ch;
  font-size: 9px;
}

.toolbar-header span {
  user-select: none;
  padding-left: 0px;
  padding-right: 0px;
}

.placeholder {
  width: 100%;
  height: 100%;
}

.toolbar-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.toolbar-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;
  grid-gap: 2px;
  width: 100%;
}

.toolbar-container>* {
  /* padding: 0px 10px; */
  text-align: center;
}

/* .toolbar-container div:not(:first-child) {
  border-left: 1px solid red;
} */

.input-scroll-wrapper label:not(.suffix):not(.prefix) {
  padding-right: 2px;
}

.toolbar-row .checkbox-input-wrapper {
  margin-bottom: 3px;
}

/* Slim */
@media screen and (max-width: 249px) {
  .toolbar {
    padding: 3px;
  }

  .preview {
    border-radius: 6px 6px 0px 0px;
  }

  .slim-anno {
    display: inherit;
  }

  .wide-anno {
    display: none;
  }

  .toolbar-container>span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 1.75ch;
    letter-spacing: 1ch;
    padding: 2px 0px;
    text-align: center;
  }

  .toolbar-container>span:not(:first-child) {
    padding-left: 1ch;
  }

  .toolbar-container>*:not(span) {
    margin: 2px 0px;
    padding: 2px 0px;
  }

  .input-scroll-wrapper label,
  .input-scroll-content label,
  .checkbox-input-wrapper label {
    display: none;
  }
}

/* Toolbar */
@media screen and (max-width: 149px) {
  .toolbar {
    padding: 3px 0px 6px 0px;
  }

  .settings-bar {
    padding: 6px 0px;
    border-radius: 8px;
  }

  .toolbar-row {
    flex-direction: column;
  }

  .toolbar-row:not(:nth-child(3)):not(:nth-child(5)) {
    padding-bottom: 6px;
  }

  .toolbar-row:not(:nth-child(2)) {
    padding-top: 8px;
  }

  .toolbar-row:not(:nth-child(5)) {
    border-bottom: 3px solid var(--color-bg);
  }

  .toolbar-indicator {
    display: inherit;
  }

  .toolbar-head,
  .toolbar-header {
    display: none;
  }

  .toolbar-container {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding-left: 0px;
    padding-right: 0px;
  }





  .toolbar-container>* {
    box-sizing: border-box;
    max-height: 20px;
    margin-top: 0px;
    margin-bottom: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
    width: 49%;
    align-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toolbar-row:not(:nth-child(5)):not(:nth-child(3)) .toolbar-container {
    grid-template-rows: 1fr 1fr;
  }

  .toolbar-row:not(:nth-child(3)) .toolbar-container {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }

  .input-scroll-wrapper label,
  .input-scroll-content label,
  .checkbox-input-wrapper label {
    display: inherit;
  }

  .toolbar-container>svg,
  .checkbox-input-wrapper>label {
    display: none;
  }

  .preview,
  .placeholder {
    display: none;
  }
}

@media screen and (max-width: 121px) {
  .toolbar-container>* {
    width: 49%;
  }
}

@media screen and (max-width: 90px) {
  .toolbar-container {
    display: flex !important;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .toolbar-tail {
    width: 100%;
  }

  .toolbar-button-wrapper {
    width: 49%;
  }
}

@media screen and (max-width: 56px) {

  .settings-bar {
    border-radius: 0px;
  }

  .panel-content {
    margin-right: 0px;
    margin-left: 0px;
  }

  .toolbar {
    height: 48px;
  }

  .toolbar-tail {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .toolbar-button-wrapper {
    width: 100%;
  }

  .input-scroll-wrapper label,
  .input-scroll-content label,
  .checkbox-input-wrapper label {
    display: none;
  }
}
</style>