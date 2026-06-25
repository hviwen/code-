# 1. Vue 2 vs Vue 3 ⭐⭐⭐ 🔥

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「1. Vue 2 vs Vue 3 ⭐⭐⭐ 🔥」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

### 原始答案
- vue2 和 vue3的底层实现方式不同，vue2为兼顾老版本浏览器采用 Object.definePrototype 的方式对数据进行geter/setter ,需要使用 vue.set的方式来更新数据。相比Vue3 采用ES6中的Proxy对数据做响应式，通过track和tigger来对数据的读取，写入，删除，不存在数据访问等做监听完成响应式操作。
- 生命周期不同，在vue2版本中 有beforeCreate和create 和 destroy等生命周期，在vue3中使用 setup 和 onUnMounted代替
- vue3新增了组合式API 选项式API的写法和组合式函数
- Vue3 支持TypeScript
- vue3 新增了Teleport Suspense Transiion等内置组件
- vue3 新增tree-Sharking 更小的包体积和运行速度
- vue3 支持多根节点
- vue3 新增v-model 数据双向绑定

---

### 📊 技术点评

#### 🎯 核心考点
- 响应式实现差异（Proxy vs Object.defineProperty）
- Composition API 与 Options API 演进
- 编译&运行时性能优化（Tree-shaking、多根、TS）
- 面试意图：评估迁移经验、底层理解和性能思维

#### ✅ 正确答案/参考答案
- Vue2 基于 Object.defineProperty，需 Vue.set 处理新增属性；Vue3 基于 Proxy，可监听增删、数组索引等
- Vue3 增加 Composition API，保留 Options API，生命周期新增 setup、onBeforeUnmount 等组合式钩子
- Vue3 支持 Fragment、多 v-model、Teleport、Suspense，打包 Tree-shaking 更好、TS 体验提升

#### 💼 实际应用场景
1. 旧项目升级评估、迁移策略制定
2. 新项目技术选型、性能预算
3. 跨版本库兼容性检查

#### ⚠️ 技术纠正（如有）
❌ **错误示例：** 生命周期“setup 和 onUnmounted 代替 beforeCreate/created”

✅ **正确示例：** Vue3 仍保留 beforeCreate/created，新增 setup 并推荐组合式写法

**问题说明：** 混淆了组合式 API 与生命周期，可能在迁移时遗漏钩子导致逻辑缺失。

#### 🔗 知识关联
- 所属模块：响应式系统、编译优化、组件化
- 相关知识点：Fragment、多 v-model、Teleport/Suspense
- 前置要求：熟悉 Vue2 选项式 API

#### 💡 实战示例（重点题目）
```vue
<template>
  <section>
    <p>用户名：{{ user.name }}</p>
    <button @click="increment">点击 {{ count }}</button>
    <Child v-model:title="title" />
  </section>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import Child from './Child.vue'

const state = reactive({ visits: 1 })
const user = reactive({ name: 'Vue3' })
const count = computed(() => state.visits * 2)
const title = ref('hello')
const increment = () => { state.visits++ }
</script>
<style scoped>
section { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
button { margin-top: 8px; }
</style>
```
**最佳实践：**
- 迁移时优先改写成组合式 API 方便逻辑拆分
- 利用多根节点减少无意义包裹元素

#### 📈 面试延伸
- 追问 Proxy 相较 defineProperty 具体解决的痛点（数组变更、动态键）
- 询问迁移过程中 tree-shaking、按需加载、类型改造的实战经验

#### 📝 记忆要点
- **响应式升级**：Proxy、可监听新增/删除
- **性能**：编译缓存 + Tree-shaking
- **API 形态**：Options→Composition
- **新内置**：Teleport/Suspense/Fragment

#### ✅ 快速自测
- [ ] Proxy 相较 defineProperty 解决了哪些问题？
- [ ] Vue3 如何支持多 v-model？

---

**2.** 什么是 `ref`，与 `reactive` 的区别是什么？

- ref是vue中可以定义响应式数据的函数。通常用于将原始类型数据转为响应式对象。在javascript中可以通过访问响应式对象的.value 访问到其真值。也可以传入非原始类型数据，但是在其内部使用reactive来对非原始类型数据进行包装。在模版中可以自动解包。
- reactive同样是用于定义响应式数据的函数，但与ref不同的是他用于包装非原始类型数据。返回对象同样具有响应式。可以直接通过对象访问其真实值。

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

可以继续追问：1. Vue 2 vs Vue 3 ⭐⭐⭐ 🔥 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
