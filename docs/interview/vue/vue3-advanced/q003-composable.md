# 如何实现防抖/节流的 composable？要注意依赖问题吗？

> 来源：`docs/vue/vue_3_part_2_answer.md`

## 问题本质解读

这道题考察组合式API的实际应用和性能优化技巧，面试官想了解你是否能处理函数依赖和内存泄漏问题。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案被划掉说明认识到了错误，但缺少正确的实现
- 需要考虑闭包依赖、内存泄漏、this绑定等问题
- 应该提供完整的防抖和节流实现

## 知识点系统梳理

~~组合函数实现逻辑复用，可以在组合函数内部函数调用上使用节流和防抖，实现调用优化。~~

### 问题本质解读 这道题考察组合式API的实际应用和性能优化技巧，面试官想了解你是否能处理函数依赖和内存泄漏问题。

### 技术错误纠正
- 原答案被划掉说明认识到了错误，但缺少正确的实现
- 需要考虑闭包依赖、内存泄漏、this绑定等问题
- 应该提供完整的防抖和节流实现

### 知识点系统梳理

**防抖与节流的区别：**
- **防抖（Debounce）**：延迟执行，重复调用会重置定时器
- **节流（Throttle）**：限制执行频率，固定时间间隔内只执行一次
- **应用场景**：搜索输入用防抖，滚动事件用节流

**依赖问题处理：**
- **闭包依赖**：确保函数能访问到最新的响应式数据
- **内存泄漏**：组件卸载时清理定时器
- **this绑定**：保持正确的执行上下文

### 实战应用举例

**防抖（Debounce）实现：**

```javascript
import { ref, unref, onUnmounted } from 'vue'

export function useDebounce(fn, delay = 300, options = {}) {
  const { immediate = false, maxWait } = options

  let timeoutId = null
  let maxTimeoutId = null
  let lastCallTime = 0

  const debounced = (...args) => {
    const currentTime = Date.now()

    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 立即执行逻辑
    if (immediate && !timeoutId) {
      fn.apply(this, args)
      lastCallTime = currentTime
    }

    // 设置防抖定时器
    timeoutId = setTimeout(() => {
      if (!immediate) {
        fn.apply(this, args)
      }
      timeoutId = null
      maxTimeoutId = null
      lastCallTime = currentTime
    }, delay)

    // 最大等待时间处理
    if (maxWait && !maxTimeoutId) {
      maxTimeoutId = setTimeout(() => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          fn.apply(this, args)
          timeoutId = null
          maxTimeoutId = null
          lastCallTime = currentTime
        }
      }, maxWait)
    }
  }

  // 取消防抖
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId)
      maxTimeoutId = null
    }
  }

  // 立即执行
  debounced.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      fn.apply(this, arguments)
      timeoutId = null
      maxTimeoutId = null
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    debounced.cancel()
  })

  return debounced
}

// 节流（Throttle）实现
export function useThrottle(fn, delay = 300, options = {}) {
  const { leading = true, trailing = true } = options

  let lastExecTime = 0
  let timeoutId = null
  let lastArgs = null

  const throttled = (...args) => {
    const currentTime = Date.now()
    lastArgs = args

    // 首次执行
    if (leading && currentTime - lastExecTime >= delay) {
      fn.apply(this, args)
      lastExecTime = currentTime
      return
    }

    // 设置尾部执行
    if (trailing && !timeoutId) {
      timeoutId = setTimeout(() => {
        if (currentTime - lastExecTime >= delay) {
          fn.apply(this, lastArgs)
          lastExecTime = Date.now()
        }
        timeoutId = null
      }, delay - (currentTime - lastExecTime))
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastExecTime = 0
  }

  onUnmounted(() => {
    throttled.cancel()
  })

  return throttled
}
```

**响应式防抖/节流：**

```javascript
// 响应式防抖
export function useDebouncedRef(value, delay = 300) {
  const debouncedValue = ref(unref(value))

  const updateValue = useDebounce((newValue) => {
    debouncedValue.value = newValue
  }, delay)

  watchEffect(() => {
    updateValue(unref(value))
  })

  return debouncedValue
}

// 使用示例
export default {
  setup() {
    const searchQuery = ref('')
    const debouncedQuery = useDebouncedRef(searchQuery, 500)

    // 搜索函数
    const search = useDebounce(async (query) => {
      if (!query) return
      const results = await searchAPI(query)
      // 处理搜索结果
    }, 300)

    // 监听防抖后的查询
    watch(debouncedQuery, (newQuery) => {
      search(newQuery)
    })

    return {
      searchQuery,
      debouncedQuery
    }
  }
}
```

```javascript
import { ref, unref, onUnmounted, getCurrentScope, onScopeDispose } from 'vue'

// 防抖实现
export function useDebounce(fn, delay = 300, options = {}) {
  const { immediate = false, maxWait } = options

  let timeoutId = null
  let maxTimeoutId = null
  let lastCallTime = 0
  let lastInvokeTime = 0

  const debounced = function(...args) {
    const currentTime = Date.now()
    const timeSinceLastCall = currentTime - lastCallTime
    const timeSinceLastInvoke = currentTime - lastInvokeTime

    lastCallTime = currentTime

    // 清除之前的定时器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 立即执行逻辑
    if (immediate && timeSinceLastInvoke >= delay) {
      lastInvokeTime = currentTime
      return fn.apply(this, args)
    }

    // 设置防抖定时器
    timeoutId = setTimeout(() => {
      lastInvokeTime = Date.now()
      timeoutId = null
      maxTimeoutId = null

      if (!immediate) {
        return fn.apply(this, args)
      }
    }, delay)

    // 最大等待时间处理
    if (maxWait && !maxTimeoutId && timeSinceLastInvoke >= maxWait) {
      maxTimeoutId = setTimeout(() => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        lastInvokeTime = Date.now()
        maxTimeoutId = null
        return fn.apply(this, args)
      }, maxWait - timeSinceLastInvoke)
    }
  }

  // 取消防抖
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId)
      maxTimeoutId = null
    }
    lastCallTime = 0
    lastInvokeTime = 0
  }

  // 立即执行
  debounced.flush = function() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      lastInvokeTime = Date.now()
      timeoutId = null
      maxTimeoutId = null
      return fn.apply(this, arguments)
    }
  }

  // 检查是否有待执行的调用
  debounced.pending = () => {
    return timeoutId !== null
  }

  // 组件卸载时自动清理
  if (getCurrentScope()) {
    onScopeDispose(() => {
      debounced.cancel()
    })
  }

  return debounced
}

// 节流实现
export function useThrottle(fn, delay = 300, options = {}) {
  const { leading = true, trailing = true } = options

  let lastExecTime = 0
  let timeoutId = null
  let lastArgs = null
  let lastThis = null

  const throttled = function(...args) {
    const currentTime = Date.now()
    lastArgs = args
    lastThis = this

    // 首次执行或达到执行间隔
    if (leading && (currentTime - lastExecTime >= delay)) {
      lastExecTime = currentTime
      return fn.apply(this, args)
    }

    // 设置尾部执行
    if (trailing && !timeoutId) {
      const remainingTime = delay - (currentTime - lastExecTime)

      timeoutId = setTimeout(() => {
        lastExecTime = Date.now()
        timeoutId = null

        if (trailing) {
          return fn.apply(lastThis, lastArgs)
        }
      }, remainingTime)
    }
  }

  // 取消节流
  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    lastExecTime = 0
    lastArgs = null
    lastThis = null
  }

  // 立即执行
  throttled.flush = function() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      lastExecTime = Date.now()
      timeoutId = null
      return fn.apply(lastThis, lastArgs)
    }
  }

  // 组件卸载时自动清理
  if (getCurrentScope()) {
    onScopeDispose(() => {
      throttled.cancel()
    })
  }

  return throttled
}

// 响应式防抖
export function useDebouncedRef(value, delay = 300) {
  const debouncedValue = ref(unref(value))

  const updateValue = useDebounce((newValue) => {
    debouncedValue.value = newValue
  }, delay)

  watchEffect(() => {
    updateValue(unref(value))
  })

  return debouncedValue
}

// 响应式节流
export function useThrottledRef(value, delay = 300) {
  const throttledValue = ref(unref(value))

  const updateValue = useThrottle((newValue) => {
    throttledValue.value = newValue
  }, delay)

  watchEffect(() => {
    updateValue(unref(value))
  })

  return throttledValue
}

// 高级防抖Hook - 支持异步函数
export function useAsyncDebounce(asyncFn, delay = 300) {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  let currentPromise = null

  const debouncedFn = useDebounce(async (...args) => {
    loading.value = true
    error.value = null

    try {
      // 取消之前的请求
      if (currentPromise && currentPromise.cancel) {
        currentPromise.cancel()
      }

      const promise = asyncFn(...args)
      currentPromise = promise

      const result = await promise
      data.value = result
      return result
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err
        throw err
      }
    } finally {
      loading.value = false
      currentPromise = null
    }
  }, delay)

  return {
    execute: debouncedFn,
    cancel: debouncedFn.cancel,
    flush: debouncedFn.flush,
    pending: debouncedFn.pending,
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data)
  }
}
```

**使用示例：**
```javascript
// 搜索组件示例
export default {
  setup() {
    const searchQuery = ref('')
    const searchResults = ref([])
    const loading = ref(false)

    // 防抖搜索
    const debouncedSearch = useDebounce(async (query) => {
      if (!query.trim()) {
        searchResults.value = []
        return
      }

      loading.value = true
      try {
        const results = await searchAPI(query)
        searchResults.value = results
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        loading.value = false
      }
    }, 500)

    // 监听搜索查询变化
    watch(searchQuery, (newQuery) => {
      debouncedSearch(newQuery)
    })

    // 滚动加载更多
    const loadMore = useThrottle(async () => {
      if (loading.value) return

      loading.value = true
      try {
        const moreResults = await loadMoreAPI()
        searchResults.value.push(...moreResults)
      } finally {
        loading.value = false
      }
    }, 1000)

    return {
      searchQuery,
      searchResults,
      loading,
      loadMore
    }
  }
}

// 表单验证示例
export default {
  setup() {
    const formData = reactive({
      email: '',
      username: '',
      password: ''
    })

    const errors = reactive({})

    // 防抖验证
    const validateEmail = useDebounce(async (email) => {
      if (!email) {
        errors.email = ''
        return
      }

      try {
        const isValid = await validateEmailAPI(email)
        errors.email = isValid ? '' : '邮箱已被使用'
      } catch (error) {
        errors.email = '验证失败，请重试'
      }
    }, 800)

    const validateUsername = useDebounce(async (username) => {
      if (!username) {
        errors.username = ''
        return
      }

      try {
        const isAvailable = await checkUsernameAPI(username)
        errors.username = isAvailable ? '' : '用户名已被占用'
      } catch (error) {
        errors.username = '验证失败，请重试'
      }
    }, 600)

    // 监听表单字段变化
    watch(() => formData.email, validateEmail)
    watch(() => formData.username, validateUsername)

    return {
      formData,
      errors
    }
  }
}

// 滚动事件处理示例
export default {
  setup() {
    const scrollY = ref(0)
    const isScrollingDown = ref(false)
    const showBackToTop = ref(false)

    // 节流处理滚动事件
    const handleScroll = useThrottle(() => {
      const currentScrollY = window.scrollY
      isScrollingDown.value = currentScrollY > scrollY.value
      scrollY.value = currentScrollY
      showBackToTop.value = currentScrollY > 300
    }, 100)

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      handleScroll.cancel() // 清理定时器
    })

    return {
      scrollY: readonly(scrollY),
      isScrollingDown: readonly(isScrollingDown),
      showBackToTop: readonly(showBackToTop)
    }
  }
}
```

**依赖问题解决方案：**
```javascript
// 1. 闭包依赖问题
export function useSmartDebounce(fn, delay = 300) {
  const fnRef = ref(fn)

  // 更新函数引用
  watchEffect(() => {
    fnRef.value = fn
  })

  const debouncedFn = useDebounce((...args) => {
    // 总是调用最新的函数
    return fnRef.value(...args)
  }, delay)

  return debouncedFn
}

// 2. 响应式依赖处理
export function useReactiveDebounce(getter, delay = 300) {
  const result = ref()

  const debouncedUpdate = useDebounce(() => {
    result.value = getter()
  }, delay)

  watchEffect(() => {
    debouncedUpdate()
  })

  return readonly(result)
}

// 3. 内存泄漏防护
export function useSafeDebounce(fn, delay = 300) {
  const isActive = ref(true)

  const safeFn = (...args) => {
    if (isActive.value) {
      return fn(...args)
    }
  }

  const debouncedFn = useDebounce(safeFn, delay)

  onUnmounted(() => {
    isActive.value = false
    debouncedFn.cancel()
  })

  return debouncedFn
}
```

### 记忆要点总结
- **防抖**：延迟执行，重复调用会重置定时器
- **节流**：限制执行频率，固定时间间隔内只执行一次
- **依赖问题**：闭包更新、内存清理、上下文绑定
- **响应式支持**：结合watch实现响应式防抖/节流
- **异步处理**：支持异步函数的防抖和取消机制
- **最佳实践**：组件卸载时自动清理，提供cancel和flush方法

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

可以继续追问：如何实现防抖/节流的 composable？要注意依赖问题吗？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
