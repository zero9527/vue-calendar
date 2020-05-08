<template>
  <div class="calendar">
    <ul class="header">
      <li @click="changeMonth('prev')">《</li>
      <li class="month" @click="selectYearMonthVisible = true">
        {{ yearMonth.year }}/{{ yearMonth.month }}
      </li>
      <li @click="changeMonth('next')">》</li>
      <selectYearMonth
        v-if="selectYearMonthVisible"
        :visible="selectYearMonthVisible"
        :yearMonth="yearMonth"
        @change="onSelectYearMonthChange"
        @close="selectYearMonthVisible = false"
      />
    </ul>
    <ul class="body" :active="active">
      <li class="week-day">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
      </li>
      <li class="week" v-for="(week, index) in monthList" :key="index">
        <span
          :key="i"
          v-for="(item, i) in week"
          class="item"
          :title="item.dateString"
          :class="{
            today: isToday(item),
            active: item.dateString && item.dateString === active,
            'same-date': item.date === todayDate,
            'another-month-date': item.month !== yearMonth.month,
          }"
          @click="setActive(item)"
          >{{ item.date }}</span
        >
      </li>
    </ul>
    <ul class="footer">
      <button @click="setToday">今天</button>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
} from '@vue/composition-api';
import Calendar from '@/utils/calendar';
import selectYearMonth from '../SelectYearMonth/index.vue';

const C = Calendar as any;

export interface YearMonth {
  year: number;
  month: number;
}
export interface DateItem {
  date: string;
  dateString: string;
  [prop: string]: any;
}

export default defineComponent({
  name: 'calendar',
  components: {
    selectYearMonth,
  },
  setup(props, ctx) {
    const yearMonth = reactive({
      year: 0,
      month: 0,
    });
    const monthList = ref<DateItem[][]>([[], [], [], []]);
    const todayDate = ref(new Date().getDate()); // 今天多少号
    const active = ref('');
    const selectYearMonthVisible = ref(false);

    onMounted(() => {
      init();
    });

    const init = () => {
      const _Date = new Date();
      const _date = _Date.getDate();
      yearMonth.year = Number(_Date.getFullYear());
      yearMonth.month = Number(_Date.getMonth() + 1);
      active.value = `${yearMonth.year}/${
        yearMonth.month < 10 ? `0${yearMonth.month}` : yearMonth.month
      }/${Number(_date) < 10 ? `0${_date}` : _date}`;
      setMonthView();
    };

    // 今天，切换到当前月份
    const setToday = () => init();

    // 选择年月份
    const onSelectYearMonthChange = ({ year, month }: YearMonth) => {
      console.log('year: %o, month: %o', year, month);
      yearMonth.year = year;
      yearMonth.month = month;
      selectYearMonthVisible.value = false;
      setMonthView();
    };

    // 切换上个月、下个月
    const changeMonth = (type: 'prev' | 'next') => {
      // type：prev上个月，next下个月
      const { year, month } =
        type === 'prev' ? getPrevYearMonth() : getNextYearMonth();
      yearMonth.year = year;
      yearMonth.month = month;
      setMonthView();
    };

    const setMonthView = () => {
      const _prev = getPrevYearMonth();
      const _next = getNextYearMonth();
      const { monthList: prevMonthList } = new C(
        `${_prev.year}/${_prev.month}`,
      );
      const { monthList: _monthList } = new C(
        `${yearMonth.year}/${yearMonth.month}`,
      );
      const { monthList: nextMonthList } = new C(
        `${_next.year}/${_next.month}`,
      );
      const len = _monthList.length;

      // 补齐第一周1号前空白日期为上月日期
      _monthList[0].forEach((item: DateItem, index: number) => {
        if (!item.date) {
          const preMonthIndexValue =
            prevMonthList[prevMonthList.length - 1][index];
          ctx.root.$set(_monthList[0], index, preMonthIndexValue);
        }
      });
      // 补齐最后一周最后一天后空白日期为下月日期
      _monthList[len - 1].forEach((item: DateItem, index: number) => {
        if (!item.date) {
          ctx.root.$set(_monthList[len - 1], index, nextMonthList[0][index]);
        }
      });
      monthList.value = _monthList;
    };

    // 上个月
    const getPrevYearMonth = () => {
      if (yearMonth.month > 1) {
        return { year: yearMonth.year, month: yearMonth.month - 1 };
      }
      return {
        year: yearMonth.year - 1,
        month: 12,
      };
    };

    // 下个月
    const getNextYearMonth = () => {
      if (yearMonth.month < 12) {
        return { year: yearMonth.year, month: yearMonth.month + 1 };
      }
      return {
        year: yearMonth.year + 1,
        month: 1,
      };
    };

    const setActive = ({ month, dateString }: DateItem) => {
      if (dateString) active.value = dateString;
      if (month < yearMonth.month) return changeMonth('prev');
      if (month > yearMonth.month) return changeMonth('next');
    };

    const isToday = (item: any) => {
      if (!item.dateString) return false;
      if (!active || active === item.dateString) return true;
      return false;
    };

    return {
      yearMonth,
      monthList,
      active,
      todayDate,
      changeMonth,
      setToday,
      setActive,
      isToday,
      selectYearMonthVisible,
      onSelectYearMonthChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style';
</style>
