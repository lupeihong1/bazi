# 多语言命理数据说明

## 文件结构

- `destinyData.js` - 中文命理数据
- `destinyData.en.js` - 英文命理数据  
- `index.js` - 数据加载工具函数

## 当前状态

✅ **已完成**: 前6个命理类型的英文翻译
- 身强甲木 (The Pioneer)
- 身弱甲木 (The Dreamer)
- 身强乙木 (The Creator)
- 身弱乙木 (The Poet)
- 身强丙火 (The Leader)
- 身弱丙火 (The Spark)

⏳ **待完成**: 剩余14个命理类型需要添加英文翻译

## 数据结构

每个命理类型包含以下字段:

```javascript
{
  key: "身强甲木",           // 中文key (保持不变)
  name: "The Pioneer",       // 英文名称
  personality: {
    info1: [],               // 性格特征数组
    info2: ""               // 详细描述
  },
  luck: {
    info1: [
      {
        title: "Wealth",     // 财富
        desc: "..."
      },
      {
        title: "Health",     // 健康
        desc: "..."
      },
      {
        title: "Emotional Wellbeing",  // 情绪管理
        desc: "..."
      }
    ]
  },
  relationship: {
    friendSuggestion: [],    // 交友建议
    coupleSuggestion: []     // 适配伴侣
  },
  luckSuggestion: {
    color: [],               // 开运颜色
    location: []             // 开运方位
  },
  career: {
    needCareer: [],          // 适合职业
    notCareer: []            // 不适合职业
  },
  luckTips: []               // 开运tips
}
```

## 如何添加剩余的英文数据

### 方法1: 手动添加

1. 打开 `destinyData.en.js`
2. 参考英文MD文档中对应章节的内容
3. 按照上述数据结构添加到数组中

### 方法2: 批量转换 (推荐)

可以创建一个转换脚本来批量处理MD文档内容:

```javascript
// 工具脚本示例
const mdContent = `从MD文档复制的内容`;

// 解析并转换为JSON格式
// 然后添加到destinyData.en.js
```

## 剩余需要翻译的命理类型

7. 身强丁火 (The Radiant)
8. 身弱丁火 (The Glow)
9. 身强戊土 (The Guardian)
10. 身弱戊土 (The Harmonizer)
11. 身强己土 (The Anchor)
12. 身弱己土 (The Cultivator)
13. 身强庚金 (The Challenger)
14. 身弱庚金 (The Strategist)
15. 身强辛金 (The Artisan)
16. 身弱辛金 (The Refiner)
17. 身强壬水 (The Visionary)
18. 身弱壬水 (The Connector)
19. 身强癸水 (The Sage)
20. 身弱癸水 (The Listener)

## 语言切换机制

系统会根据当前选择的语言自动加载对应的数据:

- 选择中文 → 加载 `destinyData.js`
- 选择English → 加载 `destinyData.en.js`

切换语言后,如果已经有测算结果,会自动重新加载对应语言的内容。

## 注意事项

1. **key字段必须保持一致**: 中英文数据的 `key` 字段必须完全相同 (如: "身强甲木")
2. **数组顺序**: 建议中英文数据保持相同的顺序,便于维护
3. **数据完整性**: 确保所有字段都有对应的翻译
4. **特殊字符**: 注意英文标点符号和格式

