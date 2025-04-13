<template>
  <div class="container">
    <div class="form-container">
      <div class="form-group">
        <label>出生年/月/日*</label>
        <el-date-picker
          v-model="birthDate"
          type="date"
          class="input-field"
          placeholder="选择出生日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </div>

      <div class="form-group">
        <label>出生地点*</label>
        <CustomCascader
          v-model="location"
          :options="locationData"
          placeholder="请选择出生地点"
          class="input-field"
        />
      </div>

      <div class="form-row">
        <el-row :gutter="20">
          <el-col :xs="22" :sm="7">
            <div class="form-group half">
              <label>出生时辰*</label>
              <el-select
                v-model="birthHour"
                class="input-field"
                placeholder="请选择时辰"
              >
                <el-option
                  v-for="hour in hours"
                  :key="hour.value"
                  :label="hour.label"
                  :value="hour.value"
                />
              </el-select>
            </div>
          </el-col>

          <el-col :xs="24" :sm="12">
            <div class="form-group half">
              <label>性别*</label>
              <div class="radio-group">
                <el-radio-group v-model="gender">
                  <el-radio :value="'male'">男</el-radio>
                  <el-radio :value="'female'">女</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-button type="primary" class="submit-btn" @click="handleSubmit">
        开始测算
      </el-button>
      <p class="hint">知命未来运势，从了解自己开始</p>
    </div>

    <div v-if="destinyInfo" class="destiny-result">
      <div class="result-header">
        <h2>您的命理测算结果：{{ destinyInfo.name }}</h2>
        <div class="result-time">测算时间：{{ new Date().toLocaleString() }}</div>
      </div>

      <div class="result-sections">
        <div class="left-section">
          <div class="section">
            <div class="section-icon">👤</div>
            <div class="section-title">个人特征</div>
            <div class="section-content">
              <div class="birth-info">
                生辰八字：{{ baziInfo.bazi }}<br>
                真太阳时：{{ baziInfo.solarTime }}
              </div>
              <div v-for="(info, index) in destinyInfo.personality.info1" :key="index" class="info-item">
                {{ info }}
              </div>
              <div class="info-detail">{{ destinyInfo.personality.info2 }}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-icon">🤝</div>
            <div class="section-title">人际关系</div>
            <div class="section-content">
              <div class="relation-group">
                <div class="group-title">交友建议</div>
                <div v-for="(item, index) in destinyInfo.relationship.friendSuggestion" :key="index" class="relation-item">
                  {{ item }}
                </div>
              </div>
              <div class="relation-group">
                <div class="group-title">适配伴侣</div>
                <div v-for="(item, index) in destinyInfo.relationship.coupleSuggestion" :key="index" class="relation-item">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-section">
          <div class="section">
            <div class="section-icon">📊</div>
            <div class="section-title">运势解读</div>
            <div class="section-content">
              <div v-for="(item, index) in destinyInfo.luck.info1" :key="index" class="fortune-item">
                <div class="fortune-title">{{ item.title }}</div>
                <div class="fortune-desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-icon">✨</div>
            <div class="section-title">开运建议</div>
            <div class="section-content">
              <div class="advice-group">
                <div class="advice-title">开运颜色</div>
                <div class="advice-items">
                  <div v-for="(color, index) in destinyInfo.luckSuggestion.color" :key="index" class="tag-item">
                    {{ color }}
                  </div>
                </div>
              </div>

              <div class="advice-group">
                <div class="advice-title">开运方位</div>
                <div class="advice-items">
                  <div v-for="(location, index) in destinyInfo.luckSuggestion.location" :key="index" class="tag-item">
                    {{ location }}
                  </div>
                </div>
              </div>

              <div class="advice-group">
                <div class="advice-title">适合职业</div>
                <div class="advice-items">
                  <div v-for="(career, index) in destinyInfo.career.needCareer" :key="index" class="tag-item">
                    {{ career }}
                  </div>
                </div>
              </div>

              <div class="advice-group">
                <div class="advice-title">开运tips</div>
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
import { ref, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/dist/index.css";
import { locationData } from "./data/locationData";
import CustomCascader from "./components/CustomCascader.vue";
import { calculateSolarTime } from "./utils/solarTime";
import { getLocationInfo } from "./data/locationData";
import { calculateBaZi } from "./utils/bazi";
import { analyzeStrength } from "./utils/strength";
import { destinyData } from "./data/destinyData";

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

const hours = [
  { value: "23-1", label: "子时 (23:00-1:00)" },
  { value: "1-3", label: "丑时 (1:00-3:00)" },
  { value: "3-5", label: "寅时 (3:00-5:00)" },
  { value: "5-7", label: "卯时 (5:00-7:00)" },
  { value: "7-9", label: "辰时 (7:00-9:00)" },
  { value: "9-11", label: "巳时 (9:00-11:00)" },
  { value: "11-13", label: "午时 (11:00-13:00)" },
  { value: "13-15", label: "未时 (13:00-15:00)" },
  { value: "15-17", label: "申时 (15:00-17:00)" },
  { value: "17-19", label: "酉时 (17:00-19:00)" },
  { value: "19-21", label: "戌时 (19:00-21:00)" },
  { value: "21-23", label: "亥时 (21:00-23:00)" },
];

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

const handleSubmit = () => {
  if (!birthDate.value) {
    ElMessage.warning("请选择出生日期");
    return;
  }
  if (!gender.value) {
    ElMessage.warning("请选择性别");
    return;
  }

  // 解析时辰，获取中间值
  let hourValue = 12; // 默认值
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

  // 获取选中的城市信息或使用默认的北京经纬度
  let locationInfo;
  if (location.value.length > 0) {
    const selectedCity = location.value[location.value.length - 1];
    locationInfo = getLocationInfo(selectedCity);
  }
  
  // 如果没有选择城市或无法获取城市信息，直接使用用户选择的时间
  let targetDate = date;
  if (locationInfo?.coordinates) {
    // 计算真太阳时
    targetDate = calculateSolarTime(
      date,
      locationInfo.coordinates.lng,
      locationInfo.coordinates.lat,
      true
    );
  }

  // 计算八字
  const bazi = calculateBaZi(targetDate, !!locationInfo?.coordinates, locationInfo?.coordinates?.lng, locationInfo?.coordinates?.lat);
  
  // 更新八字信息
  baziInfo.value = {
    bazi: `${bazi.年柱} ${bazi.月柱} ${bazi.日柱} ${bazi.时柱}`,
    solarTime: targetDate.toLocaleString()
  };

  // 分析身强身弱
  const strength = analyzeStrength(bazi);

  // 查找对应的命理数据
  destinyInfo.value = destinyData.find(item => item.name === strength);
  
  console.log('命理信息：', {
    选择时间: date.toLocaleString(),
    经纬度: locationInfo?.coordinates ? `${locationInfo.coordinates.lng.toFixed(4)}°E, ${locationInfo.coordinates.lat.toFixed(4)}°N` : '未选择地区',
    真太阳时: targetDate.toLocaleString(),
    八字: `${bazi.年柱} ${bazi.月柱} ${bazi.日柱} ${bazi.时柱}`,
    身强身弱: strength,
    命理数据: destinyInfo.value || '未找到对应的命理数据'
  });
};

const getImageUrl = (name) => {
  return `/images/destiny/${name}.png`;
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: max-content;

  .form-container,
  .result-container {
    background-color: #faf7f2;
    padding: 30px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    width: max(300px, 60%);
    border: 1px solid rgba(0, 0, 0, 0.06);
    margin: 100px auto;
  }

  .form-container {
    .form-group {
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

      &:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-size: 14px;
        font-weight: 500;
      }

      .input-field {
        width: 100% !important;
      }

      :deep(.el-input__inner),
      :deep(.el-input__wrapper),
      :deep(.el-date-editor.el-input),
      :deep(.el-cascader),
      :deep(.el-select) {
        height: 40px !important;
        font-size: 14px;
      }

      :deep(.el-input__wrapper) {
        background-color: #fff !important;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: none !important;

        &:hover {
          border-color: #8b7355;
        }

        &.is-focus {
          border-color: #8b7355;
          box-shadow: 0 0 0 1px #8b7355 !important;
        }
      }

      .radio-group {
        padding: 8px 0;

        :deep(.el-radio__label) {
          font-size: 14px;
        }
      }
    }

    .form-row {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .half {
        width: 100%;
      }
    }

    .submit-btn {
      width: 150px;
      height: 40px;
      font-size: 13px;
      font-weight: 500;
      margin: 24px auto 0;
      border-radius: 40px;
      background-color: #8b7355 !important;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #7a6445 !important;
      }
    }

    .hint {
      text-align: center;
      color: #666;
      font-size: 13px;
      margin-top: 16px;
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
}

.destiny-result {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;

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
  .result-container {
    padding: 20px;
    width: 100%;
    margin: 20px auto;

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
    padding: 16px;
    
    .result-sections {
      flex-direction: column;
    }

    .section {
      padding: 20px;
    }
  }
}
</style>
