<script setup lang="ts">


import { onMounted, ref } from "vue";
import { fs, os, path } from "../../lib/utils/node";
import { useRouter } from 'vue-router'
const router = useRouter();
</script>

<template>
  <div class="placeholder">
    {{ router.currentRoute.value.name }}
  </div>
</template>

<style>
.placeholder {
  margin: auto;
  font-size: 40px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>