# 117. [初级]** Promise有哪几种状态？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Promise状态机制的理解，面试官想了解你是否掌握Promise的核心工作原理和状态转换规则。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- fulfilled应该是"已成功"状态，不是"执行成功的原因"
- rejected应该是"已拒绝"状态，不是"执行拒绝的理由"

## 知识点系统梳理

- pending 等待
- fulfilled ~~执行成功的原因~~ 已成功
- rejected ~~执行拒绝的理由~~ 已拒绝

### 问题本质解读 这道题考察Promise状态机制的理解，面试官想了解你是否掌握Promise的核心工作原理和状态转换规则。

### 技术错误纠正

- fulfilled应该是"已成功"状态，不是"执行成功的原因"
- rejected应该是"已拒绝"状态，不是"执行拒绝的理由"

### 知识点系统梳理

**Promise的三种状态：**

1. **pending（等待中）**：初始状态，既不是成功，也不是失败状态
2. **fulfilled（已成功）**：操作成功完成
3. **rejected（已拒绝）**：操作失败

**状态转换规则：**

- pending → fulfilled：通过调用resolve()
- pending → rejected：通过调用reject()或抛出异常
- 状态一旦改变就不可逆，不能从fulfilled或rejected再变回pending
- fulfilled和rejected之间不能相互转换

### 实战应用举例

```javascript
// 演示Promise状态变化
function createPromiseDemo() {
  console.log('1. 创建Promise，初始状态为pending')

  const promise = new Promise((resolve, reject) => {
    console.log('2. Promise执行器立即执行')

    setTimeout(() => {
      const random = Math.random()
      if (random > 0.5) {
        console.log('3. 调用resolve，状态变为fulfilled')
        resolve(`成功结果: ${random}`)
      } else {
        console.log('3. 调用reject，状态变为rejected')
        reject(new Error(`失败原因: ${random}`))
      }
    }, 1000)
  })

  // 检查Promise状态的方法（仅用于演示，实际开发中不推荐）
  console.log('Promise状态:', getPromiseState(promise))

  return promise
}

// 辅助函数：获取Promise状态（仅用于演示）
function getPromiseState(promise) {
  const t = {}
  return Promise.race([promise, t]).then(
    v => (v === t ? 'pending' : 'fulfilled'),
    () => 'rejected',
  )
}

// 状态转换示例
const demo1 = new Promise((resolve, reject) => {
  // 状态：pending
  console.log('当前状态: pending')

  setTimeout(() => {
    resolve('成功')
    // 状态：fulfilled
    // 下面的调用将被忽略，因为状态已经确定
    reject('失败') // 无效
    resolve('再次成功') // 无效
  }, 1000)
})

// 错误处理导致状态变为rejected
const demo2 = new Promise((resolve, reject) => {
  try {
    // 模拟可能出错的操作
    const result = JSON.parse('invalid json')
    resolve(result)
  } catch (error) {
    reject(error) // 状态变为rejected
  }
})

// 使用Promise.resolve和Promise.reject创建特定状态的Promise
const fulfilledPromise = Promise.resolve('直接成功')
const rejectedPromise = Promise.reject(new Error('直接失败'))

// 状态检测和处理
demo1
  .then(value => {
    console.log('Promise已fulfilled，值为:', value)
  })
  .catch(error => {
    console.log('Promise已rejected，错误为:', error)
  })
  .finally(() => {
    console.log('Promise已settled（已敲定，不管是fulfilled还是rejected）')
  })
```

**状态相关的重要概念：**

1. **settled（已敲定）**：Promise已经fulfilled或rejected，不再是pending
2. **thenable**：具有then方法的对象，可以被Promise.resolve()处理
3. **状态检测**：无法直接同步检测Promise状态，需要通过then/catch异步处理

**常见面试追问：**

```javascript
// Q: 以下代码的执行结果是什么？
const p = new Promise((resolve, reject) => {
  resolve('first')
  resolve('second') // 无效
  reject('error') // 无效
})

p.then(value => console.log(value)) // 输出: "first"

// Q: Promise状态改变是同步还是异步的？
const p2 = new Promise(resolve => {
  console.log('1')
  resolve('2')
  console.log('3')
})
console.log('4')
p2.then(value => console.log(value))
console.log('5')
// 输出顺序: 1, 3, 4, 5, 2
```

### 记忆要点总结

- 三种状态：pending（等待）→ fulfilled（成功）/rejected（失败）
- 状态转换不可逆，一次性的
- settled = fulfilled + rejected（已敲定状态）
- 状态改变是同步的，但then/catch回调是异步的
- 多次调用resolve/reject只有第一次有效

## 实战应用举例

原文已包含代码示例，见「知识点系统梳理」中的示例代码。

## 使用场景说明和对比

| 状态 | 含义 | 触发方式 | 后续表现 |
| --- | --- | --- | --- |
| pending | 等待中 | 初始状态 | 等待异步结果 |
| fulfilled | 已成功 | `resolve(value)` 或返回成功值 | 执行成功回调 |
| rejected | 已拒绝 | `reject(reason)` 或抛异常 | 执行失败回调 |
| settled | 已敲定 | fulfilled 或 rejected 的统称 | 状态不再变化 |

项目里通常不需要“同步读取 Promise 状态”，而是通过 `then/catch/finally` 安排状态变化后的动作。UI 状态里的 `loading/error/data` 是业务状态，不等同于 Promise 内部状态。

## 易错点提示

1. `resolve` 或 `reject` 只有第一次调用有效，后续调用会被忽略。
2. Promise 状态改变本身可以同步发生，但 `then` 注册的回调异步执行。
3. `fulfilled` 的结果叫 value，`rejected` 的结果叫 reason，不要把状态和结果混成一回事。
4. `finally` 不接收成功值或失败原因，通常用于释放 loading。
5. `Promise.resolve(thenable)` 会吸收 thenable 的状态，不一定立刻 fulfilled。

## 记忆要点总结

- Promise 只有三种状态：pending、fulfilled、rejected。
- 状态转换只发生一次。
- settled = fulfilled 或 rejected。
- 状态结果通过回调异步传递，不直接同步读取。

## 延伸问题

1. `resolve(Promise.reject(err))` 后外层 Promise 是什么状态？
2. 为什么 `then` 回调总是异步执行？
3. `finally` 返回 Promise 时会如何影响后续链？

## 可能类似的问题及简要参考答案

**Q：Promise 状态能从 fulfilled 变成 rejected 吗？**  
A：不能。Promise 一旦 settled，状态和值就固定了，后续 `resolve/reject` 都无效。

**Q：pending 状态会不会一直存在？**  
A：会。如果异步操作从不调用 `resolve/reject`，Promise 会一直 pending，相关回调也不会执行。

## 辅助记忆总结

一句话记：Promise 状态只能从“等结果”走向“成功”或“失败”，走一次就定了。
