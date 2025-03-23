/**
 * 八字身强身弱判断工具
 */

// 五行属性
const FIVE_ELEMENTS = {
  甲: "木", 乙: "木",
  丙: "火", 丁: "火",
  戊: "土", 己: "土",
  庚: "金", 辛: "金",
  壬: "水", 癸: "水",
  寅: "木", 卯: "木",
  巳: "火", 午: "火",
  辰: "土", 戌: "土", 丑: "土", 未: "土",
  申: "金", 酉: "金",
  亥: "水", 子: "水"
};

// 干支权重
const WEIGHTS = {
  年干: 8,   // 年干8分
  年支: 8,   // 年支8分
  月干: 12,  // 月干12分
  月支: 40,  // 月支40分
  日支: 12,  // 日支12分
  时干: 10,  // 时干10分
  时支: 10   // 时支10分
};

/**
 * 计算天干力量
 * @param {string} dayGan - 日干
 * @param {string} gan - 天干
 * @returns {number} 力量值（1表示同类，0表示不同类）
 */
function calculateGanStrength(dayGan, gan) {
  if (!dayGan || !gan) return 0;
  return FIVE_ELEMENTS[dayGan] === FIVE_ELEMENTS[gan] ? 1 : 0;
}

/**
 * 格式化数值
 */
function formatValue(value) {
  if (isNaN(value) || value === null || value === undefined) return "0.00";
  return value.toFixed(2);
}

/**
 * 判断身强身弱
 */
export function analyzeStrength(bazi) {
  if (!bazi || !bazi.日柱 || !bazi.年柱 || !bazi.月柱 || !bazi.时柱) {
    return {
      strength: "未知",
      description: "八字数据不完整",
      details: {
        score: "0",
        weights: {
          年干: "0.00",
          年支: "0.00",
          月干: "0.00",
          月支: "0.00",
          日支: "0.00",
          时干: "0.00",
          时支: "0.00"
        }
      }
    };
  }

  const dayGan = bazi.日柱[0];
  const dayElement = FIVE_ELEMENTS[dayGan]; // 获取日主五行属性
  const yearGan = bazi.年柱[0];
  const monthGan = bazi.月柱[0];
  const timeGan = bazi.时柱[0];

  // 计算各干支力量
  const yearGanStrength = calculateGanStrength(dayGan, yearGan);
  const monthGanStrength = calculateGanStrength(dayGan, monthGan);
  const timeGanStrength = calculateGanStrength(dayGan, timeGan);

  // 计算总分数（只计算天干）
  const score = 
    (yearGanStrength * WEIGHTS["年干"]) +
    (monthGanStrength * WEIGHTS["月干"]) +
    (timeGanStrength * WEIGHTS["时干"]);

  // 判断身强身弱
  let strength = "";
  let description = "";

  if (score >= 50) {
    strength = "强";
    description = `日主${dayGan}${dayElement}，得分${Math.round(score)}分，大于等于50分，为身强。命主性格刚强，做事果断，但可能过于固执。`;
  } else {
    strength = "弱";
    description = `日主${dayGan}${dayElement}，得分${Math.round(score)}分，低于50分，为身弱。命主性格温和，做事谨慎，但可能优柔寡断。`;
  }

  return {
    strength,
    description,
    details: {
      score: Math.round(score),
      dayElement: dayElement,
      weights: {
        年干: formatValue(yearGanStrength * WEIGHTS["年干"]),
        年支: formatValue(0),
        月干: formatValue(monthGanStrength * WEIGHTS["月干"]),
        月支: formatValue(0),
        日支: formatValue(0),
        时干: formatValue(timeGanStrength * WEIGHTS["时干"]),
        时支: formatValue(0)
      }
    }
  };
}
