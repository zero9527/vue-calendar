<template>
  <div id="app">
    <img alt="Vue logo" width="100px" src="./assets/logo.png" />
    <Calendar />
  </div>
</template>

<script lang="ts">
import AsyncComponent from '@/components/AsyncComponent/index';

const Calendar = AsyncComponent(() =>
  import('@/components/Calendar/index.vue'),
);

export default {
  name: 'App',
  components: {
    Calendar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

* {
  box-sizing: border-box;
}
</style>
