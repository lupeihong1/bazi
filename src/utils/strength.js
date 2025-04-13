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

// 五行相生关系
const FIVE_ELEMENTS_GENERATING = {
  "木": "火",  // 木生火
  "火": "土",  // 火生土
  "土": "金",  // 土生金
  "金": "水",  // 金生水
  "水": "木"   // 水生木
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
 * @returns {number} 力量值（1表示同类或生助，0表示不同类）
 */
function calculateGanStrength(dayGan, gan) {
  if (!dayGan || !gan) return 0;
  
  const dayElement = FIVE_ELEMENTS[dayGan];
  const ganElement = FIVE_ELEMENTS[gan];
  
  // 同类五行
  if (dayElement === ganElement || FIVE_ELEMENTS_GENERATING[ganElement] === dayElement) {
    return 1;
  }
  
  return 0;
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
    return "未知";
  }

  const dayGan = bazi.日柱[0];
  const dayElement = FIVE_ELEMENTS[dayGan]; // 获取日主五行属性
  const yearGan = bazi.年柱[0];
  const monthGan = bazi.月柱[0];
  const timeGan = bazi.时柱[0];
  const yearZhi = bazi.年柱[1];
  const monthZhi = bazi.月柱[1];
  const dayZhi = bazi.日柱[1];
  const timeZhi = bazi.时柱[1];

  // 计算各干支力量
  const yearGanStrength = calculateGanStrength(dayGan, yearGan);
  const monthGanStrength = calculateGanStrength(dayGan, monthGan);
  const timeGanStrength = calculateGanStrength(dayGan, timeGan);
  const yearZhiStrength = calculateGanStrength(dayGan, yearZhi);
  const monthZhiStrength = calculateGanStrength(dayGan, monthZhi);
  const dayZhiStrength = calculateGanStrength(dayGan, dayZhi);
  const timeZhiStrength = calculateGanStrength(dayGan, timeZhi);

  // 计算总分数（包含天干地支）
  const score = 
    (yearGanStrength * WEIGHTS["年干"]) +
    (monthGanStrength * WEIGHTS["月干"]) +
    (timeGanStrength * WEIGHTS["时干"]) +
    (yearZhiStrength * WEIGHTS["年支"]) +
    (monthZhiStrength * WEIGHTS["月支"]) +
    (dayZhiStrength * WEIGHTS["日支"]) +
    (timeZhiStrength * WEIGHTS["时支"]);

  // 判断身强身弱
  const strength = score >= 50 ? "强" : "弱";
  return `身${strength}${dayGan}${dayElement}`;
}
