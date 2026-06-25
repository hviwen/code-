# `router-link` 与 `router.push` 的区别？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察声明式导航与编程式导航的区别，面试官想了解你是否理解不同导航方式的适用场景和性能特点。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案中关于"路由栈"的概念不准确，Vue Router 管理的是浏览器历史记录，不是传统意义的栈结构
- router-link 不会"预加载下一页内容"，这是对预加载机制的误解
- 两者都会影响浏览器历史记录，区别在于使用方式和适用场景

## 知识点系统梳理

Router-link: 声明式导航组件，在模板中使用，渲染为 `<a>` 标签，支持右键菜单操作，SEO友好。

router.push：编程式导航方法，在JavaScript中使用，可以在逻辑中动态控制导航，支持条件导航。

### 问题本质解读 这道题考察声明式导航与编程式导航的区别，面试官想了解你是否理解不同导航方式的适用场景和性能特点。

### 技术错误纠正
- 原答案中关于"路由栈"的概念不准确，Vue Router 管理的是浏览器历史记录，不是传统意义的栈结构
- router-link 不会"预加载下一页内容"，这是对预加载机制的误解
- 两者都会影响浏览器历史记录，区别在于使用方式和适用场景

### 知识点系统梳理

**router-link 特点：**
- 声明式导航，在模板中使用
- 自动生成正确的href属性
- 支持active状态样式
- 可以被搜索引擎爬取
- 支持右键菜单操作（新标签页打开等）
- 无障碍访问友好

**router.push 特点：**
- 编程式导航，在JavaScript中使用
- 可以在逻辑中动态控制导航
- 支持条件导航和异步导航
- 返回Promise，可以处理导航结果
- 适合复杂的导航逻辑

### 实战应用举例
```vue
<template>
  <!-- router-link 声明式导航 -->
  <nav>
    <!-- 基础用法 -->
    <router-link to="/home">首页</router-link>

    <!-- 命名路由 -->
    <router-link :to="{ name: 'user', params: { id: 123 } }">
      用户详情
    </router-link>

    <!-- 带查询参数 -->
    <router-link :to="{ path: '/search', query: { q: 'vue' } }">
      搜索
    </router-link>

    <!-- 自定义标签和样式 -->
    <router-link
      to="/about"
      tag="button"
      active-class="active-btn"
      exact-active-class="exact-active-btn"
    >
      关于我们
    </router-link>

    <!-- 替换历史记录 -->
    <router-link to="/login" replace>登录</router-link>
  </nav>

  <!-- 条件渲染的导航 -->
  <button @click="handleNavigation">智能导航</button>
</template>

<script setup>
import { useRouter } from 'Vue Router'

const router = useRouter()

// router.push 编程式导航
const handleNavigation = async () => {
  try {
    // 基础导航
    await router.push('/dashboard')

    // 带参数导航
    await router.push({
      name: 'user',
      params: { id: 456 },
      query: { tab: 'profile' }
    })

    // 条件导航
    if (user.isAuthenticated) {
      await router.push('/admin')
    } else {
      await router.push('/login')
    }

    // 替换当前历史记录
    await router.replace('/new-path')

    // 相对导航
    await router.push({ path: 'relative-path' })

  } catch (error) {
    // 处理导航错误
    if (error.name === 'NavigationDuplicated') {
      console.log('已在目标页面')
    }
  }
}

// 其他编程式导航方法
const goBack = () => router.go(-1)
const goForward = () => router.go(1)
const goToSpecificHistory = () => router.go(-3)
</script>

<style>
/* router-link 默认渲染为 a 标签 */
.router-link-active {
  color: #42b983;
  font-weight: bold;
}

.router-link-exact-active {
  color: #ff6b6b;
}

.active-btn {
  background-color: #42b983;
  color: white;
}
</style>
```

**使用场景对比：**
- **router-link**: 导航菜单、面包屑、静态链接、SEO友好的链接
- **router.push**: 表单提交后跳转、条件导航、异步导航、复杂逻辑控制

**性能考虑：**
- router-link 支持预加载（prefetch），提升用户体验
- router.push 可以在需要时才执行，避免不必要的导航

### 记忆要点总结
- router-link：模板中的声明式导航，SEO友好
- router.push：JavaScript 中的编程式导航，逻辑灵活
- 选择原则：静态导航用link，动态导航用push
- 都支持对象形式的路由配置

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：`router-link` 与 `router.push` 的区别？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
