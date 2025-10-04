# 多语言系统使用说明

## 概述

本项目使用自定义的 i18n 国际化系统,支持中文(zh-CN)和英文(en-US)两种语言。

## 文件结构

```
src/i18n/
├── index.js           # i18n 核心功能
├── locales/
│   ├── zh-CN.js      # 中文翻译
│   └── en-US.js      # 英文翻译
└── README.md         # 使用说明
```

## 使用方法

### 1. 在 Vue 组件中使用

```vue
<script setup>
import { useI18n } from '@/i18n';

const { t, locale, setLocale } = useI18n();
</script>

<template>
  <div>
    <!-- 使用翻译 -->
    <h1>{{ t('common.submit') }}</h1>
    
    <!-- 带参数的翻译 -->
    <p>{{ t('result.title', { key: '身强甲木', name: 'Pioneer' }) }}</p>
    
    <!-- 切换语言 -->
    <button @click="setLocale('en-US')">English</button>
    <button @click="setLocale('zh-CN')">中文</button>
  </div>
</template>
```

### 2. 翻译文件格式

翻译文件使用嵌套对象结构:

```javascript
export default {
  common: {
    submit: '开始测算',
    hint: '知命未来运势,从了解自己开始'
  },
  form: {
    birthDate: {
      label: '出生年/月/日',
      placeholder: '选择出生日期'
    }
  }
}
```

### 3. 参数替换

使用 `{paramName}` 语法插入动态参数:

```javascript
// 翻译文件
{
  messages: {
    searchSuccess: '找到 {count} 个结果'
  }
}

// 使用
t('messages.searchSuccess', { count: 5 })
// 输出: "找到 5 个结果"
```

## 语言切换组件

项目提供了 `LanguageSwitcher` 组件用于切换语言:

```vue
<template>
  <LanguageSwitcher />
</template>

<script setup>
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
</script>
```

## 本地存储

用户选择的语言会自动保存到 localStorage,下次访问时自动恢复。

## 添加新语言

1. 在 `locales/` 目录下创建新的语言文件,如 `ja-JP.js`
2. 在 `i18n/index.js` 中导入并注册:

```javascript
import jaJP from './locales/ja-JP';

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP  // 添加新语言
};
```

## 注意事项

1. 翻译键名使用点号分隔的路径格式,如 `form.birthDate.label`
2. 参数名使用小写,如 `{count}`, `{name}`
3. 确保所有语言文件具有相同的键结构
4. 使用计算属性处理动态数据以确保响应式更新

