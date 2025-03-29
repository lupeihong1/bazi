/**
 * 真太阳时计算工具
 * 用于计算指定时间点的真太阳时，考虑时差和经度修正
 */

import { getAllCities } from './cityData';

// 城市经纬度数据
export const cities = getAllCities().map(city => ({
  name: city.name,
  longitude: city.longitude,
  latitude: city.latitude
}));

// 每日时差修正值（分钟和秒）
const TIME_CORRECTION = {
  1: { // 1月
    1: -3.23,
    2: -3.47,
    3: -3.92,
    4: -4.35,
    5: -4.78,
    6: -5.20,
    7: -5.62,
    8: -6.03,
    9: -6.43,
    10: -6.83,
    11: -7.23,
    12: -7.62,
    13: -7.98,
    14: -8.35,
    15: -8.72,
    16: -9.07,
    17: -9.40,
    18: -9.73,
    19: -10.05,
    20: -10.35,
    21: -10.65,
    22: -10.93,
    23: -11.22,
    24: -11.48,
    25: -11.73,
    26: -11.98,
    27: -12.22,
    28: -12.43,
    29: -12.63,
    30: -12.83,
    31: -13.02
  },
  2: { // 2月
    1: -13.18,
    2: -13.33,
    3: -13.48,
    4: -13.62,
    5: -13.73,
    6: -13.83,
    7: -13.93,
    8: -14.00,
    9: -14.07,
    10: -14.13,
    11: -14.17,
    12: -14.18,
    13: -14.22,
    14: -14.22,
    15: -14.20,
    16: -14.18,
    17: -14.15,
    18: -14.10,
    19: -14.03,
    20: -13.97,
    21: -13.88,
    22: -13.78,
    23: -13.68,
    24: -13.57,
    25: -13.43,
    26: -13.30,
    27: -13.15,
    28: -12.98,
    29: -12.80
  },
  12: { // 12月
    1: -11.22,
    2: -11.48,
    3: -11.73,
    4: -11.98,
    5: -12.22,
    6: -12.43,
    7: -12.63,
    8: -12.83,
    9: -13.02,
    10: -13.18,
    11: -13.33,
    12: -13.48,
    13: -13.62,
    14: -13.73,
    15: -13.83,
    16: -13.93,
    17: -14.00,
    18: -14.07,
    19: -14.13,
    20: -14.17,
    21: -14.18,
    22: -14.22,
    23: -14.22,
    24: -14.20,
    25: -14.18,
    26: -14.15,
    27: -14.10,
    28: -14.03,
    29: -13.97,
    30: -13.88,
    31: -13.78
  }
  // ... 其他月份的数据可以根据图片继续添加
};

/**
 * 计算真太阳时
 * @param {Date} date - 北京时间（平太阳时）
 * @param {number} longitude - 经度（东经为正）
 * @param {number} latitude - 纬度（北纬为正）
 * @param {boolean} useSolarTime - 是否使用真太阳时
 * @returns {Date} 真太阳时或原始时间
 */
export function calculateSolarTime(date, longitude, latitude, useSolarTime = false) {
  if (!useSolarTime) return new Date(date);

  // 获取年月日、时分秒
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  // 1. 计算当天是当年的第几天（1月1日为第1天）
  const dateStart = new Date(Date.UTC(year, 0, 1));
  const currentDateUTC = Date.UTC(year, month - 1, day);
  const dayOfYear = Math.floor((currentDateUTC - dateStart.getTime()) / (24 * 3600 * 1000)) + 1;

  // 2. 计算均时差（Equation of Time，单位：分钟）
  const gamma = (2 * Math.PI * (dayOfYear - 1)) / 365; // 年度角度
  const EoT = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  ); // 单位：分钟

  // 3. 计算时区中央经线（中国使用 UTC+8，对应 120°E）
  const standardMeridian = 120;

  // 4. 经度修正（每度差异 = 4分钟）
  const longitudeCorrection = (longitude - standardMeridian) * 4; // 单位：分钟

  // 5. 计算总校正时间（分钟）
  const totalCorrection = longitudeCorrection + EoT;

  // 6. 将标准时间转换为分钟
  let totalMinutes = hour * 60 + minute + totalCorrection;

  // 7. 处理跨日（分钟 < 0 或 > 1440）
  let resultDate = new Date(date); // 克隆
  if (totalMinutes < 0) {
    resultDate.setDate(resultDate.getDate() - 1);
    totalMinutes += 1440;
  } else if (totalMinutes >= 1440) {
    resultDate.setDate(resultDate.getDate() + 1);
    totalMinutes -= 1440;
  }

  // 8. 转换为小时和分钟
  const finalHour = Math.floor(totalMinutes / 60);
  const finalMinute = Math.round(totalMinutes % 60);

  // 9. 设置结果时间
  resultDate.setHours(finalHour, finalMinute, 0, 0);
  return resultDate;
}

/**
 * 计算积日（从1月1日开始的天数）
 * @param {number} year - 年份
 * @param {number} month - 月份
 * @param {number} day - 日期
 * @returns {number} 积日
 */
function calculateDayOfYear(year, month, day) {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let days = 0;
  
  // 计算闰年
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (isLeapYear) {
    monthDays[1] = 29;
  }
  
  // 计算积日
  for (let i = 0; i < month - 1; i++) {
    days += monthDays[i];
  }
  return days + day;
}

/**
 * 计算时差（分钟）
 * @param {number} theta - 日角（弧度）
 * @returns {number} 时差（分钟）
 */
function calculateTimeEquation(theta) {
  // 使用修正后的时差计算公式
  // 时差 = -0.0028 - 1.9857sinθ + 9.9059sin2θ - 7.0924cosθ - 0.6882cos2θ
  const deltaT = 0.0028 - 1.9857 * Math.sin(theta) + 9.9059 * Math.sin(2 * theta) 
    - 7.0924 * Math.cos(theta) - 0.6882 * Math.cos(2 * theta);
  
  console.log('deltaT:', deltaT);
  // 转换为分钟（1度 = 4分钟）
  return Math.round(deltaT * 4 * 60); // deltaT是以小时为单位
}
