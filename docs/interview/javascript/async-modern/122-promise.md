# 122. [中级]** 如何处理多个Promise？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Promise并发处理的各种方法，面试官想了解你是否掌握不同场景下的Promise组合策略和性能优化。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- Promise.race()不是"只有全部失败才都失败"，而是返回第一个settled的Promise结果
- 需要明确各个方法的具体行为差异和使用场景

## 知识点系统梳理

- Promise.all([]) 可以通过数组的方式将多个异步操作同时并行请求，只有全部成功才成功，有一个失败都失败。返回全部请求执行结果
- Promise.race([]) 可以通过数组的方式将多个异步操作同时竞争请求，~~只有全部失败才都失败，返回最快完成请求的那个结果~~ 返回第一个settled的Promise结果
- Promise.allSettled([]) 可以通过数组的方式将多个异步操作同时并行请求,返回各个请求的结果（结果中包含结果状态和值）
- Promise.any([]) 可以通过数组的方式将多个异步操作同时竞争请求, 只要有一个请求成功，返回最先成功的那个，只有全部失败的时候才失败

### 问题本质解读 这道题考察Promise并发处理的各种方法，面试官想了解你是否掌握不同场景下的Promise组合策略和性能优化。

### 技术错误纠正

- Promise.race()不是"只有全部失败才都失败"，而是返回第一个settled的Promise结果
- 需要明确各个方法的具体行为差异和使用场景

### 知识点系统梳理

**四种Promise组合方法对比：**

| 方法                 | 成功条件 | 失败条件   | 返回结果     | 使用场景  |
| -------------------- | -------- | ---------- | ------------ | --------- |
| Promise.all()        | 全部成功 | 任一失败   | 成功结果数组 | 全部依赖  |
| Promise.race()       | 任一完成 | 第一个失败 | 第一个结果   | 竞速/超时 |
| Promise.allSettled() | 全部完成 | 不会失败   | 状态结果数组 | 批量处理  |
| Promise.any()        | 任一成功 | 全部失败   | 第一个成功   | 容错处理  |

### 实战应用举例

```javascript
// 1. Promise.all() - 全部成功才成功
async function demonstratePromiseAll() {
  console.log('=== Promise.all() 演示 ===')

  const promises = [
    fetch('/api/user/1').then(r => r.json()),
    fetch('/api/user/2').then(r => r.json()),
    fetch('/api/user/3').then(r => r.json()),
  ]

  try {
    const results = await Promise.all(promises)
    console.log('所有用户数据:', results)
    // 结果按原数组顺序返回，不是完成顺序
  } catch (error) {
    console.log('任一请求失败:', error)
    // 只要有一个失败，整个Promise.all就失败
  }

  // 实际应用：并行获取相关数据
  async function getUserProfile(userId) {
    const [user, posts, friends] = await Promise.all([
      fetchUser(userId),
      fetchUserPosts(userId),
      fetchUserFriends(userId),
    ])

    return { user, posts, friends }
  }
}

// 2. Promise.race() - 第一个完成的结果
async function demonstratePromiseRace() {
  console.log('=== Promise.race() 演示 ===')

  const promises = [
    new Promise(resolve => setTimeout(() => resolve('慢速结果'), 2000)),
    new Promise(resolve => setTimeout(() => resolve('快速结果'), 1000)),
    new Promise((_, reject) => setTimeout(() => reject('错误'), 1500)),
  ]

  try {
    const result = await Promise.race(promises)
    console.log('最快完成:', result) // "快速结果"
  } catch (error) {
    console.log('最快失败:', error)
  }

  // 实际应用：请求超时控制
  function withTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), timeout)
    })

    return Promise.race([promise, timeoutPromise])
  }

  // 使用示例
  try {
    const data = await withTimeout(fetch('/api/slow-endpoint'), 5000)
    console.log('请求成功:', data)
  } catch (error) {
    console.log('请求超时或失败:', error.message)
  }
}

// 3. Promise.allSettled() - 等待全部完成
async function demonstratePromiseAllSettled() {
  console.log('=== Promise.allSettled() 演示 ===')

  const promises = [
    Promise.resolve('成功1'),
    Promise.reject('失败1'),
    Promise.resolve('成功2'),
    Promise.reject('失败2'),
  ]

  const results = await Promise.allSettled(promises)
  console.log('所有结果:', results)
  // [
  //   { status: 'fulfilled', value: '成功1' },
  //   { status: 'rejected', reason: '失败1' },
  //   { status: 'fulfilled', value: '成功2' },
  //   { status: 'rejected', reason: '失败2' }
  // ]

  // 处理结果
  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)

  const failed = results.filter(result => result.status === 'rejected').map(result => result.reason)

  console.log('成功的:', successful)
  console.log('失败的:', failed)

  // 实际应用：批量操作
  async function batchUpdateUsers(userIds) {
    const updatePromises = userIds.map(id => updateUser(id))
    const results = await Promise.allSettled(updatePromises)

    const summary = {
      total: results.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      errors: results.filter(r => r.status === 'rejected').map(r => r.reason),
    }

    return summary
  }
}

// 4. Promise.any() - 任一成功即可
async function demonstratePromiseAny() {
  console.log('=== Promise.any() 演示 ===')

  const promises = [
    Promise.reject('服务器1失败'),
    Promise.reject('服务器2失败'),
    Promise.resolve('服务器3成功'),
    Promise.resolve('服务器4成功'),
  ]

  try {
    const result = await Promise.any(promises)
    console.log('第一个成功:', result) // "服务器3成功"
  } catch (error) {
    console.log('全部失败:', error) // AggregateError
  }

  // 实际应用：多服务器容错
  async function fetchFromMultipleServers(endpoint) {
    const servers = [
      'https://api1.example.com',
      'https://api2.example.com',
      'https://api3.example.com',
    ]

    const promises = servers.map(server => fetch(`${server}${endpoint}`).then(r => r.json()))

    try {
      return await Promise.any(promises)
    } catch (error) {
      throw new Error('所有服务器都不可用')
    }
  }
}

// 5. 复杂组合场景
async function complexCombinationScenarios() {
  console.log('=== 复杂组合场景 ===')

  // 场景1: 部分依赖 + 容错
  async function fetchUserDashboard(userId) {
    // 必需数据：用户信息（必须成功）
    const userPromise = fetchUser(userId)

    // 可选数据：统计信息（可以失败）
    const optionalPromises = [
      fetchUserStats(userId).catch(() => null),
      fetchUserNotifications(userId).catch(() => []),
      fetchUserRecommendations(userId).catch(() => []),
    ]

    const [user, ...optionalData] = await Promise.all([userPromise, ...optionalPromises])

    const [stats, notifications, recommendations] = optionalData

    return {
      user,
      stats,
      notifications,
      recommendations,
    }
  }

  // 场景2: 分层加载
  async function layeredLoading() {
    // 第一层：关键数据
    const criticalData = await Promise.all([fetchCriticalData1(), fetchCriticalData2()])

    // 第二层：重要数据（基于第一层）
    const importantPromises = criticalData.map(data => fetchImportantData(data.id))
    const importantData = await Promise.allSettled(importantPromises)

    // 第三层：可选数据（并行加载）
    const optionalPromises = [fetchOptionalData1(), fetchOptionalData2(), fetchOptionalData3()]
    const optionalData = await Promise.allSettled(optionalPromises)

    return {
      critical: criticalData,
      important: importantData,
      optional: optionalData,
    }
  }

  // 场景3: 智能重试
  async function smartRetry(operation, maxRetries = 3) {
    const attempts = Array.from(
      { length: maxRetries },
      (_, i) =>
        new Promise(resolve => {
          setTimeout(() => {
            operation()
              .then(resolve)
              .catch(error => resolve(Promise.reject(error)))
          }, i * 1000) // 递增延迟
        }),
    )

    try {
      return await Promise.any(attempts)
    } catch (error) {
      throw new Error(`操作失败，已重试${maxRetries}次`)
    }
  }
}

// 辅助函数
function fetchUser(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, name: `User${id}` }), 100)
  })
}

function fetchUserPosts(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve([`Post1 by User${id}`, `Post2 by User${id}`]), 150)
  })
}

function fetchUserFriends(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve([`Friend1 of User${id}`, `Friend2 of User${id}`]), 120)
  })
}

function updateUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve(`User${id} updated`)
      } else {
        reject(`Failed to update User${id}`)
      }
    }, 100)
  })
}
```

**使用场景选择指南：**

1. **Promise.all()**: 所有操作都必须成功，如获取用户完整信息
2. **Promise.race()**: 需要最快响应，如请求超时控制
3. **Promise.allSettled()**: 批量操作，需要知道每个结果，如批量更新
4. **Promise.any()**: 容错处理，任一成功即可，如多服务器请求

### 记忆要点总结

- Promise.all()：全部成功才成功，快速失败
- Promise.race()：第一个完成就返回，竞速机制
- Promise.allSettled()：等待全部完成，不会失败
- Promise.any()：任一成功即可，全部失败才失败
- 根据业务需求选择合适的组合方法
- 注意错误处理和性能优化

## 实战应用举例

页面初始化时，用户信息、菜单和权限都必须成功，适合 `Promise.all`。

```javascript
async function loadPageBootstrap() {
  const [user, menus, permissions] = await Promise.all([
    fetchJSON('/api/user'),
    fetchJSON('/api/menus'),
    fetchJSON('/api/permissions'),
  ])

  return { user, menus, permissions }
}
```

## 使用场景说明和对比

| 方法 | 成功条件 | 失败条件 | 典型场景 |
| --- | --- | --- | --- |
| `Promise.all` | 全部 fulfilled | 任意一个 rejected | 页面关键数据全部依赖 |
| `Promise.allSettled` | 永远 fulfilled | 不因单项失败而失败 | 批量上传、批量保存 |
| `Promise.race` | 第一个 settled 决定 | 第一个 rejected 也会失败 | 超时控制、竞速 |
| `Promise.any` | 任意一个 fulfilled | 全部 rejected | 多源容灾请求 |

## 易错点提示

1. `Promise.all` 不会限制并发数量，只是等待一组 Promise。
2. Promise 创建后就开始执行，不是传给 `all` 才开始。
3. `allSettled` 的结果项要检查 `status`。
4. `race` 只看第一个 settled，不代表其他任务被取消。
5. 大量请求需要并发控制器，不要直接 `Promise.all(hugeList)`。

## 记忆要点总结

- 全部都要成功：`all`。
- 全部都要结果：`allSettled`。
- 只要最快完成：`race`。
- 只要一个成功：`any`。

## 延伸问题

可以继续追问：122. [中级]** 如何处理多个Promise？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`Promise.all` 是并发还是串行？**  
A：它等待一组已经创建的 Promise，通常这些任务是并发推进的；不是一个执行完再执行下一个。

**Q：批量请求要限制并发怎么办？**  
A：用任务队列或并发控制器，每次只启动固定数量的 Promise。

## 辅助记忆总结

一句话记：多 Promise 处理先问业务要“全成、全记、最快、任一成”。
