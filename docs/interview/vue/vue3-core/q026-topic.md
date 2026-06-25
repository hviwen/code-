# 为什么尽量避免在模板中进行昂贵计算？有什么替代方案？

> 来源：`docs/vue/vue_3_part_1_answer.md`

## 问题本质解读

这道题考察Vue模板渲染性能优化，面试官想了解你是否理解模板表达式的执行机制和性能影响。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

1. "模版"应为"模板"
2. 原答案过于简单，没有说明具体原因和完整的解决方案

## 知识点系统梳理

模板中进行昂贵的计算会导致DOM更新效率变低，使得交互卡顿。

可以使用 computed 将计算结果缓存。

### 问题本质解读 这道题考察Vue模板渲染性能优化，面试官想了解你是否理解模板表达式的执行机制和性能影响。

### 技术错误纠正
1. "模版"应为"模板"
2. 原答案过于简单，没有说明具体原因和完整的解决方案

### 知识点系统梳理

**模板中昂贵计算的问题：**
- 每次重新渲染都会执行：响应式数据变化时模板会重新执行
- 没有缓存机制：相同输入的计算会重复执行
- 阻塞渲染线程：复杂计算会延迟DOM更新
- 影响用户体验：造成界面卡顿和响应延迟

**替代方案和最佳实践：**

### 实战应用举例
```vue
// ❌ 错误示例：模板中的昂贵计算
<template>
  <div>
    <!-- 每次渲染都会执行复杂计算 -->
    <p>{{ expensiveCalculation(largeDataSet) }}</p>
    <p>{{ users.filter(u => u.active).map(u => u.name.toUpperCase()).join(', ') }}</p>
    <p>{{ new Date().toLocaleString() }}</p>
  </div>
</template>

// ✅ 正确示例：使用computed缓存计算
<template>
  <div>
    <p>{{ computedResult }}</p>
    <p>{{ activeUserNames }}</p>
    <p>{{ formattedCurrentTime }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const largeDataSet = ref([])
const users = ref([])
const currentTime = ref(new Date())

// 1. 使用computed缓存昂贵计算
const computedResult = computed(() => {
  // 只有当largeDataSet变化时才重新计算
  return expensiveCalculation(largeDataSet.value)
})

const activeUserNames = computed(() => {
  // 缓存用户名处理结果
  return users.value
    .filter(user => user.active)
    .map(user => user.name.toUpperCase())
    .join(', ')
})

const formattedCurrentTime = computed(() => {
  return currentTime.value.toLocaleString()
})

// 2. 复杂数据处理示例
const rawData = ref([])

// 多级computed优化
const filteredData = computed(() => {
  // 第一级：过滤数据
  return rawData.value.filter(item => item.status === 'active')
})

const sortedData = computed(() => {
  // 第二级：排序（依赖filteredData）
  return [...filteredData.value].sort((a, b) => a.priority - b.priority)
})

const groupedData = computed(() => {
  // 第三级：分组（依赖sortedData）
  return sortedData.value.reduce((groups, item) => {
    const group = groups[item.category] || []
    groups[item.category] = [...group, item]
    return groups
  }, {})
})

// 3. 使用工厂函数创建可复用的计算逻辑
function createFilteredComputed(sourceData, filterFn) {
  return computed(() => sourceData.value.filter(filterFn))
}

const activeUsers = createFilteredComputed(users, user => user.active)
const premiumUsers = createFilteredComputed(users, user => user.isPremium)

// 4. 异步计算的处理
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)

// 使用防抖优化搜索
const debouncedSearch = computed(() => {
  // 防抖逻辑
  let timeoutId
  return (query) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      if (query) {
        isSearching.value = true
        try {
          searchResults.value = await performSearch(query)
        } finally {
          isSearching.value = false
        }
      } else {
        searchResults.value = []
      }
    }, 300)
  }
})

// 监听搜索查询变化
watch(searchQuery, (newQuery) => {
  debouncedSearch.value(newQuery)
})

// 5. 使用方法进行事件处理时的计算
const handleItemClick = (item) => {
  // 事件处理中的计算是可以接受的
  const processedData = expensiveCalculation(item)
  emit('item-processed', processedData)
}

// 6. 性能监控和优化
const performanceMonitor = {
  startTime: 0,
  endTime: 0,
  
  start() {
    this.startTime = performance.now()
  },
  
  end(operationName) {
    this.endTime = performance.now()
    const duration = this.endTime - this.startTime
    if (duration > 16) { // 超过一帧的时间
      console.warn(`${operationName} took ${duration.toFixed(2)}ms`)
    }
  }
}

const optimizedComputation = computed(() => {
  performanceMonitor.start()
  const result = complexCalculation(data.value)
  performanceMonitor.end('Complex Calculation')
  return result
})

// 7. 使用Web Workers处理重型计算
const heavyComputationResult = ref(null)
const isComputing = ref(false)

const performHeavyComputation = async (data) => {
  isComputing.value = true
  
  try {
    // 使用Web Worker进行计算
    const worker = new Worker('/workers/heavy-computation.js')
    
    const result = await new Promise((resolve, reject) => {
      worker.postMessage(data)
      worker.onmessage = (e) => resolve(e.data)
      worker.onerror = reject
    })
    
    heavyComputationResult.value = result
    worker.terminate()
  } finally {
    isComputing.value = false
  }
}

// 8. 条件计算优化
const expensiveResult = computed(() => {
  // 只在需要时进行计算
  if (!shouldPerformCalculation.value) {
    return null
  }
  
  return expensiveOperation(inputData.value)
})

// 9. 缓存策略
const resultCache = new Map()

const cachedComputation = computed(() => {
  const cacheKey = JSON.stringify(inputData.value)
  
  if (resultCache.has(cacheKey)) {
    return resultCache.get(cacheKey)
  }
  
  const result = expensiveCalculation(inputData.value)
  resultCache.set(cacheKey, result)
  
  // 限制缓存大小
  if (resultCache.size > 100) {
    const firstKey = resultCache.keys().next().value
    resultCache.delete(firstKey)
  }
  
  return result
})

// 时间更新定时器
let timeUpdateInterval

onMounted(() => {
  // 定期更新时间（而不是每次渲染）
  timeUpdateInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timeUpdateInterval)
})
</script>
```

**性能优化策略对比：**

| 策略 | 适用场景 | 性能提升 | 复杂度 |
|------|----------|----------|--------|
| computed | 同步计算、依赖缓存 | 高 | 低 |
| 防抖/节流 | 频繁触发的计算 | 中 | 中 |
| Web Workers | CPU密集型任务 | 高 | 高 |
| 缓存 | 重复计算 | 高 | 中 |
| 分层computed | 复杂依赖链 | 中 | 中 |

### 记忆要点总结
- **问题原因**: 模板中的表达式每次渲染都会执行，没有缓存
- **主要替代**: computed提供缓存机制，只在依赖变化时重新计算
- **优化策略**: 防抖节流、Web Workers、缓存、分层计算
- **性能监控**: 监测计算时间，识别性能瓶颈
- **最佳实践**: 模板保持简单，复杂逻辑移到computed或方法中

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

可以继续追问：为什么尽量避免在模板中进行昂贵计算？有什么替代方案？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
