# 14. v-model 原理与变化 ⭐⭐ 🔥

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「14. v-model 原理与变化 ⭐⭐ 🔥」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

### 原始答案
- v-model 双向数据绑定
- 本质为 v-bind:"modelValue" v-on:"update:modelValue" 的结合体
- 通常在input textArea select等组件中使用

---

### 📊 技术点评

#### 🎯 核心考点
- 受控组件协议（modelValue/update:modelValue）
- 多 v-model 与参数修饰符
- Vue2 的 .sync 差异
- 面试意图：考察封装组件的抽象能力

#### ✅ 正确答案/参考答案
- v-model 等价于 `:modelValue="val" @update:modelValue="val=$event"`
- Vue3 支持多 v-model：`v-model:propName` 对应 `propName`/`update:propName`
- 修饰符通过 emits 回调第二参数传递（如 `emit('update:modelValue', value, { trim: true })`）

#### 💼 实际应用场景
1. 表单组件封装（输入框/选择器）
2. 支持双向绑定的复杂组件（Dialog 可见性+数据）

#### ⚠️ 技术纠正（如有）
- 必须在 emits 中声明 update 事件；多模型需匹配 prop/事件名

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、受控属性、sync 迁移
- 前置要求：props/emit

#### 💡 实战示例（重点题目）
```vue
<template>
  <Modal v-model:visible="visible" v-model:title="title" />
  <button @click="visible = true">打开</button>
</template>
<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'

const visible = ref(false)
const title = ref('编辑用户')
</script>
```
```vue
<!-- Modal.vue -->
<template>
  <div v-if="visible" class="modal">
    <h3>{{ title }}</h3>
    <button @click="close">关闭</button>
  </div>
</template>
<script setup>
const props = defineProps({ visible: Boolean, title: String })
const emit = defineEmits(['update:visible', 'update:title'])
const close = () => emit('update:visible', false)
</script>
```
**最佳实践：**
- 封装组件时明确 model 字段名，支持多模型
- 不直接修改 props，统一用 update 事件

#### 📈 面试延伸
- 追问自定义修饰符在子组件中的获取与处理
- 询问 v-model 与受控/非受控组件的区别

#### 📝 记忆要点
- **协议**：modelValue + update:modelValue
- **多模型**：v-model:xxx
- **修饰符**：通过 emits 入参传递

#### ✅ 快速自测
- [ ] Vue3 多 v-model 如何声明 emits？
- [ ] v-model 修饰符如何在子组件拿到？

---

**15.** Vue 中如何实现条件渲染？有哪些方式？

-

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

可以继续追问：14. v-model 原理与变化 ⭐⭐ 🔥 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
