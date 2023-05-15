<script setup lang="ts">
import { computed, ref, watch, useSlots, onMounted } from 'vue';
import { ns } from '../shared/shared';
import { csi } from '../utils/bolt';
import { getPackage } from '../utils/getVersion';
import { useCore } from '../../stores/core';

const core = useCore()

const version = ref(core.version.real)
const props = defineProps<{
  open?: boolean,
  label: string
}>()

const isMounted = ref(false)
const isOpen = ref(props.open || false);
const elt = ref<HTMLDivElement | null>(null), mainElt = ref<HTMLDivElement | null>(null), labelElt = ref<HTMLDivElement | null>(null)
const contentHeight = ref(0), mainPanelHeight = ref(0), labelHeight = ref(0);
const pseudoHeight = ref(0);

onMounted(async () => {
  mainElt.value = (document.querySelector('.main') as HTMLDivElement)
  labelHeight.value = (labelElt.value as HTMLDivElement).getBoundingClientRect().height
  contentHeight.value = (elt.value as HTMLDivElement).children[0].getBoundingClientRect().height + 8;
  getMainPanelHeight();
  setTimeout(() => {
    isMounted.value = true;
  }, 500);
})

function getMainPanelHeight() {
  mainPanelHeight.value = (mainElt.value as HTMLDivElement).getBoundingClientRect().height + labelHeight.value + 30;
  pseudoHeight.value = window.innerHeight - mainPanelHeight.value
}

window.addEventListener('resize', () => {
  getMainPanelHeight();
})

watch(isOpen, () => {
  if (isOpen.value) setTimeout(() => (elt.value as HTMLDivElement).style.overflowY = 'auto', 460);
  else (elt.value as HTMLDivElement).style.overflowY = 'hidden';
})
</script>

<template>
  <div class="fold-wrapper">
    <div ref="labelElt" class="fold-label" @click="isOpen = !isOpen">
      <div class="fold-label-text">
        {{ label }}
      </div>
      <div class="fold-icon" :class="{ flip: !isOpen }">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </div>
    </div>
    <div class="fold-content" ref="elt" :style="{
        height: isOpen ? `${pseudoHeight < contentHeight ? pseudoHeight : contentHeight}px` : '0px',
        paddingBottom: isOpen ? '5px' : '0px'
      }">
      <slot />
    </div>
    <div class="footer" :class="{
        outdated: core.isOutdated
      }" :style="{
      opacity: isMounted ? 0.35 : 0
    }">
      <div class="footer-number">
        {{ version }}
      </div>
      <div class="footer-indicator" v-if="core.isOutdated" :title="`Version ${core.version.live} is available`">
        <mdicon name="alert" class="toolbar-icon" size="12px" />
      </div>
    </div>
  </div>
</template>

<style>
.fold-wrapper {
  border-top: solid var(--fold-border-width) var(--fold-border);
  width: 100%;
  cursor: default;
  padding-bottom: 0;
  margin-top: 4px;
  margin-bottom: 0 !important;
  cursor: default;
  user-select: none;
}

.fold-content>.fold-wrapper {
  width: calc(100% - 10px);
  padding-left: 10px;
}

.fold-label {
  padding: 6px 0;
  display: flex;
  flex-wrap: none;
  justify-content: space-between;
}

.fold-label-text {
  text-transform: uppercase;
  letter-spacing: 0.25ch;
  user-select: none;
}

.fold-icon {
  float: right;
  margin-top: -2px;
  fill: var(--color-icon);
  height: 18px;
  transform-origin: 50% 50%;
  transition: all 240ms var(--quint) 20ms;
}

.fold-icon.flip {
  transform: rotate(-90deg);
}

.fold-content {
  box-sizing: border-box;
  padding-bottom: 8px;
  transition: height 420ms var(--quart) 20ms;
  overflow: hidden;
  border-bottom: solid var(--fold-border-width) var(--fold-border);
  /* margin-right: 12px; */
}

.footer {
  max-width: 300px;
  margin: auto;
  padding-left: 4px;
  margin-top: 3px;
  margin-bottom: 0px;
  letter-spacing: 1ch;
  font-size: 8px;
  /* opacity: 0.35; */
  display: flex;
  flex-wrap: nowrap;
  transition: opacity 160ms var(--quint) 20ms;
}

.footer.outdated * {
  color: var(--color-alert)
}
</style>