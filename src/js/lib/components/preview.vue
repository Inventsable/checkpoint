<script setup lang="ts">
//@ts-nocheck
import { onMounted, ref, watch } from 'vue'
import * as lottie from "lottie-web";
import { useSettings } from '../../stores/settings';
import animationFile from '../../assets/left.json'
const settings = useSettings();

console.log("TESTING")
console.log(lottie_api)

console.log(lottie)
const anim = ref(null)
const animAPI = ref(null);
const playedIntro = ref(false);

onMounted(() => {
  anim.value = buildAnimation();
  animAPI.value = lottie_api.createAnimationApi(anim.value);
  const firstSegment = anim.value.markers.slice(1).map(i => i.tm)
  console.log(firstSegment)
  const lastSegment = anim.value.markers.slice(1, anim.value.markers.length)
  console.log(anim.value)
  anim.value.addEventListener('loopComplete', () => {
    if (!playedIntro.value) {
      console.log("Complete?", lastSegment)
      anim.value.goToAndStop(anim.value.totalFrames - 1, true);
      playedIntro.value = true;
      anim.value.playSegments([anim.value.totalFrames - 2, anim.value.totalFrames - 1], true);
    }
  })
  let tempSlider = animAPI.value.getKeyPath(
    `Master,Effects,Anchor Width,0`
  );
  animAPI.value.addValueCallback(tempSlider, (currentVal) => {
    return settings.anchor.style.width;
  });
  anim.value.playSegments(firstSegment, true);
})

function buildAnimation() {
  const animData = {
    wrapper: document.getElementsByClassName('lottie-player')[0],
    animType: "svg",
    loop: true,
    prerender: true,
    autoplay: true,
    animationData: animationFile
  }
  return lottie.loadAnimation(animData);
}


console.log(animationFile)
</script>

<template>
  <div class="lottie-container">
    <div class="lottie-player" />
  </div>
</template>

<style>
.lottie-container svg {
  width: 100%;
  max-height: 160px;
}

.bgFill {
  fill: var(--color-bg);
}
</style>