<script setup lang="ts">
//@ts-nocheck
import { onMounted, ref, watch } from 'vue'
import * as lottie from "lottie-web";
import { useSettings } from '../../stores/settings';
import anim1 from '../../assets/left.json'
import anim2 from '../../assets/mid.json'
import anim3 from '../../assets/right.json'
const settings = useSettings();


interface LottieApi {
  createAnimationApi: (options: LottieAnimationOptions) => LottieAnimation;
}

interface LottieAnimationOptions {
  container: HTMLElement;
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
}

interface LottieAnimation {
  play: () => void;
  stop: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  setDirection: (direction: number) => void;
  destroy: () => void;
}


console.log("TESTING")
console.log(lottie_api)

console.log(lottie)
const anim = ref(null)
const animAPI = ref(null);
const playedIntro = ref(false);

const animations = [
  anim1, anim2, anim3
]

function roll(min, max) {
  return Math.floor(Math.random() * max) + min;
}

const rollNumber = getUniqueRoll();
const sliderEnums = [
  {
    keypath: `Master,Effects,Anchor Width,0`,
    callback: (value) => settings.anchor.style.width * (settings.options.scaleFactor / 100)
  },
  {
    keypath: `Master,Effects,Anchor Size, 0`,
    callback: (value) => settings.anchor.style.size * (settings.options.scaleFactor / 100)
  },
  {
    keypath: `Master,Effects,Handle Width,0`,
    callback: (value) => settings.handle.style.width * (settings.options.scaleFactor / 100)
  },
  {
    keypath: `Master,Effects,Handle Size, 0`,
    callback: (value) => settings.handle.style.size * (settings.options.scaleFactor / 100)
  },
  {
    keypath: `Master,Effects,Stick Width, 0`,
    callback: (value) => settings.stick.style.width * (settings.options.scaleFactor / 100)
  },
  {
    keypath: `Master,Effects,Stem Width, 0`,
    callback: (value) => settings.outline.style.width * (settings.options.scaleFactor / 100)
  },
  {
    keypath: `Master,Effects,Anchor Filled, 0`,
    callback: (value) => settings.anchor.style.filled ? 1 : 0
  },
  {
    keypath: `Master,Effects,Handle Filled, 0`,
    callback: (value) => settings.handle.style.filled ? 1 : 0
  }
]

function getUniqueRoll() {
  const rollIndex = roll(0, animations.length);
  let lastRoll = +window.localStorage.getItem("lastRoll");
  if (rollIndex == lastRoll)
    return getUniqueRoll()
  else {
    window.localStorage.setItem("lastRoll", rollIndex.toString())
    return rollIndex
  }
}

console.log("ROLLED:", rollNumber);

const animationFile = animations[rollNumber]

onMounted(() => {

  anim.value = buildAnimation();
  animAPI.value = lottie_api.createAnimationApi(anim.value);
  anim.value.addEventListener('loopComplete', () => {
    if (!playedIntro.value) {
      anim.value.goToAndStop(anim.value.totalFrames - 1, true);
      playedIntro.value = true;
      anim.value.playSegments([anim.value.totalFrames - 2, anim.value.totalFrames - 1], true);
    }
  })

  sliderEnums.forEach(v => {
    animAPI.value.addValueCallback(animAPI.value.getKeyPath(
      v.keypath
    ), v.callback);
  })

  anim.value.playSegments(anim.value.markers.slice(1).map(i => i.tm), true);
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
.lottie-container {
  padding: 4px 10px;
}

.lottie-container svg {
  width: 100%;
  max-height: 160px;
}

.bgFill {
  fill: var(--color-bg);
  transition: fill 200ms var(--quart) 0ms;
}

.stemStroke {
  stroke: var(--outline-stroke-color);
  transition: stroke 200ms var(--quart) 0ms;
}

.anchorStroke {
  stroke: var(--anchor-stroke-color);
  transition: stroke 200ms var(--quart) 0ms;
}

.anchorFill {
  fill: var(--handle-stroke-color);
  transition: fill 200ms var(--quart) 0ms;
}

.anchorFillMask {
  /* fill: var(--color-bg); */
  fill: transparent;
  transition: fill 200ms var(--quart) 0ms;
}

.handleStroke {
  stroke: var(--handle-stroke-color);
  transition: stroke 200ms var(--quart) 0ms;
}

.handleFill {
  fill: var(--handle-stroke-color);
  transition: fill 200ms var(--quart) 0ms;
}

.handleFillMask {
  /* fill: var(--color-bg); */
  fill: transparent;
  transition: fill 200ms var(--quart) 0ms;
}

.stickStroke {
  stroke: var(--stick-stroke-color);
  transition: stroke 200ms var(--quart) 0ms;
}
</style>