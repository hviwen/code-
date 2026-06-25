# 如何将路由参数作为组件 props 传入？

> 来源：`docs/vue-router/vue_router_part_1_answer.md`

## 问题本质解读

这道题考察路由参数与组件props的解耦方式，面试官想了解你是否掌握组件复用和测试友好的路由设计模式。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- "命令视图、对象视图、函数视图" 应为 "布尔模式、对象模式、函数模式"
- 设置 props: true 后，组件通过 defineProps 接收参数，不需要通过 $route 获取
- "RouteView的插槽" 概念不准确，应该是 router-view 的插槽，但这与 props 传递是不同的机制

## 知识点系统梳理

在路由配置中设置 `props: true`，可以将路由参数作为 props 传递给组件，组件通过 defineProps 接收，无需使用 $route。

支持三种模式：布尔模式（props: true）、对象模式（props: {}）、函数模式（props: (route) => {}）。

这种方式实现了组件与路由的解耦，便于单元测试和组件复用。

### 问题本质解读 这道题考察路由参数与组件props的解耦方式，面试官想了解你是否掌握组件复用和测试友好的路由设计模式。

### 技术错误纠正
- "命令视图、对象视图、函数视图" 应为 "布尔模式、对象模式、函数模式"
- 设置 props: true 后，组件通过 defineProps 接收参数，不需要通过 $route 获取
- "RouteView的插槽" 概念不准确，应该是 router-view 的插槽，但这与 props 传递是不同的机制

### 知识点系统梳理

**Props传递的三种模式：**
- **布尔模式**: props: true，将路由参数作为props传递
- **对象模式**: props: { staticProp: 'value' }，传递静态props
- **函数模式**: props: (route) => ({ id: route.params.id })，动态计算props

**优势分析：**
- 组件与路由解耦，便于单元测试
- 组件更加纯净，不依赖$route
- 支持类型检查和默认值
- 便于组件复用

### 实战应用举例
```javascript
// 路由配置 - 三种props模式
const routes = [
  // 1. 布尔模式 - 将params作为props传递
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
    props: true
  },

  // 2. 对象模式 - 传递静态props
  {
    path: '/promotion',
    name: 'promotion',
    component: PromotionView,
    props: {
      newsletterPopup: false,
      theme: 'dark'
    }
  },

  // 3. 函数模式 - 动态计算props
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    props: (route) => ({
      query: route.query.q,
      page: parseInt(route.query.page) || 1,
      category: route.query.category || 'all'
    })
  },

  // 命名视图的props配置
  {
    path: '/dashboard',
    name: 'dashboard',
    components: {
      default: DashboardView,
      sidebar: SidebarView,
      header: HeaderView
    },
    props: {
      default: true,
      sidebar: { collapsed: false },
      header: (route) => ({
        title: route.meta.title,
        showSearch: true
      })
    }
  }
]
```

```vue
<!-- UserView.vue - 使用props接收路由参数 -->
<template>
  <div class="user-view">
    <h1>用户详情</h1>
    <p>用户ID: {{ id }}</p>
    <p>用户类型: {{ userType }}</p>

    <UserProfile
      :user-id="id"
      :show-edit="canEdit"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import UserProfile from './UserProfile.vue'

// 通过props接收路由参数
const props = defineProps({
  id: {
    type: String,
    required: true,
    validator: (value) => /^\d+$/.test(value)
  },
  userType: {
    type: String,
    default: 'regular'
  }
})

// 计算属性
const canEdit = computed(() => {
  return props.userType === 'admin' || props.id === currentUserId
})

// 生命周期
onMounted(() => {
  console.log('用户ID:', props.id)
  loadUserData(props.id)
})

const handleUpdate = (userData) => {
  // 处理用户更新
}
</script>
```

```vue
<!-- SearchView.vue - 函数模式props示例 -->
<template>
  <div class="search-view">
    <SearchForm
      :initial-query="query"
      :current-page="page"
      :selected-category="category"
      @search="handleSearch"
    />

    <SearchResults
      :results="results"
      :loading="loading"
      :total-pages="totalPages"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'Vue Router'

// 接收通过函数模式计算的props
const props = defineProps({
  query: String,
  page: {
    type: Number,
    default: 1
  },
  category: {
    type: String,
    default: 'all'
  }
})

const router = useRouter()
const results = ref([])
const loading = ref(false)
const totalPages = ref(0)

// 监听props变化
watch(
  () => [props.query, props.page, props.category],
  async ([newQuery, newPage, newCategory]) => {
    if (newQuery) {
      await performSearch(newQuery, newPage, newCategory)
    }
  },
  { immediate: true }
)

const handleSearch = (searchParams) => {
  router.push({
    name: 'search',
    query: {
      q: searchParams.query,
      page: searchParams.page,
      category: searchParams.category
    }
  })
}

const performSearch = async (query, page, category) => {
  loading.value = true
  try {
    const response = await searchAPI(query, page, category)
    results.value = response.data
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

```javascript
// 单元测试示例 - props模式的优势
import { mount } from '@vue/test-utils'
import UserView from './UserView.vue'

describe('UserView', () => {
  it('应该正确显示用户ID', () => {
    const wrapper = mount(UserView, {
      props: {
        id: '123',
        userType: 'admin'
      }
    })

    expect(wrapper.text()).toContain('用户ID: 123')
    expect(wrapper.text()).toContain('用户类型: admin')
  })

  it('应该验证ID格式', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    mount(UserView, {
      props: {
        id: 'invalid-id' // 无效ID
      }
    })

    expect(consoleError).toHaveBeenCalled()
  })
})
```

**使用场景对比：**
- **布尔模式**: 简单的参数传递，如用户ID、文章ID
- **对象模式**: 静态配置，如主题设置、功能开关
- **函数模式**: 复杂的参数处理，如搜索页面、列表筛选

**最佳实践：**
- 优先使用props模式，避免组件直接依赖$route
- 为props添加类型检查和默认值
- 使用函数模式处理复杂的参数转换
- 命名视图可以为每个视图单独配置props

### 记忆要点总结
- 三种模式：布尔、对象、函数
- 布尔模式：props: true，传递params
- 对象模式：props: {}，传递静态值
- 函数模式：props: (route) => {}，动态计算
- 优势：解耦、测试友好、类型安全

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：如何将路由参数作为组件 props 传入？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
