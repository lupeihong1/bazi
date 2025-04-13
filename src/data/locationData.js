import { getAllCities } from '../utils/cityData';
import { reactive, ref } from 'vue';
import { worldCities } from './worldCities';

// 格式化国外数据
const formatForeignData = () => {
  try {
    return Object.entries(worldCities).map(([continent, countries]) => ({
      value: continent,
      label: continent,
      children: Object.entries(countries).filter(([country]) => country !== '中国').map(([country, cities]) => ({
        value: country,
        label: country,
        children: cities.map(city => ({
          value: city.name,
          label: city.name,
          coordinates: {
            lat: city.lat,
            lng: city.lng
          }
        }))
      }))
    }));
  } catch (error) {
    console.error('Error in formatForeignData:', error);
    return [];
  }
};

// 格式化中国数据
const formatChineseData = () => {
  try {
    const allCities = getAllCities();
    
    const provinces = {
      '中国': {
        value: '中国',
        label: '中国',
        children: []
      }
    };
    
    // 添加主要城市
    const majorChineseCities = worldCities['亚洲']['中国'] || [];
    majorChineseCities.forEach(city => {
      if (!provinces['中国'].children.find(p => p.value === '主要城市')) {
        provinces['中国'].children.push({
          value: '主要城市',
          label: '主要城市',
          children: []
        });
      }
      
      const majorCitiesNode = provinces['中国'].children.find(p => p.value === '主要城市');
      majorCitiesNode.children.push({
        value: city.name,
        label: city.name,
        coordinates: {
          lat: city.lat,
          lng: city.lng
        }
      });
    });
    
    // 按省份分组添加其他城市
    allCities.forEach(city => {
      if (!city || !city.province) return;
      
      if (!provinces['中国'].children.find(p => p.value === city.province)) {
        provinces['中国'].children.push({
          value: city.province,
          label: city.province,
          children: []
        });
      }
      
      const provinceNode = provinces['中国'].children.find(
        p => p.value === city.province
      );
      
      provinceNode.children.push({
        value: city.name,
        label: city.name,
        coordinates: {
          lat: city.latitude || 0,
          lng: city.longitude || 0
        }
      });
    });

    // 将主要城市节点移到最前面
    const mainCitiesIndex = provinces['中国'].children.findIndex(p => p.value === '主要城市');
    if (mainCitiesIndex > -1) {
      const mainCities = provinces['中国'].children.splice(mainCitiesIndex, 1)[0];
      provinces['中国'].children.unshift(mainCities);
    }

    return [provinces['中国']];
  } catch (error) {
    console.error('Error in formatChineseData:', error);
    return [];
  }
};

// 合并中国和国外数据
const combineLocationData = () => {
  const chineseData = formatChineseData();
  const foreignData = formatForeignData();
  return [...chineseData, ...foreignData];
};

// 创建响应式数据
export const locationData = reactive(combineLocationData());
export const isLoading = ref(false);

// 获取地点信息
export const getLocationInfo = (code) => {
  try {
    // 先查找中国城市
    const allCities = getAllCities();
    const chineseCity = allCities.find(c => c.name === code);
    
    if (chineseCity) {
      return {
        country: '中国',
        province: chineseCity.province,
        city: chineseCity.name,
        coordinates: {
          lat: chineseCity.latitude || 0,
          lng: chineseCity.longitude || 0
        }
      };
    }
    
    // 查找世界城市
    for (const [continent, countries] of Object.entries(worldCities)) {
      for (const [country, cities] of Object.entries(countries)) {
        const city = cities.find(c => c.name === code);
        if (city) {
          return {
            country,
            province: '',
            city: city.name,
            coordinates: {
              lat: city.lat,
              lng: city.lng
            }
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error in getLocationInfo:', error);
    return null;
  }
}; 