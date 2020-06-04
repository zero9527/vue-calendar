<template>
  <div class="calendar">
    <ul class="header">
      <li>
        <icon-font
          icon="icon-arrowhead-left-outline"
          title="上一年"
          @click.native="changeYear('prev')"
        />
        <icon-font
          title="上个月"
          icon="icon-arrow-ios-back-outline"
          @click.native="changeMonth('prev')"
        />
      </li>
      <li class="month" @click="selectYearMonthVisible = true">
        {{ showYearMonth }}
      </li>
      <li>
        <icon-font
          title="下一年"
          icon="icon-arrow-ios-forward-outline"
          @click.native="changeMonth('next')"
        />
        <icon-font
          title="下个月"
          icon="icon-arrowhead-right-outline"
          @click.native="changeYear('next')"
        />
      </li>
      <selectYearMonth
        v-if="selectYearMonthVisible"
        :visible="selectYearMonthVisible"
        :yearMonth="yearMonth"
        @change="onSelectYearMonthChange"
        @close="selectYearMonthVisible = false"
      />
    </ul>
    <ul class="body" :activeDate="JSON.stringify(activeDate)" :month="yearMonth.month">
      <li class="week-day">
        <span
          v-for="(day, index) in weekday"
          :key="day"
          :class="{
            active: isActiveWeekday(index),
          }"
        >
          {{ day }}
        </span>
      </li>
      <li class="week" v-for="(week, index) in monthList" :key="index">
        <span
          :key="i"
          v-for="(item, i) in week"
          class="item"
          :title="item.dateString"
          :class="{
            today: isToday(item),
            active: isActiveDate(item),
            'same-date': item.date === todayDate,
            'another-month-date': item.month !== yearMonth.month,
          }"
          @click="setActiveDate(item)"
        >
          {{ item.date }}
        </span>
      </li>
    </ul>
    <ul class="from-today" v-if="fromToday">
      {{
        fromToday
      }}
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
  computed,
  onMounted,
} from '@vue/composition-api';
import Calendar from 'z-calendar';
import selectYearMonth from '../SelectYearMonth/index.vue';

const C = Calendar as any;

export interface YearMonth {
  year: number;
  month: number;
}
export interface DateItem {
  year: number;
  month: number;
  date: number;
  dateString: string;
  [prop: string]: any;
}

export default defineComponent({
  name: 'Calendar',
  components: {
    selectYearMonth,
  },
  setup(props, ctx) {
    const _Date = new Date();
    const yearMonth = reactive({
      year: _Date.getFullYear(),
      month: _Date.getMonth() + 1,
    });
    const monthList = ref<DateItem[][]>([[], [], [], []]);
    const weekday = ref(['日', '一', '二', '三', '四', '五', '六']);
    const todayDate = ref(new Date().getDate()); // 今天多少号
    const activeDate = ref<DateItem>();
    const selectYearMonthVisible = ref(false);

    // 距今天的距离
    const fromToday = computed(() => {
      if (!activeDate.value) return '';
      const onDayTime = 24 * 60 * 60 * 1000;
      const distance =
        new Date(activeDate.value!.dateString).getTime() -
        new Date(
          `${_Date.getFullYear()}/${_Date.getMonth() + 1}/${_Date.getDate()}`,
        ).getTime();
      if (distance === 0) return `日期：${activeDate.value.dateString}，今天`;
      return `日期：${activeDate.value.dateString}，${Math.abs(distance / onDayTime)}${
        distance < 0 ? '天前' : '天后'
      }`;
    });

    // 显示年月份，如2020-05
    const showYearMonth = computed(
      () => `${yearMonth.year}-${`${yearMonth.month}`.padStart(2, '0')}`,
    );

    onMounted(() => {
      init();
    });

    const init = () => {
      yearMonth.year = _Date.getFullYear();
      yearMonth.month = _Date.getMonth() + 1;
      setMonthView();

      // 初始化 activeDate
      const _date = _Date.getDate();
      const _month = _Date.getMonth() + 1;
      if (monthList.value[1][0].month === _month) {
        monthList.value.find((item: DateItem[]) => {
          const today = item.find(
            (i: DateItem) => Number(i.date) === _date && Number(i.month === _month),
          );
          if (today) {
            activeDate.value = today;
            return true;
          }
          return false;
        });
      }
    };

    // 今天，切换到当前月份
    const setToday = () => init();

    // 选择年月份
    const onSelectYearMonthChange = ({ year, month }: YearMonth) => {
      yearMonth.year = year;
      yearMonth.month = month;
      selectYearMonthVisible.value = false;
      setMonthView();
    };

    // 切换上一年、下个月
    const changeYear = (type: 'prev' | 'next') => {
      yearMonth.year = type === 'prev' ? yearMonth.year - 1 : yearMonth.year + 1;
      setMonthView();
    };

    // 切换上个月prev、下个月next
    const changeMonth = (type: 'prev' | 'next') => {
      const { year, month } = type === 'prev' ? getPrevYearMonth() : getNextYearMonth();
      yearMonth.year = year;
      yearMonth.month = month;
      setMonthView();
    };

    const setMonthView = () => {
      const _prev = getPrevYearMonth();
      const _next = getNextYearMonth();
      const { year, month } = yearMonth;
      const { monthList: pList } = new C(`${_prev.year}/${_prev.month}`);
      const { monthList: _monthList } = new C(`${year}/${month}`);
      const { monthList: nList } = new C(`${_next.year}/${_next.month}`);
      const len = _monthList.length;

      // 补齐第一周1号前空白日期为上月日期
      _monthList[0].forEach((item: DateItem, index: number) => {
        if (!item.date) {
          const pListIndexValue = pList[pList.length - 1][index];
          ctx.root.$set(_monthList[0], index, pListIndexValue);
        }
      });
      // 补齐最后一周最后一天后空白日期为下月日期
      _monthList[len - 1].forEach((item: DateItem, index: number) => {
        if (!item.date) {
          ctx.root.$set(_monthList[len - 1], index, nList[0][index]);
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

    const setActiveDate = (item: DateItem) => {
      activeDate.value = item;
      const [year, month] = item.dateString.split('/');
      if (Number(year) < yearMonth.year) return changeMonth('prev');
      if (Number(year) > yearMonth.year) return changeMonth('next');
      if (Number(month) < yearMonth.month) return changeMonth('prev');
      if (Number(month) > yearMonth.month) return changeMonth('next');
    };

    // 星期
    const isActiveWeekday = (index: number) =>
      activeDate.value && index === new Date(activeDate.value.dateString).getDay();

    // 今天
    const isToday = (item: DateItem) => {
      if (!activeDate || activeDate.value?.dateString === item.dateString) {
        return true;
      }
      return false;
    };

    // 与今天同日期
    const isActiveDate = (item: DateItem) => {
      return item.dateString === activeDate.value?.dateString;
    };

    return {
      showYearMonth,
      yearMonth,
      weekday,
      monthList,
      fromToday,
      activeDate,
      todayDate,
      changeYear,
      changeMonth,
      setToday,
      setActiveDate,
      isActiveWeekday,
      isToday,
      isActiveDate,
      selectYearMonthVisible,
      onSelectYearMonthChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import './style';
</style>
