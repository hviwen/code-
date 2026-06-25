# 路由导航守卫的执行顺序（全局、路由独享、组件内）？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察Vue Router导航守卫的完整生命周期，面试官想了解你是否掌握路由导航的执行机制和各个阶段的作用。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- `beforeRouterLeave` 应为 `beforeRouteLeave`
- `beforEach` 应为 `beforeEach`
- `beforeRouterUpdate` 应为 `beforeRouteUpdate`
- `befroeRouterEnter` 应为 `beforeRouteEnter`
- `beforeRosolve` 应为 `beforeResolve`

## 知识点系统梳理

1. 导航被触发
2. ~~在失活的组件里面调用 beforeRouterLeave~~ 在失活组件中调用 `beforeRouteLeave` 守卫
3. ~~全局导航守卫 beforEach~~ 调用全局的 `beforeEach` 守卫
4. ~~重用的组件调用 beforeRouterUpdate~~ 在重用组件中调用 `beforeRouteUpdate` 守卫
5. 在路由配置中调用 `beforeEnter` 守卫
6. 解析异步路由组件
7. ~~在被激活的组件里调用 befroeRouterEnter~~ 在被激活组件中调用 `beforeRouteEnter` 守卫
8. ~~调用全局的 beforeRosolve~~ 调用全局的 `beforeResolve` 守卫
9. 导航被确认
10. 调用全局的 `afterEach` 钩子
11. 触发DOM更新
12. ~~调用beforeRouterEnter中导航守卫的next~~ 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数

### 问题本质解读 这道题考察Vue Router导航守卫的完整生命周期，面试官想了解你是否掌握路由导航的执行机制和各个阶段的作用。

### 技术错误纠正
- `beforeRouterLeave` 应为 `beforeRouteLeave`
- `beforEach` 应为 `beforeEach`
- `beforeRouterUpdate` 应为 `beforeRouteUpdate`
- `befroeRouterEnter` 应为 `beforeRouteEnter`
- `beforeRosolve` 应为 `beforeResolve`

### 知识点系统梳理

**完整的导航守卫执行顺序：**
1. **导航被触发**
2. **在失活组件中调用 `beforeRouteLeave` 守卫**
3. **调用全局的 `beforeEach` 守卫**
4. **在重用组件中调用 `beforeRouteUpdate` 守卫**
5. **在路由配置中调用 `beforeEnter` 守卫**
6. **解析异步路由组件**
7. **在被激活组件中调用 `beforeRouteEnter` 守卫**
8. **调用全局的 `beforeResolve` 守卫**
9. **导航被确认**
10. **调用全局的 `afterEach` 钩子**
11. **触发DOM更新**
12. **调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数**

### 实战应用举例
```javascript
// 1. 完整的导航守卫示例
import { createRouter, createWebHistory } from 'Vue Router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user/:id',
      name: 'user',
      component: () => import('./UserView.vue'),
      // 5. 路由独享守卫
      beforeEnter: (to, from) => {
        console.log('5. beforeEnter - 路由独享守卫')
        console.log('检查用户权限...')

        // 权限验证逻辑
        const userStore = useUserStore()
        if (!userStore.canAccessUser(to.params.id)) {
          return { name: 'forbidden' }
        }

        return true
      }
    }
  ]
})

// 3. 全局前置守卫
router.beforeEach((to, from) => {
  console.log('3. beforeEach - 全局前置守卫')
  console.log(`从 ${from.path} 导航到 ${to.path}`)

  // 全局权限检查
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 页面加载状态
  showLoadingBar()

  return true
})

// 8. 全局解析守卫
router.beforeResolve((to, from) => {
  console.log('8. beforeResolve - 全局解析守卫')
  console.log('所有组件内守卫和异步路由组件被解析之后调用')

  // 最后的检查和数据预加载
  return preloadCriticalData(to)
})

// 10. 全局后置钩子
router.afterEach((to, from, failure) => {
  console.log('10. afterEach - 全局后置钩子')

  // 隐藏加载状态
  hideLoadingBar()

  // 页面标题设置
  document.title = to.meta.title || 'Default Title'

  // 埋点统计
  analytics.track('page_view', {
    page: to.name,
    path: to.path
  })

  // 处理导航失败
  if (failure) {
    console.error('导航失败:', failure)
  }
})
```

```vue
<!-- 2. 组件内守卫示例 -->
<template>
  <div class="user-view">
    <h1>用户详情</h1>
    <div v-if="loading">加载中...</div>
    <div v-else-if="user">
      <UserProfile :user="user" />
    </div>
    <div v-else>用户不存在</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onBeforeRouteEnter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'Vue Router'

const user = ref(null)
const loading = ref(false)
const hasUnsavedChanges = ref(false)

// 7. 进入守卫
onBeforeRouteEnter((to, from, next) => {
  console.log('7. beforeRouteEnter - 组件进入守卫')
  console.log('在渲染该组件的对应路由被确认前调用')

  // 注意：此时组件实例还没被创建，不能访问 this
  // 可以通过 next 回调访问组件实例
  next(vm => {
    console.log('12. beforeRouteEnter next回调')
    console.log('组件实例已创建，可以访问组件')
    vm.loadUserData(to.params.id)
  })
})

// 4. 更新守卫
onBeforeRouteUpdate((to, from) => {
  console.log('4. beforeRouteUpdate - 组件更新守卫')
  console.log('在当前路由改变，但是该组件被复用时调用')

  // 参数变化时重新加载数据
  if (to.params.id !== from.params.id) {
    loadUserData(to.params.id)
  }

  return true
})

// 2. 离开守卫
onBeforeRouteLeave((to, from) => {
  console.log('2. beforeRouteLeave - 组件离开守卫')
  console.log('导航离开该组件的对应路由时调用')

  // 检查是否有未保存的更改
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('您有未保存的更改，确定要离开吗？')
    if (!answer) return false
  }

  // 清理定时器、取消请求等
  cleanup()

  return true
})

const loadUserData = async (userId) => {
  loading.value = true
  try {
    user.value = await fetchUser(userId)
  } catch (error) {
    console.error('加载用户数据失败:', error)
    user.value = null
  } finally {
    loading.value = false
  }
}

const cleanup = () => {
  // 清理资源
  console.log('清理组件资源')
}
</script>
```

```javascript
// 3. 复杂场景的守卫协作
class NavigationGuardManager {
  constructor(router) {
    this.router = router
    this.setupGuards()
  }

  setupGuards() {
    // 全局前置守卫 - 认证检查
    this.router.beforeEach(async (to, from) => {
      console.log('=== 导航开始 ===')
      console.log(`从 ${from.fullPath} 到 ${to.fullPath}`)

      // 1. 认证检查
      const authResult = await this.checkAuthentication(to)
      if (!authResult.success) {
        return authResult.redirect
      }

      // 2. 权限检查
      const permissionResult = this.checkPermissions(to)
      if (!permissionResult.success) {
        return permissionResult.redirect
      }

      // 3. 设置加载状态
      this.setLoadingState(true)

      return true
    })

    // 全局解析守卫 - 数据预加载
    this.router.beforeResolve(async (to, from) => {
      console.log('=== 开始解析 ===')

      try {
        // 预加载关键数据
        await this.preloadData(to)

        // 检查数据完整性
        const dataCheck = await this.validateRequiredData(to)
        if (!dataCheck.success) {
          throw new Error(dataCheck.message)
        }

        return true
      } catch (error) {
        console.error('数据预加载失败:', error)
        return { name: 'error', params: { message: error.message } }
      }
    })

    // 全局后置钩子 - 清理和统计
    this.router.afterEach((to, from, failure) => {
      console.log('=== 导航完成 ===')

      // 清理加载状态
      this.setLoadingState(false)

      // 更新页面信息
      this.updatePageInfo(to)

      // 记录导航
      this.logNavigation(to, from, failure)

      console.log('=== 导航结束 ===')
    })
  }

  async checkAuthentication(to) {
    if (!to.meta.requiresAuth) {
      return { success: true }
    }

    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      return {
        success: false,
        redirect: {
          name: 'login',
          query: { redirect: to.fullPath }
        }
      }
    }

    // 验证token有效性
    try {
      await authStore.validateToken()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        redirect: { name: 'login' }
      }
    }
  }

  checkPermissions(to) {
    if (!to.meta.permissions) {
      return { success: true }
    }

    const userStore = useUserStore()
    const hasPermission = to.meta.permissions.every(permission =>
      userStore.permissions.includes(permission)
    )

    if (!hasPermission) {
      return {
        success: false,
        redirect: { name: 'forbidden' }
      }
    }

    return { success: true }
  }

  async preloadData(to) {
    const preloadTasks = []

    // 根据路由元信息预加载数据
    if (to.meta.preloadUser) {
      preloadTasks.push(this.preloadUserData(to.params.id))
    }

    if (to.meta.preloadSettings) {
      preloadTasks.push(this.preloadSettings())
    }

    await Promise.all(preloadTasks)
  }

  async validateRequiredData(to) {
    // 验证必需的数据是否已加载
    if (to.meta.requiresUser) {
      const userStore = useUserStore()
      if (!userStore.currentUser) {
        return {
          success: false,
          message: '用户数据加载失败'
        }
      }
    }

    return { success: true }
  }

  setLoadingState(loading) {
    const loadingStore = useLoadingStore()
    loadingStore.setGlobalLoading(loading)
  }

  updatePageInfo(to) {
    // 更新页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - My App`
    }

    // 更新meta标签
    if (to.meta.description) {
      this.updateMetaTag('description', to.meta.description)
    }
  }

  updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }
    meta.content = content
  }

  logNavigation(to, from, failure) {
    const navigationData = {
      to: to.fullPath,
      from: from.fullPath,
      timestamp: Date.now(),
      success: !failure
    }

    if (failure) {
      navigationData.failure = failure.type
    }

    // 发送到分析服务
    analytics.track('navigation', navigationData)
  }
}

// 初始化导航守卫管理器
const guardManager = new NavigationGuardManager(router)
```

**守卫类型和作用总结：**

**全局守卫：**
- `beforeEach`: 全局前置守卫，每次导航前调用
- `beforeResolve`: 全局解析守卫，在所有组件内守卫和异步路由组件被解析之后调用
- `afterEach`: 全局后置钩子，导航确认后调用

**路由独享守卫：**
- `beforeEnter`: 在路由配置中定义，只对该路由生效

**组件内守卫：**
- `beforeRouteEnter`: 进入组件前调用，不能访问this
- `beforeRouteUpdate`: 路由改变但组件被复用时调用
- `beforeRouteLeave`: 离开组件时调用

**实际应用场景：**
- **认证检查**: 在beforeEach中检查登录状态
- **权限控制**: 在beforeEnter中检查页面权限
- **数据预加载**: 在beforeResolve中预加载数据
- **状态清理**: 在beforeRouteLeave中清理组件状态
- **埋点统计**: 在afterEach中记录页面访问

### 记忆要点总结
- 执行顺序：离开→全局前置→更新→路由独享→解析异步→进入→全局解析→确认→全局后置→DOM更新→回调
- 全局守卫：beforeEach、beforeResolve、afterEach
- 路由守卫：beforeEnter
- 组件守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave
- 关键节点：异步组件解析、导航确认、DOM更新

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：路由导航守卫的执行顺序（全局、路由独享、组件内）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
