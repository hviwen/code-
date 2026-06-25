# 148. [中级]** 可选链操作符(?.)的用法

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察可选链的安全访问机制，面试官想了解你是否理解如何优雅地处理深层嵌套对象的属性访问。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- `obj?.a?.b?.c?.e?[2]` 应该是 `obj?.a?.b?.c?.e?.[2]`（数组访问需要点）

## 知识点系统梳理

- 代替 && 前段确认链

```javascript
const obj = {
  a:{
    b:{
      c:{
        d:1234,
        e:[5,6,7],
        f:x => x+2
      }
    }
  }
}

const e2 = obj?.a?.b?.c?.e?.[2]
const foo = obj?.a?.b?.c?.f
obj?.a?.b?.c?.f?.(3)
```

### 问题本质解读 这道题考察可选链的安全访问机制，面试官想了解你是否理解如何优雅地处理深层嵌套对象的属性访问。

### 技术错误纠正

- `obj?.a?.b?.c?.e?[2]` 应该是 `obj?.a?.b?.c?.e?.[2]`（数组访问需要点）

### 知识点系统梳理

**可选链的三种形式：**

1. **属性访问**：`obj?.prop`
2. **数组访问**：`obj?.[index]` 或 `obj?.[key]`
3. **函数调用**：`func?.(args)`

### 实战应用举例

**通用JavaScript示例：**

```javascript
// 1. 基础用法（修正版）
const obj = {
  a: {
    b: {
      c: {
        d: 1234,
        e: [5, 6, 7],
        f: x => x + 2,
      },
    },
  },
}

// 正确的语法
const e2 = obj?.a?.b?.c?.e?.[2] // 7
const foo = obj?.a?.b?.c?.f
const result = obj?.a?.b?.c?.f?.(3) // 5

// 2. 与传统方法对比
// 传统方法
const traditionalAccess = obj && obj.a && obj.a.b && obj.a.b.c && obj.a.b.c.e && obj.a.b.c.e[2]

// 可选链方法
const optionalChainAccess = obj?.a?.b?.c?.e?.[2]

// 3. 实际应用场景
// API响应处理
const apiResponse = {
  data: {
    user: {
      profile: {
        name: 'John',
        avatar: 'avatar.jpg',
      },
      settings: {
        theme: 'dark',
        notifications: {
          email: true,
          push: false,
        },
      },
    },
  },
}

// 安全访问嵌套属性
const userName = apiResponse?.data?.user?.profile?.name ?? 'Unknown'
const emailNotifications = apiResponse?.data?.user?.settings?.notifications?.email ?? false

// 4. 数组和对象混合访问
const complexData = {
  items: [
    {
      id: 1,
      details: {
        specs: ['spec1', 'spec2'],
        metadata: {
          tags: ['tag1', 'tag2'],
        },
      },
    },
  ],
}

const firstTag = complexData?.items?.[0]?.details?.metadata?.tags?.[0]
console.log(firstTag) // 'tag1'

// 5. 函数调用的可选链
const utils = {
  math: {
    calculate: (a, b) => a + b,
    advanced: {
      factorial: n => (n <= 1 ? 1 : n * utils.math.advanced.factorial(n - 1)),
    },
  },
}

// 安全的函数调用
const sum = utils?.math?.calculate?.(5, 3) // 8
const fact = utils?.math?.advanced?.factorial?.(5) // 120
const nonExistent = utils?.math?.nonExistent?.(1, 2) // undefined

// 6. 动态属性访问
function safeGet(obj, path) {
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    current = current?.[key]
    if (current === undefined) break
  }

  return current
}

// 使用示例
const data = { a: { b: { c: 'value' } } }
console.log(safeGet(data, 'a.b.c')) // 'value'
console.log(safeGet(data, 'a.b.x')) // undefined
```

## 实战应用举例

接口字段层级不稳定时，可选链能避免为了读一个字段写多层保护。

```javascript
const city = user?.profile?.address?.city ?? '未知城市'
const firstRole = user?.roles?.[0]
const label = column.formatter?.(value) ?? value
```

## 使用场景说明和对比

| 写法 | 适合场景 | 注意点 |
| --- | --- | --- |
| `obj?.prop` | 安全读取属性 | 只在 null/undefined 时短路 |
| `obj?.[key]` | 动态 key | key 表达式可能不会执行 |
| `fn?.()` | 可选回调 | 只保证 fn 存在时调用 |
| `obj && obj.a && obj.a.b` | 旧写法 | 会被 0/''/false 干扰 |

## 易错点提示

1. 可选链只对 null 和 undefined 短路。
2. `obj?.a.b` 只保护 `obj`，不保护 `a`。
3. 可选链不能出现在赋值左侧。
4. `fn?.()` 如果 fn 存在但不是函数，仍会报错。
5. 常与 `??` 配合设置默认值。

## 记忆要点总结

- `?.` 用于安全访问可能缺失的链路。
- 只判断 null/undefined。
- 属性、数组索引、函数调用都可用。
- 默认值配 `??`。

## 延伸问题

可以继续追问：148. [中级]** 可选链操作符(?.)的用法 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`?.` 和 `&&` 链式判断有什么区别？**  
A：`?.` 只在 null/undefined 时停止，`&&` 会被 0、空字符串、false 等 falsy 值影响。

**Q：`obj?.a.b` 安全吗？**  
A：只保护 `obj`，如果 `obj.a` 是 null/undefined，访问 `.b` 仍会报错；要写 `obj?.a?.b`。

## 辅助记忆总结

一句话记：可选链只问“是不是 null/undefined”，不是问“真不真”。
