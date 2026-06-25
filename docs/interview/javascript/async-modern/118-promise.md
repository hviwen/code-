# 118. [中级]** 如何创建一个Promise？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察Promise的创建方式和构造函数的使用，面试官想了解你是否掌握Promise的各种创建方法和使用场景。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- `Promise()`是错误的，Promise必须使用new关键字调用
- 除了new Promise外，还有多种其他创建方式

## 知识点系统梳理

- new Promise(executeor)
- Promise.resolve(value)
- Promise.reject(reason)
- Promise.all(iterable)
- Promise.race(iterable)
- Promise.allSettled(iterable)
- Promise.any(iterable)

### 问题本质解读 这道题考察Promise的创建方式和构造函数的使用，面试官想了解你是否掌握Promise的各种创建方法和使用场景。

### 技术错误纠正

- `Promise()`是错误的，Promise必须使用new关键字调用
- 除了new Promise外，还有多种其他创建方式

### 知识点系统梳理

**Promise创建的多种方式：**

1. **new Promise(executor)** - 基础构造方式
2. **Promise.resolve(value)** - 创建已成功的Promise
3. **Promise.reject(reason)** - 创建已失败的Promise
4. **Promise.all(iterable)** - 组合多个Promise
5. **Promise.race(iterable)** - 竞争多个Promise
6. **Promise.allSettled(iterable)** - 等待所有Promise完成
7. **Promise.any(iterable)** - 任意一个成功即可

### 实战应用举例

```javascript
// 1. 基础构造方式 - new Promise
const basicPromise = new Promise((resolve, reject) => {
  // executor函数立即执行
  const success = Math.random() > 0.5

  if (success) {
    resolve('操作成功')
  } else {
    reject(new Error('操作失败'))
  }
})

// 2. 创建已成功的Promise
const resolvedPromise = Promise.resolve('立即成功')
const resolvedWithPromise = Promise.resolve(basicPromise) // 如果参数是Promise，直接返回

// 3. 创建已失败的Promise
const rejectedPromise = Promise.reject(new Error('立即失败'))

// 4. 从回调函数转换为Promise（Promisify）
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

// 使用示例
const fs = require('fs')
const readFileAsync = promisify(fs.readFile)

// 5. 延迟Promise（常用于测试和演示）
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// 6. 条件Promise创建
function createConditionalPromise(condition, value, error) {
  if (condition) {
    return Promise.resolve(value)
  } else {
    return Promise.reject(error)
  }
}

// 7. 从异步函数创建Promise
async function createFromAsync() {
  // async函数自动返回Promise
  await delay(1000)
  return '异步操作完成'
}

// 8. 链式Promise创建
function createChainedPromise(initialValue) {
  return Promise.resolve(initialValue)
    .then(value => value * 2)
    .then(value => value + 10)
    .then(value => `结果: ${value}`)
}

// 9. 错误处理的Promise创建
function createWithErrorHandling(operation) {
  return new Promise((resolve, reject) => {
    try {
      const result = operation()
      if (result instanceof Promise) {
        result.then(resolve).catch(reject)
      } else {
        resolve(result)
      }
    } catch (error) {
      reject(error)
    }
  })
}

// 10. 超时Promise
function createTimeoutPromise(promise, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`操作超时: ${timeout}ms`))
    }, timeout)
  })

  return Promise.race([promise, timeoutPromise])
}

// 使用示例
const timeoutExample = createTimeoutPromise(
  delay(2000).then(() => '操作完成'),
  1500,
) // 1.5秒后超时
```

**创建Promise的最佳实践：**

1. **明确executor函数的同步性**：executor立即执行，不要在其中放置异步操作的逻辑
2. **正确处理异常**：在executor中使用try-catch捕获同步异常
3. **避免Promise构造函数反模式**：不要在已有Promise的基础上再包装Promise
4. **选择合适的创建方式**：根据场景选择最简洁的创建方法

**常见错误和陷阱：**

```javascript
// ❌ 错误：Promise构造函数反模式
function badExample() {
  return new Promise((resolve, reject) => {
    someAsyncFunction()
      .then(resolve) // 应该直接返回someAsyncFunction()
      .catch(reject)
  })
}

// ✅ 正确：直接返回Promise
function goodExample() {
  return someAsyncFunction()
}

// ❌ 错误：忘记处理异常
const riskyPromise = new Promise((resolve, reject) => {
  const result = JSON.parse(invalidJson) // 可能抛出异常
  resolve(result)
})

// ✅ 正确：处理异常
const safePromise = new Promise((resolve, reject) => {
  try {
    const result = JSON.parse(invalidJson)
    resolve(result)
  } catch (error) {
    reject(error)
  }
})
```

### 记忆要点总结

- 主要创建方式：new Promise(executor)
- 快捷方式：Promise.resolve()、Promise.reject()
- 组合方式：Promise.all()、Promise.race()等
- executor函数立即执行，接收resolve和reject参数
- 必须使用new关键字，不能直接调用Promise()
- 根据场景选择最合适的创建方式

## 实战应用举例

接口还没有 Promise 版本时，可以把一次性回调封装成 Promise，便于上层统一使用 `await`。

```javascript
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`图片加载失败: ${src}`))
    img.src = src
  })
}

async function previewAvatar(url) {
  const img = await loadImage(url)
  document.body.appendChild(img)
}
```

## 使用场景说明和对比

| 创建方式 | 适合场景 | 避免场景 |
| --- | --- | --- |
| `new Promise()` | 封装回调 API、定时器、一次性事件 | 已经返回 Promise 的 API |
| `Promise.resolve(value)` | 把普通值统一成 Promise | 需要真正启动异步任务 |
| `Promise.reject(error)` | 快速构造失败分支 | 需要同步抛错的普通函数 |
| 直接返回已有 Promise | fetch、axios、已有异步函数 | 为了“保险”再包一层 |

已有 Promise 就直接返回，只有从回调、事件、定时器这类非 Promise API 过渡时才手写构造器。

## 易错点提示

1. `new Promise(executor)` 的 executor 会立即同步执行。
2. `Promise()` 不能当普通函数调用，必须用 `new`。
3. 不要把已有 Promise 再包一层，这是 Promise constructor anti-pattern。
4. executor 里的同步异常会自动变成 reject。
5. executor 里的异步回调异常不会自动捕获，要在回调中手动 `reject(error)`。

## 记忆要点总结

- 手写 Promise 构造器是为了把非 Promise 异步封装成 Promise。
- executor 立即执行，`then` 回调异步执行。
- 成功调用 `resolve`，失败调用 `reject`。
- 已有 Promise 直接返回，不要重复包装。

## 延伸问题

可以继续追问：118. [中级]** 如何创建一个Promise？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：什么时候需要 `new Promise`？**  
A：当底层 API 只有回调、事件或定时器，没有 Promise 返回值时，用 `new Promise` 封装一次性结果。

**Q：为什么不建议包一层已有 Promise？**  
A：会增加无意义代码，还可能漏掉返回、异常传播和取消逻辑，直接返回已有 Promise 更简单可靠。

## 辅助记忆总结

一句话记：只有把回调世界接到 Promise 世界时，才需要手写 `new Promise`。
