# 模板中如何使用 `v-model` 在子组件进行双向绑定？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue的双向绑定机制和自定义组件的v-model实现，面试官想了解你是否掌握组件通信的高级用法。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 原答案只提到了原生表单元素，缺少自定义组件的v-model实现
2. 没有说明Vue 3中v-model的新特性

## 知识点系统梳理

~~在输入型组件：input，textarea、radio、select等组件中通过v-model将值绑定，就实现了双向绑定。~~

~~本质上是简化了props和emits的传递和事件响应。~~

### 问题本质解读 这道题考察Vue的双向绑定机制和自定义组件的v-model实现，面试官想了解你是否掌握组件通信的高级用法。

### 技术错误纠正
1. 原答案只提到了原生表单元素，缺少自定义组件的v-model实现
2. 没有说明Vue 3中v-model的新特性

### 实战应用举例
```vue
<!-- 自定义输入组件 -->
<template>
  <div class="custom-input">
    <label>{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup>
// Vue 3中v-model默认使用modelValue和update:modelValue
defineProps({
  modelValue: String,
  label: String,
  placeholder: String
})

defineEmits(['update:modelValue'])
</script>

<!-- 使用自定义组件 -->
<template>
  <CustomInput
    v-model="username"
    label="用户名"
    placeholder="请输入用户名"
  />
</template>

<!-- 多个v-model -->
<template>
  <UserForm
    v-model:name="userName"
    v-model:email="userEmail"
    v-model:age="userAge"
  />
</template>

<script setup>
// UserForm组件
defineProps({
  name: String,
  email: String,
  age: Number
})

defineEmits([
  'update:name',
  'update:email',
  'update:age'
])
</script>

<!-- 自定义修饰符 -->
<template>
  <CustomInput v-model.capitalize="message" />
</template>

<script setup>
// 处理自定义修饰符
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (value) => {
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<!-- 复杂组件的v-model -->
<template>
  <div class="date-picker">
    <input
      type="date"
      :value="formatDate(modelValue)"
      @change="handleDateChange"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [Date, String, null]
})

const emit = defineEmits(['update:modelValue'])

const formatDate = (date) => {
  if (!date) return ''
  return date instanceof Date ?
    date.toISOString().split('T')[0] :
    date
}

const handleDateChange = (event) => {
  const dateString = event.target.value
  const date = dateString ? new Date(dateString) : null
  emit('update:modelValue', date)
}
</script>
```

### 记忆要点总结
- Vue 3默认：modelValue + update:modelValue
- 多个v-model：v-model:propName
- 自定义修饰符：modelModifiers
- 本质：props + emit的语法糖

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

可以继续追问：模板中如何使用 `v-model` 在子组件进行双向绑定？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
