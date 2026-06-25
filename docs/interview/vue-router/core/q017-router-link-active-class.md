# 如何在 `<router-link>` 中设置 active-class？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察router-link的样式控制和导航状态管理，面试官想了解你是否掌握活跃链接的样式定制和用户体验优化。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

通过 `active-class` 和 `exact-active-class` 属性设置自定义样式类，或者通过全局配置 `linkActiveClass` 和 `linkExactActiveClass` 统一设置。

### 问题本质解读 这道题考察router-link的样式控制和导航状态管理，面试官想了解你是否掌握活跃链接的样式定制和用户体验优化。

### 知识点系统梳理

**active-class 的两种类型：**
- **router-link-active**: 包含匹配（部分匹配）
- **router-link-exact-active**: 精确匹配
- **自定义类名**: 通过active-class和exact-active-class属性
- **全局配置**: 在创建路由器时统一设置

### 实战应用举例
```vue
<!-- 1. 基础 active-class 使用 -->
<template>
  <nav class="navigation">
    <!-- 默认的active类名 -->
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>

    <!-- 自定义active类名 -->
    <router-link
      to="/products"
      active-class="nav-active"
      exact-active-class="nav-exact-active"
    >
      产品
    </router-link>

    <!-- 嵌套路由的active状态 -->
    <router-link
      to="/user/profile"
      active-class="user-section-active"
    >
      用户中心
    </router-link>

    <!-- 精确匹配 -->
    <router-link
      to="/dashboard"
      exact
      active-class="dashboard-active"
    >
      仪表板
    </router-link>
  </nav>
</template>

<style scoped>
/* 默认的active样式 */
.router-link-active {
  color: #42b983;
  font-weight: bold;
}

.router-link-exact-active {
  color: #ff6b6b;
  background-color: #f0f0f0;
}

/* 自定义active样式 */
.nav-active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.nav-exact-active {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border-radius: 4px;
}

.user-section-active {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.dashboard-active {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}
</style>
```

```javascript
// 2. 全局配置 active-class
import { createRouter, createWebHistory } from 'Vue Router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...],
  // 全局配置active类名
  linkActiveClass: 'global-active',
  linkExactActiveClass: 'global-exact-active'
})

export default router
```

```vue
<!-- 3. 动态 active-class 控制 -->
<template>
  <nav class="dynamic-nav">
    <router-link
      v-for="item in navItems"
      :key="item.name"
      :to="item.path"
      :active-class="item.activeClass"
      :exact-active-class="item.exactActiveClass"
      :class="getNavItemClass(item)"
    >
      <i :class="item.icon"></i>
      {{ item.label }}
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'Vue Router'

const route = useRoute()

const navItems = [
  {
    name: 'home',
    path: '/',
    label: '首页',
    icon: 'fas fa-home',
    activeClass: 'home-active',
    exactActiveClass: 'home-exact-active'
  },
  {
    name: 'products',
    path: '/products',
    label: '产品',
    icon: 'fas fa-box',
    activeClass: 'products-active',
    exactActiveClass: 'products-exact-active'
  },
  {
    name: 'admin',
    path: '/admin',
    label: '管理',
    icon: 'fas fa-cog',
    activeClass: 'admin-active',
    exactActiveClass: 'admin-exact-active',
    requiresAuth: true
  }
]

// 动态计算导航项样式
const getNavItemClass = (item) => {
  const classes = ['nav-item']

  // 根据权限添加样式
  if (item.requiresAuth && !userStore.isAuthenticated) {
    classes.push('nav-disabled')
  }

  // 根据当前路由添加特殊样式
  if (route.path.startsWith(item.path) && item.path !== '/') {
    classes.push('nav-section-active')
  }

  return classes
}
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  text-decoration: none;
  color: #666;
  transition: all 0.3s ease;
}

.nav-item i {
  margin-right: 8px;
}

.nav-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.nav-section-active {
  background-color: #f8f9fa;
}

/* 不同页面的active样式 */
.home-active {
  color: #28a745;
  background-color: #d4edda;
}

.products-active {
  color: #007bff;
  background-color: #d1ecf1;
}

.admin-active {
  color: #dc3545;
  background-color: #f8d7da;
}
</style>
```

```vue
<!-- 4. 复杂导航场景的处理 -->
<template>
  <div class="complex-navigation">
    <!-- 主导航 -->
    <nav class="main-nav">
      <router-link
        v-for="item in mainNavItems"
        :key="item.name"
        :to="item.to"
        :active-class="item.activeClass"
        :exact="item.exact"
        class="main-nav-item"
      >
        {{ item.label }}
      </router-link>
    </nav>

    <!-- 子导航 -->
    <nav v-if="currentSection" class="sub-nav">
      <router-link
        v-for="subItem in currentSection.children"
        :key="subItem.name"
        :to="subItem.to"
        active-class="sub-nav-active"
        exact-active-class="sub-nav-exact-active"
        class="sub-nav-item"
      >
        {{ subItem.label }}
      </router-link>
    </nav>

    <!-- 面包屑导航 -->
    <nav class="breadcrumb">
      <router-link
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        :to="crumb.to"
        :active-class="index === breadcrumbs.length - 1 ? 'breadcrumb-current' : 'breadcrumb-active'"
        class="breadcrumb-item"
      >
        {{ crumb.label }}
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'Vue Router'

const route = useRoute()

const mainNavItems = [
  {
    name: 'dashboard',
    to: '/dashboard',
    label: '仪表板',
    activeClass: 'main-nav-dashboard-active',
    exact: true
  },
  {
    name: 'users',
    to: '/users',
    label: '用户管理',
    activeClass: 'main-nav-users-active',
    children: [
      { name: 'user-list', to: '/users', label: '用户列表' },
      { name: 'user-roles', to: '/users/roles', label: '角色管理' },
      { name: 'user-permissions', to: '/users/permissions', label: '权限管理' }
    ]
  },
  {
    name: 'content',
    to: '/content',
    label: '内容管理',
    activeClass: 'main-nav-content-active',
    children: [
      { name: 'articles', to: '/content/articles', label: '文章管理' },
      { name: 'categories', to: '/content/categories', label: '分类管理' },
      { name: 'tags', to: '/content/tags', label: '标签管理' }
    ]
  }
]

// 当前激活的主导航项
const currentSection = computed(() => {
  return mainNavItems.find(item =>
    route.path.startsWith(item.to) && item.to !== '/'
  )
})

// 面包屑导航
const breadcrumbs = computed(() => {
  const crumbs = []

  // 根据当前路由生成面包屑
  route.matched.forEach(record => {
    if (record.meta?.breadcrumb) {
      crumbs.push({
        label: record.meta.breadcrumb,
        to: record.path
      })
    }
  })

  return crumbs
})
</script>

<style scoped>
.main-nav {
  display: flex;
  background-color: #343a40;
  padding: 0;
}

.main-nav-item {
  color: white;
  padding: 15px 20px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.main-nav-item:hover {
  background-color: #495057;
}

.main-nav-dashboard-active {
  background-color: #007bff;
}

.main-nav-users-active {
  background-color: #28a745;
}

.main-nav-content-active {
  background-color: #ffc107;
  color: #212529;
}

.sub-nav {
  display: flex;
  background-color: #f8f9fa;
  padding: 0;
  border-bottom: 1px solid #dee2e6;
}

.sub-nav-item {
  color: #495057;
  padding: 10px 15px;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.sub-nav-active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.sub-nav-exact-active {
  background-color: #e3f2fd;
  font-weight: bold;
}

.breadcrumb {
  display: flex;
  padding: 10px 15px;
  background-color: #e9ecef;
}

.breadcrumb-item {
  color: #6c757d;
  text-decoration: none;
  margin-right: 10px;
  position: relative;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  margin-left: 10px;
  color: #adb5bd;
}

.breadcrumb-active {
  color: #007bff;
}

.breadcrumb-current {
  color: #495057;
  font-weight: bold;
}
</style>
```

```javascript
// 5. 编程式控制 active 状态
import { computed } from 'vue'
import { useRoute } from 'Vue Router'

// 自定义 active 状态检测
export function useActiveLink() {
  const route = useRoute()

  // 检查链接是否激活
  const isLinkActive = (to, exact = false) => {
    if (typeof to === 'string') {
      return exact
        ? route.path === to
        : route.path.startsWith(to)
    }

    if (typeof to === 'object') {
      // 检查命名路由
      if (to.name) {
        return route.name === to.name
      }

      // 检查路径
      if (to.path) {
        return exact
          ? route.path === to.path
          : route.path.startsWith(to.path)
      }
    }

    return false
  }

  // 获取链接的 active 类名
  const getLinkClass = (to, activeClass = 'active', exactActiveClass = 'exact-active') => {
    const classes = []

    if (isLinkActive(to, false)) {
      classes.push(activeClass)
    }

    if (isLinkActive(to, true)) {
      classes.push(exactActiveClass)
    }

    return classes
  }

  return {
    isLinkActive,
    getLinkClass
  }
}

// 在组件中使用
const { isLinkActive, getLinkClass } = useActiveLink()

const navItemClass = computed(() => {
  return getLinkClass('/dashboard', 'nav-active', 'nav-exact-active')
})
```

```scss
// 6. 高级样式技巧
.navigation {
  // 使用CSS变量实现主题切换
  --active-color: #007bff;
  --active-bg: #e3f2fd;
  --exact-active-color: #ffffff;
  --exact-active-bg: #007bff;

  .router-link-active {
    color: var(--active-color);
    background-color: var(--active-bg);

    // 动画效果
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    // 激活状态的特殊效果
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: var(--active-color);
      transform: scaleY(1);
      transition: transform 0.3s ease;
    }
  }

  .router-link-exact-active {
    color: var(--exact-active-color);
    background-color: var(--exact-active-bg);

    // 精确匹配的特殊效果
    box-shadow:
      0 2px 8px rgba(0, 123, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    &::before {
      transform: scaleY(1.2);
    }
  }

  // 暗色主题
  &.dark-theme {
    --active-color: #64b5f6;
    --active-bg: #1e3a8a;
    --exact-active-color: #ffffff;
    --exact-active-bg: #1976d2;
  }

  // 响应式设计
  @media (max-width: 768px) {
    .router-link-active {
      font-size: 14px;
      padding: 8px 12px;
    }
  }
}
```

**使用场景总结：**
- **主导航**: 区分当前页面和其他页面
- **子导航**: 显示当前子页面状态
- **面包屑**: 显示导航路径
- **侧边栏**: 突出显示当前功能模块
- **标签页**: 显示激活的标签

**最佳实践建议：**
- 为不同类型的导航使用不同的active样式
- 考虑精确匹配和包含匹配的区别
- 使用CSS变量实现主题切换
- 添加过渡动画提升用户体验
- 在移动端适配active状态样式

### 记忆要点总结
- active-class：自定义激活状态类名
- exact-active-class：精确匹配的类名
- 全局配置：linkActiveClass、linkExactActiveClass
- 默认类名：router-link-active、router-link-exact-active
- 匹配规则：包含匹配 vs 精确匹配

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何在 `<router-link>` 中设置 active-class？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
