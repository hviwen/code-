# 如何在组件间共享逻辑（composition vs mixin）？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3中逻辑复用的最佳实践，面试官想了解你是否理解composition API相比mixin的优势，以及如何设计可复用的组合式函数。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. 原答案过于简单，没有对比mixin和composition API的区别
2. 缺少具体的实现方式和使用场景
3. 没有说明为什么推荐使用组合式函数

## 知识点系统梳理

可以使用组合式函数

### 问题本质解读 这道题考察Vue 3中逻辑复用的最佳实践，面试官想了解你是否理解composition API相比mixin的优势，以及如何设计可复用的组合式函数。

### 技术错误纠正
1. 原答案过于简单，没有对比mixin和composition API的区别
2. 缺少具体的实现方式和使用场景
3. 没有说明为什么推荐使用组合式函数

### 知识点系统梳理

**Mixin的问题：**
- 命名冲突：多个mixin可能有相同的属性或方法名
- 隐式依赖：mixin之间的依赖关系不明确
- 难以追踪：数据来源不清晰，调试困难
- 类型推导困难：TypeScript支持不佳

**Composition API的优势：**
- 明确的依赖关系：通过函数参数和返回值明确接口
- 更好的类型推导：TypeScript友好
- 逻辑分组：相关逻辑可以组织在一起
- 按需导入：只使用需要的功能

### 实战应用举例
```javascript
// ❌ Vue 2 Mixin方式（不推荐）
const counterMixin = {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  }
}

const userMixin = {
  data() {
    return {
      user: null,
      loading: false
    }
  },
  async created() {
    await this.fetchUser()
  },
  methods: {
    async fetchUser() {
      this.loading = true
      try {
        this.user = await api.getUser()
      } finally {
        this.loading = false
      }
    }
  }
}

// 使用mixin（问题多多）
export default {
  mixins: [counterMixin, userMixin],
  // 不清楚count、user、loading来自哪里
  // 如果多个mixin有相同方法名会冲突
}

// ✅ Vue 3 Composition API方式（推荐）

// 1. 计数器逻辑复用
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  const reset = () => {
    count.value = initialValue
  }

  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  }
}

// 2. 用户数据管理
export function useUser() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchUser = async (userId) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.getUser(userId)
      user.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.updateUser(userData)
      user.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const clearUser = () => {
    user.value = null
    error.value = null
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    fetchUser,
    updateUser,
    clearUser
  }
}

// 3. 表单验证逻辑
export function useFormValidation(rules) {
  const errors = ref({})
  const touched = ref({})

  const validateField = (field, value) => {
    const fieldRules = rules[field]
    if (!fieldRules) return true

    for (const rule of fieldRules) {
      const result = rule.validator(value)
      if (!result) {
        errors.value[field] = rule.message
        return false
      }
    }

    delete errors.value[field]
    return true
  }

  const validateForm = (formData) => {
    let isValid = true
    Object.keys(rules).forEach(field => {
      const fieldValid = validateField(field, formData[field])
      if (!fieldValid) isValid = false
    })
    return isValid
  }

  const clearErrors = () => {
    errors.value = {}
    touched.value = {}
  }

  const touchField = (field) => {
    touched.value[field] = true
  }

  return {
    errors: readonly(errors),
    touched: readonly(touched),
    validateField,
    validateForm,
    clearErrors,
    touchField
  }
}

// 4. 异步数据获取
export function useAsyncData(fetchFn) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const execute = async (...args) => {
    loading.value = true
    error.value = null

    try {
      const result = await fetchFn(...args)
      data.value = result
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const refresh = () => execute()

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    execute,
    refresh
  }
}

// 5. 本地存储
export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const initial = storedValue ? JSON.parse(storedValue) : defaultValue

  const value = ref(initial)

  const setValue = (newValue) => {
    value.value = newValue
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  const removeValue = () => {
    value.value = defaultValue
    localStorage.removeItem(key)
  }

  // 监听存储变化
  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return {
    value,
    setValue,
    removeValue
  }
}
```

```vue
// 6. 在组件中使用（清晰明确）
<script setup>
import { useCounter } from '@/composables/useCounter'
import { useUser } from '@/composables/useUser'
import { useFormValidation } from '@/composables/useFormValidation'

// 明确知道每个功能的来源
const { count, increment, decrement, reset } = useCounter(10)
const { user, loading, error, fetchUser } = useUser()

const validationRules = {
  email: [
    { validator: (v) => !!v, message: '邮箱不能为空' },
    { validator: (v) => /\S+@\S+\.\S+/.test(v), message: '邮箱格式不正确' }
  ]
}

const { errors, validateField } = useFormValidation(validationRules)

// 组合多个逻辑，无命名冲突
onMounted(() => {
  fetchUser(1)
})
</script>
```

```javascript
// 7. 高级组合模式
export function useUserWithCounter(userId) {
  // 组合多个composable
  const userLogic = useUser()
  const counterLogic = useCounter()

  // 添加特定的组合逻辑
  const userActions = computed(() => {
    return counterLogic.count.value
  })

  onMounted(() => {
    userLogic.fetchUser(userId)
  })

  return {
    ...userLogic,
    ...counterLogic,
    userActions
  }
}
```

```TypeScript
// 8. TypeScript支持
interface User {
  id: number
  name: string
  email: string
}

export function useTypedUser() {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUser = async (userId: number): Promise<User> => {
    loading.value = true
    error.value = null

    try {
      const response = await api.getUser(userId)
      user.value = response.data
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    fetchUser
  } as const
}
```

**使用场景对比：**

| 特性 | Mixin | Composition API |
|------|-------|-----------------|
| 逻辑复用 | 通过混入对象 | 通过函数调用 |
| 命名冲突 | 容易发生 | 不会发生 |
| 来源追踪 | 困难 | 清晰明确 |
| TypeScript支持 | 差 | 优秀 |
| 测试 | 困难 | 容易 |
| 树摇优化 | 不支持 | 支持 |

### 记忆要点总结
- **推荐方案**：使用Composition API的组合式函数（use开头）
- **核心优势**：无命名冲突、类型友好、逻辑清晰、易于测试
- **设计原则**：单一职责、明确接口、返回只读状态
- **命名规范**：use开头，描述功能，如useCounter、useUser
- **最佳实践**：组合多个小函数、提供TypeScript支持、考虑错误处理

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

可以继续追问：如何在组件间共享逻辑（composition vs mixin）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
