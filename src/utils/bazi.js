// 天干
const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 每月天数（非闰年）
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 计算某年是否闰年
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 计算当年第几天
function getDayOfYear(year, month, day) {
  let days = 0;
  // 计算整月的天数
  for (let i = 0; i < month - 1; i++) {
    days += monthDays[i];
  }
  // 如果是闰年且过了2月，加一天
  if (isLeapYear(year) && month > 2) {
    days += 1;
  }
  // 加上当月天数
  days += day;
  return days;
}

// 二十四节气数据
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

// 节气对应的月份（节气:月份）
const solarTermMonth = {
  '立春': 1, '雨水': 1,
  '惊蛰': 2, '春分': 2,
  '清明': 3, '谷雨': 3,
  '立夏': 4, '小满': 4,
  '芒种': 5, '夏至': 5,
  '小暑': 6, '大暑': 6,
  '立秋': 7, '处暑': 7,
  '白露': 8, '秋分': 8,
  '寒露': 9, '霜降': 9,
  '立冬': 10, '小雪': 10,
  '大雪': 11, '冬至': 11,
  '小寒': 12, '大寒': 12
};

// 获取当前节气
function getSolarTerm(month, day) {
  const terms = solarTerms[month];
  if (day >= terms[0][0] && day < terms[1][0]) {
    return terms[0][1];
  } else if (day >= terms[1][0]) {
    return terms[1][1];
  } else {
    // 如果日期小于本月第一个节气，应该算上个月的后一个节气
    const lastMonth = month - 1 === 0 ? 12 : month - 1;
    return solarTerms[lastMonth][1][1];
  }
}

// 计算年柱
function calculateYearPillar(year, month, day) {
  // 判断是否过了立春
  const term = getSolarTerm(month, day);
  // 如果还没有立春，年柱还要用上一年
  if (month === 2 && day < 4 || month === 1) {
    year = year - 1;
  }

  // 年干计算：年份尾数4甲、5乙、6丙、7丁、8戊、9己、0庚、1辛、2壬、3癸
  const lastDigit = year % 10;
  const ganMap = {
    4: '甲', 5: '乙', 6: '丙', 7: '丁', 8: '戊',
    9: '己', 0: '庚', 1: '辛', 2: '壬', 3: '癸'
  };
  const yearGan = ganMap[lastDigit];

  // 年支计算：年份减3除以12取余
  let zhiIndex = (year - 3) % 12;
  if (zhiIndex === 0) zhiIndex = 12;
  const yearZhi = zhi[zhiIndex - 1];

  console.log('年柱计算过程：');
  console.log('年份：', year, '(考虑节气后)');
  console.log('年尾数：', lastDigit);
  console.log('天干：', yearGan);
  console.log('地支余数：', zhiIndex, '对应', yearZhi);
  console.log('最终年柱：', yearGan + yearZhi);

  return {
    gan: yearGan,
    zhi: yearZhi
  };
}

// 获取天干对应的数字（1-10）
function getGanNumber(gan) {
  const ganNumbers = {
    '甲': 1, '乙': 2, '丙': 3, '丁': 4, '戊': 5,
    '己': 6, '庚': 7, '辛': 8, '壬': 9, '癸': 10
  };
  return ganNumbers[gan];
}

// 获取地支对应的数字（1-12）
function getZhiNumber(zhi) {
  const zhiNumbers = {
    '子': 1, '丑': 2, '寅': 3, '卯': 4, '辰': 5, '巳': 6,
    '午': 7, '未': 8, '申': 9, '酉': 10, '戌': 11, '亥': 12
  };
  return zhiNumbers[zhi];
}

// 获取月干
function getMonthGan(yearGan, monthZhi) {
  // 年干对应的起始月干索引
  const yearGanStartIndex = {
    '甲': 2, // 甲年起丙寅
    '乙': 4, // 乙年起戊寅
    '丙': 6, // 丙年起庚寅
    '丁': 8, // 丁年起壬寅
    '戊': 0, // 戊年起甲寅
    '己': 2, // 己年起丙寅
    '庚': 4, // 庚年起戊寅
    '辛': 6, // 辛年起庚寅
    '壬': 8, // 壬年起壬寅
    '癸': 0  // 癸年起甲寅
  };

  // 月支对应的序号（寅为正月，起始为0）
  const monthZhiIndex = {
    '寅': 0, '卯': 1, '辰': 2, '巳': 3, '午': 4, '未': 5,
    '申': 6, '酉': 7, '戌': 8, '亥': 9, '子': 10, '丑': 11
  };

  // 获取该年对应的起始月干索引
  const startIndex = yearGanStartIndex[yearGan];
  
  // 获取月支的序号
  const monthIndex = monthZhiIndex[monthZhi];
  
  // 计算最终月干索引
  const monthGanIndex = (startIndex + monthIndex) % 10;

  console.log('月干计算详细过程：');
  console.log('年干：', yearGan);
  console.log('月支：', monthZhi);
  console.log('年干对应的起始月干索引：', startIndex);
  console.log('月支序号：', monthIndex);
  console.log('最终月干索引：', monthGanIndex);
  
  const result = gan[monthGanIndex];
  console.log('对应月干：', result);
  console.log('最终月柱：', result + monthZhi);
  
  return result;
}

// 判断天干的阴阳
function isYinGan(gan) {
  // 乙丁己辛癸为阴干
  return ['乙', '丁', '己', '辛', '癸'].includes(gan);
}

// 判断地支的阴阳
function isYinZhi(zhi) {
  // 丑卯巳未酉亥为阴支
  return ['丑', '卯', '巳', '未', '酉', '亥'].includes(zhi);
}

// 计算日柱
function calculateDayPillar(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 计算当年日数
  const dayOfYear = getDayOfYear(year, month, day);
  
  // 计算干支
  // { (公元年数-1)×5+(公元年数-1)÷4+当年日数} ÷60
  const yearMinus1 = year - 1;
  const total = yearMinus1 * 5 + Math.floor(yearMinus1 / 4) + dayOfYear;
  const remainder = total % 60;
  
  // 计算天干和地支的序号
  // 注意：这里的序号从1开始，所以余数0要特殊处理
  let ganIndex = remainder % 10;
  let zhiIndex = remainder % 12;
  
  // 处理余数为0的情况
  if (ganIndex === 0) ganIndex = 10;
  if (zhiIndex === 0) zhiIndex = 12;
  
  // 因为数组索引从0开始，所以要减1
  ganIndex = (ganIndex - 1) % 10;
  zhiIndex = (zhiIndex - 1) % 12;
  
  // 添加调试信息
  console.log('日柱计算过程：');
  console.log('年份：', year);
  console.log('当年日数：', dayOfYear);
  console.log('计算公式结果：', total);
  console.log('余数：', remainder);
  console.log('天干序号：', ganIndex + 1);
  console.log('地支序号：', zhiIndex + 1);
  console.log('计算得到的日柱：', gan[ganIndex] + zhi[zhiIndex]);
  
  return {
    gan: gan[ganIndex],
    zhi: zhi[zhiIndex]
  };
}

// 计算八字的主函数
export function calculateBaZi(dateTime) {
  const date = new Date(dateTime);
  
  // 获取年、月、日、时
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  // 计算年柱（考虑节气）
  const yearPillar = calculateYearPillar(year, month, day);
  const yearGan = yearPillar.gan;
  const yearZhi = yearPillar.zhi;
  
  // 获取当前节气
  const currentTerm = getSolarTerm(month, day);
  
  // 计算月支
  // 根据节气确定月支
  let monthIndex;
  switch(currentTerm) {
    case '立春':
    case '雨水':
      monthIndex = 2; // 寅月
      break;
    case '惊蛰':
    case '春分':
      monthIndex = 3; // 卯月
      break;
    case '清明':
    case '谷雨':
      monthIndex = 4; // 辰月
      break;
    case '立夏':
    case '小满':
      monthIndex = 5; // 巳月
      break;
    case '芒种':
    case '夏至':
      monthIndex = 6; // 午月
      break;
    case '小暑':
    case '大暑':
      monthIndex = 7; // 未月
      break;
    case '立秋':
    case '处暑':
      monthIndex = 8; // 申月
      break;
    case '白露':
    case '秋分':
      monthIndex = 9; // 酉月
      break;
    case '寒露':
    case '霜降':
      monthIndex = 10; // 戌月
      break;
    case '立冬':
    case '小雪':
      monthIndex = 11; // 亥月
      break;
    case '大雪':
    case '冬至':
      monthIndex = 0; // 子月
      break;
    default: // 小寒、大寒
      monthIndex = 1; // 丑月
  }
  
  const monthZhi = zhi[monthIndex];
  
  // 计算月干（使用新公式）
  const monthGan = getMonthGan(yearGan, monthZhi);

  console.log('八字计算验证：');
  console.log('年份：', year);
  console.log('节气：', currentTerm);
  console.log('年干：', yearGan);
  console.log('月支：', monthZhi);
  console.log('月柱：', monthGan + monthZhi);

  // 计算日柱
  const dayPillar = calculateDayPillar(date);
  const dayGan = dayPillar.gan;
  const dayZhi = dayPillar.zhi;

  // 计算时柱
  const timeZhiIndex = Math.floor((hour + 1) / 2) % 12;
  const timeZhi = zhi[timeZhiIndex];
  const dayGanIndex = gan.indexOf(dayGan);
  const timeGanIndex = (dayGanIndex * 2 + timeZhiIndex) % 10;
  const timeGan = gan[timeGanIndex];

  // 添加调试信息
  console.log('完整八字计算结果:');
  console.log('年柱:', yearGan + yearZhi);
  console.log('月柱:', monthGan + monthZhi);
  console.log('日柱:', dayGan + dayZhi);
  console.log('时柱:', timeGan + timeZhi);

  return {
    年柱: `${yearGan}${yearZhi}`,
    月柱: `${monthGan}${monthZhi}`,
    日柱: `${dayGan}${dayZhi}`,
    时柱: `${timeGan}${timeZhi}`,
  };
} 