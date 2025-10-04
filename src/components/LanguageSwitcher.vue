<template>
  <div class="language-switcher">
    <el-select v-model="currentLocale" @change="handleLocaleChange" size="small">
      <el-option label="中文" value="zh-CN" />
      <el-option label="English" value="en-US" />
    </el-select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from '../i18n';

const { locale, setLocale } = useI18n();
const currentLocale = ref(locale.value);

watch(locale, (newLocale) => {
  currentLocale.value = newLocale;
});

const handleLocaleChange = (newLocale) => {
  setLocale(newLocale);
};
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

@media (max-width: 768px) {
  .language-switcher {
    top: 10px;
    right: 10px;
  }
}
</style>

