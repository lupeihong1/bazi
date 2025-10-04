<template>
  <div class="container">
    <!-- 语言切换器 -->
    <!-- <LanguageSwitcher /> -->
    
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
        <h2>{{ locale === 'en-US' ? `${destinyInfo.name}` : t('result.title', { key: destinyInfo.key, name: destinyInfo.name }) }}</h2>
        <div class="result-time">{{ t('result.calculationTime', { time: new Date().toLocaleString() }) }}</div>
        <!-- 八字信息 -->
        <div class="bazi-info">
          <div class="bazi-text">
            {{ t('result.bazi', { bazi: locale === 'en-US' ? baziInfo.baziEn : baziInfo.bazi }) }}
          </div>
          <div class="solar-time">
            {{ t('result.solarTime', { time: baziInfo.solarTime }) }}
          </div>
        </div>
      </div>

      <div class="result-sections">
        <!-- 个人特质板块 -->
        <div class="section">
          <div class="section-icon">🌟</div>
          <div class="section-title">{{ t('result.sections.personality.title') }}</div>
          <div class="section-content">
            <div v-for="(info, index) in destinyInfo.personality.info1" :key="index" class="info-item">
              {{ info }}
            </div>
          </div>
        </div>

        <!-- 性格特征板块 -->
        <div class="section">
          <div class="section-icon">💭</div>
          <div class="section-title">{{ t('result.sections.character.title') }}</div>
          <div class="section-content">
            <div class="character-traits">
              {{ destinyInfo.personality.info2 }}
            </div>
          </div>
        </div>

        <!-- 喜用神板块 -->
        <div class="section">
          <div class="section-icon">⚡</div>
          <div class="section-title">{{ t('result.sections.favorableElements.title') }}</div>
          <div class="section-content">
            <div class="favorable-elements">
              {{ destinyInfo.favorableElements }}
            </div>
          </div>
        </div>

        <!-- 人际关系板块 -->
        <div class="section">
          <div class="section-icon">👥</div>
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

        <!-- 运势解读板块 -->
        <div class="section">
          <div class="section-icon">🔮</div>
          <div class="section-title">{{ t('result.sections.luck.title') }}</div>
          <div class="section-content">
            <div v-for="(item, index) in destinyInfo.luck.info1" :key="index" class="fortune-item">
              <div class="fortune-title">{{ item.title }}</div>
              <!-- 特殊处理职业管理/Career Pathways，分成推荐和慎重两段 -->
              <template v-if="item.title === '职业管理' || item.title === 'Career Pathways' || item.title.includes('Career Pathways')">
                <div class="career-sections">
                  <!-- 中文模式 -->
                  <template v-if="locale === 'zh-CN'">
                    <div class="career-recommended" v-if="item.desc.includes('推荐行业')">
                      <div class="career-label">✦ 推荐行业</div>
                      <div class="career-text" v-html="formatCareerText(extractCareerSection(item.desc, '推荐行业'))"></div>
                    </div>
                    <div class="career-caution" v-if="item.desc.includes('慎重行业')">
                      <div class="career-label">⚠ 慎重行业</div>
                      <div class="career-text" v-html="formatCareerText(extractCareerSection(item.desc, '慎重行业'))"></div>
                    </div>
                  </template>
                  <!-- 英文模式 -->
                  <template v-else>
                    <div class="career-recommended" v-if="item.desc.includes('Where You Flourish')">
                      <div class="career-label">✦ Where You Flourish</div>
                      <div class="career-text" v-html="formatCareerText(extractCareerSection(item.desc, 'Where You Flourish'))"></div>
                    </div>
                    <div class="career-caution" v-if="item.desc.includes('Where Energy Feels Drained')">
                      <div class="career-label">⚠ Where Energy Feels Drained</div>
                      <div class="career-text" v-html="formatCareerText(extractCareerSection(item.desc, 'Where Energy Feels Drained'))"></div>
                    </div>
                  </template>
                </div>
              </template>
              <!-- 其他普通项目 -->
              <div v-else class="fortune-desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>

        <!-- 同频名人板块 -->
        <div class="section" v-if="destinyInfo.celebrities">
          <div class="section-icon">⭐</div>
          <div class="section-title">{{ t('result.sections.celebrities.title') }}</div>
          <div class="section-content">
            <!-- 中文模式：区分国内国外 -->
            <template v-if="locale === 'zh-CN'">
              <div class="celebrities-group" v-if="destinyInfo.celebrities.international && destinyInfo.celebrities.international.length">
                <div class="group-title">{{ t('result.sections.celebrities.international') }}</div>
                <div class="celebrities-items">
                  <div v-for="(celebrity, index) in destinyInfo.celebrities.international" :key="index" class="celebrity-item">
                    {{ celebrity }}
                  </div>
                </div>
              </div>
              <div class="celebrities-group" v-if="destinyInfo.celebrities.domestic && destinyInfo.celebrities.domestic.length">
                <div class="group-title">{{ t('result.sections.celebrities.domestic') }}</div>
                <div class="celebrities-items">
                  <div v-for="(celebrity, index) in destinyInfo.celebrities.domestic" :key="index" class="celebrity-item">
                    {{ celebrity }}
                  </div>
                </div>
              </div>
            </template>
            <!-- 英文模式：不区分，显示所有名人但不显示分组标题 -->
            <template v-else>
              <div class="celebrities-group">
                <div class="celebrities-items">
                  <!-- 显示国际名人 -->
                  <div v-for="(celebrity, index) in destinyInfo.celebrities.international" :key="`int-${index}`" class="celebrity-item">
                    {{ celebrity }}
                  </div>
                  <!-- 显示国内名人 -->
                  <div v-for="(celebrity, index) in destinyInfo.celebrities.domestic" :key="`dom-${index}`" class="celebrity-item">
                    {{ celebrity }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- 开运tips板块 -->
        <div class="section">
          <div class="section-icon">✨</div>
          <div class="section-title">{{ t('result.sections.luckSuggestion.tips') }}</div>
          <div class="section-content">
            <!-- 日常提示 -->
            <div class="tips-items" v-if="destinyInfo.luckSuggestion.dailyTips && destinyInfo.luckSuggestion.dailyTips.length">
              <div v-for="(tip, index) in destinyInfo.luckSuggestion.dailyTips" :key="index" class="tip-item">
                {{ tip }}
              </div>
            </div>
            
            <!-- 开运颜色 -->
            <div class="tips-section" v-if="destinyInfo.luckSuggestion.color && destinyInfo.luckSuggestion.color.length">
              <div class="tips-section-title">🎨 {{ t('result.sections.luckSuggestion.color') }}</div>
              <div class="tips-items">
                <div v-for="(color, index) in destinyInfo.luckSuggestion.color" :key="index" class="tip-item">
                  {{ color }}
                </div>
              </div>
            </div>
            
            <!-- 开运方位 -->
            <div class="tips-section" v-if="destinyInfo.luckSuggestion.location && destinyInfo.luckSuggestion.location.length">
              <div class="tips-section-title">🧭 {{ t('result.sections.luckSuggestion.location') }}</div>
              <div class="tips-items">
                <div v-for="(loc, index) in destinyInfo.luckSuggestion.location" :key="index" class="tip-item">
                  {{ loc }}
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
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
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

// 天干地支英文映射
const tianganMap = {
  '甲': 'Jia Wood', '乙': 'Yi Wood',
  '丙': 'Bing Fire', '丁': 'Ding Fire',
  '戊': 'Wu Earth', '己': 'Ji Earth',
  '庚': 'Geng Metal', '辛': 'Xin Metal',
  '壬': 'Ren Water', '癸': 'Gui Water'
};

const dizhiMap = {
  '子': 'Zi', '丑': 'Chou', '寅': 'Yin', '卯': 'Mao',
  '辰': 'Chen', '巳': 'Si', '午': 'Wu', '未': 'Wei',
  '申': 'Shen', '酉': 'You', '戌': 'Xu', '亥': 'Hai'
};

// 转换为英文八字
const convertBaZiToEnglish = (baziStr) => {
  const parts = baziStr.split(' ');
  return parts.map(part => {
    if (part.length >= 2) {
      const tiangan = part[0];
      const dizhi = part[1];
      return `${tianganMap[tiangan] || tiangan}-${dizhiMap[dizhi] || dizhi}`;
    }
    return part;
  }).join(' ');
};

const birthDate = ref("");
const location = ref([]);
const birthHour = ref("");
const gender = ref("");
const isMobile = ref(false);
const destinyInfo = ref(null);
const baziInfo = ref({
  bazi: '',
  solarTime: '',
  baziEn: '' // 英文八字
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
  const baziStr = `${bazi.年柱} ${bazi.月柱} ${bazi.日柱} ${bazi.时柱}`;
  baziInfo.value = {
    bazi: baziStr,
    solarTime: targetDate.toLocaleString(),
    baziEn: convertBaZiToEnglish(baziStr)
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

// 提取职业管理中的推荐行业或慎重行业部分
const extractCareerSection = (desc, section) => {
  if (!desc) return '';
  
  try {
    // 中文模式
    if (section === '推荐行业') {
      const startMatch = desc.match(/推荐行业[：:]/);
      if (!startMatch) return '';
      
      const startIndex = startMatch.index + startMatch[0].length;
      const endMatch = desc.substring(startIndex).match(/[。．]\s*慎重行业/);
      
      let result = endMatch ? desc.substring(startIndex, startIndex + endMatch.index) : desc.substring(startIndex);
      return formatCareerDescription(result.trim());
    } else if (section === '慎重行业') {
      const startMatch = desc.match(/慎重行业[：:]/);
      if (!startMatch) return '';
      
      const startIndex = startMatch.index + startMatch[0].length;
      let result = desc.substring(startIndex);
      result = result.replace(/[。．]+$/, '').trim();
      return formatCareerDescription(result);
    }
    
    // 英文模式
    if (section === 'Where You Flourish') {
      const startMatch = desc.match(/Where You Flourish:/);
      if (!startMatch) return '';
      
      const startIndex = startMatch.index + startMatch[0].length;
      const endMatch = desc.substring(startIndex).match(/Where Energy Feels Drained:/);
      
      let result = endMatch ? desc.substring(startIndex, startIndex + endMatch.index) : desc.substring(startIndex);
      return formatCareerDescriptionEn(result.trim());
    } else if (section === 'Where Energy Feels Drained') {
      const startMatch = desc.match(/Where Energy Feels Drained:/);
      if (!startMatch) return '';
      
      const startIndex = startMatch.index + startMatch[0].length;
      let result = desc.substring(startIndex);
      return formatCareerDescriptionEn(result.trim());
    }
  } catch (error) {
    console.error('解析职业描述错误:', error);
    return desc; // 出错时返回原始描述
  }
  
  return desc;
};

// 格式化职业描述为分行显示（中文）
const formatCareerDescription = (text) => {
  if (!text) return '';
  
  // 按句号分割
  const items = text.split(/[。．]/).filter(item => item.trim());
  
  return items.map(item => {
    const trimmed = item.trim();
    // 如果有冒号，说明是有详细描述的行业
    if (trimmed.includes('：') || trimmed.includes(':')) {
      return trimmed;
    } else {
      // 如果是单个行业名称，前面加上项目符号
      return `• ${trimmed}`;
    }
  }).join('\n');
};

// 格式化职业描述为分行显示（英文）
const formatCareerDescriptionEn = (text) => {
  if (!text) return '';
  
  // 查找 "Where You Flourish" 或 "Where Energy Feels Drained" 部分
  if (text.includes('Where You Flourish:') || text.includes('Where Energy Feels Drained:')) {
    // 如果有这些关键词，按这些标志分割
    const parts = [];
    
    // 处理 "Recommended Industries:" 的开头部分
    if (text.includes('Recommended Industries:')) {
      const startRegex = /Recommended Industries:/;
      const match = text.match(startRegex);
      if (match) {
        text = text.substring(match.index + match[0].length).trim();
      }
    }
    
    // 按句号分割，保持分类标题的完整性
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    
    return sentences.map(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.includes(':')) {
        // 包含冒号的是分类标题，保持原样
        return trimmed;
      } else if (trimmed) {
        // 其他内容加项目符号
        return `• ${trimmed}`;
      }
      return trimmed;
    }).filter(s => s).join('\n');
  }
  
  // 如果没有这些特殊结构，按逗号分割
  const items = text.split(',').filter(s => s.trim().length > 0);
  
  if (items.length > 1) {
    return items.map(item => `• ${item.trim()}`).join('\n');
  }
  
  return text;
};

// 格式化职业文本为HTML显示（处理换行）
const formatCareerText = (text) => {
  if (!text) return '';
  
  // 将换行符转换为<br>标签
  return text.replace(/\n/g, '<br>');
};

// 瀑布流布局相关
const masonryColumns = ref(3); // 默认3列
const masonryItems = ref([]); // 存储每列的卡片

// 计算瀑布流布局
const calculateMasonryLayout = () => {
  if (!destinyInfo.value) return;
  
  // 根据窗口宽度确定列数
  const width = window.innerWidth;
  if (width <= 768) {
    masonryColumns.value = 1;
  } else if (width <= 1200) {
    masonryColumns.value = 2;
  } else {
    masonryColumns.value = 3;
  }
  
  // 等待 DOM 更新后再计算布局
  nextTick(() => {
    // 再次等待，确保所有元素都渲染完成并且高度计算正确
    setTimeout(() => {
      layoutMasonryItems();
    }, 100);
  });
};

// 布局瀑布流项目（按列紧凑排列：第4个紧跟第1个下方）
const layoutMasonryItems = () => {
  const container = document.querySelector('.result-sections');
  if (!container) return;
  
  const sections = Array.from(container.querySelectorAll('.section'));
  if (sections.length === 0) return;
  
  const columns = masonryColumns.value;
  const gap = columns === 1 ? 12 : 24;
  
  // 计算列宽
  const columnWidth = (container.offsetWidth - gap * (columns - 1)) / columns;
  
  // 存储每列的当前高度（从0开始）
  const columnHeights = new Array(columns).fill(0);
  
  // 存储每个卡片的位置和高度信息
  const itemsInfo = [];
  
  // 先临时设置宽度以便测量正确的高度
  sections.forEach((section) => {
    section.style.width = `${columnWidth}px`;
    section.style.position = 'relative';
  });
  
  // 强制浏览器重新计算布局
  container.offsetHeight;
  
  // 遍历每个卡片，按顺序排列
  sections.forEach((section, index) => {
    // 计算当前卡片应该在哪一列（按顺序：0, 1, 2, 0, 1, 2...）
    const columnIndex = index % columns;
    
    // 获取卡片的实际高度
    const itemHeight = section.getBoundingClientRect().height;
    
    // 计算位置
    // left: 根据列号计算水平位置
    const left = columnIndex * (columnWidth + gap);
    // top: 使用该列的当前累积高度
    const top = columnHeights[columnIndex];
    
    // 设置卡片位置
    section.style.position = 'absolute';
    section.style.width = `${columnWidth}px`;
    section.style.left = `${left}px`;
    section.style.top = `${top}px`;
    
    // 存储信息
    itemsInfo.push({
      index: index,
      columnIndex: columnIndex,
      top: top,
      left: left,
      width: columnWidth,
      height: itemHeight
    });
    
    // 更新该列的高度：当前高度 + 卡片高度 + 间隙
    columnHeights[columnIndex] = top + itemHeight + gap;
    
    // 调试信息：显示前9个卡片
    if (index < 9) {
      console.log(`卡片${index + 1}: 列${columnIndex + 1}, 高度=${itemHeight.toFixed(0)}px, top=${top.toFixed(0)}px`);
    }
  });
  
  // 设置容器高度为最高列的高度
  const maxHeight = Math.max(...columnHeights);
  container.style.height = `${maxHeight}px`;
  container.style.position = 'relative';
  
  // 输出布局信息
  console.log('瀑布流布局完成:', {
    列数: columns,
    间隙: gap,
    列宽: columnWidth.toFixed(0),
    各列高度: columnHeights.map(h => h.toFixed(0)),
    卡片总数: sections.length,
    容器高度: maxHeight.toFixed(0)
  });
};

// 监听窗口大小变化
const resizeObserver = ref(null);

// 在组件挂载后初始化瀑布流
onMounted(() => {
  // 监听窗口大小变化
  window.addEventListener('resize', calculateMasonryLayout);
  
  // 使用 ResizeObserver 监听容器大小变化
  const container = document.querySelector('.result-sections');
  if (container && window.ResizeObserver) {
    resizeObserver.value = new ResizeObserver(() => {
      layoutMasonryItems();
    });
    resizeObserver.value.observe(container);
  }
});

// 在组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', calculateMasonryLayout);
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

// 监听 destinyInfo 变化，重新计算布局
watch(destinyInfo, () => {
  if (destinyInfo.value) {
    calculateMasonryLayout();
  }
}, { deep: true });
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  max-width: 100vw; /* 防止超出视口 */
  min-height: 100vh;
  padding: 40px 0;
  overflow-x: hidden; /* 防止横向滚动 */
  box-sizing: border-box;

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
  width: 90%;
  max-width: 1400px; /* 增加最大宽度以更好利用大屏幕 */
  margin: 0 auto 40px;
  padding: 40px 50px;
  box-sizing: border-box;

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
      margin-bottom: 12px;
    }

    .bazi-info {
      margin-top: 16px;
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba(160, 137, 104, 0.08) 0%, rgba(160, 137, 104, 0.04) 100%);
      border-radius: 12px;
      border: 1px solid rgba(139, 115, 85, 0.12);
      box-shadow: 0 1px 3px rgba(139, 115, 85, 0.06);

      .bazi-text {
        color: #4a4a4a;
        font-size: 14.5px;
        margin-bottom: 8px;
        font-weight: 600;
        letter-spacing: 0.5px;
        font-family: "Courier New", monospace;
      }

      .solar-time {
        color: #7a7a7a;
        font-size: 13px;
      }
    }
  }

  .result-sections {
    /* JavaScript 瀑布流布局容器 */
    position: relative;
    width: 100%;
    /* 高度由 JavaScript 动态设置 */
  }

  .section {
      background: linear-gradient(135deg, #ffffff 0%, #fdfcfb 100%);
      border-radius: 16px;
      padding: 28px;
      box-sizing: border-box;
      /* margin 由 JavaScript 瀑布流布局控制，这里不需要 */
      margin: 0;
      /* 更精致的阴影 */
      box-shadow: 0 2px 8px rgba(139, 115, 85, 0.08), 
                  0 1px 2px rgba(139, 115, 85, 0.04);
      border: 1px solid rgba(139, 115, 85, 0.08);
      /* 添加过渡效果 */
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(139, 115, 85, 0.12), 
                    0 2px 4px rgba(139, 115, 85, 0.06);
        border-color: rgba(139, 115, 85, 0.15);
      }

      .section-icon {
        font-size: 24px;
        margin-bottom: 16px;
        display: inline-block;
        padding: 8px 12px;
        background: rgba(139, 115, 85, 0.06);
        border-radius: 10px;
        line-height: 1;
      }

      .section-title {
        font-size: 17px;
        color: #6b5c4d;
        margin-bottom: 20px;
        font-weight: 600;
        letter-spacing: 0.3px;
        position: relative;
        padding-bottom: 12px;
        
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 3px;
          background: linear-gradient(90deg, #a08968, transparent);
          border-radius: 2px;
        }
      }

      .section-content {
        .birth-info {
          color: #999;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .info-item {
          margin-bottom: 14px;
          color: #4a4a4a;
          line-height: 1.7;
          font-size: 14.5px;
          padding-left: 16px;
          position: relative;
          
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #a08968;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }

        .character-traits {
          color: #5a5a5a;
          line-height: 1.9;
          white-space: pre-line;
          padding: 18px 20px;
          background: linear-gradient(135deg, rgba(139, 115, 85, 0.04) 0%, rgba(139, 115, 85, 0.02) 100%);
          border-radius: 12px;
          border-left: 3px solid #a08968;
          font-size: 14.5px;
        }

        .relation-group {
          margin-bottom: 24px;

          &:last-child {
            margin-bottom: 0;
          }

          .group-title {
            color: #7a6a58;
            font-size: 15px;
            margin-bottom: 14px;
            font-weight: 600;
            letter-spacing: 0.2px;
          }

          .relation-item {
            color: #5a5a5a;
            margin-bottom: 10px;
            padding-left: 18px;
            position: relative;
            line-height: 1.7;
            font-size: 14.5px;

            &:before {
              content: "●";
              position: absolute;
              left: 0;
              color: #a08968;
              font-size: 10px;
              top: 6px;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }

        .fortune-item {
          margin-bottom: 22px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(139, 115, 85, 0.08);

          &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }

          .fortune-title {
            color: #7a6a58;
            font-size: 15px;
            margin-bottom: 10px;
            font-weight: 600;
            letter-spacing: 0.2px;
            display: inline-block;
            padding: 4px 12px;
            background: rgba(139, 115, 85, 0.06);
            border-radius: 6px;
          }

          .fortune-desc {
            color: #5a5a5a;
            line-height: 1.8;
            font-size: 14.5px;
          }

          .career-sections {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .career-recommended,
            .career-caution {
              padding: 14px 16px;
              border-radius: 10px;
              background: linear-gradient(135deg, rgba(139, 115, 85, 0.04) 0%, rgba(139, 115, 85, 0.02) 100%);
              border: 1px solid rgba(139, 115, 85, 0.1);

              .career-label {
                color: #7a6a58;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 8px;
                letter-spacing: 0.2px;
              }

              .career-text {
                color: #5a5a5a;
                line-height: 1.8;
                font-size: 14px;
              }
            }

            .career-recommended {
              border-left: 3px solid #6b9d7a;
              
              .career-label {
                color: #5a8566;
              }
            }

            .career-caution {
              border-left: 3px solid #c89060;
              background: linear-gradient(135deg, rgba(200, 144, 96, 0.04) 0%, rgba(200, 144, 96, 0.02) 100%);
              
              .career-label {
                color: #b8805a;
              }
            }
          }
        }

        .career-group {
          margin-bottom: 24px;

          .group-title {
            color: #8b7355;
            font-size: 16px;
            margin-bottom: 12px;
            font-weight: 500;
          }

          .career-items {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .career-item {
              background: #fff;
              padding: 8px 12px;
              border-radius: 16px;
              font-size: 14px;
              color: #666;
              border: 1px solid rgba(139, 115, 85, 0.2);
              transition: all 0.3s ease;

              &:hover {
                background: rgba(139, 115, 85, 0.05);
                border-color: #8b7355;
              }

              &.avoid {
                background: rgba(245, 108, 108, 0.1);
                border-color: rgba(245, 108, 108, 0.3);
                color: #f56c6c;

                &:hover {
                  background: rgba(245, 108, 108, 0.15);
                  border-color: #f56c6c;
                }
              }
            }
          }
        }

        .color-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .color-item {
            background: #fff;
            padding: 8px 12px;
            border-radius: 16px;
            font-size: 14px;
            color: #666;
            border: 1px solid rgba(139, 115, 85, 0.2);
            transition: all 0.3s ease;

            &:hover {
              background: rgba(139, 115, 85, 0.05);
              border-color: #8b7355;
            }
          }
        }

        .location-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .location-item {
            background: #fff;
            padding: 8px 12px;
            border-radius: 16px;
            font-size: 14px;
            color: #666;
            border: 1px solid rgba(139, 115, 85, 0.2);
            transition: all 0.3s ease;

            &:hover {
              background: rgba(139, 115, 85, 0.05);
              border-color: #8b7355;
            }
          }
        }

        .tips-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(139, 115, 85, 0.1);

          &:first-child {
            margin-top: 0;
            padding-top: 0;
            border-top: none;
          }

          .tips-section-title {
            color: #7a6a58;
            font-size: 14.5px;
            font-weight: 600;
            margin-bottom: 14px;
            letter-spacing: 0.2px;
          }
        }

        .tips-items {
          .tip-item {
            color: #5a5a5a;
            margin-bottom: 12px;
            padding-left: 18px;
            position: relative;
            line-height: 1.7;
            font-size: 14.5px;

            &:before {
              content: "✦";
              position: absolute;
              left: 0;
              color: #a08968;
              font-size: 12px;
              top: 2px;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }

        .favorable-elements {
          color: #5a5a5a;
          line-height: 1.8;
          padding: 18px 20px;
          background: linear-gradient(135deg, rgba(160, 137, 104, 0.06) 0%, rgba(160, 137, 104, 0.02) 100%);
          border-radius: 12px;
          border-left: 3px solid #a08968;
          font-size: 14.5px;
          box-shadow: 0 1px 3px rgba(139, 115, 85, 0.04);
        }

        .celebrities-group {
          margin-bottom: 24px;

          &:last-child {
            margin-bottom: 0;
          }

          .group-title {
            color: #7a6a58;
            font-size: 15px;
            margin-bottom: 14px;
            font-weight: 600;
            letter-spacing: 0.2px;
          }

          .celebrities-items {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            .celebrity-item {
              background: linear-gradient(135deg, #ffffff 0%, #fdfcfb 100%);
              padding: 9px 14px;
              border-radius: 20px;
              font-size: 13.5px;
              color: #5a5a5a;
              border: 1px solid rgba(139, 115, 85, 0.12);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 1px 3px rgba(139, 115, 85, 0.05);

              &:hover {
                background: linear-gradient(135deg, rgba(160, 137, 104, 0.08) 0%, rgba(160, 137, 104, 0.04) 100%);
                border-color: #a08968;
                transform: translateY(-1px);
                box-shadow: 0 2px 6px rgba(139, 115, 85, 0.1);
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
                content: "📍";
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
    max-width: calc(100vw - 40px); /* 确保不超出视口 */
    margin: 0 auto 20px;
    padding: 24px 20px;
    border-radius: 12px;
    box-sizing: border-box;
    
    .result-sections {
      /* 移动端瀑布流由 JavaScript 处理，无需额外样式 */
      position: relative;
    }

    .section {
      padding: 20px;
      /* margin 由 JavaScript 控制 */
      margin: 0;
    }
  }

  .form-container {
    width: 90%;
    max-width: calc(100vw - 40px); /* 确保不超出视口 */
    box-sizing: border-box;
  }
}
</style>
