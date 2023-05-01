<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue';
import { useHelp } from '../stores/help';
import { useRouter } from 'vue-router';
import HelpPage from '../lib/components/help-page.vue'

const router = useRouter();
const help = useHelp();

const activeIndex = ref(help.activeIndex)
let currentPage = reactive(help.getPageByUUID(router.currentRoute.value.params.uuid));


function assignCurrentPage() {
  currentPage = help.getPageByUUID(router.currentRoute.value.params.uuid)
}

watch(router.currentRoute, (newVal, oldVal) => {
  assignCurrentPage();
}, { deep: true })

</script>

<template>
  <HelpPage :content="currentPage.content" />
</template>

<style>
.help-page-container {
  margin: auto;
  font-size: 40px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>