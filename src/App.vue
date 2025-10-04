<template>
  <div class="container">
    <!-- 语言切换器 -->
    <LanguageSwitcher />
    
    <div class="form-container">
      <div class="form-group">
        <label>{{ t('form.birthDate.label') }}*</label>
        <el-date-picker
          v-model="birthDate"
          type="date"
          class="input-field"
          :placeholder="t('form.birthDate.placeholder')"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </div>

      <div class="form-group">
        <label>{{ t('form.birthPlace.label') }}*</label>
        
        <!-- 地理位置服务选择器（已隐藏，保留功能） -->
        <div class="location-service-selector" style="display: none;">
          <el-radio-group v-model="locationService" size="small" class="service-toggle">
            <el-radio-button value="traditional">{{ t('form.birthPlace.traditional') }}</el-radio-button>
            <el-radio-button value="leaflet">{{ t('form.birthPlace.international') }}</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 传统地理位置选择器（已隐藏，保留功能） -->
        <CustomCascader
          v-if="locationService === 'traditional'"
          v-model="location"
          :options="locationData"
          :placeholder="t('form.birthPlace.label')"
          class="input-field"
        />

        <!-- Leaflet 国际地理位置选择器 -->
        <div v-if="locationService === 'leaflet'" class="leaflet-location-container">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-select
                v-model="leafletCountry"
                :placeholder="t('form.birthPlace.country')"
                class="input-field"
                @change="onCountryChange"
              >
                <el-option
                  v-for="country in leafletCountries"
                  :key="country"
                  :label="country"
                  :value="country"
                />
              </el-select>
            </el-col>
            <el-col :span="16">
              <div class="city-input-container">
                <el-select
                  v-model="leafletCity"
                  :placeholder="t('form.birthPlace.city')"
                  class="input-field"
                  filterable
                  allow-create
                  @change="onCityChange"
                  @blur="onCityInputBlur"
                >
                  <el-option
                    v-for="city in leafletCities"
                    :key="city.value"
                    :label="city.label + (city.custom ? ' (custom)' : '')"
                    :value="city.value"
                  />
                </el-select>
                <el-button 
                  v-if="showAddCityButton"
                  @click="showAddCityDialog"
                  type="text"
                  size="small"
                  class="add-city-btn"
                >
                  {{ t('form.birthPlace.addCity') }}
                </el-button>
              </div>
            </el-col>
          </el-row>
          
          <!-- 显示当前选择的坐标信息 -->
          <div v-if="currentLeafletCoordinates" class="coordinates-display">
            <small>{{ t('form.birthPlace.coordinates') }}: {{ currentLeafletCoordinates.lat.toFixed(4) }}°N, {{ currentLeafletCoordinates.lng.toFixed(4) }}°E</small>
          </div>
        </div>
      </div>

      <!-- 添加自定义城市对话框 -->
      <el-dialog
        v-model="addCityDialogVisible"
        :title="t('dialog.addCity.title')"
        width="500px"
      >
        <el-form :model="customCityForm" label-width="80px">
          <el-form-item :label="t('dialog.addCity.cityName')">
            <el-input 
              v-model="customCityForm.name" 
              :placeholder="t('dialog.addCity.cityPlaceholder')" 
            />
          </el-form-item>
          <el-form-item :label="t('dialog.addCity.search')">
            <el-button 
              type="primary" 
              @click="searchCityCoordinates"
              :loading="searchLoading"
              style="width: 100%"
            >
              {{ searchLoading ? t('dialog.addCity.searching') : t('dialog.addCity.searchButton') }}
            </el-button>
            <div v-if="searchResults.length > 0" class="search-results">
              <div class="search-results-title">{{ t('dialog.addCity.searchResults') }}</div>
              <div 
                v-for="(result, index) in searchResults" 
                :key="index"
                class="search-result-item"
                @click="selectSearchResult(result)"
              >
                <div class="result-name">{{ result.name }}</div>
                <div class="result-coords">{{ result.lat.toFixed(4) }}°N, {{ result.lng.toFixed(4) }}°E</div>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="t('dialog.addCity.selectedCoords')" v-if="customCityForm.lat && customCityForm.lng">
            <div class="selected-coordinates">
              <span>{{ t('dialog.addCity.latitude') }}: {{ customCityForm.lat.toFixed(4) }}°N</span>
              <span style="margin-left: 20px;">{{ t('dialog.addCity.longitude') }}: {{ customCityForm.lng.toFixed(4) }}°E</span>
            </div>
          </el-form-item>
          <el-form-item v-if="searchError" :label="t('dialog.addCity.error')">
            <div class="search-error">{{ searchError }}</div>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addCityDialogVisible = false">{{ t('dialog.addCity.cancel') }}</el-button>
          <el-button 
            type="primary" 
            @click="addCustomCity"
            :disabled="!customCityForm.lat || !customCityForm.lng"
          >
            {{ t('dialog.addCity.confirm') }}
          </el-button>
        </template>
      </el-dialog>

      <div class="form-group">
        <label>{{ t('form.birthTime.label') }}</label>
        <el-select
          v-model="birthHour"
          class="input-field"
          :placeholder="t('form.birthTime.placeholder')"
          clearable
        >
          <el-option
            v-for="hour in hours"
            :key="hour.value"
            :label="hour.label"
            :value="hour.value"
          />
        </el-select>
        <div class="form-hint">{{ t('form.birthTime.hint') }}</div>
      </div>

      <div class="form-group">
        <label>{{ t('form.gender.label') }}</label>
        <div class="radio-group">
          <el-radio-group v-model="gender">
            <el-radio :value="'male'">{{ t('form.gender.male') }}</el-radio>
            <el-radio :value="'female'">{{ t('form.gender.female') }}</el-radio>
            <el-radio :value="'unknown'">{{ t('form.gender.unknown') }}</el-radio>
          </el-radio-group>
        </div>
      </div>

      <el-button type="primary" class="submit-btn" @click="handleSubmit">
        {{ t('common.submit') }}
      </el-button>
      <p class="hint">{{ t('common.hint') }}</p>
    </div>

    <div v-if="destinyInfo" class="destiny-result">
      <div class="result-header">
        <h2>{{ t('result.title', { key: destinyInfo.key, name: destinyInfo.name }) }}</h2>
        <div class="result-time">{{ t('result.calculationTime', { time: new Date().toLocaleString() }) }}</div>
      </div>

      <div class="result-sections">
        <div class="left-section">
          <div class="section">
            <div class="section-icon">{{ t('result.sections.personality.icon') }}</div>
            <div class="section-title">{{ t('result.sections.personality.title') }}</div>
            <div class="section-content">
              <div class="birth-info">
                {{ t('result.bazi', { bazi: baziInfo.bazi }) }}<br>
                {{ t('result.solarTime', { time: baziInfo.solarTime }) }}
              </div>
              <div v-for="(info, index) in destinyInfo.personality.info1" :key="index" class="info-item">
                {{ info }}
              </div>
              <div class="info-detail">{{ destinyInfo.personality.info2 }}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-icon">{{ t('result.sections.relationship.icon') }}</div>
            <div class="section-title">{{ t('result.sections.relationship.title') }}</div>
            <div class="section-content">
              <div class="relation-group">
                <div class="group-title">{{ t('result.sections.relationship.friendSuggestion') }}</div>
                <div v-for="(item, index) in destinyInfo.relationship.friendSuggestion" :key="index" class="relation-item">
                  {{ item }}
                </div>
              </div>
              <div class="relation-group">
                <div class="group-title">{{ t('result.sections.relationship.coupleSuggestion') }}</div>
                <div v-for="(item, index) in destinyInfo.relationship.coupleSuggestion" :key="index" class="relation-item">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-section">
          <div class="section">
            <div class="section-icon">{{ t('result.sections.luck.icon') }}</div>
            <div class="section-title">{{ t('result.sections.luck.title') }}</div>
            <div class="section-content">
              <div v-for="(item, index) in destinyInfo.luck.info1" :key="index" class="fortune-item">
                <div class="fortune-title">{{ item.title }}</div>
                <div class="fortune-desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-icon">{{ t('result.sections.luckSuggestion.icon') }}</div>
            <div class="section-title">{{ t('result.sections.luckSuggestion.title') }}</div>
            <div class="section-content">
              <div class="advice-group">
                <div class="advice-title">{{ t('result.sections.luckSuggestion.color') }}</div>
                <div class="advice-items">
                  <div v-for="(color, index) in destinyInfo.luckSuggestion.color" :key="index" class="tag-item">
                    {{ color }}
                  </div>
                </div>
              </div>

              <div class="advice-group">
                <div class="advice-title">{{ t('result.sections.luckSuggestion.location') }}</div>
                <div class="advice-items">
                  <div v-for="(location, index) in destinyInfo.luckSuggestion.location" :key="index" class="tag-item">
                    {{ location }}
                  </div>
                </div>
              </div>

              <div class="advice-group">
                <div class="advice-title">{{ t('result.sections.luckSuggestion.career') }}</div>
                <div class="advice-items">
                  <div v-for="(career, index) in destinyInfo.career.needCareer" :key="index" class="tag-item">
                    {{ career }}
                  </div>
                </div>
              </div>

              <div class="advice-group">
                <div class="advice-title">{{ t('result.sections.luckSuggestion.tips') }}</div>
                <div class="tips-items">
                  <div v-for="(tip, index) in destinyInfo.luckTips" :key="index" class="tip-item">
                    {{ tip }}
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

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/dist/index.css";
import { locationData } from "./data/locationData";
import CustomCascader from "./components/CustomCascader.vue";
import { calculateSolarTime } from "./utils/solarTime";
import { getLocationInfo } from "./data/locationData";
import { calculateBaZi } from "./utils/bazi";
import { analyzeStrength } from "./utils/strength";
import { findDestinyByKey } from "./data";
// 导入新的 Leaflet 地理位置服务
import { 
  getCountries, 
  getCitiesByCountry, 
  getCityCoordinates, 
  addCustomCity as addLeafletCustomCity,
  isValidCoordinates,
  searchCityWithLeaflet,
  getCustomCities
} from "./utils/leafletLocation";
// 导入新的 Suncalc 太阳时计算
import { calculateSolarTimeCompat } from "./utils/suncalcSolar";
// 导入国际化
import { useI18n } from "./i18n";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";

// 使用国际化
const { t, locale, setLocale } = useI18n();

const birthDate = ref("");
const location = ref([]);
const birthHour = ref("");
const gender = ref("");
const isMobile = ref(false);
const destinyInfo = ref(null);
const baziInfo = ref({
  bazi: '',
  solarTime: ''
});
const lastCalculatedStrength = ref(null); // 保存上次计算的身强身弱结果

// 地理位置服务选择（默认使用国际方案，传统方案已隐藏但保留功能）
const locationService = ref('leaflet'); // 'traditional' 或 'leaflet'

// Leaflet 地理位置相关数据
const leafletCountry = ref('');
const leafletCity = ref('');
const leafletCountries = ref(getCountries());
const leafletCities = ref([]);
const currentLeafletCoordinates = ref(null);

// 自定义城市对话框
const addCityDialogVisible = ref(false);
const customCityForm = ref({
  name: '',
  lat: null,
  lng: null
});
const searchLoading = ref(false);
const searchResults = ref([]);
const searchError = ref('');

// 计算属性：获取自定义城市列表
const customCities = computed(() => getCustomCities());

// 计算属性：是否显示添加城市按钮
const showAddCityButton = computed(() => {
  return leafletCountry.value && (!leafletCity.value || 
    !leafletCities.value.find(city => city.value === leafletCity.value));
});

const locationProps = {
  expandTrigger: "hover",
  checkStrictly: false,
  multiple: false,
  emitPath: true,
  lazy: false,
  value: "value",
  label: "label",
  children: "children",
};

// 时辰选项 - 使用计算属性支持多语言
const hours = computed(() => [
  { value: "23-1", label: t('form.birthTime.zi') },
  { value: "1-3", label: t('form.birthTime.chou') },
  { value: "3-5", label: t('form.birthTime.yin') },
  { value: "5-7", label: t('form.birthTime.mao') },
  { value: "7-9", label: t('form.birthTime.chen') },
  { value: "9-11", label: t('form.birthTime.si') },
  { value: "11-13", label: t('form.birthTime.wu') },
  { value: "13-15", label: t('form.birthTime.wei') },
  { value: "15-17", label: t('form.birthTime.shen') },
  { value: "17-19", label: t('form.birthTime.you') },
  { value: "19-21", label: t('form.birthTime.xu') },
  { value: "21-23", label: t('form.birthTime.hai') },
]);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// 监听语言变化，自动重新加载命理数据
watch(locale, (newLocale) => {
  // 如果已经有计算结果，切换语言时重新加载对应语言的数据
  if (lastCalculatedStrength.value && destinyInfo.value) {
    destinyInfo.value = findDestinyByKey(lastCalculatedStrength.value, newLocale);
    console.log('语言已切换为:', newLocale === 'zh-CN' ? '中文' : 'English');
  }
});

// Leaflet 地理位置服务方法
const onCountryChange = (country) => {
  console.log('Country changed:', country);
  leafletCity.value = '';
  currentLeafletCoordinates.value = null;
  
  if (country) {
    const cityNames = getCitiesByCountry(country);
    leafletCities.value = cityNames.map(cityName => {
      // 检查是否为自定义城市
      const isCustom = customCities.value.some(city => 
        city.name === cityName && city.country === country
      );
      
      return {
        value: cityName,
        label: cityName,
        custom: isCustom
      };
    });
  } else {
    leafletCities.value = [];
  }
};

const onCityChange = async (cityName) => {
  console.log('City changed:', cityName);
  if (cityName && leafletCountry.value) {
    try {
      // 显示加载状态
      currentLeafletCoordinates.value = null;
      
      const coordinates = await getCityCoordinates(cityName, leafletCountry.value);
      if (coordinates) {
        currentLeafletCoordinates.value = coordinates;
        console.log('Coordinates found:', coordinates);
      } else {
        console.log('Coordinates not found for:', cityName);
        ElMessage.warning(t('messages.cannotGetCoords', { city: cityName }));
      }
    } catch (error) {
      console.error('Error getting city coordinates:', error);
      ElMessage.error(t('messages.coordsGetFailed'));
      currentLeafletCoordinates.value = null;
    }
  } else {
    currentLeafletCoordinates.value = null;
  }
};

const onCityInputBlur = () => {
  // 当用户输入自定义城市名时，清除坐标直到用户确认添加
  if (leafletCity.value && !leafletCities.value.find(city => city.value === leafletCity.value)) {
    currentLeafletCoordinates.value = null;
  }
};

const showAddCityDialog = () => {
  customCityForm.value = {
    name: leafletCity.value || '',
    lat: null,
    lng: null
  };
  searchResults.value = [];
  searchError.value = '';
  addCityDialogVisible.value = true;
};

// 使用 Leaflet 搜索城市坐标
const searchCityCoordinates = async () => {
  if (!customCityForm.value.name.trim()) {
    ElMessage.warning(t('messages.enterCityName'));
    return;
  }
  
  searchLoading.value = true;
  searchError.value = '';
  searchResults.value = [];
  
  try {
    const results = await searchCityWithLeaflet(customCityForm.value.name);
    
    if (results.length === 0) {
      searchError.value = t('messages.noCityFound');
      ElMessage.warning(t('messages.cityNotFound'));
    } else {
      searchResults.value = results;
      ElMessage.success(t('messages.searchSuccess', { count: results.length }));
    }
  } catch (error) {
    console.error('搜索城市坐标失败：', error);
    searchError.value = t('messages.searchFailed');
    ElMessage.error(t('messages.searchFailed'));
  } finally {
    searchLoading.value = false;
  }
};

// 选择搜索结果
const selectSearchResult = (result) => {
  customCityForm.value.lat = result.lat;
  customCityForm.value.lng = result.lng;
  
  // 如果用户没有输入城市名称，使用搜索结果中的城市名
  if (!customCityForm.value.name.trim()) {
    customCityForm.value.name = result.city || result.name.split(',')[0];
  }
  
  searchResults.value = [];
  ElMessage.success(t('messages.coordsSelected'));
};

const addCustomCity = () => {
  const { name, lat, lng } = customCityForm.value;
  
  // 验证输入
  if (!name || !name.trim()) {
    ElMessage.warning(t('messages.enterCityName'));
    return;
  }
  
  if (!lat || !lng || !isValidCoordinates(lat, lng)) {
    ElMessage.warning(t('messages.selectValidCoords'));
    return;
  }
  
  if (!leafletCountry.value) {
    ElMessage.warning(t('messages.selectCountryFirst'));
    return;
  }
  
  // 添加自定义城市
  const success = addLeafletCustomCity(name.trim(), leafletCountry.value, lat, lng);
  
  if (success) {
    ElMessage.success(t('messages.cityAddSuccess'));
    
    // 更新城市列表
    onCountryChange(leafletCountry.value);
    
    // 选择新添加的城市
    leafletCity.value = name.trim();
    currentLeafletCoordinates.value = { lat, lng };
    
    // 关闭对话框
    addCityDialogVisible.value = false;
  } else {
    ElMessage.error(t('messages.cityAddFailed'));
  }
};

const handleSubmit = () => {
  if (!birthDate.value) {
    ElMessage.warning(t('messages.selectBirthDate'));
    return;
  }

  // 验证地理位置信息
  let coordinates = null;
  let locationName = '';
  let useNewSolarMethod = false;

  if (locationService.value === 'traditional') {
    // 使用传统方案
    if (location.value.length > 0) {
      const selectedCity = location.value[location.value.length - 1];
      const locationInfo = getLocationInfo(selectedCity);
      if (locationInfo?.coordinates) {
        coordinates = {
          lat: locationInfo.coordinates.lat,
          lng: locationInfo.coordinates.lng
        };
        locationName = `${locationInfo.country} ${locationInfo.province} ${locationInfo.city}`;
      }
    }
  } else if (locationService.value === 'leaflet') {
    // 使用 Leaflet 国际方案
    if (!leafletCountry.value || !leafletCity.value) {
      ElMessage.warning(t('messages.selectCountryCity'));
      return;
    }
    
    if (!currentLeafletCoordinates.value) {
      ElMessage.warning(t('messages.noCoordinates'));
      return;
    }
    
    coordinates = currentLeafletCoordinates.value;
    locationName = `${leafletCountry.value} ${leafletCity.value}`;
    useNewSolarMethod = true; // 使用新的 Suncalc 方法
  }

  // 解析时辰，获取中间值，默认午时（12点）
  let hourValue = 12; // 默认午时
  if (birthHour.value) {
    // 处理子时（23-1）的特殊情况
    if (birthHour.value === '23-1') {
      hourValue = 0; // 子时取0点
    } else {
      const [start, end] = birthHour.value.split('-').map(Number);
      hourValue = Math.floor((start + end) / 2);
    }
  }

  // 创建日期对象
  const [year, month, day] = birthDate.value.split('-').map(Number);
  const date = new Date(year, month - 1, day, hourValue, 0, 0);

  // 计算真太阳时
  let targetDate = date;
  let solarCalculationMethod = '标准时间';
  
  if (coordinates) {
    try {
      if (useNewSolarMethod) {
        // 使用新的 Suncalc 方法
        targetDate = calculateSolarTimeCompat(date, coordinates.lng, coordinates.lat, true);
        solarCalculationMethod = 'Suncalc方法';
        console.log('使用 Suncalc 方法计算真太阳时');
      } else {
        // 使用传统方法
        targetDate = calculateSolarTime(date, coordinates.lng, coordinates.lat, true);
        solarCalculationMethod = '传统方法';
        console.log('使用传统方法计算真太阳时');
      }
    } catch (error) {
      console.error('太阳时计算失败，使用备用方案：', error);
      ElMessage.warning(t('messages.solarTimeFailed'));
      
      // 备用方案：如果新方法失败，尝试传统方法
      if (useNewSolarMethod) {
        try {
          targetDate = calculateSolarTime(date, coordinates.lng, coordinates.lat, true);
          solarCalculationMethod = '传统方法(备用)';
          console.log('备用方案：使用传统方法');
        } catch (backupError) {
          console.error('备用方案也失败，使用原始时间：', backupError);
          targetDate = date;
          solarCalculationMethod = '原始时间(备用)';
        }
      } else {
        // 如果传统方法失败，使用原始时间
        targetDate = date;
        solarCalculationMethod = '原始时间(备用)';
      }
    }
  }

  // 计算八字
  const bazi = calculateBaZi(targetDate, !!coordinates, coordinates?.lng, coordinates?.lat);
  
  // 更新八字信息
  baziInfo.value = {
    bazi: `${bazi.年柱} ${bazi.月柱} ${bazi.日柱} ${bazi.时柱}`,
    solarTime: targetDate.toLocaleString()
  };

  // 分析身强身弱
  const strength = analyzeStrength(bazi);
  
  // 保存计算结果，用于语言切换
  lastCalculatedStrength.value = strength;

  // 查找对应的命理数据（使用key字段进行索引，根据当前语言）
  destinyInfo.value = findDestinyByKey(strength, locale.value);
  
  console.log('命理信息：', {
    地理位置服务: locationService.value === 'traditional' ? '传统方案' : 'Leaflet国际方案',
    选择时间: date.toLocaleString(),
    地点: locationName || '未选择地区',
    经纬度: coordinates ? `${coordinates.lng.toFixed(4)}°E, ${coordinates.lat.toFixed(4)}°N` : '未获取',
    计算方法: solarCalculationMethod,
    真太阳时: targetDate.toLocaleString(),
    八字: `${bazi.年柱} ${bazi.月柱} ${bazi.日柱} ${bazi.时柱}`,
    身强身弱: strength,
    命理类型: destinyInfo.value ? `${destinyInfo.value.key} · ${destinyInfo.value.name}` : '未找到对应的命理数据'
  });

  // 滚动到结果位置
  setTimeout(() => {
    const resultElement = document.querySelector('.destiny-result');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

const getImageUrl = (name) => {
  return `/images/destiny/${name}.png`;
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  padding: 40px 0;

  .form-container,
  .result-container {
    background-color: #ffffff;
    padding: 40px 50px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    width: 85%;
    max-width: 1000px;
    border: none;
    margin: 0 auto 40px;
  }

  .form-container {
    .form-group {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        margin-bottom: 10px;
        color: #333;
        font-size: 14px;
        font-weight: 400;
      }

      .input-field {
        width: 100% !important;
      }

      :deep(.el-input__inner),
      :deep(.el-input__wrapper),
      :deep(.el-cascader),
      :deep(.el-select) {
        height: 40px !important;
        font-size: 14px;
      }

      :deep(.el-date-editor) {
        height: 40px !important;
        line-height: 40px !important;
      }

      :deep(.el-date-editor.el-input) {
        height: 40px !important;
        line-height: normal !important;
        
        .el-input__wrapper {
          height: 40px !important;
          padding: 0 11px !important;
          box-sizing: border-box !important;
        }
        
        .el-input__inner {
          height: 38px !important;
          line-height: 38px !important;
        }
        
        .el-input__prefix,
        .el-input__suffix {
          height: 40px !important;
          display: flex !important;
          align-items: center !important;
        }
      }

      :deep(.el-input__wrapper) {
        background-color: #fff !important;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        box-shadow: none !important;

        &:hover {
          border-color: #b3966d;
        }

        &.is-focus {
          border-color: #b3966d;
          box-shadow: none !important;
        }
      }

      :deep(.el-select .el-input__wrapper),
      :deep(.el-date-editor .el-input__wrapper) {
        border: 1px solid #e5e5e5;
        border-radius: 6px;
      }

      .radio-group {
        padding: 8px 0;

        :deep(.el-radio__label) {
          font-size: 14px;
        }
      }

      .form-hint {
        margin-top: 8px;
        color: #999;
        font-size: 12px;
        line-height: 1.5;
      }
    }

    .submit-btn {
      width: 160px;
      height: 44px;
      font-size: 15px;
      font-weight: 400;
      margin: 32px auto 0;
      border-radius: 6px;
      background-color: #a08968 !important;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover {
        background-color: #8f7857 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(160, 137, 104, 0.3);
      }
    }

    .hint {
      text-align: center;
      color: #999;
      font-size: 13px;
      margin-top: 16px;
      font-weight: 300;
    }

      /* Leaflet 地理位置服务样式 */
      .location-service-selector {
        margin-bottom: 12px;

        .service-toggle {
          width: 100%;
          display: flex;
          
          :deep(.el-radio-button) {
            flex: 1;
          }
          
          :deep(.el-radio-button__inner) {
            width: 100%;
            text-align: center;
            border-radius: 6px;
            font-size: 14px;
          }
          
          :deep(.el-radio-button:first-child .el-radio-button__inner) {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          
          :deep(.el-radio-button:last-child .el-radio-button__inner) {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }

      .leaflet-location-container {
        .city-input-container {
          position: relative;
          margin-bottom: 8px;

          .add-city-btn {
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 6px;
            padding: 4px 8px;
            color: #8b7355;
            font-size: 12px;
            border: 1px solid rgba(139, 115, 85, 0.3);
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(4px);
            transition: all 0.2s ease;

            &:hover {
              color: #7a6445;
              border-color: #7a6445;
              background: rgba(255, 255, 255, 1);
              transform: translateY(-1px);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
          }
        }

        .coordinates-display {
          margin-top: 12px;
          padding: 8px 12px;
          background: linear-gradient(135deg, rgba(139, 115, 85, 0.08), rgba(139, 115, 85, 0.12));
          border-radius: 6px;
          border: 1px solid rgba(139, 115, 85, 0.15);
          backdrop-filter: blur(4px);
          
          small {
            color: #8b7355;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            
            &:before {
              content: "📍";
              font-size: 14px;
            }
          }
        }
      }

      /* 自定义城市对话框样式 */
      .search-results {
        margin-top: 12px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        max-height: 200px;
        overflow-y: auto;

        .search-results-title {
          padding: 8px 12px;
          background: #f5f7fa;
          font-size: 13px;
          color: #606266;
          border-bottom: 1px solid #e4e7ed;
        }

        .search-result-item {
          padding: 8px 12px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: #f5f7fa;
          }

          &:last-child {
            border-bottom: none;
          }

          .result-name {
            font-size: 14px;
            color: #303133;
            margin-bottom: 2px;
          }

          .result-coords {
            font-size: 12px;
            color: #909399;
          }
        }
      }

      .selected-coordinates {
        color: #8b7355;
        font-size: 14px;
        font-weight: 500;
      }

      .search-error {
        color: #f56c6c;
        font-size: 13px;
      }
    }
  }

  .result-container {
    margin: 40px auto;

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h2 {
        font-size: 20px;
        font-weight: 500;
        color: #333;
        margin: 0;
      }

      .action-buttons {
        display: flex;
        gap: 12px;

        .action-btn {
          height: 32px;
          padding: 0 16px;
          font-size: 13px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .result-meta {
      color: #666;
      font-size: 13px;
      margin-bottom: 24px;
    }

    .result-content {
      display: flex;
      gap: 24px;

      .result-left {
        flex: 1;
        min-width: 0;
      }

      .result-right {
        flex: 1;
        min-width: 0;
      }
    }

    .result-section {
      background: #fff;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        color: #333;
        font-weight: 500;
        margin-bottom: 16px;

        i {
          color: #8b7355;
        }
      }

      .section-content {
        color: #666;
        font-size: 14px;
        line-height: 1.6;

        .birth-info {
          color: #999;
          margin-bottom: 12px;
        }

        .destiny-text {
          margin-bottom: 8px;
        }

        .destiny-type {
          color: #8b7355;
          margin-top: 12px;
        }

        p {
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        .sub-section {
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          h4 {
            color: #333;
            font-size: 14px;
            font-weight: 500;
            margin: 0 0 8px 0;
          }
        }

        .sub-title {
          color: #333;
          font-weight: 500;
          margin: 16px 0 8px;

          &:first-child {
            margin-top: 0;
          }
        }

        .career-grid {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;

          .career-column {
            flex: 1;

            h4 {
              color: #333;
              font-size: 14px;
              font-weight: 500;
              margin: 0 0 12px 0;
            }

            .career-item {
              background: rgba(139, 115, 85, 0.05);
              padding: 12px;
              border-radius: 6px;
              margin-bottom: 8px;

              &:last-child {
                margin-bottom: 0;
              }

              .item-title {
                color: #333;
                font-size: 14px;
                margin-bottom: 4px;
              }

              .item-desc {
                color: #666;
                font-size: 12px;
              }
            }
          }
        }

        .tips-section {
          h4 {
            color: #333;
            font-size: 14px;
            font-weight: 500;
            margin: 0 0 12px 0;
          }

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              position: relative;
              padding-left: 12px;
              margin-bottom: 8px;
              font-size: 13px;

              &:last-child {
                margin-bottom: 0;
              }

              &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 8px;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: #8b7355;
              }
            }
          }
        }
      }
    }
  }

  .image-container {
    margin: 40px auto;
    max-width: 1000px;
    background-color: #faf7f2;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

    .image-wrapper {
      display: flex;
      gap: 40px;
      align-items: center;

      .destiny-image {
        width: 400px;
        height: 600px;
        border-radius: 8px;
        object-fit: cover;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .image-info {
        flex: 1;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        h3 {
          font-size: 28px;
          color: #8b7355;
          margin-bottom: 24px;
          text-align: center;
          font-weight: 600;
        }

        .personality-info {
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(139, 115, 85, 0.05);
          border-radius: 8px;

          p {
            font-size: 16px;
            line-height: 1.8;
            color: #333;
            margin-bottom: 12px;

            &.info2 {
              white-space: pre-line;
              color: #666;
              font-size: 15px;
            }
          }
        }

        .luck-info {
          h4 {
            font-size: 20px;
            color: #8b7355;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
          }

          .luck-item {
            margin-bottom: 24px;
            padding: 16px;
            background: #fff;
            border-radius: 8px;
            border: 1px solid rgba(139, 115, 85, 0.1);

            h5 {
              font-size: 18px;
              color: #8b7355;
              margin-bottom: 12px;
              font-weight: 500;
            }

            p {
              font-size: 15px;
              line-height: 1.8;
              color: #666;
            }
          }
        }
      }
    }
  }

.destiny-result {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  width: 85%;
  max-width: 1000px;
  margin: 0 auto 40px;
  padding: 40px 50px;

  .result-header {
    margin-bottom: 30px;
    
    h2 {
      font-size: 24px;
      color: #333;
      margin-bottom: 8px;
    }

    .result-time {
      color: #999;
      font-size: 14px;
    }
  }

  .result-sections {
    display: flex;
    gap: 24px;

    .left-section, .right-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .section {
      background: #faf7f2;
      border-radius: 12px;
      padding: 24px;

      .section-icon {
        font-size: 20px;
        margin-bottom: 12px;
      }

      .section-title {
        font-size: 18px;
        color: #8b7355;
        margin-bottom: 20px;
        font-weight: 500;
      }

      .section-content {
        .birth-info {
          color: #999;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .info-item {
          margin-bottom: 12px;
          color: #333;
          line-height: 1.6;
        }

        .info-detail {
          color: #666;
          line-height: 1.8;
          margin-top: 16px;
          white-space: pre-line;
        }

        .relation-group {
          margin-bottom: 24px;

          .group-title {
            color: #8b7355;
            font-size: 16px;
            margin-bottom: 12px;
          }

          .relation-item {
            color: #666;
            margin-bottom: 8px;
            padding-left: 12px;
            position: relative;

            &:before {
              content: "•";
              position: absolute;
              left: 0;
              color: #8b7355;
            }
          }
        }

        .fortune-item {
          margin-bottom: 20px;

          .fortune-title {
            color: #8b7355;
            font-size: 16px;
            margin-bottom: 8px;
          }

          .fortune-desc {
            color: #666;
            line-height: 1.6;
          }
        }

        .advice-group {
          margin-bottom: 24px;

          .advice-title {
            color: #8b7355;
            font-size: 16px;
            margin-bottom: 12px;
          }

          .advice-items {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .tag-item {
              background: #fff;
              padding: 6px 12px;
              border-radius: 16px;
              font-size: 14px;
              color: #666;
              border: 1px solid rgba(139, 115, 85, 0.2);
            }
          }

          .tips-items {
            .tip-item {
              color: #666;
              margin-bottom: 8px;
              padding-left: 12px;
              position: relative;

              &:before {
                content: "•";
                position: absolute;
                left: 0;
                color: #8b7355;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .container {
    padding: 20px 0;
    
    .form-container,
    .result-container {
      margin: 0 auto 20px;
      padding: 24px 20px;
      width: 90%;
      max-width: none;
      border-radius: 12px;
      
      .form-group {
        margin-bottom: 20px;
        
        /* 移动端地理位置服务改进 */
        .location-service-selector {
          margin-bottom: 16px;
          
          .service-toggle {
            :deep(.el-radio-button__inner) {
              font-size: 13px;
              padding: 8px 12px;
            }
          }
        }
        
        .leaflet-location-container {
          :deep(.el-row) {
            margin: 0 !important;
          }
          
          :deep(.el-col) {
            padding: 0 4px !important;
            
            &:first-child {
              padding-left: 0 !important;
            }
            
            &:last-child {
              padding-right: 0 !important;
            }
          }
          
          .city-input-container {
            margin-bottom: 12px;
            
            .add-city-btn {
              position: static;
              width: 100%;
              margin-top: 8px;
              margin-bottom: 8px;
              transform: none !important;
              
              &:hover {
                transform: none !important;
              }
            }
          }
          
          .coordinates-display {
            margin-top: 8px;
            padding: 6px 8px;
            
            small {
              font-size: 12px;
              flex-direction: column;
              align-items: flex-start;
              gap: 2px;
              
              &:before {
                content: "📍 坐标信息:";
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    .result-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .result-content {
      flex-direction: column;
    }

    .result-section {
      padding: 20px;
    }

    .career-grid {
      flex-direction: column;
      gap: 16px;
    }
  }

  .image-container {
    padding: 20px;
    margin: 20px auto;

    .image-wrapper {
      flex-direction: column;
      gap: 20px;

      .destiny-image {
        width: 100%;
        height: auto;
        max-height: 500px;
        margin-bottom: 20px;
      }

      .image-info {
        padding: 15px;

        h3 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .personality-info {
          padding: 15px;
          margin-bottom: 20px;

          p {
            font-size: 15px;
            margin-bottom: 10px;
          }
        }

        .luck-info {
          h4 {
            font-size: 18px;
            margin-bottom: 15px;
          }

          .luck-item {
            padding: 12px;
            margin-bottom: 20px;

            h5 {
              font-size: 16px;
              margin-bottom: 10px;
            }

            p {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .destiny-result {
    width: 90%;
    max-width: none;
    margin: 0 auto 20px;
    padding: 24px 20px;
    border-radius: 12px;
    
    .result-sections {
      flex-direction: column;
    }

    .section {
      padding: 20px;
    }
  }
}
</style>
