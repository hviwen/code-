# 123. [中级]** Promise.all()和Promise.allSettled()的区别

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察两种Promise组合方法的核心差异，面试官想了解你是否理解不同错误处理策略的适用场景。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- 需要明确两者在错误处理、返回值结构、使用场景上的具体差异

## 知识点系统梳理

- Promise.all([]) 可以通过数组的方式将多个异步操作同时并行请求，只有全部成功才成功，有一个失败都失败。返回全部请求执行结果
- Promise.allSettled([]) 可以通过数组的方式将多个异步操作同时并行请求,返回各个请求的结果（结果中包含结果状态和值）
  1. 整体完成的时机不同：
     1. all 只要其中有一个失败就都失败
     2. allSettled 不论其中的失败和成功 全部执行
  2. 返回的结果的结构不同：
     1. all 根据数组顺序返回对应顺序的结果
     2. allSettled 根据数组顺序返回对应顺序的对象内容 包括了完成状态 status 和请求结果 value

### 问题本质解读 这道题考察两种Promise组合方法的核心差异，面试官想了解你是否理解不同错误处理策略的适用场景。

### 技术错误纠正

- 需要明确两者在错误处理、返回值结构、使用场景上的具体差异

### 知识点系统梳理

**核心差异对比：**

| 特性     | Promise.all()         | Promise.allSettled() |
| -------- | --------------------- | -------------------- |
| 失败策略 | 快速失败（fail-fast） | 等待全部完成         |
| 返回时机 | 全部成功或首个失败    | 全部Promise settled  |
| 返回结果 | 成功值数组            | 状态对象数组         |
| 错误处理 | 抛出异常              | 不会抛出异常         |
| 适用场景 | 全部依赖              | 批量处理             |

### 实战应用举例

```javascript
// 1. 基础行为对比
async function basicComparison() {
  console.log('=== Promise.all() vs Promise.allSettled() 基础对比 ===')

  const promises = [
    Promise.resolve('成功1'),
    Promise.reject('失败1'),
    Promise.resolve('成功2'),
    new Promise(resolve => setTimeout(() => resolve('延迟成功'), 1000)),
  ]

  // Promise.all() - 快速失败
  try {
    const allResults = await Promise.all(promises)
    console.log('Promise.all 结果:', allResults) // 不会执行
  } catch (error) {
    console.log('Promise.all 失败:', error) // "失败1"
  }

  // Promise.allSettled() - 等待全部完成
  const settledResults = await Promise.allSettled(promises)
  console.log('Promise.allSettled 结果:', settledResults)
  // [
  //   { status: 'fulfilled', value: '成功1' },
  //   { status: 'rejected', reason: '失败1' },
  //   { status: 'fulfilled', value: '成功2' },
  //   { status: 'fulfilled', value: '延迟成功' }
  // ]
}

// 2. 实际应用场景对比
async function practicalScenarios() {
  console.log('=== 实际应用场景对比 ===')

  // 场景1: 用户资料页面 - 使用Promise.all()
  // 所有数据都是必需的，任一失败都应该显示错误页面
  async function loadUserProfilePage(userId) {
    try {
      const [user, profile, settings] = await Promise.all([
        fetchUser(userId), // 必需：用户基本信息
        fetchUserProfile(userId), // 必需：用户详细资料
        fetchUserSettings(userId), // 必需：用户设置
      ])

      return {
        success: true,
        data: { user, profile, settings },
      }
    } catch (error) {
      return {
        success: false,
        error: '加载用户信息失败',
        details: error.message,
      }
    }
  }

  // 场景2: 数据同步 - 使用Promise.allSettled()
  // 需要知道每个操作的结果，部分失败不影响其他操作
  async function syncUserData(userId) {
    const syncOperations = [
      syncUserPosts(userId),
      syncUserPhotos(userId),
      syncUserContacts(userId),
      syncUserSettings(userId),
    ]

    const results = await Promise.allSettled(syncOperations)

    const summary = {
      total: results.length,
      successful: 0,
      failed: 0,
      details: [],
    }

    results.forEach((result, index) => {
      const operation = ['posts', 'photos', 'contacts', 'settings'][index]

      if (result.status === 'fulfilled') {
        summary.successful++
        summary.details.push({
          operation,
          status: 'success',
          data: result.value,
        })
      } else {
        summary.failed++
        summary.details.push({
          operation,
          status: 'failed',
          error: result.reason,
        })
      }
    })

    return summary
  }
}

// 3. 错误处理策略对比
async function errorHandlingComparison() {
  console.log('=== 错误处理策略对比 ===')

  // Promise.all() 的错误处理
  async function allErrorHandling() {
    const promises = [fetchData('endpoint1'), fetchData('endpoint2'), fetchData('endpoint3')]

    try {
      const results = await Promise.all(promises)
      console.log('所有请求成功:', results)
      return { success: true, data: results }
    } catch (error) {
      console.log('有请求失败，全部中止:', error)
      // 无法知道哪些成功了，哪些失败了
      return { success: false, error: error.message }
    }
  }

  // Promise.allSettled() 的错误处理
  async function allSettledErrorHandling() {
    const promises = [fetchData('endpoint1'), fetchData('endpoint2'), fetchData('endpoint3')]

    const results = await Promise.allSettled(promises)

    const successful = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)

    const failed = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => ({
        index,
        error: result.reason,
      }))

    console.log('成功的请求:', successful)
    console.log('失败的请求:', failed)

    return {
      success: failed.length === 0,
      data: successful,
      errors: failed,
      partial: successful.length > 0 && failed.length > 0,
    }
  }
}

// 4. 性能和资源使用对比
async function performanceComparison() {
  console.log('=== 性能和资源使用对比 ===')

  // Promise.all() - 快速失败，节省资源
  async function fastFailExample() {
    const startTime = Date.now()

    const promises = [
      new Promise(resolve => setTimeout(() => resolve('快速成功'), 100)),
      new Promise((_, reject) => setTimeout(() => reject('快速失败'), 200)),
      new Promise(resolve => setTimeout(() => resolve('慢速成功'), 2000)), // 不会等待
    ]

    try {
      await Promise.all(promises)
    } catch (error) {
      const endTime = Date.now()
      console.log(`Promise.all 失败用时: ${endTime - startTime}ms`) // 约200ms
      console.log('第三个Promise可能仍在执行，但结果被忽略')
    }
  }

  // Promise.allSettled() - 等待全部完成
  async function waitAllExample() {
    const startTime = Date.now()

    const promises = [
      new Promise(resolve => setTimeout(() => resolve('快速成功'), 100)),
      new Promise((_, reject) => setTimeout(() => reject('快速失败'), 200)),
      new Promise(resolve => setTimeout(() => resolve('慢速成功'), 2000)), // 会等待
    ]

    await Promise.allSettled(promises)
    const endTime = Date.now()
    console.log(`Promise.allSettled 完成用时: ${endTime - startTime}ms`) // 约2000ms
  }
}

// 5. 实用工具函数
function createPromiseUtils() {
  // 将Promise.all()行为改为类似allSettled()
  async function allWithDetails(promises) {
    try {
      const results = await Promise.all(promises)
      return {
        success: true,
        results: results.map(value => ({ status: 'fulfilled', value })),
      }
    } catch (error) {
      // 无法获取部分成功的结果
      return {
        success: false,
        error,
        results: [],
      }
    }
  }

  // 将Promise.allSettled()行为改为类似all()
  async function allSettledWithThrow(promises) {
    const results = await Promise.allSettled(promises)

    const firstRejected = results.find(result => result.status === 'rejected')
    if (firstRejected) {
      throw firstRejected.reason
    }

    return results.map(result => result.value)
  }

  // 部分成功也算成功的版本
  async function allWithPartialSuccess(promises, minSuccessCount = 1) {
    const results = await Promise.allSettled(promises)

    const successful = results.filter(result => result.status === 'fulfilled')

    if (successful.length >= minSuccessCount) {
      return {
        success: true,
        data: successful.map(result => result.value),
        failed: results.filter(result => result.status === 'rejected').length,
      }
    } else {
      throw new Error(`至少需要${minSuccessCount}个成功，实际成功${successful.length}个`)
    }
  }

  return {
    allWithDetails,
    allSettledWithThrow,
    allWithPartialSuccess,
  }
}

// 辅助函数
function fetchData(endpoint) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve(`${endpoint} 数据`)
      } else {
        reject(new Error(`${endpoint} 请求失败`))
      }
    }, Math.random() * 1000)
  })
}

function fetchUser(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, name: `User${id}` }), 100)
  })
}

function fetchUserProfile(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ userId: id, bio: 'User bio' }), 150)
  })
}

function fetchUserSettings(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ userId: id, theme: 'dark' }), 120)
  })
}

function syncUserPosts(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2 ? resolve(`Posts synced for user ${id}`) : reject('Posts sync failed')
    }, 200)
  })
}

function syncUserPhotos(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2 ? resolve(`Photos synced for user ${id}`) : reject('Photos sync failed')
    }, 300)
  })
}

function syncUserContacts(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2
        ? resolve(`Contacts synced for user ${id}`)
        : reject('Contacts sync failed')
    }, 250)
  })
}

function syncUserSettings(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2
        ? resolve(`Settings synced for user ${id}`)
        : reject('Settings sync failed')
    }, 180)
  })
}
```

**使用场景选择指南：**

1. **Promise.all()**: 全部依赖场景，如页面初始化数据加载
2. **Promise.allSettled()**: 批量操作场景，如数据同步、批量更新

### 记忆要点总结

- Promise.all()：快速失败，返回成功值数组，适合全部依赖
- Promise.allSettled()：等待全部完成，返回状态对象数组，适合批量处理
- all()节省资源但信息有限，allSettled()消耗更多资源但信息完整
- 根据业务需求选择：是否需要部分成功的结果
- 错误处理策略不同：中止 vs 继续

## 实战应用举例

批量保存草稿时，部分失败也要告诉用户哪些失败，适合 `allSettled`。

```javascript
async function saveDrafts(drafts) {
  const results = await Promise.allSettled(drafts.map(draft => saveDraft(draft)))

  return results.map((result, index) => ({
    id: drafts[index].id,
    ok: result.status === 'fulfilled',
    reason: result.status === 'rejected' ? result.reason.message : null,
  }))
}
```

## 使用场景说明和对比

| 对比点 | `Promise.all` | `Promise.allSettled` |
| --- | --- | --- |
| 失败行为 | 任意失败立即 rejected | 等全部结束后 fulfilled |
| 返回结构 | 成功值数组 | `{ status, value/reason }` 数组 |
| 适合场景 | 所有结果缺一不可 | 需要统计每一项结果 |
| 错误处理 | 用 `catch` 处理整体失败 | 遍历结果逐项处理 |

## 易错点提示

1. `allSettled` 自身通常不会 reject，不能只写 `catch` 处理单项失败。
2. `all` 快速失败后，其他已启动任务不会自动取消。
3. 两者都不负责限流。
4. `all` 返回值顺序与输入顺序一致，不按完成时间排序。
5. `allSettled` 的 rejected 项读取 `reason`，fulfilled 项读取 `value`。

## 记忆要点总结

- `all`：全成功才成功，缺一不可。
- `allSettled`：全部结束都记录，允许失败。
- 关键差异是失败策略和返回结构。
- 批量任务多数更适合 `allSettled`。

## 延伸问题

可以继续追问：123. [中级]** Promise.all()和Promise.allSettled()的区别 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`Promise.all` 失败后其他请求会停止吗？**  
A：不会。它只是整体 Promise 先 rejected，已经启动的请求仍会继续，除非额外使用取消机制。

**Q：`allSettled` 的结果怎么判断成功失败？**  
A：看每一项的 `status`，`fulfilled` 读 `value`，`rejected` 读 `reason`。

## 辅助记忆总结

一句话记：`all` 要全员成功，`allSettled` 要全员交卷。
