<template>
  <div class="calendar">
    <ul class="header">
      <li @click="changeMonth('prev')">《</li>
      <li class="month">{{ yearMonth.year }}/{{ yearMonth.month }}</li>
      <li @click="changeMonth('next')">》</li>
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
      <li class="week" v-for="(week, index) in month" :key="index">
        <span
          :key="i"
          v-for="(item, i) in week"
          class="item"
          :title="item.dateString"
          :class="{
            today: isToday(item),
            'same-date': item.date === todayDate,
            active: item.dateString && item.dateString === active,
          }"
          @click="setActive(item.dateString)"
          >{{ item.date }}</span
        >
      </li>
    </ul>
    <button @click="setToday">今天</button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
} from '@vue/composition-api';
import Calendar from '@/utils/calendar';

const C = Calendar as any;

interface DateItem {
  date: string;
  dateString: string;
  [prop: string]: any;
}

export default defineComponent({
  name: 'calendar',
  setup() {
    const yearMonth = reactive({
      year: 0,
      month: 0,
    });
    const month = ref<DateItem[][]>([[], [], [], []]);
    const todayDate = ref(new Date().getDate()); // 今天多少号
    const active = ref('');

    onMounted(() => {
      init();
    });

    const init = () => {
      const [_year, _month, _date] = new Date().toLocaleDateString().split('/');
      yearMonth.year = Number(_year);
      yearMonth.month = Number(_month);
      active.value = `${yearMonth.year}/${
        yearMonth.month < 10 ? `0${yearMonth.month}` : yearMonth.month
      }/${Number(_date) < 10 ? `0${_date}` : _date}`;
      setMonthView();
    };

    // 今天，切换到当前月份
    const setToday = () => init();

    const changeMonth = (type: 'prev' | 'next') => {
      if (type === 'prev') {
        // 上个月
        if (yearMonth.month > 1) {
          --yearMonth.month;
        } else {
          --yearMonth.year;
          yearMonth.month = 12;
        }
      } else {
        // 下个月
        if (yearMonth.month < 12) {
          ++yearMonth.month;
        } else {
          ++yearMonth.year;
          yearMonth.month = 1;
        }
      }
      setMonthView();
    };

    const setMonthView = () => {
      const { monthList: preMonthList } = new C(
        `${yearMonth.year}/${yearMonth.month - 1}`,
      );
      const { monthList } = new C(`${yearMonth.year}/${yearMonth.month}`);
      const { monthList: nextMonthList } = new C(
        `${yearMonth.year}/${yearMonth.month + 1}`,
      );
      monthList[0].forEach((item: DateItem, index: number) => {
        if (!item.date) {
          console.log(
            'index: %o, preMonthList[preMonthList.length - 1][index]: %o',
            index,
            preMonthList[preMonthList.length - 1][index],
          );
          item = preMonthList[preMonthList.length - 1][index];
        }
      });
      monthList[monthList.length - 1].forEach(
        (item: DateItem, index: number) => {
          if (!item.date) item = nextMonthList[nextMonthList.length - 1][index];
        },
      );
      console.log('preMonthList: ', preMonthList);
      console.log('monthList: ', monthList);
      console.log('nextMonthList: ', nextMonthList);
      month.value = monthList;
    };

    const setActive = (dateString: string) => {
      if (dateString) active.value = dateString;
    };

    const isToday = (item: any) => {
      if (!item.dateString) return false;
      if (!active || active === item.dateString) return true;
      return false;
    };

    return {
      yearMonth,
      month,
      active,
      todayDate,
      changeMonth,
      setToday,
      setActive,
      isToday,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style';
</style>
