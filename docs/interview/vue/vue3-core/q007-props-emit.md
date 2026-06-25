# 如何在父组件向子组件传入回调事件？（基本 props & emit）

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue组件通信的基本方式，面试官想了解你是否掌握父子组件事件传递的标准模式。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 原答案过于简略，缺少具体实现方式
2. provide/inject不是传递回调事件的主要方式，主要用于跨层级数据传递

## 知识点系统梳理

1. 通过 v-on （@）
2. ~~provide inject~~

### 问题本质解读 这道题考察Vue组件通信的基本方式，面试官想了解你是否掌握父子组件事件传递的标准模式。

### 技术错误纠正
1. 原答案过于简略，缺少具体实现方式
2. provide/inject不是传递回调事件的主要方式，主要用于跨层级数据传递

### 知识点系统梳理

**标准的父子组件事件传递：**
1. 父组件通过props传递回调函数
2. 子组件通过emit触发自定义事件
3. 父组件监听子组件的自定义事件

### 实战应用举例
```vue
<!-- 父组件 -->
<template>
  <div>
    <!-- 方式1: 直接传递回调函数 -->
    <ChildComponent :on-click="handleChildClick" />

    <!-- 方式2: 监听自定义事件 -->
    <ChildComponent @custom-event="handleCustomEvent" />

    <!-- 方式3: v-model双向绑定 -->
    <ChildComponent v-model:value="inputValue" />
  </div>
</template>

<script setup>
const inputValue = ref('')

// 处理子组件回调
const handleChildClick = (data) => {
  console.log('子组件点击:', data)
}

// 处理自定义事件
const handleCustomEvent = (payload) => {
  console.log('收到自定义事件:', payload)
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <!-- 调用props传递的回调 -->
    <button @click="onClick('button clicked')">
      点击调用回调
    </button>

    <!-- 触发自定义事件 -->
    <button @click="emitCustomEvent">
      触发自定义事件
    </button>

    <!-- v-model实现 -->
    <input
      :value="value"
      @input="$emit('update:value', $event.target.value)"
    />
  </div>
</template>

<script setup>
// 定义props
const props = defineProps({
  onClick: Function,
  value: String
})

// 定义emits
const emit = defineEmits(['custom-event', 'update:value'])

// 触发自定义事件
const emitCustomEvent = () => {
  emit('custom-event', { message: 'Hello from child' })
}
</script>
```

### 记忆要点总结
- 主要方式：props传递回调 + emit触发事件
- 监听方式：@event-name 或 v-on:event-name
- 双向绑定：v-model + update:propName事件

---

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**父子组件通信方式对比：**

| 方式 | 方向 | 适用场景 | 注意 |
|------|------|---------|------|
| props / emit | 父→子 / 子→父 | 直接父子关系 | 单向数据流，避免直接修改 props |
| v-model | 父子双向绑定 | 表单组件、自定义输入 | 语法糖 = `:modelValue` + `@update:modelValue` |
| provide / inject | 祖先→后代 | 跨多层组件传参（主题、配置） | 不推荐用于高频更新的数据 |
| defineExpose / ref | 父访问子实例 | 需要直接调用子组件方法 | 耦合度提高，非必要不用 |
| 事件总线 / Pinia | 全局 | 无关联组件通信 | Pinia 优先，事件总线在 Vue 3 中不推荐 |

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何在父组件向子组件传入回调事件？（基本 props & emit） 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
