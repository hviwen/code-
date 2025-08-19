
**Pinia 是什么？为什么选它代替 Vuex？**

pinia是一个为vue3定制的数据状态管理库，是vuex的升级版。

pinia 去掉了vuex中mountion冗余的部分，pinia操作更简单，typescript更友好，api实现更简单

## 深度分析与补充

**问题本质解读：** 这道题考察对现代Vue状态管理的理解，面试官想了解你是否掌握Pinia相比Vuex的核心优势和设计理念。

**技术错误纠正：**
1. "mountion"应为"mutation"
2. 缺少Pinia的核心特性和具体优势说明

**知识点系统梳理：**

**Pinia的核心特点：**
1. **更简单的API**: 去除了mutations，直接在actions中修改state
2. **完整的TypeScript支持**: 无需额外配置即可获得类型推导
3. **模块化设计**: 每个store都是独立的，无需命名空间
4. **组合式API友好**: 原生支持Composition API
5. **更好的开发体验**: 内置devtools支持，热重载

**与Vuex的详细对比：**
```javascript
// Vuex 4 写法
const store = createStore({
  state: {
    count: 0,
    user: null
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    async fetchUser({ commit }, userId) {
      const user = await api.getUser(userId)
      commit('SET_USER', user)
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})

// Pinia 写法 - 更简洁
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: null
  }),
  actions: {
    increment() {
      this.count++ // 直接修改，无需mutation
    },
    async fetchUser(userId) {
      this.user = await api.getUser(userId) // 直接赋值
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})
```

**Pinia的优势详解：**
1. **去除Mutations**: 减少样板代码，actions可以直接修改state
2. **自动代码分割**: 每个store都是独立的模块
3. **更好的TypeScript体验**: 自动类型推导，无需手动定义类型
4. **支持多个stores**: 可以在一个组件中使用多个store
5. **插件系统**: 更灵活的扩展机制

**记忆要点总结：**
- 核心优势：简化API、TypeScript友好、模块化、组合式API支持
- 主要改进：去除mutations、自动类型推导、更好的开发体验
- 适用场景：Vue 3项目、需要TypeScript支持、追求简洁API

---

**如何创建一个基本的 Pinia store？举例。**

可以通过 pinia中的defineStore函数，第一个参数是模块名称，第二个参数是一个对象

```javascript
const pinia = defineStore('counter',{
  state:()=>({
    count:0
  }),
  getters:{
    double:(state)=>state.count *2
  },
  actions:{
    increment(){
      this.count++
    }
  }
})
```

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia store的基本创建语法，面试官想了解你是否掌握不同的store定义方式。

**技术错误纠正：**
1. 变量名应该使用"use"前缀，如`useCounterStore`
2. 缺少store的使用方法和组合式API写法

**知识点系统梳理：**

**两种定义方式：**
```javascript
// 1. Options API 风格（推荐用于简单场景）
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter Store'
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    // 访问其他getter
    quadrupleCount() {
      return this.doubleCount * 2
    },
    // 带参数的getter
    getCountPlusN: (state) => (n) => state.count + n
  },

  actions: {
    increment() {
      this.count++
    },
    incrementBy(amount) {
      this.count += amount
    },
    async fetchData() {
      try {
        const data = await api.getData()
        this.name = data.name
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
  }
})

// 2. Composition API 风格（推荐用于复杂逻辑）
export const useUserStore = defineStore('user', () => {
  // state
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // getters
  const isLoggedIn = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || 'Guest')

  // actions
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authAPI.login(credentials)
      user.value = response.user
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    error.value = null
  }

  // 返回需要暴露的内容
  return {
    // state
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // getters
    isLoggedIn,
    userName,

    // actions
    login,
    logout
  }
})
```

**完整的使用示例：**
```javascript
// 在组件中使用
<template>
  <div>
    <h2>{{ store.name }}</h2>
    <p>Count: {{ store.count }}</p>
    <p>Double: {{ store.doubleCount }}</p>
    <p>Plus 10: {{ store.getCountPlusN(10) }}</p>

    <button @click="store.increment()">+1</button>
    <button @click="store.incrementBy(5)">+5</button>
    <button @click="handleFetch">Fetch Data</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// 解构时需要使用storeToRefs保持响应性
import { storeToRefs } from 'pinia'
const { count, doubleCount } = storeToRefs(store)
const { increment, incrementBy } = store

const handleFetch = async () => {
  try {
    await store.fetchData()
  } catch (error) {
    console.error('Fetch failed:', error)
  }
}
</script>

// TypeScript 支持
interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state): boolean => !!state.user,
    userName: (state): string => state.user?.name || 'Guest'
  },

  actions: {
    async login(credentials: LoginCredentials): Promise<void> {
      // 实现登录逻辑
    }
  }
})
```

**记忆要点总结：**
- 两种风格：Options API（简单）、Composition API（复杂逻辑）
- 命名规范：use + StoreName + Store
- 基本结构：state（数据）、getters（计算属性）、actions（方法）
- TypeScript：自动类型推导，也可手动定义接口

---

**store 的 `state`、`getters`、`actions` 分别是什么角色？**

State : 维护一个组件树的状态值

getters：返回一个状态值的计算结果，缓存，可以避免昂贵和重复的计算

acions：修改状态值的方法

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia store架构的核心概念，面试官想了解你是否理解状态管理的基本模式。

**技术错误纠正：**
1. "acions"应为"actions"
2. 缺少具体的使用场景和代码示例

**知识点系统梳理：**

**State（状态）：**
- 存储应用的数据
- 必须是函数返回对象（支持SSR）
- 响应式的，变化会自动更新视图

**Getters（计算属性）：**
- 基于state计算衍生数据
- 具有缓存特性，依赖不变时不重新计算
- 可以访问其他getters
- 支持传参（返回函数）

**Actions（动作）：**
- 修改state的唯一方式
- 支持异步操作
- 可以调用其他actions
- 可以访问整个store实例

**实战应用举例：**
```javascript
export const useShoppingCartStore = defineStore('shoppingCart', {
  // State - 存储购物车数据
  state: () => ({
    items: [], // 商品列表
    isLoading: false, // 加载状态
    discount: 0, // 折扣
    shippingFee: 10 // 运费
  }),

  // Getters - 计算衍生数据
  getters: {
    // 商品总数
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    // 商品总价
    subtotal: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    // 折扣金额
    discountAmount() {
      return this.subtotal * this.discount
    },

    // 最终总价
    total() {
      return this.subtotal - this.discountAmount + this.shippingFee
    },

    // 带参数的getter - 查找特定商品
    getItemById: (state) => (id) => {
      return state.items.find(item => item.id === id)
    },

    // 访问其他getter
    formattedTotal() {
      return `$${this.total.toFixed(2)}`
    }
  },

  // Actions - 修改状态的方法
  actions: {
    // 添加商品
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        })
      }
    },

    // 移除商品
    removeItem(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    // 更新数量
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = quantity
        }
      }
    },

    // 异步操作 - 应用优惠券
    async applyCoupon(couponCode) {
      this.isLoading = true

      try {
        const response = await api.validateCoupon(couponCode)
        this.discount = response.discount
        return { success: true, message: 'Coupon applied successfully' }
      } catch (error) {
        return { success: false, message: error.message }
      } finally {
        this.isLoading = false
      }
    },

    // 清空购物车
    clearCart() {
      this.items = []
      this.discount = 0
    },

    // 调用其他actions
    async checkout() {
      if (this.totalItems === 0) {
        throw new Error('Cart is empty')
      }

      try {
        const orderData = {
          items: this.items,
          total: this.total,
          discount: this.discountAmount
        }

        const order = await api.createOrder(orderData)
        this.clearCart() // 调用其他action
        return order
      } catch (error) {
        throw new Error(`Checkout failed: ${error.message}`)
      }
    }
  }
})
```

**角色总结：**
- **State**: 数据仓库，存储应用状态
- **Getters**: 数据加工厂，计算衍生数据
- **Actions**: 操作中心，处理业务逻辑和状态变更

**记忆要点总结：**
- State：响应式数据存储，函数返回对象
- Getters：计算属性，有缓存，可传参，可互相访问
- Actions：业务逻辑，可异步，可调用其他actions
- 数据流：State → Getters → 组件 → Actions → State

---

**如何在组件中使用 store？**

在组件内引用创建的store 通过调用store中的actions方法

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia在Vue组件中的具体使用方法，面试官想了解你是否掌握不同的使用模式。

**知识点系统梳理：**

**基本使用方式：**
```vue
<template>
  <div class="shopping-cart">
    <!-- 直接访问store -->
    <h2>购物车 ({{ store.totalItems }} 件商品)</h2>
    <p>总价: {{ store.formattedTotal }}</p>

    <!-- 使用解构的响应式数据 -->
    <div v-for="item in items" :key="item.id" class="cart-item">
      <span>{{ item.name }}</span>
      <span>${{ item.price }}</span>
      <input
        v-model.number="item.quantity"
        @change="updateQuantity(item.id, item.quantity)"
        type="number"
        min="1"
      />
      <button @click="removeItem(item.id)">删除</button>
    </div>

    <button @click="handleCheckout" :disabled="isLoading">
      {{ isLoading ? '处理中...' : '结账' }}
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useShoppingCartStore } from '@/stores/shoppingCart'

// 获取store实例
const store = useShoppingCartStore()

// 解构响应式数据（必须使用storeToRefs）
const { items, isLoading, totalItems } = storeToRefs(store)

// 解构actions（不需要storeToRefs）
const { addItem, removeItem, updateQuantity, checkout } = store

// 使用actions
const handleCheckout = async () => {
  try {
    const order = await checkout()
    console.log('Order created:', order)
  } catch (error) {
    console.error('Checkout failed:', error.message)
  }
}
</script>
```

**不同使用模式：**
```javascript
// 1. 直接使用store实例
export default {
  setup() {
    const cartStore = useShoppingCartStore()

    // 直接访问
    const addProduct = (product) => {
      cartStore.addItem(product)
    }

    return {
      cartStore,
      addProduct
    }
  }
}

// 2. 解构使用（推荐）
export default {
  setup() {
    const cartStore = useShoppingCartStore()

    // 响应式数据需要storeToRefs
    const { items, totalItems, total } = storeToRefs(cartStore)

    // actions直接解构
    const { addItem, removeItem } = cartStore

    return {
      items,
      totalItems,
      total,
      addItem,
      removeItem
    }
  }
}

// 3. 在Options API中使用
import { mapState, mapActions } from 'pinia'
import { useShoppingCartStore } from '@/stores/shoppingCart'

export default {
  computed: {
    // 映射state和getters
    ...mapState(useShoppingCartStore, ['items', 'totalItems', 'total']),

    // 或者使用对象形式重命名
    ...mapState(useShoppingCartStore, {
      cartItems: 'items',
      itemCount: 'totalItems'
    })
  },

  methods: {
    // 映射actions
    ...mapActions(useShoppingCartStore, ['addItem', 'removeItem']),

    // 或者重命名
    ...mapActions(useShoppingCartStore, {
      add: 'addItem',
      remove: 'removeItem'
    })
  }
}
```

**记忆要点总结：**
- 基本用法：const store = useStore()
- 解构数据：storeToRefs(store) 保持响应性
- 解构方法：直接从store解构actions
- Options API：使用mapState和mapActions

---

**Pinia 与组件组合函数（composables）如何配合？**

:

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia与Composition API的集成，面试官想了解你是否能将状态管理与组合式函数有效结合。

**知识点系统梳理：**

**Pinia与Composables的完美结合：**
```javascript
// 1. 基于Pinia的组合式函数
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // 解构store数据
  const { user, isLoading, error } = storeToRefs(authStore)
  const { login, logout, refreshToken } = authStore

  // 扩展功能
  const isAdmin = computed(() => user.value?.role === 'admin')
  const hasPermission = (permission) => {
    return user.value?.permissions?.includes(permission) || false
  }

  // 自动登录逻辑
  const autoLogin = async () => {
    const token = localStorage.getItem('token')
    if (token && !user.value) {
      try {
        await refreshToken()
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
  }

  // 登录并跳转
  const loginAndRedirect = async (credentials, redirectTo = '/dashboard') => {
    try {
      await login(credentials)
      router.push(redirectTo)
    } catch (error) {
      throw error
    }
  }

  // 登出并清理
  const logoutAndRedirect = () => {
    logout()
    localStorage.removeItem('token')
    router.push('/login')
  }

  return {
    // store数据
    user,
    isLoading,
    error,

    // 计算属性
    isAdmin,

    // 方法
    login,
    logout,
    hasPermission,
    autoLogin,
    loginAndRedirect,
    logoutAndRedirect
  }
}

// 2. 数据获取组合函数
export function useApi(endpoint, options = {}) {
  const { immediate = true, transform = (data) => data } = options

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 可以在这里使用其他store
  const authStore = useAuthStore()

  const execute = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      data.value = transform(result)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    refresh: execute
  }
}

// 3. 表单处理组合函数
export function useForm(initialData, validationRules = {}) {
  const formData = reactive({ ...initialData })
  const errors = reactive({})
  const isSubmitting = ref(false)

  // 可以集成用户store获取用户信息
  const userStore = useUserStore()

  const validate = () => {
    Object.keys(errors).forEach(key => delete errors[key])

    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field]
      const value = formData[field]

      if (rule.required && !value) {
        errors[field] = `${field} is required`
      } else if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.message || `${field} is invalid`
      }
    })

    return Object.keys(errors).length === 0
  }

  const submit = async (submitFn) => {
    if (!validate()) return false

    isSubmitting.value = true
    try {
      // 可以在提交时自动添加用户信息
      const dataToSubmit = {
        ...formData,
        userId: userStore.user?.id
      }

      await submitFn(dataToSubmit)
      return true
    } catch (error) {
      errors.submit = error.message
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const reset = () => {
    Object.assign(formData, initialData)
    Object.keys(errors).forEach(key => delete errors[key])
  }

  return {
    formData,
    errors,
    isSubmitting,
    validate,
    submit,
    reset
  }
}
```

**在组件中的使用：**
```vue
<template>
  <div>
    <!-- 使用认证组合函数 -->
    <div v-if="user">
      <h1>欢迎, {{ user.name }}</h1>
      <button v-if="isAdmin" @click="goToAdmin">管理面板</button>
      <button @click="logoutAndRedirect">登出</button>
    </div>

    <!-- 使用API组合函数 -->
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error.message }}</div>
    <div v-else>
      <div v-for="item in data" :key="item.id">
        {{ item.name }}
      </div>
    </div>

    <!-- 使用表单组合函数 -->
    <form @submit.prevent="handleSubmit">
      <input v-model="formData.name" placeholder="姓名" />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '提交中...' : '提交' }}
      </button>
    </form>
  </div>
</template>

<script setup>
// 组合多个composables
const { user, isAdmin, logoutAndRedirect } = useAuth()
const { data, loading, error } = useApi('/api/items')
const { formData, errors, isSubmitting, submit } = useForm(
  { name: '', email: '' },
  {
    name: { required: true },
    email: { required: true, pattern: /\S+@\S+\.\S+/ }
  }
)

const handleSubmit = () => {
  submit(async (data) => {
    await api.createItem(data)
  })
}
</script>
```

**记忆要点总结：**
- 完美集成：Pinia store + Composition API
- 扩展功能：在composables中使用store，添加业务逻辑
- 代码复用：将常用的store操作封装成composables
- 最佳实践：单一职责、可测试、易维护

---

**如何在 Pinia 中进行异步操作？（示例）**

可以在actions定义的函数执行异步操作 （async await）

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia中异步操作的处理方式，面试官想了解你是否掌握异步状态管理的最佳实践。

**实战应用举例：**
```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    // 1. 基本异步操作
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const response = await api.getUsers({
          page: this.pagination.page,
          limit: this.pagination.limit
        })

        this.users = response.data
        this.pagination.total = response.total
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 2. 带参数的异步操作
    async fetchUserById(userId) {
      this.loading = true

      try {
        const user = await api.getUserById(userId)
        this.currentUser = user
        return user
      } catch (error) {
        this.error = `Failed to fetch user: ${error.message}`
        throw error
      } finally {
        this.loading = false
      }
    },

    // 3. 复杂异步操作 - 创建用户
    async createUser(userData) {
      this.loading = true
      this.error = null

      try {
        // 验证数据
        if (!userData.email || !userData.name) {
          throw new Error('Email and name are required')
        }

        // 创建用户
        const newUser = await api.createUser(userData)

        // 更新本地状态
        this.users.unshift(newUser)
        this.pagination.total++

        return newUser
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // 4. 批量异步操作
    async batchUpdateUsers(updates) {
      this.loading = true
      const results = []
      const errors = []

      try {
        // 并发执行多个更新
        const promises = updates.map(async (update) => {
          try {
            const result = await api.updateUser(update.id, update.data)
            results.push(result)

            // 更新本地状态
            const index = this.users.findIndex(u => u.id === update.id)
            if (index !== -1) {
              this.users[index] = result
            }

            return result
          } catch (error) {
            errors.push({ id: update.id, error: error.message })
            throw error
          }
        })

        await Promise.allSettled(promises)

        if (errors.length > 0) {
          this.error = `${errors.length} updates failed`
        }

        return { results, errors }
      } finally {
        this.loading = false
      }
    },

    // 5. 带重试机制的异步操作
    async fetchWithRetry(fetchFn, maxRetries = 3) {
      let lastError

      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fetchFn()
        } catch (error) {
          lastError = error

          if (i < maxRetries - 1) {
            // 指数退避
            const delay = Math.pow(2, i) * 1000
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }

      this.error = `Failed after ${maxRetries} attempts: ${lastError.message}`
      throw lastError
    }
  }
})

// 使用组合式API风格的异步操作
export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 异步获取文章
  const fetchPosts = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.getPosts(params)
      posts.value = response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // 异步创建文章
  const createPost = async (postData) => {
    loading.value = true

    try {
      const newPost = await api.createPost(postData)
      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    posts: readonly(posts),
    loading: readonly(loading),
    error: readonly(error),
    fetchPosts,
    createPost
  }
})
```

**记忆要点总结：**
- 基本模式：async/await + try/catch/finally
- 状态管理：loading、error、data三状态模式
- 错误处理：捕获异常，更新error状态
- 本地更新：异步操作成功后更新本地state

---

**如何持久化 Pinia 的 state？有什么常用方案？**

storage

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia状态持久化的实现方案，面试官想了解你是否掌握客户端状态持久化的各种策略。

**知识点系统梳理：**

**1. 官方插件方案 - pinia-plugin-persistedstate：**
```javascript
// 安装：npm install pinia-plugin-persistedstate

// main.js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// store定义
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    preferences: {
      theme: 'light',
      language: 'en'
    }
  }),

  // 启用持久化
  persist: true
})

// 自定义持久化配置
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    notifications: true,
    autoSave: false
  }),

  persist: {
    // 自定义key
    key: 'app-settings',

    // 选择存储方式
    storage: sessionStorage,

    // 只持久化部分字段
    paths: ['theme', 'notifications'],

    // 自定义序列化
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  }
})
```

**2. 手动实现持久化：**
```javascript
// 通用持久化工具
class StoragePersistence {
  constructor(storage = localStorage) {
    this.storage = storage
  }

  save(key, data) {
    try {
      this.storage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  load(key, defaultValue = null) {
    try {
      const item = this.storage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Failed to load from storage:', error)
      return defaultValue
    }
  }

  remove(key) {
    try {
      this.storage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from storage:', error)
    }
  }
}

// 手动持久化的store
export const useAuthStore = defineStore('auth', {
  state: () => {
    const persistence = new StoragePersistence()

    return {
      user: persistence.load('auth.user'),
      token: persistence.load('auth.token'),
      isLoggedIn: false
    }
  },

  actions: {
    login(user, token) {
      this.user = user
      this.token = token
      this.isLoggedIn = true

      // 手动保存到localStorage
      const persistence = new StoragePersistence()
      persistence.save('auth.user', user)
      persistence.save('auth.token', token)
    },

    logout() {
      this.user = null
      this.token = null
      this.isLoggedIn = false

      // 清除存储
      const persistence = new StoragePersistence()
      persistence.remove('auth.user')
      persistence.remove('auth.token')
    }
  }
})
```

**3. 高级持久化策略：**
```javascript
// 分层存储策略
export const useAppStore = defineStore('app', {
  state: () => ({
    // 敏感数据 - 不持久化
    temporaryData: null,

    // 会话数据 - sessionStorage
    sessionData: {
      currentTab: 'home',
      scrollPosition: 0
    },

    // 用户偏好 - localStorage
    userPreferences: {
      theme: 'light',
      language: 'en',
      fontSize: 'medium'
    },

    // 缓存数据 - IndexedDB
    cachedData: new Map()
  }),

  persist: [
    {
      key: 'app-session',
      storage: sessionStorage,
      paths: ['sessionData']
    },
    {
      key: 'app-preferences',
      storage: localStorage,
      paths: ['userPreferences']
    }
  ]
})

// IndexedDB持久化
class IndexedDBPersistence {
  constructor(dbName = 'app-store', version = 1) {
    this.dbName = dbName
    this.version = version
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store', { keyPath: 'key' })
        }
      }
    })
  }

  async save(key, data) {
    if (!this.db) await this.init()

    const transaction = this.db.transaction(['store'], 'readwrite')
    const store = transaction.objectStore('store')

    return new Promise((resolve, reject) => {
      const request = store.put({ key, data, timestamp: Date.now() })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async load(key) {
    if (!this.db) await this.init()

    const transaction = this.db.transaction(['store'], 'readonly')
    const store = transaction.objectStore('store')

    return new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.data : null)
      }
      request.onerror = () => reject(request.error)
    })
  }
}

// 使用IndexedDB的store
export const useCacheStore = defineStore('cache', () => {
  const cache = ref(new Map())
  const persistence = new IndexedDBPersistence()

  const saveToCache = async (key, data) => {
    cache.value.set(key, data)
    await persistence.save(key, data)
  }

  const loadFromCache = async (key) => {
    if (cache.value.has(key)) {
      return cache.value.get(key)
    }

    const data = await persistence.load(key)
    if (data) {
      cache.value.set(key, data)
    }
    return data
  }

  return {
    cache: readonly(cache),
    saveToCache,
    loadFromCache
  }
})
```

**4. 持久化最佳实践：**
```javascript
// 智能持久化策略
export const createSmartPersistence = (options = {}) => {
  const {
    maxAge = 7 * 24 * 60 * 60 * 1000, // 7天
    compress = false,
    encrypt = false
  } = options

  return {
    serialize: (data) => {
      const payload = {
        data,
        timestamp: Date.now(),
        version: '1.0'
      }

      let serialized = JSON.stringify(payload)

      if (compress) {
        // 使用压缩库
        serialized = LZString.compress(serialized)
      }

      if (encrypt) {
        // 使用加密库
        serialized = CryptoJS.AES.encrypt(serialized, 'secret-key').toString()
      }

      return serialized
    },

    deserialize: (serialized) => {
      try {
        if (encrypt) {
          const bytes = CryptoJS.AES.decrypt(serialized, 'secret-key')
          serialized = bytes.toString(CryptoJS.enc.Utf8)
        }

        if (compress) {
          serialized = LZString.decompress(serialized)
        }

        const payload = JSON.parse(serialized)

        // 检查过期时间
        if (Date.now() - payload.timestamp > maxAge) {
          return null
        }

        return payload.data
      } catch (error) {
        console.error('Failed to deserialize:', error)
        return null
      }
    }
  }
}
```

**记忆要点总结：**
- 官方方案：pinia-plugin-persistedstate插件
- 存储选择：localStorage（持久）、sessionStorage（会话）、IndexedDB（大数据）
- 策略分层：敏感数据不存储、会话数据临时存储、偏好数据持久存储
- 高级特性：压缩、加密、过期时间、版本控制

---

**如何在组件中只监听 store 的某个字段变化？**

使用 watch

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia中精确监听特定字段的方法，面试官想了解你是否掌握细粒度的状态监听技巧。

**实战应用举例：**
```javascript
// 在组件中监听store的特定字段
export default {
  setup() {
    const userStore = useUserStore()
    const { user, settings, notifications } = storeToRefs(userStore)

    // 1. 监听单个字段
    watch(
      () => user.value?.name,
      (newName, oldName) => {
        console.log(`用户名从 ${oldName} 变更为 ${newName}`)
        // 执行相关逻辑
        updateUserProfile(newName)
      }
    )

    // 2. 监听嵌套对象的特定属性
    watch(
      () => settings.value?.theme,
      (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme)
      },
      { immediate: true }
    )

    // 3. 监听数组长度变化
    watch(
      () => notifications.value?.length,
      (newLength, oldLength) => {
        if (newLength > oldLength) {
          showNotificationBadge()
        }
      }
    )

    // 4. 监听多个字段
    watch(
      [() => user.value?.id, () => settings.value?.language],
      ([newUserId, newLang], [oldUserId, oldLang]) => {
        if (newUserId !== oldUserId || newLang !== oldLang) {
          reloadUserData()
        }
      }
    )

    // 5. 使用watchEffect自动收集依赖
    watchEffect(() => {
      if (user.value?.isOnline) {
        startHeartbeat()
      } else {
        stopHeartbeat()
      }
    })

    return {
      user,
      settings,
      notifications
    }
  }
}

// 更高级的监听模式
export function useStoreWatcher() {
  const store = useUserStore()

  // 创建选择性监听器
  const createFieldWatcher = (selector, callback, options = {}) => {
    return watch(
      () => selector(store),
      callback,
      {
        deep: false,
        immediate: false,
        ...options
      }
    )
  }

  // 监听用户状态变化
  const watchUserStatus = (callback) => {
    return createFieldWatcher(
      (store) => store.user?.status,
      callback,
      { immediate: true }
    )
  }

  // 监听权限变化
  const watchPermissions = (callback) => {
    return createFieldWatcher(
      (store) => store.user?.permissions,
      callback,
      { deep: true }
    )
  }

  // 监听特定设置项
  const watchSetting = (settingKey, callback) => {
    return createFieldWatcher(
      (store) => store.settings?.[settingKey],
      callback
    )
  }

  return {
    watchUserStatus,
    watchPermissions,
    watchSetting
  }
}

// 在组件中使用
const { watchUserStatus, watchSetting } = useStoreWatcher()

// 监听用户在线状态
const stopWatchingStatus = watchUserStatus((status) => {
  if (status === 'offline') {
    showOfflineMessage()
  }
})

// 监听主题设置
const stopWatchingTheme = watchSetting('theme', (theme) => {
  applyTheme(theme)
})

// 组件卸载时停止监听
onUnmounted(() => {
  stopWatchingStatus()
  stopWatchingTheme()
})
```

**使用$subscribe方法：**
```javascript
// Pinia提供的专门监听方法
export default {
  setup() {
    const store = useUserStore()

    // 监听整个store的变化
    const unsubscribe = store.$subscribe((mutation, state) => {
      console.log('Store mutation:', mutation)
      console.log('New state:', state)

      // 只处理特定字段的变化
      if (mutation.storeId === 'user' && mutation.type === 'direct') {
        if (mutation.events.key === 'theme') {
          handleThemeChange(mutation.events.newValue)
        }
      }
    })

    // 监听actions的调用
    const unsubscribeAction = store.$onAction(({
      name, // action名称
      store, // store实例
      args, // 传递给action的参数
      after, // action成功后的钩子
      onError // action失败后的钩子
    }) => {
      console.log(`Action ${name} called with args:`, args)

      after((result) => {
        console.log(`Action ${name} completed with result:`, result)
      })

      onError((error) => {
        console.error(`Action ${name} failed:`, error)
      })
    })

    onUnmounted(() => {
      unsubscribe()
      unsubscribeAction()
    })

    return { store }
  }
}
```

**记忆要点总结：**
- 基本方法：watch(() => store.field, callback)
- 嵌套监听：watch(() => store.obj?.prop, callback)
- 多字段监听：watch([getter1, getter2], callback)
- Pinia专用：$subscribe监听mutations，$onAction监听actions
- 清理机制：组件卸载时停止监听

---

**Pinia 的热重载（HMR）如何工作？**

开发模式下 可以实现热重载 以来开发工具构建

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia的开发体验特性，面试官想了解你是否掌握现代开发工具的集成。

**技术错误纠正：**
1. "以来"应为"依赖"
2. 缺少具体的HMR工作机制说明

**知识点系统梳理：**

**HMR工作原理：**
```javascript
// Pinia自动支持HMR，无需额外配置
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})

// 在Vite中，store文件修改时会自动热重载
// 保持组件状态，只更新store逻辑

// 手动配置HMR（通常不需要）
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
```

**开发工具集成：**
- 自动检测store变化
- 保持应用状态不丢失
- 实时更新store逻辑
- 支持时间旅行调试

**记忆要点总结：**
- 自动支持：Vite/Webpack自动启用HMR
- 状态保持：修改store时保持应用状态
- 开发体验：实时预览store变化
- 调试友好：配合Vue DevTools使用

---

**如何在多个组件间共享同一个 store 实例？**

在不同组件中都使用引入 useStore

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia的单例模式，面试官想了解你是否理解store实例的共享机制。

**实战应用举例：**
```javascript
// store定义（只定义一次）
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  actions: {
    login(userData) {
      this.user = userData
      this.isLoggedIn = true
    }
  }
})

// 组件A
<template>
  <div>用户: {{ user?.name }}</div>
</template>

<script setup>
const userStore = useUserStore() // 获取同一个实例
const { user } = storeToRefs(userStore)
</script>

// 组件B
<template>
  <button @click="handleLogin">登录</button>
</template>

<script setup>
const userStore = useUserStore() // 获取同一个实例
const { login } = userStore

const handleLogin = () => {
  login({ name: 'John', id: 1 })
  // 组件A会自动更新显示
}
</script>
```

**单例机制原理：**
- Pinia内部维护store实例映射
- 相同ID的store返回同一实例
- 跨组件自动同步状态变化
- 无需手动管理实例生命周期

**记忆要点总结：**
- 单例模式：同ID的store返回相同实例
- 自动共享：多个组件使用同一store实例
- 状态同步：一处修改，处处更新
- 简单使用：直接调用useStore即可

---

**Pinia 是否支持模块化命名空间（namespaced）？**

天然支持模块化 每一个defineStore都是唯一的

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia的模块化设计，面试官想了解你是否理解Pinia相比Vuex的模块化改进。

**实战应用举例：**
```javascript
// 不需要命名空间，每个store都是独立的模块
export const useUserStore = defineStore('user', {
  state: () => ({ users: [] }),
  actions: { fetchUsers() {} }
})

export const useProductStore = defineStore('product', {
  state: () => ({ products: [] }),
  actions: { fetchProducts() {} }
})

export const useOrderStore = defineStore('order', {
  state: () => ({ orders: [] }),
  actions: {
    async createOrder(orderData) {
      // 可以直接使用其他store
      const userStore = useUserStore()
      const productStore = useProductStore()

      const user = userStore.currentUser
      const products = productStore.selectedProducts

      // 创建订单逻辑
    }
  }
})

// 在组件中使用多个store
<script setup>
const userStore = useUserStore()
const productStore = useProductStore()
const orderStore = useOrderStore()

// 直接访问，无需命名空间前缀
const { users } = storeToRefs(userStore)
const { products } = storeToRefs(productStore)
const { createOrder } = orderStore
</script>
```

**与Vuex对比：**
```javascript
// Vuex需要命名空间
const store = createStore({
  modules: {
    user: {
      namespaced: true,
      state: () => ({ users: [] }),
      actions: {
        fetchUsers({ commit }) {}
      }
    },
    product: {
      namespaced: true,
      state: () => ({ products: [] })
    }
  }
})

// 使用时需要命名空间
this.$store.dispatch('user/fetchUsers')
this.$store.state.user.users

// Pinia更简洁
const userStore = useUserStore()
userStore.fetchUsers()
userStore.users
```

**记忆要点总结：**
- 天然模块化：每个defineStore都是独立模块
- 无需命名空间：直接通过store ID区分
- 跨模块调用：store间可以直接相互调用
- 更简洁：相比Vuex减少了命名空间复杂性

---

**如何在 setup 外部使用 store（例如在普通 JS 文件）？**

在注册完成组件实例后就可以调用

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia在非组件环境中的使用，面试官想了解你是否掌握store的生命周期和使用限制。

**实战应用举例：**
```javascript
// 1. 在路由守卫中使用
// router/index.js
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  // 路由配置
})

router.beforeEach((to, from, next) => {
  // 必须在app.use(pinia)之后才能使用
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

// 2. 在API拦截器中使用
// api/request.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: '/api'
})

// 请求拦截器
api.interceptors.request.use((config) => {
  // 确保在pinia初始化后使用
  const authStore = useAuthStore()

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

// 3. 在工具函数中使用
// utils/notification.js
import { useNotificationStore } from '@/stores/notification'

export function showSuccess(message) {
  // 需要确保在Vue应用上下文中调用
  const notificationStore = useNotificationStore()
  notificationStore.addNotification({
    type: 'success',
    message,
    duration: 3000
  })
}

// 4. 在服务类中使用
// services/UserService.js
class UserService {
  constructor() {
    // 不能在构造函数中直接使用store
    this.store = null
  }

  init() {
    // 在初始化方法中使用
    this.store = useUserStore()
  }

  async getCurrentUser() {
    if (!this.store) {
      throw new Error('Service not initialized')
    }

    return this.store.currentUser
  }
}

// 5. 正确的初始化顺序
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// 1. 先注册pinia
app.use(pinia)

// 2. 再注册router（这样router守卫中就能使用store）
app.use(router)

// 3. 初始化服务
const userService = new UserService()
userService.init()

app.mount('#app')

// 6. 在非Vue上下文中使用的解决方案
// utils/storeHelper.js
let pinia = null

export function setPinia(piniaInstance) {
  pinia = piniaInstance
}

export function useStoreOutsideSetup(storeDefinition) {
  if (!pinia) {
    throw new Error('Pinia not initialized')
  }

  return storeDefinition(pinia)
}

// main.js中设置
const pinia = createPinia()
setPinia(pinia)
app.use(pinia)

// 在普通JS文件中使用
import { useStoreOutsideSetup } from '@/utils/storeHelper'
import { useAuthStore } from '@/stores/auth'

const authStore = useStoreOutsideSetup(useAuthStore)
```

**使用限制和解决方案：**
```javascript
// 错误用法 - 在模块顶层直接使用
// ❌ 这样会报错，因为pinia还未初始化
const store = useUserStore()

export function someFunction() {
  return store.user
}

// 正确用法 - 在函数内部使用
// ✅ 在函数调用时才获取store
export function someFunction() {
  const store = useUserStore()
  return store.user
}

// 或者使用延迟初始化
let store = null

export function initStore() {
  store = useUserStore()
}

export function someFunction() {
  if (!store) {
    throw new Error('Store not initialized')
  }
  return store.user
}
```

**记忆要点总结：**
- 时机限制：必须在app.use(pinia)之后使用
- 函数内使用：在函数调用时获取store，不要在模块顶层
- 初始化顺序：pinia → router → 其他服务
- 解决方案：延迟初始化、依赖注入、工具函数封装

---

**如何在 Pinia 中实现依赖注入（store 之间互用）？**

可以通过$subscribe订阅其他store 变化 参数（mutation,state）

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia中store间的依赖关系处理，面试官想了解你是否掌握复杂状态管理的设计模式。

**技术错误纠正：**
1. $subscribe主要用于监听变化，不是依赖注入的主要方式
2. 缺少store间直接调用的说明

**实战应用举例：**
```javascript
// 1. 直接在store中使用其他store
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  actions: {
    async addItem(productId, quantity) {
      // 直接使用其他store
      const productStore = useProductStore()
      const userStore = useUserStore()

      // 检查用户权限
      if (!userStore.isLoggedIn) {
        throw new Error('Please login first')
      }

      // 获取产品信息
      const product = await productStore.getProduct(productId)

      // 检查库存
      if (product.stock < quantity) {
        throw new Error('Insufficient stock')
      }

      // 添加到购物车
      this.items.push({
        productId,
        quantity,
        price: product.price,
        name: product.name
      })

      // 更新产品库存
      productStore.updateStock(productId, -quantity)
    }
  }
})

// 2. 使用组合式函数封装依赖关系
export function useOrderManagement() {
  const cartStore = useCartStore()
  const userStore = useUserStore()
  const paymentStore = usePaymentStore()
  const inventoryStore = useInventoryStore()

  const createOrder = async (orderData) => {
    // 验证用户
    if (!userStore.isLoggedIn) {
      throw new Error('User not logged in')
    }

    // 检查购物车
    if (cartStore.items.length === 0) {
      throw new Error('Cart is empty')
    }

    // 验证库存
    for (const item of cartStore.items) {
      const available = await inventoryStore.checkStock(item.productId)
      if (available < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`)
      }
    }

    // 处理支付
    const paymentResult = await paymentStore.processPayment({
      amount: cartStore.total,
      userId: userStore.user.id
    })

    if (paymentResult.success) {
      // 清空购物车
      cartStore.clear()

      // 更新库存
      for (const item of cartStore.items) {
        inventoryStore.reduceStock(item.productId, item.quantity)
      }

      return paymentResult.orderId
    }
  }

  return {
    createOrder
  }
}

// 3. 使用$subscribe实现store间通信
export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),

  actions: {
    init() {
      // 监听用户store的变化
      const userStore = useUserStore()
      userStore.$subscribe((mutation, state) => {
        if (mutation.type === 'direct' && mutation.events.key === 'isLoggedIn') {
          if (state.isLoggedIn) {
            this.addNotification({
              type: 'success',
              message: 'Welcome back!'
            })
          } else {
            this.addNotification({
              type: 'info',
              message: 'You have been logged out'
            })
          }
        }
      })

      // 监听购物车变化
      const cartStore = useCartStore()
      cartStore.$subscribe((mutation, state) => {
        if (mutation.type === 'direct' && mutation.events.key === 'items') {
          const itemCount = state.items.length
          if (itemCount > 0) {
            this.addNotification({
              type: 'info',
              message: `Cart updated: ${itemCount} items`
            })
          }
        }
      })
    }
  }
})
```

**记忆要点总结：**
- 直接调用：在store的actions中直接使用其他store
- 组合封装：使用composables封装复杂的store间交互
- 事件监听：使用$subscribe监听其他store的变化
- 依赖管理：合理设计store间的依赖关系，避免循环依赖

---

**Pinia 的 `mapState` / `mapActions` 如何在 Options API 中使用？**

mapState和mapActions 适用于组合式api的结构
mapState 将getters 映射为compute
mapActions 将actions映射为methods

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia在Options API中的使用方式，面试官想了解你是否掌握不同API风格的适配。

**技术错误纠正：**
1. mapState和mapActions适用于Options API，不是组合式API
2. mapState映射为computed，不是"compute"

**实战应用举例：**
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

**与Composition API对比：**
```javascript
// Options API写法
export default {
  computed: {
    ...mapState(useUserStore, ['user', 'isLoggedIn'])
  },
  methods: {
    ...mapActions(useUserStore, ['login', 'logout'])
  }
}

// Composition API写法
export default {
  setup() {
    const userStore = useUserStore()
    const { user, isLoggedIn } = storeToRefs(userStore)
    const { login, logout } = userStore

    return {
      user,
      isLoggedIn,
      login,
      logout
    }
  }
}
```

**记忆要点总结：**
- mapState：映射state和getters到computed
- mapActions：映射actions到methods
- 支持重命名：使用对象形式映射
- 多store支持：可以同时映射多个store
- 函数形式：支持自定义映射逻辑

---

**Pinia 与 Vue 组件的 devtools 集成如何开启？**

:

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia的开发工具集成，面试官想了解你是否掌握现代开发调试工具的使用。

**实战应用举例：**
```javascript
// 1. 基本集成（通常自动启用）
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

// Pinia会自动检测并集成Vue DevTools
app.use(pinia)

// 2. 自定义DevTools配置
const pinia = createPinia()

// 开发环境下启用详细调试
if (process.env.NODE_ENV === 'development') {
  pinia.use(({ store }) => {
    // 为每个store添加调试信息
    store.$id = store.$id || 'unknown'

    // 添加自定义调试方法
    store.$debug = (message) => {
      console.log(`[${store.$id}] ${message}`)
    }
  })
}

// 3. 生产环境禁用DevTools
const pinia = createPinia()

if (process.env.NODE_ENV === 'production') {
  // 禁用DevTools集成
  pinia._devtools = false
}

// 4. 自定义store标识
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  actions: {
    login(userData) {
      // DevTools会自动记录这个action
      this.user = userData
    }
  }
}, {
  // 自定义DevTools显示名称
  devtools: {
    title: 'User Management Store'
  }
})
```

**DevTools功能特性：**
- **状态检查**: 实时查看store状态
- **时间旅行**: 回溯状态变化历史
- **Action追踪**: 监控action调用和参数
- **Mutation记录**: 记录所有状态变更
- **性能分析**: 分析store操作性能

**记忆要点总结：**
- 自动集成：Pinia自动与Vue DevTools集成
- 开发模式：只在开发环境启用
- 功能丰富：状态检查、时间旅行、性能分析
- 可配置：支持自定义调试信息和显示名称

---

**如何在 SSR 场景下使用 Pinia？**

与nuxt组合

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia在服务端渲染中的使用，面试官想了解你是否掌握全栈Vue应用的状态管理。

**实战应用举例：**
```javascript
// 1. Nuxt 3中使用Pinia
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  pinia: {
    autoImports: ['defineStore', 'storeToRefs']
  }
})

// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    users: []
  }),

  actions: {
    async fetchUser(id) {
      // 在SSR中，这会在服务端执行
      const { data } = await $fetch(`/api/users/${id}`)
      this.user = data
    }
  }
})

// pages/user/[id].vue
<template>
  <div>
    <h1>{{ user?.name }}</h1>
    <p>{{ user?.email }}</p>
  </div>
</template>

<script setup>
const route = useRoute()
const userStore = useUserStore()

// 服务端和客户端都会执行
await userStore.fetchUser(route.params.id)

const { user } = storeToRefs(userStore)
</script>

// 2. 手动SSR配置
// server.js (Express + Vue SSR)
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { renderToString } from 'vue/server-renderer'

app.get('*', async (req, res) => {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.use(pinia)

  // 在服务端预填充store数据
  const userStore = useUserStore(pinia)
  await userStore.fetchInitialData()

  // 渲染应用
  const html = await renderToString(app)

  // 序列化store状态
  const state = JSON.stringify(pinia.state.value)

  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>SSR App</title></head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PINIA_STATE__ = ${state}
        </script>
        <script src="/client.js"></script>
      </body>
    </html>
  `)
})

// client.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

// 恢复服务端状态
if (window.__PINIA_STATE__) {
  pinia.state.value = window.__PINIA_STATE__
}

app.use(pinia)
app.mount('#app')

// 3. 处理SSR特殊情况
export const useDataStore = defineStore('data', {
  state: () => ({
    data: null,
    isServer: false
  }),

  actions: {
    async fetchData() {
      // 检查是否在服务端
      if (process.server) {
        this.isServer = true
        // 服务端逻辑
        this.data = await serverAPI.getData()
      } else {
        this.isServer = false
        // 客户端逻辑
        this.data = await clientAPI.getData()
      }
    }
  }
})
```

**SSR注意事项：**
- **状态同步**: 服务端状态需要传递给客户端
- **API差异**: 服务端和客户端可能使用不同的API
- **生命周期**: 某些操作只能在客户端执行
- **内存管理**: 服务端需要为每个请求创建新的store实例

**记忆要点总结：**
- Nuxt集成：使用@pinia/nuxt模块自动配置
- 状态传递：服务端状态序列化后传递给客户端
- 环境区分：处理服务端和客户端的差异
- 内存安全：避免服务端状态污染

---

**什么是 `storeToRefs`？为什么要使用？**

将store中的reactive和ref转位refs，便于解构并保持响应性

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia中响应性保持的关键工具，面试官想了解你是否理解Vue响应式系统的工作原理。

**技术错误纠正：**
1. "转位refs"应为"转为refs"
2. 缺少具体的使用场景和对比说明

**实战应用举例：**
```javascript
// 问题演示：直接解构会丢失响应性
export default {
  setup() {
    const userStore = useUserStore()

    // ❌ 错误：直接解构会丢失响应性
    const { user, isLoggedIn, userName } = userStore

    // 这些变量不再是响应式的
    console.log(user) // 不会随store变化而更新

    return {
      user, // 静态值，不会更新
      isLoggedIn, // 静态值，不会更新
      userName // 静态值，不会更新
    }
  }
}

// 正确用法：使用storeToRefs保持响应性
export default {
  setup() {
    const userStore = useUserStore()

    // ✅ 正确：使用storeToRefs保持响应性
    const { user, isLoggedIn, userName } = storeToRefs(userStore)

    // 这些变量保持响应式
    console.log(user.value) // 会随store变化而更新

    // actions不需要storeToRefs，直接解构
    const { login, logout, fetchUser } = userStore

    return {
      user, // 响应式ref
      isLoggedIn, // 响应式ref
      userName, // 响应式ref
      login, // 函数，直接使用
      logout, // 函数，直接使用
      fetchUser // 函数，直接使用
    }
  }
}

// 完整示例：购物车组件
<template>
  <div class="shopping-cart">
    <!-- 使用响应式数据 -->
    <h2>购物车 ({{ totalItems }} 件商品)</h2>
    <p>总价: {{ formattedTotal }}</p>

    <div v-if="isLoading" class="loading">
      加载中...
    </div>

    <div v-else>
      <div v-for="item in items" :key="item.id" class="cart-item">
        <span>{{ item.name }}</span>
        <span>${{ item.price }}</span>
        <button @click="removeItem(item.id)">删除</button>
      </div>
    </div>

    <button
      @click="checkout"
      :disabled="isLoading || totalItems === 0"
      class="checkout-btn"
    >
      结账
    </button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useShoppingCartStore } from '@/stores/shoppingCart'

const cartStore = useShoppingCartStore()

// 解构响应式数据（state和getters）
const {
  items,
  isLoading,
  totalItems,
  formattedTotal
} = storeToRefs(cartStore)

// 解构actions（不需要storeToRefs）
const {
  removeItem,
  checkout,
  clearCart
} = cartStore

// 在computed中使用也保持响应性
const hasItems = computed(() => totalItems.value > 0)
const canCheckout = computed(() => hasItems.value && !isLoading.value)

// 在watch中监听变化
watch(totalItems, (newCount, oldCount) => {
  if (newCount > oldCount) {
    console.log('商品已添加到购物车')
  }
})
</script>

// 高级用法：选择性解构
export default {
  setup() {
    const userStore = useUserStore()

    // 只解构需要的响应式数据
    const { user, isLoggedIn } = storeToRefs(userStore)

    // 其他数据直接从store访问（如果不需要在模板中使用）
    const getUserRole = () => userStore.user?.role
    const getPermissions = () => userStore.user?.permissions

    return {
      user,
      isLoggedIn,
      getUserRole,
      getPermissions
    }
  }
}

// 在组合式函数中使用
export function useAuth() {
  const authStore = useAuthStore()

  // 解构响应式数据
  const { user, token, isLoggedIn } = storeToRefs(authStore)

  // 解构actions
  const { login, logout, refreshToken } = authStore

  // 扩展功能
  const isAdmin = computed(() => user.value?.role === 'admin')

  const loginWithRedirect = async (credentials, redirectTo = '/') => {
    await login(credentials)
    if (isLoggedIn.value) {
      router.push(redirectTo)
    }
  }

  return {
    // 响应式数据
    user,
    token,
    isLoggedIn,
    isAdmin,

    // 方法
    login,
    logout,
    refreshToken,
    loginWithRedirect
  }
}
```

**工作原理：**
```javascript
// storeToRefs的简化实现原理
function storeToRefs(store) {
  const refs = {}

  for (const key in store.$state) {
    // 将store的响应式属性转换为ref
    refs[key] = toRef(store.$state, key)
  }

  // 处理getters
  for (const key in store._getters) {
    refs[key] = computed(() => store[key])
  }

  return refs
}

// 对比直接解构和storeToRefs
const store = useUserStore()

// 直接解构 - 丢失响应性
const { user } = store // user是静态值

// 使用storeToRefs - 保持响应性
const { user } = storeToRefs(store) // user是ref，保持响应性
```

**记忆要点总结：**
- 作用：将store的响应式属性转换为ref，保持响应性
- 使用场景：解构store的state和getters时必须使用
- 不适用：actions不需要storeToRefs，直接解构即可
- 原理：内部使用toRef和computed保持响应式连接

---

**如何对 Pinia 的 state 进行类型约束（TypeScript）？**
:

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia的TypeScript集成，面试官想了解你是否掌握类型安全的状态管理。

**实战应用举例：**
```typescript
// 1. 基本类型定义
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  permissions: string[]
  profile?: {
    avatar?: string
    bio?: string
    createdAt: Date
  }
}

interface UserState {
  user: User | null
  users: User[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
  }
}

// 2. Options API风格的类型约束
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    users: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  getters: {
    // 自动类型推导
    isLoggedIn: (state): boolean => !!state.user,

    // 显式类型注解
    userName: (state): string => state.user?.name || 'Guest',

    // 复杂类型返回
    usersByRole: (state) => {
      return (role: User['role']): User[] => {
        return state.users.filter(user => user.role === role)
      }
    },

    // 使用泛型
    getUserById: (state) => {
      return <T extends Pick<User, 'id'>>(id: number): T | undefined => {
        return state.users.find(user => user.id === id) as T | undefined
      }
    }
  },

  actions: {
    // 参数类型约束
    async login(credentials: { email: string; password: string }): Promise<User> {
      this.isLoading = true
      this.error = null

      try {
        const response = await api.login(credentials)
        this.user = response.user
        return response.user
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 可选参数
    async fetchUsers(params?: {
      page?: number
      limit?: number
      role?: User['role']
    }): Promise<void> {
      const { page = 1, limit = 10, role } = params || {}

      this.isLoading = true
      try {
        const response = await api.getUsers({ page, limit, role })
        this.users = response.data
        this.pagination = {
          page: response.page,
          limit: response.limit,
          total: response.total
        }
      } finally {
        this.isLoading = false
      }
    },

    // 返回类型约束
    updateUser(userId: number, updates: Partial<User>): User | null {
      const userIndex = this.users.findIndex(u => u.id === userId)
      if (userIndex === -1) return null

      const updatedUser = { ...this.users[userIndex], ...updates }
      this.users[userIndex] = updatedUser

      if (this.user?.id === userId) {
        this.user = updatedUser
      }

      return updatedUser
    }
  }
})

// 3. Composition API风格的类型约束
export const useProductStore = defineStore('product', () => {
  // 类型定义
  interface Product {
    id: number
    name: string
    price: number
    category: string
    inStock: boolean
    tags: string[]
  }

  interface ProductFilters {
    category?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    tags?: string[]
  }

  // 响应式状态
  const products = ref<Product[]>([])
  const selectedProduct = ref<Product | null>(null)
  const filters = ref<ProductFilters>({})
  const isLoading = ref<boolean>(false)

  // 计算属性
  const filteredProducts = computed((): Product[] => {
    return products.value.filter(product => {
      if (filters.value.category && product.category !== filters.value.category) {
        return false
      }
      if (filters.value.minPrice && product.price < filters.value.minPrice) {
        return false
      }
      if (filters.value.maxPrice && product.price > filters.value.maxPrice) {
        return false
      }
      if (filters.value.inStock !== undefined && product.inStock !== filters.value.inStock) {
        return false
      }
      return true
    })
  })

  const productCount = computed((): number => products.value.length)

  // 方法
  const fetchProducts = async (): Promise<Product[]> => {
    isLoading.value = true
    try {
      const response = await api.getProducts()
      products.value = response.data
      return response.data
    } finally {
      isLoading.value = false
    }
  }

  const addProduct = (product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...product,
      id: Date.now() // 简单的ID生成
    }
    products.value.push(newProduct)
    return newProduct
  }

  const updateProduct = (id: number, updates: Partial<Product>): boolean => {
    const index = products.value.findIndex(p => p.id === id)
    if (index === -1) return false

    products.value[index] = { ...products.value[index], ...updates }
    return true
  }

  const setFilters = (newFilters: ProductFilters): void => {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    // 状态
    products: readonly(products),
    selectedProduct: readonly(selectedProduct),
    filters: readonly(filters),
    isLoading: readonly(isLoading),

    // 计算属性
    filteredProducts,
    productCount,

    // 方法
    fetchProducts,
    addProduct,
    updateProduct,
    setFilters
  }
})

// 4. 高级类型技巧
// 使用泛型创建通用store
export function createCRUDStore<T extends { id: number }>(
  name: string,
  apiService: {
    getAll: () => Promise<T[]>
    getById: (id: number) => Promise<T>
    create: (data: Omit<T, 'id'>) => Promise<T>
    update: (id: number, data: Partial<T>) => Promise<T>
    delete: (id: number) => Promise<void>
  }
) {
  return defineStore(name, () => {
    const items = ref<T[]>([])
    const currentItem = ref<T | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const fetchAll = async (): Promise<T[]> => {
      isLoading.value = true
      error.value = null
      try {
        const data = await apiService.getAll()
        items.value = data
        return data
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Fetch failed'
        throw err
      } finally {
        isLoading.value = false
      }
    }

    const create = async (data: Omit<T, 'id'>): Promise<T> => {
      const newItem = await apiService.create(data)
      items.value.push(newItem)
      return newItem
    }

    return {
      items: readonly(items),
      currentItem: readonly(currentItem),
      isLoading: readonly(isLoading),
      error: readonly(error),
      fetchAll,
      create
    }
  })
}

// 使用泛型store
interface Post {
  id: number
  title: string
  content: string
  authorId: number
  createdAt: Date
}

export const usePostStore = createCRUDStore<Post>('post', postAPI)

// 5. 在组件中使用类型化store
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 类型自动推导
const { user, users, isLoading } = storeToRefs(userStore)
const { login, fetchUsers } = userStore

// 类型安全的方法调用
const handleLogin = async () => {
  try {
    const loggedInUser = await login({
      email: 'user@example.com',
      password: 'password123'
    })

    console.log('Logged in user:', loggedInUser.name) // 类型安全
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// 类型安全的数据访问
const userName = computed(() => user.value?.name ?? 'Unknown')
const isAdmin = computed(() => user.value?.role === 'admin')
</script>
```

**记忆要点总结：**
- 接口定义：为state、参数、返回值定义明确的接口
- 自动推导：Pinia能自动推导大部分类型
- 泛型支持：可以创建通用的类型化store
- 类型安全：编译时检查，运行时安全

---

**Pinia 的插件机制是如何工作的？**

通过.use一个包含可选上下文context {pinia,app,state,options} 的函数来实现对store的修改和扩展

## 深度分析与补充

**问题本质解读：** 这道题考察Pinia的扩展机制，面试官想了解你是否掌握插件开发和生态系统集成。

**实战应用举例：**
```javascript
// 1. 基本插件结构
function myPlugin(context) {
  const { pinia, app, store, options } = context

  // 插件逻辑
  console.log('Plugin initialized for store:', store.$id)
}

// 使用插件
const pinia = createPinia()
pinia.use(myPlugin)

// 2. 持久化插件实现
function createPersistedStatePlugin(options = {}) {
  return function persistedStatePlugin({ store, options: storeOptions }) {
    const {
      key = store.$id,
      storage = localStorage,
      paths = null, // 指定要持久化的路径
      serializer = {
        serialize: JSON.stringify,
        deserialize: JSON.parse
      }
    } = { ...options, ...storeOptions.persist }

    // 从存储中恢复状态
    const restore = () => {
      try {
        const stored = storage.getItem(key)
        if (stored) {
          const data = serializer.deserialize(stored)

          if (paths) {
            // 只恢复指定路径的数据
            paths.forEach(path => {
              if (data[path] !== undefined) {
                store.$patch({ [path]: data[path] })
              }
            })
          } else {
            // 恢复所有数据
            store.$patch(data)
          }
        }
      } catch (error) {
        console.error('Failed to restore persisted state:', error)
      }
    }

    // 保存状态到存储
    const persist = () => {
      try {
        let dataToStore = store.$state

        if (paths) {
          // 只保存指定路径的数据
          dataToStore = {}
          paths.forEach(path => {
            dataToStore[path] = store.$state[path]
          })
        }

        storage.setItem(key, serializer.serialize(dataToStore))
      } catch (error) {
        console.error('Failed to persist state:', error)
      }
    }

    // 初始化时恢复状态
    restore()

    // 监听状态变化并持久化
    store.$subscribe((mutation, state) => {
      persist()
    })
  }
}

// 使用持久化插件
pinia.use(createPersistedStatePlugin({
  storage: sessionStorage
}))

// 3. 日志插件
function createLoggerPlugin(options = {}) {
  return function loggerPlugin({ store }) {
    const {
      logActions = true,
      logMutations = true,
      logLevel = 'log'
    } = options

    if (logActions) {
      // 监听actions
      store.$onAction(({ name, store, args, after, onError }) => {
        const startTime = Date.now()
        console[logLevel](`🚀 Action ${store.$id}.${name} started`, args)

        after((result) => {
          const duration = Date.now() - startTime
          console[logLevel](`✅ Action ${store.$id}.${name} completed in ${duration}ms`, result)
        })

        onError((error) => {
          const duration = Date.now() - startTime
          console.error(`❌ Action ${store.$id}.${name} failed in ${duration}ms`, error)
        })
      })
    }

    if (logMutations) {
      // 监听状态变化
      store.$subscribe((mutation, state) => {
        console[logLevel](`🔄 Mutation in ${store.$id}:`, mutation)
        console[logLevel]('📊 New state:', state)
      })
    }
  }
}

// 4. 权限控制插件
function createPermissionPlugin(getCurrentUser) {
  return function permissionPlugin({ store }) {
    // 为每个store添加权限检查方法
    store.$hasPermission = (permission) => {
      const user = getCurrentUser()
      return user?.permissions?.includes(permission) || false
    }

    store.$requirePermission = (permission) => {
      if (!store.$hasPermission(permission)) {
        throw new Error(`Permission denied: ${permission}`)
      }
    }

    // 包装actions添加权限检查
    const originalActions = { ...store }

    Object.keys(store).forEach(key => {
      if (typeof store[key] === 'function' && !key.startsWith('$')) {
        const originalAction = store[key]
        const requiredPermission = store.$options?.permissions?.[key]

        if (requiredPermission) {
          store[key] = function(...args) {
            store.$requirePermission(requiredPermission)
            return originalAction.apply(this, args)
          }
        }
      }
    })
  }
}

// 5. 缓存插件
function createCachePlugin(options = {}) {
  return function cachePlugin({ store }) {
    const {
      maxAge = 5 * 60 * 1000, // 5分钟
      maxSize = 100
    } = options

    const cache = new Map()

    // 添加缓存方法
    store.$cache = {
      set(key, value, customMaxAge) {
        const expiry = Date.now() + (customMaxAge || maxAge)

        // 清理过期缓存
        if (cache.size >= maxSize) {
          const oldestKey = cache.keys().next().value
          cache.delete(oldestKey)
        }

        cache.set(key, { value, expiry })
      },

      get(key) {
        const item = cache.get(key)
        if (!item) return null

        if (Date.now() > item.expiry) {
          cache.delete(key)
          return null
        }

        return item.value
      },

      has(key) {
        return this.get(key) !== null
      },

      clear() {
        cache.clear()
      }
    }

    // 包装异步actions添加缓存
    Object.keys(store).forEach(key => {
      if (typeof store[key] === 'function' && !key.startsWith('$')) {
        const originalAction = store[key]
        const cacheKey = store.$options?.cache?.[key]

        if (cacheKey) {
          store[key] = async function(...args) {
            const key = typeof cacheKey === 'function'
              ? cacheKey(...args)
              : `${store.$id}.${key}.${JSON.stringify(args)}`

            // 检查缓存
            const cached = store.$cache.get(key)
            if (cached) {
              return cached
            }

            // 执行原始action
            const result = await originalAction.apply(this, args)

            // 缓存结果
            store.$cache.set(key, result)

            return result
          }
        }
      }
    })
  }
}

// 6. 插件组合使用
const pinia = createPinia()

// 开发环境插件
if (process.env.NODE_ENV === 'development') {
  pinia.use(createLoggerPlugin({
    logActions: true,
    logMutations: false
  }))
}

// 生产环境插件
pinia.use(createPersistedStatePlugin())
pinia.use(createPermissionPlugin(() => getCurrentUser()))
pinia.use(createCachePlugin({ maxAge: 10 * 60 * 1000 }))

// 7. 在store中配置插件选项
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    users: []
  }),

  actions: {
    async fetchUser(id) {
      // 这个action会被缓存
      return await api.getUser(id)
    },

    async deleteUser(id) {
      // 这个action需要权限
      return await api.deleteUser(id)
    }
  }
}, {
  // 插件配置
  persist: {
    paths: ['user'] // 只持久化user字段
  },

  permissions: {
    deleteUser: 'user:delete' // deleteUser需要user:delete权限
  },

  cache: {
    fetchUser: (id) => `user:${id}` // fetchUser的缓存key
  }
})
```

**记忆要点总结：**
- 插件结构：接收context参数，包含pinia、app、store、options
- 扩展能力：可以添加方法、监听事件、修改行为
- 生命周期：在store创建时执行，可以访问完整的store实例
- 实用插件：持久化、日志、权限、缓存等常见需求

---
