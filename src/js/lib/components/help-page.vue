<script setup lang="ts">
// @ts-nocheck
import { computed, watch, nextTick, onMounted } from 'vue';
import { useHelp } from '../../stores/help';
import { openLinkInBrowser } from '../utils/utils';
const showdown = require('showdown');
const props = defineProps<{
  content: string
}>()
const converter = new showdown.Converter()

converter.setOption('tasklists', true);
converter.setOption('ghMentions', true);
converter.setOption('emoji', true);

const help = useHelp();
const html = computed<string>(() => converter.makeHtml(props.content))
watch(() => help.activeIndex, async () => await nextTick(() => replaceAnchorTags()))

function replaceAnchorTags() {
  setTimeout(() => {
    let anchors = document.querySelectorAll('a');
    for (let anchor of anchors) {
      let href = anchor.href;
      console.log(href)
      anchor.onclick = function () {
        return openLinkInBrowser(href)
      }
      console.log(anchor.onclick)
      anchor.removeAttribute("href")
      console.log(anchor)
    }
  }, 100);
}

onMounted(async () => {
  await nextTick(() => replaceAnchorTags())
})

function replaceAnchorsWithLinks(string: string) {
  string = `<div>${string}</div>`;
  let anchorRx = /<a[^\<]*\<\/a>/gm,
    hrefRX = /href="[^"]*"/gm;
  if (anchorRx.test(string)) {
    let matches = string.match(anchorRx);
    let replacements = [];
    matches.forEach((match) => {
      let item = {
        find: match,
        href: match.match(hrefRX)[0].replace("href", "url"),
        contents: match.match(/>(.*)</)[1],
      };
      item[
        "final"
      ] = `<superlink size="14px" ${item.href}>${item.contents}</superlink>`;
      replacements.push(item);
    });
    replacements.forEach((item) => {
      string = string.replace(item.find, item.final);
    });
    console.log(replacements);
  }
  console.log(string);
  return string;
}
</script>

<template>
  <div class="help-page-content" v-html="html" />
</template>

<style>
.help-page-content {
  padding: 0px 16px;
  position: absolute;
  box-sizing: border-box;
  left: var(--drawer-width);
  height: 100%;
  top: 0px;
  /* border: 2px solid red; */
}

.help-page-content a {
  color: var(--color-selection);
  cursor: pointer;
}

.help-page-content a:hover {
  text-decoration: underline;
}

.help-page-content * {
  user-select: none;
}

.help-page-content *:not(a) {
  cursor: auto;
}

.help-page-content .task-list-item {
  box-sizing: border-box;
  /* border: 2px solid red; */
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  margin-bottom: 4px;
}

.help-page-content pre {
  background-color: var(--color-header-border);
  padding: 6px 10px;
  border-radius: 3px;
}

/* .help-page-content .task-list-item input[type="checkbox"]::before {} */


/* input,
input[disabled],
input[disabled]:hover {
  border: 2px solid red;
  background-color: red !important;
  color: red !important;
} */
</style>