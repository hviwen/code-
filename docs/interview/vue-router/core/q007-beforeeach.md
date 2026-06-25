# `beforeEach` 全局守卫的用途？它的参数是什么？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察Vue Router的导航守卫机制，面试官想了解你是否掌握路由权限控制、用户认证和导航拦截的实现方法。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 参数应为 `(to, from, next)` 而不是 `(to, form, next)`
- Vue Router 4中推荐使用返回值而不是next()函数
- 返回值类型更丰富：boolean、路由对象、Error等

## 知识点系统梳理

全局前置守卫用于在路由导航前进行权限验证、认证检查、数据预加载等操作。

参数：`(to, from, next)` 或 `(to, from)`（Vue Router 4 推荐）
- `to`: 即将进入的目标路由对象
- `from`: 当前导航正要离开的路由对象
- `next`: 控制导航的函数（Vue Router 3）

Vue Router 4 推荐使用返回值模式：返回 `true`、`false`、路由对象或 `undefined`。

### 问题本质解读 这道题考察Vue Router的导航守卫机制，面试官想了解你是否掌握路由权限控制、用户认证和导航拦截的实现方法。

### 技术错误纠正
- 参数应为 `(to, from, next)` 而不是 `(to, form, next)`
- Vue Router 4中推荐使用返回值而不是next()函数
- 返回值类型更丰富：boolean、路由对象、Error等

### 知识点系统梳理

**beforeEach守卫的作用：**
- 全局前置守卫，在每次路由跳转前执行
- 用于权限验证、用户认证、页面访问控制
- 可以取消导航、重定向或修改导航目标
- 是实现路由级权限控制的核心机制

**参数详解：**
- **to**: 即将进入的目标路由对象
- **from**: 当前导航正要离开的路由对象
- **next**: Vue Router 3的回调函数（Vue Router 4中可选）

### 实战应用举例
```javascript
// Vue Router 4 推荐写法（返回值模式）
import { useUserStore } from '@/stores/user'

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()

  // 1. 权限验证
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // 重定向到登录页，并保存原始目标
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  // 2. 角色权限检查
  if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
    return { name: 'unauthorized' }
  }

  // 3. 动态路由加载
  if (to.meta.requiresDynamicRoutes && !userStore.routesLoaded) {
    try {
      await userStore.loadDynamicRoutes()
      // 重新导航到目标路由
      return to.fullPath
    } catch (error) {
      return { name: 'error', params: { message: '路由加载失败' } }
    }
  }

  // 4. 页面标题设置
  if (to.meta.title) {
    document.title = `${to.meta.title} - 我的应用`
  }

  // 5. 进度条控制
  NProgress.start()

  // 6. 埋点统计
  analytics.track('page_view', {
    page: to.name,
    path: to.path,
    referrer: from.path
  })

  // 允许导航继续
  return true
})

// 全局后置守卫
router.afterEach((to, from, failure) => {
  // 结束进度条
  NProgress.done()

  // 处理导航失败
  if (failure) {
    console.error('导航失败:', failure)
  }
})
```

```javascript
// 复杂的权限控制示例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
        roles: ['admin', 'super_admin'],
        permissions: ['admin.view']
      },
      children: [
        {
          path: 'users',
          name: 'admin-users',
          component: UserManagement,
          meta: {
            permissions: ['user.manage']
          }
        }
      ]
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile,
      meta: {
        requiresAuth: true,
        title: '个人资料'
      }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const loadingStore = useLoadingStore()

  try {
    loadingStore.setLoading(true)

    // 检查认证状态
    if (to.meta.requiresAuth) {
      if (!userStore.token) {
        return {
          name: 'login',
          query: {
            redirect: to.fullPath,
            message: '请先登录'
          }
        }
      }

      // 验证token有效性
      if (!userStore.user && userStore.token) {
        try {
          await userStore.fetchUser()
        } catch (error) {
          userStore.logout()
          return {
            name: 'login',
            query: {
              redirect: to.fullPath,
              message: '登录已过期，请重新登录'
            }
          }
        }
      }
    }

    // 角色权限检查
    if (to.meta.roles?.length) {
      const hasRole = to.meta.roles.some(role =>
        userStore.roles.includes(role)
      )
      if (!hasRole) {
        return {
          name: 'forbidden',
          params: {
            message: '您没有访问此页面的权限'
          }
        }
      }
    }

    // 细粒度权限检查
    if (to.meta.permissions?.length) {
      const hasPermission = to.meta.permissions.every(permission =>
        userStore.permissions.includes(permission)
      )
      if (!hasPermission) {
        return { name: 'forbidden' }
      }
    }

    // 特殊页面逻辑
    if (to.name === 'login' && userStore.isAuthenticated) {
      // 已登录用户访问登录页，重定向到首页
      return { name: 'home' }
    }

    return true

  } catch (error) {
    console.error('路由守卫错误:', error)
    return {
      name: 'error',
      params: { message: '页面加载失败' }
    }
  } finally {
    loadingStore.setLoading(false)
  }
})
```

```javascript
// Vue Router 3 兼容写法（next函数模式）
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
    next({ name: 'unauthorized' })
  } else {
    next() // 必须调用next()继续导航
  }
})
```

**返回值类型详解：**
```javascript
router.beforeEach((to, from) => {
  // 1. 返回 false - 取消导航
  if (someCondition) {
    return false
  }

  // 2. 返回 true 或 undefined - 允许导航
  return true

  // 3. 返回路由对象 - 重定向
  return { name: 'login' }

  // 4. 返回字符串路径 - 重定向
  return '/login'

  // 5. 返回 Error - 导航失败
  return new Error('导航被拒绝')

  // 6. 返回 Promise - 异步处理
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000)
  })
})
```

**常见使用场景：**
- **用户认证**: 检查登录状态，未登录重定向到登录页
- **权限控制**: 基于角色或权限控制页面访问
- **数据预加载**: 在进入页面前预加载必要数据
- **页面埋点**: 统计页面访问数据
- **SEO优化**: 动态设置页面标题和meta信息
- **用户体验**: 显示加载状态、进度条等

**性能优化建议：**
- 避免在守卫中执行耗时操作
- 合理使用缓存减少重复检查
- 异步操作要有超时处理
- 错误处理要完善，避免导航卡死

### 记忆要点总结
- 参数：(to, from, next) 或 (to, from)
- 返回值：boolean、路由对象、字符串、Error
- 用途：权限控制、认证检查、数据预加载
- Vue Router 4推荐返回值模式，更简洁
- 必须有明确的返回值，否则导航会挂起

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：`beforeEach` 全局守卫的用途？它的参数是什么？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
