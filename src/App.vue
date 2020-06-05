<template>
  <div id="app-calendar">
    <div class="title" v-if="!useSingleSpa">Vue-Calendar</div>
    <Calendar />
  </div>
</template>

<script lang="ts">
import AsyncComponent from '@/components/AsyncComponent/index';

const Calendar = AsyncComponent(() =>
  import(
    /* webpackPrefetch: true */
    /* webpackChunkName: 'calendar' */
    '@/components/Calendar/index.vue'
  ),
);

export default {
  name: 'App',
  components: {
    Calendar,
  },
  inject: ['useSingleSpa'],
};
</script>

<style>
body {
  margin: 0;
}
#app-calendar {
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
