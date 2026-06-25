# 什么是 `markRaw`？什么时候使用？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue 3响应式系统的性能优化，面试官想了解你是否理解何时应该避免响应式开销。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

- 原答案描述过于简单，缺少具体使用场景
- 没有说明markRaw与toRaw的区别
- 缺少性能优化的具体效果说明

## 知识点系统梳理

markRaw 用于将对象标记为不可被 Vue 响应式系统代理，返回原始对象。(**标记永远不会被代理**)

适用于不需要响应式的对象（如第三方库实例、大型数据结构等）。

### 问题本质解读 这道题考察Vue 3响应式系统的性能优化，面试官想了解你是否理解何时应该避免响应式开销。

### 技术错误纠正
- 原答案描述过于简单，缺少具体使用场景
- 没有说明markRaw与toRaw的区别
- 缺少性能优化的具体效果说明

### 知识点系统梳理

**markRaw的核心机制：**
- 为对象添加`__v_skip`标记，Vue响应式系统会跳过此对象
- 返回的仍是原始对象，但永远不会被代理
- 与toRaw的区别：markRaw是预防性标记，toRaw是获取已代理对象的原始版本

### 实战应用举例
```javascript
import { reactive, markRaw, toRaw, ref } from 'vue'

// 1. 第三方库实例标记
import { Chart } from 'chart.js'
import * as THREE from 'three'
import * as L from 'leaflet'

const state = reactive({
  // ❌ 错误用法 - 第三方库被响应式代理
  chart: new Chart(canvas, config), // 会导致性能问题和潜在错误

  // ✅ 正确用法 - 标记为原始对象
  chart: markRaw(new Chart(canvas, config)),
  
  // 其他第三方库示例
  threeScene: markRaw(new THREE.Scene()),
  leafletMap: markRaw(L.map('map')),
  
  // 响应式的配置数据
  chartOptions: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  }
})

// 2. 大型数据结构优化
const useLargeDataOptimization = () => {
  const largeDataSet = ref(markRaw([]))
  const metadata = reactive({
    total: 0,
    loaded: false,
    lastUpdated: null
  })

  const loadLargeData = async () => {
    metadata.loaded = false
    
    try {
      // 获取大量数据（如10万条记录）
      const response = await fetch('/api/large-dataset')
      const data = await response.json()
      
      // 标记大数据为原始对象，避免响应式开销
      largeDataSet.value = markRaw(data)
      
      // 只让元数据保持响应式
      metadata.total = data.length
      metadata.lastUpdated = new Date()
      metadata.loaded = true
      
    } catch (error) {
      console.error('加载大数据失败:', error)
    }
  }

  // 数据处理函数
  const processData = (processor) => {
    if (!metadata.loaded) return []
    
    // 直接操作原始数据，无响应式开销
    const rawData = largeDataSet.value
    return processor(rawData)
  }

  // 分页数据（保持响应式）
  const pageSize = ref(20)
  const currentPage = ref(1)

  const paginatedData = computed(() => {
    if (!metadata.loaded) return []
    
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    // 从原始数据中提取分页数据
    return largeDataSet.value.slice(start, end)
  })

  return {
    largeDataSet: readonly(largeDataSet),
    metadata: readonly(metadata),
    loadLargeData,
    processData,
    paginatedData,
    pageSize,
    currentPage
  }
}

// 3. 缓存系统实现
class CacheManager {
  constructor() {
    // 缓存存储标记为原始对象
    this.cache = markRaw(new Map())
    this.stats = reactive({
      hits: 0,
      misses: 0,
      size: 0
    })
  }

  set(key, value, ttl = 3600000) { // 默认1小时TTL
    const cacheItem = markRaw({
      value,
      expires: Date.now() + ttl,
      created: Date.now()
    })

    this.cache.set(key, cacheItem)
    this.stats.size = this.cache.size
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      this.stats.misses++
      return null
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      this.stats.size = this.cache.size
      this.stats.misses++
      return null
    }

    this.stats.hits++
    return item.value
  }

  clear() {
    this.cache.clear()
    this.stats.size = 0
  }

  getStats() {
    return {
      ...this.stats,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    }
  }
}

// 使用缓存管理器
const cacheManager = markRaw(new CacheManager())

// 4. 配置对象和常量
const appConfig = markRaw({
  api: {
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 10000,
    retryCount: 3
  },
  features: {
    enableAnalytics: true,
    enableNotifications: true,
    enableExperimentalFeatures: false
  },
  constants: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    DEFAULT_PAGINATION_SIZE: 20
  }
})

// 在组件中使用
const MyComponent = {
  setup() {
    const state = reactive({
      // 配置对象标记为原始
      config: appConfig,
      
      // 运行时状态保持响应式
      currentUser: null,
      isLoading: false
    })

    return { state }
  }
}

// 5. 性能对比示例
const performanceComparison = () => {
  // 创建大型对象
  const createLargeObject = () => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      data: Array.from({ length: 100 }, (_, j) => j)
    }))
  }

  // 不使用markRaw（慢）
  const reactiveData = reactive({
    items: createLargeObject() // 每个嵌套对象都会被代理
  })

  // 使用markRaw（快）
  const optimizedData = reactive({
    items: markRaw(createLargeObject()), // 整个数组标记为原始
    // 只保持必要的元数据响应式
    meta: {
      count: 10000,
      lastUpdated: new Date()
    }
  })

  console.time('Reactive Access')
  for (let i = 0; i < 1000; i++) {
    reactiveData.items[i % 100].name
  }
  console.timeEnd('Reactive Access') // 较慢

  console.time('MarkRaw Access')
  for (let i = 0; i < 1000; i++) {
    optimizedData.items[i % 100].name
  }
  console.timeEnd('MarkRaw Access') // 较快
}

// 6. 与toRaw的对比使用
const rawComparison = () => {
  const original = { name: 'test', data: [1, 2, 3] }
  
  // markRaw: 预防性标记，对象永远不会被代理
  const marked = markRaw(original)
  const reactiveMarked = reactive({ obj: marked })
  console.log(reactiveMarked.obj === original) // true，没有被代理

  // toRaw: 从已代理的对象获取原始版本
  const reactiveObj = reactive(original)
  const raw = toRaw(reactiveObj)
  console.log(raw === original) // true，获取到原始对象
}

// 7. 实际项目中的完整示例
// stores/app.js
import { reactive, markRaw } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // 响应式状态
  const state = reactive({
    user: null,
    theme: 'light',
    language: 'zh-CN',
    notifications: []
  })

  // 非响应式配置和服务
  const services = markRaw({
    analytics: new AnalyticsService(),
    notification: new NotificationService(),
    storage: new StorageService()
  })

  const constants = markRaw({
    THEMES: ['light', 'dark', 'auto'],
    LANGUAGES: ['zh-CN', 'en-US', 'ja-JP'],
    API_ENDPOINTS: {
      user: '/api/user',
      notifications: '/api/notifications'
    }
  })

  // 操作方法
  const setUser = (userData) => {
    state.user = userData
    services.analytics.identify(userData.id)
  }

  const setTheme = (theme) => {
    if (constants.THEMES.includes(theme)) {
      state.theme = theme
      services.storage.set('theme', theme)
    }
  }

  return {
    state,
    services,
    constants,
    setUser,
    setTheme
  }
})
```

**使用场景对比：**
```javascript
const usageGuidelines = {
  应该使用markRaw: [
    '第三方库实例(Chart.js, Three.js, Leaflet等)',
    '大型静态数据集合',
    '配置对象和常量',
    '缓存对象(Map, Set等)',
    'DOM元素引用',
    '不变的计算结果'
  ],
  
  不应该使用markRaw: [
    '需要响应式的UI状态',
    '表单数据',
    '用户交互状态',
    '组件间通信的数据',
    '需要watch的数据'
  ]
}

const performanceImpact = {
  内存优化: '减少Proxy对象创建，节省内存',
  访问性能: '直接访问原始对象，无代理开销',
  渲染性能: '减少不必要的响应式更新',
  初始化性能: '避免深层遍历创建代理'
}
```

### 记忆要点总结
- 作用：标记对象永不被Vue代理，避免响应式开销
- 使用场景：第三方库、大型数据、配置常量、缓存
- 性能优势：减少内存占用、提升访问速度、避免不必要更新
- 与toRaw区别：markRaw预防代理，toRaw获取原始对象
- 最佳实践：只对确实不需要响应式的数据使用

----

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

待补充：可结合业务场景说明何时使用、何时避免，以及与相近方案的差异。

## 易错点提示

重点关注术语表述、边界条件、运行时行为和浏览器/框架版本差异。

## 记忆要点总结

记住主线：定义 -> 原理 -> 边界 -> 实战取舍。

## 延伸问题

可以继续追问：什么是 `markRaw`？什么时候使用？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
