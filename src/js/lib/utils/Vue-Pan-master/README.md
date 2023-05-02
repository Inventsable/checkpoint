# vue-pan

Isolated version of [Quasar's](https://github.com/quasarframework/quasar) `v-touch-pan` directive. No dependencies, no need for entirety of Quasar framework.

## [See demo and API from Quasar docs](https://quasar.dev/vue-directives/touch-pan)

### Installation

```bash
npm i vue-pan
```

Load directive locally:

```html
<!-- Inside any .vue component -->
<script>
  export default {
    directives: {
      "pan": require('vue-pan').default
    },
  }
```

Load directive globally:

```js
// in main.js
Vue.directive("pan", require('vue-pan').default);

// Load directive above prior to instantializing Vue:
new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
```

### Usage

```html
<div v-pan.prevent.mouse="panHandle" />
```

Returns stream of MouseEvents while dragging:
```js
{
  evt: {
    isTrusted: true
  },
  touch: false,
  mouse: true,
  position: {
    top: 76,
    left: 78
  },
  direction: "right",
  isFirst: false,
  isFinal: false,
  duration: 251,
  distance: {
    x: 10,
    y: 0
  },
  offset: {
    x: 10,
    y: 0
  },
  delta: {
    x: 1,
    y: 0
  }
}
```