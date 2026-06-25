# 2. ref 与 reactive ⭐⭐ 🔥

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「2. ref 与 reactive ⭐⭐ 🔥」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

### 原始答案
- ref是vue中可以定义响应式数据的函数。通常用于将原始类型数据转为响应式对象。在javascript中可以通过访问响应式对象的.value 访问到其真值。也可以传入非原始类型数据，但是在其内部使用reactive来对非原始类型数据进行包装。在模版中可以自动解包。
- reactive同样是用于定义响应式数据的函数，但与ref不同的是他用于包装非原始类型数据。返回对象同样具有响应式。可以直接通过对象访问其真实值。

---

### 📊 技术点评

#### 🎯 核心考点
- 基本类型与对象类型的响应式封装
- 模板自动解包 vs JS 中 .value 访问
- 解构丢失响应性与 toRefs
- 面试意图：考察响应式 API 选型与踩坑经验

#### ✅ 正确答案/参考答案
- `ref` 适合基本类型或需要整体替换的引用；在 JS 中通过 `.value` 访问，在模板中自动解包
- `reactive` 适合对象/数组，直接访问属性；解构后需 `toRefs` 保持响应
- 需要整体替换对象时，用 `ref` 包装对象比 `reactive` 直接替换更安全

#### 💼 实际应用场景
1. 表单字段（字符串/数字）与复杂表单对象并存
2. 定时器/异步状态（loading/error）管理
3. 组件对外暴露的简单状态与内部复合状态

#### ⚠️ 技术纠正（如有）
- ref 包装对象只有引用替换才会触发；reactive 不适合整体替换

#### 🔗 知识关联
- 所属模块：响应式系统
- 相关知识点：toRef/toRefs、shallowRef、readonly
- 前置要求：ES Proxy/引用类型基础

#### 💡 实战示例（重点题目）
```vue
<template>
  <div>
    <input v-model="name" placeholder="姓名" />
    <input type="number" v-model.number="profile.age" placeholder="年龄" />
    <p>{{ greeting }}</p>
    <button @click="replaceProfile">替换对象</button>
  </div>
</template>
<script setup>
import { ref, reactive, computed, toRefs } from 'vue'

const name = ref('Alice')
const profile = reactive({ age: 18, city: 'SZ' })
const { age } = toRefs(profile)
const greeting = computed(() => `${name.value} - ${age.value}岁`)
const replaceProfile = () => { Object.assign(profile, { age: 20, city: 'SH' }) }
</script>
```
**最佳实践：**
- 基本类型优先 ref，对象优先 reactive，解构后用 toRefs
- 需要整体替换的复杂数据用 ref 包装对象

#### 📈 面试延伸
- 追问 shallowRef/triggerRef 在大数据或第三方实例场景的使用
- 询问解构丢失响应性的源码原因（Ref unwrap、Proxy unwrap）

#### 📝 记忆要点
- **ref**：.value，基本类型
- **reactive**：对象直接用
- **toRefs**：解构保持响应
- **ref 包装对象**：替换引用

#### ✅ 快速自测
- [ ] 何时选择 ref 包装对象而非 reactive？
- [ ] reactive 整体替换为何丢响应？

---

**3.** 如何创建一个计算属性（computed）？它与普通函数有什么区别？

- 计算属性默认通过一个getter()函数来根据内部响应式值的变化自动更新其结果，返回一个ref类型的值。也可以为其设置get/set函数。set函数可以改变对应的响应式数
- 与普通函数不同的是：
  1. 计算属性可以缓存计算值，在响应式数据没有发生改变时其计算结果不改变且不用重复计算。
  2. 计算属性只能是同步的，不可以执行异步操作
  3. 计算属性根据响应式值的变化自动计算结果并返回一个ref类型的值

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

可以继续追问：2. ref 与 reactive ⭐⭐ 🔥 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
