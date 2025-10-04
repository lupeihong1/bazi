import { ref } from 'vue';
import zhCN from './locales/zh-CN';
import enUS from './locales/en-US';

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
};

// 从浏览器或localStorage获取语言设置
const getDefaultLocale = () => {
  const saved = localStorage.getItem('locale');
  if (saved && messages[saved]) {
    return saved;
  }
  
  // 检测浏览器语言
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en-US';
};

const locale = ref(getDefaultLocale());

// 切换语言
export const setLocale = (lang) => {
  if (messages[lang]) {
    locale.value = lang;
    localStorage.setItem('locale', lang);
  }
};

// 获取翻译文本
export const t = (key, params = {}) => {
  const keys = key.split('.');
  let value = messages[locale.value];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }
  
  // 处理参数替换
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }
  
  return value || key;
};

// 响应式的翻译函数
export const useI18n = () => {
  return {
    locale,
    t,
    setLocale
  };
};

export { locale };

