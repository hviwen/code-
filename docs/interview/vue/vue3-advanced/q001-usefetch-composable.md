# 如何实现一个可复用的 `useFetch` composable？要考虑哪些边界情况？

> 来源：`docs/vue/vue_3_part_2_answer.md`

## 问题本质解读

这道题考察组合式API的实际应用和边界情况处理，面试官想了解你是否能设计出健壮的可复用逻辑。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案中缺少请求取消、重试、缓存等重要功能
- 没有考虑组件卸载时的清理工作
- 缺少响应式URL支持和类型安全
- 错误处理过于简单，没有区分不同类型的错误

## 知识点系统梳理

可以通过结合使用pinia的状态管理和useFetch逻辑复用实现

要考虑：

1. 加载状态
2. 请求结构 （mothod header json/form）
3. 数据返回 （数据转化 加工 过滤）
4. 错误处理（超时 异常 权限 ）
5. 缓存（重复请求，相同结构返回）

```javascript
export const useFetch = (url='',options={}){
  const data = ref(null)
  const isloading = ref(true)
  const error = ref(null)

  const getInfo = async () =>{
    try{
      const response = await fetch(url,options)
      if(!response.ok){
        throw new Error('Network response was not ok')
      }
      data.value = await response.json()

    }catch(err){
      error.value = err;
    }finally{
    	isloading.value = false;
    }
  }
  getInfo()

  return {
    data,
    isloading,
    error
  }
}
```

### 问题本质解读 这道题考察组合式API的实际应用和边界情况处理，面试官想了解你是否能设计出健壮的可复用逻辑。

### 技术错误纠正
- 原答案中缺少请求取消、重试、缓存等重要功能
- 没有考虑组件卸载时的清理工作
- 缺少响应式URL支持和类型安全
- 错误处理过于简单，没有区分不同类型的错误

### 知识点系统梳理

**useFetch核心功能：**
- **状态管理**：loading、error、data状态的响应式管理
- **请求控制**：支持取消、重试、超时等控制机制
- **缓存策略**：避免重复请求，提升性能
- **数据转换**：支持响应数据的预处理和转换
- **错误处理**：完善的错误分类和处理机制

**边界情况处理：**
- **组件卸载**：自动取消进行中的请求
- **并发请求**：处理快速连续的请求
- **网络异常**：超时、断网、服务器错误等
- **数据格式**：支持JSON、文本、二进制等多种格式

### 实战应用举例
```TypeScript
import { ref, unref, computed, watchEffect, onScopeDispose } from 'vue'

interface UseFetchOptions<T = any> {
  immediate?: boolean
  timeout?: number
  retry?: number
  retryDelay?: number
  cache?: boolean
  transform?: (data: any) => T
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
  headers?: Record<string, string>
  method?: string
  body?: any
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  isFinished: Ref<boolean>
  execute: (url?: string, options?: RequestInit) => Promise<T | undefined>
  cancel: () => void
  refresh: () => Promise<T | undefined>
  clearCache: () => void
}

export function useFetch<T = any>(
  url: MaybeRef<string>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const {
    immediate = true,
    timeout = 10000,
    retry = 3,
    retryDelay = 1000,
    cache = true,
    transform = (data) => data,
    onError = () => {},
    onSuccess = () => {},
    headers = {},
    method = 'GET',
    body
  } = options

  // 响应式状态
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  const isFinished = ref(false)
  const abortController = ref<AbortController | null>(null)

  // 缓存管理
  const cache = new Map<string, { data: T; timestamp: number }>()
  const CACHE_TTL = 5 * 60 * 1000 // 5分钟

  // 生成缓存key
  const getCacheKey = (url: string, options: RequestInit) => {
    return JSON.stringify({ url, method: options.method, body: options.body })
  }

  // 检查缓存是否有效
  const isCacheValid = (timestamp: number) => {
    return Date.now() - timestamp < CACHE_TTL
  }

  // 执行请求
  const execute = async (
    executeUrl: string = unref(url),
    executeOptions: RequestInit = {}
  ): Promise<T | undefined> => {
    const resolvedUrl = unref(executeUrl)
    if (!resolvedUrl) {
      throw new Error('URL is required')
    }

    const requestOptions: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body ? JSON.stringify(body) : undefined,
      ...executeOptions
    }

    const cacheKey = getCacheKey(resolvedUrl, requestOptions)

    // 检查缓存
    if (cache && method === 'GET') {
      const cached = cache.get(cacheKey)
      if (cached && isCacheValid(cached.timestamp)) {
        data.value = cached.data
        isLoading.value = false
        isFinished.value = true
        onSuccess(cached.data)
        return cached.data
      }
    }

    // 取消之前的请求
    if (abortController.value) {
      abortController.value.abort()
    }

    abortController.value = new AbortController()
    isLoading.value = true
    error.value = null
    isFinished.value = false

    let retryCount = 0

    const attemptFetch = async (): Promise<T | undefined> => {
      try {
        const response = await Promise.race([
          fetch(resolvedUrl, {
            ...requestOptions,
            signal: abortController.value!.signal
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ])

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        // 根据Content-Type处理响应
        const contentType = response.headers.get('content-type')
        let result: any

        if (contentType?.includes('application/json')) {
          result = await response.json()
        } else if (contentType?.includes('text/')) {
          result = await response.text()
        } else {
          result = await response.blob()
        }

        // 数据转换
        const transformedData = transform(result)
        data.value = transformedData

        // 缓存结果（仅GET请求）
        if (cache && method === 'GET') {
          cache.set(cacheKey, {
            data: transformedData,
            timestamp: Date.now()
          })
        }

        onSuccess(transformedData)
        return transformedData

      } catch (err) {
        const error = err as Error

        if (error.name === 'AbortError') {
          return undefined
        }

        // 重试逻辑
        if (retryCount < retry && shouldRetry(error)) {
          retryCount++
          console.log(`Retrying request (${retryCount}/${retry})...`)
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount))
          return attemptFetch()
        }

        error.value = error
        onError(error)
        throw error
      } finally {
        isLoading.value = false
        isFinished.value = true
      }
    }

    return attemptFetch()
  }

  // 判断是否应该重试
  const shouldRetry = (error: Error): boolean => {
    // 网络错误或5xx服务器错误可以重试
    return error.message.includes('fetch') ||
           error.message.includes('timeout') ||
           error.message.includes('HTTP 5')
  }

  // 取消请求
  const cancel = () => {
    if (abortController.value) {
      abortController.value.abort()
    }
  }

  // 重新请求
  const refresh = () => execute()

  // 清除缓存
  const clearCache = () => {
    cache.clear()
  }

  // 响应式URL监听
  if (immediate) {
    watchEffect(() => {
      const resolvedUrl = unref(url)
      if (resolvedUrl) {
        execute(resolvedUrl)
      }
    })
  }

  // 组件卸载时清理
  onScopeDispose(() => {
    cancel()
  })

  return {
    data: readonly(data),
    error: readonly(error),
    isLoading: readonly(isLoading),
    isFinished: readonly(isFinished),
    execute,
    cancel,
    refresh,
    clearCache
  }
}

// 使用示例
export default {
  setup() {
    // 基本用法
    const { data: users, error, isLoading } = useFetch<User[]>('/api/users')

    // 带参数的请求
    const userId = ref(1)
    const { data: user } = useFetch(
      computed(() => `/api/users/${userId.value}`),
      {
        transform: (data: any) => ({
          ...data,
          fullName: `${data.firstName} ${data.lastName}`
        }),
        onError: (error) => {
          console.error('Failed to fetch user:', error)
        }
      }
    )

    // 手动触发
    const { execute: searchUsers, data: searchResults } = useFetch<User[]>('/api/search', {
      immediate: false,
      method: 'POST'
    })

    const handleSearch = async (query: string) => {
      try {
        await searchUsers('/api/search', {
          body: JSON.stringify({ query })
        })
      } catch (error) {
        console.error('Search failed:', error)
      }
    }

    return {
      users,
      user,
      searchResults,
      error,
      isLoading,
      handleSearch
    }
  }
}
```

**使用场景对比：**

| 场景 | 配置建议 | 说明 |
|------|---------|------|
| **数据列表** | `immediate: true, cache: true` | 自动加载，启用缓存 |
| **用户搜索** | `immediate: false, retry: 1` | 手动触发，减少重试 |
| **文件上传** | `timeout: 30000, cache: false` | 长超时，禁用缓存 |
| **实时数据** | `cache: false, retry: 0` | 禁用缓存和重试 |

### 记忆要点总结
- **核心功能**：状态管理、请求控制、缓存策略、数据转换
- **边界处理**：取消、重试、超时、缓存、错误分类
- **响应式支持**：动态URL、参数变化自动重新请求
- **清理机制**：组件卸载时自动取消请求，防止内存泄漏
- **类型安全**：完整的TypeScript类型定义
- **最佳实践**：合理的默认配置，灵活的选项定制
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

可以继续追问：如何实现一个可复用的 `useFetch` composable？要考虑哪些边界情况？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
