# 6. v-if vs v-show ⭐⭐ 🔥

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「6. v-if vs v-show ⭐⭐ 🔥」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

### 原始答案
- v-if和v-show都是vue中的指令
- v-if 在于判断组件/标签是否存在，如果为false则不做任何事情，为true则按照正常规则创建。切换v-if的值可以造成对应组件/标签的销毁和重建，频繁切换开销比较大
- v-show 只控制对应组件/标签块的css中的display是否为none ，切换不会操成组件的销毁和重建。更适合需要频繁切换的场景

---

### 📊 技术点评

#### 🎯 核心考点
- 条件渲染 vs 条件展示
- 初始渲染与切换成本
- 生命周期触发差异
- 面试意图：考察对性能和渲染时机的判断

#### ✅ 正确答案/参考答案
- `v-if`：条件为真才创建/销毁 DOM，切换成本高但首屏成本低
- `v-show`：始终渲染，通过 display 切换，切换成本低但首屏一定渲染
- 选择依据：条件变化频率、初始渲染需求，v-show 不支持 template/v-else

#### 💼 实际应用场景
1. 权限控制视图（偶尔变化）
2. 折叠面板/弹窗频繁切换

#### ⚠️ 技术纠正（如有）
- v-show 不支持 template 和 v-else；首次渲染必创建 DOM

#### 🔗 知识关联
- 所属模块：模板指令、性能优化
- 相关知识点：lazy mount、keep-alive
- 前置要求：虚拟 DOM diff

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <ProfileCard v-if="isAdmin" />
    <Tooltip v-show="hovered" text="提示" />
    <button @click="toggle">切换</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import ProfileCard from './ProfileCard.vue'
import Tooltip from './Tooltip.vue'

const isAdmin = ref(false)
const hovered = ref(false)
const toggle = () => {
  isAdmin.value = !isAdmin.value
  hovered.value = !hovered.value
}
</script>
```
**最佳实践：**
- 频繁显隐用 v-show，懒加载/条件创建用 v-if
- 大组件首屏性能敏感时用 v-if 并配合异步组件

#### 📈 面试延伸
- 追问 keep-alive 与 v-if/v-show 的组合策略
- 询问动画/transition 与二者搭配的差异

#### 📝 记忆要点
- **创建成本**：if 懒渲染，show 立即
- **切换成本**：if 重建，show 样式切换
- **限制**：show 无 v-else/模板

#### ✅ 快速自测
- [ ] v-show 会触发生命周期吗？
- [ ] 首屏性能敏感选哪个？

---

**7.** `v-for` 上为什么需要 `key`？如何选择合适的 key？

- key用于标记vDOM结构的item，在diff过程中用于判断是哪些组件在更新和变动，只针对变更的部分做更新。
- key用于标记子组件唯一身份，建议是唯一id值，可以是string和number

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

可以继续追问：6. v-if vs v-show ⭐⭐ 🔥 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
