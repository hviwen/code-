# 125. [中级]** 如何取消一个Promise？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Promise的限制和替代方案，面试官想了解你是否理解Promise的设计原理和如何实现类似取消的效果。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- Promise本身确实无法取消，但可以通过其他方式实现类似效果

## 知识点系统梳理

无法取消promise

### 问题本质解读 这道题考察Promise的限制和替代方案，面试官想了解你是否理解Promise的设计原理和如何实现类似取消的效果。

### 技术错误纠正

- Promise本身确实无法取消，但可以通过其他方式实现类似效果

### 知识点系统梳理

**Promise无法取消的原因：**

- Promise代表一个已经开始的异步操作
- 状态一旦改变就不可逆
- 设计上追求简单性和可预测性

**替代方案：**

```javascript
// 1. 使用AbortController（现代方案）
function cancellableRequest(url) {
  const controller = new AbortController()

  const promise = fetch(url, {
    signal: controller.signal,
  }).then(response => response.json())

  return {
    promise,
    cancel: () => controller.abort(),
  }
}

// 2. 手动实现取消机制
function createCancellablePromise(executor) {
  let isCancelled = false

  const promise = new Promise((resolve, reject) => {
    executor(
      value => {
        if (!isCancelled) resolve(value)
      },
      reason => {
        if (!isCancelled) reject(reason)
      },
    )
  })

  return {
    promise,
    cancel: () => {
      isCancelled = true
    },
  }
}

// 3. 使用竞速机制模拟取消
function raceWithCancel(promise) {
  let cancelReject

  const cancelPromise = new Promise((_, reject) => {
    cancelReject = reject
  })

  const racePromise = Promise.race([promise, cancelPromise])

  return {
    promise: racePromise,
    cancel: () => cancelReject(new Error('操作已取消')),
  }
}
```

### 记忆要点总结

- Promise本身不支持取消
- 使用AbortController处理网络请求取消
- 通过标志位和竞速机制实现类似效果
- 现代API设计中考虑取消机制

## 实战应用举例

搜索框连续输入时，应取消上一轮 fetch，避免旧响应覆盖新结果。

```javascript
let currentController = null

async function search(keyword) {
  currentController?.abort()
  currentController = new AbortController()

  const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`, {
    signal: currentController.signal,
  })
  return response.json()
}
```

## 使用场景说明和对比

| 方案 | 适合场景 | 局限 |
| --- | --- | --- |
| `AbortController` | fetch、支持 signal 的现代 API | 需要底层 API 支持 |
| 忽略旧结果 | 搜索、切页、组件卸载 | 任务仍在执行，只是不更新 UI |
| `Promise.race` 模拟取消 | 给外层调用方一个取消结果 | 不取消真实底层任务 |
| 自定义任务取消 | WebSocket、长轮询、复杂任务 | 需要自己定义资源释放 |

## 易错点提示

1. Promise 标准本身没有取消状态。
2. 取消外层 Promise 不等于取消底层请求或定时器。
3. fetch 取消要把 `signal` 传进去。
4. 组件卸载时要取消请求或忽略旧结果，避免更新已卸载状态。
5. 取消通常也要释放事件监听、定时器等资源。

## 记忆要点总结

- Promise 不能被真正取消。
- 能取消的是底层任务或后续处理。
- fetch 用 `AbortController`。
- UI 场景常用“取消请求 + 忽略旧结果”双保险。

## 延伸问题

可以继续追问：125. [中级]** 如何取消一个Promise？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：Promise 为什么没有 cancelled 状态？**  
A：标准状态只有 pending、fulfilled、rejected；取消属于具体任务资源管理，不属于 Promise 结果模型。

**Q：组件卸载时如何避免异步回调更新状态？**  
A：优先取消底层请求；不能取消时，用标志位或请求序号忽略旧结果。

## 辅助记忆总结

一句话记：取消的不是 Promise 本身，而是底层任务或结果使用。
