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

/**
 * 根据经度计算时区
 * @param {number} longitude - 经度（东经为正，西经为负）
 * @returns {number} 时区偏移（小时）
 */
export function calculateTimezone(longitude) {
  // 将经度转换为时区（每15度一个时区）
  const timezone = Math.round(longitude / 15);
  return timezone;
}

/**
 * 计算任意地点和当地标准时间的真太阳时（True Solar Time）
 * @param {Date} localDate - JavaScript Date 对象（必须是当地"标准时间"，不含夏令时）
 * @param {number} longitude - 经度（东经为正，西经为负）
 * @param {number} timezoneOffset - 时区偏移（单位小时，如日本为 +9，纽约为 -5）
 * @returns {string} 返回格式为 "YYYY-MM-DD HH:mm" 的真太阳时
 */
export function calculateTrueSolarTime(localDate, longitude, timezoneOffset) {
  console.log(localDate,longitude,timezoneOffset)

  // 获取年月日、时分秒
  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1;
  let day = localDate.getDate();
  let hour = localDate.getHours();
  let minute = localDate.getMinutes();

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

  // 3. 计算时区中央经线（例如 UTC+9 → 135°E）
  const standardMeridian = timezoneOffset * 15;

  // 4. 经度修正（每度差异 = 4分钟）
  const longitudeCorrection = (longitude - standardMeridian) * 4; // 单位：分钟

  // 5. 计算总校正时间（分钟）
  const totalCorrection = longitudeCorrection + EoT;

  // 6. 将标准时间转换为分钟
  let totalMinutes = hour * 60 + minute + totalCorrection;

  // 7. 处理跨日（分钟 < 0 或 > 1440）
  let dateObj = new Date(localDate); // 克隆
  if (totalMinutes < 0) {
    dateObj.setDate(dateObj.getDate() - 1);
    totalMinutes += 1440;
  } else if (totalMinutes >= 1440) {
    dateObj.setDate(dateObj.getDate() + 1);
    totalMinutes -= 1440;
  }

  // 8. 转换为小时和分钟格式
  const finalHour = Math.floor(totalMinutes / 60);
  const finalMinute = Math.round(totalMinutes % 60);

  // 9. 格式化日期输出
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  const h = String(finalHour).padStart(2, '0');
  const min = String(finalMinute).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

/**
 * 计算真太阳时（兼容旧版本）
 * @param {Date} date - 北京时间（平太阳时）
 * @param {number} longitude - 经度（东经为正）
 * @param {number} latitude - 纬度（北纬为正）
 * @param {boolean} useSolarTime - 是否使用真太阳时
 * @returns {Date} 真太阳时或原始时间
 */
export function calculateSolarTime(date, longitude, latitude, useSolarTime = false) {
  console.log(date,longitude)
  if (!useSolarTime) return new Date(date);
  
  // 计算时区
  const timezoneOffset = calculateTimezone(longitude);
  
  // 使用新的计算方法
  const solarTimeStr = calculateTrueSolarTime(date, longitude, timezoneOffset);
  return new Date(solarTimeStr);
}
