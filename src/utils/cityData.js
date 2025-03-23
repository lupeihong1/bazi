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
      { name: "海淀区", longitude: 116.2988, latitude: 39.9591 }
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
      { name: "静安区", longitude: 121.4484, latitude: 31.2288 }
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
      { name: "天河区", longitude: 113.3610, latitude: 23.1247 }
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
      { name: "宝安区", longitude: 113.8838, latitude: 22.5550 }
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
      { name: "武侯区", longitude: 104.0433, latitude: 30.6423 }
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

  // 补充更多国内城市
  { 
    name: "厦门", 
    province: "福建省", 
    country: "中国", 
    districts: [
      { name: "思明区", longitude: 118.1697, latitude: 24.4457 },
      { name: "湖里区", longitude: 118.1464, latitude: 24.5120 },
      { name: "集美区", longitude: 118.0972, latitude: 24.5758 },
      { name: "海沧区", longitude: 118.0334, latitude: 24.4841 }
    ],
    longitude: 118.0894,
    latitude: 24.4798
  },
  { 
    name: "福州", 
    province: "福建省", 
    country: "中国", 
    districts: [
      { name: "鼓楼区", longitude: 119.3039, latitude: 26.0823 },
      { name: "台江区", longitude: 119.3141, latitude: 26.0526 },
      { name: "仓山区", longitude: 119.2737, latitude: 26.0467 },
      { name: "晋安区", longitude: 119.3282, latitude: 26.0822 }
    ],
    longitude: 119.3062,
    latitude: 26.0753
  },
  { 
    name: "合肥", 
    province: "安徽省", 
    country: "中国", 
    districts: [
      { name: "瑶海区", longitude: 117.3095, latitude: 31.8579 },
      { name: "庐阳区", longitude: 117.2647, latitude: 31.8787 },
      { name: "蜀山区", longitude: 117.2605, latitude: 31.8512 },
      { name: "包河区", longitude: 117.3071, latitude: 31.7930 }
    ],
    longitude: 117.2272,
    latitude: 31.8206
  },
  { 
    name: "南昌", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "东湖区", longitude: 115.8990, latitude: 28.6850 },
      { name: "西湖区", longitude: 115.8772, latitude: 28.6569 },
      { name: "青云谱区", longitude: 115.9257, latitude: 28.6212 },
      { name: "湾里区", longitude: 115.7308, latitude: 28.7148 }
    ],
    longitude: 115.8581,
    latitude: 28.6820
  },
  { 
    name: "赣州", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "章贡区", longitude: 114.9415, latitude: 25.8627 },
      { name: "南康区", longitude: 114.7651, latitude: 25.6615 },
      { name: "赣县区", longitude: 115.0116, latitude: 25.8607 },
      { name: "信丰县", longitude: 114.9228, latitude: 25.3862 }
    ],
    longitude: 114.9350,
    latitude: 25.8452
  },
  { 
    name: "九江", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "浔阳区", longitude: 115.9900, latitude: 29.7276 },
      { name: "濂溪区", longitude: 115.9448, latitude: 29.6718 },
      { name: "柴桑区", longitude: 115.9111, latitude: 29.6084 },
      { name: "瑞昌市", longitude: 115.6810, latitude: 29.6766 }
    ],
    longitude: 115.9928,
    latitude: 29.7124
  },
  { 
    name: "上饶", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "信州区", longitude: 117.9705, latitude: 28.4454 },
      { name: "广丰区", longitude: 118.1912, latitude: 28.4363 },
      { name: "广信区", longitude: 117.9074, latitude: 28.4489 },
      { name: "玉山县", longitude: 118.2448, latitude: 28.6819 }
    ],
    longitude: 117.9434,
    latitude: 28.4548
  },
  { 
    name: "宜春", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "袁州区", longitude: 114.4241, latitude: 27.7961 },
      { name: "万载县", longitude: 114.4455, latitude: 28.1057 },
      { name: "上高县", longitude: 114.9245, latitude: 28.2328 },
      { name: "宜丰县", longitude: 114.8035, latitude: 28.3936 }
    ],
    longitude: 114.4161,
    latitude: 27.8111
  },
  { 
    name: "吉安", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "吉州区", longitude: 114.9946, latitude: 27.1448 },
      { name: "青原区", longitude: 115.0148, latitude: 27.0819 },
      { name: "吉安县", longitude: 114.9077, latitude: 27.0399 },
      { name: "吉水县", longitude: 115.1355, latitude: 27.2296 }
    ],
    longitude: 114.9935,
    latitude: 27.1138
  },
  { 
    name: "抚州", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "临川区", longitude: 116.3612, latitude: 27.9772 },
      { name: "东乡区", longitude: 116.6032, latitude: 28.2475 },
      { name: "南城县", longitude: 116.6370, latitude: 27.5697 },
      { name: "黎川县", longitude: 116.9077, latitude: 27.2823 }
    ],
    longitude: 116.3582,
    latitude: 27.9492
  },
  { 
    name: "新余", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "渝水区", longitude: 114.9446, latitude: 27.8004 },
      { name: "分宜县", longitude: 114.6920, latitude: 27.8146 },
      { name: "仙女湖区", longitude: 114.8054, latitude: 27.8174 }
    ],
    longitude: 114.9173,
    latitude: 27.8174
  },
  { 
    name: "鹰潭", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "月湖区", longitude: 117.0372, latitude: 28.2391 },
      { name: "余江区", longitude: 116.8186, latitude: 28.2097 },
      { name: "贵溪市", longitude: 117.2455, latitude: 28.2926 }
    ],
    longitude: 117.0692,
    latitude: 28.2601
  },
  { 
    name: "萍乡", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "安源区", longitude: 113.8707, latitude: 27.6151 },
      { name: "湘东区", longitude: 113.7330, latitude: 27.6407 },
      { name: "莲花县", longitude: 113.9615, latitude: 27.1277 },
      { name: "上栗县", longitude: 113.7950, latitude: 27.8803 }
    ],
    longitude: 113.8522,
    latitude: 27.6229
  },
  { 
    name: "景德镇", 
    province: "江西省", 
    country: "中国", 
    districts: [
      { name: "珠山区", longitude: 117.2028, latitude: 29.2999 },
      { name: "昌江区", longitude: 117.1837, latitude: 29.2734 },
      { name: "浮梁县", longitude: 117.2152, latitude: 29.3522 },
      { name: "乐平市", longitude: 117.1291, latitude: 28.9619 }
    ],
    longitude: 117.1738,
    latitude: 29.2687
  },
  { 
    name: "昆明", 
    province: "云南省", 
    country: "中国", 
    districts: [
      { name: "五华区", longitude: 102.7074, latitude: 25.0437 },
      { name: "盘龙区", longitude: 102.7521, latitude: 25.1161 },
      { name: "官渡区", longitude: 102.7438, latitude: 24.9503 },
      { name: "西山区", longitude: 102.6644, latitude: 24.9597 }
    ],
    longitude: 102.8329,
    latitude: 24.8801
  },
  { 
    name: "贵阳", 
    province: "贵州省", 
    country: "中国", 
    districts: [
      { name: "南明区", longitude: 106.7157, latitude: 26.5681 },
      { name: "云岩区", longitude: 106.7244, latitude: 26.6048 },
      { name: "花溪区", longitude: 106.6704, latitude: 26.4098 },
      { name: "乌当区", longitude: 106.7506, latitude: 26.6303 }
    ],
    longitude: 106.7135,
    latitude: 26.5783
  },
  { 
    name: "南宁", 
    province: "广西壮族自治区", 
    country: "中国", 
    districts: [
      { name: "兴宁区", longitude: 108.3684, latitude: 22.8545 },
      { name: "青秀区", longitude: 108.4951, latitude: 22.7852 },
      { name: "江南区", longitude: 108.2732, latitude: 22.7812 },
      { name: "西乡塘区", longitude: 108.3134, latitude: 22.8339 }
    ],
    longitude: 108.3665,
    latitude: 22.8170
  },
  { 
    name: "海口", 
    province: "海南省", 
    country: "中国", 
    districts: [
      { name: "秀英区", longitude: 110.2936, latitude: 20.0076 },
      { name: "龙华区", longitude: 110.3285, latitude: 20.0310 },
      { name: "琼山区", longitude: 110.3542, latitude: 20.0031 },
      { name: "美兰区", longitude: 110.3666, latitude: 20.0287 }
    ],
    longitude: 110.3312,
    latitude: 20.0318
  },
  { 
    name: "兰州", 
    province: "甘肃省", 
    country: "中国", 
    districts: [
      { name: "城关区", longitude: 103.8253, latitude: 36.0571 },
      { name: "七里河区", longitude: 103.7856, latitude: 36.0659 },
      { name: "西固区", longitude: 103.6281, latitude: 36.0884 },
      { name: "安宁区", longitude: 103.7189, latitude: 36.1039 }
    ],
    longitude: 103.8343,
    latitude: 36.0611
  },
  { 
    name: "西宁", 
    province: "青海省", 
    country: "中国", 
    districts: [
      { name: "城东区", longitude: 101.8038, latitude: 36.5997 },
      { name: "城中区", longitude: 101.7845, latitude: 36.6222 },
      { name: "城西区", longitude: 101.7658, latitude: 36.6283 },
      { name: "城北区", longitude: 101.7661, latitude: 36.6502 }
    ],
    longitude: 101.7782,
    latitude: 36.6171
  },
  { 
    name: "银川", 
    province: "宁夏回族自治区", 
    country: "中国", 
    districts: [
      { name: "兴庆区", longitude: 106.2885, latitude: 38.4737 },
      { name: "西夏区", longitude: 106.1561, latitude: 38.4914 },
      { name: "金凤区", longitude: 106.2426, latitude: 38.4733 },
      { name: "永宁县", longitude: 106.2531, latitude: 38.2774 }
    ],
    longitude: 106.2309,
    latitude: 38.4872
  },
  { 
    name: "乌鲁木齐", 
    province: "新疆维吾尔自治区", 
    country: "中国", 
    districts: [
      { name: "天山区", longitude: 87.6319, latitude: 43.7944 },
      { name: "沙依巴克区", longitude: 87.5979, latitude: 43.8009 },
      { name: "新市区", longitude: 87.5736, latitude: 43.8438 },
      { name: "水磨沟区", longitude: 87.6425, latitude: 43.8325 }
    ],
    longitude: 87.6168,
    latitude: 43.8256
  },
  { 
    name: "拉萨", 
    province: "西藏自治区", 
    country: "中国", 
    districts: [
      { name: "城关区", longitude: 91.1409, latitude: 29.6525 },
      { name: "堆龙德庆区", longitude: 91.0033, latitude: 29.6456 },
      { name: "达孜区", longitude: 91.3499, latitude: 29.6694 },
      { name: "林周县", longitude: 91.2618, latitude: 29.8947 }
    ],
    longitude: 91.1172,
    latitude: 29.6469
  },
  { 
    name: "呼和浩特", 
    province: "内蒙古自治区", 
    country: "中国", 
    districts: [
      { name: "新城区", longitude: 111.6655, latitude: 40.8582 },
      { name: "回民区", longitude: 111.6238, latitude: 40.8084 },
      { name: "玉泉区", longitude: 111.6739, latitude: 40.7524 },
      { name: "赛罕区", longitude: 111.7019, latitude: 40.7921 }
    ],
    longitude: 111.6708,
    latitude: 40.8424
  },

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