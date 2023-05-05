<script setup lang="ts">
import { nextTick, ref, reactive, watch, computed } from 'vue';

interface Coordinate {
  x: number;
  y: number;
}
interface Position {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface PanEvent {
  delta: Coordinate;
  direction: string;
  distance: Coordinate;
  duration: number;
  evt: MouseEvent;
  isFinal: boolean;
  isFirst: boolean;
  mouse: boolean;
  offset: Coordinate;
  position: Position;
  touch: boolean;
}

const props = defineProps<{
  modelValue: number;
  fontSize?: string;
  label?: string;
  autoSelect?: boolean;
  placeholder?: number;
  min?: number;
  max?: number;
  suffix?: string;
  prefix?: string;
  tooltip?: string;
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'update', value: number): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const hasFocus = ref(false),
  lastDelta = ref(0),
  isPanning = ref(false),
  realStep = ref(1);

const uuid = generateQuickGuid();
function generateQuickGuid(): string {
  return (
    Math.random().toString(36).substring(2, 4) +
    Math.random().toString(36).substring(2, 4)
  );
}
const focusEvt = (evt: FocusEvent) => {
  if (props.autoSelect)
    nextTick(() => {
      if ((evt.target as HTMLInputElement).select) (evt.target as HTMLInputElement).select();
    });
  emit('focus')
}

const panHandle = (evt: PanEvent, step?: number): void | null => {
  if (evt.isFirst) {
    hasFocus.value = true;
  }
  hasFocus.value = isPanning.value = !evt.isFinal;
  if (!hasFocus.value) {
    blur();
    lastDelta.value = evt.offset.x / 2;
    return null;
  }
  let offsetx = evt.offset.x / 2;
  if (lastDelta.value == offsetx) return null;

  let delta = offsetx > lastDelta.value ? 1 : -1;
  increment(delta);
  lastDelta.value = offsetx;
  if (evt.isFinal) {
    hasFocus.value = false;
    emit("update", value.value)
  }
}

const value = computed({
  get(): number {
    return props.modelValue;
  },
  set(val: number): void {
    emit("update:modelValue", val);
  }
})

const increment = (delta: number): void => {
  let amount = delta * realStep.value;
  value.value = clamp(value.value + amount);
}

const validateInput = (event: Event) => {
  let temp = (event.target as HTMLInputElement).value;
  if (!temp || !(event.target as HTMLInputElement).innerText)
    value.value = clamp(Number(temp || 0));
}

const clamp = (result: number): number => {
  if (!(props.min + "").length && !(props.max + "").length)
    return result;
  result =
    (props.min || props.min == 0) && +result < props.min ? props.min : result;
  result =
    (props.max || props.max == 0) && result > props.max ? props.max : result;
  return result;
}

const checkBlur = (event: FocusEvent) => {
  validateInput(event)
  hasFocus.value = false;
  emit('blur');
}
</script>

<template>
  <div class="input-scroll-wrapper" v-pan.prevent.mouse="panHandle" :title="tooltip">
    <label v-if="label" :for="uuid" v-pan.prevent.mouse="panHandle">{{ label }}</label>
    <div class="input-scroll-content" :class="{ focused: hasFocus }" :style="{
      padding: `${(!props.label || !props.label.length) ? '2px 4px' : '2px'}`,
    }">
      <label class="prefix" v-if="prefix" :for="uuid" v-pan.prevent.mouse="panHandle">{{ prefix }}</label>
      <input type="number" :class="{ focused: hasFocus }" v-pan.prevent.mouse="panHandle" :style="{
          fontSize: fontSize || '13px',
          width: `${(value + '').split('').length}ch`,
        }" :value="value" @input="validateInput" @blur="checkBlur" @focus="hasFocus = true"
        :placeholder="(placeholder || value).toString()" />
      <label class="suffix" v-if="suffix" :for="uuid" v-pan.prevent.mouse="panHandle">{{ suffix }}</label>
    </div>
  </div>
</template>

<style>
.input-scroll-wrapper {
  font-family: "Open Sans", sans-serif;
  cursor: ew-resize;
  user-select: none;
  width: fit-content;
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  margin-bottom: 4px;
}

.input-scroll-wrapper *:not(input),
.input-scroll-wrapper label:active {
  cursor: ew-resize;
}

.input-scroll-content {
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap;
  border-color: transparent;
  border-style: solid;
  border-width: 2px;
}

.input-scroll-wrapper input[type="number"] {
  outline: 0;
  background-color: transparent;
  border: 0px solid transparent;
  color: var(--color-default);
  width: fit-content;
  max-width: 6ch;
  margin: 0;
  padding: 0;
}

.input-scroll-wrapper label.prefix {
  padding-right: 2px;
}

.input-scroll-wrapper label.suffix {
  padding-left: 2px;
}

.input-scroll-wrapper label+input {
  margin-top: 4px;
  margin-left: 4px;
}

.input-scroll-wrapper label {
  opacity: .8
}

.input-scroll-wrapper label:not(.suffix):not(.prefix) {
  padding-right: 1ch;
}

.input-scroll-wrapper:hover .input-scroll-content:not(.focused) {
  border-color: transparent transparent var(--color-default) transparent;
}

.input-scroll-content.focused {
  color: var(--color-selection);
  border-color: transparent transparent var(--color-selection) transparent;
}

.input-scroll-wrapper input[type="number"].focused {
  color: var(--color-selection);
}

.input-scroll-wrapper input[type="number"]::-webkit-outer-spin-button,
.input-scroll-wrapper input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-scroll-wrapper input[type="number"]:first-child:last-child {
  padding: 0px 2px;
}

.input-scroll-wrapper.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.input-scroll-wrapper input[type="number"]::-webkit-outer-spin-button,
.input-scroll-wrapper input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-scroll-wrapper:hover label {
  color: var(--color-checkbox-hover);
  opacity: 1;
}

.input-scroll-wrapper input:invalid {
  box-shadow: none;
}
</style>