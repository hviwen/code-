# 4. setup 执行时机 ⭐⭐ 🔥

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「4. setup 执行时机 ⭐⭐ 🔥」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

### 原始答案
- setup() 执行在初始化构建期间，此时DOM还没有构建，props刚传入。这个期间在执行数据的初始化状态设置。
- 不能访问this，因为dom还没有构建

---

### 📊 技术点评

#### 🎯 核心考点
- setup 调用顺序与实例创建时机
- this 不可用的真实原因
- props/context 获取方式
- 面试意图：检查对组合式 API 生命周期的认知

#### ✅ 正确答案/参考答案
- setup 在组件实例创建前、beforeCreate 之前执行，props 已解析
- setup 内没有 this（实例未创建），需要通过参数获取 props/emit/attrs/slots/expose
- DOM 访问需放在 onMounted 或 nextTick

#### 💼 实际应用场景
1. 组合式函数初始化、注入依赖
2. SSR 中避免访问 window/DOM
3. 提前注册副作用（watch/onMounted 等）

#### ⚠️ 技术纠正（如有）
❌ “不能访问 this 因为 DOM 未构建”

✅ 实例未创建，与 DOM 无关

#### 🔗 知识关联
- 所属模块：Composition API、生命周期
- 相关知识点：beforeCreate/created、expose、context 参数
- 前置要求：组件实例化流程

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <p>props.title: {{ props.title }}</p>
    <button @click="emitSave">保存</button>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'

const props = defineProps({ title: { type: String, default: 'Demo' } })
const emit = defineEmits(['save'])
const emitSave = () => emit('save', Date.now())

onMounted(() => {
  console.log('mounted with title', props.title)
})
</script>
```
**最佳实践：**
- 所有需要的实例能力通过 setup 参数获取
- DOM 操作放在 onMounted/nextTick 中

#### 📈 面试延伸
- 追问 setup 在 SSR 中的行为以及何时执行
- 询问 defineExpose 的作用与默认暴露差异

#### 📝 记忆要点
- **时机**：beforeCreate 之前
- **无 this**：实例未创建
- **入口**：props/context 作为参数

#### ✅ 快速自测
- [ ] setup 中能否访问 attrs/slots？如何获取？
- [ ] setup 和 beforeCreate 谁先执行？

---

**5.** 如何在 `<script setup>` 中定义 props 和 emits？

- defineProps() 宏
- defineEmits() 宏

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

可以继续追问：4. setup 执行时机 ⭐⭐ 🔥 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
