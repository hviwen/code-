# `router.isReady()` 有什么用途？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察Vue Router的初始化时机和异步路由处理，面试官想了解你是否掌握路由系统的生命周期管理。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

`router.isReady()` 返回一个 Promise，在路由器完成初始导航时 resolve，主要用于确保路由系统已完全初始化，特别在 SSR 环境中非常重要。

### 问题本质解读 这道题考察Vue Router的初始化时机和异步路由处理，面试官想了解你是否掌握路由系统的生命周期管理。

### 知识点系统梳理

**router.isReady() 的作用：**
- 返回Promise，在路由器完成初始导航时resolve
- 确保初始路由已经解析完成
- 在SSR环境中特别重要
- 用于等待异步路由组件加载完成

**使用场景和时机：**
- 应用启动时等待路由就绪
- SSR中确保服务端路由解析完成
- 测试环境中等待路由初始化
- 需要在路由就绪后执行的初始化逻辑

### 实战应用举例
```javascript
// 1. 基础使用 - 应用启动
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'Vue Router'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./views/HomeView.vue')
    },
    {
      path: '/about',
      component: () => import('./views/AboutView.vue')
    }
  ]
})

const app = createApp(App)
app.use(router)

// 等待路由就绪后挂载应用
router.isReady().then(() => {
  app.mount('#app')
  console.log('路由已就绪，应用已挂载')
})
```

```javascript
// 2. SSR环境中的使用
// server.js
import { renderToString } from '@vue/server-renderer'
import { createSSRApp } from 'vue'
import { createRouter, createMemoryHistory } from 'Vue Router'

export async function render(url) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [...routes]
  })

  const app = createSSRApp(App)
  app.use(router)

  // 推送当前URL到路由器
  await router.push(url)

  // 等待路由就绪
  await router.isReady()

  // 渲染应用
  const html = await renderToString(app)
  return html
}
```

```javascript
// 3. 复杂应用启动流程
class AppBootstrap {
  constructor() {
    this.router = null
    this.app = null
    this.isInitialized = false
  }

  async initialize() {
    try {
      // 1. 创建路由器
      this.router = this.createRouter()

      // 2. 创建应用实例
      this.app = createApp(App)
      this.app.use(this.router)

      // 3. 等待路由就绪
      await this.router.isReady()
      console.log('路由系统已就绪')

      // 4. 初始化其他服务
      await this.initializeServices()

      // 5. 挂载应用
      this.app.mount('#app')

      this.isInitialized = true
      console.log('应用启动完成')

    } catch (error) {
      console.error('应用启动失败:', error)
      this.handleBootstrapError(error)
    }
  }

  createRouter() {
    return createRouter({
      history: createWebHistory(),
      routes: [
        // 动态路由配置
        ...this.getDynamicRoutes()
      ]
    })
  }

  async initializeServices() {
    // 等待路由就绪后初始化其他服务
    const services = [
      this.initializeAuth(),
      this.initializeI18n(),
      this.initializeAnalytics(),
      this.initializeErrorReporting()
    ]

    await Promise.all(services)
  }

  async initializeAuth() {
    // 认证服务初始化
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        await authService.validateToken(token)
        console.log('用户认证状态已恢复')
      } catch (error) {
        console.log('token无效，清除本地存储')
        localStorage.removeItem('auth_token')
      }
    }
  }

  async initializeI18n() {
    // 国际化初始化
    const locale = localStorage.getItem('locale') || 'zh-CN'
    await i18n.setLocale(locale)
  }

  async initializeAnalytics() {
    // 分析服务初始化
    analytics.init({
      trackingId: process.env.VUE_APP_GA_ID,
      router: this.router
    })
  }

  async initializeErrorReporting() {
    // 错误报告服务初始化
    errorReporter.init({
      dsn: process.env.VUE_APP_SENTRY_DSN,
      environment: process.env.NODE_ENV
    })
  }

  handleBootstrapError(error) {
    // 显示启动错误页面
    document.body.innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <h1>应用启动失败</h1>
        <p>请刷新页面重试</p>
        <button onclick="location.reload()">刷新页面</button>
      </div>
    `
  }

  getDynamicRoutes() {
    // 根据环境或配置返回不同的路由
    const baseRoutes = [
      { path: '/', component: () => import('./views/HomeView.vue') },
      { path: '/about', component: () => import('./views/AboutView.vue') }
    ]

    if (process.env.NODE_ENV === 'development') {
      baseRoutes.push({
        path: '/dev-tools',
        component: () => import('./views/DevToolsView.vue')
      })
    }

    return baseRoutes
  }
}

// 启动应用
const bootstrap = new AppBootstrap()
bootstrap.initialize()
```

```javascript
// 4. 测试环境中的使用
// test-utils.js
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'Vue Router'

export async function mountWithRouter(component, options = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: options.routes || []
  })

  // 如果有初始路由，先导航过去
  if (options.initialRoute) {
    await router.push(options.initialRoute)
  }

  // 等待路由就绪
  await router.isReady()

  return mount(component, {
    global: {
      plugins: [router]
    },
    ...options
  })
}

// 使用示例
describe('MyComponent', () => {
  it('应该正确渲染', async () => {
    const wrapper = await mountWithRouter(MyComponent, {
      routes: [
        { path: '/', component: HomeView },
        { path: '/user/:id', component: UserView }
      ],
      initialRoute: '/user/123'
    })

    expect(wrapper.text()).toContain('用户详情')
  })
})
```

```javascript
// 5. 路由预加载和缓存
class RoutePreloader {
  constructor(router) {
    this.router = router
    this.preloadedRoutes = new Set()
  }

  async preloadCriticalRoutes() {
    // 等待路由器就绪
    await this.router.isReady()

    // 预加载关键路由
    const criticalRoutes = ['/dashboard', '/profile', '/settings']

    const preloadPromises = criticalRoutes.map(async (path) => {
      if (!this.preloadedRoutes.has(path)) {
        try {
          // 查找匹配的路由
          const matched = this.router.resolve(path)

          // 预加载组件
          if (matched.matched.length > 0) {
            const component = matched.matched[0].components?.default
            if (typeof component === 'function') {
              await component()
              this.preloadedRoutes.add(path)
              console.log(`预加载路由: ${path}`)
            }
          }
        } catch (error) {
          console.warn(`预加载路由失败: ${path}`, error)
        }
      }
    })

    await Promise.all(preloadPromises)
    console.log('关键路由预加载完成')
  }
}

// 使用预加载器
const preloader = new RoutePreloader(router)

router.isReady().then(() => {
  // 路由就绪后开始预加载
  preloader.preloadCriticalRoutes()
})
```

```javascript
// 6. 性能监控
class RouterPerformanceMonitor {
  constructor(router) {
    this.router = router
    this.setupMonitoring()
  }

  async setupMonitoring() {
    const startTime = performance.now()

    // 等待路由就绪
    await this.router.isReady()

    const readyTime = performance.now()
    const initializationTime = readyTime - startTime

    console.log(`路由初始化耗时: ${initializationTime.toFixed(2)}ms`)

    // 上报性能数据
    this.reportPerformance({
      routerInitTime: initializationTime,
      timestamp: Date.now()
    })

    // 设置路由变化监控
    this.setupNavigationMonitoring()
  }

  setupNavigationMonitoring() {
    this.router.beforeEach((to, from) => {
      // 记录导航开始时间
      to.meta.navigationStart = performance.now()
    })

    this.router.afterEach((to, from) => {
      // 计算导航耗时
      if (to.meta.navigationStart) {
        const navigationTime = performance.now() - to.meta.navigationStart
        console.log(`导航到 ${to.path} 耗时: ${navigationTime.toFixed(2)}ms`)

        // 上报导航性能
        this.reportNavigation({
          from: from.path,
          to: to.path,
          duration: navigationTime
        })
      }
    })
  }

  reportPerformance(data) {
    // 发送性能数据到监控服务
    fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error)
  }

  reportNavigation(data) {
    // 发送导航数据
    analytics.track('navigation_performance', data)
  }
}

// 启用性能监控
const performanceMonitor = new RouterPerformanceMonitor(router)
```

**使用场景总结：**
- **应用启动**: 确保路由就绪后再挂载应用
- **SSR渲染**: 服务端等待路由解析完成
- **测试环境**: 确保路由初始化完成后执行测试
- **性能监控**: 测量路由初始化时间
- **服务初始化**: 在路由就绪后初始化其他服务
- **预加载策略**: 路由就绪后预加载关键组件

**最佳实践建议：**
- 总是在router.isReady()后挂载应用
- SSR环境中必须等待isReady()
- 可以利用isReady()时机初始化其他服务
- 在测试中使用isReady()确保路由状态正确
- 结合性能监控了解路由初始化耗时

### 记忆要点总结
- isReady()：返回Promise，路由就绪时resolve
- 用途：等待初始路由解析完成
- 场景：应用启动、SSR、测试、性能监控
- 最佳实践：总是等待isReady()后再挂载应用
- SSR必需：确保服务端路由解析完成

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：`router.isReady()` 有什么用途？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
