<template>
  <span class="icon">
    <svg aria-hidden="true">
      <use :xlink:href="iconfont"></use>
    </svg>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import './iconfont';

export default defineComponent({
  name: 'Iconfont',
  props: {
    icon: String,
  },
  setup(props) {
    const iconfont = computed(() => `#${props.icon}`);

    return {
      iconfont,
    };
  },
});
</script>

<style lang="less" scoped>
.icon {
  display: inline-block;

  & > svg {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
