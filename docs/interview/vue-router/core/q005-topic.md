# 如何配置嵌套路由？举例简单结构。

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察嵌套路由的配置和渲染机制，面试官想了解你是否掌握复杂页面结构的路由设计和组件层次关系。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

在父组件中添加 `<router-view />` 作为子路由的渲染出口，在父路由配置中添加 `children` 数组定义子路由。

```javascript
<!-- App.vue -->
<template>
  <router-view />
</template>

<!-- User.vue -->
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    <router-view />
  </div>
</template>

const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

### 问题本质解读 这道题考察嵌套路由的配置和渲染机制，面试官想了解你是否掌握复杂页面结构的路由设计和组件层次关系。

### 知识点系统梳理

**嵌套路由核心概念：**
- 父路由组件必须包含`<router-view>`作为子路由出口
- children配置定义子路由，路径相对于父路由
- 支持多层嵌套，每层都需要对应的router-view
- 子路由继承父路由的参数和守卫

**路径匹配规则：**
- 子路径以`/`开头表示绝对路径
- 子路径不以`/`开头表示相对路径
- 空路径`''`表示默认子路由

### 实战应用举例
```javascript
// 完整的嵌套路由配置
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      // 默认子路由 - 访问 /admin 时显示
      {
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboard
      },

      // 用户管理模块
      {
        path: 'users',
        component: UserManagement,
        children: [
          {
            path: '',
            name: 'user-list',
            component: UserList
          },
          {
            path: ':id',
            name: 'user-detail',
            component: UserDetail,
            props: true,
            children: [
              {
                path: '',
                redirect: 'profile'
              },
              {
                path: 'profile',
                name: 'user-profile',
                component: UserProfile
              },
              {
                path: 'settings',
                name: 'user-settings',
                component: UserSettings
              }
            ]
          }
        ]
      },

      // 内容管理模块
      {
        path: 'content',
        component: ContentManagement,
        children: [
          {
            path: 'articles',
            name: 'article-list',
            component: ArticleList
          },
          {
            path: 'articles/create',
            name: 'article-create',
            component: ArticleCreate
          },
          {
            path: 'articles/:id/edit',
            name: 'article-edit',
            component: ArticleEdit,
            props: true
          }
        ]
      }
    ]
  }
]
```

```vue
<!-- AdminLayout.vue - 父布局组件 -->
<template>
  <div class="admin-layout">
    <!-- 顶部导航 -->
    <header class="admin-header">
      <h1>管理后台</h1>
      <nav>
        <router-link to="/admin">首页</router-link>
        <router-link to="/admin/users">用户管理</router-link>
        <router-link to="/admin/content">内容管理</router-link>
      </nav>
    </header>

    <div class="admin-content">
      <!-- 侧边栏 -->
      <aside class="admin-sidebar">
        <AdminSidebar />
      </aside>

      <!-- 主要内容区域 - 子路由渲染位置 -->
      <main class="admin-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from './AdminSidebar.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-content {
  flex: 1;
  display: flex;
}

.admin-sidebar {
  width: 250px;
  background: #f5f5f5;
}

.admin-main {
  flex: 1;
  padding: 20px;
}
</style>
```

```vue
<!-- UserManagement.vue - 二级嵌套组件 -->
<template>
  <div class="user-management">
    <div class="user-nav">
      <h2>用户管理</h2>
      <nav>
        <router-link to="/admin/users">用户列表</router-link>
        <router-link to="/admin/users/create">新建用户</router-link>
      </nav>
    </div>

    <!-- 二级子路由渲染位置 -->
    <div class="user-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.user-nav {
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.user-content {
  flex: 1;
}
</style>
```

```vue
<!-- UserDetail.vue - 三级嵌套组件 -->
<template>
  <div class="user-detail">
    <div class="user-header">
      <h3>用户详情 - {{ userId }}</h3>
      <nav class="user-tabs">
        <router-link
          :to="`/admin/users/${userId}/profile`"
          active-class="active-tab"
        >
          基本信息
        </router-link>
        <router-link
          :to="`/admin/users/${userId}/settings`"
          active-class="active-tab"
        >
          设置
        </router-link>
      </nav>
    </div>

    <!-- 三级子路由渲染位置 -->
    <div class="user-detail-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: String
})

const userId = computed(() => props.id)
</script>

<style scoped>
.user-tabs {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.active-tab {
  background: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
}
</style>
```

```javascript
// 编程式导航在嵌套路由中的使用
import { useRouter } from 'Vue Router'

const router = useRouter()

// 导航到嵌套路由
const navigateToUserProfile = (userId) => {
  router.push({
    name: 'user-profile',
    params: { id: userId }
  })
}

// 相对导航
const navigateToSettings = () => {
  router.push('settings') // 相对于当前路由
}

// 绝对路径导航
const navigateToArticles = () => {
  router.push('/admin/content/articles')
}
```

**嵌套路由的高级特性：**
```javascript
// 命名视图的嵌套路由
const routes = [
  {
    path: '/dashboard',
    components: {
      default: DashboardMain,
      sidebar: DashboardSidebar
    },
    children: [
      {
        path: 'analytics',
        components: {
          default: AnalyticsView,
          sidebar: AnalyticsSidebar
        }
      }
    ]
  }
]
```

**使用场景举例：**
- **管理后台**: 多级菜单和内容区域
- **电商网站**: 分类 → 商品列表 → 商品详情
- **社交应用**: 用户 → 动态 → 评论详情
- **文档系统**: 章节 → 小节 → 具体内容

**常见问题和解决方案：**
- **参数传递**: 子路由自动继承父路由参数
- **守卫执行**: 父子路由守卫按层级顺序执行
- **样式隔离**: 使用scoped样式避免冲突
- **状态管理**: 考虑使用Pinia管理跨组件状态

### 记忆要点总结
- 嵌套路由：children配置 + router-view出口
- 路径规则：相对路径不带/，绝对路径带/
- 默认路由：path为空字符串''
- 多层嵌套：每层都需要router-view
- 参数继承：子路由继承父路由参数

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何配置嵌套路由？举例简单结构。 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
