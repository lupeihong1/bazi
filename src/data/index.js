import { destinyData } from './destinyData';
import { destinyDataEn } from './destinyData.en';

/**
 * 根据当前语言获取命理数据
 * @param {string} locale - 语言代码 ('zh-CN' 或 'en-US')
 * @returns {Array} 对应语言的命理数据
 */
export function getDestinyData(locale) {
  return locale === 'en-US' ? destinyDataEn : destinyData;
}

/**
 * 根据语言和key查找特定的命理数据
 * @param {string} key - 命理类型key (如: "身强甲木")
 * @param {string} locale - 语言代码
 * @returns {Object|null} 匹配的命理数据对象
 */
export function findDestinyByKey(key, locale) {
  const data = getDestinyData(locale);
  return data.find(item => item.key === key) || null;
}

