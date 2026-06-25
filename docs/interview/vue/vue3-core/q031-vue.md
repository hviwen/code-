# 如何在 Vue 中捕获错误（错误边界）？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue应用的错误处理机制，面试官想了解你是否能构建健壮的、用户友好的应用程序。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案只提到了全局错误处理，缺少组件级别的错误边界
- 没有说明Vue 3与React错误边界的区别和局限性
- 缺少异步错误、Promise异常的处理方式

## 知识点系统梳理

- app.config.errorHandler 注册全局错误处理函数，捕获运行时异常，实现错误边界。
- onErrorCaptured

### 问题本质解读 这道题考察Vue应用的错误处理机制，面试官想了解你是否能构建健壮的、用户友好的应用程序。

### 技术错误纠正
- 原答案只提到了全局错误处理，缺少组件级别的错误边界
- 没有说明Vue 3与React错误边界的区别和局限性
- 缺少异步错误、Promise异常的处理方式

### 知识点系统梳理

**Vue错误处理的层次：**
1. 全局错误处理：`app.config.errorHandler`
2. 组件错误捕获：`onErrorCaptured`生命周期
3. 异步错误处理：Promise、async/await错误捕获
4. 路由错误处理：导航守卫中的异常

### 实战应用举例
```javascript
// 1. 全局错误处理配置
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 全局错误处理器
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误处理:', {
    error: err,
    component: instance?.$options.name || 'Unknown',
    errorInfo: info,
    stack: err.stack
  })

  // 发送错误到监控服务
  sendErrorToService({
    message: err.message,
    stack: err.stack,
    component: instance?.$options.name,
    errorInfo: info,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  })

  // 用户友好的错误提示
  if (process.env.NODE_ENV === 'production') {
    showUserFriendlyError('应用遇到了一个问题，我们正在修复中')
  }
}

// 全局警告处理器（开发环境）
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Vue Warning:', {
    message: msg,
    component: instance?.$options.name,
    trace
  })
}
```

```vue
// 2. 错误边界组件
// ErrorBoundary.vue
<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />
    
    <!-- 错误界面 -->
    <div v-else class="error-display">
      <div class="error-icon">⚠️</div>
      <h3>{{ errorTitle }}</h3>
      <p>{{ errorMessage }}</p>
      
      <!-- 开发环境显示详细信息 -->
      <details v-if="isDev && errorDetails" class="error-details">
        <summary>错误详情</summary>
        <pre>{{ errorDetails }}</pre>
      </details>
      
      <div class="error-actions">
        <button @click="retry" class="retry-btn">
          重试
        </button>
        <button @click="reload" class="reload-btn">
          刷新页面
        </button>
        <button @click="reportError" class="report-btn">
          报告问题
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const props = defineProps({
  fallback: {
    type: String,
    default: '组件加载失败'
  },
  onError: {
    type: Function,
    default: null
  }
})

const hasError = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')
const errorDetails = ref('')
const errorInstance = ref(null)
const isDev = process.env.NODE_ENV === 'development'

// 捕获子组件错误
onErrorCaptured((err, instance, info) => {
  console.error('ErrorBoundary捕获到错误:', {
    error: err,
    instance,
    info
  })

  hasError.value = true
  errorTitle.value = '组件渲染出错'
  errorMessage.value = props.fallback
  errorDetails.value = `${err.message}\n\n${err.stack}`
  errorInstance.value = instance

  // 调用自定义错误处理
  if (props.onError) {
    props.onError(err, instance, info)
  }

  // 阻止错误继续向上传播
  return false
})

const retry = () => {
  hasError.value = false
  errorTitle.value = ''
  errorMessage.value = ''
  errorDetails.value = ''
  errorInstance.value = null
}

const reload = () => {
  window.location.reload()
}

const reportError = () => {
  // 发送错误报告
  const errorReport = {
    title: errorTitle.value,
    message: errorMessage.value,
    details: errorDetails.value,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  }

  console.log('发送错误报告:', errorReport)
  // 实际发送逻辑...
}
</script>

<style scoped>
.error-boundary {
  width: 100%;
  height: 100%;
}

.error-display {
  padding: 2rem;
  text-align: center;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background-color: #fef2f2;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-details {
  margin: 1rem 0;
  text-align: left;
}

.error-details pre {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.error-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn {
  background-color: #3b82f6;
  color: white;
}

.reload-btn {
  background-color: #6b7280;
  color: white;
}

.report-btn {
  background-color: #ef4444;
  color: white;
}
</style>
```

```javascript
// 3. 异步错误处理Hook
// useAsyncError.js
import { ref } from 'vue'

export function useAsyncError() {
  const error = ref(null)
  const loading = ref(false)

  const execute = async (asyncFn) => {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFn()
      return result
    } catch (err) {
      error.value = err
      
      // 发送到全局错误处理
      if (getCurrentInstance()) {
        throw err // 让组件的onErrorCaptured捕获
      } else {
        // 如果不在组件上下文中，直接处理
        console.error('异步操作错误:', err)
      }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    error: readonly(error),
    loading: readonly(loading),
    execute,
    clearError
  }
}

// 使用异步错误处理
export default {
  setup() {
    const { error, loading, execute, clearError } = useAsyncError()

    const fetchData = () => {
      execute(async () => {
        const response = await fetch('/api/data')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json()
      })
    }

    return {
      error,
      loading,
      fetchData,
      clearError
    }
  }
}

// 4. 路由错误处理
// router/index.js
import { createRouter, createWebHistory } from 'Vue Router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ... 路由配置
  ]
})

// 路由错误处理
router.onError((error, to, from) => {
  console.error('路由错误:', {
    error,
    to: to.path,
    from: from.path
  })

  // 处理不同类型的路由错误
  if (error.message.includes('Loading chunk')) {
    // 代码分割加载失败
    window.location.reload()
  } else if (error.message.includes('Module not found')) {
    // 模块未找到，跳转到404页面
    router.push('/404')
  }
})

// 5. 完整的错误监控服务
class ErrorMonitoringService {
  constructor() {
    this.errorQueue = []
    this.isOnline = navigator.onLine
    this.setupEventListeners()
  }

  setupEventListeners() {
    // 监听网络状态
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushErrorQueue()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // 监听未处理的Promise异常
    window.addEventListener('unhandledrejection', (event) => {
      console.error('未处理的Promise异常:', event.reason)
      
      this.captureError({
        type: 'unhandled_promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      })

      // 阻止默认的错误提示
      event.preventDefault()
    })

    // 监听全局JavaScript错误
    window.addEventListener('error', (event) => {
      console.error('全局JavaScript错误:', event.error)
      
      this.captureError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      })
    })
  }

  captureError(errorInfo) {
    const enrichedError = {
      ...errorInfo,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    }

    if (this.isOnline) {
      this.sendError(enrichedError)
    } else {
      this.errorQueue.push(enrichedError)
    }
  }

  async sendError(errorInfo) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorInfo)
      })
    } catch (error) {
      console.error('发送错误信息失败:', error)
      this.errorQueue.push(errorInfo)
    }
  }

  flushErrorQueue() {
    while (this.errorQueue.length > 0) {
      const error = this.errorQueue.shift()
      this.sendError(error)
    }
  }

  getCurrentUserId() {
    // 获取当前用户ID的逻辑
    return localStorage.getItem('userId') || 'anonymous'
  }

  getSessionId() {
    // 获取会话ID的逻辑
    return sessionStorage.getItem('sessionId') || 'no-session'
  }
}

// 初始化错误监控
const errorMonitoring = new ErrorMonitoringService()

// 6. 业务错误处理Hook
export function useErrorHandler() {
  const errors = ref([])
  const hasErrors = computed(() => errors.value.length > 0)

  const addError = (error, context = {}) => {
    const errorItem = {
      id: Date.now() + Math.random(),
      message: error.message || error,
      type: context.type || 'error',
      timestamp: new Date(),
      context
    }

    errors.value.push(errorItem)

    // 自动清除错误（可选）
    if (context.autoRemove !== false) {
      setTimeout(() => {
        removeError(errorItem.id)
      }, context.timeout || 5000)
    }
  }

  const removeError = (id) => {
    const index = errors.value.findIndex(error => error.id === id)
    if (index > -1) {
      errors.value.splice(index, 1)
    }
  }

  const clearAllErrors = () => {
    errors.value = []
  }

  // 处理常见的业务错误
  const handleApiError = (error, operation = 'API请求') => {
    let message = `${operation}失败`
    
    if (error.response?.status === 401) {
      message = '请先登录'
    } else if (error.response?.status === 403) {
      message = '没有权限执行此操作'
    } else if (error.response?.status === 404) {
      message = '请求的资源不存在'
    } else if (error.response?.status >= 500) {
      message = '服务器错误，请稍后重试'
    } else if (error.message?.includes('Network')) {
      message = '网络连接失败'
    }

    addError(message, {
      type: 'api_error',
      status: error.response?.status,
      operation
    })
  }

  const handleFormError = (fieldErrors) => {
    Object.entries(fieldErrors).forEach(([field, error]) => {
      addError(`${field}: ${error}`, {
        type: 'validation_error',
        field
      })
    })
  }

  return {
    errors: readonly(errors),
    hasErrors,
    addError,
    removeError,
    clearAllErrors,
    handleApiError,
    handleFormError
  }
}
```

```vue
// 7. 完整的应用示例
// App.vue
<template>
  <ErrorBoundary
    fallback="应用遇到问题，正在努力修复..."
    @error="handleGlobalError"
  >
    <router-view />
    
    <!-- 全局错误通知 -->
    <ErrorNotifications />
  </ErrorBoundary>
</template>

<script setup>
import { provide } from 'vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import ErrorNotifications from '@/components/ErrorNotifications.vue'
import { useErrorHandler } from '@/composables/useErrorHandler'

const { addError, handleApiError } = useErrorHandler()

// 提供全局错误处理
provide('errorHandler', {
  addError,
  handleApiError
})

const handleGlobalError = (error, instance, info) => {
  console.error('应用级错误:', { error, instance, info })
  
  // 发送到监控服务
  errorMonitoring.captureError({
    type: 'component_error',
    message: error.message,
    component: instance?.$options.name,
    errorInfo: info,
    stack: error.stack
  })
}
</script>

// ErrorNotifications.vue
<template>
  <Teleport to="body">
    <div class="error-notifications" v-if="hasErrors">
      <TransitionGroup name="error-notification" tag="div">
        <div
          v-for="error in errors"
          :key="error.id"
          class="error-notification"
          :class="`error-${error.type}`"
        >
          <div class="error-content">
            <span class="error-message">{{ error.message }}</span>
            <button @click="removeError(error.id)" class="error-close">
              ×
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { inject } from 'vue'

const { errors, hasErrors, removeError } = inject('errorHandler')
</script>
```

**使用场景对比：**
```javascript
const errorHandlingStrategies = {
  全局错误处理: {
    适用: '未被捕获的运行时错误',
    工具: 'app.config.errorHandler',
    特点: '兜底方案，防止应用崩溃'
  },
  
  组件错误边界: {
    适用: '特定组件或功能模块',
    工具: 'onErrorCaptured',
    特点: '局部容错，提供降级UI'
  },
  
  异步错误处理: {
    适用: 'API调用、异步操作',
    工具: 'try-catch + useAsyncError',
    特点: '业务逻辑错误，用户友好提示'
  },
  
  表单验证错误: {
    适用: '用户输入验证',
    工具: '自定义验证 + 错误状态',
    特点: '实时反馈，引导用户修正'
  }
}
```

### 记忆要点总结
- 全局处理：`app.config.errorHandler`捕获未处理异常
- 组件边界：`onErrorCaptured`实现局部错误隔离
- 异步错误：`unhandledrejection`事件捕获Promise异常
- 监控服务：自动收集、上报、分析错误信息
- 用户体验：错误降级、友好提示、重试机制

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

可以继续追问：如何在 Vue 中捕获错误（错误边界）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
