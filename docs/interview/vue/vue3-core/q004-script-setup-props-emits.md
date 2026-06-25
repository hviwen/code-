# 如何在 `script setup` 中定义 props 和 emits？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3的`<script setup>`语法糖的使用，面试官想了解你是否掌握现代Vue开发的最佳实践。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 原答案过于简略，缺少具体语法示例
2. 没有说明TypeScript支持和验证规则

## 知识点系统梳理

可以使用 defineProps 和 defineEmits 中以对象和数组的形式来定义

### 问题本质解读 这道题考察Vue 3的`<script setup>`语法糖的使用，面试官想了解你是否掌握现代Vue开发的最佳实践。

### 技术错误纠正
1. 原答案过于简略，缺少具体语法示例
2. 没有说明TypeScript支持和验证规则

### 知识点系统梳理

**defineProps用法：**
- 数组形式：简单声明
- 对象形式：带类型和默认值
- TypeScript形式：类型推导

**defineEmits用法：**
- 数组形式：简单声明
- 对象形式：带验证
- TypeScript形式：类型约束

### 实战应用举例
```vue
<script setup>
// 1. 数组形式 - 简单声明
const props = defineProps(['title', 'content'])
const emit = defineEmits(['update', 'delete'])

// 2. 对象形式 - 带验证和默认值
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits({
  update: (value) => {
    // 验证逻辑
    return typeof value === 'string'
  },
  delete: null // 无验证
})

// 3. TypeScript形式
interface Props {
  title: string
  count?: number
  user?: { name: string; age: number }
}

interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用
console.log(props.title)
emit('update', 'new value')
</script>
```

### 记忆要点总结
- defineProps：声明接收的属性
- defineEmits：声明可触发的事件
- 支持数组、对象、TypeScript三种形式
- 编译时宏，无需导入

---

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**defineProps / defineEmits 与选项式对比：**

| 特性 | `<script setup>` 宏 | 选项式 `props: {}` |
|------|-------------------|-------------------|
| 声明方式 | `defineProps({...})` 编译期宏 | `props: {}` 属性声明 |
| TypeScript | `defineProps<{ name: string }>()` | 需额外类型推导 |
| 默认值 | `withDefaults(defineProps<...>(), {...})` | `default` 直接在 props 中 |
| emits 验证 | `defineEmits<{ (e: 'click', v: number): void }>()` | `emits: { click(payload) {...} }` |
| 推荐场景 | 新项目 / Vue 3 全栈 | 旧项目迁移 / 与 Options API 混用 |

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何在 `script setup` 中定义 props 和 emits？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
