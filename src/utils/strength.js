/**
 * 八字身强身弱判断工具
 */

// 五行生克关系
const FIVE_ELEMENTS = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
  '申': '金', '酉': '金',
  '亥': '水', '子': '水'
};

// 地支藏干
const HIDDEN_GAN = {
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
  '子': ['癸'],
  '丑': ['己', '癸', '辛']
};

// 干支权重
const WEIGHTS = {
  '年干': 8,   // 年干8%
  '年支': 8,   // 年支8%
  '月干': 12,  // 月干12%
  '月支': 40,  // 月支40%
  '日支': 12,  // 日支12%
  '时干': 10,  // 时干10%
  '时支': 10   // 时支10%
};

/**
 * 计算五行力量
 * @param {string} dayGan - 日干
 * @param {string} gan - 天干
 * @param {string} zhi - 地支
 * @returns {number} 力量值（1表示生助，-1表示克制，0表示无关）
 */
function calculateElementStrength(dayGan, gan, zhi) {
  if (!dayGan || !gan) return 0;
  
  const dayElement = FIVE_ELEMENTS[dayGan];
  const ganElement = FIVE_ELEMENTS[gan];
  const zhiElement = zhi ? FIVE_ELEMENTS[zhi] : null;
  
  if (!dayElement || !ganElement) return 0;
  
  // 五行生克关系
  const elementRelations = {
    '木': { '木': 1, '水': 1, '火': -1, '金': -1, '土': 0 },
    '火': { '火': 1, '木': 1, '水': -1, '金': 0, '土': -1 },
    '土': { '土': 1, '火': 1, '木': -1, '金': 1, '水': -1 },
    '金': { '金': 1, '土': 1, '木': -1, '火': 0, '水': 1 },
    '水': { '水': 1, '金': 1, '火': -1, '土': -1, '木': 0 }
  };
  
  const ganStrength = elementRelations[dayElement][ganElement] || 0;
  const zhiStrength = zhiElement ? (elementRelations[dayElement][zhiElement] || 0) : 0;
  
  return (ganStrength + zhiStrength) / 2;
}

/**
 * 计算地支藏干力量
 * @param {string} dayGan - 日干
 * @param {string} zhi - 地支
 * @returns {number} 力量值
 */
function calculateHiddenGanStrength(dayGan, zhi) {
  if (!dayGan || !zhi) return 0;
  
  const hiddenGans = HIDDEN_GAN[zhi];
  if (!hiddenGans || hiddenGans.length === 0) return 0;
  
  const dayElement = FIVE_ELEMENTS[dayGan];
  if (!dayElement) return 0;
  
  let totalStrength = 0;
  let count = 0;
  
  for (const gan of hiddenGans) {
    const element = FIVE_ELEMENTS[gan];
    if (!element) continue;
    
    // 五行生克关系
    const elementRelations = {
      '木': { '木': 1, '水': 1, '火': -1, '金': -1, '土': 0 },
      '火': { '火': 1, '木': 1, '水': -1, '金': 0, '土': -1 },
      '土': { '土': 1, '火': 1, '木': -1, '金': 1, '水': -1 },
      '金': { '金': 1, '土': 1, '木': -1, '火': 0, '水': 1 },
      '水': { '水': 1, '金': 1, '火': -1, '土': -1, '木': 0 }
    };
    
    const strength = elementRelations[dayElement][element] || 0;
    if (strength !== 0) {
      totalStrength += strength;
      count++;
    }
  }
  
  return count > 0 ? totalStrength / count : 0;
}

/**
 * 格式化数值，确保不会出现 NaN
 * @param {number} value - 要格式化的数值
 * @returns {string} 格式化后的字符串
 */
function formatValue(value) {
  if (isNaN(value) || value === null || value === undefined) return '0.00';
  return value.toFixed(2);
}

/**
 * 判断身强身弱
 * @param {Object} bazi - 八字对象
 * @returns {Object} 身强身弱分析结果
 */
export function analyzeStrength(bazi) {
  if (!bazi || !bazi.日柱 || !bazi.年柱 || !bazi.月柱 || !bazi.时柱) {
    return {
      strength: '未知',
      description: '八字数据不完整',
      details: {
        totalStrength: '0.00',
        score: '0',
        weights: {
          '年干': '0.00',
          '年支': '0.00',
          '月干': '0.00',
          '月支': '0.00',
          '日支': '0.00',
          '时干': '0.00',
          '时支': '0.00'
        },
        elements: {
          '木': '0.00',
          '火': '0.00',
          '土': '0.00',
          '金': '0.00',
          '水': '0.00'
        }
      }
    };
  }

  const dayGan = bazi.日柱[0];
  const yearGan = bazi.年柱[0];
  const monthGan = bazi.月柱[0];
  const timeGan = bazi.时柱[0];
  const yearZhi = bazi.年柱[1];
  const monthZhi = bazi.月柱[1];
  const dayZhi = bazi.日柱[1];
  const timeZhi = bazi.时柱[1];
  
  // 计算各干支力量
  const yearGanStrength = calculateElementStrength(dayGan, yearGan, '');
  const yearZhiStrength = calculateHiddenGanStrength(dayGan, yearZhi);
  const monthGanStrength = calculateElementStrength(dayGan, monthGan, '');
  const monthZhiStrength = calculateHiddenGanStrength(dayGan, monthZhi);
  const dayZhiStrength = calculateHiddenGanStrength(dayGan, dayZhi);
  const timeGanStrength = calculateElementStrength(dayGan, timeGan, '');
  const timeZhiStrength = calculateHiddenGanStrength(dayGan, timeZhi);
  
  // 计算总力量（考虑权重）
  const totalStrength = 
    yearGanStrength * (WEIGHTS['年干'] / 100) +
    yearZhiStrength * (WEIGHTS['年支'] / 100) +
    monthGanStrength * (WEIGHTS['月干'] / 100) +
    monthZhiStrength * (WEIGHTS['月支'] / 100) +
    dayZhiStrength * (WEIGHTS['日支'] / 100) +
    timeGanStrength * (WEIGHTS['时干'] / 100) +
    timeZhiStrength * (WEIGHTS['时支'] / 100);
  
  // 计算分数（将力量值映射到0-100分）
  const score = Math.max(0, Math.min(100, (totalStrength + 1) * 50));
  
  // 计算五行属性力量
  const elements = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0
  };
  
  // 计算天干五行力量
  const calculateGanElementStrength = (gan) => {
    if (!gan) return 0;
    const element = FIVE_ELEMENTS[gan];
    return element ? 1 : 0;
  };
  
  // 计算地支藏干五行力量
  const calculateZhiElementStrength = (zhi) => {
    if (!zhi) return 0;
    const hiddenGans = HIDDEN_GAN[zhi];
    if (!hiddenGans) return 0;
    return hiddenGans.length;
  };
  
  // 累加各干支的五行力量
  elements[FIVE_ELEMENTS[yearGan]] += calculateGanElementStrength(yearGan) * (WEIGHTS['年干'] / 100);
  elements[FIVE_ELEMENTS[yearZhi]] += calculateZhiElementStrength(yearZhi) * (WEIGHTS['年支'] / 100);
  elements[FIVE_ELEMENTS[monthGan]] += calculateGanElementStrength(monthGan) * (WEIGHTS['月干'] / 100);
  elements[FIVE_ELEMENTS[monthZhi]] += calculateZhiElementStrength(monthZhi) * (WEIGHTS['月支'] / 100);
  elements[FIVE_ELEMENTS[dayZhi]] += calculateZhiElementStrength(dayZhi) * (WEIGHTS['日支'] / 100);
  elements[FIVE_ELEMENTS[timeGan]] += calculateGanElementStrength(timeGan) * (WEIGHTS['时干'] / 100);
  elements[FIVE_ELEMENTS[timeZhi]] += calculateZhiElementStrength(timeZhi) * (WEIGHTS['时支'] / 100);
  
  // 判断身强身弱
  let strength = '';
  let description = '';
  
  if (score > 60) {
    strength = '强';
    description = `得分${Math.round(score)}分，超过60分，为身强。命主性格刚强，做事果断，但可能过于固执。`;
  } else if (score > 40) {
    strength = '均衡';
    description = `得分${Math.round(score)}分，在40-60分之间，为身均衡。命主性格平和，做事稳重。`;
  } else {
    strength = '弱';
    description = `得分${Math.round(score)}分，低于40分，为身弱。命主性格温和，做事谨慎，但可能优柔寡断。`;
  }
  
  return {
    strength,
    description,
    details: {
      totalStrength: formatValue(totalStrength * 100),
      score: Math.round(score),
      weights: {
        '年干': formatValue(yearGanStrength * (WEIGHTS['年干'] / 100) * 100),
        '年支': formatValue(yearZhiStrength * (WEIGHTS['年支'] / 100) * 100),
        '月干': formatValue(monthGanStrength * (WEIGHTS['月干'] / 100) * 100),
        '月支': formatValue(monthZhiStrength * (WEIGHTS['月支'] / 100) * 100),
        '日支': formatValue(dayZhiStrength * (WEIGHTS['日支'] / 100) * 100),
        '时干': formatValue(timeGanStrength * (WEIGHTS['时干'] / 100) * 100),
        '时支': formatValue(timeZhiStrength * (WEIGHTS['时支'] / 100) * 100)
      },
      elements: {
        '木': formatValue(elements['木'] * 100),
        '火': formatValue(elements['火'] * 100),
        '土': formatValue(elements['土'] * 100),
        '金': formatValue(elements['金'] * 100),
        '水': formatValue(elements['水'] * 100)
      }
    }
  };
} 