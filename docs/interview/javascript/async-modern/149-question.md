# 149. [中级]** 空值合并操作符(??)的作用

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察空值合并操作符的精确语义，面试官想了解你是否理解它与逻辑或操作符的区别。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- 仅判断前置是否为 undefined 和 null

### 问题本质解读 这道题考察空值合并操作符的精确语义，面试官想了解你是否理解它与逻辑或操作符的区别。

### 知识点系统梳理

**空值合并操作符的特点：**

1. **只检查null和undefined**：不像||操作符检查所有falsy值
2. **短路求值**：左侧不为null/undefined时不计算右侧
3. **优先级**：比||和&&低，需要注意运算顺序

### 实战应用举例

**通用JavaScript示例：**

```javascript
// 1. 与||操作符的区别
const value1 = 0
const value2 = ''
const value3 = false
const value4 = null
const value5 = undefined

// 使用||操作符
console.log(value1 || 'default') // 'default' (0是falsy)
console.log(value2 || 'default') // 'default' (''是falsy)
console.log(value3 || 'default') // 'default' (false是falsy)

// 使用??操作符
console.log(value1 ?? 'default') // 0 (0不是null/undefined)
console.log(value2 ?? 'default') // '' (''不是null/undefined)
console.log(value3 ?? 'default') // false (false不是null/undefined)
console.log(value4 ?? 'default') // 'default' (null)
console.log(value5 ?? 'default') // 'default' (undefined)

// 2. 实际应用场景
function processConfig(config = {}) {
  // 使用??确保只有真正缺失的值才使用默认值
  const settings = {
    timeout: config.timeout ?? 5000,
    retries: config.retries ?? 3,
    debug: config.debug ?? false,
    apiUrl: config.apiUrl ?? 'https://api.example.com',
  }

  return settings
}

// 测试
console.log(processConfig({ timeout: 0, debug: false }))
// { timeout: 0, retries: 3, debug: false, apiUrl: 'https://api.example.com' }

// 3. 与可选链结合使用
const user = {
  profile: {
    name: 'John',
    settings: {
      theme: null, // 用户明确设置为null
      language: undefined, // 未设置
    },
  },
}

const theme = user?.profile?.settings?.theme ?? 'light'
const language = user?.profile?.settings?.language ?? 'en'
console.log(theme) // 'light'
console.log(language) // 'en'
```

## 实战应用举例

配置默认值最适合用 `??`，因为 0 和 false 往往是用户有意设置。

```javascript
function normalizeOptions(options = {}) {
  return {
    timeout: options.timeout ?? 5000,
    retry: options.retry ?? 3,
    debug: options.debug ?? false,
  }
}
```

## 使用场景说明和对比

| 写法 | 触发默认值的条件 | 适合场景 |
| --- | --- | --- |
| `value ?? fallback` | 仅 null/undefined | 配置、表单、接口字段默认值 |
| `value || fallback` | 所有 falsy 值 | 需要把 0/''/false 也视为无效 |
| 参数默认值 | 参数是 undefined | 函数入参默认值 |

## 易错点提示

1. `??` 不会替换 0、空字符串、false。
2. `??` 只处理 null 和 undefined。
3. `??` 和 `||` / `&&` 混用时要加括号。
4. 函数参数默认值只在参数为 undefined 时生效。
5. 接口返回 null 是否要走默认值，要看业务语义。

## 记忆要点总结

- `??` 是空值兜底。
- 空值只指 null/undefined。
- 保留 0、''、false。
- 常和 `?.` 一起用。

## 延伸问题

可以继续追问：149. [中级]** 空值合并操作符(??)的作用 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`??` 和 `||` 最大区别是什么？**  
A：`??` 只把 null/undefined 当缺失；`||` 会把所有 falsy 值都当缺失。

**Q：为什么 `0 ?? 10` 是 0？**  
A：因为 0 不是 null 或 undefined，它是有效值。

## 辅助记忆总结

一句话记：`??` 只兜 null 和 undefined，不兜所有假值。
