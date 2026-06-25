# 028. [初级] 什么是回调函数？

> 来源：`docs/javascript/js_interview_questions_part_1.md`

## 问题本质解读

回调函数就是作为参数传给另一个函数，并在特定时机由对方调用的函数。它可以是同步的，也可以是异步的；“回调”不等于“异步”。

一句话答法：把函数交给别人，让别人合适的时候调用它，这个函数就是回调。

## 问题意图

这道题想确认你是否理解 JavaScript 函数一等公民、高阶函数、事件处理和异步编程的基础。

## 考察范围

- 函数作为值传递。
- 同步回调和异步回调。
- 数组方法、事件监听、定时器、网络请求中的回调。
- 回调的错误处理约定。
- 回调地狱以及 Promise/async-await 的演进。

## 技术错误纠正

原始定义“执行完上一个函数时执行传入函数”不够准确。回调不一定是在“上一个函数执行完”后调用，也可能在遍历每个元素时同步调用，或在事件发生、定时器到期、请求完成后异步调用。

## 知识点系统梳理

回调的三个角色：

1. 调用者：传入函数。
2. 接收者：接收并保存或立即使用函数。
3. 触发时机：由接收者决定什么时候调用。

同步回调：

```js
const doubled = [1, 2, 3].map(function callback(item) {
  return item * 2
})
```

异步回调：

```js
setTimeout(function callback() {
  console.log('later')
}, 1000)
```

## 实战应用举例

### 示例 1：同步回调用于数据转换

```js
function filterItems(items, predicate) {
  const result = []

  for (const item of items) {
    if (predicate(item)) result.push(item)
  }

  return result
}

const activeUsers = filterItems(users, user => user.active)
```

这个例子证明：回调可以把“判断规则”交给调用方，公共函数只负责流程。

### 示例 2：异步回调用于请求结果

```js
function fetchUser(id, onSuccess, onError) {
  setTimeout(() => {
    if (!id) {
      onError(new Error('id required'))
      return
    }

    onSuccess({ id, name: 'Ada' })
  }, 300)
}

fetchUser(
  1,
  user => console.log(user.name),
  error => console.error(error.message),
)
```

这个例子证明：异步回调要设计成功和失败路径，否则错误容易丢失。

## 使用场景说明和对比

| 场景 | 回调是否合适 | 原因 |
| --- | --- | --- |
| 数组遍历、排序、过滤 | 适合 | 同步回调简洁 |
| DOM 事件 | 适合 | 事件发生时调用 |
| Node 风格异步 API | 常见 | `(err, data)` 约定成熟 |
| 多步串行异步 | 不推荐深嵌套 | Promise/async-await 更清晰 |
| 需要取消、超时、重试 | 谨慎 | 回调本身不提供控制能力 |

## 易错点提示

- 回调不等于异步，`map/filter/forEach` 的回调是同步执行的。
- 回调函数传的是引用，不要写成 `fn(callback())` 误把执行结果传进去。
- 异步回调里的 `throw` 不会被外层同步 `try/catch` 捕获。
- 多层回调会造成可读性和错误处理问题。
- 事件监听回调需要在不用时移除，避免引用长期存在。

## 记忆要点总结

- 回调 = 被传入、稍后或立即被调用的函数。
- 同步回调用于抽象规则，异步回调用于处理未来结果。
- 回调是 Promise 和 async/await 的基础。
- 复杂异步不要深嵌套回调。
- 错误处理和生命周期清理要明确。

## 延伸问题

1. 同步回调和异步回调有什么区别？
2. 为什么回调地狱难维护？
3. Node.js 的 error-first callback 是什么？
4. 异步回调里的异常为什么外层捕获不到？
5. Promise 如何改善回调的错误处理？

## 可能类似的问题及简要参考答案

**Q：回调函数一定是异步的吗？**  
A：不是。数组方法里的回调通常是同步的，事件和定时器回调通常是异步触发的。

**Q：为什么要使用回调？**  
A：把变化的逻辑作为函数传入，让通用流程可以复用。

**Q：回调的问题是什么？**  
A：多层嵌套会降低可读性，错误处理分散，取消和组合能力弱。

## 辅助记忆总结

记成一句话：回调就是“把函数交出去，让别人回头调用”。
