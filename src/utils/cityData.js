/**
 * 城市数据工具
 */

// 中国城市数据
const chinaCities = {
  // 直辖市
  '北京': { 
    province: '北京', 
    latitude: 39.9042, 
    longitude: 116.4074,
    districts: [
      { name: '东城区', latitude: 39.9289, longitude: 116.4100 },
      { name: '西城区', latitude: 39.9123, longitude: 116.3607 },
      { name: '朝阳区', latitude: 39.9215, longitude: 116.4864 },
      { name: '海淀区', latitude: 39.9599, longitude: 116.2982 },
      { name: '丰台区', latitude: 39.8584, longitude: 116.2869 },
      { name: '石景山区', latitude: 39.9146, longitude: 116.1954 },
      { name: '门头沟区', latitude: 39.9406, longitude: 116.1024 },
      { name: '房山区', latitude: 39.7355, longitude: 116.1392 },
      { name: '通州区', latitude: 39.9025, longitude: 116.6586 },
      { name: '顺义区', latitude: 40.1289, longitude: 116.6546 },
      { name: '昌平区', latitude: 40.2208, longitude: 116.2313 },
      { name: '大兴区', latitude: 39.7268, longitude: 116.3380 },
      { name: '怀柔区', latitude: 40.3160, longitude: 116.6371 },
      { name: '平谷区', latitude: 40.1406, longitude: 117.1123 },
      { name: '密云区', latitude: 40.3769, longitude: 116.8434 },
      { name: '延庆区', latitude: 40.4566, longitude: 115.9750 }
    ]
  },
  '上海': { 
    province: '上海', 
    latitude: 31.2304, 
    longitude: 121.4737,
    districts: [
      { name: '黄浦区', latitude: 31.2304, longitude: 121.4846 },
      { name: '徐汇区', latitude: 31.1883, longitude: 121.4365 },
      { name: '长宁区', latitude: 31.2204, longitude: 121.4246 },
      { name: '静安区', latitude: 31.2288, longitude: 121.4482 },
      { name: '普陀区', latitude: 31.2492, longitude: 121.3925 },
      { name: '虹口区', latitude: 31.2646, longitude: 121.5051 },
      { name: '杨浦区', latitude: 31.2595, longitude: 121.5260 },
      { name: '浦东新区', latitude: 31.2215, longitude: 121.5444 },
      { name: '闵行区', latitude: 31.1128, longitude: 121.3817 },
      { name: '宝山区', latitude: 31.4055, longitude: 121.4896 },
      { name: '嘉定区', latitude: 31.3747, longitude: 121.2653 },
      { name: '金山区', latitude: 30.7419, longitude: 121.3419 },
      { name: '松江区', latitude: 31.0309, longitude: 121.2288 },
      { name: '青浦区', latitude: 31.1512, longitude: 121.1242 },
      { name: '奉贤区', latitude: 30.9178, longitude: 121.4740 },
      { name: '崇明区', latitude: 31.6229, longitude: 121.3975 }
    ]
  },
  '天津': { 
    province: '天津', 
    latitude: 39.0842, 
    longitude: 117.2010,
    districts: [
      { name: '和平区', latitude: 39.1167, longitude: 117.1959 },
      { name: '河东区', latitude: 39.1224, longitude: 117.2266 },
      { name: '河西区', latitude: 39.1015, longitude: 117.2234 },
      { name: '南开区', latitude: 39.1381, longitude: 117.1507 },
      { name: '河北区', latitude: 39.1566, longitude: 117.1966 },
      { name: '红桥区', latitude: 39.1671, longitude: 117.1633 },
      { name: '东丽区', latitude: 39.0866, longitude: 117.3143 },
      { name: '西青区', latitude: 39.1412, longitude: 117.0122 },
      { name: '津南区', latitude: 38.9896, longitude: 117.3825 },
      { name: '北辰区', latitude: 39.2215, longitude: 117.1348 },
      { name: '武清区', latitude: 39.3841, longitude: 117.0444 },
      { name: '宝坻区', latitude: 39.7173, longitude: 117.3081 },
      { name: '滨海新区', latitude: 39.0031, longitude: 117.7107 },
      { name: '宁河区', latitude: 39.3289, longitude: 117.8283 },
      { name: '静海区', latitude: 38.9357, longitude: 116.9241 },
      { name: '蓟州区', latitude: 40.0453, longitude: 117.4082 }
    ]
  },
  '重庆': { 
    province: '重庆', 
    latitude: 29.5630, 
    longitude: 106.5516,
    districts: [
      { name: '渝中区', latitude: 29.5528, longitude: 106.5629 },
      { name: '大渡口区', latitude: 29.4841, longitude: 106.4826 },
      { name: '江北区', latitude: 29.5754, longitude: 106.5328 },
      { name: '沙坪坝区', latitude: 29.5412, longitude: 106.4542 },
      { name: '九龙坡区', latitude: 29.5025, longitude: 106.5107 },
      { name: '南岸区', latitude: 29.5231, longitude: 106.5608 },
      { name: '北碚区', latitude: 29.8254, longitude: 106.4379 },
      { name: '渝北区', latitude: 29.7070, longitude: 106.6302 },
      { name: '巴南区', latitude: 29.4027, longitude: 106.5404 },
      { name: '万州区', latitude: 30.8079, longitude: 108.3802 },
      { name: '涪陵区', latitude: 29.7030, longitude: 107.3949 },
      { name: '黔江区', latitude: 29.5332, longitude: 108.7826 },
      { name: '长寿区', latitude: 29.8337, longitude: 107.0749 },
      { name: '江津区', latitude: 29.2901, longitude: 106.2533 },
      { name: '合川区', latitude: 29.9780, longitude: 106.2656 },
      { name: '永川区', latitude: 29.3561, longitude: 105.9271 },
      { name: '南川区', latitude: 29.1579, longitude: 107.0982 },
      { name: '綦江区', latitude: 29.0281, longitude: 106.6514 },
      { name: '大足区', latitude: 29.7005, longitude: 105.7153 },
      { name: '璧山区', latitude: 29.5920, longitude: 106.2271 },
      { name: '铜梁区', latitude: 29.8449, longitude: 106.0549 },
      { name: '潼南区', latitude: 30.1905, longitude: 105.8406 },
      { name: '荣昌区', latitude: 29.4055, longitude: 105.5941 },
      { name: '开州区', latitude: 31.1605, longitude: 108.4133 },
      { name: '梁平区', latitude: 30.6739, longitude: 107.8000 },
      { name: '武隆区', latitude: 29.3256, longitude: 107.7600 },
      { name: '城口县', latitude: 31.9476, longitude: 108.6649 },
      { name: '丰都县', latitude: 29.8635, longitude: 107.7309 },
      { name: '垫江县', latitude: 30.3302, longitude: 107.3487 },
      { name: '忠县', latitude: 30.3000, longitude: 108.0377 },
      { name: '云阳县', latitude: 30.9306, longitude: 108.6977 },
      { name: '奉节县', latitude: 31.0195, longitude: 109.4639 },
      { name: '巫山县', latitude: 31.0748, longitude: 109.8789 },
      { name: '巫溪县', latitude: 31.3986, longitude: 109.6289 },
      { name: '石柱土家族自治县', latitude: 29.9991, longitude: 108.1141 },
      { name: '秀山土家族苗族自治县', latitude: 28.4482, longitude: 108.9960 },
      { name: '酉阳土家族苗族自治县', latitude: 28.8398, longitude: 108.7675 },
      { name: '彭水苗族土家族自治县', latitude: 29.2939, longitude: 108.1666 }
    ]
  },

  // 广东省
  '广州': { 
    province: '广东', 
    latitude: 23.1291, 
    longitude: 113.2644,
    districts: [
      { name: '越秀区', latitude: 23.1291, longitude: 113.2644 },
      { name: '海珠区', latitude: 23.0839, longitude: 113.3174 },
      { name: '荔湾区', latitude: 23.1252, longitude: 113.2430 },
      { name: '天河区', latitude: 23.1247, longitude: 113.3612 },
      { name: '白云区', latitude: 23.1573, longitude: 113.2732 },
      { name: '黄埔区', latitude: 23.1032, longitude: 113.4507 },
      { name: '番禺区', latitude: 22.9372, longitude: 113.3846 },
      { name: '花都区', latitude: 23.4039, longitude: 113.2202 },
      { name: '南沙区', latitude: 22.8016, longitude: 113.5252 },
      { name: '从化区', latitude: 23.5453, longitude: 113.5867 },
      { name: '增城区', latitude: 23.2905, longitude: 113.8106 }
    ]
  },
  '深圳': { 
    province: '广东', 
    latitude: 22.5431, 
    longitude: 114.0579,
    districts: [
      { name: '福田区', latitude: 22.5414, longitude: 114.0556 },
      { name: '罗湖区', latitude: 22.5482, longitude: 114.1239 },
      { name: '南山区', latitude: 22.5312, longitude: 113.9294 },
      { name: '宝安区', latitude: 22.5553, longitude: 113.8831 },
      { name: '龙岗区', latitude: 22.7209, longitude: 114.2514 },
      { name: '盐田区', latitude: 22.5551, longitude: 114.2354 },
      { name: '龙华区', latitude: 22.6564, longitude: 114.0443 },
      { name: '坪山区', latitude: 22.6908, longitude: 114.3463 },
      { name: '光明区', latitude: 22.7489, longitude: 113.9359 }
    ]
  },
  '珠海': { province: '广东', latitude: 22.2707, longitude: 113.5767 },
  '佛山': { province: '广东', latitude: 23.0215, longitude: 113.1214 },
  '东莞': { province: '广东', latitude: 23.0205, longitude: 113.7518 },
  '中山': { province: '广东', latitude: 22.5176, longitude: 113.3928 },
  '惠州': { province: '广东', latitude: 23.1118, longitude: 114.4162 },
  '江门': { province: '广东', latitude: 22.5787, longitude: 113.0815 },
  '肇庆': { province: '广东', latitude: 23.0472, longitude: 112.4655 },
  '汕头': { province: '广东', latitude: 23.3541, longitude: 116.6820 },
  '湛江': { province: '广东', latitude: 21.2707, longitude: 110.3594 },
  '茂名': { province: '广东', latitude: 21.6629, longitude: 110.9254 },
  '韶关': { province: '广东', latitude: 24.8104, longitude: 113.5975 },
  '梅州': { province: '广东', latitude: 24.2886, longitude: 116.1226 },
  '汕尾': { province: '广东', latitude: 22.7869, longitude: 115.3752 },
  '河源': { province: '广东', latitude: 23.7432, longitude: 114.7008 },
  '阳江': { province: '广东', latitude: 21.8579, longitude: 111.9822 },
  '清远': { province: '广东', latitude: 23.6820, longitude: 113.0560 },
  '潮州': { province: '广东', latitude: 23.6569, longitude: 116.6226 },
  '揭阳': { province: '广东', latitude: 23.5497, longitude: 116.3728 },
  '云浮': { province: '广东', latitude: 22.9378, longitude: 112.0445 },

  // 江苏省
  '南京': { province: '江苏', latitude: 32.0603, longitude: 118.7965 },
  '苏州': { province: '江苏', latitude: 31.2989, longitude: 120.5853 },
  '无锡': { province: '江苏', latitude: 31.4907, longitude: 120.3124 },
  '常州': { province: '江苏', latitude: 31.8107, longitude: 119.9739 },
  '徐州': { province: '江苏', latitude: 34.2042, longitude: 117.2859 },
  '南通': { province: '江苏', latitude: 31.9802, longitude: 120.8943 },
  '扬州': { province: '江苏', latitude: 32.3932, longitude: 119.4129 },
  '盐城': { province: '江苏', latitude: 33.3495, longitude: 120.1636 },
  '镇江': { province: '江苏', latitude: 32.1878, longitude: 119.4546 },
  '泰州': { province: '江苏', latitude: 32.4558, longitude: 119.9250 },
  '连云港': { province: '江苏', latitude: 34.5965, longitude: 119.2216 },
  '淮安': { province: '江苏', latitude: 33.6104, longitude: 119.0153 },
  '宿迁': { province: '江苏', latitude: 33.9619, longitude: 118.2969 },

  // 浙江省
  '杭州': { province: '浙江', latitude: 30.2741, longitude: 120.1551 },
  '宁波': { province: '浙江', latitude: 29.8683, longitude: 121.5440 },
  '温州': { province: '浙江', latitude: 27.9949, longitude: 120.6994 },
  '绍兴': { province: '浙江', latitude: 30.0303, longitude: 120.5802 },
  '嘉兴': { province: '浙江', latitude: 30.7539, longitude: 120.7585 },
  '湖州': { province: '浙江', latitude: 30.8930, longitude: 120.0868 },
  '金华': { province: '浙江', latitude: 29.0790, longitude: 119.6474 },
  '衢州': { province: '浙江', latitude: 28.9359, longitude: 118.8745 },
  '台州': { province: '浙江', latitude: 28.6564, longitude: 121.4208 },
  '丽水': { province: '浙江', latitude: 28.4676, longitude: 119.9228 },
  '舟山': { province: '浙江', latitude: 29.9853, longitude: 122.2072 },

  // 四川省
  '成都': { province: '四川', latitude: 30.5728, longitude: 104.0668 },
  '绵阳': { province: '四川', latitude: 31.4675, longitude: 104.6791 },
  '德阳': { province: '四川', latitude: 31.1268, longitude: 104.3987 },
  '宜宾': { province: '四川', latitude: 28.7518, longitude: 104.6432 },
  '南充': { province: '四川', latitude: 30.8373, longitude: 106.1107 },
  '达州': { province: '四川', latitude: 31.2096, longitude: 107.4680 },
  '乐山': { province: '四川', latitude: 29.5521, longitude: 103.7654 },
  '泸州': { province: '四川', latitude: 28.8717, longitude: 105.4433 },
  '内江': { province: '四川', latitude: 29.5802, longitude: 105.0584 },
  '自贡': { province: '四川', latitude: 29.3390, longitude: 104.7784 },
  '攀枝花': { province: '四川', latitude: 26.5823, longitude: 101.7186 },
  '广元': { province: '四川', latitude: 32.4355, longitude: 105.8434 },
  '遂宁': { province: '四川', latitude: 30.5328, longitude: 105.5929 },
  '广安': { province: '四川', latitude: 30.4564, longitude: 106.6334 },
  '巴中': { province: '四川', latitude: 31.8588, longitude: 106.7579 },
  '雅安': { province: '四川', latitude: 29.9818, longitude: 103.0133 },
  '眉山': { province: '四川', latitude: 30.0754, longitude: 103.8485 },
  '资阳': { province: '四川', latitude: 30.1286, longitude: 104.6276 },

  // 湖北省
  '武汉': { province: '湖北', latitude: 30.5928, longitude: 114.3055 },
  '宜昌': { province: '湖北', latitude: 30.7026, longitude: 111.2865 },
  '襄阳': { province: '湖北', latitude: 32.0089, longitude: 112.1224 },
  '荆州': { province: '湖北', latitude: 30.3326, longitude: 112.2419 },
  '黄石': { province: '湖北', latitude: 30.1996, longitude: 115.0385 },
  '十堰': { province: '湖北', latitude: 32.6294, longitude: 110.7980 },
  '孝感': { province: '湖北', latitude: 30.9246, longitude: 113.9169 },
  '荆门': { province: '湖北', latitude: 31.0354, longitude: 112.1993 },
  '鄂州': { province: '湖北', latitude: 30.3909, longitude: 114.8948 },
  '黄冈': { province: '湖北', latitude: 30.4545, longitude: 114.8724 },
  '咸宁': { province: '湖北', latitude: 29.8414, longitude: 114.3225 },
  '随州': { province: '湖北', latitude: 31.6901, longitude: 113.3826 },
  '恩施': { province: '湖北', latitude: 30.2722, longitude: 109.4882 },
  '仙桃': { province: '湖北', latitude: 30.3625, longitude: 113.4541 },
  '潜江': { province: '湖北', latitude: 30.4020, longitude: 112.9001 },
  '天门': { province: '湖北', latitude: 30.6633, longitude: 113.1665 },
  '神农架': { province: '湖北', latitude: 31.7444, longitude: 110.6758 }
};

// 处理中国城市数据
const processChinaCities = () => {
  const citiesList = [];
  
  // 遍历所有城市
  Object.entries(chinaCities).forEach(([cityName, cityData]) => {
    citiesList.push({
      name: cityName,
      province: cityData.province,
      country: "中国",
      districts: cityData.districts || [],
      longitude: cityData.longitude,
      latitude: cityData.latitude
    });
  });

  return citiesList;
};

// 合并所有城市数据
const allCities = processChinaCities();

/**
 * 获取所有城市
 * @returns {Array} 城市列表
 */
export function getAllCities() {
  return allCities;
}

/**
 * 搜索城市或区县
 * @param {string} keyword - 搜索关键词
 * @param {Array} citiesList - 可选，指定搜索范围
 * @returns {Array} 匹配的城市或区县列表
 */
export function searchCities(keyword, citiesList = allCities) {
  if (!keyword) return [];
  const lowerKeyword = keyword.toLowerCase();
  
  return citiesList.filter(city => 
    city.name.toLowerCase().includes(lowerKeyword) ||
    city.province.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * 按国家获取城市列表
 * @param {string} country - 国家名称
 * @returns {Array} 城市列表
 */
export function getCitiesByCountry(country) {
  return allCities.filter(city => city.country === country);
}

/**
 * 按省份获取城市列表
 * @param {string} province - 省份名称
 * @returns {Array} 城市列表
 */
export function getCitiesByProvince(province) {
  return allCities.filter(city => city.province === province);
}

/**
 * 获取城市的区县列表
 * @param {string} cityName - 城市名称
 * @returns {Array} 区县列表
 */
export function getDistrictsByCity(cityName) {
  const city = allCities.find(c => c.name === cityName);
  return city?.districts || [];
}

/**
 * 获取所有省份列表
 * @param {string} country - 可选，指定国家
 * @returns {Array} 省份列表
 */
export function getAllProvinces(country) {
  const provinces = new Set();
  allCities
    .filter(city => !country || city.country === country)
    .forEach(city => provinces.add(city.province));
  return Array.from(provinces).sort();
}

/**
 * 获取所有国家列表
 * @returns {Array} 国家列表
 */
export function getAllCountries() {
  const countries = new Set();
  allCities.forEach(city => countries.add(city.country));
  return Array.from(countries).sort();
} 