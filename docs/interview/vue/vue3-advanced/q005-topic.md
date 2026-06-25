# 如何避免大型列表渲染的性能问题？有什么技巧？

> 来源：`docs/vue/vue_3_part_2_answer.md`

## 问题本质解读

这道题考察大数据量渲染的性能优化策略，面试官想了解你是否掌握前端性能优化的核心技巧。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖该题相关的基础概念、运行机制、常见 API 和项目实践。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

1. 可以将重复的计算放置到computed中缓存
2. 可以使用虚拟列表
3. 引入更成熟的第三方库 vue-virtual-scroller

### 问题本质解读 这道题考察大数据量渲染的性能优化策略，面试官想了解你是否掌握前端性能优化的核心技巧。

### 知识点系统梳理

**性能问题的根本原因：**
1. DOM节点过多导致内存占用大
2. 初始渲染时间长
3. 滚动时重排重绘频繁
4. 事件监听器过多

**优化策略详解：**
```javascript
// 1. 虚拟滚动实现
export function useVirtualList(items, options = {}) {
  const {
    itemHeight = 50,
    containerHeight = 400,
    overscan = 5
  } = options

  const containerRef = ref(null)
  const scrollTop = ref(0)

  // 计算可见范围
  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.value.length
    )

    return {
      start: Math.max(0, start - overscan),
      end
    }
  })

  // 可见项目
  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return items.value.slice(start, end).map((item, index) => ({
      item,
      index: start + index
    }))
  })

  // 总高度
  const totalHeight = computed(() => items.value.length * itemHeight)

  // 偏移量
  const offsetY = computed(() => visibleRange.value.start * itemHeight)

  // 滚动处理
  const handleScroll = (e) => {
    scrollTop.value = e.target.scrollTop
  }

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  }
}

// 2. 分页加载组件
const InfiniteList = {
  setup() {
    const items = ref([])
    const loading = ref(false)
    const hasMore = ref(true)
    const page = ref(1)

    const loadMore = async () => {
      if (loading.value || !hasMore.value) return

      loading.value = true
      try {
        const newItems = await fetchItems(page.value)
        items.value.push(...newItems)
        page.value++
        hasMore.value = newItems.length > 0
      } finally {
        loading.value = false
      }
    }

    // 滚动到底部检测
    const handleScroll = useThrottle((e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore()
      }
    }, 200)

    return {
      items,
      loading,
      hasMore,
      loadMore,
      handleScroll
    }
  }
}

// 3. 优化的列表组件
const OptimizedList = {
  setup() {
    const items = ref([])
    const searchQuery = ref('')
    const selectedItems = ref(new Set())

    // 使用computed缓存过滤结果
    const filteredItems = computed(() => {
      if (!searchQuery.value) return items.value

      const query = searchQuery.value.toLowerCase()
      return items.value.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    })

    // 使用markRaw避免大量数据被代理
    const loadItems = async () => {
      const data = await fetchLargeDataset()
      items.value = markRaw(data) // 避免响应式开销
    }

    // 优化的选择处理
    const toggleSelection = (itemId) => {
      const newSelection = new Set(selectedItems.value)
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId)
      } else {
        newSelection.add(itemId)
      }
      selectedItems.value = newSelection
    }

    return {
      items,
      searchQuery,
      filteredItems,
      selectedItems,
      loadItems,
      toggleSelection
    }
  }
}
```

**完整的虚拟列表组件：**
```vue
<template>
  <div
    ref="containerRef"
    class="virtual-list"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <!-- 占位元素，撑开总高度 -->
    <div :style="{ height: totalHeight + 'px' }"></div>

    <!-- 可见项目容器 -->
    <div
      class="visible-items"
      :style="{
        transform: `translateY(${offsetY}px)`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
      }"
    >
      <div
        v-for="{ item, index } in visibleItems"
        :key="item.id || index"
        class="list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="index">
          {{ item }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 },
  containerHeight: { type: Number, default: 400 }
})

const {
  containerRef,
  visibleItems,
  totalHeight,
  offsetY,
  handleScroll
} = useVirtualList(toRef(props, 'items'), {
  itemHeight: props.itemHeight,
  containerHeight: props.containerHeight
})
</script>
```

**其他优化技巧：**
```javascript
// 4. 使用Web Workers处理大量数据
const useWorkerProcessing = () => {
  const worker = new Worker('/workers/data-processor.js')

  const processLargeDataset = (data) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: 'PROCESS_DATA', data })
      worker.onmessage = (e) => {
        if (e.data.type === 'PROCESSED_DATA') {
          resolve(e.data.result)
        }
      }
    })
  }

  return { processLargeDataset }
}

// 5. 使用requestIdleCallback优化渲染
const useBatchRendering = () => {
  const renderQueue = ref([])

  const batchRender = () => {
    const deadline = performance.now() + 16 // 16ms预算

    while (renderQueue.value.length && performance.now() < deadline) {
      const task = renderQueue.value.shift()
      task()
    }

    if (renderQueue.value.length) {
      requestIdleCallback(batchRender)
    }
  }

  const addRenderTask = (task) => {
    renderQueue.value.push(task)
    if (renderQueue.value.length === 1) {
      requestIdleCallback(batchRender)
    }
  }

  return { addRenderTask }
}

// 6. 内存优化
const useMemoryOptimization = () => {
  const itemCache = new Map()
  const maxCacheSize = 1000

  const getCachedItem = (id) => {
    if (itemCache.has(id)) {
      // 更新访问时间
      const item = itemCache.get(id)
      itemCache.delete(id)
      itemCache.set(id, item)
      return item
    }
    return null
  }

  const setCachedItem = (id, item) => {
    if (itemCache.size >= maxCacheSize) {
      // 删除最久未使用的项
      const firstKey = itemCache.keys().next().value
      itemCache.delete(firstKey)
    }
    itemCache.set(id, item)
  }

  return { getCachedItem, setCachedItem }
}
```

### 记忆要点总结
- 虚拟滚动：只渲染可见区域，减少DOM节点
- 分页加载：按需加载数据，避免一次性渲染大量内容
- 计算缓存：使用computed缓存过滤和计算结果
- 数据优化：markRaw避免不必要的响应式，Web Workers处理大数据
- 渲染优化：批量渲染、requestIdleCallback、内存缓存

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

可以继续追问：如何避免大型列表渲染的性能问题？有什么技巧？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

类似问题通常会换一种问法考察同一机制；回答时先给结论，再补原理和例子。

## 辅助记忆总结

用一句话记：先说是什么，再说为什么，最后说怎么用和哪里容易错。
