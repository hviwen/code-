# 25. 自定义组件的 v-model ⭐⭐ 💡

> 来源：`review/vue/part/vue-review-part-1.md`

## 问题本质解读

这道题核心是在确认对「25. 自定义组件的 v-model ⭐⭐ 💡」背后机制和使用边界的理解。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

### 原始答案
- v-bind:"modelValue" v-on:"update:modelValue"
- 在子组件中 使用事件emit("update:modelValue",e.target.value) 的方式将更新值传递到父组件

---

### 📊 技术点评

#### 🎯 核心考点
- 受控属性协议
- 事件命名规范
- 面试意图：验证组件封装能力

#### ✅ 正确答案/参考答案
- 父：`v-model="value"` 等价于 `:modelValue="value" @update:modelValue="value=$event"`
- 子：声明 prop `modelValue` 与 emits `update:modelValue`，在交互时 emit 更新
- 多模型使用 `v-model:xxx` 对应 prop/事件名

#### 💼 实际应用场景
1. 封装输入组件/选择器
2. 支持多 v-model 的复合组件

#### ⚠️ 技术纠正（如有）
- 需在 emits 中声明 update 事件

#### 🔗 知识关联
- 所属模块：组件通信
- 相关知识点：emits、修饰符透传
- 前置要求：props/emit

#### 💡 实战示例（重点题目）
已在题 14 示例覆盖

#### 📈 面试延伸
- 追问如何处理 v-model 修饰符传递与消费
- 询问在 TS 下如何声明 update 事件类型

#### 📝 记忆要点
- **prop 名**：modelValue
- **事件名**：update:modelValue
- **多模型**：v-model:xxx

#### ✅ 快速自测
- [ ] 自定义组件如何拿到修饰符？
- [ ] emits 不声明 update 事件会怎样？

---

**26.** Vue 3 组件的生命周期钩子有哪些？按顺序列出。

- setup
- befroeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeUnmount
- unmounted

---

## 实战应用举例

待补充可运行示例。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：25. 自定义组件的 v-model ⭐⭐ 💡 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
