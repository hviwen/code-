# 41. Composition API ⭐⭐⭐ 🔥

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「41. Composition API ⭐⭐⭐ 🔥」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

### 原始答案
- Composition API 是一种新的组件逻辑组织方式，将组件的逻辑按照功能进行分割，可以将多个功能组合到一个组件中
- Options API 是一种基于选项的组件逻辑组织方式，将组件的逻辑按照数据、方法、生命周期等进行分割

---

### 📊 技术点评

#### 🎯 核心考点
- 逻辑组织与复用方式对比
- TS/Tree-shaking 友好性
- 面试意图：评估大规模组件重构/复用能力

#### ✅ 正确答案/参考答案
- Composition API 使用函数组织逻辑，无 this，便于提取复用（hooks）
- Options API 按 data/methods 等分组，易读但跨逻辑分散；Vue3 仍支持
- Composition 在类型、Tree-shaking、逻辑聚合上更优

#### 💼 实际应用场景
1. 跨组件逻辑复用（hooks）
2. 大型组件拆分关注点

#### ⚠️ 技术纠正（如有）
- 补充 Composition 不依赖 this，类型推断更好

#### 🔗 知识关联
- 所属模块：Composition API
- 相关知识点：setup、组合式函数、script setup
- 前置要求：Options API 理解

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <p>窗口宽度：{{ width }}</p>
    <p>计数：{{ count }}</p>
    <button @click="inc">+</button>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const useWindowWidth = () => {
  const width = ref(window.innerWidth)
  const handler = () => (width.value = window.innerWidth)
  onMounted(() => window.addEventListener('resize', handler))
  onUnmounted(() => window.removeEventListener('resize', handler))
  return width
}

const width = useWindowWidth()
const count = ref(0)
const inc = () => count.value++
</script>
```
**最佳实践：**
- 将可复用逻辑抽成 hooks；保持单一职责
- Options 迁移时先提取 data/method 到 setup 再重构

#### 📈 面试延伸
- 追问 mixin 与组合式函数的差异与迁移方式
- 询问 Composition API 对 Tree-shaking 的帮助

#### 📝 记忆要点
- **无 this**：函数式组织
- **高复用**：hooks 抽取
- **类型友好**：TS 推断好

#### ✅ 快速自测
- [ ] 组合式函数与 mixins 差异？
- [ ] 如何在 hook 中注册生命周期？

---

**42.** `<script setup>` 语法糖有什么优势？

- 可以更方便的使用Composition API
- 可以更方便的使用TypeScript
- 可以更方便的使用模板引用

---

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：41. Composition API ⭐⭐⭐ 🔥 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
