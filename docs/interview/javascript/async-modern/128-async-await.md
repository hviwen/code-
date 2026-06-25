# 128. [初级]** async/await的基本用法

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察async/await的基础语法和使用方式，面试官想了解你是否掌握现代JavaScript异步编程的核心语法。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：async/await（8道）。

## 技术错误纠正

- 函数缺少函数名
- 可以直接await fetch的结果，不需要额外的then
- 应该有返回值或错误处理

## 知识点系统梳理

```javascript
try {
  async function getUserInfo() {
    const response = await fetch('/get/github/user=pan')

    if (!response.ok) {
      throw new Error('请求失败')
    }

    const data = await response.json()
    return data
  }
} catch (error) {
  console.log(error)
}
```

### 问题本质解读 这道题考察async/await的基础语法和使用方式，面试官想了解你是否掌握现代JavaScript异步编程的核心语法。

### 技术错误纠正

- 函数缺少函数名
- 可以直接await fetch的结果，不需要额外的then
- 应该有返回值或错误处理

### 知识点系统梳理

**async/await基础语法：**

1. **async函数**：声明异步函数，自动返回Promise
2. **await表达式**：等待Promise完成，获取resolved值
3. **错误处理**：使用try-catch捕获异步异常
4. **返回值**：async函数总是返回Promise

### 实战应用举例

```javascript
// 1. 基础用法示例
async function fetchUserData() {
  try {
    // await等待Promise完成
    const response = await fetch('/api/user/123')

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // 解析JSON数据
    const userData = await response.json()

    console.log('用户数据:', userData)
    return userData
  } catch (error) {
    console.error('获取用户数据失败:', error)
    throw error // 重新抛出错误
  }
}

// 2. 多个异步操作
async function getUserProfile(userId) {
  try {
    // 串行执行
    const user = await fetchUser(userId)
    const posts = await fetchUserPosts(user.id)
    const friends = await fetchUserFriends(user.id)

    return {
      user,
      posts,
      friends,
      loadTime: new Date().toISOString(),
    }
  } catch (error) {
    console.error('获取用户资料失败:', error)
    return null
  }
}

// 3. 并行执行多个异步操作
async function getUserProfileParallel(userId) {
  try {
    // 并行执行，提高性能
    const [user, posts, friends] = await Promise.all([
      fetchUser(userId),
      fetchUserPosts(userId),
      fetchUserFriends(userId),
    ])

    return { user, posts, friends }
  } catch (error) {
    console.error('获取用户资料失败:', error)
    return null
  }
}

// 4. 条件异步操作
async function processUserData(userId, includeDetails = false) {
  const user = await fetchUser(userId)

  if (includeDetails) {
    // 条件性执行额外的异步操作
    user.details = await fetchUserDetails(user.id)
    user.preferences = await fetchUserPreferences(user.id)
  }

  return user
}

// 5. 异步迭代
async function processMultipleUsers(userIds) {
  const results = []

  for (const userId of userIds) {
    try {
      const user = await fetchUser(userId)
      results.push(user)
    } catch (error) {
      console.error(`处理用户${userId}失败:`, error)
      results.push(null)
    }
  }

  return results
}

// 6. 使用async/await的工具函数
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryOperation(operation, maxRetries = 3, delayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error // 最后一次重试失败，抛出错误
      }

      console.log(`操作失败，${delayMs}ms后重试 (${i + 1}/${maxRetries})`)
      await delay(delayMs)
    }
  }
}

// 7. 复杂的异步流程控制
async function complexAsyncFlow() {
  try {
    // 步骤1：初始化
    console.log('开始复杂异步流程')
    const config = await loadConfiguration()

    // 步骤2：验证配置
    if (!validateConfig(config)) {
      throw new Error('配置验证失败')
    }

    // 步骤3：并行执行多个初始化任务
    const [database, cache, logger] = await Promise.all([
      initializeDatabase(config.db),
      initializeCache(config.cache),
      initializeLogger(config.logging),
    ])

    // 步骤4：依次执行依赖任务
    const services = await initializeServices(database, cache)
    const routes = await setupRoutes(services)
    const server = await startServer(routes, config.port)

    console.log('复杂异步流程完成')
    return {
      server,
      services,
      config,
    }
  } catch (error) {
    console.error('复杂异步流程失败:', error)
    throw error
  }
}

// 辅助函数
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) throw new Error('用户不存在')
  return response.json()
}

async function fetchUserPosts(id) {
  const response = await fetch(`/api/users/${id}/posts`)
  return response.json()
}

async function fetchUserFriends(id) {
  const response = await fetch(`/api/users/${id}/friends`)
  return response.json()
}
```

**async/await的核心特性：**

1. **同步风格**：以同步代码的方式编写异步逻辑
2. **错误处理**：使用try-catch统一处理异步错误
3. **自动Promise包装**：async函数自动返回Promise
4. **顺序执行**：await会暂停函数执行，等待Promise完成

**常见使用模式：**

```javascript
// 模式1：基础异步函数
async function basicAsync() {
  const result = await someAsyncOperation()
  return result
}

// 模式2：错误处理
async function withErrorHandling() {
  try {
    const result = await riskyOperation()
    return result
  } catch (error) {
    console.error('操作失败:', error)
    return null
  }
}

// 模式3：并行执行
async function parallelExecution() {
  const [result1, result2] = await Promise.all([operation1(), operation2()])
  return { result1, result2 }
}

// 模式4：条件异步
async function conditionalAsync(condition) {
  const baseData = await getBaseData()

  if (condition) {
    baseData.extra = await getExtraData()
  }

  return baseData
}
```

### 记忆要点总结

- async声明异步函数，await等待Promise完成
- 以同步风格编写异步代码，提高可读性
- 使用try-catch处理异步错误
- async函数自动返回Promise
- 合理使用并行和串行执行优化性能

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

| 写法 | 适合场景 | 注意点 |
| --- | --- | --- |
| async/await | 流程型异步代码、try/catch 错误处理 | 容易误把并行写成串行 |
| Promise 链 | 数据管道、简单组合 | 链过长可读性下降 |
| `Promise.all` | 多个互不依赖任务并行 | 一个失败整体失败 |
| `Promise.allSettled` | 批量任务允许部分失败 | 需要逐项判断结果 |

接口请求、表单提交、路由进入前校验都适合 async/await。两个请求互不依赖时，应先创建 Promise 再一起 await，而不是一个 await 完再发另一个。

## 易错点提示

1. `async` 函数总是返回 Promise，哪怕 `return 1` 也会包装成 `Promise.resolve(1)`。
2. `await` 后面的代码会进入微任务，不是继续同步执行。
3. `try/catch` 只能捕获当前 async 函数内被 await 的拒绝；未 await 的 Promise 需要自己处理。
4. 循环里逐个 `await` 会串行执行，批量并行要用 `Promise.all`。
5. 顶层 `await` 只在 ES Module 等支持环境中可用。

## 记忆要点总结

- `async` 把函数返回值包装成 Promise。
- `await` 等待 Promise，并把后续逻辑排到微任务。
- 错误处理用 `try/catch`，但别漏掉未 await 的 Promise。
- 串行用多个 await，并行用 `Promise.all`。

## 延伸问题

1. `await 1` 会发生什么？
2. 为什么 `async` 函数里的异常会变成 rejected Promise？
3. 如何在 async/await 中实现请求并行和错误兜底？

## 可能类似的问题及简要参考答案

**Q：async/await 和 Promise 是什么关系？**  
A：async/await 是基于 Promise 的语法糖，底层仍通过 Promise 表示异步结果和错误。

**Q：`await` 会阻塞线程吗？**  
A：不会阻塞 JS 线程。它暂停当前 async 函数的后续执行，把后续逻辑放到微任务中，外层代码继续运行。

## 辅助记忆总结

一句话记：`async` 保证返回 Promise，`await` 把后半段拆到微任务里继续跑。
