<script setup lang="ts">
//@ts-nocheck

import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useSlots, ref, computed, onMounted, watch, reactive } from 'vue';
import { Routes, Route, Tabs, Tab } from './types'
import { useHelp } from '../../stores/help';

const help = useHelp();
const props = defineProps<{
  pages: Routes,
}>()
const router = useRouter();
const pages = ref([]);
const activeItem = computed<Tab>({
  get(): Tab {
    // @ts-ignore
    return pages.value.find((tab): Tab => tab.active)
  },
  set(value: Tab) {
    // @ts-ignore
    pages.value.forEach((v) => v.active = v == value);
    router.push({
      path: value.path
    })
    help.activeIndex = value.index;
  }
})

watch(() => props.pages, (newVal) => {
  console.log("Prop changed")
  buildPages();
}, { deep: true })
onMounted(() => {
  findActiveRoute()
})

function clickHandler(value: Tab): void {
  activeItem.value = value
}

function findActiveRoute() {
  let currentRoute = router.currentRoute.value.path;
  // @ts-ignore
  let routeMatch = pages.value.find(i => i.path == currentRoute)
  if (routeMatch)
    activeItem.value = routeMatch;
}

buildPages()
function buildPages() {
  pages.value = [];
  props.pages.forEach((route, i) => {
    let template = {
      index: i,
      hover: false,
      active: false
    } as Tab
    let clone = {};
    Object.assign(clone, template);
    Object.assign(clone, route);
    // @ts-ignore
    pages.value.push(clone);
  })
}

</script>

<template>
  <div class="drawer-wrapper">
    <div class="drawer-item-wrapper" v-for="(page, i) in pages" :class="{
      active: page.active,
      idle: !page.active,
      disabled: page.disabled
    }" :key="i" @click="clickHandler(page)">
      <div class="drawer-item-label" :class="{
        active: page.active,
        disabled: page.disabled
      }">
        <span class="drawer-item-text">{{ page.label }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.drawer-wrapper {
  box-sizing: border-box;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: var(--drawer-width);
  height: calc(100% - var(--size-footer) - var(--size-toolbar));
  margin: 0px;
  background-color: var(--button-flat-hover);
  top: var(--size-toolbar);
  left: 0px;
}

.drawer-item-wrapper {
  display: flex;
  box-sizing: border-box;
  /* border: 2px solid red; */
  padding: 6px 12px;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  height: fit-content;
}

.drawer-item-label {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* height: 16px; */
  font-size: 10px;
  letter-spacing: 0.2ch;
  transition: all 200ms var(--quad) 20ms;
}

.drawer-item-label.active>span {
  color: var(--color-selection);
}

.drawer-item-wrapper.active {
  background-color: var(--button-flat-active-border);
}

.drawer-item-wrapper:not(.active):hover {
  background-color: var(--button-hover);
}

.drawer-item-wrapper:not(:last-child) {
  /* border-bottom: 2px solid var(--color-tooltip-border) */
}
</style>