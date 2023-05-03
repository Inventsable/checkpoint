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
import { ColorValue } from "../../shared/shared";

const settings = useSettings()

const isAnchorFilled = ref(settings.anchor.style.filled);
watch(isAnchorFilled, (value) => {
  settings.anchor.style.filled = value;
})
const isHandleFilled = ref(settings.handle.style.filled);
watch(isHandleFilled, (value) => {
  settings.handle.style.filled = value;
})

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
  })

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
  watch(cssVar.value, (value) => {
    setCSS(cssVar.path, `rgba(${value.red}, ${value.green}, ${value.blue}, 1)`)
  }, { deep: true })
  setCSS(cssVar.path, `rgba(${cssVar.value.value.red}, ${cssVar.value.value.green}, ${cssVar.value.value.blue}, 1)`)
})

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
</script>

<template>
  <div class="home-content">
    <div class="toolbar">
      <ToolbarButton tooltip="Open Help Window" icon="help" icon-size="16px" @click="forcePopup" />
      <ToolbarButton tooltip="Refresh Extension" icon="refresh" icon-size="16px" @click="refresh" />
    </div>
    <div class="preview">
      <Preview />
    </div>
    <div class="settings-bar">

      <div class="toolbar-header">
        <div class="toolbar-container">
          <span style="max-width: 35px">{{ typeSelected }}</span>
          <span>Size</span>
          <span>Width</span>
          <span>Color</span>
          <span>Filled</span>
        </div>
      </div>

      <div class="toolbar-row">
        <div class="toolbar-container">
          <HandleIcon @mouseenter="typeHovers.handle = true" @mouseleave="typeHovers.handle = false" />
          <InputScroll :min="1" :max="100" v-model="handleSize" suffix="px" tooltip="Size of handle stroke in pixels" />

          <InputScroll :min="0" :max="100" v-model="handleWidth" suffix="px" tooltip="Size of handle stroke in pixels" />
          <ColorPicker v-model="handleColor" />
          <Checkbox v-model="isHandleFilled" @update="val => isHandleFilled = val" />
        </div>
      </div>
      <div class="toolbar-row">
        <div class="toolbar-container">
          <StickIcon @mouseenter="typeHovers.stick = true" @mouseleave="typeHovers.stick = false" />
          <div></div>
          <InputScroll :min="0" :max="100" v-model="stickWidth" suffix="px" tooltip="Size of handle stroke in pixels" />
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="toolbar-row">
        <div class="toolbar-container">
          <AnchorIcon @mouseenter="typeHovers.anchor = true" @mouseleave="typeHovers.anchor = false" />
          <InputScroll :min="1" :max="100" v-model="anchorSize" suffix="px" tooltip="Size of anchor stroke in pixels" />

          <InputScroll :min="0" :max="100" v-model="anchorWidth" suffix="px" tooltip="Size of anchor stroke in pixels" />
          <ColorPicker v-model="anchorColor" />
          <Checkbox v-model="isAnchorFilled" @update="val => isAnchorFilled = val" />
        </div>
      </div>
      <div class="toolbar-row">
        <div class="toolbar-container">
          <OutlineIcon @mouseenter="typeHovers.outline = true" @mouseleave="typeHovers.outline = false" />
          <div></div>
          <InputScroll :min="0" :max="100" v-model="outlineWidth" suffix="px" tooltip="Size of handle stroke in pixels" />
          <ColorPicker v-model="outlineColor" />
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --anchor-stroke-color: #FFEE00;
  --handle-stroke-color: #FFEE00;
  --stick-stroke-color: #FFEE00;
  --outline-stroke-color: #ffffffcc;
}

.toolbar {
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  padding-right: 12px;
}

.preview {
  width: 100%;
  max-height: 160px;
  margin-bottom: 10px;
  /* border: 2px solid red; */
}

.settings-bar {
  margin-top: 6px;
  padding: 3px 6px;
  background-color: var(--color-header);
  max-width: 300px;
  margin: auto;
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
  padding: 0px 10px;
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
@media screen and (max-width: 160px) {
  .current-key-container {
    padding: 0px;
    width: 100%;
  }

  .home-content {
    grid-template-rows: 1fr 3fr;
  }
}

/* Toolbar */
@media screen and (max-width: 90px) {
  .current-key-container {
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>