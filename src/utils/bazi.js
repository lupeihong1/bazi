/**
 * 八字计算工具
 * 用于计算指定时间点的八字（年柱、月柱、日柱、时柱）
 */

// ============= 基础常量和工具函数 =============
/** 天干数组 */
const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
/** 地支数组 */
const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
/** 每月天数（非闰年） */
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** 二十四节气数据
 * 格式：{月份: [[日期, 节气名], [日期, 节气名]]}
 */
const solarTerms = {
  1: [[6, '小寒'], [20, '大寒']],
  2: [[4, '立春'], [19, '雨水']],
  3: [[6, '惊蛰'], [21, '春分']],
  4: [[5, '清明'], [20, '谷雨']],
  5: [[6, '立夏'], [21, '小满']],
  6: [[6, '芒种'], [21, '夏至']],
  7: [[7, '小暑'], [23, '大暑']],
  8: [[8, '立秋'], [23, '处暑']],
  9: [[8, '白露'], [23, '秋分']],
  10: [[8, '寒露'], [24, '霜降']],
  11: [[7, '立冬'], [22, '小雪']],
  12: [[7, '大雪'], [22, '冬至']]
};

/** 工具函数集合 */
const utils = {
  /**
   * 判断是否为闰年
   * @param {number} year - 年份
   * @returns {boolean} 是否为闰年
   */
  isLeapYear: (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0),
  
  /**
   * 计算当年第几天
   * @param {number} year - 年份
   * @param {number} month - 月份
   * @param {number} day - 日期
   * @returns {number} 当年第几天
   */
  getDayOfYear: (year, month, day) => {
    let days = 0;
    for (let i = 0; i < month - 1; i++) {
      days += monthDays[i];
    }
    if (utils.isLeapYear(year) && month > 2) {
      days += 1;
    }
    return days + day;
  },

  /**
   * 获取当前节气
   * @param {number} month - 月份
   * @param {number} day - 日期
   * @returns {string} 节气名称
   */
  getSolarTerm: (month, day) => {
    const terms = solarTerms[month];
    if (day >= terms[0][0] && day < terms[1][0]) {
      return terms[0][1];
    } else if (day >= terms[1][0]) {
      return terms[1][1];
    } else {
      const lastMonth = month - 1 === 0 ? 12 : month - 1;
      return solarTerms[lastMonth][1][1];
    }
  },

  /**
   * 获取天干对应的数字（1-10）
   * @param {string} gan - 天干
   * @returns {number} 天干对应的数字
   */
  getGanNumber: (gan) => ({
    '甲': 1, '乙': 2, '丙': 3, '丁': 4, '戊': 5,
    '己': 6, '庚': 7, '辛': 8, '壬': 9, '癸': 10
  })[gan],

  /**
   * 获取地支对应的数字（1-12）
   * @param {string} zhi - 地支
   * @returns {number} 地支对应的数字
   */
  getZhiNumber: (zhi) => ({
    '子': 1, '丑': 2, '寅': 3, '卯': 4, '辰': 5, '巳': 6,
    '午': 7, '未': 8, '申': 9, '酉': 10, '戌': 11, '亥': 12
  })[zhi],

  /**
   * 判断天干是否为阴干
   * @param {string} gan - 天干
   * @returns {boolean} 是否为阴干
   */
  isYinGan: (gan) => ['乙', '丁', '己', '辛', '癸'].includes(gan),

  /**
   * 判断地支是否为阴支
   * @param {string} zhi - 地支
   * @returns {boolean} 是否为阴支
   */
  isYinZhi: (zhi) => ['丑', '卯', '巳', '未', '酉', '亥'].includes(zhi)
};

// ============= 年柱计算模块 =============
/** 年柱计算器 */
const yearPillarCalculator = {
  /**
   * 计算年柱
   * @param {number} year - 年份
   * @param {number} month - 月份
   * @param {number} day - 日期
   * @returns {{gan: string, zhi: string}} 年柱的天干地支
   */
  calculate: (year, month, day) => {
    // 判断是否过了立春
    const term = utils.getSolarTerm(month, day);
    // 如果还没有立春，年柱还要用上一年
    if (month === 2 && day < 4 || month === 1) {
      year = year - 1;
    }

    // 年干计算
    const lastDigit = year % 10;
    const ganMap = {
      4: '甲', 5: '乙', 6: '丙', 7: '丁', 8: '戊',
      9: '己', 0: '庚', 1: '辛', 2: '壬', 3: '癸'
    };
    const yearGan = ganMap[lastDigit];

    // 年支计算
    let zhiIndex = (year - 3) % 12;
    if (zhiIndex === 0) zhiIndex = 12;
    const yearZhi = zhi[zhiIndex - 1];

    return { gan: yearGan, zhi: yearZhi };
  }
};

// ============= 月柱计算模块 =============
/** 月柱计算器 */
const monthPillarCalculator = {
  /**
   * 根据节气获取月支索引
   * @param {string} currentTerm - 当前节气
   * @returns {number} 月支索引
   */
  getMonthZhiIndex: (currentTerm) => {
    const termToIndex = {
      '立春': 2, '雨水': 2,    // 寅月
      '惊蛰': 3, '春分': 3,    // 卯月
      '清明': 4, '谷雨': 4,    // 辰月
      '立夏': 5, '小满': 5,    // 巳月
      '芒种': 6, '夏至': 6,    // 午月
      '小暑': 7, '大暑': 7,    // 未月
      '立秋': 8, '处暑': 8,    // 申月
      '白露': 9, '秋分': 9,    // 酉月
      '寒露': 10, '霜降': 10,  // 戌月
      '立冬': 11, '小雪': 11,  // 亥月
      '大雪': 0, '冬至': 0,    // 子月
      '小寒': 1, '大寒': 1     // 丑月
    };
    return termToIndex[currentTerm];
  },

  /**
   * 根据年干和月支计算月干
   * @param {string} yearGan - 年干
   * @param {string} monthZhi - 月支
   * @returns {string} 月干
   */
  getMonthGan: (yearGan, monthZhi) => {
    const yearGanStartIndex = {
      '甲': 2, '乙': 4, '丙': 6, '丁': 8, '戊': 0,
      '己': 2, '庚': 4, '辛': 6, '壬': 8, '癸': 0
    };

    const monthZhiIndex = {
      '寅': 0, '卯': 1, '辰': 2, '巳': 3, '午': 4, '未': 5,
      '申': 6, '酉': 7, '戌': 8, '亥': 9, '子': 10, '丑': 11
    };

    const startIndex = yearGanStartIndex[yearGan];
    const monthIndex = monthZhiIndex[monthZhi];
    const monthGanIndex = (startIndex + monthIndex) % 10;
    
    return gan[monthGanIndex];
  },

  /**
   * 计算月柱
   * @param {string} yearGan - 年干
   * @param {number} month - 月份
   * @param {number} day - 日期
   * @returns {{gan: string, zhi: string}} 月柱的天干地支
   */
  calculate: (yearGan, month, day) => {
    const currentTerm = utils.getSolarTerm(month, day);
    const monthIndex = monthPillarCalculator.getMonthZhiIndex(currentTerm);
    const monthZhi = zhi[monthIndex];
    const monthGan = monthPillarCalculator.getMonthGan(yearGan, monthZhi);
    
    return { gan: monthGan, zhi: monthZhi };
  }
};

// ============= 日柱计算模块 =============
/** 日柱计算器 */
const dayPillarCalculator = {
  /**
   * 计算日柱
   * @param {Date} date - 日期对象
   * @returns {{gan: string, zhi: string}} 日柱的天干地支
   */
  calculate: (date) => {
    // 获取时间信息
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();

    // 23:00-23:59都算第二天
    let targetDate = new Date(date);
    if (hour === 23) {
      targetDate.setDate(day + 1);
    }

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth() + 1;
    const targetDay = targetDate.getDate();
    
    const dayOfYear = utils.getDayOfYear(targetYear, targetMonth, targetDay);
    const yearMinus1 = targetYear - 1;
    const total = yearMinus1 * 5 + Math.floor(yearMinus1 / 4) + dayOfYear;
    const remainder = total % 60;
    
    let ganIndex = remainder % 10;
    let zhiIndex = remainder % 12;
    
    if (ganIndex === 0) ganIndex = 10;
    if (zhiIndex === 0) zhiIndex = 12;
    
    ganIndex = (ganIndex - 1) % 10;
    zhiIndex = (zhiIndex - 1) % 12;
    
    return {
      gan: gan[ganIndex],
      zhi: zhi[zhiIndex]
    };
  }
};

// ============= 时柱计算模块 =============
/** 时柱计算器 */
const timePillarCalculator = {
  /**
   * 计算时柱
   * @param {number} hour - 小时（24小时制）
   * @param {number} minute - 分钟
   * @param {string} dayGan - 日干
   * @returns {{gan: string, zhi: string}} 时柱的天干地支
   */
  calculate: (hour, minute, dayGan) => {
    // 子时：23:00-00:59，统一用0点代表
    if (hour === 23) {
      hour = 0;
    }
    
    const timeZhiIndex = Math.floor((hour + 1) / 2) % 12;
    const timeZhi = zhi[timeZhiIndex];
    const dayGanIndex = gan.indexOf(dayGan);
    const timeGanIndex = (dayGanIndex * 2 + timeZhiIndex) % 10;
    const timeGan = gan[timeGanIndex];
    
    return { gan: timeGan, zhi: timeZhi };
  }
};

// ============= 主函数 =============
/**
 * 计算八字
 * @param {string|Date} dateTime - 日期时间字符串或Date对象
 * @param {boolean} useSolarTime - 是否使用真太阳时
 * @param {number} [longitude] - 经度，仅在使用真太阳时时需要
 * @param {number} [latitude] - 纬度，仅在使用真太阳时时需要
 * @returns {{
 *   年柱: string,
 *   月柱: string,
 *   日柱: string,
 *   时柱: string
 * }} 八字结果
 */
export function calculateBaZi(dateTime, useSolarTime = false, longitude, latitude) {
  let date = new Date(dateTime);
  
  // 如果使用真太阳时且提供了经纬度，则计算真太阳时
  if (useSolarTime && longitude !== undefined && latitude !== undefined) {
    const { calculateSolarTime } = require('./solarTime');
    date = calculateSolarTime(date, longitude, latitude, true);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  // 计算年柱
  const yearPillar = yearPillarCalculator.calculate(year, month, day);
  
  // 计算月柱
  const monthPillar = monthPillarCalculator.calculate(yearPillar.gan, month, day);
  
  // 计算日柱
  const dayPillar = dayPillarCalculator.calculate(date);
  
  // 计算时柱
  const timePillar = timePillarCalculator.calculate(hour, minute, dayPillar.gan);

  return {
    年柱: `${yearPillar.gan}${yearPillar.zhi}`,
    月柱: `${monthPillar.gan}${monthPillar.zhi}`,
    日柱: `${dayPillar.gan}${dayPillar.zhi}`,
    时柱: `${timePillar.gan}${timePillar.zhi}`
  };
} 