# 如何创建 Vue Router 实例（基本示例）？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察Vue Router 4的基础配置和实例创建，面试官想了解你是否掌握现代Vue应用的路由配置方法。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案中的导入语句缺少必要的导入：需要从 'Vue Router' 导入 `createRouter` 和 `createWebHistory`
- 路由配置对象的属性间缺少逗号分隔符
- 文件扩展名应该明确指定为 `.vue`
- 缺少路由实例的导出和在应用中的使用

## 知识点系统梳理

使用Vue Router中的createRouter 创建

```javascript
import { createRouter, createWebHistory } from 'Vue Router'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### 问题本质解读 这道题考察Vue Router 4的基础配置和实例创建，面试官想了解你是否掌握现代Vue应用的路由配置方法。

### 技术错误纠正
- 原答案中的导入语句缺少必要的导入：需要从 'Vue Router' 导入 `createRouter` 和 `createWebHistory`
- 路由配置对象的属性间缺少逗号分隔符
- 文件扩展名应该明确指定为 `.vue`
- 缺少路由实例的导出和在应用中的使用

### 知识点系统梳理

**Vue Router 4 核心概念：**
- createRouter：创建路由实例的工厂函数
- history模式：控制URL的表现形式和浏览器历史记录
- routes配置：定义路径与组件的映射关系
- 路由实例：管理应用导航状态的核心对象

### 实战应用举例
```javascript
// 完整的路由配置示例
import { createRouter, createWebHistory, createWebHashHistory } from 'Vue Router'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: '关于我们' }
  },
  {
    // 懒加载示例
    path: '/profile',
    name: 'profile',
    component: () => import('./views/ProfileView.vue')
  }
]

// 创建路由实例
const router = createRouter({
  // History 模式选择
  history: createWebHistory(import.meta.env.BASE_URL), // 生产环境推荐
  // history: createWebHashHistory(), // 兼容性更好
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'Vue App'
  next()
})

export default router
```

```javascript
// main.js 中的使用
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

```vue
<!-- App.vue 根组件 -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>
```

**使用场景对比：**
- **createWebHistory()**: 现代浏览器推荐，URL更美观，需要服务器配置
- **createWebHashHistory()**: 兼容性好，无需服务器配置，URL带#号
- **createMemoryHistory()**: 主要用于SSR和测试环境

### 记忆要点总结
- 导入：createRouter, createWebHistory
- 配置：routes数组，history模式
- 使用：app.use(router)
- 核心：路径映射组件，支持懒加载

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何创建 Vue Router 实例（基本示例）？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
