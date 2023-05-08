<script setup lang="ts">
import ToolbarButton from '../toolbar-button.vue'
import InputScroll from '../input-scroll.vue';
import Checkbox from '../checkbox.vue';
import ColorPicker from '../color-picker.vue';
import { useSettings } from '../../../stores/settings';
import { onMounted, ref, computed, watch } from "vue";
import { ColorValue, cmykColor, rgbColor } from '../../../../shared/shared';
import { csi } from '../../utils/utils';
import {
  setCSS, convertCMYKToRGB
} from '../../utils/app';

const settings = useSettings()

// const includeDisplayBG = ref(settings.options.displayBG.include);

const includeDisplayBG = computed<boolean>({
  get: () => settings.options.displayBG.include,
  set: (val) => settings.options.displayBG.include = val
}), displayBGColor = computed<ColorValue>({
  get: () => settings.options.displayBG.color,
  set: (val) => settings.options.displayBG.color = val
}), displayScaleFactor = computed<number>({
  get: () => settings.options.scaleFactor,
  set: (val) => settings.options.scaleFactor = val
})
watch(displayBGColor, (value) => {
  const isCMYK = (Object.keys(displayBGColor.value).includes("cyan"))
  if (settings.options.displayBG.include) {
    let temp = (!isCMYK ? value : convertCMYKToRGB(value as cmykColor)) as rgbColor;
    setCSS('--display-bg', `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }
}, { deep: true })
watch(includeDisplayBG, (value) => {
  settings.options.displayBG.include = value;
  if (!value)
    setCSS('--display-bg', `transparent`)
  else {
    let temp = settings.options.displayBG.color as ColorValue;
    if (Object.keys(settings.options.displayBG.color).includes("cyan")) {
      temp = convertCMYKToRGB(settings.options.displayBG.color as cmykColor) as rgbColor;
    }
    // @ts-ignore
    setCSS('--display-bg', `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }
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

function loadDisplayBG() {
  const value = settings.options.displayBG.include;
  if (!value)
    setCSS('--display-bg', `transparent`)
  else {
    let temp = settings.options.displayBG.color as ColorValue;
    if (Object.keys(settings.options.displayBG.color).includes("cyan")) {
      temp = convertCMYKToRGB(settings.options.displayBG.color as cmykColor) as rgbColor;
    }
    // @ts-ignore
    setCSS('--display-bg', `rgba(${temp.red}, ${temp.green}, ${temp.blue}, 1)`)
  }
}

onMounted(() => {
  loadDisplayBG();
})
</script>

<template>
  <div class="toolbar">
    <div class="toolbar-head">
      <InputScroll :min="10" :max="250" label="scale" v-model="displayScaleFactor" suffix="%"
        tooltip="Factor to adjust preview in large artwork" />
      <ColorPicker v-model="displayBGColor" :disabled="!includeDisplayBG" />
      <Checkbox label="bg" tooltip="Simulate BG color of display to prevent app theme conflicts"
        v-model="includeDisplayBG" />

    </div>
    <div class="toolbar-tail">
      <ToolbarButton tooltip="Open Help Window" icon="help" icon-size="16px" @click="forcePopup" />
      <ToolbarButton tooltip="Refresh Extension" icon="refresh" icon-size="16px" @click="refresh" />
    </div>
  </div>
</template>

<style>
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
  align-items: center;
  flex-wrap: nowrap;
}

.toolbar-head>* {
  margin: 0px 6px;
}

.toolbar-head>.color-picker-wrapper {
  margin-bottom: 0;
}

.toolbar-head>.checkbox-input-wrapper {
  margin-top: 0px;
  margin-bottom: 0px;
}

.toolbar-head>.input-scroll-wrapper {
  margin-top: 3px;
}
</style>