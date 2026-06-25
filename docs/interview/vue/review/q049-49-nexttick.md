# 49. nextTick 用途 ⭐⭐ 🔥

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「49. nextTick 用途 ⭐⭐ 🔥」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

### 原始答案
- 等待DOM更新完成后执行回调
- 修改数据后计算新的DOM或者操作DOM

---

### 📊 技术点评

#### 🎯 核心考点
- 微任务队列、DOM 更新时机
- 更新后获取最新布局/状态
- 面试意图：确认对事件循环和渲染时机的理解

#### ✅ 正确答案/参考答案
- `await nextTick()` 在 DOM 更新后执行回调/后续逻辑
- 适合在数据变更后读取 DOM 尺寸、滚动、聚焦
- 避免滥用导致额外微任务，建议批量更新后一次调用

#### 💼 实际应用场景
1. 表格列显隐后重新计算宽度
2. 动画/滚动位置更新

#### ⚠️ 技术纠正（如有）
- 使用 await 形式更直观；避免频繁调用

#### 🔗 知识关联
- 所属模块：生命周期
- 相关知识点：flush 模式、DOM 更新
- 前置要求：事件循环

#### 💡 实战示例（重点题目）
```vue
<template>
  <div ref="panel" class="panel" v-show="open">内容</div>
  <button @click="toggle">切换</button>
</template>
<script setup>
import { ref, nextTick } from 'vue'

const open = ref(false)
const panel = ref(null)
const toggle = async () => {
  open.value = !open.value
  await nextTick()
  if (open.value) {
    console.log('height', panel.value?.offsetHeight)
  }
}
</script>
```
**最佳实践：**
- 在数据更新后且需要读取 DOM 时使用
- 尽量批量更新后一次 nextTick，避免重复

#### 📈 面试延伸
- 追问 flush: 'post' 的 watch 与 nextTick 的关系
- 询问 Vue DOM 更新相对微任务/宏任务的顺序

#### 📝 记忆要点
- **等待**：DOM 刷新
- **使用**：await nextTick()
- **场景**：读取尺寸/聚焦

#### ✅ 快速自测
- [ ] nextTick 基于什么队列？
- [ ] 更新频繁时如何减少 nextTick 次数？

---

**50.** Vue 3 中移除了哪些 Vue 2 的特性或 API？

- 移除了filter
- 移除了transition-group
- 移除了v-on.native
- 移除了v-once
- 移除了v-memo

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

可以继续追问：49. nextTick 用途 ⭐⭐ 🔥 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
