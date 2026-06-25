# 129. [中级]** async函数返回什么？

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察async函数的返回值机制，面试官想了解你是否理解async函数与Promise的关系和自动包装机制。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

无明显已给答案需要纠正；已保留原始学习内容，并对明显错词和术语做了统一修正。

## 知识点系统梳理

- 返回一个promise

### 问题本质解读 这道题考察async函数的返回值机制，面试官想了解你是否理解async函数与Promise的关系和自动包装机制。

### 知识点系统梳理

**async函数返回值的处理规则：**

1. **自动Promise包装**：无论返回什么，都会被包装成Promise
2. **返回普通值**：Promise.resolve(value)
3. **返回Promise**：直接返回该Promise
4. **抛出异常**：Promise.reject(error)
5. **无返回值**：Promise.resolve(undefined)

### 实战应用举例

```javascript
// 1. 返回普通值
async function returnValue() {
  return 'hello world'
}
// 等价于：Promise.resolve('hello world')

returnValue().then(value => {
  console.log(value) // "hello world"
})

// 2. 返回Promise
async function returnPromise() {
  return Promise.resolve('from promise')
}
// 直接返回Promise，不会双重包装

returnPromise().then(value => {
  console.log(value) // "from promise"
})

// 3. 抛出异常
async function throwError() {
  throw new Error('something went wrong')
}
// 等价于：Promise.reject(new Error('something went wrong'))

throwError().catch(error => {
  console.log(error.message) // "something went wrong"
})

// 4. 无返回值
async function noReturn() {
  console.log('执行一些操作')
  // 没有return语句
}
// 等价于：Promise.resolve(undefined)

noReturn().then(value => {
  console.log(value) // undefined
})

// 5. 复杂返回值处理
async function complexReturn(type) {
  switch (type) {
    case 'object':
      return { data: 'object data', timestamp: Date.now() }
    case 'array':
      return [1, 2, 3, 4, 5]
    case 'promise':
      return fetch('/api/data').then(r => r.json())
    case 'async':
      const result = await someAsyncOperation()
      return result
    case 'error':
      throw new Error('Intentional error')
    default:
      return null
  }
}

// 使用示例
async function demonstrateReturns() {
  try {
    const obj = await complexReturn('object')
    console.log('对象:', obj)

    const arr = await complexReturn('array')
    console.log('数组:', arr)

    const promiseResult = await complexReturn('promise')
    console.log('Promise结果:', promiseResult)

    const asyncResult = await complexReturn('async')
    console.log('异步结果:', asyncResult)
  } catch (error) {
    console.log('捕获错误:', error.message)
  }
}
```

**async函数返回值的特殊情况：**

```javascript
// 1. 返回thenable对象
async function returnThenable() {
  return {
    then(resolve, reject) {
      setTimeout(() => resolve('thenable result'), 1000)
    },
  }
}

// 2. 返回另一个async函数的调用
async function innerAsync() {
  return 'inner result'
}

async function outerAsync() {
  return innerAsync() // 返回Promise
}

// 3. 条件返回
async function conditionalReturn(condition) {
  if (condition) {
    return await fetchData()
  } else {
    return 'default value'
  }
}

// 4. 在try-catch中的返回
async function returnInTryCatch() {
  try {
    const data = await riskyOperation()
    return data
  } catch (error) {
    console.error('操作失败:', error)
    return null // 返回默认值
  }
}
```

**与Promise的对比：**

```javascript
// Promise写法
function promiseFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('promise result')
    }, 1000)
  })
}

// async/await写法
async function asyncFunction() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 'async result'
}

// 两者都返回Promise
console.log(promiseFunction()) // Promise对象
console.log(asyncFunction()) // Promise对象
```

### 记忆要点总结

- async函数总是返回Promise对象
- 返回值自动被Promise.resolve()包装
- 抛出异常会变成Promise.reject()
- 无返回值等于返回Promise.resolve(undefined)
- 返回Promise不会双重包装

## 实战应用举例

接口层可以统一声明为 async，让调用方始终按 Promise 处理结果。

```javascript
async function getUserName(userId) {
  const response = await fetch(`/api/users/${userId}`)
  const user = await response.json()
  return user.name
}

const result = getUserName(1)
console.log(result instanceof Promise) // true
```

## 使用场景说明和对比

| async 函数内部行为 | 外部拿到的结果 |
| --- | --- |
| `return 1` | `Promise.resolve(1)` |
| `return Promise.resolve(1)` | 跟随该 Promise，最终 fulfilled 为 1 |
| `throw new Error()` | rejected Promise |
| 没有 return | `Promise.resolve(undefined)` |

只要函数标了 `async`，调用方就应该用 `await` 或 `.then/.catch`，不能把它当同步返回值使用。

## 易错点提示

1. async 函数永远返回 Promise，不会直接返回普通值。
2. async 函数里抛异常，外部看到的是 rejected Promise。
3. 返回已有 Promise 不会双重包装。
4. 忘记 `await asyncFn()` 会拿到 Promise 对象。
5. async 函数里没有 `await` 也仍然返回 Promise。

## 记忆要点总结

- `async` 改变函数返回类型：统一变成 Promise。
- 普通 return 会被 resolve 包装。
- throw 会变成 reject。
- 调用 async 函数要 await。

## 延伸问题

可以继续追问：129. [中级]** async函数返回什么？ 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：`async function f(){ return 1 }` 返回什么？**  
A：返回 `Promise.resolve(1)`，外部直接拿到的是 Promise。

**Q：async 函数里 throw 能被外层同步 try/catch 捕获吗？**  
A：调用处如果不 `await`，同步 try/catch 捕不到；要 `await f()` 或 `.catch()`。

## 辅助记忆总结

一句话记：async 的出口永远是 Promise，return 走 resolve，throw 走 reject。
