<template>
  <div class="custom-cascader">
    <!-- PC端使用Element Plus的Cascader -->
    <el-cascader
      v-if="!isMobile"
      v-model="selectedValue"
      :options="options"
      :props="cascaderProps"
      :placeholder="placeholder"
      @change="handleChange"
      class="pc-cascader"
    />

    <!-- 移动端使用Vant的Area -->
    <van-field
      v-else
      v-model="displayText"
      readonly
      :placeholder="placeholder"
      @click="showArea = true"
      class="mobile-field"
    />
    <van-popup
      v-model:show="showArea"
      position="bottom"
      round
    >
      <van-area
        :value="selectedCode"
        :area-list="areaList"
        :columns-placeholder="['请选择', '请选择', '请选择']"
        @confirm="onAreaConfirm"
        @cancel="showArea = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Field, Popup, Area } from 'vant';
import { getLocationInfo } from '../data/locationData';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: '请选择'
  }
});

const emit = defineEmits(['update:modelValue']);

// 定义 cascaderProps
const cascaderProps = {
  expandTrigger: 'hover',
  checkStrictly: false,
  multiple: false,
  emitPath: true,
  lazy: false,
  value: 'value',
  label: 'label',
  children: 'children'
};

// 响应式数据
const isMobile = ref(false);
const showArea = ref(false);
const selectedCode = ref('');
const displayText = ref('');
const selectedValue = ref([]);

// 将 options 转换为 Vant Area 需要的格式
const areaList = computed(() => {
  const result = {
    province_list: {},
    city_list: {},
    county_list: {}
  };

  // 遍历省份
  props.options.forEach(province => {
    // 添加省份
    result.province_list[province.value] = province.label;
    
    // 遍历城市
    if (province.children?.length) {
      province.children.forEach(city => {
        // 添加城市，使用完整的城市代码
        const cityCode = `${province.value}${city.value}`;
        result.city_list[cityCode] = city.label;
        
        // 遍历区县
        if (city.children?.length) {
          city.children.forEach(district => {
            // 添加区县，使用完整的区县代码
            const districtCode = `${cityCode}${district.value}`;
            result.county_list[districtCode] = district.label;
          });
        }
      });
    }
  });

  // 打印转换后的数据，用于调试
  console.log('转换后的地区数据:', {
    provinces: Object.keys(result.province_list).length,
    cities: Object.keys(result.city_list).length,
    counties: Object.keys(result.county_list).length,
    sampleProvince: Object.entries(result.province_list)[0],
    sampleCity: Object.entries(result.city_list)[0],
    sampleCounty: Object.entries(result.county_list)[0]
  });
  
  return result;
});

// 处理移动端选择确认
const onAreaConfirm = (result) => {
  showArea.value = false;
  
  const values = result.selectedValues;
  const selectedOptions = result.selectedOptions;
  
  // 获取选中的地区名称
  const province = selectedOptions[0]?.text || '';
  const city = selectedOptions[1]?.text || '';
  const district = selectedOptions[2]?.text || '';
  
  // 更新选中的代码和显示文本
  selectedCode.value = values.join('/');
  displayText.value = `${province} ${city} ${district}`.trim();
  
  // 发送更新事件
  emit('update:modelValue', [province, city, district]);
  
  // 显示经纬度信息
  const locationInfo = getLocationInfo(city);
  if (locationInfo?.coordinates) {
    console.log('移动端选择城市信息：', {
      省份: province,
      城市: city,
      区县: district,
      纬度: locationInfo.coordinates.lat,
      经度: locationInfo.coordinates.lng
    });
  }
};

// 处理PC端选择变化
const handleChange = (value) => {
  emit('update:modelValue', value);
  const locationInfo = getLocationInfo(value[value.length - 1]);
  if (locationInfo?.coordinates) {
    console.log('PC端选择城市信息：', {
      省份: value[0],
      城市: value[1],
      区县: value[2],
      纬度: locationInfo.coordinates.lat,
      经度: locationInfo.coordinates.lng
    });
  }
};

// 检测是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 监听窗口大小变化
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style lang="scss" scoped>
.custom-cascader {
  width: 100%;
  
  .pc-cascader {
    width: 100%;
  }
  
  .mobile-field {
    :deep(.van-field__control) {
      color: #333;
    }
  }
}

:deep(.van-popup) {
  width: 100%;
}

:deep(.van-area) {
  height: 50vh;
}
</style> 