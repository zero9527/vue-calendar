<template>
  <div id="app">
    <img alt="Vue logo" width="100px" src="./assets/logo.png" />
    <Calendar />
  </div>
</template>

<script>
import Calendar from './components/Calendar/index.vue';

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
  margin-top: 60px;
}
</style>
