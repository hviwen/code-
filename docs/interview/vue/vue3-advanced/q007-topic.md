# 如何实现一个带取消功能的异步操作（例如按键触发的请求）？

> 来源：`docs/vue/vue_3_part_2_answer.md`

## 问题本质解读

这道题考察异步操作的取消机制，面试官想了解你是否能处理竞态条件和资源清理问题。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. "AbortCtrollor"应为"AbortController"
2. 缺少具体的实现代码和使用场景

## 知识点系统梳理

可以实现一个异步调用的组合函数，在其中使用 AbortController，可以根据不同的情况来出发请求终止

### 问题本质解读 这道题考察异步操作的取消机制，面试官想了解你是否能处理竞态条件和资源清理问题。

### 技术错误纠正
1. "AbortCtrollor"应为"AbortController"
2. 缺少具体的实现代码和使用场景

### 实战应用举例
```javascript
// 1. 基础的可取消请求Hook
export function useCancelableRequest() {
  const abortController = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const execute = async (requestFn) => {
    // 取消之前的请求
    if (abortController.value) {
      abortController.value.abort()
    }

    abortController.value = new AbortController()
    loading.value = true
    error.value = null

    try {
      const result = await requestFn(abortController.value.signal)
      data.value = result
      return result
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err
        throw err
      }
    } finally {
      loading.value = false
    }
  }

  const cancel = () => {
    if (abortController.value) {
      abortController.value.abort()
    }
  }

  // 组件卸载时自动取消
  onUnmounted(() => {
    cancel()
  })

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    execute,
    cancel
  }
}

// 2. 搜索防抖 + 请求取消
export function useSearch(searchFn, delay = 300) {
  const query = ref('')
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)

  let abortController = null
  let timeoutId = null

  const search = async (searchQuery) => {
    // 取消之前的请求
    if (abortController) {
      abortController.abort()
    }

    if (!searchQuery.trim()) {
      results.value = []
      return
    }

    abortController = new AbortController()
    loading.value = true
    error.value = null

    try {
      const data = await searchFn(searchQuery, abortController.signal)
      results.value = data
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err
        console.error('Search error:', err)
      }
    } finally {
      loading.value = false
    }
  }

  // 防抖搜索
  const debouncedSearch = (searchQuery) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      search(searchQuery)
    }, delay)
  }

  // 监听查询变化
  watch(query, (newQuery) => {
    debouncedSearch(newQuery)
  })

  // 清理函数
  const cleanup = () => {
    if (abortController) {
      abortController.abort()
    }
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  onUnmounted(cleanup)

  return {
    query,
    results: readonly(results),
    loading: readonly(loading),
    error: readonly(error),
    search,
    cleanup
  }
}

// 3. 按键触发的搜索组件
const SearchComponent = {
  setup() {
    const searchInput = ref('')

    // 使用可取消的搜索
    const {
      query,
      results,
      loading,
      error
    } = useSearch(async (q, signal) => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return response.json()
    }, 500)

    // 绑定输入框
    watch(searchInput, (newValue) => {
      query.value = newValue
    })

    return {
      searchInput,
      results,
      loading,
      error
    }
  }
}

// 4. 通用的异步任务管理器
export class AsyncTaskManager {
  constructor() {
    this.tasks = new Map()
  }

  async execute(taskId, asyncFn, options = {}) {
    // 取消同ID的之前任务
    this.cancel(taskId)

    const abortController = new AbortController()
    const { timeout = 10000 } = options

    // 设置超时
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, timeout)

    this.tasks.set(taskId, {
      abortController,
      timeoutId
    })

    try {
      const result = await asyncFn(abortController.signal)
      return result
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Task ${taskId} was cancelled`)
      } else {
        throw error
      }
    } finally {
      clearTimeout(timeoutId)
      this.tasks.delete(taskId)
    }
  }

  cancel(taskId) {
    const task = this.tasks.get(taskId)
    if (task) {
      task.abortController.abort()
      clearTimeout(task.timeoutId)
      this.tasks.delete(taskId)
    }
  }

  cancelAll() {
    for (const [taskId] of this.tasks) {
      this.cancel(taskId)
    }
  }
}

// 使用示例
const taskManager = new AsyncTaskManager()

// 搜索任务
const handleSearch = async (query) => {
  try {
    const results = await taskManager.execute('search', async (signal) => {
      const response = await fetch(`/api/search?q=${query}`, { signal })
      return response.json()
    })

    console.log('Search results:', results)
  } catch (error) {
    console.error('Search failed:', error)
  }
}

// 数据加载任务
const loadUserData = async (userId) => {
  try {
    const userData = await taskManager.execute(`user-${userId}`, async (signal) => {
      const response = await fetch(`/api/users/${userId}`, { signal })
      return response.json()
    }, { timeout: 5000 })

    console.log('User data:', userData)
  } catch (error) {
    console.error('Failed to load user:', error)
  }
}
```

### 记忆要点总结
- 核心：AbortController + signal参数
- 场景：搜索防抖、数据加载、文件上传
- 关键点：取消前一个请求、组件卸载时清理、错误处理
- 最佳实践：结合防抖、超时控制、任务管理器

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

可以继续追问：如何实现一个带取消功能的异步操作（例如按键触发的请求）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
