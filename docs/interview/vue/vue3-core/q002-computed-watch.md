# 如何创建一个计算属性（computed）？它与 `watch` 的区别是什么？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3响应式系统中两个重要API的使用场景和内部机制差异，面试官想了解你是否能正确选择合适的API。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 原答案语法有误："watch时vue中"应为"watch是vue中"
2. 缺少具体的创建语法和代码示例
3. 对两者的核心区别描述不够准确

## 知识点系统梳理

~~computed 是vue中创建计算属性的函数，它自动返回响应式计算的结果。包含get和set两个内置方法可以定义。set在修改这计算值时使用，get在获取计算值时使用。~~

~~watch是vue中的监听器，他监听一个响应式值的改变，而做出相应的改变。可以在第一次定义时监听，立即；也可以是监听响应式值的内部结构的变化，深度；也可以在实现延迟反应、提前反应。可以接受监听值更新时新旧两个值。~~

~~computed 只是根据多个响应式值变化，做出对应变化后的计算结果。~~

~~watch可以监听任意单个或者多个响应式值的变化，而做出响应的处理。~~

### 问题本质解读 这道题考察Vue 3响应式系统中两个重要API的使用场景和内部机制差异，面试官想了解你是否能正确选择合适的API。

### 技术错误纠正
1. 原答案语法有误："watch时vue中"应为"watch是vue中"
2. 缺少具体的创建语法和代码示例
3. 对两者的核心区别描述不够准确

### 知识点系统梳理

**computed特点：**
- **基于依赖的缓存计算**，只有依赖变化时才重新计算
- 返回值是响应式的，可以被其他computed或watch依赖
- 默认只读，可通过get/set定义可写计算属性
- 同步执行，不能处理异步操作

**watch特点：**
- **监听响应式数据变化，执行副作用操作**
- 可以处理异步操作
- 提供新值和旧值参数
- 支持immediate、deep、flush等选项

### 实战应用举例
```javascript
// computed - 计算属性
const firstName = ref('John')
const lastName = ref('Doe')

// 只读计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// 可写计算属性
const fullNameWritable = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

// watch - 监听器
const count = ref(0)

// 监听单个值
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})

// 监听多个值
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  // 处理姓名变化的副作用
  updateUserProfile(newFirst, newLast)
})

// 监听对象（需要deep选项）
const user = reactive({ name: 'John', age: 25 })
watch(user, (newUser, oldUser) => {
  // 深度监听对象变化
}, { deep: true })
```

**使用场景对比：**
- **computed**: 数据转换、格式化、过滤、计算衍生值
- **watch**: API调用、DOM操作、数据持久化、复杂业务逻辑

### 记忆要点总结
- computed：计算 + 缓存 + 同步 + 返回值
- watch：监听 + 副作用 + 异步 + 无返回值
- 选择原则：需要计算结果用computed，需要执行操作用watch

---

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

**computed vs watch 选用指南：**

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 模板中派生显示值（如全名、过滤列表） | `computed` | 自动缓存，仅依赖变化时重新计算 |
| 监听 props 变化发起异步请求 | `watch` | 副作用操作、可获取旧值 |
| 表单输入校验，实时反馈 | `computed` | 纯计算，视图层同步更新 |
| 搜索框防抖后请求 | `watch` + `debounce` | 需要控制副作用触发频率 |
| 动画触发 & 本地存储同步 | `watch` | 需要精确监听具体数据的变化 |

computed 要求是**纯函数**，禁止副作用的场景（如发起请求、修改 DOM）应当使用 watch。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何创建一个计算属性（computed）？它与 `watch` 的区别是什么？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
