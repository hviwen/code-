# 121. [中级]** Promise.catch()和try-catch的区别

> 来源：`docs/javascript/js_interview_questions_part_3.md`

## 问题本质解读

这道题考察异步错误处理机制的差异，面试官想了解你是否理解同步和异步错误处理的不同方式和适用场景。

## 问题意图

面试中通常用于判断候选人是否只会背结论，还是能解释原理、边界条件和真实项目中的取舍。

## 考察范围

主要覆盖：深度分析与补充。

## 技术错误纠正

- try-catch无法直接捕获Promise内部的异步异常
- 需要区分Promise构造函数中的同步异常和异步异常

## 知识点系统梳理

- ~~promise.catch 捕获Promise中异步操作的异常和then中异常~~
- ~~包含在promise外部的try catch 可以捕获promise执行中的异常~~
- try-catch 可以**捕获同步代码中的异常**
- promise.catch 可以**捕获异步代码中的异常**

### 问题本质解读 这道题考察异步错误处理机制的差异，面试官想了解你是否理解同步和异步错误处理的不同方式和适用场景。

### 技术错误纠正

- try-catch无法直接捕获Promise内部的异步异常
- 需要区分Promise构造函数中的同步异常和异步异常

### 知识点系统梳理

**Promise.catch()特点：**

1. **异步错误处理**：专门处理Promise链中的异步错误
2. **错误传播**：捕获整个Promise链中的错误
3. **返回新Promise**：支持错误恢复和继续链式调用
4. **微任务执行**：在微任务队列中异步执行

**try-catch特点：**

1. **同步错误处理**：只能捕获同步代码中的异常
2. **立即执行**：同步捕获和处理异常
3. **无法处理异步**：对Promise内部异步异常无效
4. **阻塞执行**：异常会中断当前执行流程

### 实战应用举例

```javascript
// 1. Promise.catch() vs try-catch 基础对比
console.log('=== 基础对比 ===')

// Promise.catch() - 正确捕获异步异常
Promise.resolve('data')
  .then(value => {
    throw new Error('异步操作中的错误')
  })
  .catch(error => {
    console.log('Promise.catch捕获:', error.message) // 能够捕获
  })

// try-catch - 无法捕获Promise异步异常
try {
  Promise.resolve('data').then(value => {
    throw new Error('异步操作中的错误')
  })
} catch (error) {
  console.log('try-catch捕获:', error.message) // 不会执行
}

// 2. 不同场景的错误处理
function errorHandlingScenarios() {
  console.log('=== 错误处理场景 ===')

  // 场景1: Promise构造函数中的同步异常
  try {
    const promise = new Promise((resolve, reject) => {
      throw new Error('构造函数中的同步异常') // try-catch可以捕获
    })

    promise.catch(error => {
      console.log('Promise.catch也能捕获构造函数异常:', error.message)
    })
  } catch (error) {
    console.log('try-catch捕获构造函数异常:', error.message)
  }

  // 场景2: Promise构造函数中的异步异常
  try {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        throw new Error('构造函数中的异步异常') // try-catch无法捕获
      }, 100)
    })

    promise.catch(error => {
      console.log('Promise.catch捕获异步异常:', error.message) // 也无法捕获
    })
  } catch (error) {
    console.log('try-catch无法捕获异步异常') // 不会执行
  }

  // 正确处理异步异常的方式
  const correctPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 可能出错的异步操作
        const result = riskyAsyncOperation()
        resolve(result)
      } catch (error) {
        reject(error) // 正确的异步错误处理
      }
    }, 100)
  })

  correctPromise.catch(error => {
    console.log('正确捕获异步异常:', error.message)
  })
}

// 3. async/await中的错误处理
async function asyncAwaitErrorHandling() {
  console.log('=== async/await错误处理 ===')

  // try-catch在async函数中可以捕获await的异常
  try {
    const result = await Promise.reject(new Error('await异常'))
    console.log(result)
  } catch (error) {
    console.log('async/await中try-catch捕获:', error.message)
  }

  // 混合使用
  try {
    const data = await fetchData()
    const processed = await processData(data)
    return processed
  } catch (error) {
    console.log('处理过程中的异常:', error.message)
    throw error // 重新抛出或处理
  }
}

// 4. 错误处理的最佳实践
function errorHandlingBestPractices() {
  console.log('=== 错误处理最佳实践 ===')

  // 方式1: Promise链式错误处理
  function promiseChainApproach() {
    return fetchUserData()
      .then(validateData)
      .then(processData)
      .then(saveData)
      .catch(error => {
        console.error('Promise链中的错误:', error)
        return handleError(error)
      })
  }

  // 方式2: async/await错误处理
  async function asyncAwaitApproach() {
    try {
      const userData = await fetchUserData()
      const validData = await validateData(userData)
      const processedData = await processData(validData)
      const result = await saveData(processedData)
      return result
    } catch (error) {
      console.error('async/await中的错误:', error)
      return handleError(error)
    }
  }

  // 方式3: 混合错误处理
  async function hybridApproach() {
    try {
      const userData = await fetchUserData().catch(error => {
        console.log('获取用户数据失败，使用默认数据')
        return getDefaultUserData()
      })

      const result = await processData(userData)
      return result
    } catch (error) {
      console.error('处理过程中的错误:', error)
      throw error
    }
  }
}

// 5. 全局错误处理
function globalErrorHandling() {
  console.log('=== 全局错误处理 ===')

  // 未捕获的Promise异常
  window.addEventListener('unhandledrejection', event => {
    console.error('未处理的Promise异常:', event.reason)
    event.preventDefault() // 阻止默认的错误处理
  })

  // 未捕获的同步异常
  window.addEventListener('error', event => {
    console.error('未处理的同步异常:', event.error)
  })

  // 示例：未处理的Promise异常
  Promise.reject(new Error('未处理的异常')) // 会触发unhandledrejection事件
}

// 辅助函数
function fetchUserData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.3
      if (success) {
        resolve({ id: 1, name: 'John' })
      } else {
        reject(new Error('网络请求失败'))
      }
    }, 100)
  })
}

function validateData(data) {
  if (!data || !data.id) {
    throw new Error('数据验证失败')
  }
  return data
}

function processData(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.name) {
        resolve({ ...data, processed: true })
      } else {
        reject(new Error('数据处理失败'))
      }
    }, 50)
  })
}

function saveData(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ ...data, saved: true, timestamp: Date.now() })
    }, 50)
  })
}

function handleError(error) {
  return {
    error: true,
    message: error.message,
    timestamp: Date.now(),
  }
}

function getDefaultUserData() {
  return { id: 0, name: 'Guest', default: true }
}

function riskyAsyncOperation() {
  throw new Error('异步操作失败')
}
```

**使用场景对比：**

| 场景          | Promise.catch()       | try-catch    |
| ------------- | --------------------- | ------------ |
| Promise链错误 | ✅ 推荐               | ❌ 无效      |
| async/await   | ✅ 可用               | ✅ 推荐      |
| 同步代码异常  | ❌ 无效               | ✅ 推荐      |
| 异步回调异常  | ✅ 需配合reject       | ❌ 无效      |
| 全局错误处理  | ✅ unhandledrejection | ✅ error事件 |

### 记忆要点总结

- Promise.catch()：处理异步Promise链中的错误
- try-catch：处理同步代码和async/await中的错误
- Promise构造函数中的同步异常两者都能捕获
- Promise构造函数中的异步异常需要手动reject
- async/await让try-catch可以处理异步异常
- 选择合适的错误处理方式提高代码健壮性

## 实战应用举例

在组件加载数据时，`async/await + try/catch` 更适合同时处理请求、状态和错误提示。

```javascript
async function loadProfile(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`)
    if (!response.ok) throw new Error('用户不存在')
    return await response.json()
  } catch (error) {
    reportError(error)
    return { id: userId, name: 'Guest' }
  }
}
```

## 使用场景说明和对比

| 方式 | 能捕获什么 | 不能捕获什么 |
| --- | --- | --- |
| `try/catch` | 同步异常、`await` 到的 rejected Promise | 未 `await` 的异步 Promise |
| `.catch()` | Promise 链中前面产生的 rejected | 链外同步代码异常 |
| `window.onerror` | 未捕获同步错误 | Promise rejection |
| `unhandledrejection` | 未处理 Promise rejection | 普通同步异常 |

## 易错点提示

1. `try/catch` 包不住普通回调里的异步异常。
2. `await promise` 后的 rejected 可以被外层 `try/catch` 捕获。
3. 创建了 Promise 但没有 `await` 或 `return`，外层 `try/catch` 捕不到。
4. `catch` 里返回默认值会让后续链恢复 fulfilled。
5. 全局兜底只能记录问题，不能替代局部业务错误处理。

## 记忆要点总结

- Promise 链用 `.catch()`。
- async/await 流程用 `try/catch`。
- 未等待的 Promise 要自己处理 rejection。
- 错误被 catch 后，是否继续失败取决于是否重新 throw。

## 延伸问题

可以继续追问：121. [中级]** Promise.catch()和try-catch的区别 在复杂项目、性能优化或异常处理场景下会遇到什么问题？

## 可能类似的问题及简要参考答案

**Q：为什么 `try { setTimeout(() => { throw err }) } catch {}` 捕不到错误？**  
A：定时器回调在之后的宏任务中执行，已经离开当前 try/catch 调用栈。

**Q：`catch` 后面还能继续 `then` 吗？**  
A：能。`catch` 返回普通值时，后续 Promise 会恢复为 fulfilled。

## 辅助记忆总结

一句话记：同步和 `await` 用 try/catch，Promise 链用 catch，没等的错误谁也捞不住。
