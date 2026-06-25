# 132. [中级]** 如何并发执行多个async操作？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察async/await中的并发处理，面试官想了解你是否理解如何在async函数中实现真正的并发执行。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- Promise.all
- Promise.race

### 问题本质解读 这道题考察async/await中的并发处理，面试官想了解你是否理解如何在async函数中实现真正的并发执行。

### 知识点系统梳理

**async/await并发执行的核心方法：**

1. **Promise.all()**：等待所有操作完成
2. **Promise.allSettled()**：等待所有操作结束（不管成功失败）
3. **Promise.race()**：返回最快完成的操作
4. **Promise.any()**：返回最快成功的操作
5. **手动并发控制**：控制并发数量

### 实战应用举例

**通用JavaScript示例：**

```javascript
// 1. 基础并发执行
// ❌ 串行执行（慢）
async function serialExecution() {
  const start = Date.now()

  const user = await fetchUser(1) // 1秒
  const posts = await fetchPosts(1) // 1秒
  const comments = await fetchComments(1) // 1秒

  console.log(`串行执行耗时: ${Date.now() - start}ms`) // 约3000ms
  return { user, posts, comments }
}

// ✅ 并发执行（快）
async function concurrentExecution() {
  const start = Date.now()

  const [user, posts, comments] = await Promise.all([
    fetchUser(1), // 并发执行
    fetchPosts(1), // 并发执行
    fetchComments(1), // 并发执行
  ])

  console.log(`并发执行耗时: ${Date.now() - start}ms`) // 约1000ms
  return { user, posts, comments }
}

// 2. 混合串行和并发
async function hybridExecution(userId) {
  // 第一步：获取用户信息（必须先执行）
  const user = await fetchUser(userId)

  // 第二步：基于用户信息并发获取相关数据
  const [profile, posts, friends, settings] = await Promise.all([
    fetchUserProfile(user.id),
    fetchUserPosts(user.id),
    fetchUserFriends(user.id),
    fetchUserSettings(user.id),
  ])

  // 第三步：基于前面的数据进行后续处理
  const [analytics, recommendations] = await Promise.all([
    generateAnalytics(user, posts),
    generateRecommendations(user, friends),
  ])

  return {
    user,
    profile,
    posts,
    friends,
    settings,
    analytics,
    recommendations,
  }
}

// 3. 错误处理的并发执行
async function concurrentWithErrorHandling() {
  try {
    const results = await Promise.allSettled([
      fetchCriticalData(),
      fetchOptionalData1(),
      fetchOptionalData2(),
      fetchOptionalData3(),
    ])

    const [critical, optional1, optional2, optional3] = results

    // 检查关键数据
    if (critical.status === 'rejected') {
      throw new Error('关键数据获取失败: ' + critical.reason.message)
    }

    // 处理可选数据
    const optionalData = [optional1, optional2, optional3]
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)

    return {
      critical: critical.value,
      optional: optionalData,
      errors: results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason.message),
    }
  } catch (error) {
    console.error('并发执行失败:', error)
    throw error
  }
}

// 4. 控制并发数量
async function limitedConcurrency(tasks, limit = 3) {
  const results = []

  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit)
    const batchResults = await Promise.all(batch.map(task => task().catch(error => ({ error }))))
    results.push(...batchResults)
  }

  return results
}

// 使用示例
async function processManyItems(items) {
  const tasks = items.map(item => () => processItem(item))
  return await limitedConcurrency(tasks, 5) // 最多5个并发
}

// 5. 超时控制的并发执行
async function concurrentWithTimeout(operations, timeout = 5000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('操作超时')), timeout)
  })

  const operationsWithTimeout = operations.map(op => Promise.race([op, timeoutPromise]))

  return await Promise.allSettled(operationsWithTimeout)
}
```

**Vue 3框架应用示例：**

```vue
<template>
  <div class="concurrent-demo">
    <div class="controls">
      <button
        @click="loadDataSerial"
        :disabled="loading"
      >
        串行加载 (慢)
      </button>
      <button
        @click="loadDataConcurrent"
        :disabled="loading"
      >
        并发加载 (快)
      </button>
      <button
        @click="loadDataWithErrorHandling"
        :disabled="loading"
      >
        容错并发加载
      </button>
    </div>

    <div
      v-if="loading"
      class="loading"
    >
      加载中... {{ loadingProgress }}%
    </div>

    <div
      v-if="data"
      class="results"
    >
      <h3>加载结果 (耗时: {{ loadTime }}ms)</h3>
      <div class="data-section">
        <h4>用户信息</h4>
        <p>{{ data.user?.name || '加载失败' }}</p>
      </div>
      <div class="data-section">
        <h4>文章数量</h4>
        <p>{{ data.posts?.length || 0 }}</p>
      </div>
      <div class="data-section">
        <h4>好友数量</h4>
        <p>{{ data.friends?.length || 0 }}</p>
      </div>
    </div>

    <div
      v-if="errors.length > 0"
      class="errors"
    >
      <h4>错误信息:</h4>
      <ul>
        <li
          v-for="error in errors"
          :key="error"
        >
          {{ error }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const loadingProgress = ref(0)
const data = ref(null)
const errors = ref([])
const loadTime = ref(0)

// 串行加载数据
const loadDataSerial = async () => {
  const startTime = Date.now()
  loading.value = true
  loadingProgress.value = 0
  errors.value = []

  try {
    loadingProgress.value = 25
    const user = await fetchUserAPI(123)

    loadingProgress.value = 50
    const posts = await fetchUserPostsAPI(user.id)

    loadingProgress.value = 75
    const friends = await fetchUserFriendsAPI(user.id)

    loadingProgress.value = 100
    data.value = { user, posts, friends }
  } catch (error) {
    errors.value = [error.message]
  } finally {
    loading.value = false
    loadTime.value = Date.now() - startTime
  }
}

// 并发加载数据
const loadDataConcurrent = async () => {
  const startTime = Date.now()
  loading.value = true
  loadingProgress.value = 0
  errors.value = []

  try {
    // 先获取用户信息
    loadingProgress.value = 25
    const user = await fetchUserAPI(123)

    // 并发获取相关数据
    loadingProgress.value = 50
    const [posts, friends, settings] = await Promise.all([
      fetchUserPostsAPI(user.id),
      fetchUserFriendsAPI(user.id),
      fetchUserSettingsAPI(user.id),
    ])

    loadingProgress.value = 100
    data.value = { user, posts, friends, settings }
  } catch (error) {
    errors.value = [error.message]
  } finally {
    loading.value = false
    loadTime.value = Date.now() - startTime
  }
}

// 容错并发加载
const loadDataWithErrorHandling = async () => {
  const startTime = Date.now()
  loading.value = true
  loadingProgress.value = 0
  errors.value = []

  try {
    loadingProgress.value = 25
    const user = await fetchUserAPI(123)

    loadingProgress.value = 50
    const results = await Promise.allSettled([
      fetchUserPostsAPI(user.id),
      fetchUserFriendsAPI(user.id),
      fetchUserSettingsAPI(user.id),
      fetchUserStatsAPI(user.id),
    ])

    loadingProgress.value = 100

    // 处理结果
    const [postsResult, friendsResult, settingsResult, statsResult] = results

    data.value = {
      user,
      posts: postsResult.status === 'fulfilled' ? postsResult.value : [],
      friends: friendsResult.status === 'fulfilled' ? friendsResult.value : [],
      settings: settingsResult.status === 'fulfilled' ? settingsResult.value : null,
      stats: statsResult.status === 'fulfilled' ? statsResult.value : null,
    }

    // 收集错误
    errors.value = results
      .filter(result => result.status === 'rejected')
      .map(result => result.reason.message)
  } catch (error) {
    errors.value = [error.message]
  } finally {
    loading.value = false
    loadTime.value = Date.now() - startTime
  }
}

// 组合式函数：并发数据加载
const useConcurrentDataLoader = () => {
  const data = ref({})
  const loading = ref(false)
  const errors = ref([])

  const loadMultipleResources = async resources => {
    loading.value = true
    errors.value = []

    try {
      const results = await Promise.allSettled(
        resources.map(async resource => {
          const result = await resource.loader()
          return { key: resource.key, data: result }
        }),
      )

      // 处理成功的结果
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          data.value[result.value.key] = result.value.data
        } else {
          errors.value.push(`${resources[index].key}: ${result.reason.message}`)
        }
      })
    } finally {
      loading.value = false
    }
  }

  return { data, loading, errors, loadMultipleResources }
}
</script>
```

**并发控制的最佳实践：**

```javascript
// 1. 智能并发控制
class ConcurrencyController {
  constructor(limit = 3) {
    this.limit = limit
    this.running = 0
    this.queue = []
  }

  async execute(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this._tryProcess()
    })
  }

  async _tryProcess() {
    if (this.running >= this.limit || this.queue.length === 0) {
      return
    }

    this.running++
    const { task, resolve, reject } = this.queue.shift()

    try {
      const result = await Promise.resolve().then(() => task())
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      this.running--
      if (this.queue.length > 0) this._tryProcess()
    }
  }
}

// 2. 批量处理工具
async function batchProcess(items, processor, batchSize = 10) {
  const results = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(item => processor(item).catch(error => ({ error, item }))),
    )
    results.push(...batchResults)
  }

  return results
}
```

### 记忆要点总结

- 使用Promise.all()实现真正的并发执行
- 区分串行和并发的性能差异
- Promise.allSettled()用于容错并发处理
- 合理控制并发数量避免资源过载
- 结合超时机制提高系统稳定性

## 实战应用举例

批量加载卡片数据时，独立请求可以并发，减少首屏等待时间。

```javascript
async function loadCards(ids) {
  const requests = ids.map(id => fetch(`/api/cards/${id}`).then(res => res.json()))
  return Promise.all(requests)
}
```

## 使用场景说明和对比

| 执行方式 | 写法 | 适合场景 |
| --- | --- | --- |
| 串行 | `for...of` + `await` | 后一步依赖前一步结果 |
| 全量并发 | `Promise.all(list.map(fn))` | 数量少、互不依赖 |
| 容错并发 | `Promise.allSettled` | 允许部分失败 |
| 限流并发 | 自定义队列 / p-limit 思路 | 数量大、接口有限流 |

## 易错点提示

1. `await` 写在循环里通常是串行。
2. `map(async () => {})` 得到的是 Promise 数组，要配合 `Promise.all`。
3. `Promise.all` 一个失败就整体失败。
4. 大量并发可能打爆浏览器连接数或后端限流。
5. 并发任务如果有顺序依赖，不能盲目 `Promise.all`。

## 记忆要点总结

- 互不依赖用并发。
- 有依赖用串行。
- 允许失败用 `allSettled`。
- 数量大要限流。

## 延伸问题

可以继续追问：132. [中级]** 如何并发执行多个async操作？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`await Promise.all(tasks)` 是并发吗？**  
A：是等待并发结果，但前提是 tasks 里的 Promise 已经被创建并开始执行。

**Q：如何限制并发数量？**  
A：维护一个任务队列，只在运行中任务少于限制时启动下一个任务。

## 辅助记忆总结

一句话记：先判断任务是否互相依赖，再决定串行、并发还是限流。
