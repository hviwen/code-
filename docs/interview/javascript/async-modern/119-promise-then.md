# 119. [中级]** Promise.then()方法的用法

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Promise.then()方法的核心机制，面试官想了解你是否理解then方法的参数、返回值和链式调用原理。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- then()方法的参数不是"执行器方法"，而是回调函数
- then()接收两个参数：onFulfilled和onRejected，不是resolve和reject
- then()返回新的Promise，不是"promise.thenable"

## 知识点系统梳理

- pormise.then() 参数是一个~~执行器方法~~ 回调函数，接收onFulfilled和onRejected两个回调函数，返回一个~~promise.thenable~~ 新的promise。
- ~~通常为：(resolve,reject) =>{ 执行成功的resolve 或者失败的reject }~~
- 当执行器函数只有一个参数时，默认为：resolve

### 问题本质解读 这道题考察Promise.then()方法的核心机制，面试官想了解你是否理解then方法的参数、返回值和链式调用原理。

### 技术错误纠正

- then()方法的参数不是"执行器方法"，而是回调函数
- then()接收两个参数：onFulfilled和onRejected，不是resolve和reject
- then()返回新的Promise，不是"promise.thenable"

### 知识点系统梳理

**Promise.then()的完整语法：**

```javascript
promise.then(onFulfilled, onRejected)
```

**参数说明：**

1. **onFulfilled**：Promise成功时的回调函数，接收resolve的值
2. **onRejected**：Promise失败时的回调函数，接收reject的原因（可选）

**返回值：**

- 总是返回一个新的Promise对象，支持链式调用

### 实战应用举例

```javascript
// 1. 基础用法
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('初始数据')
  }, 1000)
})

// 只处理成功情况
promise.then(value => {
  console.log('成功:', value) // "成功: 初始数据"
  return value.toUpperCase()
})

// 同时处理成功和失败
promise.then(
  value => {
    console.log('成功:', value)
    return value.toUpperCase()
  },
  error => {
    console.log('失败:', error)
    return '默认值'
  },
)

// 2. 链式调用详解
Promise.resolve(10)
  .then(value => {
    console.log('第一步:', value) // 10
    return value * 2 // 返回普通值
  })
  .then(value => {
    console.log('第二步:', value) // 20
    return Promise.resolve(value + 5) // 返回Promise
  })
  .then(value => {
    console.log('第三步:', value) // 25
    throw new Error('故意抛出错误') // 抛出异常
  })
  .then(
    value => {
      console.log('不会执行') // 不会执行
    },
    error => {
      console.log('捕获错误:', error.message) // "故意抛出错误"
      return '恢复正常'
    },
  )
  .then(value => {
    console.log('最后一步:', value) // "恢复正常"
  })

// 3. then方法的返回值处理
function demonstrateThenReturns() {
  // 返回普通值
  Promise.resolve('hello')
    .then(value => {
      return value + ' world' // 新Promise resolve为 "hello world"
    })
    .then(value => console.log(value)) // "hello world"

  // 返回Promise
  Promise.resolve('start')
    .then(value => {
      return new Promise(resolve => {
        setTimeout(() => resolve(value + ' delayed'), 1000)
      })
    })
    .then(value => console.log(value)) // 1秒后输出 "start delayed"

  // 不返回任何值（undefined）
  Promise.resolve('data')
    .then(value => {
      console.log(value) // "data"
      // 没有return语句
    })
    .then(value => console.log(value)) // undefined

  // 抛出异常
  Promise.resolve('normal')
    .then(value => {
      throw new Error('something wrong')
    })
    .then(
      value => console.log('不会执行'),
      error => console.log('错误:', error.message),
    )
}

// 4. 错误处理的传播
Promise.reject('初始错误')
  .then(
    value => console.log('成功:', value),
    error => {
      console.log('处理错误:', error) // "处理错误: 初始错误"
      return '已修复' // 返回正常值，后续then会成功
    },
  )
  .then(value => {
    console.log('恢复正常:', value) // "恢复正常: 已修复"
  })

// 5. then的异步特性
console.log('1')
Promise.resolve('2').then(value => console.log(value))
console.log('3')
// 输出顺序: 1, 3, 2

// 6. 复杂的链式调用场景
function fetchUserProfile(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return response.json()
    })
    .then(user => {
      // 获取用户详细信息
      return Promise.all([
        user,
        fetch(`/api/users/${user.id}/profile`).then(r => r.json()),
        fetch(`/api/users/${user.id}/settings`).then(r => r.json()),
      ])
    })
    .then(([user, profile, settings]) => {
      return {
        ...user,
        profile,
        settings,
        lastUpdated: new Date().toISOString(),
      }
    })
    .catch(error => {
      console.error('获取用户信息失败:', error)
      return null // 返回默认值
    })
}
```

**then方法的重要特性：**

1. **异步执行**：then的回调总是异步执行，即使Promise已经settled
2. **值穿透**：如果onFulfilled不是函数，值会穿透到下一个then
3. **错误传播**：如果onRejected不是函数，错误会传播到下一个catch
4. **新Promise返回**：每次调用then都返回新的Promise对象

**常见使用模式：**

```javascript
// 值穿透示例
Promise.resolve('hello')
  .then(null) // 值穿透
  .then(value => console.log(value)) // "hello"

// 错误传播示例
Promise.reject('error')
  .then(value => console.log(value)) // 跳过
  .then(value => console.log(value)) // 跳过
  .catch(error => console.log('捕获:', error)) // "捕获: error"

// 条件处理
function processData(data) {
  return Promise.resolve(data)
    .then(data => {
      if (!data) {
        throw new Error('数据为空')
      }
      return data
    })
    .then(data => {
      // 数据处理逻辑
      return data.map(item => ({ ...item, processed: true }))
    })
}
```

### 记忆要点总结

- then(onFulfilled, onRejected)：两个回调函数参数
- 返回新Promise，支持链式调用
- onFulfilled接收resolve值，onRejected接收reject原因
- 回调函数的返回值决定新Promise的状态
- 异步执行，支持值穿透和错误传播
- 是Promise链式调用的核心方法

## 实战应用举例

把接口结果转换成页面需要的结构时，`then` 适合做轻量数据管道。

```javascript
function loadUserCard(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json()
    })
    .then(user => ({
      title: user.name || '未命名用户',
      subtitle: user.email || '暂无邮箱',
      disabled: user.status !== 'active',
    }))
}
```

## 使用场景说明和对比

| 写法 | 适合场景 | 注意点 |
| --- | --- | --- |
| `then(onFulfilled)` | 成功值转换、串联异步步骤 | 必须返回下一步需要的值 |
| `then(onFulfilled, onRejected)` | 就近处理当前 Promise 失败 | 错误处理分散，少用 |
| `.catch(onRejected)` | 统一处理链路错误 | catch 返回普通值会恢复成功 |
| `async/await` | 分支多、流程长 | 小心把并行任务写成串行 |

## 易错点提示

1. `then` 总是返回一个新的 Promise。
2. `then` 回调即使在 Promise 已完成后注册，也会异步执行。
3. `then` 里忘记 `return`，下一个 `then` 拿到的是 `undefined`。
4. `onFulfilled` 不是函数时会发生值穿透。
5. `then` 里抛异常会让新 Promise 变成 rejected。

## 记忆要点总结

- `then` 是 Promise 链的核心。
- 第一个参数处理成功，第二个参数处理失败。
- 返回普通值、Promise、抛异常会决定新 Promise 的状态。
- 错误统一处理优先用链尾 `catch`。

## 延伸问题

可以继续追问：119. [中级]** Promise.then()方法的用法 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`then` 为什么能链式调用？**  
A：因为每次调用 `then` 都会返回一个新的 Promise。

**Q：`then` 第二个参数和 `catch` 怎么选？**  
A：局部只处理当前失败可用第二个参数；链路统一错误处理更推荐 `catch`。

## 辅助记忆总结

一句话记：`then` 接成功值，`return` 交给下一步，`throw` 交给错误链。
