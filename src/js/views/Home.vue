<script setup lang="ts">
import { onMounted, ref, computed, watch, Ref } from "vue";
import { useSettings } from '../stores/settings';

import Button from '../lib/components/button.vue'
import Preview from '../lib/components/preview.vue'
import Toolbar from '../lib/components/groups/toolbar.vue'
import Table from '../lib/components/groups/table.vue'

const settings = useSettings()
//
// 
</script>
<template>
  <div class="home-content">
    <Toolbar />
    <div class="preview">
      <Preview />
    </div>
    <Table />
  </div>
</template>

<style>
:root {
  --display-bg: transparent;
  --anchor-stroke-color: #FFEE00;
  --handle-stroke-color: #FFEE00;
  --stick-stroke-color: #FFEE00;
  --outline-stroke-color: #ffffffcc;
  --handle-fill-color: #FFEE00;
  --anchor-fill-color: #FFEE00;
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

  .table-row-wrapper>span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 1.75ch;
    letter-spacing: 1ch;
    padding: 2px 0px;
    text-align: center;
  }

  .table-row-wrapper>span:not(:first-child) {
    padding-left: 1ch;
  }

  .table-row-wrapper>*:not(span) {
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

  .table-wrapper {
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

  .table-row-wrapper {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding-left: 0px;
    padding-right: 0px;
  }

  .table-row-wrapper>* {
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

  .table-row:not(:nth-child(5)):not(:nth-child(3)) .table-row-wrapper {
    grid-template-rows: 1fr 1fr;
  }

  .table-row:not(:nth-child(3)) .table-row-wrapper {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }

  .input-scroll-wrapper label,
  .input-scroll-content label,
  .checkbox-input-wrapper label {
    display: inherit;
  }

  .table-row-wrapper>svg,
  .checkbox-input-wrapper>label {
    display: none;
  }

  .preview,
  .placeholder {
    display: none;
  }
}

@media screen and (max-width: 121px) {
  .table-row-wrapper>* {
    width: 49%;
  }
}

@media screen and (max-width: 90px) {
  .table-row-wrapper {
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

  .table-wrapper {
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

  .table-row-wrapper {
    flex-direction: column;
  }

  .table-row-wrapper>* {
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