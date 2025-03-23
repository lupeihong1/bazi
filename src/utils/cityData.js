/**
 * 城市数据工具
 */

// 城市数据
const cities = [
  // 中国城市
  { 
    name: "北京", 
    province: "北京市", 
    country: "中国", 
    districts: [
      { name: "东城区", longitude: 116.4166, latitude: 39.9288 },
      { name: "西城区", longitude: 116.3666, latitude: 39.9155 },
      { name: "朝阳区", longitude: 116.4977, latitude: 39.9284 },
      { name: "海淀区", longitude: 116.2988, latitude: 39.9591 },
      { name: "丰台区", longitude: 116.2873, latitude: 39.8585 },
      { name: "石景山区", longitude: 116.2229, latitude: 39.9056 },
      { name: "通州区", longitude: 116.6564, latitude: 39.9097 },
      { name: "顺义区", longitude: 116.6546, latitude: 40.1302 }
    ],
    longitude: 116.4074,
    latitude: 39.9042
  },
  { 
    name: "上海", 
    province: "上海市", 
    country: "中国", 
    districts: [
      { name: "黄浦区", longitude: 121.4846, latitude: 31.2317 },
      { name: "徐汇区", longitude: 121.4367, latitude: 31.1885 },
      { name: "长宁区", longitude: 121.4242, latitude: 31.2204 },
      { name: "静安区", longitude: 121.4484, latitude: 31.2288 },
      { name: "普陀区", longitude: 121.3952, latitude: 31.2495 },
      { name: "虹口区", longitude: 121.4882, latitude: 31.2788 },
      { name: "杨浦区", longitude: 121.5260, latitude: 31.2595 },
      { name: "浦东新区", longitude: 121.5447, latitude: 31.2224 }
    ],
    longitude: 121.4737,
    latitude: 31.2304
  },
  { 
    name: "广州", 
    province: "广东省", 
    country: "中国", 
    districts: [
      { name: "越秀区", longitude: 113.2668, latitude: 23.1289 },
      { name: "海珠区", longitude: 113.3172, latitude: 23.0838 },
      { name: "荔湾区", longitude: 113.2442, latitude: 23.0931 },
      { name: "天河区", longitude: 113.3610, latitude: 23.1247 },
      { name: "白云区", longitude: 113.2732, latitude: 23.1566 },
      { name: "黄埔区", longitude: 113.4588, latitude: 23.1064 }
    ],
    longitude: 113.2644,
    latitude: 23.1291
  },
  { 
    name: "深圳", 
    province: "广东省", 
    country: "中国", 
    districts: [
      { name: "福田区", longitude: 114.0579, latitude: 22.5431 },
      { name: "罗湖区", longitude: 114.1315, latitude: 22.5484 },
      { name: "南山区", longitude: 113.9302, latitude: 22.5329 },
      { name: "宝安区", longitude: 113.8838, latitude: 22.5550 },
      { name: "龙岗区", longitude: 114.2477, latitude: 22.7204 },
      { name: "龙华区", longitude: 114.0360, latitude: 22.6877 }
    ],
    longitude: 114.0579,
    latitude: 22.5431
  },
  { 
    name: "成都", 
    province: "四川省", 
    country: "中国", 
    districts: [
      { name: "锦江区", longitude: 104.0803, latitude: 30.6571 },
      { name: "青羊区", longitude: 104.0622, latitude: 30.6739 },
      { name: "金牛区", longitude: 104.0524, latitude: 30.6913 },
      { name: "武侯区", longitude: 104.0433, latitude: 30.6423 },
      { name: "成华区", longitude: 104.1010, latitude: 30.6599 }
    ],
    longitude: 104.0668,
    latitude: 30.5728
  },
  { name: "重庆", province: "重庆市", country: "中国", longitude: 106.5516, latitude: 29.5630 },
  { name: "杭州", province: "浙江省", country: "中国", longitude: 120.1551, latitude: 30.2741 },
  { name: "南京", province: "江苏省", country: "中国", longitude: 118.7969, latitude: 32.0603 },
  { name: "武汉", province: "湖北省", country: "中国", longitude: 114.3055, latitude: 30.5928 },
  { name: "西安", province: "陕西省", country: "中国", longitude: 108.9402, latitude: 34.3416 },
  { name: "长沙", province: "湖南省", country: "中国", longitude: 112.9388, latitude: 28.2282 },
  { name: "郑州", province: "河南省", country: "中国", longitude: 113.6254, latitude: 34.7466 },
  { name: "天津", province: "天津市", country: "中国", longitude: 117.1901, latitude: 39.1254 },
  { name: "苏州", province: "江苏省", country: "中国", longitude: 120.5853, latitude: 31.2989 },
  { name: "青岛", province: "山东省", country: "中国", longitude: 120.3826, latitude: 36.0671 },
  { name: "济南", province: "山东省", country: "中国", longitude: 117.1205, latitude: 36.6510 },
  { name: "大连", province: "辽宁省", country: "中国", longitude: 121.6147, latitude: 38.9140 },
  { name: "沈阳", province: "辽宁省", country: "中国", longitude: 123.4315, latitude: 41.8057 },
  { name: "哈尔滨", province: "黑龙江省", country: "中国", longitude: 126.6424, latitude: 45.7574 },
  { name: "长春", province: "吉林省", country: "中国", longitude: 125.3245, latitude: 43.8868 },

  // 加拿大城市
  { 
    name: "温哥华", 
    province: "不列颠哥伦比亚省", 
    country: "加拿大", 
    districts: [
      { name: "温哥华市中心", longitude: -123.1207, latitude: 49.2827 },
      { name: "基斯兰奴", longitude: -123.1560, latitude: 49.2683 },
      { name: "西区", longitude: -123.1980, latitude: 49.2880 },
      { name: "耶鲁镇", longitude: -123.1093, latitude: 49.2762 }
    ],
    longitude: -123.1207,
    latitude: 49.2827
  },
  { 
    name: "多伦多", 
    province: "安大略省", 
    country: "加拿大", 
    districts: [
      { name: "市中心区", longitude: -79.3832, latitude: 43.6532 },
      { name: "北约克区", longitude: -79.3462, latitude: 43.7615 },
      { name: "士嘉堡区", longitude: -79.2590, latitude: 43.7764 },
      { name: "伊东区", longitude: -79.3297, latitude: 43.6769 }
    ],
    longitude: -79.3832,
    latitude: 43.6532
  },
  { name: "蒙特利尔", province: "魁北克省", country: "加拿大", longitude: -73.5673, latitude: 45.5017 },
  { name: "卡尔加里", province: "艾伯塔省", country: "加拿大", longitude: -114.0719, latitude: 51.0447 },
  { name: "渥太华", province: "安大略省", country: "加拿大", longitude: -75.6972, latitude: 45.4215 },
  { name: "埃德蒙顿", province: "艾伯塔省", country: "加拿大", longitude: -113.4938, latitude: 53.5461 },
  { name: "维多利亚", province: "不列颠哥伦比亚省", country: "加拿大", longitude: -123.3656, latitude: 48.4284 },
  { name: "魁北克城", province: "魁北克省", country: "加拿大", longitude: -71.2108, latitude: 46.8139 }
];

/**
 * 获取所有城市
 * @returns {Array} 城市列表
 */
export function getAllCities() {
  return cities;
}

/**
 * 搜索城市或区县
 * @param {string} keyword - 搜索关键词
 * @param {Array} citiesList - 可选，指定搜索范围
 * @returns {Array} 匹配的城市或区县列表
 */
export function searchCities(keyword, citiesList = cities) {
  if (!keyword) return [];
  const lowerKeyword = keyword.toLowerCase();
  
  const results = [];
  citiesList.forEach(city => {
    // 搜索城市名称或省份
    if (city.name.toLowerCase().includes(lowerKeyword) ||
        city.province.toLowerCase().includes(lowerKeyword)) {
      results.push(city);
    }
    // 搜索区县
    else if (city.districts) {
      const matchingDistricts = city.districts.filter(district =>
        district.name.toLowerCase().includes(lowerKeyword)
      );
      if (matchingDistricts.length > 0) {
        results.push({
          ...city,
          matchingDistricts
        });
      }
    }
  });
  
  return results;
}

/**
 * 按国家获取城市列表
 * @param {string} country - 国家名称
 * @returns {Array} 城市列表
 */
export function getCitiesByCountry(country) {
  return cities.filter(city => city.country === country);
}

/**
 * 按省份获取城市列表（仅适用于中国城市）
 * @param {string} province - 省份名称
 * @returns {Array} 城市列表
 */
export function getCitiesByProvince(province) {
  return cities.filter(city => 
    city.country === '中国' && city.province === province
  );
}

/**
 * 获取城市的区县列表
 * @param {string} cityName - 城市名称
 * @returns {Array} 区县列表
 */
export function getDistrictsByCity(cityName) {
  const city = cities.find(c => c.name === cityName);
  return city?.districts || [];
} 