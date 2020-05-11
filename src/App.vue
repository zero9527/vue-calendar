<template>
  <div id="app">
    <div class="title">Vue-Calendar</div>
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
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  box-sizing: border-box;
}

.title {
  padding: 20px 0;
  font-size: 22px;
  color: #2196f3;
  text-shadow: 1px 3px 4px rgba(33, 150, 243, 0.5);
}
</style>
