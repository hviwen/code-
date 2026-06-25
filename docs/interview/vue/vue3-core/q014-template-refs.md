# 如何在组件中访问模板引用（template refs）？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3中模板引用的使用方法，面试官想了解你是否掌握直接操作DOM和组件实例的技巧。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 不是"useRefs"，应该是"ref"
2. 缺少具体的语法和使用场景

## 知识点系统梳理

~~可以通过 useRefs定一个refs，然后通过在组件中ref绑定该值，就可以获取到该组件的实例，就可以通过ref来调用该组件的方法。~~

### 问题本质解读 这道题考察Vue 3中模板引用的使用方法，面试官想了解你是否掌握直接操作DOM和组件实例的技巧。

### 技术错误纠正
1. 不是"useRefs"，应该是"ref"
2. 缺少具体的语法和使用场景

### 实战应用举例
```vue
<template>
  <div>
    <!-- 元素引用 -->
    <input ref="inputRef" type="text" />
    <button @click="focusInput">聚焦输入框</button>

    <!-- 组件引用 -->
    <ChildComponent ref="childRef" />
    <button @click="callChildMethod">调用子组件方法</button>

    <!-- 循环中的引用 -->
    <div
      v-for="(item, index) in items"
      :key="item.id"
      :ref="el => setItemRef(el, index)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 元素引用
const inputRef = ref(null)

const focusInput = () => {
  inputRef.value.focus()
}

// 组件引用
const childRef = ref(null)

const callChildMethod = () => {
  childRef.value.someMethod()
}

// 循环引用
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
])

const itemRefs = ref([])

const setItemRef = (el, index) => {
  if (el) {
    itemRefs.value[index] = el
  }
}

// 生命周期中访问
onMounted(() => {
  console.log('输入框元素:', inputRef.value)
  console.log('子组件实例:', childRef.value)
})

// 动态引用
const dynamicRef = ref(null)
const showElement = ref(false)

const toggleElement = async () => {
  showElement.value = !showElement.value

  if (showElement.value) {
    await nextTick()
    console.log('动态元素:', dynamicRef.value)
  }
}
</script>

<!-- 子组件需要暴露方法 -->
<script setup>
// ChildComponent.vue
const count = ref(0)

const someMethod = () => {
  console.log('子组件方法被调用')
  count.value++
}

// 暴露给父组件
defineExpose({
  someMethod,
  count: readonly(count)
})
</script>

<!-- 函数式组件中的引用 -->
<script setup>
// 使用函数获取引用
const getRef = (name) => {
  const refMap = new Map()

  return (el) => {
    if (el) {
      refMap.set(name, el)
    } else {
      refMap.delete(name)
    }
  }
}

const buttonRef = getRef('button')
</script>

<template>
  <button :ref="buttonRef">按钮</button>
</template>
```

**TypeScript中的模板引用：**
```vue
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

// 元素引用类型
const inputRef = ref<HTMLInputElement | null>(null)

// 组件引用类型
interface ChildComponentInstance {
  someMethod: () => void
  count: number
}

const childRef = ref<ComponentPublicInstance<ChildComponentInstance> | null>(null)

// 或者直接使用组件类型
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)
</script>
```

### 记忆要点总结
- 创建：const refName = ref(null)
- 绑定：ref="refName"
- 访问：refName.value
- 组件：需要defineExpose暴露方法

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

可以继续追问：如何在组件中访问模板引用（template refs）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
