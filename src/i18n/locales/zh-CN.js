export default {
  common: {
    submit: '开始测算',
    hint: '知命未来运势,从了解自己开始',
    required: '必填',
    optional: '可选'
  },
  form: {
    birthDate: {
      label: '出生年/月/日',
      placeholder: '选择出生日期'
    },
    birthPlace: {
      label: '出生地点',
      traditional: '传统方案',
      international: '国际方案',
      country: '选择国家',
      city: '选择城市或输入自定义城市',
      addCity: '添加城市',
      coordinates: '坐标'
    },
    birthTime: {
      label: '出生时辰',
      placeholder: '请选择时辰（可选）',
      hint: '时辰可选填，不确定可留空，填写可提高结果测算准确度，不填运算时默认午时',
      zi: '子时 (23:00-1:00)',
      chou: '丑时 (1:00-3:00)',
      yin: '寅时 (3:00-5:00)',
      mao: '卯时 (5:00-7:00)',
      chen: '辰时 (7:00-9:00)',
      si: '巳时 (9:00-11:00)',
      wu: '午时 (11:00-13:00)',
      wei: '未时 (13:00-15:00)',
      shen: '申时 (15:00-17:00)',
      you: '酉时 (17:00-19:00)',
      xu: '戌时 (19:00-21:00)',
      hai: '亥时 (21:00-23:00)'
    },
    gender: {
      label: '性别',
      male: '男',
      female: '女',
      unknown: '不方便透露'
    }
  },
  dialog: {
    addCity: {
      title: '添加自定义城市',
      cityName: '城市名称',
      cityPlaceholder: '请输入城市名称（如：Beijing, New York, Tokyo）',
      search: '搜索',
      searching: '正在搜索...',
      searchButton: '使用 Leaflet 搜索坐标',
      searchResults: '搜索结果（点击选择）：',
      selectedCoords: '选中坐标',
      latitude: '纬度',
      longitude: '经度',
      error: '错误',
      cancel: '取消',
      confirm: '确定添加'
    }
  },
  result: {
    title: '您的命理测算结果：{key} · {name}',
    calculationTime: '测算时间：{time}',
    bazi: '生辰八字：{bazi}',
    solarTime: '真太阳时：{time}',
    sections: {
      bazi: {
        title: '八字信息'
      },
      personality: {
        icon: '👤',
        title: '个人特质'
      },
      character: {
        title: '性格特征'
      },
      relationship: {
        icon: '🤝',
        title: '人际关系',
        friendSuggestion: '交友建议',
        coupleSuggestion: '速配伴侣'
      },
      luck: {
        icon: '📊',
        title: '运势解读'
      },
      favorableElements: {
        title: '喜用神'
      },
      celebrities: {
        title: '同频名人',
        international: '国外',
        domestic: '国内'
      },
      luckSuggestion: {
        icon: '✨',
        title: '开运建议',
        color: '开运颜色',
        location: '开运方位',
        tips: '开运tips'
      }
    }
  },
  messages: {
    selectBirthDate: '请选择出生日期',
    selectCountryCity: '请选择国家和城市',
    noCoordinates: '无法获取所选城市的坐标信息，请检查选择或添加自定义城市',
    enterCityName: '请输入城市名称',
    noCityFound: '未找到相关城市，请检查城市名称拼写',
    cityNotFound: '未找到相关城市',
    searchSuccess: '找到 {count} 个结果，请选择正确的城市',
    searchFailed: '搜索失败，请检查网络连接或稍后重试',
    coordsSelected: '坐标已选中',
    selectValidCoords: '请先搜索并选择有效的坐标',
    selectCountryFirst: '请先选择国家',
    cityAddSuccess: '自定义城市添加成功',
    cityAddFailed: '添加自定义城市失败，可能该城市已存在',
    cannotGetCoords: '无法获取 {city} 的坐标信息',
    coordsGetFailed: '获取城市坐标失败，请检查网络连接',
    solarTimeFailed: '太阳时计算失败，使用备用方案'
  }
};

