<template>
  <div class="select-year-month" v-show="visible">
    <div class="bg" @click="onClose" />
    <div class="content">
      <section class="wrapper">
        <div class="select">
          <section>
            年份 <span class="range">({{ range }})</span>
          </section>
          <section class="scroll year" ref="yearRef">
            <div class="up" @click="addPrevYear" title="往前增加50年">
              <icon-font icon="icon-arrowhead-up-outline" />
            </div>
            <div
              class="item"
              v-for="(year, index) in yearList"
              :key="`${year}-${index}`"
              :class="{
                active: year === activeYearMonth.year,
                [`year-${year}`]: true,
              }"
              @click="onYearChange(year)"
            >
              {{ year }}
            </div>
            <div class="down" @click="addNextYear" title="往后增加50年">
              <icon-font icon="icon-arrowhead-down-outline" />
            </div>
          </section>
        </div>
        <div class="select">
          <section>月份</section>
          <section class="scroll month">
            <div
              class="item"
              v-for="(month, index) in monthList"
              :key="`${month}-${index}`"
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
  computed,
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

    const range = computed(
      () => `${yearList.value[0]}~${yearList.value[yearList.value.length - 1]}`,
    );

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

      scrollIntoView();
    };

    const scrollIntoView = (
      year: number = _yearMonth.year,
      month: number = _yearMonth.month,
    ) => {
      ctx.root.$nextTick(() => {
        const yearItem = document.querySelector(
          `.scroll.year .year-${year - 3}`,
        );
        const monthItem = document.querySelector(
          `.scroll.month .month-${month - 3}`,
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

    // 点击年份上箭头
    const addPrevYear = () => {
      const prev = [];
      for (let i = 50; i > 0; i--) prev.push(yearList.value[0] - i);
      yearList.value = prev.concat(yearList.value);
      scrollIntoView(activeYearMonth.year, activeYearMonth.month);
    };

    // 点击年份下箭头
    const addNextYear = () => {
      const next = [];
      for (let i = 1; i <= 50; i++) {
        next.push(yearList.value[yearList.value.length - 1] + i);
      }
      yearList.value = yearList.value.concat(next);
      scrollIntoView(activeYearMonth.year, activeYearMonth.month);
    };

    const onChange = () => {
      ctx.emit('change', activeYearMonth);
    };

    const onClose = () => {
      ctx.emit('close');
    };

    return {
      _yearMonth,
      yearList,
      range,
      monthList,
      activeYearMonth,
      onYearChange,
      onMonthChange,
      addPrevYear,
      addNextYear,
      onChange,
      onClose,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style.less';
</style>
