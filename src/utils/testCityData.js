/**
 * 测试城市数据功能
 */

import {
  getAllCitiesData,
  getChinaCities,
  getNorthernHemisphereCities,
  searchCities,
  getAllCountries,
  getMajorCities
} from './cityData';

// 测试获取所有城市数据
console.log('=== 测试城市数据功能 ===');

// 1. 获取所有城市数量
const allCities = getAllCitiesData();
console.log(`总城市数量: ${allCities.length}`);

// 2. 获取中国城市
const chinaCities = getChinaCities();
console.log(`中国城市数量: ${chinaCities.length}`);
console.log('中国城市示例:', chinaCities.slice(0, 5).map(city => city.name));

// 3. 获取北半球城市
const northernCities = getNorthernHemisphereCities();
console.log(`北半球城市数量: ${northernCities.length}`);

// 4. 搜索城市
const searchResults = searchCities('北京');
console.log('搜索"北京"结果:', searchResults);

// 5. 获取所有国家
const countries = getAllCountries();
console.log(`国家数量: ${countries.length}`);
console.log('国家示例:', countries.slice(0, 10).map(country => `${country.name}(${country.code})`));

// 6. 获取主要城市
const majorCities = getMajorCities();
console.log(`主要城市数量(人口>100万): ${majorCities.length}`);
console.log('主要城市示例:', majorCities.slice(0, 5).map(city => `${city.name}(${city.country_name})`));

// 7. 显示城市数据结构
if (allCities.length > 0) {
  console.log('\n城市数据结构示例:');
  console.log(allCities[0]);
}

console.log('\n=== 测试完成 ==='); 