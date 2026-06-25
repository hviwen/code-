# 124. [高级]** Promise.race()的使用场景

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Promise.race()的实际应用场景，面试官想了解你是否能在实际项目中合理运用竞速机制解决问题。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- 用于包装请求函数中的超时操作。可以在Promise.all 中包含一个异步请求的同时可以再加入一个Promise.race 包含的超时操作

### 问题本质解读 这道题考察Promise.race()的实际应用场景，面试官想了解你是否能在实际项目中合理运用竞速机制解决问题。

### 知识点系统梳理

**Promise.race()的核心特性：**

- 返回第一个settled（fulfilled或rejected）的Promise结果
- 其他Promise继续执行但结果被忽略
- 适用于需要"最快响应"的场景

### 实战应用举例

```javascript
// 1. 请求超时控制（最常见场景）
function withTimeout(promise, timeout, timeoutMessage = '请求超时') {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeout)
  })

  return Promise.race([promise, timeoutPromise])
}

// 使用示例
async function fetchWithTimeout() {
  try {
    const data = await withTimeout(
      fetch('/api/slow-endpoint').then(r => r.json()),
      5000,
      '请求超时，请稍后重试',
    )
    console.log('请求成功:', data)
  } catch (error) {
    console.log('请求失败:', error.message)
  }
}

// 2. 多服务器竞速请求
async function fastestServerRequest(endpoint) {
  const servers = [
    'https://api1.example.com',
    'https://api2.example.com',
    'https://api3.example.com',
  ]

  const requests = servers.map(server =>
    fetch(`${server}${endpoint}`).then(response => ({
      server,
      data: response.json(),
    })),
  )

  try {
    const fastest = await Promise.race(requests)
    console.log(`最快响应来自: ${fastest.server}`)
    return fastest.data
  } catch (error) {
    console.log('所有服务器请求失败')
    throw error
  }
}

// 3. 用户交互竞速
function waitForUserAction(timeout = 10000) {
  const userClick = new Promise(resolve => {
    document.addEventListener('click', () => resolve('用户点击'), { once: true })
  })

  const userKeypress = new Promise(resolve => {
    document.addEventListener('keypress', () => resolve('用户按键'), { once: true })
  })

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('用户无响应')), timeout)
  })

  return Promise.race([userClick, userKeypress, timeoutPromise])
}
```

### 记忆要点总结

- 超时控制：防止请求无限等待
- 多源竞速：选择最快的数据源
- 用户交互：等待用户操作但设置超时
- 性能优化：选择最快的计算结果

## 实战应用举例

请求超时控制是 `Promise.race` 最典型的使用场景。

```javascript
function fetchWithTimeout(url, timeout = 5000) {
  const timeoutTask = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), timeout)
  })

  return Promise.race([fetch(url), timeoutTask])
}
```

## 使用场景说明和对比

| 方法 | 关注点 | 适合场景 |
| --- | --- | --- |
| `Promise.race` | 第一个 settled | 超时控制、最快响应 |
| `Promise.any` | 第一个 fulfilled | 多源容灾，忽略失败源 |
| `Promise.all` | 全部 fulfilled | 多个关键依赖 |
| `Promise.allSettled` | 全部 settled | 批量结果统计 |

如果只是“最快成功”，优先考虑 `Promise.any`；如果失败也要立刻结束，比如超时失败，则用 `race`。

## 易错点提示

1. `race` 取第一个 settled，不是第一个成功。
2. 超时 `race` 不会自动取消原请求，fetch 取消要配合 `AbortController`。
3. 输入空数组会返回一直 pending 的 Promise。
4. 其他 Promise 仍会继续执行，只是结果被忽略。
5. 多服务器竞速要考虑失败最快的情况，否则可能提前失败。

## 记忆要点总结

- `race` 谁先 settled 就跟谁。
- 可用来做超时和竞速。
- 不会取消输掉的任务。
- 只要最快成功时更适合 `Promise.any`。

## 延伸问题

可以继续追问：124. [高级]** Promise.race()的使用场景 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`race` 和 `any` 有什么区别？**  
A：`race` 跟随第一个 settled，包括失败；`any` 跟随第一个 fulfilled，只有全部失败才 rejected。

**Q：用 `race` 做超时后，请求还会继续吗？**  
A：会。`race` 只决定外层 Promise 结果，不取消底层请求。

## 辅助记忆总结

一句话记：`race` 不问成败，只认第一个到终点。
