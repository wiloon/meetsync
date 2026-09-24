import type { Locale } from "./dictionary";

const monthsLongEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthsShortEn = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthsZh = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

type CalendarText = {
  weekdays: string[];
  monthsLong: string[];
  monthsShort: string[];
  formatRange: (
    leftYear: number,
    leftMonth: number,
    rightYear: number,
    rightMonth: number,
  ) => string;
  formatChipDate: (year: number, month: number, day: number) => string;
};

export const calendarText: Record<Locale, CalendarText> = {
  en: {
    weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthsLong: monthsLongEn,
    monthsShort: monthsShortEn,
    formatRange: (leftYear, leftMonth, rightYear, rightMonth) =>
      `Showing ${monthsLongEn[leftMonth]} – ${monthsLongEn[rightMonth]} ${rightYear}`,
    formatChipDate: (_year, month, day) => `${monthsShortEn[month]} ${day}`,
  },
  zh: {
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    monthsLong: monthsZh,
    monthsShort: monthsZh,
    formatRange: (leftYear, leftMonth, _rightYear, rightMonth) =>
      `显示 ${leftYear}年${monthsZh[leftMonth]} – ${monthsZh[rightMonth]}`,
    formatChipDate: (_year, month, day) => `${monthsZh[month]}${day}日`,
  },
};
