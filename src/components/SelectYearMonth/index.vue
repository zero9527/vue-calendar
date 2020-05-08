<template>
  <div class="select-year-month" v-show="visible">
    <div class="bg" @click="onClose" />
    <div class="content">
      <section class="wrapper">
        <div class="select">
          <section>年份</section>
          <section class="scroll year" ref="yearRef">
            <div
              v-for="(year, index) in yearList"
              :key="`${year}-${index}`"
              class="item"
              :class="{
                active: year === activeYearMonth.year,
                [`year-${year}`]: true,
              }"
              @click="onYearChange(year)"
            >
              {{ year }}
            </div>
          </section>
        </div>
        <div class="select">
          <section>月份</section>
          <section class="scroll month">
            <div
              v-for="(month, index) in monthList"
              :key="`${month}-${index}`"
              class="item"
              :class="{
                active: month === activeYearMonth.month,
                [`month-${month}`]: true,
              }"
              @click="onMonthChange(month)"
            >
              {{ month }}
            </div>
          </section>
        </div>
      </section>
      <section class="bottom">
        <button @click="onChange">确定</button>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  watch,
  ref,
  onMounted,
} from '@vue/composition-api';

export default defineComponent({
  name: 'select-year-month',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    yearMonth: {
      type: Object,
      default: () => ({ year: 0, month: 0 }),
    },
  },
  setup(props, ctx) {
    const yearList = ref<number[]>([]);
    const monthList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const _yearMonth = reactive({ year: 0, month: 0 });
    const activeYearMonth = reactive({ year: 0, month: 0 });

    onMounted(() => {
      const { year, month } = props.yearMonth;
      _yearMonth.year = year;
      _yearMonth.month = month;
    });

    const init = (year: number) => {
      yearList.value = [];
      const start = year - 50;
      const end = year + 50;

      for (let i = start; i <= end; i++) {
        yearList.value.push(i);
      }

      ctx.root.$nextTick(() => {
        const yearItem = document.querySelector(
          `.scroll.year .year-${_yearMonth.year}`,
        );
        const monthItem = document.querySelector(
          `.scroll.month .month-${_yearMonth.month}`,
        )!;
        if (yearItem) yearItem.scrollIntoView();
        if (monthItem) monthItem.scrollIntoView();
      });
    };

    watch(
      () => _yearMonth.year,
      (value: number) => {
        init(value);
      },
    );

    watch(
      () => _yearMonth,
      () => {
        const { year, month } = _yearMonth;
        activeYearMonth.year = year;
        activeYearMonth.month = month;
      },
      {
        deep: true,
      },
    );

    const onYearChange = (year: number) => (activeYearMonth.year = year);

    const onMonthChange = (month: number) => (activeYearMonth.month = month);

    const onChange = () => {
      ctx.emit('change', activeYearMonth);
    };

    const onClose = () => {
      ctx.emit('close');
    };

    return {
      _yearMonth,
      yearList,
      monthList,
      activeYearMonth,
      onYearChange,
      onMonthChange,
      onChange,
      onClose,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
