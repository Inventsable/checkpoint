<script setup lang="ts">
// @ts-nocheck
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue';
import { Tab } from './types'
const props = defineProps<{
  routes: any,
  disabled: boolean
}>()
const router = useRouter();
onMounted(() => {
  findActiveRoute()
  // watch(
  //   activeIndex,
  //   (i) => {
  //     // console.log(`Active change: ${i}`)
  //   },
  //   { deep: true }
  // );
})

function findActiveRoute() {
  let routeMatch = tabs.value.find(i => (i.name == router.currentRoute.value.name) || (i.path == router.currentRoute.value.path))
  if (routeMatch)
    activeItem.value = routeMatch;
}

function clickHandler(value: Tab): void {
  activeItem.value = value
}

let tabs = ref([]);
const tabElts = ref([])
const lineElts = ref([])
buildTabs();

const activeIndex = computed<number>(() => {
  let found = tabs.value.find(i => i.active);
  return found ? found.index : 0;
}),
  activeItem = computed<Tab>({
    get(): Tab {
      return tabs.value.length ? tabs.value.find((tab): Tab => tab.active) : {
        path: "null",
        name: "null",
        label: "null",
      }
    },
    set(value: Tab) {
      if (tabs.value.length) {
        tabs.value.forEach((v) => v.active = v == value);
        if (value.callback) {
          value.callback()
        } else if (value.path !== "null")
          router.push({
            path: value.path
          })
        else {
          console.log("No callback or path?", value)
        }
      } else {
        console.log("Couldn't set value?", value)
      }
    }
  })

function buildTabs(list = []) {
  // console.log("REBUILDING TABS");
  tabs.value = [];
  props.routes.forEach((route, i) => {
    let template = {
      index: i,
      hover: false,
      active: false
    } as Tab
    let clone = {};
    Object.assign(clone, template);
    Object.assign(clone, route);
    tabs.value.push(clone);
  })
  // console.log(tabs.value, tabs.value.length)
}

function getSliderPos() {
  // if (!activeItem.value) return null;
  // // let elt = this.$refs[`tab-${activeIndex.value}`][0];
  // let elt = tabElts[activeIndex.value];
  // console.log(elt)
  // let slider = this.$refs[`tab-${activeIndex.value}-line`][0];
  // let parent = this.$el;
  // if (elt) {
  //   let eltpos = elt.getBoundingClientRect(),
  //     sliderpos = slider.getBoundingClientRect(),
  //     parentpos = parent.getBoundingClientRect();
  //   this.underBreakpoint = this.breakpoint >= eltpos.width;
  //   this.slideTop = this.invert
  //     ? `${eltpos.top - sliderpos.top}px;`
  //     : `${eltpos.bottom - sliderpos.bottom}px;`;
  //   this.slideLeft = `${eltpos.left - parentpos.left}px;`;
  //   this.slideWidth = `${eltpos.width}px;`;
  // }
}
</script>

<template>
  <div class="tabs-wrapper" :class="{ disabled: props.disabled }" :style="{
    gridTemplateColumns: `repeat(${tabs.length}, 1fr)`
  }">
    <div class="active-line" />
    <div class="tab-wrapper" v-for="(tab, i) in tabs" :class="{
      active: tab.active,
      idle: !tab.active,
      disabled: tab.disabled
    }" :key="i" @click="clickHandler(tab)">
      <div class="tab-label" :class="{
        active: tab.active,
        disabled: tab.disabled
      }">
        <span>{{ tab.label }}</span>
      </div>
      <div class="tab-line" />
    </div>
  </div>
</template>

<style>
.tabs-wrapper {
  position: relative;
  display: grid;
  grid-gap: 0px;
  width: 100%;
  height: 30px;
  margin: 0px;
}

.tabs-wrapper.disabled {
  pointer-events: none;
  opacity: 1;
}

.tab-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.tab-label {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 2px);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2ch;
  transition: all 200ms var(--quad) 20ms;
}

.tab-label.active>span {
  color: var(--color-selection);
}


.tabs-wrapper.disabled .tab-active,
.tabs-wrapper.disabled .tab-idle {
  color: var(--tabs-idle);
}

.tab-active:not(.filled) {
  color: var(--color-selection);
}

.tab-idle {
  color: var(--tabs-idle);
}

.tab-idle.filled:not(.isGradient) {
  background-color: var(--color-header);
}

.tab-line {
  width: 100%;
  height: 2px;
  background: transparent;
  transition: all 200ms var(--quad) 20ms;
}

.tab-line.invert {
  order: -1;
}

.tab-line.disabled {
  opacity: 1;
}

.disabled>.tab-wrapper.active>.tab-line:not(.filled) {
  background: var(--tabs-idle);
}

.tab-wrapper.active>.tab-line:not(.filled) {
  background: var(--color-selection);
}

.tab-wrapper.active.isGradient>.tab-line {
  background: var(--color-default);
}

.tab-wrapper.idle.flat>.tab-line {
  background: var(--color-bg);
}

.tab-wrapper.idle:not(.tab-disabled):hover>.tab-line:not(.filled) {
  background: var(--tabs-idle-hover);
}

.tab-wrapper:not(.tab-disabled):hover>.tab-idle {
  color: var(--tabs-idle-hover);
}

.tab-wrapper.tab-disabled,
.tab-wrapper.tab-disabled:active {
  /* opacity: .7; */
  cursor: default;
}

[class^="active-line"] {
  position: absolute;
  height: 2px;
  background: var(--color-selection);
}

.tab-svg {
  max-height: 22px;
  max-width: 100%;
}

.tab-svg svg {
  width: 100%;
  height: 100%;
}
</style>