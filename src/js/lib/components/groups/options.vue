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
  })

</script>

<template>
  <Fold label="Advanced">
    <div class="placeholder-content">
      <Checkbox v-model="useLayerLabelColor" label="Use layer label colors"
        title="Override assigned colors so anchors and strokes use the label color of their parent layer" />
      <Checkbox v-model="overrideComplex" label="Override complex appearances"
        title="Duplicate artwork to strip multiple fills and strokes otherwise inaccessible to scripting" />
      <Checkbox v-model="forceOpacity" label="Force full opacity" title="Force all paths to 100% opacity" />
      <Checkbox v-model="createAsCopy" label="Create new file as copy" title="Save file as copy before running script" />
      <Checkbox v-model="renameGenericPaths" label="Rename generic paths" title="???" />
      <Checkbox v-model="generateIds" label="Generate ids" title="?" />
      <Checkbox v-model="groupRelated" label="Group related" title="?" />
      <Checkbox v-model="ignoreBackgrounds" label="Ignore backgrounds" title="?" />
      <Checkbox v-model="warnForComplexArt" label="Warn for complex art" title="?" />
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
</style>