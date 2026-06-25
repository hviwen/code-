# `watch` 的 `immediate` 与 `deep` 选项分别做什么？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3 watch API的配置选项，面试官想了解你是否理解不同监听模式的使用场景和性能影响。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. "监听ref getter 数组"表述不准确，immediate是指组件创建时立即执行监听回调
2. 原答案缺少具体的使用场景和注意事项
3. 没有说明这些选项的性能影响和最佳实践

## 知识点系统梳理

immediate 是 ~~监听ref getter 数组的第一次时立即执行一次，此时的oldValue为undefined~~ 组件创建式立即执行监听回调

deep ~~时监听reactive 内嵌套属性的变化，也发生响应~~ 深入监听对象内部属性变化（会影响性能）

### 问题本质解读 这道题考察Vue 3 watch API的配置选项，面试官想了解你是否理解不同监听模式的使用场景和性能影响。

### 技术错误纠正
1. "监听ref getter 数组"表述不准确，immediate是指组件创建时立即执行监听回调
2. 原答案缺少具体的使用场景和注意事项
3. 没有说明这些选项的性能影响和最佳实践

### 知识点系统梳理

**immediate选项：**
- 作用：组件创建时立即执行一次监听回调
- 场景：需要在组件初始化时就执行逻辑
- 注意：首次执行时oldValue为undefined

**deep选项：**
- 作用：深度监听对象内部属性的变化
- 场景：监听复杂对象或数组的内部变化
- 注意：会影响性能，谨慎使用

### 实战应用举例
```javascript
import { ref, reactive, watch, computed } from 'vue'

// 1. immediate选项的基础使用
const count = ref(0)

// 立即执行的监听器
watch(count, (newValue, oldValue) => {
  console.log('Count changed:', { newValue, oldValue })
  // 首次执行时：newValue = 0, oldValue = undefined
}, { immediate: true })

// 2. deep选项的基础使用
const user = reactive({
  name: 'John',
  profile: {
    age: 25,
    address: {
      city: 'Beijing',
      street: 'Main St'
    }
  },
  hobbies: ['reading', 'coding']
})

// 深度监听对象
watch(user, (newValue, oldValue) => {
  console.log('User object changed:', newValue)
  // 注意：newValue和oldValue在深度监听中通常是同一个对象
}, { deep: true })

// 3. 组合使用immediate和deep
const settings = reactive({
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    push: false
  }
})

watch(settings, (newSettings) => {
  // 组件创建时立即执行，并且深度监听所有属性变化
  console.log('Settings updated:', newSettings)

  // 保存到localStorage
  localStorage.setItem('userSettings', JSON.stringify(newSettings))
}, {
  immediate: true,  // 组件创建时立即保存当前设置
  deep: true        // 监听所有嵌套属性变化
})

// 4. 性能优化：选择性深度监听
const largeObject = reactive({
  data: new Array(1000).fill(null).map((_, i) => ({ id: i, value: Math.random() })),
  config: {
    pageSize: 10,
    sortBy: 'id',
    filters: {}
  }
})

// ❌ 避免：监听整个大对象
// watch(largeObject, callback, { deep: true }) // 性能差

// ✅ 推荐：只监听需要的部分
watch(() => largeObject.config, (newConfig) => {
  console.log('Config changed:', newConfig)
}, { deep: true })

// 5. 监听数组变化
const items = ref([
  { id: 1, name: 'Item 1', completed: false },
  { id: 2, name: 'Item 2', completed: true }
])

// 监听数组内容变化
watch(items, (newItems) => {
  console.log('Items changed:', newItems)

  // 计算完成的任务数量
  const completedCount = newItems.filter(item => item.completed).length
  console.log('Completed tasks:', completedCount)
}, { deep: true })

// 6. 表单验证示例
const formData = reactive({
  username: '',
  email: '',
  profile: {
    firstName: '',
    lastName: ''
  }
})

const validationErrors = ref({})

// 实时表单验证
watch(formData, (newFormData) => {
  const errors = {}

  if (!newFormData.username) {
    errors.username = '用户名不能为空'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!newFormData.email) {
    errors.email = '邮箱不能为空'
  } else if (!emailRegex.test(newFormData.email)) {
    errors.email = '邮箱格式不正确'
  }

  validationErrors.value = errors
}, {
  deep: true,      // 监听所有字段变化
  immediate: true  // 立即验证初始状态
})
```

**使用场景对比：**

| 选项 | 使用场景 | 性能影响 | 注意事项 |
|------|----------|----------|----------|
| immediate: true | 初始化逻辑、数据预处理 | 无 | oldValue为undefined |
| deep: true | 复杂对象监听 | 高 | 谨慎使用，考虑性能 |
| 组合使用 | 表单验证、设置保存 | 中等 | 平衡功能和性能 |

**性能优化建议：**
```javascript
// ❌ 避免：监听大对象的深层变化
watch(massiveObject, callback, { deep: true })

// ✅ 推荐：监听特定属性
watch(() => massiveObject.specificProperty, callback)

// ✅ 推荐：使用计算属性缓存
const specificData = computed(() => massiveObject.specificProperty)
watch(specificData, callback)
```

### 记忆要点总结
- **immediate: true**：组件创建时立即执行，首次oldValue为undefined
- **deep: true**：深度监听对象内部属性，会影响性能
- **性能考虑**：deep选项谨慎使用，优先监听特定属性
- **组合使用**：适合表单验证、设置保存等场景
- **最佳实践**：按需选择选项，使用防抖优化，监控性能影响

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

可以继续追问：`watch` 的 `immediate` 与 `deep` 选项分别做什么？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
