<script setup>
import { ref, computed, watch } from "vue";
import { calculateBaZi } from "./utils/bazi";
import { calculateSolarTime } from "./utils/solarTime";
import { getAllCities, searchCities, getDistrictsByCity } from "./utils/cityData";
import { analyzeStrength } from "./utils/strength";

const selectedDate = ref('2000-12-04T23:55');
const selectedCity = ref("");
const selectedDistrict = ref("");
const useSolarTime = ref(false);
const result = ref({});
const solarTimeResult = ref(null);
const searchKeyword = ref("");
const isLoading = ref(false);
const cityTab = ref("domestic");
const selectedProvince = ref("");
const districts = ref([]);

// 获取所有城市并按省份分组
const groupedCities = computed(() => {
  const allCities = getAllCities();
  const grouped = {};
  
  if (cityTab.value === "domestic") {
    // 处理国内城市
    allCities
      .filter(city => city.country === "中国")
      .forEach(city => {
        if (!grouped[city.province]) {
          grouped[city.province] = [];
        }
        grouped[city.province].push(city);
      });
  } else {
    // 只处理加拿大城市
    allCities
      .filter(city => city.country === "加拿大" && city.latitude >= 0)
      .forEach(city => {
        if (!grouped[city.province]) {
          grouped[city.province] = [];
        }
        grouped[city.province].push(city);
      });
  }
  
  return grouped;
});

// 获取省份列表
const provinces = computed(() => {
  return Object.keys(groupedCities.value).sort();
});

// 获取当前省份的城市
const citiesInProvince = computed(() => {
  if (!selectedProvince.value) return [];
  return groupedCities.value[selectedProvince.value] || [];
});

// 搜索结果
const searchResults = computed(() => {
  if (!searchKeyword.value) return [];
  
  const results = [];
  Object.entries(groupedCities.value).forEach(([province, cities]) => {
    cities.forEach(city => {
      if (city.name.includes(searchKeyword.value)) {
        results.push({ ...city, province });
      }
    });
  });
  
  return results;
});

// 切换城市标签页
const switchCityTab = (tab) => {
  cityTab.value = tab;
  selectedCity.value = "";
  selectedProvince.value = "";
  searchKeyword.value = "";
};

// 当选择城市时更新区县列表
watch(selectedCity, (newCity) => {
  selectedDistrict.value = '';
  if (newCity) {
    districts.value = getDistrictsByCity(newCity);
  } else {
    districts.value = [];
  }
});

// 修改 onSubmit 函数
const onSubmit = () => {
  if (!selectedDate.value) {
    alert('请选择日期');
    return;
  }

  // 将日期字符串转换为 Date 对象
  const date = new Date(selectedDate.value);

  // 如果使用真太阳时，需要验证城市选择
  if (useSolarTime.value) {
    if (!selectedCity.value) {
      alert('请选择城市');
      return;
    }

    // 从所有城市中查找选中的城市
    const allCities = getAllCities();
    const city = allCities.find(c => c.name === selectedCity.value);
    
    if (!city) {
      alert('无法找到选中的城市信息');
      return;
    }

    // 使用区县的经纬度，如果没有选择区县则使用城市的经纬度
    const district = city.districts?.find(d => d.name === selectedDistrict.value);
    const longitude = district?.longitude || city.longitude;
    const latitude = district?.latitude || city.latitude;

    if (!longitude || !latitude) {
      alert('无法获取位置信息');
      return;
    }

    // 计算真太阳时
    const solarTime = calculateSolarTime(
      date,
      longitude,
      latitude,
      true // 使用真太阳时
    );

    // 计算八字
    const bazi = calculateBaZi(solarTime);
    
    // 计算身强身弱
    const strength = analyzeStrength(bazi);
    
    // 更新结果
    result.value = {
      ...bazi,
      真太阳时: solarTime.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      位置信息: {
        城市: city.name,
        区县: district?.name || '市区',
        经度: longitude.toFixed(4),
        纬度: latitude.toFixed(4)
      },
      身强身弱: strength
    };
  } else {
    // 不使用真太阳时，直接使用选择的时间计算八字
    const bazi = calculateBaZi(date);
    
    // 计算身强身弱
    const strength = analyzeStrength(bazi);
    
    // 更新结果，不包含真太阳时和位置信息
    result.value = {
      ...bazi,
      身强身弱: strength
    };
  }
};

// 计算当前时刻的八字
const now = new Date();
const currentBazi = calculateBaZi(now);

// 添加权重样式判断函数
function getWeightClass(value) {
  const numValue = parseFloat(value);
  if (numValue > 0) return 'positive';
  if (numValue < 0) return 'negative';
  return 'neutral';
}

// 添加身强身弱样式判断函数
function getStrengthClass(strength) {
  switch (strength) {
    case '强':
      return 'strong';
    case '偏强':
      return 'slightly-strong';
    case '均衡':
      return 'balanced';
    case '偏弱':
      return 'slightly-weak';
    case '弱':
      return 'weak';
    default:
      return '';
  }
}
</script>

<template>
  <div class="container">
    <h2>八字计算</h2>
    <div class="current-bazi">
      <h3>当前时刻八字</h3>
      <div class="bazi-result">
        <div class="pillar">
          <span class="label">年柱</span>
          <span class="value">{{ currentBazi.年柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">月柱</span>
          <span class="value">{{ currentBazi.月柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">日柱</span>
          <span class="value">{{ currentBazi.日柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">时柱</span>
          <span class="value">{{ currentBazi.时柱 }}</span>
        </div>
      </div>
    </div>

    <div class="calculator">
      <h3>选择日期时间计算八字</h3>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label>选择日期：</label>
          <input type="datetime-local" v-model="selectedDate">
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" v-model="useSolarTime">
            使用真太阳时
          </label>
        </div>
        
        <div v-if="useSolarTime" class="city-selector">
          <div class="tabs">
            <button 
              type="button"
              class="tab-btn"
              :class="{ active: cityTab === 'domestic' }"
              @click="switchCityTab('domestic')"
            >
              国内
            </button>
            <button 
              type="button"
              class="tab-btn"
              :class="{ active: cityTab === 'overseas' }"
              @click="switchCityTab('overseas')"
            >
              海外
            </button>
          </div>
          
          <div class="form-group">
            <input 
              v-model="searchKeyword" 
              type="text" 
              :placeholder="cityTab === 'domestic' ? '搜索城市' : '搜索加拿大城市'"
            />
          </div>
          
          <div v-if="searchKeyword" class="search-results">
            <div 
              v-for="city in searchResults" 
              :key="city.name"
              class="city-item"
              :class="{ active: selectedCity === city.name }"
              @click="selectedCity = city.name"
            >
              {{ city.name }}
              <span class="province">({{ city.province }})</span>
            </div>
          </div>
          
          <div v-else class="city-selection">
            <div class="province-list">
              <div 
                v-for="province in provinces" 
                :key="province"
                class="province-item"
                :class="{ active: selectedProvince === province }"
                @click="selectedProvince = province"
              >
                {{ province }}
              </div>
            </div>
            
            <div class="city-list">
              <div 
                v-for="city in citiesInProvince" 
                :key="city.name"
                class="city-item"
                :class="{ active: selectedCity === city.name }"
                @click="selectedCity = city.name"
              >
                {{ city.name }}
              </div>
            </div>
          </div>

          <div v-if="districts.length > 0" class="district-selector">
            <div class="district-list">
              <div 
                v-for="district in districts" 
                :key="district.name"
                class="district-item"
                :class="{ active: selectedDistrict === district.name }"
                @click="selectedDistrict = district.name"
              >
                {{ district.name }}
              </div>
            </div>
          </div>
        </div>
        
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '计算中...' : '计算八字' }}
        </button>
      </form>

      <div v-if="Object.keys(result).length" class="bazi-result">
        <div class="pillar">
          <span class="label">年柱</span>
          <span class="value">{{ result.年柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">月柱</span>
          <span class="value">{{ result.月柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">日柱</span>
          <span class="value">{{ result.日柱 }}</span>
        </div>
        <div class="pillar">
          <span class="label">时柱</span>
          <span class="value">{{ result.时柱 }}</span>
        </div>
        <div v-if="result.真太阳时" class="solar-time-info">
          <p>真太阳时：{{ result.真太阳时 }}</p>
          <p class="location-info">
            位置：{{ result.位置信息.城市 }}
            <span v-if="result.位置信息.区县 !== '市区'">{{ result.位置信息.区县 }}</span>
            <br>
            经度：{{ result.位置信息.经度 }}°E
            <br>
            纬度：{{ result.位置信息.纬度 }}°N
          </p>
        </div>
        <div v-if="result.身强身弱" class="strength-info">
          <h3>身强身弱分析</h3>
          <div class="strength-details">
            <div class="strength-analysis">
              <div class="strength-content">
                <div class="strength-judgment">
                  <div class="judgment-item">
                    <span class="label">日主：</span>
                    <span class="value">{{ result.日柱[0] }}{{ result.身强身弱.details.dayElement }}</span>
                  </div>
                  <div class="judgment-item">
                    <span class="label">总体判断：</span>
                    <span :class="['value', getStrengthClass(result.身强身弱.strength)]">
                      {{ result.身强身弱.strength }}
                    </span>
                  </div>
                  <div class="judgment-item">
                    <span class="label">得分：</span>
                    <span class="value score">{{ result.身强身弱.details.score }}分</span>
                  </div>
                  <div class="judgment-item">
                    <span class="label">判断依据：</span>
                    <span class="value">{{ result.身强身弱.description }}</span>
                  </div>
                </div>
                
                <div class="strength-weights">
                  <h4>各干支力量分布</h4>
                  <div class="weights-grid">
                    <div v-for="(value, key) in result.身强身弱.details.weights" 
                         :key="key" 
                         class="weight-item">
                      <span class="weight-label">{{ key }}：</span>
                      <span :class="['weight-value', getWeightClass(parseFloat(value))]">
                        {{ value }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  background: #f5f7fa;
}

h2, h3 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 25px;
  font-weight: 600;
}

.current-bazi, .calculator {
  margin: 25px 0;
  padding: 25px;
  border: none;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.bazi-result {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 25px 0;
  flex-wrap: wrap;
}

.pillar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  min-width: 120px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.pillar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.label {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 10px;
  font-weight: 500;
}

.value {
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
}

.solar-time-info {
  margin: 20px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  text-align: center;
  font-size: 16px;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.location-info {
  margin-top: 15px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.8;
}

.strength-info {
  margin: 25px 0;
  padding: 25px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.strength-analysis {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.strength-judgment {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 10px;
}

.judgment-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.judgment-item .label {
  font-weight: 600;
  min-width: 100px;
  color: #475569;
}

.judgment-item .value {
  color: #1e293b;
  font-size: 16px;
}

.judgment-item .score {
  font-size: 18px;
  font-weight: 600;
  color: #3b82f6;
}

.strength-weights {
  margin-top: 25px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.strength-weights h4 {
  margin: 0 0 20px 0;
  color: #1e293b;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}

.weights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
}

.weight-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.weight-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.weight-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 6px;
  font-weight: 500;
}

.weight-value {
  font-weight: 600;
  font-size: 16px;
}

.weight-value.positive {
  color: #22c55e;
}

.weight-value.negative {
  color: #ef4444;
}

.weight-value.neutral {
  color: #f59e0b;
}

.form-group {
  margin: 20px 0;
}

input[type="datetime-local"],
input[type="text"] {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 100%;
  font-size: 15px;
  transition: all 0.2s ease;
}

input[type="datetime-local"]:focus,
input[type="text"]:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button[type="submit"] {
  padding: 14px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

button[type="submit"]:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.city-selector {
  margin: 25px 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 25px;
  background: #f8fafc;
}

.tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 15px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: 500;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.tab-btn:hover:not(.active) {
  background: #f1f5f9;
}

.city-selection {
  display: flex;
  gap: 25px;
  margin-top: 20px;
  height: 350px;
}

.province-list {
  width: 180px;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  padding-right: 15px;
}

.province-item {
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 15px;
  color: #475569;
}

.province-item:hover {
  background: #f1f5f9;
}

.province-item.active {
  background: #dbeafe;
  color: #3b82f6;
  font-weight: 500;
}

.city-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 15px;
}

.city-item {
  padding: 14px 18px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #475569;
  background: white;
  border: 1px solid #e2e8f0;
}

.city-item:hover {
  background: #f1f5f9;
  transform: translateX(2px);
}

.city-item.active {
  background: #dbeafe;
  color: #3b82f6;
  border-color: #3b82f6;
  font-weight: 500;
}

.district-selector {
  margin-top: 25px;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.district-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 15px;
  max-height: 250px;
  overflow-y: auto;
}

.district-item {
  padding: 12px 18px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  text-align: center;
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.district-item:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.district-item.active {
  background: #dbeafe;
  color: #3b82f6;
  border-color: #3b82f6;
  font-weight: 500;
}

.province {
  color: #64748b;
  font-size: 0.9em;
}

.search-results {
  margin-top: 20px;
  max-height: 350px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
