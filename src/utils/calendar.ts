/**
 * 日历生成
 * @param initialDate 2020/5/1
 */
interface CalendarOptions {
  getPrevNext?: boolean;
}

interface CalendarThis {
  description: string;
  initialDate?: string;
  year: string;
  month: string;
  monthList: any[];
  today: string;
  getPrevNext: any;
  init: () => void;
  // 生成按星期分组的月份日历
  generate: (week: number | undefined, monthDate1: string) => void;
  // 校验日期是否有效
  validDate: (date: string) => boolean;
  // @return 2020/05/01
  getDateString(year: number, month: number, date: number): string;
  getDateParams: (timestamp?: string | undefined) => any;
}

export default function Calendar(
  this: CalendarThis,
  initialDate?: string,
  { getPrevNext }: CalendarOptions = {
    getPrevNext: false,
  },
) {
  this.description = '排列按照星期日~星期六';
  this.initialDate = initialDate; // 获取的日期
  this.year = '';
  this.month = '';
  this.monthList = [];
  this.today = '';
  this.getPrevNext = getPrevNext;

  this.init();
}

Calendar.prototype = {
  constructor: Calendar,
  init() {
    const { _year, _month } = this.getDateParams(this.initialDate);
    if (!_year || !_month) {
      return console.warn('初始化日期可选，请传递正确的格式，如2020/5/1');
    }
    this.year = _year;
    this.month = _month;
    this.today = new Date().toLocaleDateString();
    const monthDate1 = `${this.year}/${this.month}/1`; // 1号
    this.generate(0, monthDate1);
  },
  // 生成按星期分组的月份日历
  generate: function generate(week = 0, monthDate1: string) {
    const { _day, _date, dateString } = this.getDateParams(monthDate1);
    let date = _date;

    for (let i = 0; i < 7; i++) {
      if (!this.monthList[week]) this.monthList[week] = [];
      if (i < _day) {
        // 第一周
        this.monthList[week].push({
          year: this.year,
          month: this.month,
          date: i < _day ? '' : date,
          dateString: i + 1 < _day ? '' : dateString,
        });
      } else if (i === _day) {
        this.monthList[week].push({
          year: this.year,
          month: this.month,
          date,
          dateString,
        });
      } else {
        const tomorrow = this.getDateString(this.year, this.month, date + 1);
        if (this.validDate(tomorrow)) {
          this.monthList[week].push({
            year: this.year,
            month: this.month,
            date: ++date,
            dateString: tomorrow,
          });
        } else {
          this.monthList[week].push({
            year: this.year,
            month: this.month,
            date: '',
            dateString: '',
          });
        }
      }
    }

    const nextWeekday1 = this.getDateString(this.year, this.month, date + 1);
    if (this.validDate(nextWeekday1) && week < 10) {
      this.generate(week + 1, nextWeekday1);
    }
  },
  // 校验日期是否有效 date: 2020/05/01
  validDate(date: string) {
    const _Date = new Date(date);
    const date1 = Number(date.split('/')[2]);
    const date2 = _Date.getDate();
    return `${_Date}` !== 'Invalid Date' && date1 === date2;
  },
  // @return 2020/05/01
  getDateString(year: number, month: number, date: number) {
    const dateString = `${year}/${month < 10 ? `0${month}` : month}/${
      date < 10 ? `0${date}` : date
    }`;
    return dateString;
  },
  getDateParams(timestamp?: string) {
    const _Date = timestamp ? new Date(timestamp) : new Date();
    const _year = _Date.getFullYear();
    const _month = _Date.getMonth() + 1;
    const _date = _Date.getDate();
    const _day = _Date.getDay();
    const dateString = this.getDateString(_year, _month, _date);

    return {
      _Date,
      _year,
      _month,
      _day,
      _date,
      dateString,
    };
  },
};
