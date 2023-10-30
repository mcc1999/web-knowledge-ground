import dayjs, { Dayjs } from "dayjs";

/**
 * 每月第一天是星期几
 * @param day 日期，格式YYYY-MM
 * @returns [0-6], 0-Sunday
 */
export function getDayOfWeek(date: string) {
  return new Date(date).getDay()
}

/**
 * 每月最后一天是几号
 * @param day 日期，格式YYYY-MM-DD
 * @returns number 几号
 */
export function getLastDayOfMonth(date: string) {
  const [year, month] = date.split('-');
  return new Date(Number(year), Number(month), 0).getDate();
}
