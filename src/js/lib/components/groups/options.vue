<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Fold from '../fold.vue'
import Checkbox from '../checkbox.vue'
import { useSettings } from '../../../stores/settings';

const settings = useSettings();

const useLayerLabelColor = computed<boolean>({
  get: (): boolean => settings.options.useLayerLabelColor,
  set: (val: boolean) => settings.options.useLayerLabelColor = val
}),
  overrideComplex = computed<boolean>({
    get: (): boolean => settings.options.overrideComplex,
    set: (val: boolean) => settings.options.overrideComplex = val
  }),
  forceOpacity = computed<boolean>({
    get: (): boolean => settings.options.forceOpacity,
    set: (val: boolean) => settings.options.forceOpacity = val
  }),
  renameGenericPaths = computed<boolean>({
    get: (): boolean => settings.options.renameGenericPaths,
    set: (val: boolean) => settings.options.renameGenericPaths = val
  }),
  generateIds = computed<boolean>({
    get: (): boolean => settings.options.generateIds,
    set: (val: boolean) => settings.options.generateIds = val
  }),
  groupRelated = computed<boolean>({
    get: (): boolean => settings.options.groupRelated,
    set: (val: boolean) => settings.options.groupRelated = val
  }),
  ignoreBackgrounds = computed<boolean>({
    get: (): boolean => settings.options.ignoreBackgrounds,
    set: (val: boolean) => settings.options.ignoreBackgrounds = val
  }),
  warnForComplexArt = computed<boolean>({
    get: (): boolean => settings.options.warnForComplexArt,
    set: (val: boolean) => settings.options.warnForComplexArt = val
  }),
  createAsCopy = computed<boolean>({
    get: (): boolean => settings.options.createAsCopy,
    set: (val: boolean) => settings.options.createAsCopy = val
  }),
  mergeClippingMasks = computed<boolean>({
    get: (): boolean => settings.options.mergeClippingMasks,
    set: (val: boolean) => settings.options.mergeClippingMasks = val
  }),
  enableChunks = computed<boolean>({
    get: (): boolean => settings.options.enableChunks,
    set: (val: boolean) => settings.options.enableChunks = val
  }),
  chunkSize = computed<number>({
    get: (): number => settings.options.chunkSize,
    set: (val: number) => settings.options.chunkSize = val
  }),
  ignoreCMYKColorAlerts = computed<boolean>({
    get: (): boolean => settings.options.ignoreCMYKColorAlerts,
    set: (val: boolean) => settings.options.ignoreCMYKColorAlerts = val
  })

</script>

<template>
  <Fold label="Advanced">
    <div class="placeholder-content">
      <Checkbox v-model="useLayerLabelColor" label="Use layer label colors"
        title="Override assigned colors so anchors and strokes use the label color of their parent layer" />
      <Checkbox v-model="createAsCopy" label="Create new file as copy" title="Save file as copy before running script" />
      <Checkbox v-model="overrideComplex" label="Override complex appearances"
        title="Strip complex appearances with multiple fills and strokes otherwise inaccessible to scripting" />
      <Checkbox v-model="mergeClippingMasks" label="Merge clipping masks"
        title="Runs Pathfinder > Intersect on all Clipping Masks and contents" />
      <Checkbox v-model="forceOpacity" label="Force all paths to full opacity" title="Force all paths to 100% opacity" />
      <Checkbox v-model="renameGenericPaths" label="Rename generic paths"
        title="Renames unnamed paths as their parent layer" />
      <Checkbox v-model="generateIds" label="Generate ids" title="Generates names with 3 character unique identifiers" />
      <Checkbox v-model="groupRelated" label="Group related"
        title="Creates child groups for each handle and stick within a parent group for anchor and handles" />
      <Checkbox v-model="ignoreBackgrounds" label="Ignore backgrounds"
        title="Ignore processing paths with exact artboard dimensions" />
      <Checkbox v-model="ignoreCMYKColorAlerts" label="Ignore CMYK color alerts"
        title="Don't display an alert on color pickers when using CMYK colors" />
    </div>
  </Fold>
</template>

<style>
.placeholder-content {
  padding: 3px 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.extra-options .checkbox-input-wrapper label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.extra-options .checkbox-input-wrapper {
  max-width: calc(100% - 2px);
  box-sizing: border-box;
}

/* .extra-options {} */
</style>