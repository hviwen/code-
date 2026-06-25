# `setup()` 的执行时机是什么？能访问 `this` 吗？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3组合式API的核心概念和生命周期理解，面试官想了解你是否理解setup的执行时机和限制。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. setup()不仅用于选项式API，也是组合式API的核心
2. 执行时机描述不够准确，应该是在组件实例创建之前

## 知识点系统梳理

setup() ~~是vue3选项式api结构中的内容~~，可以接受props和上下文对象。在页面创建之初执行。不能访问this，因为组件实例还没有创建

### 问题本质解读 这道题考察Vue 3组合式API的核心概念和生命周期理解，面试官想了解你是否理解setup的执行时机和限制。

### 技术错误纠正
1. setup()不仅用于选项式API，也是组合式API的核心
2. 执行时机描述不够准确，应该是在组件实例创建之前

### 知识点系统梳理

**setup()执行时机：**
- 在组件实例创建之前执行
- 在props解析之后，但在组件实例创建之前
- 比beforeCreate和created更早执行
- 只执行一次

**setup()参数：**
- 第一个参数：props（响应式的）
- 第二个参数：context对象（包含attrs、slots、emit、expose）

**为什么不能访问this：**
- setup执行时组件实例还未创建
- this指向undefined（严格模式下）
- 这是设计上的考虑，鼓励使用组合式API

### 实战应用举例
```javascript
// 选项式API中的setup
export default {
  props: ['title'],
  setup(props, context) {
    console.log(props.title) // 可以访问props
    console.log(context.attrs) // 非prop属性
    console.log(context.slots) // 插槽
    console.log(context.emit) // 触发事件
    console.log(context.expose) // 暴露公共属性

    // console.log(this) // undefined，不能访问this

    const count = ref(0)

    return {
      count
    }
  }
}
```

### 记忆要点总结
- 执行时机：组件实例创建之前
- 参数：props + context
- 限制：不能访问this
- 目的：提供组合式API的入口点

---

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**setup() vs \<script setup\> 对比：**

| 对比维度 | `setup()` 函数 | `<script setup>` |
|---------|---------------|-----------------|
| 代码量 | 需要手动 return | 编译期自动暴露 |
| 组件复用 | 支持 setup factory | 不支持直接复用 |
| TypeScript | 通过参数声明 | 编译期宏（`defineProps`）天然支持 |
| 访问 this | 无法访问（setup执行时尚未挂载） | 同上 |
| 适用场景 | Mixin 迁移、动态选项式注入 | 新项目推荐，Vue 3 标准写法 |

setup 执行在 `beforeCreate` 之前，此时组件实例尚未创建，因此无法访问 `this`。需要访问组件实例的场景（如 `attrs`、`slots`）可以通过 `useAttrs()`、`useSlots()` 替代。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：`setup()` 的执行时机是什么？能访问 `this` 吗？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
