# Pinia 的 `mapState` / `mapActions` 如何在 Options API 中使用？

> 来源：`docs/pinia/pinia_part_1_answer.md`

## 问题本质解读

这道题考察Pinia在Options API中的使用方式，面试官想了解你是否掌握不同API风格的适配。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. mapState和mapActions适用于Options API，不是组合式API
2. mapState映射为computed，不是"compute"

## 知识点系统梳理

mapState和mapActions 适用于 Options API的结构
mapState 将getters 映射为computed
mapActions 将actions映射为methods

### 问题本质解读 这道题考察Pinia在Options API中的使用方式，面试官想了解你是否掌握不同API风格的适配。

### 技术错误纠正
1. mapState和mapActions适用于Options API，不是组合式API
2. mapState映射为computed，不是"compute"

### 实战应用举例
```javascript
// store定义
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    users: [],
    loading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => state.user?.name || 'Guest',
    userCount: (state) => state.users.length
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        this.user = await api.login(credentials)
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
    },

    async fetchUsers() {
      this.loading = true
      try {
        this.users = await api.getUsers()
      } finally {
        this.loading = false
      }
    }
  }
})

// Options API中使用mapState和mapActions
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
  computed: {
    // 1. 基本映射 - 映射state和getters
    ...mapState(useUserStore, ['user', 'users', 'loading']),
    ...mapState(useUserStore, ['isLoggedIn', 'userName', 'userCount']),

    // 2. 重命名映射
    ...mapState(useUserStore, {
      currentUser: 'user',
      userList: 'users',
      isLoading: 'loading',
      loggedIn: 'isLoggedIn'
    }),

    // 3. 使用函数形式（可以添加额外逻辑）
    ...mapState(useUserStore, {
      userInfo: (store) => {
        return store.user ? {
          name: store.user.name,
          email: store.user.email,
          isAdmin: store.user.role === 'admin'
        } : null
      },

      userStats: (store) => ({
        totalUsers: store.users.length,
        activeUsers: store.users.filter(u => u.isActive).length
      })
    })
  },

  methods: {
    // 1. 基本映射actions
    ...mapActions(useUserStore, ['login', 'logout', 'fetchUsers']),

    // 2. 重命名actions
    ...mapActions(useUserStore, {
      signIn: 'login',
      signOut: 'logout',
      loadUsers: 'fetchUsers'
    }),

    // 3. 自定义方法结合actions
    async handleLogin(credentials) {
      try {
        await this.login(credentials)
        this.$router.push('/dashboard')
      } catch (error) {
        this.showError(error.message)
      }
    },

    async handleLogout() {
      this.logout()
      this.$router.push('/login')
    }
  },

  // 在生命周期中使用
  async created() {
    if (this.isLoggedIn) {
      await this.fetchUsers()
    }
  }
}

// 多个store的映射
import { useUserStore } from '@/stores/user'
import { useProductStore } from '@/stores/product'

export default {
  computed: {
    // 映射多个store
    ...mapState(useUserStore, ['user', 'isLoggedIn']),
    ...mapState(useProductStore, ['products', 'categories']),

    // 避免命名冲突
    ...mapState(useUserStore, {
      userLoading: 'loading'
    }),
    ...mapState(useProductStore, {
      productLoading: 'loading'
    })
  },

  methods: {
    ...mapActions(useUserStore, ['login', 'logout']),
    ...mapActions(useProductStore, ['fetchProducts', 'createProduct'])
  }
}

// 在模板中使用
<template>
  <div>
    <div v-if="isLoading">Loading...</div>

    <div v-if="isLoggedIn">
      <h1>Welcome, {{ userName }}!</h1>
      <p>Total users: {{ userCount }}</p>

      <button @click="handleLogout">Logout</button>
      <button @click="loadUsers">Refresh Users</button>
    </div>

    <div v-else>
      <button @click="handleLogin({ email: 'test@example.com', password: '123' })">
        Login
      </button>
    </div>

    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>
```

**使用场景对比：**

| 使用场景 | Options API | Composition API |
|----------|-------------|-----------------|
| **基本状态映射** | `...mapState(useStore, ['prop'])` | `const { prop } = storeToRefs(store)` |
| **动作映射** | `...mapActions(useStore, ['action'])` | `const { action } = store` |
| **重命名** | `...mapState(useStore, { newName: 'oldName' })` | `const newName = computed(() => store.oldName)` |
| **多store使用** | 多个`mapState`/`mapActions`调用 | 多个`useStore`调用 |
| **自定义逻辑** | 函数映射 | `computed`和普通函数 |
| **模板使用** | 直接使用映射属性和方法 | 直接使用返回的属性和方法 |

**实现原理与解析：**
```javascript
// mapState简化实现
function mapState(useStore, keysOrMapper) {
  const store = useStore()
  const storeKey = store.$id
  
  // 处理数组形式
  if (Array.isArray(keysOrMapper)) {
    return keysOrMapper.reduce((mappedState, key) => {
      mappedState[key] = function() {
        return store[key]
      }
      return mappedState
    }, {})
  }
  
  // 处理对象形式
  return Object.keys(keysOrMapper).reduce((mappedState, key) => {
    const mapFn = keysOrMapper[key]
    
    // 函数形式
    if (typeof mapFn === 'function') {
      mappedState[key] = function() {
        // 调用用户提供的函数，并传入store
        return mapFn.call(this, store)
      }
    } 
    // 字符串形式（重命名）
    else {
      mappedState[key] = function() {
        return store[mapFn]
      }
    }
    
    return mappedState
  }, {})
}
```

### 记忆要点总结
- **映射机制**: 
  - mapState映射state和getters到computed属性
  - mapActions映射actions到methods方法
- **映射方式**:
  - 数组形式：原名映射
  - 对象形式：重命名或自定义函数
- **注意事项**:
  - 需要在computed/methods中展开
  - 使用函数形式可添加自定义逻辑
  - 避免命名冲突
- **优势**:
  - 兼容Options API
  - 简化store访问
  - 支持灵活的映射方式

---

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：Pinia 的 `mapState` / `mapActions` 如何在 Options API 中使用？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
