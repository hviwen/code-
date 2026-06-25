# 什么是动态路由？如何定义路由参数？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察动态路由的概念和参数传递机制，面试官想了解你是否掌握路由参数的定义、获取和动态路由管理。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 动态路由不仅仅是"相同页面"，而是路由模式的复用
- router.addRoute() 和 router.removeRoute() 是动态路由管理，与路由参数是不同概念

## 知识点系统梳理

动态路由是使用参数化路径模式的路由，可以让同一个组件处理不同的参数值。通过在路径中使用冒号 `:` 来定义参数，如 `/user/:id`。

支持路径参数、查询参数、可选参数等多种形式，还可以使用正则表达式进行参数约束。

动态路由管理（如 router.addRoute()）是另一个概念，用于运行时添加或删除路由。

### 问题本质解读 这道题考察动态路由的概念和参数传递机制，面试官想了解你是否掌握路由参数的定义、获取和动态路由管理。

### 技术错误纠正
- 动态路由不仅仅是"相同页面"，而是路由模式的复用
- router.addRoute() 和 router.removeRoute() 是动态路由管理，与路由参数是不同概念

### 知识点系统梳理

**动态路由概念：**

- 使用参数化的路径模式匹配多个路由
- 同一个组件可以处理不同的参数值
- 支持路径参数、查询参数、可选参数等
- 参数变化时组件会复用，不会重新创建

**路由参数类型：**
- 路径参数（Path Params）：/user/:id
- 查询参数（Query Params）：/search?q=vue
- 可选参数：/user/:id?
- 通配符参数：/files/*

### 实战应用举例
```javascript
// 路由配置
const routes = [
  // 基础动态路由
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
    props: true // 将参数作为props传递
  },

  // 多个参数
  {
    path: '/user/:id/post/:postId',
    name: 'userPost',
    component: PostView
  },

  // 可选参数
  {
    path: '/article/:id?',
    name: 'article',
    component: ArticleView
  },

  // 正则约束
  {
    path: '/user/:id(\\d+)', // 只匹配数字
    name: 'userById',
    component: UserView
  },

  // 通配符路由
  {
    path: '/files/:pathMatch(.*)*',
    name: 'files',
    component: FileExplorer
  },

  // 重复参数
  {
    path: '/tag/:tags+', // 一个或多个
    name: 'tags',
    component: TagView
  }
]
```

```vue
<!-- UserView.vue - 获取路由参数 -->
<template>
  <div class="user-view">
    <h1>用户详情</h1>
    <p>用户ID: {{ userId }}</p>
    <p>标签页: {{ activeTab }}</p>

    <!-- 监听参数变化 -->
    <div v-if="loading">加载中...</div>
    <div v-else>
      <UserProfile :user="user" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'Vue Router'

const route = useRoute()
const router = useRouter()

// 获取路径参数
const userId = computed(() => route.params.id)

// 获取查询参数
const activeTab = computed(() => route.query.tab || 'profile')

// 响应式数据
const user = ref(null)
const loading = ref(false)

// 监听参数变化
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      loading.value = true
      try {
        user.value = await fetchUser(newId)
      } catch (error) {
        console.error('获取用户失败:', error)
        router.push('/404')
      } finally {
        loading.value = false
      }
    }
  },
  { immediate: true }
)

// 使用props接收参数（需要在路由配置中设置props: true）
const props = defineProps({
  id: String
})

// 获取用户数据
const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('User not found')
  return response.json()
}
</script>
```

```javascript
// 动态路由管理
import { useRouter } from 'Vue Router'

const router = useRouter()

// 动态添加路由
const addDynamicRoute = () => {
  router.addRoute({
    path: '/dynamic/:id',
    name: 'dynamic',
    component: () => import('./DynamicView.vue')
  })
}

// 添加嵌套路由
const addNestedRoute = () => {
  router.addRoute('parent', {
    path: 'child',
    name: 'child',
    component: ChildView
  })
}

// 删除路由
const removeDynamicRoute = () => {
  router.removeRoute('dynamic')
}

// 检查路由是否存在
const hasRoute = router.hasRoute('dynamic')

// 获取所有路由
const allRoutes = router.getRoutes()
```

**参数获取方式对比：**
- **Composition API**: `useRoute().params.id`
- **Options API**: `this.$route.params.id`
- **Props方式**: 在路由配置中设置`props: true`

**使用场景举例：**
- 用户详情页：`/user/:id`
- 文章详情：`/article/:slug`
- 分类页面：`/category/:type/:subtype?`
- 文件浏览：`/files/:pathMatch(.*)*`

### 记忆要点总结
- 动态路由：用冒号定义参数 `/user/:id`
- 参数获取：route.params、route.query
- 参数监听：watch route.params变化
- 动态管理：addRoute、removeRoute
- 性能优化：组件复用，避免重复创建

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：什么是动态路由？如何定义路由参数？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
