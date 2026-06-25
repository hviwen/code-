# 029. [中级] 如何避免回调地狱（callback hell）？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

回调地狱不是“用了回调”本身，而是多层异步回调嵌套导致流程、错误处理和数据传递都变得难读难改。

一句话答法：避免回调地狱要把嵌套拉平，用 Promise 链、async/await、函数拆分和并行组合管理异步流程。

## 问题意图

这道题想确认你是否能从旧回调代码迁移到现代异步写法，并知道串行、并行、错误处理和取消控制的差异。

## 考察范围

- 回调地狱的成因：嵌套、错误分散、依赖传递。
- Promise 链式调用。
- async/await。
- `Promise.all`、`Promise.allSettled` 等并行组合。
- 函数拆分、提前返回、统一错误处理。
- 旧回调 API 的 Promise 包装。

## 技术错误纠正

原始内容“Promise 通过 `.then` 链式调用，async/await”方向正确，但需要补充：不是所有异步都应该串行 `await`，互不依赖的任务应该并行；错误处理也要统一收口。

## 知识点系统梳理

回调地狱典型问题：

```js
getUser(id, user => {
  getOrders(user.id, orders => {
    getDetail(orders[0].id, detail => {
      render(user, orders, detail)
    })
  })
})
```

改造目标：

| 问题 | 改造方式 |
| --- | --- |
| 嵌套太深 | Promise 链或 async/await 拉平 |
| 错误处理分散 | `.catch` 或 `try/catch` 统一处理 |
| 无关请求串行 | `Promise.all` 并行 |
| 函数过长 | 拆成语义明确的小函数 |
| 旧 API 只支持回调 | 包装成 Promise |

## 实战应用举例

### 示例 1：用 async/await 拉平串行依赖

```js
async function loadProfile(userId) {
  try {
    const user = await fetchUser(userId)
    const orders = await fetchOrders(user.id)
    const detail = await fetchOrderDetail(orders[0].id)

    return { user, orders, detail }
  } catch (error) {
    console.error('load profile failed:', error)
    throw error
  }
}
```

这个例子适合后一步依赖前一步结果的流程。

### 示例 2：互不依赖的任务并行

```js
async function loadDashboard(userId) {
  const user = await fetchUser(userId)

  const [orders, messages, settings] = await Promise.all([
    fetchOrders(user.id),
    fetchMessages(user.id),
    fetchSettings(user.id),
  ])

  return { user, orders, messages, settings }
}
```

这个例子证明：避免回调地狱不只是换语法，还要识别哪些任务可以并行。

## 使用场景说明和对比

| 方案 | 适合场景 | 注意点 |
| --- | --- | --- |
| Promise 链 | 旧代码逐步迁移 | 链里要 return Promise |
| async/await | 主流业务流程 | 注意并行任务不要写成无意义串行 |
| `Promise.all` | 全部成功才继续 | 任一失败会 reject |
| `Promise.allSettled` | 希望拿到全部结果 | 需要手动判断成功失败 |
| 回调 | 简单事件、数组方法 | 不适合多层异步流程 |

## 易错点提示

- `.then` 里忘记 `return` 会断链。
- `await` 写多了可能把本来能并行的请求变成串行。
- `try/catch` 只能捕获 `await` 到的 Promise reject，不能捕获未等待的异步错误。
- Promise 包装旧回调 API 时，要处理 error-first callback。
- 避免回调地狱不等于消灭回调，事件监听仍然天然使用回调。

## 记忆要点总结

- 回调地狱的本质是嵌套和错误处理失控。
- 串行依赖用 async/await 拉平。
- 并行任务用 Promise 组合。
- 错误处理要统一收口。
- 旧回调 API 可先 Promise 化再组合。

## 延伸问题

1. `.then` 链里为什么必须 return？
2. async/await 如何处理并行请求？
3. `Promise.all` 和 `Promise.allSettled` 有什么区别？
4. 如何把 Node 风格回调包装成 Promise？
5. async/await 是否完全替代回调？

## 可能类似的问题及简要参考答案

**Q：回调地狱的根本问题是什么？**  
A：异步流程嵌套太深，导致数据传递、错误处理和维护成本失控。

**Q：async/await 为什么更易读？**  
A：它把 Promise 写成接近同步流程的样子，配合 `try/catch` 统一处理错误。

**Q：所有 await 都应该顺序写吗？**  
A：不是。没有依赖关系的异步任务应该用 `Promise.all` 并行。

## 辅助记忆总结

记成一句话：回调地狱要“拉平流程、收口错误、并行能并行”。
