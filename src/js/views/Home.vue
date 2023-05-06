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
import HandleIcon from '../lib/components/handle-icon.vue'
import ColorPicker from '../lib/components/color-picker.vue'
import Toolbar from '../lib/components/groups/toolbar.vue'
import { ColorValue, rgbColor, cmykColor } from "../../shared/shared";
import {
  setCSS, convertCMYKToRGB
} from "../lib/utils/app";
const fakeColor = ref({
  red: 50,
  blue: 50,
  green: 50
})

const settings = useSettings()

const isAnchorFilled = ref(settings.anchor.style.filled);
watch(isAnchorFilled, (value) => {
  settings.anchor.style.filled = value;
})
const isHandleFilled = ref(settings.handle.style.filled);
watch(isHandleFilled, (value) => {
  settings.handle.style.filled = value;
})

const typeHovers = ref({
  handle: false,
  stick: false,
  anchor: false,
  outline: false
})

const typeSelected = computed<string>(() => {
  const hasSelection = Object.values(typeHovers.value).findIndex(i => i);
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
    set: (val) => {
      console.log(val);
      settings.handle.style.color = val
    }
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

  watch(cssVar.value, (value: ColorValue) => {
    const isCMYK = (Object.keys(cssVar.value.value).includes("cyan"))
    let temp = (!isCMYK ? value : convertCMYKToRGB(value as cmykColor)) as rgbColor;
    setCSS(cssVar.path, `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }, { deep: true })
  const isCMYK = (Object.keys(cssVar.value.value).includes("cyan"))
  let temp = (!isCMYK ? cssVar.value.value : convertCMYKToRGB(cssVar.value.value as cmykColor)) as rgbColor;
  setCSS(cssVar.path, `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
})

</script>

<template>
  <div class="home-content">
    <Toolbar />
    <div class="preview">
      <Preview />
    </div>
    <div class="settings-bar">

      <div class="table-header">
        <div class="table-container">
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
          <HandleIcon />
        </div>
        <div class="table-container">
          <HandleIcon @mouseenter="typeHovers.handle = true" @mouseleave="typeHovers.handle = false" />
          <InputScroll :min="1" :max="100" v-model="handleSize" suffix="px" tooltip="Size of handle width/height in px" />
          <InputScroll :min="0" :max="100" v-model="handleWidth" suffix="px" tooltip="Size of handle stroke in px" />
          <ColorPicker v-model="handleColor" :title="`Handle stroke ${isHandleFilled ? 'and fill ' : ''}color`"
            :fill="isHandleFilled" />
          <Checkbox v-model="isHandleFilled" @update="val => isHandleFilled = val" title="Add fill to handle" />
        </div>
      </div>
      <div class="table-row">
        <div class="row-indicator" title="Stick">
          <StickIcon />
        </div>
        <div class="table-container">
          <StickIcon @mouseenter="typeHovers.stick = true" @mouseleave="typeHovers.stick = false" />
          <div class="placeholder" />
          <InputScroll :min="0" :max="100" v-model="stickWidth" suffix="px" tooltip="Size of stick stroke in px" />
          <ColorPicker v-model="handleColor" :disabled="true" class="fake-color" override-alerts
            title="Stick strokes inherit handle color above" :fill="false" />
          <div class="placeholder" />
        </div>
      </div>
      <div class="table-row">
        <div class="row-indicator" title="Anchor">
          <AnchorIcon />
        </div>

        <div class="table-container">
          <AnchorIcon @mouseenter="typeHovers.anchor = true" @mouseleave="typeHovers.anchor = false" />
          <InputScroll :min="1" :max="100" v-model="anchorSize" suffix="px" tooltip="Size of anchor width/height in px" />
          <InputScroll :min="0" :max="100" v-model="anchorWidth" suffix="px" tooltip="Size of anchor stroke in px" />
          <ColorPicker v-model="anchorColor" :title="`Anchor stroke ${isAnchorFilled ? 'and fill ' : ''}color`"
            :fill="isAnchorFilled" />
          <Checkbox v-model="isAnchorFilled" @update="val => isAnchorFilled = val" title="Add fill to anchor" />
        </div>
      </div>
      <div class="table-row">
        <div class="row-indicator" title="Outline">
          <OutlineIcon />
        </div>
        <div class="table-container">
          <OutlineIcon @mouseenter="typeHovers.outline = true" @mouseleave="typeHovers.outline = false" />
          <div class="placeholder" />
          <InputScroll :min="0" :max="100" v-model="outlineWidth" suffix="px" tooltip="Size of outline stroke in px" />
          <ColorPicker v-model="outlineColor" title="Outline stroke color" :fill="false" />
          <div class="placeholder" />
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

.slim-anno {
  display: none;
}

.row-indicator {
  display: none;
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

.table-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;
  grid-gap: 2px;
  width: 100%;
}

.table-container>* {
  /* padding: 0px 10px; */
  text-align: center;
}

/* .table-container div:not(:first-child) {
  border-left: 1px solid red;
} */

.input-scroll-wrapper label:not(.suffix):not(.prefix) {
  padding-right: 2px;
}

.table-row .checkbox-input-wrapper {
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

  .table-container>span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 1.75ch;
    letter-spacing: 1ch;
    padding: 2px 0px;
    text-align: center;
  }

  .table-container>span:not(:first-child) {
    padding-left: 1ch;
  }

  .table-container>*:not(span) {
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
  .fake-color {
    display: none !important;
  }

  .toolbar {
    padding: 3px 0px 6px 0px;
  }

  .settings-bar {
    padding: 6px 0px;
    border-radius: 8px;
  }

  .table-row {
    flex-direction: column;
  }

  .table-row:not(:nth-child(3)):not(:nth-child(5)) {
    padding-bottom: 6px;
  }

  .table-row:not(:nth-child(2)) {
    padding-top: 8px;
  }

  .table-row:not(:nth-child(5)) {
    border-bottom: 3px solid var(--color-bg);
  }

  .row-indicator {
    display: inherit;
  }

  .toolbar-head,
  .table-header {
    display: none;
  }

  .table-container {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding-left: 0px;
    padding-right: 0px;
  }

  .table-container>* {
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

  .table-row:not(:nth-child(5)):not(:nth-child(3)) .table-container {
    grid-template-rows: 1fr 1fr;
  }

  .table-row:not(:nth-child(3)) .table-container {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }

  .input-scroll-wrapper label,
  .input-scroll-content label,
  .checkbox-input-wrapper label {
    display: inherit;
  }

  .table-container>svg,
  .checkbox-input-wrapper>label {
    display: none;
  }

  .preview,
  .placeholder {
    display: none;
  }
}

@media screen and (max-width: 121px) {
  .table-container>* {
    width: 49%;
  }
}

@media screen and (max-width: 90px) {
  .table-container {
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

  .table-container {
    flex-direction: column;
  }

  .table-container>* {
    margin-bottom: 6px !important;
    margin-top: 0px !important;
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