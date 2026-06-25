# 如何在导航失败（navigation failure）时做错误处理？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察Vue Router的错误处理机制和用户体验优化，面试官想了解你是否掌握导航异常的捕获和处理方法。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

通过 `router.push/replace` 返回的 Promise 捕获错误，或在 `router.afterEach` 守卫中处理导航失败，可以根据失败类型采取不同的处理策略。

### 问题本质解读 这道题考察Vue Router的错误处理机制和用户体验优化，面试官想了解你是否掌握导航异常的捕获和处理方法。

### 知识点系统梳理

**导航失败的类型：**
- **NavigationDuplicated**: 重复导航到相同位置
- **NavigationCancelled**: 导航被取消（如守卫返回false）
- **NavigationAborted**: 导航被中止（如新的导航开始）
- **NavigationFailure**: 其他导航错误

**导航失败的检测方法：**
- router.push/replace 返回的Promise
- router.afterEach 守卫的failure参数
- isNavigationFailure 工具函数

### 实战应用举例
```javascript
import {
  isNavigationFailure,
  NavigationFailureType
} from 'Vue Router'

// 1. 基础导航错误处理
const handleNavigation = async () => {
  try {
    await router.push('/dashboard')
    console.log('导航成功')
  } catch (error) {
    if (isNavigationFailure(error)) {
      console.log('导航失败:', error.type)

      // 根据失败类型处理
      switch (error.type) {
        case NavigationFailureType.duplicated:
          console.log('重复导航，已在目标页面')
          break
        case NavigationFailureType.cancelled:
          console.log('导航被取消')
          break
        case NavigationFailureType.aborted:
          console.log('导航被中止')
          break
        default:
          console.log('未知导航错误')
      }
    } else {
      console.error('其他错误:', error)
    }
  }
}
```

```javascript
// 2. 全局导航错误处理
router.afterEach((to, from, failure) => {
  if (failure) {
    console.log('导航失败:', failure)

    // 错误统计
    analytics.track('navigation_failure', {
      type: failure.type,
      to: to.fullPath,
      from: from.fullPath,
      timestamp: Date.now()
    })

    // 用户提示
    if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
      // 导航被取消，通常是用户主动操作，不需要提示
      return
    }

    if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
      // 重复导航，可以给用户友好提示
      showToast('您已在当前页面', 'info')
      return
    }

    // 其他错误需要处理
    showToast('页面跳转失败，请重试', 'error')
  }
})
```

```javascript
// 3. 高级错误处理策略
class NavigationErrorHandler {
  constructor(router) {
    this.router = router
    this.retryCount = new Map()
    this.maxRetries = 3
    this.setupErrorHandling()
  }

  setupErrorHandling() {
    // 全局后置守卫
    this.router.afterEach((to, from, failure) => {
      if (failure) {
        this.handleNavigationFailure(to, from, failure)
      }
    })
  }

  async handleNavigationFailure(to, from, failure) {
    const failureKey = `${from.fullPath}->${to.fullPath}`

    // 记录失败次数
    const currentRetries = this.retryCount.get(failureKey) || 0

    if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
      // 重复导航处理
      this.handleDuplicatedNavigation(to, from)
    }
    else if (isNavigationFailure(failure, NavigationFailureType.cancelled)) {
      // 导航取消处理
      this.handleCancelledNavigation(to, from, failure)
    }
    else if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      // 导航中止处理
      this.handleAbortedNavigation(to, from, failure)
    }
    else if (currentRetries < this.maxRetries) {
      // 自动重试
      await this.retryNavigation(to, failureKey, currentRetries)
    }
    else {
      // 重试次数超限，降级处理
      this.handleFinalFailure(to, from, failure)
    }
  }

  handleDuplicatedNavigation(to, from) {
    // 清除重试计数
    const failureKey = `${from.fullPath}->${to.fullPath}`
    this.retryCount.delete(failureKey)

    // 用户友好提示
    if (to.fullPath !== from.fullPath) {
      showNotification('您已在目标页面', 'info')
    }
  }

  handleCancelledNavigation(to, from, failure) {
    // 分析取消原因
    if (failure.from && failure.to) {
      console.log('导航被守卫取消:', {
        from: failure.from.fullPath,
        to: failure.to.fullPath,
        reason: failure.reason
      })
    }

    // 可能需要清理状态
    this.cleanupNavigationState()
  }

  handleAbortedNavigation(to, from, failure) {
    // 导航被新的导航中止，通常不需要特殊处理
    console.log('导航被中止，可能有新的导航开始')
  }

  async retryNavigation(to, failureKey, currentRetries) {
    const newRetryCount = currentRetries + 1
    this.retryCount.set(failureKey, newRetryCount)

    console.log(`导航重试 ${newRetryCount}/${this.maxRetries}:`, to.fullPath)

    // 延迟重试
    await new Promise(resolve => setTimeout(resolve, 1000 * newRetryCount))

    try {
      await this.router.push(to)
      // 重试成功，清除计数
      this.retryCount.delete(failureKey)
    } catch (error) {
      console.log('重试失败:', error)
    }
  }

  handleFinalFailure(to, from, failure) {
    console.error('导航最终失败:', failure)

    // 错误上报
    this.reportError(to, from, failure)

    // 降级策略
    this.fallbackNavigation(to, from)
  }

  fallbackNavigation(to, from) {
    // 尝试回到安全页面
    const safePaths = ['/', '/home', '/dashboard']

    for (const path of safePaths) {
      if (path !== from.fullPath && path !== to.fullPath) {
        this.router.replace(path).catch(() => {
          // 如果连安全页面都无法导航，刷新页面
          window.location.href = path
        })
        break
      }
    }
  }

  cleanupNavigationState() {
    // 清理可能的状态
    store.commit('clearNavigationState')

    // 重置加载状态
    loadingStore.setLoading(false)
  }

  reportError(to, from, failure) {
    // 发送错误报告
    fetch('/api/error-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'navigation_failure',
        failure: {
          type: failure.type,
          to: to.fullPath,
          from: from.fullPath
        },
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    }).catch(console.error)
  }
}

// 初始化错误处理器
const errorHandler = new NavigationErrorHandler(router)
```

```vue
<!-- 组件中的导航错误处理 -->
<template>
  <div class="navigation-component">
    <button
      @click="navigateWithErrorHandling('/dashboard')"
      :disabled="isNavigating"
    >
      {{ isNavigating ? '跳转中...' : '前往仪表板' }}
    </button>

    <button
      @click="safeNavigate('/profile')"
      :disabled="isNavigating"
    >
      安全导航到个人资料
    </button>

    <!-- 错误提示 -->
    <div v-if="navigationError" class="error-message">
      {{ navigationError }}
      <button @click="retryLastNavigation">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'Vue Router'
import { isNavigationFailure, NavigationFailureType } from 'Vue Router'

const router = useRouter()
const isNavigating = ref(false)
const navigationError = ref('')
const lastFailedNavigation = ref(null)

// 带错误处理的导航
const navigateWithErrorHandling = async (path) => {
  isNavigating.value = true
  navigationError.value = ''

  try {
    await router.push(path)
    console.log('导航成功')
  } catch (error) {
    handleNavigationError(error, path)
  } finally {
    isNavigating.value = false
  }
}

// 安全导航（带重试机制）
const safeNavigate = async (path, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      isNavigating.value = true
      await router.push(path)
      navigationError.value = ''
      return // 成功则退出
    } catch (error) {
      if (attempt === maxRetries) {
        handleNavigationError(error, path)
      } else {
        console.log(`导航重试 ${attempt}/${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }
  isNavigating.value = false
}

// 处理导航错误
const handleNavigationError = (error, targetPath) => {
  lastFailedNavigation.value = targetPath

  if (isNavigationFailure(error)) {
    switch (error.type) {
      case NavigationFailureType.duplicated:
        navigationError.value = '您已在目标页面'
        break
      case NavigationFailureType.cancelled:
        navigationError.value = '导航被取消'
        break
      case NavigationFailureType.aborted:
        navigationError.value = '导航被中止'
        break
      default:
        navigationError.value = '导航失败，请重试'
    }
  } else {
    navigationError.value = '发生未知错误，请重试'
    console.error('导航错误:', error)
  }
}

// 重试上次失败的导航
const retryLastNavigation = () => {
  if (lastFailedNavigation.value) {
    navigateWithErrorHandling(lastFailedNavigation.value)
  }
}
</script>

<style scoped>
.error-message {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

**使用场景总结：**
- **用户体验优化**: 友好的错误提示和重试机制
- **错误监控**: 收集导航失败数据用于分析
- **降级策略**: 导航失败时的备选方案
- **状态管理**: 清理导航过程中的临时状态
- **性能优化**: 避免无效的重复导航

**最佳实践建议：**
- 区分不同类型的导航失败，采用不同处理策略
- 提供用户友好的错误提示和重试选项
- 实现自动重试机制，但要限制重试次数
- 记录错误信息用于问题分析和优化
- 设计降级方案确保应用可用性

### 记忆要点总结
- 导航失败类型：duplicated、cancelled、aborted
- 检测方法：isNavigationFailure函数
- 处理位置：router.push的catch、afterEach守卫
- 处理策略：重试、降级、用户提示
- 最佳实践：错误分类处理、状态清理、监控上报

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何在导航失败（navigation failure）时做错误处理？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
