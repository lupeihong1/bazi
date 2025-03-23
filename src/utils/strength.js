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

// 地支藏干
const HIDDEN_GAN = {
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "庚", "戊"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
  子: ["癸"],
  丑: ["己", "癸", "辛"]
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
 * 计算地支藏干力量
 * @param {string} dayGan - 日干
 * @param {string} zhi - 地支
 * @returns {number} 力量值
 */
function calculateZhiStrength(dayGan, zhi) {
  if (!dayGan || !zhi) return 0;
  
  const hiddenGans = HIDDEN_GAN[zhi];
  if (!hiddenGans) return 0;
  
  const dayElement = FIVE_ELEMENTS[dayGan];
  if (!dayElement) return 0;
  
  let strength = 0;
  for (const gan of hiddenGans) {
    if (FIVE_ELEMENTS[gan] === dayElement) {
      strength++;
    }
  }
  return strength;
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
  const yearGan = bazi.年柱[0];
  const monthGan = bazi.月柱[0];
  const timeGan = bazi.时柱[0];
  const yearZhi = bazi.年柱[1];
  const monthZhi = bazi.月柱[1];
  const dayZhi = bazi.日柱[1];
  const timeZhi = bazi.时柱[1];

  // 计算各干支力量
  const yearGanStrength = calculateGanStrength(dayGan, yearGan);
  const yearZhiStrength = calculateZhiStrength(dayGan, yearZhi);
  const monthGanStrength = calculateGanStrength(dayGan, monthGan);
  const monthZhiStrength = calculateZhiStrength(dayGan, monthZhi);
  const dayZhiStrength = calculateZhiStrength(dayGan, dayZhi);
  const timeGanStrength = calculateGanStrength(dayGan, timeGan);
  const timeZhiStrength = calculateZhiStrength(dayGan, timeZhi);

  // 计算总分数
  const score = 
    (yearGanStrength * WEIGHTS["年干"]) +
    (yearZhiStrength * WEIGHTS["年支"]) +
    (monthGanStrength * WEIGHTS["月干"]) +
    (monthZhiStrength * WEIGHTS["月支"]) +
    (dayZhiStrength * WEIGHTS["日支"]) +
    (timeGanStrength * WEIGHTS["时干"]) +
    (timeZhiStrength * WEIGHTS["时支"]);

  // 判断身强身弱
  let strength = "";
  let description = "";

  if (score >= 50) {
    strength = "强";
    description = `得分${Math.round(score)}分，大于等于50分，为身强。命主性格刚强，做事果断，但可能过于固执。`;
  } else {
    strength = "弱";
    description = `得分${Math.round(score)}分，低于50分，为身弱。命主性格温和，做事谨慎，但可能优柔寡断。`;
  }

  return {
    strength,
    description,
    details: {
      score: Math.round(score),
      weights: {
        年干: formatValue(yearGanStrength * WEIGHTS["年干"]),
        年支: formatValue(yearZhiStrength * WEIGHTS["年支"]),
        月干: formatValue(monthGanStrength * WEIGHTS["月干"]),
        月支: formatValue(monthZhiStrength * WEIGHTS["月支"]),
        日支: formatValue(dayZhiStrength * WEIGHTS["日支"]),
        时干: formatValue(timeGanStrength * WEIGHTS["时干"]),
        时支: formatValue(timeZhiStrength * WEIGHTS["时支"])
      }
    }
  };
}
