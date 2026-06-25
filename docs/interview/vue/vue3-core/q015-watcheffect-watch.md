# `watchEffect` 与 `watch` 的区别？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3 Composition API中两种不同的响应式监听机制，面试官想了解你是否理解它们的执行时机、依赖收集方式和适用场景的差异。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. "显示监听源"应为"显式监听源"
2. 原答案过于简略，缺少关键的技术细节和使用场景

## 知识点系统梳理

都是vue中作为监听响应式值变化的函数。

watchEffect：自动收集依赖并立即执行副作用
watch：显式监听源，并提供新旧值，用于更精准的副作用控制

### 问题本质解读 这道题考察Vue 3 Composition API中两种不同的响应式监听机制，面试官想了解你是否理解它们的执行时机、依赖收集方式和适用场景的差异。

### 技术错误纠正
1. "显示监听源"应为"显式监听源"
2. 原答案过于简略，缺少关键的技术细节和使用场景

### 知识点系统梳理

**watchEffect特点：**
- 自动依赖收集：函数内部使用的响应式数据会被自动追踪
- 立即执行：组件创建时会立即执行一次
- 无新旧值：回调函数不接收新旧值参数
- 简洁语法：适合简单的副作用操作

**watch特点：**
- 显式依赖声明：需要明确指定监听的数据源
- 惰性执行：默认不会立即执行（除非设置immediate: true）
- 提供新旧值：回调函数接收新值和旧值参数
- 更多配置选项：支持deep、immediate、flush等选项

### 实战应用举例
```javascript
import { ref, reactive, watch, watchEffect, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const user = reactive({ name: 'John', age: 25 })
    const doubleCount = computed(() => count.value * 2)

    // watchEffect - 自动依赖收集
    watchEffect(() => {
      // 自动追踪 count 和 user.name 的变化
      console.log(`Count: ${count.value}, User: ${user.name}`)
      // 当 count 或 user.name 变化时，这个函数会重新执行
    })

    // watch - 显式监听单个源
    watch(count, (newValue, oldValue) => {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    })

    // watch - 监听多个源
    watch([count, () => user.name], ([newCount, newName], [oldCount, oldName]) => {
      console.log('Multiple sources changed:', {
        count: { old: oldCount, new: newCount },
        name: { old: oldName, new: newName }
      })
    })

    // watch - 监听响应式对象
    watch(user, (newUser, oldUser) => {
      console.log('User object changed:', newUser)
    }, { deep: true }) // 需要deep选项来监听对象内部变化

    // watch - 监听计算属性
    watch(doubleCount, (newValue) => {
      console.log('Double count changed:', newValue)
    })

    // 条件性的watchEffect
    const isEnabled = ref(true)
    watchEffect(() => {
      if (isEnabled.value) {
        console.log('Enabled count:', count.value)
      }
      // 当 isEnabled 为 false 时，count 的变化不会触发日志
    })

    // 异步操作示例
    watchEffect(async () => {
      if (user.name) {
        try {
          const userData = await fetchUserData(user.name)
          console.log('User data loaded:', userData)
        } catch (error) {
          console.error('Failed to load user data:', error)
        }
      }
    })

    // 停止监听
    const stopWatching = watchEffect(() => {
      console.log('This will stop after 5 seconds')
    })

    setTimeout(() => {
      stopWatching() // 停止监听
    }, 5000)

    // 清理副作用
    watchEffect((onInvalidate) => {
      const timer = setTimeout(() => {
        console.log('Timer executed')
      }, 1000)

      // 清理函数，在下次执行前或组件卸载时调用
      onInvalidate(() => {
        clearTimeout(timer)
        console.log('Timer cleared')
      })
    })

    return {
      count,
      user,
      doubleCount
    }
  }
}

// 高级用法：自定义监听器
function useDebounceWatch(source, callback, delay = 300) {
  let timer

  watch(source, (newVal, oldVal) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      callback(newVal, oldVal)
    }, delay)
  })
}

// 使用自定义监听器
const searchQuery = ref('')
useDebounceWatch(searchQuery, (newQuery) => {
  console.log('Debounced search:', newQuery)
})
```

**使用场景对比：**

| 场景 | 推荐使用 | 原因 |
|------|----------|------|
| 简单的响应式日志记录 | watchEffect | 自动依赖收集，代码简洁 |
| 需要新旧值对比 | watch | 提供新旧值参数 |
| 监听特定数据源 | watch | 明确的监听目标，性能更好 |
| 复杂的依赖关系 | watchEffect | 自动处理复杂依赖 |
| 需要配置选项（deep、immediate） | watch | 更多配置选项 |
| API调用和副作用 | watchEffect | 自然的响应式编程模式 |

**性能考虑：**
```javascript
// ❌ 避免在watchEffect中进行昂贵操作
watchEffect(() => {
  // 每次count变化都会执行昂贵计算
  const result = expensiveCalculation(count.value)
  console.log(result)
})

// ✅ 使用computed缓存昂贵计算
const expensiveResult = computed(() => expensiveCalculation(count.value))
watchEffect(() => {
  console.log(expensiveResult.value) // 只有结果变化时才执行
})

// ✅ 使用watch进行精确控制
watch(count, (newCount) => {
  if (newCount > 10) { // 条件执行
    performExpensiveOperation(newCount)
  }
})
```

### 记忆要点总结
- **watchEffect**：自动依赖 + 立即执行 + 无新旧值 + 简洁语法
- **watch**：显式依赖 + 惰性执行 + 有新旧值 + 更多选项
- **选择原则**：简单副作用用watchEffect，需要精确控制用watch
- **性能优化**：避免在监听器中进行昂贵操作，善用computed缓存

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

可以继续追问：`watchEffect` 与 `watch` 的区别？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
