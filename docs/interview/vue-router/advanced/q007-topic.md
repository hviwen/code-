# 路由重定向和导航守卫中如何传递原始目标（用于登录后回跳）？

> 来源：`docs/vue-router/vue_router_part_2_answer.md`

## 问题本质解读

这道题考察用户认证流程中的路由状态管理，面试官想了解你是否掌握如何在保证安全性的前提下提供良好的用户体验。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 不建议将敏感信息存储在 meta 中，应该使用更安全的方式
- 需要对重定向路径进行安全性验证，防止开放重定向攻击
- 应该包含数据过期和清理机制

## 知识点系统梳理

通过 query 参数或 sessionStorage 存储原始目标路径，在登录成功后读取并跳转到目标页面，需要注意安全性验证和数据清理。

### 问题本质解读 这道题考察用户认证流程中的路由状态管理，面试官想了解你是否掌握如何在保证安全性的前提下提供良好的用户体验。

### 技术错误纠正

- 不建议将敏感信息存储在 meta 中，应该使用更安全的方式
- 需要对重定向路径进行安全性验证，防止开放重定向攻击
- 应该包含数据过期和清理机制

### 知识点系统梳理

**重定向信息传递方式：**

- Query 参数：简单直接，但有长度限制和安全考虑
- SessionStorage：支持复杂数据，会话级别存储
- LocalStorage：持久化存储，需要手动清理
- 状态管理：集中管理，便于复杂场景处理

**安全性考虑：**

- 防止开放重定向攻击
- 验证重定向路径的合法性
- 设置合理的过期时间
- 清理敏感信息

**改进版本：**

在路由重定向和导航守卫中传递原始目标路径，实现登录后回跳功能有多种实现方式：

```javascript
// 1. 通过 query 参数传递原始目标
router.beforeEach((to, from, next) => {
  const token = getToken()

  if (to.meta.requiresAuth && !token) {
    // 将原始目标路径作为 query 参数传递
    next({
      path: '/login',
      query: {
        redirect: to.fullPath,
        // 可以传递额外的上下文信息
        from: from.fullPath
      }
    })
  } else {
    next()
  }
})

// 2. 登录组件中处理回跳
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },

  methods: {
    async handleLogin() {
      try {
        await this.login(this.username, this.password)

        // 获取原始目标路径
        const redirect = this.$route.query.redirect || '/'

        // 验证重定向路径的安全性
        const safeRedirect = this.validateRedirectPath(redirect)

        // 跳转到原始目标或默认页面
        this.$router.push(safeRedirect)
      } catch (error) {
        this.handleLoginError(error)
      }
    },

    // 验证重定向路径安全性
    validateRedirectPath(path) {
      // 防止开放重定向攻击
      if (!path || path.startsWith('http') || path.startsWith('//')) {
        return '/'
      }

      // 检查路径是否在允许的路由中
      const allowedPaths = this.$router.getRoutes().map(route => route.path)
      const pathWithoutQuery = path.split('?')[0]

      if (allowedPaths.some(allowedPath => {
        // 支持动态路由匹配
        const regex = new RegExp('^' + allowedPath.replace(/:\w+/g, '[^/]+') + '$')
        return regex.test(pathWithoutQuery)
      })) {
        return path
      }

      return '/'
    }
  }
}

// 3. 使用 sessionStorage 存储复杂的重定向信息
class RedirectManager {
  constructor() {
    this.storageKey = 'vue_router_redirect'
  }

  // 保存重定向信息
  saveRedirect(to, from, context = {}) {
    const redirectInfo = {
      to: {
        path: to.path,
        fullPath: to.fullPath,
        params: to.params,
        query: to.query,
        meta: to.meta
      },
      from: {
        path: from.path,
        fullPath: from.fullPath
      },
      context,
      timestamp: Date.now()
    }

    sessionStorage.setItem(this.storageKey, JSON.stringify(redirectInfo))
  }

  // 获取重定向信息
  getRedirect() {
    try {
      const stored = sessionStorage.getItem(this.storageKey)
      if (!stored) return null

      const redirectInfo = JSON.parse(stored)

      // 检查是否过期（30分钟）
      if (Date.now() - redirectInfo.timestamp > 30 * 60 * 1000) {
        this.clearRedirect()
        return null
      }

      return redirectInfo
    } catch (error) {
      console.error('获取重定向信息失败:', error)
      this.clearRedirect()
      return null
    }
  }

  // 清除重定向信息
  clearRedirect() {
    sessionStorage.removeItem(this.storageKey)
  }

  // 执行重定向
  executeRedirect(router, fallback = '/') {
    const redirectInfo = this.getRedirect()

    if (redirectInfo && redirectInfo.to) {
      this.clearRedirect()

      // 重建路由对象
      const targetRoute = {
        path: redirectInfo.to.path,
        query: redirectInfo.to.query,
        params: redirectInfo.to.params
      }

      return router.push(targetRoute)
    }

    return router.push(fallback)
  }
}

// 全局实例
const redirectManager = new RedirectManager()

// 4. 在路由守卫中使用 RedirectManager
router.beforeEach((to, from, next) => {
  const token = getToken()

  if (to.meta.requiresAuth && !token) {
    // 保存完整的重定向信息
    redirectManager.saveRedirect(to, from, {
      reason: 'authentication_required',
      userAgent: navigator.userAgent
    })

    next('/login')
  } else {
    next()
  }
})

// 5. 登录成功后的处理
export default {
  name: 'Login',
  methods: {
    async handleLogin() {
      try {
        const result = await this.login(this.username, this.password)

        // 执行重定向
        await redirectManager.executeRedirect(this.$router, '/dashboard')

        // 显示成功消息
        this.$message.success('登录成功')
      } catch (error) {
        this.handleLoginError(error)
      }
    }
  }
}

// 6. 高级场景：多步骤流程中的重定向
class MultiStepRedirectManager extends RedirectManager {
  constructor() {
    super()
    this.stepStorageKey = 'vue_router_multi_step'
  }

  // 保存多步骤流程信息
  saveMultiStepFlow(steps, currentStep = 0, originalTarget = null) {
    const flowInfo = {
      steps,
      currentStep,
      originalTarget,
      timestamp: Date.now()
    }

    sessionStorage.setItem(this.stepStorageKey, JSON.stringify(flowInfo))
  }

  // 获取当前步骤
  getCurrentStep() {
    try {
      const stored = sessionStorage.getItem(this.stepStorageKey)
      if (!stored) return null

      return JSON.parse(stored)
    } catch (error) {
      return null
    }
  }

  // 进入下一步
  nextStep(router) {
    const flowInfo = this.getCurrentStep()
    if (!flowInfo) return false

    const nextStepIndex = flowInfo.currentStep + 1

    if (nextStepIndex < flowInfo.steps.length) {
      flowInfo.currentStep = nextStepIndex
      sessionStorage.setItem(this.stepStorageKey, JSON.stringify(flowInfo))

      const nextStep = flowInfo.steps[nextStepIndex]
      router.push(nextStep.path)
      return true
    } else {
      // 流程完成，跳转到原始目标
      sessionStorage.removeItem(this.stepStorageKey)

      if (flowInfo.originalTarget) {
        router.push(flowInfo.originalTarget)
      } else {
        this.executeRedirect(router)
      }
      return true
    }
  }
}

// 7. 使用示例：需要完善个人信息才能访问某些页面
router.beforeEach(async (to, from, next) => {
  const token = getToken()

  if (!token) {
    redirectManager.saveRedirect(to, from)
    next('/login')
    return
  }

  // 检查是否需要完善个人信息
  if (to.meta.requiresCompleteProfile) {
    const userProfile = await getUserProfile()

    if (!userProfile.isComplete) {
      const multiStepManager = new MultiStepRedirectManager()
      multiStepManager.saveMultiStepFlow([
        { path: '/profile/basic', name: '基本信息' },
        { path: '/profile/contact', name: '联系方式' },
        { path: '/profile/preferences', name: '偏好设置' }
      ], 0, to.fullPath)

      next('/profile/basic')
      return
    }
  }

  next()
})
```

**使用场景对比：**

- **Query 参数**: 简单场景，路径较短，便于调试
- **SessionStorage**: 复杂数据，会话级别，安全性较好
- **状态管理**: 复杂流程，多步骤操作，集中管理
- **多步骤流程**: 需要完善信息才能访问的场景

### 记忆要点总结

- 保存方式：query 参数、sessionStorage、状态管理
- 安全验证：路径合法性、防开放重定向
- 数据管理：过期时间、清理机制
- 用户体验：流程指示、错误处理
- 最佳实践：简单用 query，复杂用 storage

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：路由重定向和导航守卫中如何传递原始目标（用于登录后回跳）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
